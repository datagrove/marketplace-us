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
import { ReviewSlider } from "./ReviewSlider";

interface Props {
    resourceId: number;
    userId: string;
    access: string | undefined;
    ref: string;
    imgURL: { webpUrl: string; jpegUrl: string } | undefined;
    postTitle: string;
    postCreator: string;
    purchaseDate: string;
    createdDate: string;
    // review: string;
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

export const SubmittedReviewStars: Component<Props> = (props) => {
    const [ratingsData, setRatingsData] = createSignal([]);
    const [showEmptyStars, setShowEmptyStars] = createSignal(false);
    
    onMount(async() => {
        try {
            const data = await fetchPostRatings(props.resourceId.toString());
            setRatingsData(data.body);
        } catch(err) {
            console.error(err);
        } finally {
            const arrayLength = () => ratingsData().length;

            if(arrayLength() === 0) {
                setShowEmptyStars(true);
                return;
            }
        }
    })

    return (
        <div>
            STARS HERE
            <Show when={dbReviewNum()}>
                <div>{t("postLabels.yourRating")}:</div>
                <div class="flex items-center justify-center">
                    <Show
                        when={
                            dbReviewNum() === 1 ||
                            dbReviewNum() === 2 ||
                            dbReviewNum() === 3 ||
                            dbReviewNum() === 4 ||
                            dbReviewNum() === 5
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
                            dbReviewNum() === 1 ||
                            dbReviewNum() === 2 ||
                            dbReviewNum() === 3 ||
                            dbReviewNum() === 4 ||
                            dbReviewNum() === 5
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
                            dbReviewNum() === 3 ||
                            dbReviewNum() === 4 ||
                            dbReviewNum() === 5
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
                        when={dbReviewNum() === 4 || dbReviewNum() === 5}
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
                        when={dbReviewNum() === 5}
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
                </div>
            </Show>
        </div>
    )
}