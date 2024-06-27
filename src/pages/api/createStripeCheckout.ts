import supabase from "../../lib/supabaseClientServer";
import type { APIRoute } from "astro";
import { useTranslations } from "@i18n/utils";
import stripe from "@lib/stripe";
import { SITE } from "@src/config";
import type { Post } from "@lib/types";
const productId = import.meta.env.PUBLIC_VITE_STRIPE_PLATFORM_SUPPORT_PRODUCT;

export const POST: APIRoute = async ({ request, redirect }) => {
    const response = await request.json();
    const items = response.items;
    const zeroOrder = response.zeroOrder;
    console.log("checkout items: " + items);
    console.log("user Id: " + response.userId);
    console.log("orderId: " + response.orderId);

    //Just console.log the formData for troubleshooting
    //   const lang = formData.get("lang");
    //    //@ts-ignore
    //    const t = useTranslations(lang);

    // Validate the formData makes sure none of the fields are blank. Could probably do more than this like check for invalid phone numbers, blank strings, unselected location info etc.
    if (!items) {
        return new Response(
            JSON.stringify({
                //TODO Internationalize
                message: "No items",
            }),
            { status: 400 }
        );
    }

    let lineItems: any[] = items.map((item: Post) => {
        return {
            price: item.price_id,
            quantity: item.quantity,
        };
    });

    lineItems.push({
        price_data: {
            currency: "usd",
            // Need to capture the donation amount
            unit_amount: response.donation_amount * 100,
            product: productId,
            tax_behavior: "exclusive",
        },
        quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
        ui_mode: "embedded",
        line_items: lineItems,
        mode: "payment",
        return_url: `${SITE.url}/return.html?session_id={CHECKOUT_SESSION_ID}`,
        automatic_tax: { enabled: !zeroOrder },
        metadata: {
            userId: response.userId,
            orderId: response.orderId,
        },
        consent_collection: {
            terms_of_service: "required",
            promotions: "auto",
        },
        payment_intent_data: {
            transfer_group: response.orderId,
        },
        billing_address_collection: "auto",
    });

    // If everything works send a success response
    return new Response(
        JSON.stringify({
            message: "Success",
            clientSecret: session.client_secret,
        }),
        { status: 200 }
    );
};
