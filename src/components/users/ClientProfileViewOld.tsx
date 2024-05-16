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
import type { Client } from "@lib/types";
import type { Post } from "@lib/types";
import { ViewCard } from "@components/services/ViewCard";
import stripe from "@lib/stripe";
import { ClientProfileViewMobile } from "@components/users/ClientProfileViewMobile";
import { useStore } from "@nanostores/solid";
import { windowSize } from "@components/common/WindowSizeStore";


const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

//get the categories from the language files so they translate with changes in the language picker
const values = ui[lang] as uiObject;
const productCategories = values.subjectCategoryInfo.subjects;

async function postFormData(formData: FormData) {
    const response = await fetch("/api/clientProfileEdit", {
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

export const ClientProfileView: Component = () => {
    const [client, setClient] = createSignal<Client>();
    const [session, setSession] = createSignal<AuthSession | null>(null);
    const [clientImage, setClientImage] = createSignal<string>();
    const [editMode, setEditMode] = createSignal<boolean>(false); //TODO Set back to false
    const [imageUrl, setImageUrl] = createSignal<string | null>(null);
    const screenSize = useStore(windowSize);
    const [formData, setFormData] = createSignal<FormData>();
    const [response] = createResource(formData, postFormData);
    const [purchasedItems, setPurchasedItems] = createSignal<Array<Post>>([]);


    onMount(async () => {
        setSession(User?.session);
        await fetchClient(User?.session?.user.id!);
        await getPurchasedItems();
    });

    // createEffect(async () => {
    //   setSession(User.session);
    //   console.log(session());
    //   if (typeof session() !== "undefined") {
    //     await fetchClient(session()?.user.id!);
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

    const fetchClient = async (user_id: string) => {
        try {
            const { data, error } = await supabase
                .from("clientview")
                .select("*")
                .eq("user_id", user_id);

            if (error) {
                console.log(error);
            } else if (data[0] === undefined) {
                alert(t("messages.noClient")); //TODO: Change alert message
                location.href = `/${lang}`;
            } else {
                console.log(data);
                setClient(data[0]);
                console.log(client());
            }
        } catch (error) {
            console.log(error);
        }
    };

    createEffect(async () => {
        console.log("downloading images");
        if (client() !== undefined) {
            if (
                client()?.image_url === undefined ||
                client()?.image_url === null
            ) {
                // console.log("No Image");
                // console.log(clientImage());
            } else {
                await downloadImage(client()?.image_url!);
                setImageUrl(client()?.image_url!);
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
            setClientImage(url);
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

    //TODO: Edit profile button is hidden until we enable clients editing their profile
    //TODO: Style improvement - when boxes are collapsed in mobile view they are narrower than when they are expanded might be nice to keep it the same size

    return (
        <div class="border-2 border-blue-400">
            <div class="text-center text-2xl font-bold italic text-alert1 dark:text-alert1-DM">
                <Show when={editMode() === true}>
                    <h1 class="text-alert1 dark:text-alert1-DM">
                        {t("messages.profileEdits")}
                    </h1>
                </Show>
            </div>
            <div class="m-auto md:max-w-max">
                {/* Left column for md+ View */}
                <div class="justify-center rounded-md border border-border1 dark:border-border1-DM md:mt-4 md:h-fit md:px-4 md:pb-4 md:drop-shadow-lg">
                    <form onSubmit={submit} id="editProfile">
                        {/* Container for Mobile View */}
                        <Show when={screenSize() === "sm"}>
                            <ClientProfileViewMobile
                                client={client() ? client()! : null}
                                editMode={editMode()}
                                enableEditMode={enableEditMode}
                                clientImage={clientImage()}
                            />
                        </Show>

                        {/* Profile Information for md+ View */}
                        <Show when={screenSize() !== "sm"}>
                            <div class="hidden md:block">
                                <div class="flex flex-row justify-between">
                                    <h2 class="py-4 text-xl font-bold text-htext1 dark:text-htext1-DM">
                                        {client()?.display_name == null
                                            ? client()?.first_name +
                                              " " +
                                              client()?.last_name
                                            : client()?.display_name}
                                    </h2>
                                    <div class="align-items-center flex items-center justify-center py-2">
                                        <Show when={editMode() === false}>
                                            <button
                                                class="btn-primary"
                                                onclick={enableEditMode}
                                            >
                                                {t("buttons.editProfile")}
                                            </button>
                                        </Show>
                                    </div>
                                </div>
                                <div class="mb-3 flex justify-center">
                                    <Show when={editMode() === false}>
                                        <Show
                                            when={
                                                typeof clientImage() !==
                                                "undefined"
                                            }
                                        >
                                            <div class="relative h-48 w-48 justify-center overflow-hidden rounded-full border border-border1 object-contain dark:border-border1-DM md:h-48 md:w-48 lg:h-64 lg:w-64">
                                                <img
                                                    src={clientImage()}
                                                    class="absolute left-1/2 top-1/2 block h-56 -translate-x-1/2 -translate-y-1/2 justify-center object-contain md:h-96"
                                                    alt={`${t("postLabels.clientProfileImage")} 1`}
                                                />
                                                {/* TODO: Fix Internationalization */}
                                            </div>
                                        </Show>
                                    </Show>
                                    <Show when={editMode() === true}>
                                        <UserImage
                                            url={imageUrl()}
                                            size={150}
                                            onUpload={(
                                                e: Event,
                                                url: string
                                            ) => {
                                                setImageUrl(url);
                                            }}
                                        />
                                    </Show>
                                </div>

                                <div class="first-name flex flex-row flex-wrap justify-between">
                                    <label
                                        for="FirstName"
                                        class="text-ptext1 dark:text-ptext1-DM"
                                    >
                                        {t("formLabels.firstName")}:
                                    </label>
                                    <Show when={editMode() === false}>
                                        <p
                                            id="FirstName"
                                            class="mb-4 w-full rounded border border-inputBorder1 px-1 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:focus:border-highlight1-DM"
                                        >
                                            {client()?.first_name}
                                        </p>
                                    </Show>
                                    <Show when={editMode() === true}>
                                        <div class="group relative mr-2 flex items-center">
                                            <svg
                                                class="peer h-4 w-4 rounded-full border-2 border-border1 bg-icon1 fill-iconbg1 dark:border-none dark:bg-background1-DM dark:fill-iconbg1-DM"
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

                                            <span class="invisible absolute m-4 mx-auto w-48 -translate-x-full -translate-y-2/3 rounded-md bg-background2 p-2 text-sm text-ptext2 opacity-0 transition-opacity peer-hover:visible peer-hover:opacity-100 dark:bg-background2-DM dark:text-ptext2-DM md:translate-x-1/4 md:translate-y-0">
                                                {t("toolTips.firstName")}
                                            </span>
                                        </div>
                                        <div class="h-0 basis-full"></div>
                                        <div class="basis-full">
                                            <input
                                                type="text"
                                                id="FirstName"
                                                name="FirstName"
                                                class="mb-4 w-full rounded border border-inputBorder1 bg-background1 px-1 text-ptext1 focus:border-2 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM dark:focus:border-highlight1-DM"
                                                value={client()?.first_name}
                                                required
                                            />
                                        </div>
                                    </Show>
                                </div>

                                <div class="last-name flex flex-row flex-wrap justify-between">
                                    <label
                                        for="LastName"
                                        class="text-ptext1 dark:text-ptext1-DM"
                                    >
                                        {t("formLabels.lastName")}:
                                    </label>
                                    <Show when={editMode() === false}>
                                        <p
                                            id="LastName"
                                            class="mb-4 w-full rounded border border-inputBorder1 px-1 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:focus:border-highlight1-DM"
                                        >
                                            {client()?.last_name}
                                        </p>
                                    </Show>
                                    <Show when={editMode() === true}>
                                        <div class="relative mr-2 flex items-center">
                                            <svg
                                                class="peer h-4 w-4 rounded-full border-2 border-border1 bg-icon1 fill-iconbg1 dark:border-none dark:bg-background1-DM dark:fill-iconbg1-DM"
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

                                            <span class="invisible absolute m-4 mx-auto w-48 -translate-x-full -translate-y-2/3 rounded-md bg-background2 p-2 text-sm text-ptext2 opacity-0 transition-opacity peer-hover:visible peer-hover:opacity-100 dark:bg-background2-DM dark:text-ptext2-DM md:translate-x-1/4 md:translate-y-0">
                                                {t("toolTips.lastName")}
                                            </span>
                                        </div>
                                        <div class="h-0 basis-full"></div>
                                        <div class="basis-full">
                                            <input
                                                type="text"
                                                id="LastName"
                                                name="LastName"
                                                class="mb-4 w-full rounded border border-inputBorder1 bg-background1 px-1 text-ptext1 focus:border-2 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM dark:focus:border-highlight1-DM"
                                                value={client()?.last_name}
                                            />
                                        </div>
                                    </Show>
                                </div>

                                <div class="display-name flex flex-row flex-wrap justify-between">
                                    <label
                                        for="DisplayName"
                                        class="text-ptext1 dark:text-ptext1-DM"
                                    >
                                        {t("formLabels.displayName")}:
                                    </label>
                                    <Show when={editMode() === false}>
                                        <p
                                            id="DisplayName"
                                            class="mb-4 w-full rounded border border-inputBorder1 px-1 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:focus:border-highlight1-DM"
                                        >
                                            {client()?.display_name
                                                ? client()?.display_name
                                                : t("formLabels.noValue")}
                                        </p>
                                    </Show>
                                    <Show when={editMode() === true}>
                                        <div class="relative mr-2 flex items-center">
                                            <svg
                                                class="peer h-4 w-4 rounded-full border-2 border-border1 bg-icon1 fill-iconbg1 dark:border-none dark:bg-background1-DM dark:fill-iconbg1-DM"
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

                                            <span class="invisible absolute m-4 mx-auto w-48 -translate-x-full -translate-y-2/3 rounded-md bg-background2 p-2 text-sm text-ptext2 opacity-0 transition-opacity peer-hover:visible peer-hover:opacity-100 dark:bg-background2-DM dark:text-ptext2-DM md:translate-x-1/4 md:translate-y-0">
                                                {t("toolTips.displayName")}
                                            </span>
                                        </div>
                                        <div class="h-0 basis-full"></div>
                                        <div class="basis-full">
                                            <input
                                                type="text"
                                                id="DisplayName"
                                                name="DisplayName"
                                                class="mb-4 w-full rounded border border-inputBorder1 bg-background1 px-1 text-ptext1 focus:border-2 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM dark:focus:border-highlight1-DM"
                                                value={client()?.display_name}
                                            />
                                        </div>
                                    </Show>
                                </div>

                                <div class="email-add flex flex-row flex-wrap justify-between">
                                    <label
                                        for="email"
                                        class="text-ptext1 dark:text-ptext1-DM"
                                    >
                                        {t("formLabels.email")}:
                                    </label>
                                    <Show when={editMode() === false}>
                                        <div class="h-0 basis-full"></div>
                                        <div class="basis-full">
                                            <p
                                                id="email"
                                                class="mb-4 overflow-auto rounded border border-inputBorder1 px-1 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:focus:border-highlight1-DM"
                                            >
                                                {client()?.email}
                                            </p>
                                        </div>
                                    </Show>
                                    <Show when={editMode() === true}>
                                        <div class="relative mr-2 flex items-center">
                                            <svg
                                                class="peer h-4 w-4 rounded-full border-2 border-border1 bg-icon1 fill-iconbg1 dark:border-none dark:bg-background1-DM dark:fill-iconbg1-DM"
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

                                            <span class="invisible absolute m-4 mx-auto w-48 -translate-x-full -translate-y-2/3 rounded-md bg-background2 p-2 text-sm text-ptext2 opacity-0 transition-opacity peer-hover:visible peer-hover:opacity-100 dark:bg-background2-DM dark:text-ptext2-DM md:translate-x-1/4 md:translate-y-0">
                                                {t("toolTips.changeEmail")}
                                            </span>
                                        </div>
                                        <div class="h-0 basis-full"></div>
                                        <div class="basis-full">
                                            <input
                                                id="email"
                                                name="email"
                                                class="mb-4 w-full rounded border border-inputBorder1 bg-background1 px-1 text-ptext1 focus:border-2 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM dark:focus:border-highlight1-DM"
                                                type="email"
                                                placeholder={t(
                                                    "formLabels.email"
                                                )}
                                                value={client()?.email}
                                            />
                                        </div>
                                    </Show>
                                </div>

                                <div class="phone-number flex flex-row flex-wrap justify-between">
                                    <label
                                        for="Phone"
                                        class="text-ptext1 dark:text-ptext1-DM"
                                    >
                                        {t("formLabels.phone")}:
                                    </label>
                                    <Show when={editMode() === false}>
                                        <p
                                            id="Phone"
                                            class="mb-4 w-full rounded border border-inputBorder1 px-1 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:focus:border-highlight1-DM"
                                        >
                                            {client()?.client_phone
                                                ? client()?.client_phone
                                                : t("formLabels.noValue")}
                                        </p>
                                    </Show>
                                    <Show when={editMode() === true}>
                                        <div class="relative mr-2 flex items-center">
                                            <svg
                                                class="peer h-4 w-4 rounded-full border-2 border-border1 bg-icon1 fill-iconbg1 dark:border-none dark:bg-background1-DM dark:fill-iconbg1-DM"
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

                                            <span class="invisible absolute m-4 mx-auto w-48 -translate-x-full -translate-y-2/3 rounded-md bg-background2 p-2 text-sm text-ptext2 opacity-0 transition-opacity peer-hover:visible peer-hover:opacity-100 dark:bg-background2-DM dark:text-ptext2-DM md:translate-x-1/4 md:translate-y-0">
                                                {t("toolTips.clientPhone")}
                                            </span>
                                        </div>
                                        <div class="h-0 basis-full"></div>
                                        <div class="basis-full">
                                            <input
                                                type="text"
                                                id="Phone"
                                                class="mb-4 w-full rounded border border-inputBorder1 bg-background1 px-1 text-ptext1 focus:border-2 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM dark:focus:border-highlight1-DM"
                                                name="Phone"
                                                value={
                                                    client()?.client_phone || ""
                                                }
                                            />
                                        </div>
                                    </Show>
                                </div>
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
                <div>
                    {/* TODO: Clean up internationalize, probably make new cards  */}
                    Purchases:
                    <ViewCard posts={purchasedItems()} />
                </div>
            </div>
        </div>
    );
};
