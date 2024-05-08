import { createSignal, onMount } from "solid-js";
import type { Component } from "solid-js";
import { getLangFromUrl, useTranslations } from "@i18n/utils";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

interface Props {
    product_id?: string;
    quantity: number;
    updateQuantity: (quantity: number, product_id?: string) => void;
}

export const Quantity: Component<Props> = (props: Props) => {
    const [updateQuantity, setUpdateQuantity] = createSignal<number>(1);

    onMount(() => {
        if (props.quantity) {
            setUpdateQuantity(props.quantity);
        } else setUpdateQuantity(1);
    });

    function inputHandler(e: Event) {
        e.preventDefault();
        e.stopPropagation();

        setUpdateQuantity(Number((e.target as HTMLInputElement).value));
        props.updateQuantity(
            Number((e.target as HTMLInputElement).value),
            props.product_id?.toString()
        );
    }

    function increase(e: Event) {
        e.preventDefault();
        e.stopPropagation();

        setUpdateQuantity(updateQuantity() + 1);
        props.updateQuantity(updateQuantity(), props.product_id?.toString());
    }

    function decrease(e: Event) {
        e.preventDefault();
        e.stopPropagation();

        setUpdateQuantity(updateQuantity() - 1);
        props.updateQuantity(updateQuantity(), props.product_id?.toString());
    }

    return (
        <div class="relative z-10 flex w-fit rounded border border-border1 px-3 dark:border-border1-DM">
            <button
                onclick={(e) => decrease(e)}
                class="inline-block"
                aria-label={t("ariaLabels.decreaseQuantity")}
            >
                -
            </button>
            <input
                type="text"
                inputMode="numeric"
                pattern="/^\d+$/"
                class="w-8 bg-background1 text-center text-ptext1 dark:bg-background1-DM dark:text-ptext1-DM"
                onInput={(e) => inputHandler(e)}
                value={updateQuantity()}
                onclick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
            ></input>
            <button
                onclick={(e) => increase(e)}
                class="inline-block"
                aria-label={t("ariaLabels.increaseQuantity")}
            >
                +
            </button>
        </div>
    );
};
