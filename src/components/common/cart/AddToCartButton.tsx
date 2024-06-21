import { onMount } from "solid-js";
import { createStore } from "solid-js/store";
import type { Component } from "solid-js";
import type { Post } from "@lib/types";
import { getLangFromUrl, useTranslations } from "@i18n/utils";
import cart from "@assets/shopping-cart.svg";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

interface Props {
    item: Post;
    buttonClick: (event: Event) => void;
}

export const [items, setItems] = createStore<Post[]>([]);

export const AddToCart: Component<Props> = (props: Props) => {
    const storedItems = localStorage.getItem("cartItems");

    onMount(() => {
        if (storedItems) {
            setItems(JSON.parse(storedItems));
        }
    });

    function clickHandler(e: Event) {
        e.preventDefault();
        e.stopPropagation();

        var elem = document.getElementById(`add-to-cart-${props.item.product_id}`);
        elem?.classList.add("animate-click");
        console.log(elem);

        let itemInCart = false;

        const updatedItems = items.map((item: Post) => {
            if (item.product_id === props.item.product_id) {
                itemInCart = true;
                return {
                    ...item,
                    quantity: item.quantity + props.item.quantity,
                };
            };
            return item;
        });

        if (!itemInCart) {
            const newItem = props.item;
            setItems([...updatedItems, newItem]);
            elem!.innerText = t("buttons.addedToCart");
        } else {
            setItems(updatedItems);
            elem!.innerText = t("buttons.addedToCart")
        }

        props.buttonClick(e);
    }

    return (
        <div class="relative z-10 w-full">
            <button
                onclick={(e) => clickHandler(e)}
                class="btn-cart"
                aria-label={t("buttons.addToCart") + " " + props.item.title}
                id={`add-to-cart-${props.item.product_id}`}
                onAnimationEnd={(elem) => {
                    elem.target.classList.remove("animate-click");
                }}
            >
                {t("buttons.addToCart")}
            </button>
        </div>
    );
};
