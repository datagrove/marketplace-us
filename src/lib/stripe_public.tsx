import Stripe from "stripe";

const stripeKey = import.meta.env.PUBLIC_VITE_STRIPE_PUBLIC_KEY;
let stripe = null;

try {
    stripe = new Stripe(stripeKey);
    if (stripe === null) {
        console.log("Stripe is null");
    }
} catch (error) {
    if (error instanceof Error) {
        console.error(error.message);
    }
}

export default stripe!;
