import { onMount } from "solid-js";
import type { Component } from "solid-js";
import type { Post } from "@lib/types";
import { getLangFromUrl, useTranslations } from "@i18n/utils";
import cart from "@assets/shopping-cart.svg";
import { items, setItems } from "@components/common/cart/AddToCartButton";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

interface Props {
    favorites: Post[];
}

export const AddAllToCart: Component<Props> = (props: Props) => {
    const storedItems = localStorage.getItem("cartItems");

    props.favorites.map((fav) => {
        fav.quantity = 1;
    });

    onMount(() => {
        if (storedItems) {
            setItems(JSON.parse(storedItems));
        }
    });

    function clickHandler(e: Event) {
        e.preventDefault();
        e.stopPropagation();

        const elem = document.getElementById("addAllToCart");
        elem?.classList.add("animate-click");

        let itemInCart = false;

        const updatedItems = items.map((item: Post) => {
            const favoriteMatch = props.favorites.find(
                (favoritePost) => favoritePost.product_id === item.product_id
            );
            if (favoriteMatch) {
                itemInCart = true;
                console.log(item.quantity, favoriteMatch.quantity);
                return {
                    ...item,
                    quantity: item.quantity + favoriteMatch.quantity,
                };
            }
            console.log(item);
            return item;
        });

        const newItems = props.favorites.filter(
            (fav) => !items.some((item) => item.product_id === fav.product_id)
        );
        if (newItems.length > 0) {
            const newCartItems = [...updatedItems, ...newItems];
            setItems(newCartItems);
            console.log(newCartItems);
            elem!.innerText = t("buttons.addedToCart");
        } else {
            // update the store quantity
            setItems(updatedItems);
            console.log(updatedItems);
            elem!.innerText = t("buttons.addedToCart");
        }

        localStorage.setItem("cartItems", JSON.stringify(updatedItems));
    }

    return (
        <div class="relative z-10 w-full">
            <button
                onclick={(e) => clickHandler(e)}
                class="btn-cart"
                aria-label={t("buttons.addAllToCart")}
                id={"addAllToCart"}
                onAnimationEnd={(elem) => {
                    elem.target.classList.remove("animate-click");
                }}
            >
                {t("buttons.addAllToCart")}
            </button>
        </div>
    );
};
