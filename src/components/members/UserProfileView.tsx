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
import { ViewUserPurchases } from "@components/posts/ViewUserPurchases";
import stripe from "@lib/stripe";
import { UserProfileViewMobile } from "@components/members/UserProfileViewMobile";
import { useStore } from "@nanostores/solid";
import { windowSize } from "@components/common/WindowSizeStore";

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

export const UserProfileView: Component = () => {
    const [user, setUser] = createSignal<User>();
    const [session, setSession] = createSignal<AuthSession | null>(null);
    const [userImage, setUserImage] = createSignal<string>();
    const [editMode, setEditMode] = createSignal<boolean>(false); //TODO Set back to false
    const [imageUrl, setImageUrl] = createSignal<string | null>(null);
    const screenSize = useStore(windowSize);
    const [formData, setFormData] = createSignal<FormData>();
    const [response] = createResource(formData, postFormData);
    const [purchasedItems, setPurchasedItems] = createSignal<Array<Post>>([]);
    const [tabSelected, setTabSelected] = createSignal<string>("profile");

    onMount(async () => {
        console.log(User);
        setSession(User?.session);
        await fetchUser(User?.session?.user.id!);
        // await getPurchasedItems();
    });

    // createEffect(async () => {
    //   setSession(User.session);
    //   console.log(session());
    //   if (typeof session() !== "undefined") {
    //     await fetchUser(session()?.user.id!);
    //   }
    // });

    const getPurchasedItems = async () => {
        console.log("Session Info: ");
        console.log(session());
        const { data: orders, error } = await supabase
            .from("orders")
            .select("*")
            .eq("customer_id", session()?.user.id);
        if (error) {
            console.log("Orders Error: " + error.code + " " + error.message);
            return;
        }
        const orderedItemsIds = orders?.map((order) => order.order_number);

        const { data: orderDetails, error: orderDetailsError } = await supabase
            .from("order_details")
            .select("product_id")
            .in("order_number", orderedItemsIds);
        if (orderDetailsError) {
            console.log(
                "Order Details Error: " +
                    orderDetailsError.code +
                    " " +
                    orderDetailsError.message
            );
        }
        const products = orderDetails?.map((item) => item.product_id);
        console.log(products);
        if (products !== undefined) {
            const { data: productsInfo, error: productsInfoError } =
                await supabase
                    .from("sellerposts")
                    .select("*")
                    .in("id", products);
            if (productsInfoError) {
                console.log(
                    "Products Info Error: " +
                        productsInfoError.code +
                        " " +
                        productsInfoError.message
                );
                return;
            } else {
                const newItems = await Promise.all(
                    productsInfo?.map(async (item) => {
                        item.subject = [];
                        productCategories.forEach((productCategories) => {
                            item.product_subject.map(
                                (productSubject: string) => {
                                    if (
                                        productSubject === productCategories.id
                                    ) {
                                        item.subject.push(
                                            productCategories.name
                                        );
                                        console.log(productCategories.name);
                                    }
                                }
                            );
                        });
                        delete item.product_subject;

                        const { data: gradeData, error: gradeError } =
                            await supabase.from("grade_level").select("*");

                        if (gradeError) {
                            console.log(
                                "supabase error: " + gradeError.message
                            );
                        } else {
                            item.grade = [];
                            gradeData.forEach((databaseGrade) => {
                                item.post_grade.map((itemGrade: string) => {
                                    if (
                                        itemGrade ===
                                        databaseGrade.id.toString()
                                    ) {
                                        item.grade.push(databaseGrade.grade);
                                    }
                                });
                            });
                        }

                        if (item.price_id !== null) {
                            const priceData = await stripe.prices.retrieve(
                                item.price_id
                            );
                            item.price = priceData.unit_amount! / 100;
                        }
                        return item;
                    })
                );
                setPurchasedItems(newItems);
                console.log(purchasedItems());
            }
        }
    };

    const fetchUser = async (user_id: string) => {
        try {
            const { data, error } = await supabase
                .from("user_view")
                .select("*")
                .eq("user_id", user_id);

            if (error) {
                console.log(error);
            } else if (data[0] === undefined) {
                alert(t("messages.noUser")); //TODO: Change alert message
                // location.href = `/${lang}`;
            } else {
                console.log(data);
                setUser(data[0]);
                console.log(user());
            }
        } catch (error) {
            console.log(error);
        }
    };

    createEffect(async () => {
        console.log("downloading images");
        if (user() !== undefined) {
            if (user()?.image_url === undefined || user()?.image_url === null) {
                // console.log("No Image");
                // console.log(userImage());
            } else {
                await downloadImage(user()?.image_url!);
                setImageUrl(user()?.image_url!);
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
            setUserImage(url);
        } catch (error) {
            console.log(error);
        }
    };

    const enableEditMode = () => {
        setEditMode(true);
    };

    function submit(e: SubmitEvent) {
        e.preventDefault();
        console.log("Submitted!");
        const formData = new FormData(e.target as HTMLFormElement);
        for (let pair of formData.entries()) {
            console.log(pair[0] + ", " + pair[1]);
        }
        formData.append("access_token", session()?.access_token!);
        formData.append("refresh_token", session()?.refresh_token!);
        formData.append("lang", lang);
        if (imageUrl() !== null) {
            formData.append("image_url", imageUrl()!);
        }
        setFormData(formData);
    }

    const resetPassword = () => {
        window.location.href = `/${lang}/password/reset`;
    };

    const tabClick = (e: Event) => {
        e.preventDefault();

        let profileLink = document.getElementById(
            "user-profile-tab-profile-link"
        );
        let purchaseLink = document.getElementById(
            "user-profile-tab-purchases-link"
        );
        let favoritesLink = document.getElementById(
            "user-profile-tab-favorites-link"
        );
        let followingLink = document.getElementById(
            "user-profile-tab-following-link"
        );
        let allLinks = document.getElementsByClassName("user-profile-tab-link");

        const element = e.currentTarget as HTMLElement;
        const currElID = element.id;

        let currEl = document.getElementById(currElID);

        Array.from(allLinks).forEach(function (link) {
            link.classList.remove("border-b-2");
            link.classList.remove("border-green-500");
        });

        if (currElID === "user-profile-tab-profile-link") {
            setTabSelected("profile");

            currEl?.classList.add("border-b-2");
            currEl?.classList.add("border-green-500");
        } else if (currElID === "user-profile-tab-purchases-link") {
            setTabSelected("purchases");

            currEl?.classList.add("border-b-2");
            currEl?.classList.add("border-green-500");
        } else if (currElID === "user-profile-tab-favorites-link") {
            setTabSelected("favorites");

            currEl?.classList.add("border-b-2");
            currEl?.classList.add("border-green-500");
        } else if (currElID === "user-profile-tab-following-link") {
            setTabSelected("following");

            currEl?.classList.add("border-b-2");
            currEl?.classList.add("border-green-500");
        } else if (currElID === "user-profile-settings-btn") {
            setTabSelected("settings");
        }
    };

    //TODO: Edit profile button is hidden until we enable users editing their profile
    //TODO: Style improvement - when boxes are collapsed in mobile view they are narrower than when they are expanded might be nice to keep it the same size

    return (
        <div class="">
            <div class="text-center text-xl font-bold italic text-alert1 dark:text-alert1-DM">
                <Show when={editMode() === true}>
                    <h1 class="text-alert1 dark:text-alert1-DM">
                        {t("messages.profileEdits")}
                    </h1>
                </Show>
            </div>
            <div class="m-auto">
                {/* Left column for md+ View */}
                <div class="justify-center border border-border1 dark:border-border1-DM md:mt-4 md:h-fit md:px-4 md:pb-4 md:drop-shadow-lg">
                    <form onSubmit={submit} id="editProfile">
                        {/* Container for Mobile View */}
                        <Show when={screenSize() === "sm"}>
                            <UserProfileViewMobile
                                user={user() ? user()! : null}
                                editMode={editMode()}
                                enableEditMode={enableEditMode}
                                userImage={userImage()}
                            />
                        </Show>

                        {/* Profile Information for md+ View */}
                        <Show when={screenSize() !== "sm"}>
                            <div class="">
                                <div class="relative h-36 bg-background2 dark:bg-background2-DM">
                                    <div class="absolute left-12 top-4 flex h-40 w-40 items-center justify-center rounded-full border border-border2 bg-background2 dark:border-border2-DM dark:bg-background2">
                                        <p class="dark:ptext2-DM text-ptext2 md:text-6xl lg:text-7xl xl:text-8xl">
                                            {user()?.first_name.slice(0, 1)}
                                            {user()?.last_name.slice(0, 1)}
                                        </p>
                                    </div>
                                </div>

                                <div class="mb-6 mt-12 flex items-center">
                                    <div class="flex items-center justify-center">
                                        <Show when={user()?.display_name}>
                                            <h1 class="text-3xl">
                                                {user()?.display_name}
                                            </h1>
                                        </Show>

                                        <Show when={!user()?.display_name}>
                                            <h1 class="text-3xl">
                                                {user()?.first_name}{" "}
                                                {user()?.last_name}
                                            </h1>
                                        </Show>
                                    </div>

                                    <div class="flex items-center justify-center">
                                        <Show when={editMode() === false}>
                                            <button
                                                class="ml-2"
                                                onclick={enableEditMode}
                                            >
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

                                        <Show when={editMode() === true}>
                                            <button
                                                class="ml-2"
                                                type="submit"
                                                form="editProfile"
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
                                                    <rect
                                                        width="10"
                                                        height="8"
                                                        x="7"
                                                        y="13"
                                                    />{" "}
                                                    <rect
                                                        width="8"
                                                        height="5"
                                                        x="8"
                                                        y="3"
                                                    />
                                                </svg>
                                            </button>
                                        </Show>
                                    </div>
                                </div>

                                <div class="user-profile-tabs my-4 flex items-center justify-between border-b border-gray-300 pb-2">
                                    <div class="">
                                        <a
                                            id="user-profile-tab-profile-link"
                                            class="user-profile-tab-link mr-4 border-b-2 border-green-500 text-sm font-bold"
                                            onClick={(e) => tabClick(e)}
                                        >
                                            {t("menus.profile")}
                                        </a>
                                        <a
                                            id="user-profile-tab-purchases-link"
                                            class="user-profile-tab-link mr-4 text-sm font-bold"
                                            onClick={(e) => tabClick(e)}
                                        >
                                            {t("menus.purchases")}
                                        </a>
                                        {/* TODO: Add Back when feature is ready
                                        <a id="user-profile-tab-favorites-link" class="user-profile-tab-link font-bold mr-4 text-sm" onClick={ (e) => tabClick(e) }>{t("menus.favorites")}</a>
                                        <a id="user-profile-tab-following-link" class="user-profile-tab-link font-bold mr-4 text-sm" onClick={ (e) => tabClick(e) }>{t("menus.following")}</a>
                                         */}
                                    </div>

                                    <button
                                        id="user-profile-settings-btn"
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

                                <Show when={tabSelected() === "profile"}>
                                    <div class="first-name flex">
                                        <label
                                            for="FirstName"
                                            class="font-bold text-ptext1 dark:text-ptext1-DM"
                                        >
                                            {t("formLabels.firstName")}: &nbsp
                                        </label>

                                        <Show when={editMode() === false}>
                                            <p id="FirstName" class="mb-4 px-1">
                                                {user()?.first_name}
                                            </p>
                                        </Show>

                                        <Show when={editMode() === true}>
                                            <div class="">
                                                <input
                                                    type="text"
                                                    id="FirstName"
                                                    name="FirstName"
                                                    class="mb-4 w-full rounded border border-inputBorder1 bg-background1 px-1 text-ptext1 focus:border-2 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM dark:focus:border-highlight1-DM"
                                                    value={user()?.first_name}
                                                    required
                                                />
                                            </div>
                                        </Show>
                                    </div>

                                    <div class="last-name flex flex-wrap">
                                        <label
                                            for="LastName"
                                            class="font-bold text-ptext1 dark:text-ptext1-DM"
                                        >
                                            {t("formLabels.lastName")}: &nbsp
                                        </label>
                                        <Show when={editMode() === false}>
                                            <p id="LastName" class="mb-4 ">
                                                {user()?.last_name}
                                            </p>
                                        </Show>
                                        <Show when={editMode() === true}>
                                            <div class="">
                                                <input
                                                    type="text"
                                                    id="LastName"
                                                    name="LastName"
                                                    class="mb-4 w-full rounded border border-inputBorder1 bg-background1 px-1 text-ptext1 focus:border-2 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM dark:focus:border-highlight1-DM"
                                                    value={user()?.last_name}
                                                />
                                            </div>
                                        </Show>
                                    </div>

                                    <div class="display-name flex flex-wrap">
                                        <label
                                            for="DisplayName"
                                            class="font-bold text-ptext1 dark:text-ptext1-DM"
                                        >
                                            {t("formLabels.displayName")}: &nbsp
                                        </label>
                                        <Show when={editMode() === false}>
                                            <p id="DisplayName" class="mb-4 ">
                                                {user()?.display_name
                                                    ? user()?.display_name
                                                    : t("formLabels.noValue")}
                                            </p>
                                        </Show>
                                        <Show when={editMode() === true}>
                                            <div class="">
                                                <input
                                                    type="text"
                                                    id="DisplayName"
                                                    name="DisplayName"
                                                    class="mb-4 w-full rounded border border-inputBorder1 bg-background1 px-1 text-ptext1 focus:border-2 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM dark:focus:border-highlight1-DM"
                                                    value={user()?.display_name}
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
                                        <Show when={editMode() === false}>
                                            <div class="">
                                                <p id="email" class="mb-4 ">
                                                    {user()?.email}
                                                </p>
                                            </div>
                                        </Show>
                                        <Show when={editMode() === true}>
                                            <div class="">
                                                <input
                                                    id="email"
                                                    name="email"
                                                    class="mb-4 w-full rounded border border-inputBorder1 bg-background1 px-1 text-ptext1 focus:border-2 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM dark:focus:border-highlight1-DM"
                                                    type="email"
                                                    placeholder={t(
                                                        "formLabels.email"
                                                    )}
                                                    value={user()?.email}
                                                />
                                            </div>
                                        </Show>
                                    </div>

                                    <div>
                                        <Show when={editMode() === false}>
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
                                    {/* Change to just call ViewUserPurchases make decision about which to show in there */}
                                    {/* <Show when={ purchasedItems() }> */}
                                    <div>
                                        {/* <ViewCard posts={purchasedItems()} /> */}
                                        <ViewUserPurchases />
                                    </div>
                                    {/* </Show>

                                    <Show when={ purchasedItems().length < 1} >
                                        <p class="italic mb-6">{t("messages.noPurchasedItems")}</p>
                                        <a href={ `/${lang}/services`} class="btn-primary">{t("buttons.browseCatalog")}</a>
                                    </Show> */}
                                </Show>

                                <Show when={tabSelected() === "favorites"}>
                                    <p class="italic">
                                        {t("messages.comingSoon")}
                                    </p>
                                </Show>

                                <Show when={tabSelected() === "following"}>
                                    <p class="italic">
                                        {t("messages.comingSoon")}
                                    </p>
                                </Show>

                                <Show when={tabSelected() === "settings"}>
                                    <p class="italic">
                                        {t("messages.comingSoon")}
                                    </p>
                                </Show>
                            </div>
                        </Show>

                        <Show when={editMode() === true}>
                            <div class="align-items-center mb-2 mt-4 flex items-center justify-center">
                                <button
                                    class="btn-primary"
                                    type="submit"
                                    form="editProfile"
                                >
                                    {t("buttons.saveProfile")}
                                </button>
                            </div>
                        </Show>

                        <Suspense>
                            {response() && (
                                <p class="mt-2 text-center font-bold text-alert1 dark:text-alert1-DM">
                                    {response().message}
                                </p>
                            )}
                        </Suspense>
                    </form>
                </div>
            </div>
        </div>
    );
};
