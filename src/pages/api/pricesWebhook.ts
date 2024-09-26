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
        const data = event.data.object as Stripe.Price;

        switch (event.type) {
            case "price.created": {
                // console.log("Session Completed", data);
                if (data.active === true && data.unit_amount !== null) {
                    try {
                        await supabase
                            .from("seller_post")
                            .update({
                                price_value: data.unit_amount / 100,
                                stripe_price_id: data.id,
                            })
                            .eq("stripe_product_id", data.product);
                    } catch (err) {
                        console.log(err);
                    }
                    break;
                } 
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