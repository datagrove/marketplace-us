import type { Component } from "solid-js";
import type { Post } from "@lib/types";
import { createSignal, createEffect, Show } from "solid-js";
import supabase from "@lib/supabaseClient";
import { getLangFromUrl, useTranslations } from "@i18n/utils";
import { Quantity } from "@components/common/cart/Quantity";
import { items, setItems } from "@components/common/cart/AddToCartButton";

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
                                src={"src/assets/SupportLearnGrove.png"}
                                // TODO Internationalize
                                alt="Support LearnGrove"
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
                                    <div class="inline-block">
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
                                    </p>
                                </div>
                                <div class="col-span-4 col-start-1 row-span-2 row-start-3 flex items-center">
                                    <p class=" prose mb-2 line-clamp-3 max-h-[60px] overflow-hidden text-sm text-ptext1 dark:prose-invert dark:text-ptext1-DM">
                                        {/* TODO Internationalize */}
                                        Help support LearnGrove, the future of
                                        LearnGrove relies entirely on voluntary
                                        contributions. Help support our mission
                                        to support homeschoolers and make
                                        education accessible to all.
                                    </p>
                                </div>
                                <div class="col-span-1 col-start-7 row-start-1 flex justify-end">
                                    {/* Price */}
                                    <p class="mr-2 place-content-center">$</p>
                                    <input
                                        class="w-full flex rounded border border-border1 dark:border-border1-DM bg-background1 text-center text-ptext1 dark:bg-background1-DM dark:text-ptext1-DM"
                                        type="number"
                                        value={5}
                                        min={0}
                                        step={1}
                                        placeholder="5"
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
