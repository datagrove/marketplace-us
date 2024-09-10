import Modal from "@components/common/notices/modal";
import { getLangFromUrl, useTranslations } from "@i18n/utils";
import type { Review } from "@lib/types";
import type { Session } from "@supabase/supabase-js";
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

//Refactor this should be a prop passed all the way from the Astro page
const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

export const ReviewPurchasedResource: Component<Props> = (props) => {
    const [overallRating, setOverallRating] = createSignal<string>("");
    const [reviewTitle, setReviewTitle] = createSignal<string>("");
    const [reviewText, setReviewText] = createSignal<string>("");
    const [formData, setFormData] = createSignal<FormData>();
    const [response] = createResource(formData, postFormData);
    const [totalReviews, setTotalReviews] = createSignal(0);
    const [reviewsData, setReviewsData] = createSignal([]);
    const [loading, setLoading] = createSignal(true);
    const [totalRatingOfPost, setTotalRatingOfPost] = createSignal(0);
    const [showReviewForm, setShowReviewForm] = createSignal(false);

    onMount(async () => {
        try {
            //Refactor: We aren't going to want to load all the reviews every time, probably need pagination
            //So we will need to do checks like "has this been reviewed by this user" on the server/API call
            const data = await fetchPostReviews(props.resourceId.toString());
            setReviewsData(data.body);
        } catch (err) {
            console.error(err);
        } finally {
            const arrayLength = () => reviewsData().length;
            if (arrayLength() === 0) {
                setShowReviewForm(true);
                setLoading(false);
                return;
            }
            reviewsData().map((review: Review) => {
                if (review.reviewer_id === props.userId) {
                    console.log("already has a review");
                    return;
                } else {
                    setShowReviewForm(true);
                }
            });

            // Set loading to false after fetch is complete
            setLoading(false);
            setTotalReviews(arrayLength);
            // Refactor: I would like to see this done on the server as part of the fetch if possible I think it will probably be faster
            // plus we won't want to return every single review but we will need to use them all to calculate this.
            // Might need to use a SQL query of some kind to store the average for the post in the view? Calculating this continually will be slow.
            if (arrayLength() > 0) {
                reviewsData().map((review: Review) => {
                    setTotalRatingOfPost(
                        review.overall_rating + totalRatingOfPost()
                    );
                });
                setTotalRatingOfPost(totalRatingOfPost() / totalReviews());
                setTotalRatingOfPost(Math.round(totalRatingOfPost() * 2) / 2);
            }
        }
    });

    function submit(e: SubmitEvent) {
        e.preventDefault();

        const formData = new FormData(e.target as HTMLFormElement);
        formData.append("review_title", reviewTitle());
        formData.append("review_text", reviewText());
        formData.append("overall_rating", overallRating());
        formData.append("resource_id", props.resourceId.toString());
        formData.append("user_id", props.userId);
        formData.append("refresh_token", props.ref);
        formData.append("access_token", props.access ? props.access : "");
        setFormData(formData);
    }

    return (
        <div>
            <div>
                {loading() && <p>Loading reviews...</p>}
                {!loading() && (
                    <>
                        <h2>Total Reviews: {totalReviews()} </h2>
                        <h2>Percentage of Reviews: {totalRatingOfPost()}</h2>
                    </>
                )}
            </div>

            <Show when={showReviewForm() === true}>
                <Modal
                    // TODO Internationalize Heading and button content
                    heading={"Submit Review"}
                    buttonClass="btn-primary"
                    buttonContent={"Submit Review"}
                    buttonId="submitReview"
                    children={
                        <>
                            <form onSubmit={submit}>
                                <div class="mb-4 mt-2 text-center text-xs">
                                    <span class="text-alert1">* </span>
                                    <span class="italic">
                                        {t("formLabels.required")}
                                    </span>
                                </div>

                                <div class="">
                                    <div class="flex flex-row justify-between">
                                        <label
                                            for="overallRating"
                                            class="text-ptext1 dark:text-ptext1-DM"
                                        >
                                            Overall Rating
                                            {/* {t("")}: */}
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

                                            <span class="invisible absolute m-4 mx-auto w-48 -translate-x-full -translate-y-2/3 rounded-md bg-background2 p-2 text-sm text-ptext2 transition-opacity peer-hover:visible dark:bg-background2-DM dark:text-ptext2-DM md:translate-x-1/4 md:translate-y-0">
                                                overallRating
                                                {/* {t("")} */}
                                            </span>
                                        </div>
                                    </div>
                                    <input
                                        type="number"
                                        id=""
                                        name="overallRating"
                                        class="bg-background mb-4 w-full rounded border border-inputBorder1 px-1 text-ptext1 focus:border-2 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM dark:focus:border-highlight1-DM"
                                        oninput={(e) =>
                                            setOverallRating(e.target.value)
                                        }
                                    />
                                </div>

                                <div class="">
                                    <div class="flex flex-row justify-between">
                                        <label
                                            for="Review Title"
                                            class="text-ptext1 dark:text-ptext1-DM"
                                        >
                                            Review Title
                                            {/* {t("")}: */}
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
                                                {/* {t("")} */}
                                            </span>
                                        </div>
                                    </div>
                                    <input
                                        type="text"
                                        id="reviewTitle"
                                        name="reviewTitle"
                                        class="bg-background mb-4 w-full rounded border border-inputBorder1 px-1 text-ptext1 focus:border-2 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM dark:focus:border-highlight1-DM"
                                        oninput={(e) =>
                                            setReviewTitle(e.target.value)
                                        }
                                    />
                                </div>

                                <div class="">
                                    <div class="flex flex-row justify-between">
                                        <label
                                            for="reviewText"
                                            class="text-ptext1 dark:text-ptext1-DM"
                                        >
                                            Review Text
                                            {/* {t("")}: */}
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
                                                {/* {t("")} */}
                                            </span>
                                        </div>
                                    </div>
                                    <input
                                        type="text"
                                        id="reviewText"
                                        name="reviewText"
                                        class="bg-background mb-4 w-full rounded border border-inputBorder1 px-1 text-ptext1 focus:border-2 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM dark:focus:border-highlight1-DM"
                                        oninput={(e) =>
                                            setReviewText(e.target.value)
                                        }
                                    />
                                </div>
                                <div>
                                    <button>
                                        <input
                                            type="submit"
                                            value={"Submit Review"}
                                        />
                                    </button>
                                </div>

                                <Suspense>
                                    {response() && (
                                        <p class="mt-2 text-center font-bold text-alert1 dark:text-alert1-DM">
                                            {/* {response().message} */}
                                            Submitted
                                        </p>
                                    )}
                                </Suspense>
                            </form>
                        </>
                    }
                />
            </Show>
        </div>
    );
};
