import type { Component } from "solid-js";
import type { Review } from "@lib/types";
import { createSignal, createEffect, Show, onMount } from "solid-js";
import supabase from "../../lib/supabaseClient.tsx";
import { getLangFromUrl, useTranslations } from "../../i18n/utils.ts";
import { ui } from "../../i18n/ui.ts";
import type { uiObject } from "../../i18n/uiType.ts";
import type { AuthSession } from "@supabase/supabase-js";
import type { PurchasedPost } from "@lib/types";

interface Props {
    // session: AuthSession | null;
    // lang: "en" | "es" | "fr";
    resourceID: number;
}

export const ViewPostReviews: Component<Props> = (props) => {
    // const lang = props.lang;
    // const t = useTranslations(lang);
    // const values = ui[lang] as uiObject;
    const [reviewsArray, setReviewsArray] = createSignal<Array<object>>();

    onMount(async () => {
        console.log("props.resourceID: ", props.resourceID);
        await fetchReviews(props.resourceID);
    });

    async function fetchReviews(resource_id: number) {
        const response = await fetch("/api/getAllReviews", {
            method: "POST",
            body: JSON.stringify({
                // lang: lang,
                resource_id: resource_id,
            }),
        });
        const data = await response.json();

        setReviewsArray(data.body);

        return data;
    }

    return (
        <div class="my-2 border-2 border-red-500">
            <div>
                {reviewsArray()?.map((review) => (
                    <div>
                        <div class="flex">
                            {/* <p>{ review.overall_rating }</p> */}
                            <div class="mr-2 flex">
                                <Show
                                    when={review.overall_rating >= 1}
                                    fallback={
                                        <div>
                                            <svg
                                                fill="none"
                                                width="20px"
                                                height="20px"
                                                viewBox="0 0 32 32"
                                                class="emptyStar fill-none stroke-icon1 stroke-1 dark:stroke-icon2"
                                            >
                                                <path d="M 30.335938 12.546875 L 20.164063 11.472656 L 16 2.132813 L 11.835938 11.472656 L 1.664063 12.546875 L 9.261719 19.394531 L 7.140625 29.398438 L 16 24.289063 L 24.859375 29.398438 L 22.738281 19.394531 Z" />
                                            </svg>
                                        </div>
                                    }
                                >
                                    <svg
                                        id="star1"
                                        fill="none"
                                        width="20px"
                                        height="20px"
                                        viewBox="0 0 32 32"
                                        class="fill-icon1 stroke-icon1 stroke-1 dark:fill-icon2 dark:stroke-icon2"
                                    >
                                        <path d="M 30.335938 12.546875 L 20.164063 11.472656 L 16 2.132813 L 11.835938 11.472656 L 1.664063 12.546875 L 9.261719 19.394531 L 7.140625 29.398438 L 16 24.289063 L 24.859375 29.398438 L 22.738281 19.394531 Z" />
                                    </svg>
                                </Show>

                                <Show
                                    when={review.overall_rating >= 2}
                                    fallback={
                                        <div>
                                            <svg
                                                fill="none"
                                                width="20px"
                                                height="20px"
                                                viewBox="0 0 32 32"
                                                class="emptyStar fill-none stroke-icon1 stroke-1 dark:stroke-icon2"
                                            >
                                                <path d="M 30.335938 12.546875 L 20.164063 11.472656 L 16 2.132813 L 11.835938 11.472656 L 1.664063 12.546875 L 9.261719 19.394531 L 7.140625 29.398438 L 16 24.289063 L 24.859375 29.398438 L 22.738281 19.394531 Z" />
                                            </svg>
                                        </div>
                                    }
                                >
                                    <svg
                                        id="star1"
                                        fill="none"
                                        width="20px"
                                        height="20px"
                                        viewBox="0 0 32 32"
                                        class="fill-icon1 stroke-icon1 stroke-1 dark:fill-icon2 dark:stroke-icon2"
                                    >
                                        <path d="M 30.335938 12.546875 L 20.164063 11.472656 L 16 2.132813 L 11.835938 11.472656 L 1.664063 12.546875 L 9.261719 19.394531 L 7.140625 29.398438 L 16 24.289063 L 24.859375 29.398438 L 22.738281 19.394531 Z" />
                                    </svg>
                                </Show>

                                <Show
                                    when={review.overall_rating >= 3}
                                    fallback={
                                        <div>
                                            <svg
                                                fill="none"
                                                width="20px"
                                                height="20px"
                                                viewBox="0 0 32 32"
                                                class="emptyStar fill-none stroke-icon1 stroke-1 dark:stroke-icon2"
                                            >
                                                <path d="M 30.335938 12.546875 L 20.164063 11.472656 L 16 2.132813 L 11.835938 11.472656 L 1.664063 12.546875 L 9.261719 19.394531 L 7.140625 29.398438 L 16 24.289063 L 24.859375 29.398438 L 22.738281 19.394531 Z" />
                                            </svg>
                                        </div>
                                    }
                                >
                                    <svg
                                        id="star1"
                                        fill="none"
                                        width="20px"
                                        height="20px"
                                        viewBox="0 0 32 32"
                                        class="fill-icon1 stroke-icon1 stroke-1 dark:fill-icon2 dark:stroke-icon2"
                                    >
                                        <path d="M 30.335938 12.546875 L 20.164063 11.472656 L 16 2.132813 L 11.835938 11.472656 L 1.664063 12.546875 L 9.261719 19.394531 L 7.140625 29.398438 L 16 24.289063 L 24.859375 29.398438 L 22.738281 19.394531 Z" />
                                    </svg>
                                </Show>

                                <Show
                                    when={review.overall_rating >= 4}
                                    fallback={
                                        <div>
                                            <svg
                                                fill="none"
                                                width="20px"
                                                height="20px"
                                                viewBox="0 0 32 32"
                                                class="emptyStar fill-none stroke-icon1 stroke-1 dark:stroke-icon2"
                                            >
                                                <path d="M 30.335938 12.546875 L 20.164063 11.472656 L 16 2.132813 L 11.835938 11.472656 L 1.664063 12.546875 L 9.261719 19.394531 L 7.140625 29.398438 L 16 24.289063 L 24.859375 29.398438 L 22.738281 19.394531 Z" />
                                            </svg>
                                        </div>
                                    }
                                >
                                    <svg
                                        id="star1"
                                        fill="none"
                                        width="20px"
                                        height="20px"
                                        viewBox="0 0 32 32"
                                        class="fill-icon1 stroke-icon1 stroke-1 dark:fill-icon2 dark:stroke-icon2"
                                    >
                                        <path d="M 30.335938 12.546875 L 20.164063 11.472656 L 16 2.132813 L 11.835938 11.472656 L 1.664063 12.546875 L 9.261719 19.394531 L 7.140625 29.398438 L 16 24.289063 L 24.859375 29.398438 L 22.738281 19.394531 Z" />
                                    </svg>
                                </Show>

                                <Show
                                    when={review.overall_rating >= 5}
                                    fallback={
                                        <div>
                                            <svg
                                                fill="none"
                                                width="20px"
                                                height="20px"
                                                viewBox="0 0 32 32"
                                                class="emptyStar fill-none stroke-icon1 stroke-1 dark:stroke-icon2"
                                            >
                                                <path d="M 30.335938 12.546875 L 20.164063 11.472656 L 16 2.132813 L 11.835938 11.472656 L 1.664063 12.546875 L 9.261719 19.394531 L 7.140625 29.398438 L 16 24.289063 L 24.859375 29.398438 L 22.738281 19.394531 Z" />
                                            </svg>
                                        </div>
                                    }
                                >
                                    <svg
                                        id="star1"
                                        fill="none"
                                        width="20px"
                                        height="20px"
                                        viewBox="0 0 32 32"
                                        class="fill-icon1 stroke-icon1 stroke-1 dark:fill-icon2 dark:stroke-icon2"
                                    >
                                        <path d="M 30.335938 12.546875 L 20.164063 11.472656 L 16 2.132813 L 11.835938 11.472656 L 1.664063 12.546875 L 9.261719 19.394531 L 7.140625 29.398438 L 16 24.289063 L 24.859375 29.398438 L 22.738281 19.394531 Z" />
                                    </svg>
                                </Show>
                            </div>
                            <p class="font-bold">{review?.review_title}</p>
                        </div>

                        <div>
                            <p>{review?.review_text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
