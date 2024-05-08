import type { APIRoute } from "astro";
import stripe from "@lib/stripe";
import { SITE } from "@src/config";
import type { Post } from "@lib/types";

export const GET: APIRoute = async ({ request, redirect }) => {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get("session_id");
    console.log("sessionId: " + sessionId);
    const session = await stripe.checkout.sessions.retrieve(
        sessionId as string
    );

    if (!session) {
        return new Response(
            JSON.stringify({
                message: "Session not found",
            }),
            { status: 404 }
        );
    }

    // If everything works send a success response
    return new Response(
        JSON.stringify({
            message: "Success",
            session: session,
        }),
        { status: 200 }
    );
};
