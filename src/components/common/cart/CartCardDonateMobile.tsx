import type { Component } from "solid-js";
import type { Post } from "@lib/types";
import { createSignal, createEffect, Show } from "solid-js";
import supabase from "@lib/supabaseClient";
import { getLangFromUrl, useTranslations } from "@i18n/utils";
import { Quantity } from "@components/common/cart/Quantity";
import { items, setItems } from "@components/common/cart/AddToCartButton";
import LearnGroveCommunity from "@src/assets/LearnGroveCommunity.png";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

interface Props {
    onSetDonation: (donation: number) => void;
}

export const CartCardDonateMobile: Component<Props> = (props) => {
    const [newItems, setNewItems] = createSignal<Array<Post>>([]);
    const [quantity, setQuantity] = createSignal<number>(0);
    const [donation, setDonation] = createSignal<number>(5);

    createEffect(async () => {
        props.onSetDonation(donation());
    });

    return (
        <div class="flex w-full justify-center">
            <ul class="flex w-full flex-wrap">
                    <li class=" mx-4 w-full border-b border-border1 border-opacity-50 py-4 dark:border-border1-DM">
                        <div class=" box-content flex h-full w-full flex-row  items-start justify-start">
                            <div class="mr-2 flex h-full w-24 items-center justify-center rounded-lg bg-background1 dark:bg-background1-DM">
                                <img
                                    src={LearnGroveCommunity.src}
                                    // TODO Internationalize
                                    alt="Build Your LearnGrove"
                                    class="h-full w-full rounded-lg bg-background1 object-cover dark:bg-icon1-DM"
                                />
                            </div>

                            <div
                                id="cardContent"
                                class="flex h-full w-full justify-between pt-1 text-left"
                            >
                                <div class="grid h-full w-full grid-cols-7">
                                    <div class="col-span-5">
                                        <p class="text-md w-full overflow-hidden truncate font-bold text-ptext1 dark:text-ptext1-DM">
                                            {/* TODO Internationalize */}
                                            Support LearnGrove
                                        </p>
                                    </div>
                                    <div class="col-span-4 col-start-1 flex items-center">
                                        <button class="btn-primary" onclick={() => setDonation(10)}>
                                            $10
                                        </button>
                                        <button class="btn-primary" onclick={() => setDonation(15)}>
                                            $15
                                        </button>
                                        <button class="btn-primary" onclick={() => setDonation(25)}>
                                            $25
                                        </button>
                                        {/* <div class="inline-block">
                                            <img
                                                src={
                                                    "src/assets/LearnGroveLogoBWNoText.svg"
                                                }
                                                // TODO Internationalize
                                                alt="LearnGrove Logo"
                                                class="mr-2 h-8 w-8 rounded-full bg-background1 object-cover dark:bg-icon1-DM"
                                            />
                                        </div>
                                        <p class="inline-block overflow-hidden text-sm text-ptext1 dark:text-ptext1-DM">
                                            LearnGrove
                                        </p> */}
                                    </div>
                                    
                                    <div class="col-span-2 col-start-6 row-start-1 flex justify-end pl-2">
                                        {/* Price */}
                                        <p class="mr-2 place-content-center">
                                            $
                                        </p>
                                        <input
                                            class="flex w-full rounded border border-border1 bg-background1 text-center text-ptext1 dark:border-border1-DM dark:bg-background1-DM dark:text-ptext1-DM"
                                            type="number"
                                            min={0}
                                            step={1}
                                            value={donation()}
                                            oninput={(e) =>
                                                setDonation(
                                                    Number(
                                                        (
                                                            e.target as HTMLInputElement
                                                        ).value
                                                    )
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
            </ul>
        </div>
    );
};
