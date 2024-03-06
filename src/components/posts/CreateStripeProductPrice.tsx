import type { Component } from "solid-js";
import {
  createEffect,
} from "solid-js";

import stripe from "../../lib/stripe";

interface Props {
  name: string;
  description: string;
  price: number;
}

export const CreateStripeProductPrice: Component<Props> = (props: Props) => {
  async function createProduct(name: string, description: string) {
    return stripe.products.create({
      name: name,
      description: description,
    });
  }

  async function createPrice(product: any, price: number) {
    return stripe.prices.create({
      unit_amount: price,
      currency: "usd",
      product: product.id,
    });
  }

  async function createPriceAndProduct() {
    const product = await createProduct(
        props.name, props.description
      );
      const price = await createPrice(
        product,
        props.price
      );
  }

  createEffect(async () => {
    await createPriceAndProduct();
  });
  


  return null;
};
