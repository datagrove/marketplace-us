import type { Component } from "solid-js";
import {
    createSignal,
    createEffect,
    Show,
    createResource,
    onMount,
    onCleanup,
    Suspense,
} from "solid-js";
import supabase from "../../lib/supabaseClient";
import type { AuthSession } from "@supabase/supabase-js";
import UserImage from "./UserImage";
import { ui } from "../../i18n/ui";
import type { uiObject } from "../../i18n/uiType";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";
import type { User } from "@lib/types";
import type { Post } from "@lib/types";
import { ViewCard } from "@components/services/ViewCard";
import stripe from "@lib/stripe";
import { ViewUserPurchases } from "@components/posts/ViewUserPurchases";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

//get the categories from the language files so they translate with changes in the language picker
const values = ui[lang] as uiObject;
const productCategories = values.subjectCategoryInfo.subjects;

async function postFormData(formData: FormData) {
    const response = await fetch("/api/userProfileEdit", {
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

if (UserError) {
    console.log("UserError: ", UserError.code + " " + UserError.message);
}

interface Props {
    user: User | null;
    userImage: string | undefined;
    editMode: boolean;
    enableEditMode: () => void;
}

export const UserProfileViewMobile: Component<Props> = (props: Props) => {
    // const [user, setUser] = createSignal<User>();
    // const [session, setSession] = createSignal<AuthSession | null>(null);
    // const [userImage, setUserImage] = createSignal<string>();
    // const [editMode, setEditMode] = createSignal<boolean>(false); //TODO Set back to false
    const [imageUrl, setImageUrl] = createSignal<string | null>(null);
    const [purchasedItems, setPurchasedItems] = createSignal<Array<Post>>([]);
    const [tabSelected, setTabSelected] = createSignal<string>("profile");

    const resetPassword = () => {
        window.location.href = `/${lang}/password/reset`;
    };

    const tabClick = (e: Event) => {
        e.preventDefault();

        let profileLink = document.getElementById(
            "user-profile-mobile-tab-profile-link"
        );
        let purchaseLink = document.getElementById(
            "user-profile-mobile-tab-purchases-link"
        );
        let favoritesLink = document.getElementById(
            "user-profile-mobile-tab-favorites-link"
        );
        let followingLink = document.getElementById(
            "user-profile-mobile-tab-following-link"
        );
        let allLinks = document.getElementsByClassName(
            "user-profile-mobile-tab-link"
        );

        const element = e.currentTarget as HTMLElement;
        const currElID = element.id;

        let currEl = document.getElementById(currElID);

        Array.from(allLinks).forEach(function (link) {
            link.classList.remove("border-b-2");
            link.classList.remove("border-green-500");
        });

        if (currElID === "user-profile-mobile-tab-profile-link") {
            setTabSelected("profile");

            currEl?.classList.add("border-b-2");
            currEl?.classList.add("border-green-500");
        } else if (currElID === "user-profile-mobile-tab-purchases-link") {
            setTabSelected("purchases");

            currEl?.classList.add("border-b-2");
            currEl?.classList.add("border-green-500");
        } else if (currElID === "user-profile-mobile-tab-favorites-link") {
            setTabSelected("favorites");

            currEl?.classList.add("border-b-2");
            currEl?.classList.add("border-green-500");
        } else if (currElID === "user-profile-mobile-tab-following-link") {
            setTabSelected("following");

            currEl?.classList.add("border-b-2");
            currEl?.classList.add("border-green-500");
        } else if (currElID === "user-profile-mobile-settings-btn") {
            setTabSelected("settings");
        }
    };

    //TODO: Edit profile button is hidden until we enable users editing their profile
    //TODO: Style improvement - when boxes are collapsed in mobile view they are narrower than when they are expanded might be nice to keep it the same size

    return (
        <div class="container">
            <div class="relative mb-6 h-24 bg-background2-DM dark:bg-background2-DM">
                <div class="absolute left-3 top-3 flex h-28 w-28 items-center justify-center rounded-full border border-border2 bg-background2 text-center dark:border-border2 dark:bg-background2-DM">
                    <p class="dark:ptext2-DM text-5xl text-ptext2">
                        {props.user?.first_name.slice(0, 1)}
                        {props.user?.last_name.slice(0, 1)}
                    </p>
                </div>
            </div>
            {/* Profile Information for Mobile View */}
            <div class="p-4">
                <div class="flex">
                    <Show when={props.user?.display_name}>
                        <h1 class="text-2xl font-bold">
                            {props.user?.display_name}
                        </h1>
                    </Show>

                    <Show when={!props.user?.display_name}>
                        <h1 class="text-2xl font-bold">
                            {props.user?.first_name} {props.user?.last_name}
                        </h1>
                    </Show>

                    <Show when={props.editMode === false}>
                        <button class="ml-2" onclick={props.enableEditMode}>
                            <svg
                                width="25px"
                                height="25px"
                                viewBox="0 0 24 24"
                                fill="none"
                                class="fill-icon1 stroke-icon2 dark:fill-icon1-DM dark:stroke-icon2-DM"
                            >
                                <path
                                    d="M13.0207 5.82839L15.8491 2.99996L20.7988 7.94971L17.9704 10.7781M13.0207 5.82839L3.41405 15.435C3.22652 15.6225 3.12116 15.8769 3.12116 16.1421V20.6776H7.65669C7.92191 20.6776 8.17626 20.5723 8.3638 20.3847L17.9704 10.7781M13.0207 5.82839L17.9704 10.7781"
                                    stroke="none"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                        </button>
                    </Show>

                    <Show when={props.editMode === true}>
                        <button
                            class="ml-2"
                            type="submit"
                            form="editProfile"
                            // onclick={ props.enableEditMode }
                        >
                            <svg
                                width="25px"
                                height="25px"
                                viewBox="0 0 24 24"
                                role="img"
                                aria-labelledby="saveIconTitle"
                                stroke="none"
                                stroke-width="1"
                                stroke-linecap="square"
                                stroke-linejoin="miter"
                                fill="none"
                                color="none"
                                class="fill-icon1 stroke-icon2 dark:fill-icon1-DM dark:stroke-icon2-DM"
                            >
                                <path d="M17.2928932,3.29289322 L21,7 L21,20 C21,20.5522847 20.5522847,21 20,21 L4,21 C3.44771525,21 3,20.5522847 3,20 L3,4 C3,3.44771525 3.44771525,3 4,3 L16.5857864,3 C16.8510029,3 17.1053568,3.10535684 17.2928932,3.29289322 Z" />{" "}
                                <rect width="10" height="8" x="7" y="13" />{" "}
                                <rect width="8" height="5" x="8" y="3" />
                            </svg>
                        </button>
                    </Show>
                </div>

                <div class="user-profile-tabs my-4 flex items-center justify-between border-b border-gray-300 pb-2">
                    <div class="">
                        <a
                            id="user-profile-mobile-tab-profile-link"
                            class="user-profile-mobile-tab-link mr-4 border-b-2 border-green-500 text-sm font-bold"
                            onClick={(e) => tabClick(e)}
                        >
                            {t("menus.profile")}
                        </a>
                        <a
                            id="user-profile-mobile-tab-purchases-link"
                            class="user-profile-mobile-tab-link mr-4 text-sm font-bold"
                            onClick={(e) => tabClick(e)}
                        >
                            {t("menus.purchases")}
                        </a>
                        {/* TODO: Add favorites and following tab when implemented
                        <a
                            id="user-profile-mobile-tab-favorites-link"
                            class="user-profile-mobile-tab-link mr-4 text-sm font-bold"
                            onClick={(e) => tabClick(e)}
                        >
                            {t("menus.favorites")}
                        </a>
                        <a
                            id="user-profile-mobile-tab-following-link"
                            class="user-profile-mobile-tab-link mr-4 text-sm font-bold"
                            onClick={(e) => tabClick(e)}
                        >
                            {t("menus.following")}
                        </a> 
                        */}
                    </div>

                    <button
                        id="user-profile-mobile-settings-btn"
                        class="flex items-center"
                        onClick={tabClick}
                    >
                        <svg
                            fill="none"
                            width="20px"
                            height="20px"
                            viewBox="0 0 50 50"
                            class="fill-icon1 dark:fill-icon1-DM"
                        >
                            <path d="M25 34c-5 0-9-4-9-9s4-9 9-9 9 4 9 9-4 9-9 9zm0-16c-3.9 0-7 3.1-7 7s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7z" />
                            <path d="M27.7 44h-5.4l-1.5-4.6c-1-.3-2-.7-2.9-1.2l-4.4 2.2-3.8-3.8 2.2-4.4c-.5-.9-.9-1.9-1.2-2.9L6 27.7v-5.4l4.6-1.5c.3-1 .7-2 1.2-2.9l-2.2-4.4 3.8-3.8 4.4 2.2c.9-.5 1.9-.9 2.9-1.2L22.3 6h5.4l1.5 4.6c1 .3 2 .7 2.9 1.2l4.4-2.2 3.8 3.8-2.2 4.4c.5.9.9 1.9 1.2 2.9l4.6 1.5v5.4l-4.6 1.5c-.3 1-.7 2-1.2 2.9l2.2 4.4-3.8 3.8-4.4-2.2c-.9.5-1.9.9-2.9 1.2L27.7 44zm-4-2h2.6l1.4-4.3.5-.1c1.2-.3 2.3-.8 3.4-1.4l.5-.3 4 2 1.8-1.8-2-4 .3-.5c.6-1 1.1-2.2 1.4-3.4l.1-.5 4.3-1.4v-2.6l-4.3-1.4-.1-.5c-.3-1.2-.8-2.3-1.4-3.4l-.3-.5 2-4-1.8-1.8-4 2-.5-.3c-1.1-.6-2.2-1.1-3.4-1.4l-.5-.1L26.3 8h-2.6l-1.4 4.3-.5.1c-1.2.3-2.3.8-3.4 1.4l-.5.3-4-2-1.8 1.8 2 4-.3.5c-.6 1-1.1 2.2-1.4 3.4l-.1.5L8 23.7v2.6l4.3 1.4.1.5c.3 1.2.8 2.3 1.4 3.4l.3.5-2 4 1.8 1.8 4-2 .5.3c1.1.6 2.2 1.1 3.4 1.4l.5.1 1.4 4.3z" />
                        </svg>
                    </button>
                </div>

                {/* <h2 class="text-xl font-bold text-htext1 dark:text-htext1-DM">
                    {props.user?.display_name === null
                        ? props.user?.first_name +
                            " " +
                            props.user?.last_name
                        : props.user?.display_name}
                </h2> */}

                <Show when={tabSelected() === "profile"}>
                    <div class="first-name flex w-full flex-wrap">
                        <label
                            for="FirstName"
                            class="font-bold text-ptext1 dark:text-ptext1-DM"
                        >
                            {t("formLabels.firstName")}: &nbsp
                        </label>

                        <Show when={props.editMode === false}>
                            <div class="flex ">
                                <p id="FirstName" class="mb-4 w-full">
                                    {props.user?.first_name}
                                </p>
                            </div>
                        </Show>

                        <Show when={props.editMode === true}>
                            <div class="flex">
                                <input
                                    type="text"
                                    id="FirstName"
                                    name="FirstName"
                                    class="mb-4 w-full rounded border border-inputBorder1 bg-background1 px-1 text-ptext1 focus:border-2 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM dark:focus:border-highlight1-DM"
                                    value={props.user?.first_name}
                                    required
                                />
                            </div>
                        </Show>
                    </div>

                    <div class="last-name flex flex-wrap ">
                        <label
                            for="LastName"
                            class="font-bold text-ptext1 dark:text-ptext1-DM"
                        >
                            {t("formLabels.lastName")}: &nbsp
                        </label>

                        <Show when={props.editMode === false}>
                            <p id="LastName" class="mb-4 ">
                                {props.user?.last_name}
                            </p>
                        </Show>

                        <Show when={props.editMode === true}>
                            <div class="">
                                <input
                                    type="text"
                                    id="LastName"
                                    name="LastName"
                                    class="mb-4 w-full rounded border border-inputBorder1 bg-background1 px-1 text-ptext1 focus:border-2 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM dark:focus:border-highlight1-DM"
                                    value={props.user?.last_name}
                                />
                            </div>
                        </Show>
                    </div>

                    <div class="user-displayName flex flex-wrap">
                        <label
                            for="DisplayName"
                            class="font-bold text-ptext1 dark:text-ptext1-DM"
                        >
                            {t("formLabels.displayName")}: &nbsp
                        </label>

                        <Show when={props.editMode === false}>
                            <p id="DisplayName" class="mb-4 ">
                                {props.user?.display_name
                                    ? props.user?.display_name
                                    : props.user?.first_name +
                                      " " +
                                      props.user?.last_name}
                            </p>
                        </Show>

                        <Show when={props.editMode === true}>
                            <div class="">
                                <input
                                    type="text"
                                    id="DisplayName"
                                    name="DisplayName"
                                    class="mb-4 w-full rounded border border-inputBorder1 bg-background1 px-1 text-ptext1 focus:border-2 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM dark:focus:border-highlight1-DM"
                                    value={props.user?.display_name}
                                />
                            </div>
                        </Show>
                    </div>

                    <div class="email-add flex flex-wrap">
                        <label
                            for="email"
                            class="font-bold text-ptext1 dark:text-ptext1-DM"
                        >
                            {t("formLabels.email")}: &nbsp
                        </label>

                        <Show when={props.editMode === false}>
                            <div class="">
                                <p id="email" class="mb-4 overflow-auto">
                                    {props.user?.email}
                                </p>
                            </div>
                        </Show>

                        <Show when={props.editMode === true}>
                            <div class="">
                                <input
                                    id="email"
                                    name="email"
                                    class="mb-4 w-full rounded border border-inputBorder1 bg-background1 px-1 text-ptext1 focus:border-2 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM dark:focus:border-highlight1-DM"
                                    type="email"
                                    placeholder={t("formLabels.email")}
                                    value={props.user?.email}
                                />
                            </div>
                        </Show>
                    </div>

                    <div>
                        <Show when={props.editMode === false}>
                            <button
                                class="btn-primary font-bold"
                                onClick={resetPassword}
                            >
                                {t("buttons.resetPassword")}
                            </button>
                        </Show>
                    </div>
                </Show>

                <Show when={tabSelected() === "purchases"}>
                    <div>
                        <ViewUserPurchases />
                    </div>
                </Show>

                <Show when={tabSelected() === "favorites"}>
                    <p class="italic">{t("messages.comingSoon")}</p>
                </Show>

                <Show when={tabSelected() === "following"}>
                    <p class="italic">{t("messages.comingSoon")}</p>
                </Show>

                <Show when={tabSelected() === "settings"}>
                    <p class="italic">{t("messages.comingSoon")}</p>
                </Show>

                {/* <div class="align-items-center mb-2 mt-4 flex items-center justify-center">
                    <Show when={props.editMode === true}>
                        <button
                            class="btn-primary"
                            type="submit"
                            form="editProfile"
                        >
                            {t("buttons.saveProfile")}
                        </button>
                    </Show>
                </div> */}
            </div>
        </div>
    );
};
