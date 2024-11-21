import { getLangFromUrl, useTranslations } from "@i18n/utils";
import {
    createEffect,
    createResource,
    createSignal,
    onMount,
    Suspense,
    Show,
    type Component,
} from "solid-js";
import type { Review } from "@lib/types";

interface Props {
    resourceId: number;
    page: string;
}

async function fetchPostRatings(resourceId: string) {
    const response = await fetch("/api/getRatings", {
        method: "POST",
        body: JSON.stringify({ resource_id: resourceId }),
    });
    const data = await response.json();
    if (data.redirect) {
        window.location.href = data.redirect;
    }
    if (response.status === 200) {
        console.log(data);
    }
    return data;
}

export const AverageRatingStars: Component<Props> = (props) => {
    const [ratingsData, setRatingsData] = createSignal([]);
    const [showEmptyStars, setShowEmptyStars] = createSignal(false);
    const [totalRatings, setTotalRatings] = createSignal(0);
    const [ratingsSum, setRatingsSum] = createSignal(0);
    const [averageRating, setAverageRating] = createSignal(0);

    const lang = getLangFromUrl(new URL(window.location.href));
    const t = useTranslations(lang);

    onMount(async () => {
        try {
            const data = await fetchPostRatings(props.resourceId.toString());
            setRatingsData(data.body);
        } catch (err) {
            console.error(err);
        } finally {
            const arrayLength = () => ratingsData().length;
            if (arrayLength() === 0) {
                setShowEmptyStars(true);
                return;
            }
            setTotalRatings(arrayLength);

            if (arrayLength() > 0) {
                ratingsData().map((rating: Review) => {
                    setRatingsSum(rating.overall_rating + ratingsSum());
                });
            }
            setAverageRating(ratingsSum() / totalRatings());
            setAverageRating(Math.round(averageRating() * 2) / 2);
        }
    });

    return (
        <div class="">
            <Show
                when={
                    props.page === "home" ||
                    props.page === "mobileFullDetails" ||
                    props.page === "viewCard"
                }
            >
                <div class="flex items-center justify-start">
                    <svg
                        id="star1"
                        fill="none"
                        width="16px"
                        height="16px"
                        viewBox="0 0 32 32"
                        class="mr-0.5 fill-icon1 stroke-icon1 stroke-1 dark:fill-icon2 dark:stroke-icon2"
                    >
                        <path d="M 30.335938 12.546875 L 20.164063 11.472656 L 16 2.132813 L 11.835938 11.472656 L 1.664063 12.546875 L 9.261719 19.394531 L 7.140625 29.398438 L 16 24.289063 L 24.859375 29.398438 L 22.738281 19.394531 Z" />
                    </svg>
                    <p class="mr-1 text-xs font-bold">{averageRating()}</p>
                    <p class="text-xs font-light">({totalRatings()})</p>
                </div>
            </Show>
            <Show when={props.page === "fullCard"}>
                <div class="flex items-center justify-center">
                    <Show
                        when={
                            (averageRating() >= 1 && averageRating() < 2) ||
                            (averageRating() >= 2 && averageRating() < 3) ||
                            (averageRating() >= 3 && averageRating() < 4) ||
                            (averageRating() >= 4 && averageRating() < 5) ||
                            averageRating() === 5
                        }
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
                        when={
                            (averageRating() >= 1 && averageRating() < 2) ||
                            (averageRating() >= 2 && averageRating() < 3) ||
                            (averageRating() >= 3 && averageRating() < 4) ||
                            (averageRating() >= 4 && averageRating() < 5) ||
                            averageRating() === 5
                        }
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
                            id="star2"
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
                        when={
                            (averageRating() >= 3 && averageRating() < 4) ||
                            (averageRating() >= 4 && averageRating() < 5) ||
                            averageRating() === 5
                        }
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
                            id="star3"
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
                        when={
                            (averageRating() >= 4 && averageRating() < 5) ||
                            averageRating() === 5
                        }
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
                            id="star4"
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
                        when={averageRating() === 5}
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
                            id="star5"
                            fill="none"
                            width="20px"
                            height="20px"
                            viewBox="0 0 32 32"
                            class="fill-icon1 stroke-icon1 stroke-1 dark:fill-icon2 dark:stroke-icon2"
                        >
                            <path d="M 30.335938 12.546875 L 20.164063 11.472656 L 16 2.132813 L 11.835938 11.472656 L 1.664063 12.546875 L 9.261719 19.394531 L 7.140625 29.398438 L 16 24.289063 L 24.859375 29.398438 L 22.738281 19.394531 Z" />
                        </svg>
                    </Show>
                    <div class="ml-1 flex">
                        <p class="mr-1 text-xs font-bold md:text-lg">
                            {averageRating()}
                        </p>
                        <p class="text-xs font-light md:text-lg">
                            ({totalRatings()}) {t("postLabels.reviews")}
                        </p>
                    </div>
                </div>
            </Show>
        </div>
    );
};
