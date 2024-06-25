import {
    Show,
    createEffect,
    createResource,
    createSignal,
    onMount,
} from "solid-js";
import type { Post } from "@lib/types";
import { getLangFromUrl, useTranslations } from "@i18n/utils";
import cart from "@assets/shopping-cart.svg";
import supabase from "@lib/supabaseClient";
import { loadStripe } from "@stripe/stripe-js";
import { CartCard } from "@components/common/cart/CartCard";
import { items, setItems } from "@components/common/cart/AddToCartButton";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

const stripe = await loadStripe(import.meta.env.PUBLIC_VITE_STRIPE_PUBLIC_KEY);

if (stripe === null) {
    // TODO: Internationalize
    alert("Can't load Stripe");
}

const { data: User, error: UserError } = await supabase.auth.getSession();

const donation_amount = localStorage.getItem("donation_amount");

export const CheckoutView = () => {
    const [totalItems, setTotalItems] = createSignal(0);
    const [orderId, setOrderId] = createSignal<string>("");
    const [orderTotal, setOrderTotal] = createSignal<number>(0);
    const [zeroOrder, setZeroOrder] = createSignal<boolean>(false);

    onMount(async () => {
        console.log(items);
        await createOrder();
        await getTotal();
        await fetchClientCheckoutSecret();
        await mountCheckout();
    });

    async function getTotal() {
        let total = 0;
        items.map((item) => {
            total += item.price * item.quantity;
        });
        total += donation_amount ? parseInt(donation_amount) : 0;
        setOrderTotal(total);
        if (orderTotal() === 0) {
            setZeroOrder(true);
        }
    }

    async function fetchClientCheckoutSecret() {
        const response = await fetch("/api/createStripeCheckout", {
            method: "POST",
            body: JSON.stringify({
                items: items,
                userId: User.session?.user.id,
                orderId: orderId(),
                donation_amount: donation_amount,
                zeroOrder: zeroOrder(),
            }),
        });
        const { clientSecret } = await response.json();
        return clientSecret;
    }

    createEffect(() => {
        let count = 0;
        items.forEach((item) => {
            count += item.quantity;
        });
        setTotalItems(count);
        getTotal();
    });

    async function createOrder() {
        const productDetails = items.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
        }));
        console.log(productDetails);
        const { data, error } = await supabase.rpc("create_order", {
            customerid: User.session?.user.id,
            product_details: productDetails,
        });
        console.log("Order: ");
        setOrderId(data);
        console.log("Order ID: " + orderId());
    }

    async function mountCheckout() {
        const checkout = await stripe!.initEmbeddedCheckout({
            fetchClientSecret: fetchClientCheckoutSecret,
        });

        checkout.mount("#checkout");
    }

    // ADD EMAIL TO SEND FOR CONTACT US

    return (
        <div class="h-full w-full rounded-full">
            <div class="rounded-full" id="checkout"></div>
        </div>
    );
};
