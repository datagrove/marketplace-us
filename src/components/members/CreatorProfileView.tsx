import type { Component } from "solid-js";
import {
    createSignal,
    createEffect,
    Show,
    Suspense,
    onMount,
    onCleanup,
    createResource,
    For,
} from "solid-js";
import supabase from "../../lib/supabaseClient";
import { ViewCreatorPosts } from "../posts/ViewCreatorPosts";
import type { AuthSession } from "@supabase/supabase-js";
import UserImage from "./UserImage";
import { ui } from "../../i18n/ui";
import type { uiObject } from "../../i18n/uiType";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";
import { createStore } from "solid-js/store";
import { StripeButton } from "@components/members/creator/StripeButton";
import { PayoutButton } from "@components/members/creator/PayoutButton";
import { MobileViewCard } from "@components/services/MobileViewCard";
import type { Creator } from "@lib/types";
import { TinyComp } from "@components/posts/TinyComp";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

//get the categories from the language files so they translate with changes in the language picker
const values = ui[lang] as uiObject;
const productCategories = values.subjectCategoryInfo.subjects;

async function postFormData(formData: FormData) {
    const response = await fetch("/api/creatorProfileEdit", {
        method: "POST",
        body: formData,
    });
    const data = await response.json();
    //Checks the API response for the redirect and sends them to the redirect page if there is one
    if (data.redirect) {
        alert(data.message);
        window.location.href = `/${lang}` + data.redirect;
    }
    return data;
}

const { data: User, error: UserError } = await supabase.auth.getSession();

export const CreatorProfileView: Component = () => {
    const [creator, setCreator] = createSignal<Creator>();
    const [session, setSession] = createSignal<AuthSession | null>(null);
    const [creatorImage, setCreatorImage] = createSignal<string>("");
    const [editMode, setEditMode] = createSignal<boolean>(false); //TODO Set back to false
    const [imageUrl, setImageUrl] = createSignal<string | null>(null);
    const [screenSize, setScreenSize] = createSignal<
        "sm" | "md" | "lg" | "xl" | "2xl"
    >();
    const [formData, setFormData] = createSignal<FormData>();
    const [response] = createResource(formData, postFormData);
    const [mode, setMode] = createStore({
        theme: localStorage.getItem("theme"),
    });

    onMount(() => {
        setSession(User.session);
        if (typeof session() === "undefined") {
            alert(t("messages.signIn"));
        }
    });

    createEffect(() => {
        setSession(User.session);
        if (typeof session() !== "undefined") {
            fetchCreator(session()?.user.id!);
        }
    });

    const resetPassword = () => {
        window.location.href = `/${lang}/password/reset`;
    };

    const fetchCreator = async (user_id: string) => {
        if (session()) {
            try {
                const { data, error } = await supabase
                    .from("sellerview")
                    .select("*")
                    .eq("user_id", user_id);
                console.log(data);

                if (error) {
                    console.log(error);
                } else if (data[0] === undefined) {
                    alert(t("messages.noCreator"));
                    location.href = `/${lang}/creator/createaccount`;
                } else {
                    setCreator(data[0]);
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            alert(t("messages.signIn"));
            location.href = `/${lang}/login`;
        }
    };

    function creatorViewTabClick(e: Event) {
        e.preventDefault();

        let currLinkId = (e!.currentTarget as HTMLAnchorElement)!.id;
        console.log(currLinkId);
        // let currLinkId = e.currentTarget?.id;
        let currEl = document.getElementById(currLinkId);
        let allLgLinks = document.getElementsByClassName(
            "creatorViewtabLinkLg"
        );

        let profile = document.getElementById("creatorViewProfile");
        let resources = document.getElementById("creatorViewResources");
        let ratings = document.getElementById("creatorViewRatings");
        let questions = document.getElementById("creatorViewQuestions");
        let downloads = document.getElementById("creatorViewDownload");
        let payouts = document.getElementById("creatorViewPayouts");

        if (!currEl?.classList.contains("border-b-2")) {
            Array.from(allLgLinks).forEach(function (link) {
                link.classList.remove("border-b-2");
                link.classList.remove("border-green-500");
            });

            currEl?.classList.add("border-b-2");
            currEl?.classList.add("border-green-500");
        }

        if (currLinkId === "creatorViewProfileLink") {
            profile?.classList.remove("hidden");
            profile?.classList.add("inline");

            closeResources();
            closeRatings();
            closeQuestions();
            closeDownloads();
            closePayouts();
        } else if (currLinkId === "creatorViewResourcesLink") {
            resources?.classList.remove("hidden");
            resources?.classList.add("inline");

            closeProfile();
            closeRatings();
            closeQuestions();
            closeDownloads();
            closePayouts();
        } else if (currLinkId === "creatorViewRatingsLink") {
            ratings?.classList.remove("hidden");
            ratings?.classList.add("inline");

            closeProfile();
            closeResources();
            closeQuestions();
            closeDownloads();
            closePayouts();
        } else if (currLinkId === "creatorViewQuestionsLink") {
            questions?.classList.remove("hidden");
            questions?.classList.add("inline");

            closeProfile();
            closeRatings();
            closeResources();
            closeDownloads();
            closePayouts();
        } else if (currLinkId === "creatorViewDownloadLink") {
            downloads?.classList.remove("hidden");
            downloads?.classList.add("inline");

            closeProfile();
            closeRatings();
            closeResources();
            closeQuestions();
            closePayouts();
        } else if (currLinkId === "creatorViewPayoutsLink") {
            payouts?.classList.remove("hidden");
            payouts?.classList.add("inline");

            closeProfile();
            closeRatings();
            closeResources();
            closeQuestions();
            closeDownloads();
        }
    }

    function closeProfile() {
        let profile = document.getElementById("creatorViewProfile");

        if (profile?.classList.contains("inline")) {
            profile?.classList.remove("inline");
            profile?.classList.add("hidden");
        }
    }

    function closeResources() {
        let resources = document.getElementById("creatorViewResources");

        if (resources?.classList.contains("inline")) {
            resources.classList.remove("inline");
            resources.classList.add("hidden");
        }
    }

    function closeRatings() {
        let ratings = document.getElementById("creatorViewRatings");

        if (ratings?.classList.contains("inline")) {
            ratings.classList.remove("inline");
            ratings.classList.add("hidden");
        }
    }

    function closeQuestions() {
        let questions = document.getElementById("creatorViewQuestions");

        if (questions?.classList.contains("inline")) {
            questions.classList.remove("inline");
            questions.classList.add("hidden");
        }
    }

    function closeDownloads() {
        let downloads = document.getElementById("creatorViewDownload");

        if (downloads?.classList.contains("inline")) {
            downloads.classList.remove("inline");
            downloads.classList.add("hidden");
        }
    }

    function closePayouts() {
        let payouts = document.getElementById("creatorViewPayouts");

        if (payouts?.classList.contains("inline")) {
            payouts.classList.remove("inline");
            payouts.classList.add("hidden");
        }
    }

    createEffect(async () => {
        if (creator() !== undefined) {
            if (
                creator()?.image_url === undefined ||
                creator()?.image_url === null
            ) {
            } else {
                await downloadImage(creator()?.image_url!);
                setImageUrl(creator()?.image_url!);
                console.log(imageUrl());
            }
        }
    });

    const downloadImage = async (image_Url: string) => {
        try {
            const { data, error } = await supabase.storage
                .from("user.image")
                .download(image_Url);
            if (error) {
                throw error;
            }
            const url = URL.createObjectURL(data);
            setCreatorImage(url);
        } catch (error) {
            console.log(error);
        }
    };

    const enableEditMode = (e: Event) => {
        console.log("in the enableEditMode function");
        // e.preventDefault();
        // e.stopPropagation();

        // setEditMode(!editMode());

        setEditMode(true);
    };

    function submit(e: SubmitEvent) {
        // e.preventDefault();
        console.log("In the submit function");
        const formData = new FormData(e.target as HTMLFormElement);

        for (let pair of formData?.entries()) {
            console.log("pair of entries");
            console.log(pair[0] + ", " + pair[1]);
        }
        formData.append("access_token", session()?.access_token!);
        formData.append("refresh_token", session()?.refresh_token!);
        formData.append("lang", lang);
        if (imageUrl() !== null) {
            formData.append("image_url", imageUrl()!);
        }
        setFormData(formData);

        // setEditMode(false);
    }

    function mountTiny() {
        TinyComp({ id: "#AboutContent", mode: mode.theme });
    }

    return (
        <div class="w-full">
            <form onSubmit={submit} id="creatorEditProfile" class="mx-1">
                <div
                    id="creator-view-header"
                    class="relative h-36 w-full bg-background2 dark:bg-background2-DM"
                >
                    <Show when={editMode() === false}>
                        <Show when={creatorImage()}>
                            <div class="absolute left-4 top-6 flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border-2 border-gray-400 bg-background2 object-contain dark:bg-background2-DM md:left-12">
                                <img
                                    src={creatorImage()}
                                    class="absolute left-1/2 top-1/2 block h-56 -translate-x-1/2 -translate-y-1/2 justify-center object-contain md:h-96"
                                    alt={`${t("postLabels.creatorProfileImage")} 1`}
                                />
                            </div>
                        </Show>

                        <Show when={!creatorImage()}>
                            <div class="absolute left-4 top-6 flex h-36 w-36 items-center justify-center rounded-full border-2 border-gray-400 bg-background2 dark:bg-background2-DM md:left-12">
                                <svg
                                    width="120px"
                                    height="120px"
                                    viewBox="0 0 48 48"
                                    version="1.1"
                                    class="fill-icon2 dark:fill-icon2-DM"
                                >
                                    <g
                                        id="🔍-System-Icons"
                                        stroke="none"
                                        stroke-width="1"
                                        fill="none"
                                        fill-rule="evenodd"
                                        class="fill-icon2 dark:fill-icon2-DM"
                                    >
                                        <g
                                            fill="none"
                                            fill-rule="nonzero"
                                            class="fill-icon2 dark:fill-icon2-DM"
                                        >
                                            <path
                                                d="M35.7502,28 C38.0276853,28 39.8876578,29.7909151 39.9950978,32.0427546 L40,32.2487 L40,33 C40,36.7555 38.0583,39.5669 35.0798,41.3802 C32.1509,43.1633 28.2139,44 24,44 C19.7861,44 15.8491,43.1633 12.9202,41.3802 C10.0319285,39.6218485 8.11862909,36.9249713 8.00532378,33.3388068 L8,33 L8,32.2489 C8,29.9703471 9.79294995,28.1122272 12.0440313,28.0048972 L12.2499,28 L35.7502,28 Z M24,4 C29.5228,4 34,8.47715 34,14 C34,19.5228 29.5228,24 24,24 C18.4772,24 14,19.5228 14,14 C14,8.47715 18.4772,4 24,4 Z"
                                                id="🎨-Color"
                                            ></path>
                                        </g>
                                    </g>
                                </svg>
                            </div>
                        </Show>
                    </Show>

                    <Show when={editMode() === true}>
                        <div class="absolute left-4 top-6 md:left-12">
                            <UserImage
                                url={imageUrl()}
                                size={150}
                                onUpload={(e: Event, url: string) => {
                                    setImageUrl(url);
                                }}
                            />
                        </div>
                    </Show>
                </div>

                <div class="flex justify-end">
                    <Show when={editMode() === true}>
                        <button
                            type="submit"
                            form="creatorEditProfile"
                            class=""
                        >
                            <svg
                                width="60px"
                                height="60px"
                                viewBox="0 0 24 24"
                                role="img"
                                aria-labelledby="saveIconTitle"
                                stroke="none"
                                stroke-width="1"
                                stroke-linecap="square"
                                stroke-linejoin="miter"
                                fill="none"
                                color="none"
                                class="fill-icon1 stroke-icon2 dark:fill-icon1-DM dark:stroke-icon1 xl:h-[50px] xl:w-[50px]"
                            >
                                <path d="M17.2928932,3.29289322 L21,7 L21,20 C21,20.5522847 20.5522847,21 20,21 L4,21 C3.44771525,21 3,20.5522847 3,20 L3,4 C3,3.44771525 3.44771525,3 4,3 L16.5857864,3 C16.8510029,3 17.1053568,3.10535684 17.2928932,3.29289322 Z" />{" "}
                                <rect width="10" height="8" x="7" y="13" />{" "}
                                <rect width="8" height="5" x="8" y="3" />
                            </svg>
                        </button>
                    </Show>
                </div>

                <div class="text-center font-bold italic text-alert1 underline dark:text-alert1-DM md:mt-2 md:text-end">
                    <Show when={editMode() === true}>
                        <h1 class="mt-[12px] text-alert1 dark:text-alert1-DM">
                            {t("messages.profileEdits")}
                        </h1>
                    </Show>
                </div>

                <div
                    id="creator-view-username-reviews-edit"
                    class="mt-4 w-full md:mt-10"
                >
                    <Show when={!editMode()}>
                        <div class="mb-2 flex justify-end md:hidden">
                            <button
                                class="btn-primary flex w-1/2 items-center justify-center"
                                onClick={() =>
                                    (window.location.href = `/${lang}/posts/createpost`)
                                }
                            >
                                <svg
                                    fill="none"
                                    width="20px"
                                    height="20px"
                                    viewBox="0 0 1920 1920"
                                    class="fill-icon2 pr-1 dark:fill-icon1"
                                >
                                    <path
                                        d="M915.744 213v702.744H213v87.842h702.744v702.744h87.842v-702.744h702.744v-87.842h-702.744V213z"
                                        fill-rule="evenodd"
                                    />
                                </svg>
                                <p class="pl-1 text-lg font-light">
                                    {t("pageTitles.createPost")}
                                </p>
                            </button>
                        </div>
                    </Show>

                    <div class="flex items-center md:grid md:grid-cols-[525px_50px_150px] lg:grid-cols-[750px_50px_150px] xl:grid-cols-[900px_50px_200px]">
                        <div class="creator-name-edit-button-div">
                            <Show when={editMode() === false}>
                                <div class="mr-2 md:mr-0">
                                    <h2 class="line-clamp-2 text-lg font-bold lg:text-2xl">
                                        {creator()?.seller_name == ""
                                            ? creator()?.first_name +
                                              " " +
                                              creator()?.last_name
                                            : creator()?.seller_name}
                                    </h2>
                                </div>
                            </Show>

                            <Show when={editMode() === true}>
                                <div class="basis-full">
                                    <label
                                        for="SellerName"
                                        class="font-bold text-ptext1 dark:text-ptext1-DM"
                                    >
                                        {t("formLabels.creatorName")}: &nbsp;
                                    </label>
                                    <input
                                        type="text"
                                        id="CreatorName"
                                        name="CreatorName"
                                        class="my-4 rounded border border-inputBorder1 bg-background1 px-1 text-ptext1 focus:border-2 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM dark:focus:border-highlight1-DM"
                                        value={creator()?.seller_name}
                                    />
                                </div>
                            </Show>
                        </div>

                        <div
                            id="creator-edit-btn-div"
                            class="flex items-center justify-center"
                        >
                            <Show when={!editMode()}>
                                <button onClick={enableEditMode} class="">
                                    <svg
                                        width="30px"
                                        height="30px"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        id="pencil-svg"
                                        class="fill-icon1 stroke-icon2 dark:fill-icon1-DM dark:stroke-icon2-DM xl:h-[50px] xl:w-[50px]"
                                    >
                                        <path
                                            d="M13.0207 5.82839L15.8491 2.99996L20.7988 7.94971L17.9704 10.7781M13.0207 5.82839L3.41405 15.435C3.22652 15.6225 3.12116 15.8769 3.12116 16.1421V20.6776H7.65669C7.92191 20.6776 8.17626 20.5723 8.3638 20.3847L17.9704 10.7781M13.0207 5.82839L17.9704 10.7781"
                                            stroke="none"
                                            stroke-width="4.5"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                    </svg>
                                </button>
                            </Show>

                            {/* <Show when={ editMode() === true && window.screen.width < 768 }>
                            <button
                                type="submit"
                                form="creatorEditProfile"
                                class="border-2 border-yellow-400"
                            >
                                <svg width="30px" height="30px" viewBox="0 0 24 24" id="large-save-icon" role="img" aria-labelledby="saveIconTitle" stroke="none" stroke-width="1" stroke-linecap="square" stroke-linejoin="miter" fill="none" color="none" class="stroke-icon2 dark:stroke-icon1 fill-icon1 dark:fill-icon1-DM xl:w-[50px] xl:h-[50px]"> 
                                    <path d="M17.2928932,3.29289322 L21,7 L21,20 C21,20.5522847 20.5522847,21 20,21 L4,21 C3.44771525,21 3,20.5522847 3,20 L3,4 C3,3.44771525 3.44771525,3 4,3 L16.5857864,3 C16.8510029,3 17.1053568,3.10535684 17.2928932,3.29289322 Z"/> <rect width="10" height="8" x="7" y="13"/> <rect width="8" height="5" x="8" y="3"/> 
                                </svg>
                            </button>
                        </Show> */}
                        </div>

                        <div class="create-post-div hidden w-full items-center justify-end md:flex">
                            <button
                                class="btn-primary flex w-full items-center justify-center "
                                onClick={() =>
                                    (window.location.href = `/${lang}/posts/createpost`)
                                }
                            >
                                <svg
                                    fill="none"
                                    width="20px"
                                    height="20px"
                                    viewBox="0 0 1920 1920"
                                    class="fill-icon2 pr-1 dark:fill-icon1"
                                >
                                    <path
                                        d="M915.744 213v702.744H213v87.842h702.744v702.744h87.842v-702.744h702.744v-87.842h-702.744V213z"
                                        fill-rule="evenodd"
                                    />
                                </svg>
                                <p class="pl-1 text-lg font-light ">
                                    {t("pageTitles.createPost")}
                                </p>
                            </button>
                        </div>
                    </div>

                    <div
                        id="creator-view-reviews-div"
                        class="flex items-center"
                    >
                        <div
                            id="creator-view-ratings-stars-div"
                            class="mr-2 flex w-fit"
                        >
                            <svg
                                fill="none"
                                width="20px"
                                height="20px"
                                viewBox="0 0 32 32"
                                class="fill-icon1 dark:fill-icon1-DM"
                            >
                                <path d="M 30.335938 12.546875 L 20.164063 11.472656 L 16 2.132813 L 11.835938 11.472656 L 1.664063 12.546875 L 9.261719 19.394531 L 7.140625 29.398438 L 16 24.289063 L 24.859375 29.398438 L 22.738281 19.394531 Z" />
                            </svg>

                            <svg
                                fill="none"
                                width="20px"
                                height="20px"
                                viewBox="0 0 32 32"
                                class="fill-icon1 dark:fill-icon1-DM"
                            >
                                <path d="M 30.335938 12.546875 L 20.164063 11.472656 L 16 2.132813 L 11.835938 11.472656 L 1.664063 12.546875 L 9.261719 19.394531 L 7.140625 29.398438 L 16 24.289063 L 24.859375 29.398438 L 22.738281 19.394531 Z" />
                            </svg>

                            <svg
                                fill="none"
                                width="20px"
                                height="20px"
                                viewBox="0 0 32 32"
                                class="fill-icon1 dark:fill-icon1-DM"
                            >
                                <path d="M 30.335938 12.546875 L 20.164063 11.472656 L 16 2.132813 L 11.835938 11.472656 L 1.664063 12.546875 L 9.261719 19.394531 L 7.140625 29.398438 L 16 24.289063 L 24.859375 29.398438 L 22.738281 19.394531 Z" />
                            </svg>

                            <svg
                                fill="none"
                                width="20px"
                                height="20px"
                                viewBox="0 0 32 32"
                                class="fill-icon1 dark:fill-icon1-DM"
                            >
                                <path d="M 30.335938 12.546875 L 20.164063 11.472656 L 16 2.132813 L 11.835938 11.472656 L 1.664063 12.546875 L 9.261719 19.394531 L 7.140625 29.398438 L 16 24.289063 L 24.859375 29.398438 L 22.738281 19.394531 Z" />
                            </svg>

                            <svg
                                fill="none"
                                width="20px"
                                height="20px"
                                viewBox="0 0 32 32"
                                class="fill-icon1 dark:fill-icon1-DM"
                            >
                                <path d="M 30.335938 12.546875 L 20.164063 11.472656 L 16 2.132813 L 11.835938 11.472656 L 1.664063 12.546875 L 9.261719 19.394531 L 7.140625 29.398438 L 16 24.289063 L 24.859375 29.398438 L 22.738281 19.394531 Z" />
                            </svg>
                        </div>

                        <div id="creator-view-ratings-text-div" class="flex">
                            <p class="font-bold">4.9</p>
                            <p class="font-light">&nbsp (21.K)</p>
                        </div>
                    </div>
                </div>

                <div id="creator-view-tabs-content-div" class="mt-8 md:mt-2">
                    <div id="creator-view-tabs" class="mb-4 flex">
                        <a
                            href="#resourcesCreatorView"
                            id="creatorViewResourcesLink"
                            class="creatorViewtabLinkLg mr-2 inline border-b-2 border-green-500  md:mr-6 lg:mr-10"
                            onClick={creatorViewTabClick}
                        >
                            <p class="text-sm font-bold md:text-base lg:text-xl">
                                {t("menus.creatorResources")}
                            </p>
                        </a>
                        <a
                            href="#profileCreatorView"
                            id="creatorViewProfileLink"
                            class="creatorViewtabLinkLg mr-2 md:mr-6 lg:mr-10"
                            onClick={creatorViewTabClick}
                        >
                            <p class="text-sm font-bold md:text-base lg:text-xl">
                                {t("menus.profile")}
                            </p>
                        </a>
                        <a
                            href="#ratingsCreatorView"
                            id="creatorViewRatingsLink"
                            class="creatorViewtabLinkLg mr-2 hidden md:mr-6 lg:mr-10"
                            onClick={creatorViewTabClick}
                        >
                            <p class="text-sm font-bold md:text-base lg:text-xl">
                                {t("menus.reviews")}
                            </p>
                        </a>
                        <a
                            href="#questionsCreatorView"
                            id="creatorViewQuestionsLink"
                            class="creatorViewtabLinkLg mr-2 hidden md:mr-6 lg:mr-10"
                            onClick={creatorViewTabClick}
                        >
                            <p class="text-sm font-bold md:text-base lg:text-xl">
                                {t("menus.questions")}
                            </p>
                        </a>
                        {/* <a href="#downloadCreatorView" id="creatorViewDownloadLink" class="creatorViewtabLinkLg mr-2 md:mr-6 lg:mr-10" onClick={ creatorViewTabClick }><p class="text-sm md:text-base lg:text-xl font-bold">{t("menus.freeDownload")}</p></a> */}
                        <a
                            href="#payoutsCreatorView"
                            id="creatorViewPayoutsLink"
                            class="creatorViewtabLinkLg mr-2 md:mr-6 lg:mr-10"
                            onClick={creatorViewTabClick}
                        >
                            <p class="text-sm font-bold md:text-base lg:text-xl">
                                {t("menus.payouts")}
                            </p>
                        </a>
                    </div>

                    <div id="creatorViewResources" class="inline">
                        <ViewCreatorPosts />
                    </div>

                    <div id="creatorViewProfile" class="hidden">
                        <div class="first-name my-2 flex">
                            <label
                                for="FirstName"
                                class="font-bold text-ptext1 dark:text-ptext1-DM"
                            >
                                {t("formLabels.firstName")}: &nbsp;
                            </label>

                            <Show when={editMode() === false}>
                                <p id="FirstName" class="px-1">
                                    {creator()?.first_name}
                                </p>
                            </Show>

                            <Show when={editMode() === true}>
                                <div class="">
                                    <input
                                        type="text"
                                        id="FirstName"
                                        name="FirstName"
                                        class="rounded border border-inputBorder1 bg-background1 px-1 text-ptext1 focus:border-2 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM dark:focus:border-highlight1-DM"
                                        value={creator()?.first_name}
                                        required
                                    />
                                </div>
                            </Show>
                        </div>

                        <div class="last-name my-2 flex">
                            <label
                                for="LastName"
                                class="font-bold text-ptext1 dark:text-ptext1-DM"
                            >
                                {t("formLabels.lastName")}: &nbsp;
                            </label>

                            <Show when={editMode() === false}>
                                <p id="LastName" class="px-1">
                                    {creator()?.last_name}
                                </p>
                            </Show>

                            <Show when={editMode() === true}>
                                <div class="">
                                    <input
                                        type="text"
                                        id="LastName"
                                        name="LastName"
                                        class="rounded border border-inputBorder1 bg-background1 px-1 text-ptext1 focus:border-2 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM dark:focus:border-highlight1-DM"
                                        value={creator()?.last_name}
                                    />
                                </div>
                            </Show>
                        </div>

                        <div class="email my-2 flex">
                            <label
                                for="email"
                                class="font-bold text-ptext1 dark:text-ptext1-DM"
                            >
                                {t("formLabels.email")}: &nbsp;
                            </label>

                            <Show when={editMode() === false}>
                                <div class="flex">
                                    {/* <p class="font-bold">{t("formLabels.email")}:&nbsp;</p> */}
                                    <a href={`mailto:${creator()?.email}`}>
                                        <p>{creator()?.email}</p>
                                    </a>
                                </div>
                            </Show>

                            <Show when={editMode() === true}>
                                <div class="">
                                    <input
                                        id="email"
                                        name="email"
                                        class="rounded border border-inputBorder1 bg-background1 px-1 text-ptext1 focus:border-2 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM dark:focus:border-highlight1-DM"
                                        type="email"
                                        placeholder={t("formLabels.email")}
                                        value={creator()?.email}
                                    />
                                </div>
                            </Show>
                        </div>
                        <div class="about flex">
                            <label
                                for="about"
                                class="font-bold text-ptext1 dark:text-ptext1-DM"
                            >
                                {t("formLabels.about")}: &nbsp;
                            </label>

                            <Show when={editMode() === false}>
                                <p
                                    class="prose mr-1 line-clamp-3 text-xs text-ptext1 dark:prose-invert dark:text-ptext1-DM"
                                    innerHTML={creator()?.seller_about}
                                ></p>
                            </Show>

                            <Show when={editMode() === true}>
                                <div class="">
                                    <textarea
                                        id="AboutContent"
                                        name="AboutContent"
                                        class="w-full rounded border border-inputBorder1 bg-background1 px-1 text-ptext1 focus:border-2 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM  dark:focus:border-highlight1-DM "
                                        rows="10"
                                        ref={mountTiny}
                                        value={creator()?.seller_about}
                                    ></textarea>
                                </div>
                            </Show>

                            <Show when={editMode() === false}>
                                <button
                                    class="btn-primary font-bold"
                                    onClick={resetPassword}
                                >
                                    {t("buttons.resetPassword")}
                                </button>
                            </Show>
                        </div>
                    </div>

                    <div id="creatorViewRatings" class="hidden">
                        <p class="italic">{t("messages.comingSoon")}</p>
                    </div>

                    <div id="creatorViewQuestions" class="hidden">
                        <p class="italic">{t("messages.comingSoon")}</p>
                    </div>

                    <div id="creatorViewDownload" class="hidden">
                        <p class="italic">{t("messages.comingSoon")}</p>
                    </div>

                    <div id="creatorViewPayouts" class="hidden">
                        <div class="contribution my-2 flex">
                            <label
                                for="contribution"
                                class="font-bold text-ptext1 dark:text-ptext1-DM"
                            >
                                {t("formLabels.platformSupport")}: &nbsp;
                            </label>

                            <Show when={editMode() === false}>
                                <p id="contribution" class="px-1">
                                    {creator()?.contribution}%
                                </p>
                            </Show>

                            <Show when={editMode() === true}>
                                <div class="">
                                    <input
                                        type="number"
                                        min={0}
                                        max={100}
                                        step={1}
                                        id="contribution"
                                        name="contribution"
                                        class="rounded border border-inputBorder1 bg-background1 px-1 text-ptext1 focus:border-2 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM dark:focus:border-highlight1-DM"
                                        value={creator()?.contribution}
                                    />
                                    %
                                </div>
                            </Show>
                        </div>
                        <StripeButton />
                        <PayoutButton />
                    </div>
                </div>
                <Suspense>
                    {response() && (
                        <p class="mt-2 text-center font-bold text-alert1 dark:text-alert1-DM">
                            {response().message}
                        </p>
                    )}
                </Suspense>
            </form>
        </div>
    );
};
