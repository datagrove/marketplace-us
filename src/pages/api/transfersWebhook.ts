import Stripe from "stripe";
import type { APIRoute } from "astro";
import supabase from "@lib/supabaseClientServiceRole";
// import  {DatabaseSubmit} from '../lib/OrderSubmit'

const stripe = new Stripe(import.meta.env.PUBLIC_VITE_STRIPE_PRIVATE_KEY, {
    apiVersion: "2023-10-16",
});

const endpointSecret = import.meta.env.PUBLIC_VITE_STRIPE_ENDPOINT_SECRET;

export const POST: APIRoute = async function ({ request }: any) {
    // console.log("Post triggered");
    // console.log("Request Header" + request.headers.get("stripe-signature"));
    // const requestbody = await request.body.getReader().read();
    // console.log("Body: " + JSON.stringify(requestbody))

    const buffers = [];
    for await (const chunk of request.body) {
        buffers.push(chunk);
    }

    let body: string = "";

    buffers.forEach((buffer) => {
        body += new TextDecoder().decode(buffer);
    });

    // const body = new TextDecoder().decode(buffers[0]);

    const sig = request.headers.get("stripe-signature");

    let event;

    try {
        event = await stripe.webhooks.constructEventAsync(
            body,
            sig,
            endpointSecret
        );
        console.log(`Event Type: ${event.type}`);
    } catch (err: any) {
        console.log("Error Type: " + err.type);
    }

    if (event === undefined) {
        console.log("Event is undefined");
    } else {
        const data = event.data.object as Stripe.Checkout.Session;

        switch (event.type) {
            case "checkout.session.completed": {
                // console.log("Session Completed", data);
                if (data.payment_status === "paid") {
                    try {
                        await supabase
                            .from("orders")
                            .update({
                                order_status: true,
                            })
                            .eq("order_number", data.metadata!.orderId);

                        if (data.payment_intent !== null) {
                            //Get Charge Id
                            const charge = (
                                await stripe.paymentIntents.retrieve(
                                    data.payment_intent as string
                                )
                            ).latest_charge as string;

                            const transfers = await getOrderDetails(
                                data.metadata!.orderId
                            );

                            if (transfers) {
                                const baseFee = 0.3 / transfers.length;

                                transfers.map(async (transfer) => {
                                    if (
                                        transfer.price &&
                                        transfer.connected_account &&
                                        charge &&
                                        transfer.contribution
                                    ) {
                                        createTransfer(
                                            //set the transfer amount as 80% of the price*quantity
                                            (transfer.price *
                                                transfer.quantity *
                                                0.96 -
                                                baseFee) *
                                                (1 -
                                                    transfer.contribution /
                                                        100),
                                            transfer.connected_account,
                                            transfer.order_number,
                                            charge
                                        );
                                    }
                                });
                            }
                        }
                    } catch (err) {
                        console.log(err);
                    }
                    break;
                }
            }
            case "checkout.session.async_payment_succeeded": {
                try {
                    await supabase
                        .from("orders")
                        .update({
                            order_status: true,
                        })
                        .eq("order_number", data.metadata!.orderId);

                    //Get Charge Id
                    const charge = (
                        await stripe.paymentIntents.retrieve(
                            data.payment_intent as string
                        )
                    ).latest_charge as string;

                    const transfers = await getOrderDetails(
                        data.metadata!.orderId
                    );
                    if (transfers) {
                        const baseFee = 0.3 / transfers.length;

                        transfers.map(async (transfer) => {
                            if (
                                transfer.price &&
                                transfer.connected_account &&
                                charge &&
                                transfer.contribution
                            ) {
                                createTransfer(
                                    //set the transfer amount as 96% of the price*quantity - base fee and voluntary contribution
                                    (transfer.price * transfer.quantity * 0.96 -
                                        baseFee) *
                                        (1 - transfer.contribution / 100),
                                    transfer.connected_account,
                                    transfer.order_number,
                                    charge
                                );
                            }
                        });
                    }
                } catch (err) {
                    console.log(err);
                }
                break;
            }
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        return new Response(
            JSON.stringify({
                message: `Success`,
            }),
            { status: 200 }
        );
    }
    return new Response(
        JSON.stringify({
            message: `Failure`,
        }),
        { status: 400 }
    );
};

async function getOrderDetails(orderId: string) {
    //List all products from an order
    const { data: orderedItems, error } = await supabase
        .from("order_details")
        .select("*")
        .eq("order_number", orderId);
    if (error) {
        console.log("Order Details Error: " + error.code + " " + error.message);
        return;
    }
    //List the product_ids
    const orderedItemsIds = orderedItems?.map((item) => item.product_id);

    //Get the user_id (seller), stripe_price_id, and id information for each product
    const { data: products, error: productsError } = await supabase
        .from("seller_post")
        .select("user_id, stripe_price_id, id")
        .in("id", orderedItemsIds);
    if (productsError) {
        console.log(
            "Products Error: " +
                productsError.code +
                " " +
                productsError.message
        );
        return;
    }

    //Combine the order information with the product information
    let orderedProducts: {
        user_id: string;
        stripe_price_id: string | null;
        id: number;
        order_number: string;
        product_id: number;
        quantity: number;
        price: number | null;
    }[] = [];

    orderedProducts = orderedItems.map((item) => {
        const product = products?.find(
            (product) => product.id === item.product_id
        );
        if (product) {
            return {
                ...item,
                user_id: product.user_id,
                stripe_price_id: product.stripe_price_id,
            };
        } else {
            return {
                ...item,
                user_id: "",
                stripe_price_id: null,
            };
        }
    });

    orderedProducts = await Promise.all(
        orderedProducts.map(async (orderedProduct) => {
            if (orderedProduct.stripe_price_id) {
                const price = await stripe.prices.retrieve(
                    orderedProduct.stripe_price_id
                );
                orderedProduct.price = price.unit_amount;
            } else {
                orderedProduct.price = null;
            }
            return orderedProduct;
        })
    );

    // console.log(orderedProducts);

    //Get the seller's stripe connected account id and add it to the orderedProducts
    const { data: sellers, error: sellersError } = await supabase
        .from("sellers")
        .select("user_id, stripe_connected_account_id, contribution")
        .in(
            "user_id",
            orderedProducts.map((item) => item.user_id)
        );
    if (sellersError) {
        console.log(
            "Sellers Error: " + sellersError.code + " " + sellersError.message
        );
        return;
    }

    // console.log(sellers);

    let transfers: {
        user_id: string;
        stripe_price_id: string | null;
        id: number;
        order_number: string;
        product_id: number;
        quantity: number;
        price: number | null;
        connected_account: string;
        contribution: number;
    }[];

    transfers = orderedProducts.map((orderedProduct) => {
        const seller = sellers?.find(
            (seller) => seller.user_id === orderedProduct.user_id
        );
        if (seller) {
            return {
                ...orderedProduct,
                connected_account: seller.stripe_connected_account_id,
                contribution: seller.contribution,
            };
        } else {
            return {
                ...orderedProduct,
                connected_account: "",
                contribution: null,
            };
        }
    });

    // console.log(transfers);
    return transfers;
}

async function createTransfer(
    amount: number,
    connected_account: string,
    orderId: string,
    charge: string
) {
    const account = await stripe.accounts.retrieve(connected_account);
    if (account) {
        // console.log(account);
        if (account.capabilities?.transfers === "active") {
            const transfer = await stripe.transfers.create({
                amount: amount,
                currency: "usd",
                destination: connected_account,
                transfer_group: orderId,
                source_transaction: charge,
            });
            console.log(transfer);
        } else {
            console.log("Transfer not active");
        }
    } else {
        console.log("Account not found");
    }
}
