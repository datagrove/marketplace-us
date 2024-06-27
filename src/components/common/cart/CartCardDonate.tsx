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

export const CartCardDonate: Component<Props> = (props) => {
    const [newItems, setNewItems] = createSignal<Array<Post>>([]);
    const [quantity, setQuantity] = createSignal<number>(0);
    const [donation, setDonation] = createSignal<number>(5);

    createEffect(async () => {
        props.onSetDonation(donation());
    })

    return (
        <div class="flex w-full justify-center">
            <ul class="md:flex md:w-full md:flex-wrap">
                <li class=" w-[90%] border-b border-border1 border-opacity-50 py-4 dark:border-border1-DM">
                    <div class="mb-2 box-content flex w-full flex-col items-center justify-center md:h-full md:flex-row  md:items-start md:justify-start">
                        <div class="flex h-full w-full items-center justify-center rounded-lg bg-background1 dark:bg-background1-DM md:mr-2 md:h-full md:w-48">
                            <img
                                src={LearnGroveCommunity.src}
                                // TODO Internationalize
                                alt="Build Your LearnGrove"
                                class="h-full w-full rounded-lg bg-background1 object-cover dark:bg-icon1-DM"
                            />
                        </div>

                        <div
                            id="cardContent"
                            class="flex w-full justify-between px-1 pt-1 text-left md:h-full md:w-5/6"
                        >
                            <div class="grid h-full w-full grid-cols-7 grid-rows-4">
                                <div class="col-span-4">
                                    <p class="w-full overflow-hidden truncate text-2xl font-bold text-ptext1 dark:text-ptext1-DM">
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
                                        <button class="btn-primary" onclick={() => setDonation(50)}>
                                            $50
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
                                    <p class="row-span-1 mb-1 inline-block overflow-hidden text-base text-ptext1 dark:text-ptext1-DM">
                                        LearnGrove
                                    </p> */}
                                </div>
                                <div class="col-span-4 col-start-1 row-span-2 row-start-3 flex items-center">
                                    <p class=" prose mb-2 line-clamp-3 max-h-[60px] overflow-hidden text-sm text-ptext1 dark:prose-invert dark:text-ptext1-DM">
                                        {/* TODO Internationalize */}
                                        Partner with us in building YOUR learning community! 
                                    </p>
                                </div>
                                <div class="col-span-2 col-start-6 row-start-1 flex justify-end mx-3">
                                    {/* Price */}
                                    <p class="mr-2 place-content-center">$</p>
                                    <input
                                        class="flex w-full rounded border border-border1 bg-background1 text-center text-ptext1 dark:border-border1-DM dark:bg-background1-DM dark:text-ptext1-DM"
                                        type="number"
                                        min={0}
                                        step={1}
                                        value={donation()}
                                        oninput={(e => setDonation(Number((e.target as HTMLInputElement).value)))}
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
