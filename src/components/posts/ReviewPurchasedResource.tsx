import Modal, { closeModal } from "@components/common/notices/modal";
import { getLangFromUrl, useTranslations } from "@i18n/utils";
import type { Review } from "@lib/types";
import type { Session } from "@supabase/supabase-js";
import { ReviewSlider } from "./ReviewSlider";

import {
    createEffect,
    createResource,
    createSignal,
    onMount,
    Suspense,
    Show,
    type Component,
} from "solid-js";

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

async function postFormData(formData: FormData) {
    const response = await fetch("/api/clientSubmitReviewResource", {
        method: "POST",
        body: formData,
    });
    const data = await response.json();
    if (data.redirect) {
        window.location.href = data.redirect;
    }
    if (response.status === 200) {
        console.log("Submitted Review");
        console.log(data);
    }
    return data;
}

async function fetchPostReviews(resourceId: string) {
    const response = await fetch("/api/getAllReviews", {
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

async function fetchUserRating(reviewerId: string, resourceId: number) {
    const response = await fetch("/api/getUserRating", {
        method: "POST",
        body: JSON.stringify({
            reviewer_id: reviewerId,
            resource_id: resourceId,
        }),
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

//Refactor this should be a prop passed all the way from the Astro page
const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

export const ReviewPurchasedResource: Component<Props> = (props) => {
    const [overallRating, setOverallRating] = createSignal<string>("");
    const [reviewTitle, setReviewTitle] = createSignal<string>("");
    const [reviewText, setReviewText] = createSignal<string>("");
    const [formData, setFormData] = createSignal<FormData>();
    const [response, { refetch }] = createResource(formData, postFormData);
    const [totalReviews, setTotalReviews] = createSignal(0);
    const [reviewsData, setReviewsData] = createSignal([]);
    const [loading, setLoading] = createSignal(true);
    const [totalRatingOfPost, setTotalRatingOfPost] = createSignal(0);
    const [showReviewForm, setShowReviewForm] = createSignal(true);
    const [dbReviewNum, setDbReviewNum] = createSignal<number>(0);
    const [showReviewFieldAlert, setShowReviewFieldAlert] = createSignal(false);

    onMount(async () => {
        try {
            //Refactor: We aren't going to want to load all the reviews every time, probably need pagination
            //So we will need to do checks like "has this been reviewed by this user" on the server/API call
            const data = await fetchUserRating(props.userId, props.resourceId);
            setReviewsData(data.body);

            let reviewerRating = data.body[0].overall_rating;
            setDbReviewNum(reviewerRating);

            if (reviewerRating) {
                console.log("reviewerRating was true");
                setShowReviewForm(false);
            }
        } catch (err) {
            console.error(err);
        } finally {
            reviewsData().map((review: Review) => {
                if (review.reviewer_id === props.userId) {
                    return;
                }
            });
            setLoading(false);
        }

        // try {
        //     //Refactor: We aren't going to want to load all the reviews every time, probably need pagination
        //     //So we will need to do checks like "has this been reviewed by this user" on the server/API call
        //     const data = await fetchPostReviews(props.resourceId.toString());
        //     setReviewsData(data.body);
        // } catch (err) {
        //     console.error(err);
        // } finally {
        //     const arrayLength = () => reviewsData().length;
        //     if (arrayLength() === 0) {
        //         setShowReviewForm(true);
        //         setLoading(false);
        //         return;
        //     }
        //     reviewsData().map((review: Review) => {
        //         if (review.reviewer_id === props.userId) {
        //             return;
        //         } else {
        //             setShowReviewForm(true);
        //         }
        //     });

        //     // Set loading to false after fetch is complete
        //     setLoading(false);
        //     setTotalReviews(arrayLength);
        //     // Refactor: I would like to see this done on the server as part of the fetch if possible I think it will probably be faster
        //     // plus we won't want to return every single review but we will need to use them all to calculate this.
        //     // Might need to use a SQL query of some kind to store the average for the post in the view? Calculating this continually will be slow.
        //     if (arrayLength() > 0) {
        //         reviewsData().map((review: Review) => {
        //             setTotalRatingOfPost(
        //                 review.overall_rating + totalRatingOfPost()
        //             );
        //         });
        //         setTotalRatingOfPost(totalRatingOfPost() / totalReviews());
        //         setTotalRatingOfPost(Math.round(totalRatingOfPost() * 2) / 2);
        //     }
        // }
    });

    createEffect(async () => {
        if (response.state === "ready" && response() !== undefined) {
            const data = await fetchUserRating(props.userId, props.resourceId);
            setReviewsData(data.body);
            let reviewerRating = data.body[0].overall_rating;
            setDbReviewNum(reviewerRating);
            if (reviewerRating) {
                console.log("reviewerRating was true");
                setShowReviewForm(false);
            }
        }
    });

    async function submit(e: SubmitEvent, buttonId: string) {
        e.preventDefault();

        console.log(overallRating(), reviewTitle(), reviewText());

        if (overallRating() === "") {
            setShowReviewFieldAlert(true);

            setTimeout(() => {
                setShowReviewFieldAlert(false);
            }, 3000);

            return false;
        }

        const formData = new FormData(e.target as HTMLFormElement);
        formData.append("review_title", reviewTitle());
        formData.append("review_text", reviewText());
        formData.append("overall_rating", overallRating());
        formData.append("resource_id", props.resourceId.toString());
        formData.append("user_id", props.userId);
        formData.append("refresh_token", props?.ref);
        formData.append("access_token", props.access ? props.access : "");
        formData.append("lang", lang);
        setFormData(formData);

        while (response.loading) {
            await new Promise((resolve) => setTimeout(resolve, 50)); // Small delay to let the response update
        }

        if (response.state === "ready" && response().message === "Success!") {
            closeModal(buttonId, e);
        }
    }

    const ratePurchase = (e: Event) => {
        let selectedReviewIdEl = e.currentTarget as HTMLSpanElement;
        let selectedReviewID = selectedReviewIdEl.id;

        let reviewedDiv = document.getElementById("user-profile-ratings-div");

        switch (selectedReviewID) {
            case "user-rating-1":
                setOverallRating("1");
                break;
            case "user-rating-2":
                setOverallRating("2");
                break;
            case "user-rating-3":
                setOverallRating("3");
                break;
            case "user-rating-4":
                setOverallRating("4");
                break;
            case "user-rating-5":
                setOverallRating("5");
                break;
            default:
                setOverallRating("");
        }

        reviewedDiv?.setAttribute("id", "user-profile-ratings-div-reviewed");
    };

    return (
        <div class="">
            <div>{loading() && <p>Loading reviews...</p>}</div>
            <Show when={dbReviewNum() > 0}>
                <div>{t("postLabels.yourRating")}:</div>
                <div class="tester flex items-center justify-center">
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

            <Show when={showReviewForm() === true}>
                <Modal
                    // TODO Internationalize Heading and button content
                    heading={t("buttons.submitReview")}
                    buttonClass="btn-primary"
                    buttonContent={t("buttons.submitReview")}
                    buttonId={"submitReview" + props.resourceId}
                    children={
                        <div class="">
                            <div class="flex">
                                {props.imgURL?.webpUrl ? (
                                    <picture>
                                        <source
                                            srcset={props.imgURL?.webpUrl}
                                            type="image/webp"
                                        />
                                        <img
                                            src={props.imgURL?.jpegUrl}
                                            alt={`Post Image ${props.imgURL?.jpegUrl}.jpeg`}
                                            class="h-40 w-40 rounded object-contain"
                                        />
                                    </picture>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="110px"
                                        height="110px"
                                        viewBox="35 0 186 256"
                                        id="Flat"
                                        class="rounded border border-border1 fill-icon1 dark:border-border1-DM dark:fill-icon1-DM"
                                    >
                                        <path d="M208,36H48A12.01312,12.01312,0,0,0,36,48V208a12.01312,12.01312,0,0,0,12,12H208a12.01312,12.01312,0,0,0,12-12V48A12.01312,12.01312,0,0,0,208,36Zm4,172a4.004,4.004,0,0,1-4,4H48a4.004,4.004,0,0,1-4-4V177.65631l33.17187-33.171a4.00208,4.00208,0,0,1,5.65723,0l20.68652,20.68652a12.011,12.011,0,0,0,16.96973,0l44.68652-44.68652a4.00208,4.00208,0,0,1,5.65723,0L212,161.65625Zm0-57.65625L176.48535,114.8291a11.99916,11.99916,0,0,0-16.96973,0L114.8291,159.51562a4.00681,4.00681,0,0,1-5.65723,0L88.48535,138.8291a12.01009,12.01009,0,0,0-16.96973,0L44,166.34393V48a4.004,4.004,0,0,1,4-4H208a4.004,4.004,0,0,1,4,4ZM108.001,92v.00195a8.001,8.001,0,1,1,0-.00195Z" />
                                    </svg>
                                )}

                                <div
                                    id="review-form-title-text"
                                    class="w-full pl-1"
                                >
                                    <h1 class="line-clamp-2 font-bold">
                                        {props.postTitle}
                                    </h1>
                                    <a
                                        href={`/${lang}/creator/${props.userId}`}
                                    >
                                        <p class="mb-2 text-xs">
                                            {props.postCreator}Fix Creator Name
                                        </p>
                                    </a>

                                    <div class="mt-1 flex">
                                        <svg
                                            data-slot="icon"
                                            fill="none"
                                            stroke-width="1.5"
                                            stroke="none"
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                            class="mr-1 h-4 w-4 fill-icon2 stroke-icon1 dark:fill-icon2-DM dark:stroke-icon1-DM"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                                            ></path>
                                        </svg>
                                        <p class="text-xs font-light">
                                            {t("menus.purchased")}&nbsp
                                        </p>
                                        <p class="text-xs font-light">
                                            {props.purchaseDate.slice(0, 10)}
                                        </p>
                                    </div>

                                    <div class="mt-1 flex">
                                        <svg
                                            x="0px"
                                            y="0px"
                                            viewBox="0 0 50 50"
                                            class="mr-1 h-4 w-4 fill-icon1 "
                                        >
                                            <path d="M 25 5 C 13.964844 5 5 13.964844 5 25 C 4.996094 25.359375 5.183594 25.695313 5.496094 25.878906 C 5.808594 26.058594 6.191406 26.058594 6.503906 25.878906 C 6.816406 25.695313 7.003906 25.359375 7 25 C 7 15.046875 15.046875 7 25 7 C 31.246094 7 36.726563 10.179688 39.957031 15 L 33 15 C 32.640625 14.996094 32.304688 15.183594 32.121094 15.496094 C 31.941406 15.808594 31.941406 16.191406 32.121094 16.503906 C 32.304688 16.816406 32.640625 17.003906 33 17 L 43 17 L 43 7 C 43.003906 6.730469 42.898438 6.46875 42.707031 6.277344 C 42.515625 6.085938 42.253906 5.980469 41.984375 5.984375 C 41.433594 5.996094 40.992188 6.449219 41 7 L 41 13.011719 C 37.347656 8.148438 31.539063 5 25 5 Z M 43.984375 23.984375 C 43.433594 23.996094 42.992188 24.449219 43 25 C 43 34.953125 34.953125 43 25 43 C 18.753906 43 13.269531 39.820313 10.042969 35 L 17 35 C 17.359375 35.007813 17.695313 34.816406 17.878906 34.507813 C 18.058594 34.195313 18.058594 33.808594 17.878906 33.496094 C 17.695313 33.1875 17.359375 32.996094 17 33 L 8.445313 33 C 8.316406 32.976563 8.1875 32.976563 8.058594 33 L 7 33 L 7 43 C 6.996094 43.359375 7.183594 43.695313 7.496094 43.878906 C 7.808594 44.058594 8.191406 44.058594 8.503906 43.878906 C 8.816406 43.695313 9.003906 43.359375 9 43 L 9 36.984375 C 12.648438 41.847656 18.460938 45 25 45 C 36.035156 45 45 36.035156 45 25 C 45.003906 24.730469 44.898438 24.46875 44.707031 24.277344 C 44.515625 24.085938 44.253906 23.980469 43.984375 23.984375 Z"></path>
                                        </svg>
                                        <p class="text-xs font-light">
                                            {t("menus.updated")} &nbsp
                                        </p>
                                        <p class="text-xs font-light">
                                            {props.createdDate.slice(0, 10)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div class="my-2">
                                <h1 class="md:3xl text-2xl">
                                    {t("formLabels.whatDidYouThink")}
                                </h1>
                            </div>
                            <form
                                onSubmit={(e) =>
                                    submit(e, "submitReview" + props.resourceId)
                                }
                            >
                                <div class="mb-4 mt-2 text-center text-xs">
                                    <Show
                                        when={showReviewFieldAlert() === true}
                                    >
                                        <p class="text-lg text-alert1 dark:text-alert1-DM">
                                            {t(
                                                "messages.overallReviewRequired"
                                            )}
                                        </p>
                                    </Show>

                                    <div>
                                        <span class="text-alert1">* </span>
                                        <span class="italic">
                                            {t("formLabels.required")}
                                        </span>
                                    </div>
                                </div>

                                <div class="">
                                    <div class="mb-4 flex w-full justify-between">
                                        <div class="flex">
                                            <p class="mr-1 text-lg font-bold">
                                                {t("formLabels.overallRating")}
                                                <span class="text-alert1">
                                                    *
                                                </span>
                                            </p>
                                            <div class="group relative mr-2 flex items-center">
                                                <svg
                                                    class="peer h-4 w-4 rounded-full border-2 border-border1 bg-icon1 fill-iconbg1  dark:border-none dark:bg-background1-DM dark:fill-iconbg1-DM"
                                                    version="1.1"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 512 512"
                                                >
                                                    <g>
                                                        <path
                                                            d="M255.992,0.008C114.626,0.008,0,114.626,0,256s114.626,255.992,255.992,255.992
                                    C397.391,511.992,512,397.375,512,256S397.391,0.008,255.992,0.008z M300.942,373.528c-10.355,11.492-16.29,18.322-27.467,29.007
                                    c-16.918,16.177-36.128,20.484-51.063,4.516c-21.467-22.959,1.048-92.804,1.597-95.449c4.032-18.564,12.08-55.667,12.08-55.667
                                    s-17.387,10.644-27.709,14.419c-7.613,2.782-16.225-0.871-18.354-8.234c-1.984-6.822-0.404-11.161,3.774-15.822
                                    c10.354-11.484,16.289-18.314,27.467-28.999c16.934-16.185,36.128-20.483,51.063-4.524c21.467,22.959,5.628,60.732,0.064,87.497
                                    c-0.548,2.653-13.742,63.627-13.742,63.627s17.387-10.645,27.709-14.427c7.628-2.774,16.241,0.887,18.37,8.242
                                    C306.716,364.537,305.12,368.875,300.942,373.528z M273.169,176.123c-23.886,2.096-44.934-15.564-47.031-39.467
                                    c-2.08-23.878,15.58-44.934,39.467-47.014c23.87-2.097,44.934,15.58,47.015,39.458
                                    C314.716,152.979,297.039,174.043,273.169,176.123z"
                                                        />
                                                    </g>
                                                </svg>

                                                <span class="invisible absolute m-4 mx-auto w-48 -translate-x-full -translate-y-2/3 rounded-md bg-background2 p-2 text-sm text-ptext2 transition-opacity peer-hover:visible dark:bg-background2-DM dark:text-ptext2-DM md:translate-x-1/4 md:translate-y-0">
                                                    {t(
                                                        "formLabels.overallRatingDescription"
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            id="user-profile-ratings-div"
                                            class="purchased-item-stars flex w-1/2 items-center justify-between md:w-1/4"
                                        >
                                            <span
                                                id="user-rating-1"
                                                class="flex items-center justify-center"
                                                onClick={(e) => ratePurchase(e)}
                                            >
                                                <Show
                                                    when={
                                                        overallRating() === ""
                                                    }
                                                >
                                                    ☆
                                                </Show>

                                                <Show
                                                    when={
                                                        overallRating() ===
                                                            "1" ||
                                                        overallRating() ===
                                                            "2" ||
                                                        overallRating() ===
                                                            "3" ||
                                                        overallRating() ===
                                                            "4" ||
                                                        overallRating() === "5"
                                                    }
                                                >
                                                    <svg
                                                        fill="none"
                                                        width="20px"
                                                        height="20px"
                                                        viewBox="0 0 32 32"
                                                        class="fill-icon1 dark:fill-icon2"
                                                    >
                                                        <path d="M 30.335938 12.546875 L 20.164063 11.472656 L 16 2.132813 L 11.835938 11.472656 L 1.664063 12.546875 L 9.261719 19.394531 L 7.140625 29.398438 L 16 24.289063 L 24.859375 29.398438 L 22.738281 19.394531 Z" />
                                                    </svg>
                                                </Show>
                                            </span>
                                            <span
                                                id="user-rating-2"
                                                class=""
                                                onClick={(e) => ratePurchase(e)}
                                            >
                                                <Show
                                                    when={
                                                        overallRating() ===
                                                            "" ||
                                                        overallRating() === "1"
                                                    }
                                                >
                                                    ☆
                                                </Show>

                                                <Show
                                                    when={
                                                        overallRating() ===
                                                            "2" ||
                                                        overallRating() ===
                                                            "3" ||
                                                        overallRating() ===
                                                            "4" ||
                                                        overallRating() === "5"
                                                    }
                                                >
                                                    <svg
                                                        fill="none"
                                                        width="20px"
                                                        height="20px"
                                                        viewBox="0 0 32 32"
                                                        class="fill-icon1 dark:fill-icon2"
                                                    >
                                                        <path d="M 30.335938 12.546875 L 20.164063 11.472656 L 16 2.132813 L 11.835938 11.472656 L 1.664063 12.546875 L 9.261719 19.394531 L 7.140625 29.398438 L 16 24.289063 L 24.859375 29.398438 L 22.738281 19.394531 Z" />
                                                    </svg>
                                                </Show>
                                            </span>
                                            <span
                                                id="user-rating-3"
                                                class=""
                                                onClick={(e) => ratePurchase(e)}
                                            >
                                                <Show
                                                    when={
                                                        overallRating() ===
                                                            "" ||
                                                        overallRating() ===
                                                            "1" ||
                                                        overallRating() === "2"
                                                    }
                                                >
                                                    ☆
                                                </Show>

                                                <Show
                                                    when={
                                                        overallRating() ===
                                                            "3" ||
                                                        overallRating() ===
                                                            "4" ||
                                                        overallRating() === "5"
                                                    }
                                                >
                                                    <svg
                                                        fill="none"
                                                        width="20px"
                                                        height="20px"
                                                        viewBox="0 0 32 32"
                                                        class="fill-icon1 dark:fill-icon2"
                                                    >
                                                        <path d="M 30.335938 12.546875 L 20.164063 11.472656 L 16 2.132813 L 11.835938 11.472656 L 1.664063 12.546875 L 9.261719 19.394531 L 7.140625 29.398438 L 16 24.289063 L 24.859375 29.398438 L 22.738281 19.394531 Z" />
                                                    </svg>
                                                </Show>
                                            </span>
                                            <span
                                                id="user-rating-4"
                                                class=""
                                                onClick={(e) => ratePurchase(e)}
                                            >
                                                <Show
                                                    when={
                                                        overallRating() ===
                                                            "" ||
                                                        overallRating() ===
                                                            "1" ||
                                                        overallRating() ===
                                                            "2" ||
                                                        overallRating() === "3"
                                                    }
                                                >
                                                    ☆
                                                </Show>

                                                <Show
                                                    when={
                                                        overallRating() ===
                                                            "4" ||
                                                        overallRating() === "5"
                                                    }
                                                >
                                                    <svg
                                                        fill="none"
                                                        width="20px"
                                                        height="20px"
                                                        viewBox="0 0 32 32"
                                                        class="fill-icon1 dark:fill-icon2"
                                                    >
                                                        <path d="M 30.335938 12.546875 L 20.164063 11.472656 L 16 2.132813 L 11.835938 11.472656 L 1.664063 12.546875 L 9.261719 19.394531 L 7.140625 29.398438 L 16 24.289063 L 24.859375 29.398438 L 22.738281 19.394531 Z" />
                                                    </svg>
                                                </Show>
                                            </span>
                                            <span
                                                id="user-rating-5"
                                                class=""
                                                onClick={(e) => ratePurchase(e)}
                                            >
                                                <Show
                                                    when={
                                                        overallRating() ===
                                                            "" ||
                                                        overallRating() !== "5"
                                                    }
                                                >
                                                    ☆
                                                </Show>

                                                <Show
                                                    when={
                                                        overallRating() === "5"
                                                    }
                                                >
                                                    <svg
                                                        fill="none"
                                                        width="20px"
                                                        height="20px"
                                                        viewBox="0 0 32 32"
                                                        class="fill-icon1 dark:fill-icon2"
                                                    >
                                                        <path d="M 30.335938 12.546875 L 20.164063 11.472656 L 16 2.132813 L 11.835938 11.472656 L 1.664063 12.546875 L 9.261719 19.394531 L 7.140625 29.398438 L 16 24.289063 L 24.859375 29.398438 L 22.738281 19.394531 Z" />
                                                    </svg>
                                                </Show>
                                            </span>
                                        </div>
                                    </div>
                                    {/* <input
                                        type="number"
                                        id=""
                                        name="overallRating"
                                        class="bg-background mb-4 w-full rounded border border-inputBorder1 px-1 text-ptext1 focus:border-2 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM dark:focus:border-highlight1-DM"
                                        oninput={(e) =>
                                            setOverallRating(e.target.value)
                                        }
                                    /> */}
                                </div>

                                {/* <div id="slider-reviews" class="md:grid grid-cols-2 grid-rows-7 "> */}
                                {/* <div id="slider-reviews" class="md:flex md:flex-col">
                                    <div class="md:flex justify-between">
                                        <p>{t("formLabels.reviewQ1")}</p>
                                        <ReviewSlider resourceId={ props.resourceId } selectedReviewValue={ 3 }/>
                                    </div>

                                    <div class="md:flex justify-between">
                                        <p>{t("formLabels.reviewQ2")}</p>
                                        <ReviewSlider resourceId={ props.resourceId } selectedReviewValue={ 3 }/>
                                    </div>

                                    <div class="md:flex justify-between">
                                        <p>{t("formLabels.reviewQ3")}</p>
                                        <ReviewSlider resourceId={ props.resourceId } selectedReviewValue={ 3 }/>
                                    </div>

                                    <div class="md:flex justify-between">
                                        <p>{t("formLabels.reviewQ4")}</p>
                                        <ReviewSlider resourceId={ props.resourceId } selectedReviewValue={ 3 }/>
                                    </div>
                                    
                                    <div class="md:flex justify-between">
                                        <p>{t("formLabels.reviewQ5")}</p>
                                        <ReviewSlider resourceId={ props.resourceId } selectedReviewValue={ 3 }/>
                                    </div>

                                    <div class="md:flex justify-between">
                                        <p>{t("formLabels.reviewQ6")}</p>
                                        <ReviewSlider resourceId={ props.resourceId } selectedReviewValue={ 3 }/>
                                    </div>
                                </div> */}

                                <div class="mb-2 mt-6 items-center justify-between md:flex">
                                    <div class="flex flex-row items-center justify-between md:w-1/3 md:justify-start">
                                        <label
                                            for="Review Title"
                                            class="text-ptext1 dark:text-ptext1-DM"
                                        >
                                            <p class="mr-1 font-bold">
                                                {t("formLabels.reviewTitle")}:{" "}
                                            </p>
                                        </label>
                                        <div class="group relative mr-2 flex items-center">
                                            <svg
                                                class="peer h-4 w-4 rounded-full border-2 border-border1 bg-icon1 fill-iconbg1  dark:border-none dark:bg-background1-DM dark:fill-iconbg1-DM"
                                                version="1.1"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 512 512"
                                            >
                                                <g>
                                                    <path
                                                        d="M255.992,0.008C114.626,0.008,0,114.626,0,256s114.626,255.992,255.992,255.992
                                    C397.391,511.992,512,397.375,512,256S397.391,0.008,255.992,0.008z M300.942,373.528c-10.355,11.492-16.29,18.322-27.467,29.007
                                    c-16.918,16.177-36.128,20.484-51.063,4.516c-21.467-22.959,1.048-92.804,1.597-95.449c4.032-18.564,12.08-55.667,12.08-55.667
                                    s-17.387,10.644-27.709,14.419c-7.613,2.782-16.225-0.871-18.354-8.234c-1.984-6.822-0.404-11.161,3.774-15.822
                                    c10.354-11.484,16.289-18.314,27.467-28.999c16.934-16.185,36.128-20.483,51.063-4.524c21.467,22.959,5.628,60.732,0.064,87.497
                                    c-0.548,2.653-13.742,63.627-13.742,63.627s17.387-10.645,27.709-14.427c7.628-2.774,16.241,0.887,18.37,8.242
                                    C306.716,364.537,305.12,368.875,300.942,373.528z M273.169,176.123c-23.886,2.096-44.934-15.564-47.031-39.467
                                    c-2.08-23.878,15.58-44.934,39.467-47.014c23.87-2.097,44.934,15.58,47.015,39.458
                                    C314.716,152.979,297.039,174.043,273.169,176.123z"
                                                    />
                                                </g>
                                            </svg>

                                            <span
                                                class="invisible absolute m-4 mx-auto w-48 -translate-x-full -translate-y-2/3 rounded-md bg-background2 
                                p-2 text-sm text-ptext2 transition-opacity peer-hover:visible dark:bg-background2-DM dark:text-ptext2-DM md:translate-x-1/4 md:translate-y-0"
                                            >
                                                {t(
                                                    "formLabels.reviewTitleDescription"
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                    <div class="flex w-full items-center">
                                        <input
                                            type="text"
                                            id="reviewTitle"
                                            name="reviewTitle"
                                            class="bg-background w-full rounded border border-inputBorder1 px-1 text-ptext1 focus:border-2 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM dark:focus:border-highlight1-DM"
                                            oninput={(e) =>
                                                setReviewTitle(e.target.value)
                                            }
                                        />
                                    </div>
                                </div>

                                <div class="">
                                    <div class="flex flex-row justify-start">
                                        <label
                                            for="reviewText"
                                            class="font-bold text-ptext1 dark:text-ptext1-DM"
                                        >
                                            {t("formLabels.reviewText")}:
                                        </label>
                                        <div class="group relative ml-2 flex items-center">
                                            <svg
                                                class="peer h-4 w-4 rounded-full border-2 border-border1 bg-icon1 fill-iconbg1  dark:border-none dark:bg-background1-DM dark:fill-iconbg1-DM"
                                                version="1.1"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 512 512"
                                            >
                                                <g>
                                                    <path
                                                        d="M255.992,0.008C114.626,0.008,0,114.626,0,256s114.626,255.992,255.992,255.992
                                    C397.391,511.992,512,397.375,512,256S397.391,0.008,255.992,0.008z M300.942,373.528c-10.355,11.492-16.29,18.322-27.467,29.007
                                    c-16.918,16.177-36.128,20.484-51.063,4.516c-21.467-22.959,1.048-92.804,1.597-95.449c4.032-18.564,12.08-55.667,12.08-55.667
                                    s-17.387,10.644-27.709,14.419c-7.613,2.782-16.225-0.871-18.354-8.234c-1.984-6.822-0.404-11.161,3.774-15.822
                                    c10.354-11.484,16.289-18.314,27.467-28.999c16.934-16.185,36.128-20.483,51.063-4.524c21.467,22.959,5.628,60.732,0.064,87.497
                                    c-0.548,2.653-13.742,63.627-13.742,63.627s17.387-10.645,27.709-14.427c7.628-2.774,16.241,0.887,18.37,8.242
                                    C306.716,364.537,305.12,368.875,300.942,373.528z M273.169,176.123c-23.886,2.096-44.934-15.564-47.031-39.467
                                    c-2.08-23.878,15.58-44.934,39.467-47.014c23.87-2.097,44.934,15.58,47.015,39.458
                                    C314.716,152.979,297.039,174.043,273.169,176.123z"
                                                    />
                                                </g>
                                            </svg>

                                            <span
                                                class="invisible absolute m-4 mx-auto w-48 -translate-x-full -translate-y-2/3 rounded-md bg-background2 
                                p-2 text-sm text-ptext2 transition-opacity peer-hover:visible dark:bg-background2-DM dark:text-ptext2-DM md:translate-x-1/4 md:translate-y-0"
                                            >
                                                {t(
                                                    "formLabels.reviwTextDescription"
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                    <textarea
                                        id="reviewText"
                                        name="reviewText"
                                        maxlength="750"
                                        rows="5"
                                        class="bg-background mb-4 w-full rounded border border-inputBorder1 px-1 text-ptext1 focus:border-2 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM dark:focus:border-highlight1-DM"
                                        oninput={(e) =>
                                            setReviewText(e.target.value)
                                        }
                                    />
                                </div>
                                <div class="w-ful flex items-center justify-center">
                                    <button class="my-2 w-[200px] rounded-sm bg-btn1 p-2 font-bold text-white dark:bg-btn1-DM">
                                        <input
                                            type="submit"
                                            // value={"Submit Review"}
                                            value={t("buttons.submitReview")}
                                        />
                                    </button>
                                </div>

                                <Suspense>
                                    {response() && (
                                        <p class="mt-2 text-center font-bold text-alert1 dark:text-alert1-DM">
                                            {response().message}
                                            {/* {t("messages.submitted")} */}
                                        </p>
                                    )}
                                </Suspense>
                            </form>
                        </div>
                    }
                />
            </Show>
        </div>
    );
};
