import type { Component } from "solid-js";
import { createEffect, createSignal, createResource } from "solid-js";
import { ui } from "../../i18n/ui";
import type { uiObject } from "../../i18n/uiType";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";
import stripe from "../../lib/stripe";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);
const values = ui[lang] as uiObject;

async function postStripeData(stripeData: FormData) {
    const response = await fetch("/api/updatePostStripe", {
        method: "POST",
        body: stripeData,
    });
    const data = await response.json();
    if (data.redirect) {
        alert(data.message);
        window.location.href = `/${lang}` + data.redirect;
    }
    return data;
}

interface Props {
    name: string;
    description: string;
    price: number;
    id: number;
    access_token: string;
    refresh_token: string;
    tax_code: string;
}

export const CreateStripeProductPrice: Component<Props> = (props: Props) => {
    const [stripeData, setStripeData] = createSignal<FormData>();
    const [response] = createResource(stripeData, postStripeData);
    async function createProduct(
        name: string,
        description: string,
        tax_code: string
    ) {
        return stripe.products.create({
            name: name,
            description: description,
            tax_code: tax_code,
        });
    }

    async function createPrice(product: any, price: number) {
        return stripe.prices.create({
            unit_amount: price,
            currency: "usd",
            tax_behavior: "exclusive",
            product: product.id,
        });
    }

    async function createPriceAndProduct() {
        console.log("Stripe Tax Code: " + props.tax_code);
        const product = await createProduct(
            props.name,
            props.description,
            props.tax_code == "" ? 'txcd_10000000' : props.tax_code
        );
        const price = await createPrice(product, props.price);
        const stripeData = new FormData();
        stripeData.append("price_id", price.id);
        stripeData.append("product_id", product.id);
        stripeData.append("id", String(props.id));
        stripeData.append("access_token", props.access_token);
        stripeData.append("refresh_token", props.refresh_token);
        stripeData.append("lang", lang);
        setStripeData(stripeData);
    }

    createEffect(async () => {
        await createPriceAndProduct();
    });

    return null;
};
