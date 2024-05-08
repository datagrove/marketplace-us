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

interface Props {
    client: Client | null;
    clientImage: string | undefined;
    editMode: boolean;
    enableEditMode: () => void;
}

export const ClientProfileViewMobile: Component<Props> = (props: Props) => {
    // const [client, setClient] = createSignal<Client>();
    // const [session, setSession] = createSignal<AuthSession | null>(null);
    // const [clientImage, setClientImage] = createSignal<string>();
    // const [editMode, setEditMode] = createSignal<boolean>(false); //TODO Set back to false
    // const [imageUrl, setImageUrl] = createSignal<string | null>(null);
    // const [screenSize, setScreenSize] = createSignal<
    //   "sm" | "md" | "lg" | "xl" | "2xl"
    // >();
    // const [formData, setFormData] = createSignal<FormData>();
    // const [response] = createResource(formData, postFormData);
    // const [purchasedItems, setPurchasedItems] = createSignal<Array<Post>>([]);

    // const setSize = (e: Event) => {
    //   if (window.innerWidth <= 767) {
    //     setScreenSize("sm");
    //   } else if (window.innerWidth > 767 && window.innerWidth < 1024) {
    //     setScreenSize("md");
    //   } else if (window.innerWidth >= 1024 && window.innerWidth < 1280) {
    //     setScreenSize("lg");
    //   } else if (window.innerWidth >= 1280 && window.innerWidth < 1536) {
    //     setScreenSize("xl");
    //   } else {
    //     setScreenSize("2xl");
    //   }
    // };

    // onMount(async () => {
    //   window.addEventListener("resize", setSize);
    //   if (window.innerWidth <= 767) {
    //     setScreenSize("sm");
    //   } else if (window.innerWidth > 767 && window.innerWidth < 1024) {
    //     setScreenSize("md");
    //   } else if (window.innerWidth >= 1024 && window.innerWidth < 1280) {
    //     setScreenSize("lg");
    //   } else if (window.innerWidth >= 1280 && window.innerWidth < 1536) {
    //     setScreenSize("xl");
    //   } else {
    //     setScreenSize("2xl");
    //   }
    //   setSession(User?.session);
    //   await fetchClient(User?.session?.user.id!);
    //   await getPurchasedItems();
    // });

    // onCleanup(() => {
    //   window.removeEventListener("resize", setSize);
    // });

    // const getPurchasedItems = async () => {
    //   console.log("Session Info: ");
    //   console.log(session());
    //   const { data: orders, error } = await supabase
    //     .from("orders")
    //     .select("*")
    //     .eq("customer_id", session()?.user.id);
    //   if (error) {
    //     console.log("Orders Error: " + error.code + " " + error.message);
    //     return;
    //   }
    //   const orderedItemsIds = orders?.map((order) => order.order_number);

    //   const { data: orderDetails, error: orderDetailsError } = await supabase
    //     .from("order_details")
    //     .select("product_id")
    //     .in("order_number", orderedItemsIds);
    //   if (orderDetailsError) {
    //     console.log(
    //       "Order Details Error: " +
    //         orderDetailsError.code +
    //         " " +
    //         orderDetailsError.message
    //     );
    //   }
    //   const products = orderDetails?.map((item) => item.product_id);
    //   console.log(products);
    //   if (products !== undefined) {
    //     const { data: productsInfo, error: productsInfoError } = await supabase
    //       .from("sellerposts")
    //       .select("*")
    //       .in("id", products);
    //     if (productsInfoError) {
    //       console.log(
    //         "Products Info Error: " +
    //           productsInfoError.code +
    //           " " +
    //           productsInfoError.message
    //       );
    //       return;
    //     } else {
    //       const newItems = await Promise.all(
    //         productsInfo?.map(async (item) => {
    //           item.subject = [];
    //           productCategories.forEach((productCategories) => {
    //             item.product_subject.map((productSubject: string) => {
    //               if (productSubject === productCategories.id) {
    //                 item.subject.push(productCategories.name);
    //                 console.log(productCategories.name);
    //               }
    //             });
    //           });
    //           delete item.product_subject;

    //           const { data: gradeData, error: gradeError } = await supabase
    //             .from("grade_level")
    //             .select("*");

    //           if (gradeError) {
    //             console.log("supabase error: " + gradeError.message);
    //           } else {
    //             item.grade = [];
    //             gradeData.forEach((databaseGrade) => {
    //               item.post_grade.map((itemGrade: string) => {
    //                 if (itemGrade === databaseGrade.id.toString()) {
    //                   item.grade.push(databaseGrade.grade);
    //                 }
    //               });
    //             });
    //           }

    //           if (item.price_id !== null) {
    //             const priceData = await stripe.prices.retrieve(item.price_id);
    //             item.price = priceData.unit_amount! / 100;
    //           }
    //           return item;
    //         })
    //       );
    //       setPurchasedItems(newItems);
    //       console.log(purchasedItems());
    //     }
    //   }
    // };

    // const fetchClient = async (user_id: string) => {
    //   try {
    //     const { data, error } = await supabase
    //       .from("clientview")
    //       .select("*")
    //       .eq("user_id", user_id);

    //     if (error) {
    //       console.log(error);
    //     } else if (data[0] === undefined) {
    //       alert(t("messages.noClient")); //TODO: Change alert message
    //       location.href = `/${lang}`;
    //     } else {
    //       console.log(data);
    //       setClient(data[0]);
    //       console.log(client());
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };

    // createEffect(async () => {
    //   console.log("downloading images");
    //   if (client() !== undefined) {
    //     if (client()?.image_url === undefined || client()?.image_url === null) {
    //       // console.log("No Image");
    //       // console.log(clientImage());
    //     } else {
    //       await downloadImage(client()?.image_url!);
    //       setImageUrl(client()?.image_url!);
    //       console.log(imageUrl());
    //     }
    //   }
    // });

    // const downloadImage = async (image_Url: string) => {
    //   try {
    //     const { data, error } = await supabase.storage
    //       .from("user.image")
    //       .download(image_Url);
    //     if (error) {
    //       throw error;
    //     }
    //     const url = URL.createObjectURL(data);
    //     setClientImage(url);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };

    // const enableEditMode = () => {
    //   setEditMode(true);
    // };

    // function submit(e: SubmitEvent) {
    //   e.preventDefault();
    //   console.log("Submitted!");
    //   const formData = new FormData(e.target as HTMLFormElement);
    //   for (let pair of formData.entries()) {
    //     console.log(pair[0] + ", " + pair[1]);
    //   }
    //   formData.append("access_token", session()?.access_token!);
    //   formData.append("refresh_token", session()?.refresh_token!);
    //   formData.append("lang", lang);
    //   if (imageUrl() !== null) {
    //     formData.append("image_url", imageUrl()!);
    //   }
    //   setFormData(formData);
    // }

    //TODO: Edit profile button is hidden until we enable clients editing their profile
    //TODO: Style improvement - when boxes are collapsed in mobile view they are narrower than when they are expanded might be nice to keep it the same size

    return (
        <div class="container">
            {/* Profile Information for Mobile View */}
            <details
                class="group rounded bg-background1 shadow dark:bg-background1-DM md:hidden"
                open
            >
                <summary class="relative flex cursor-pointer list-none flex-wrap items-center rounded group-open:z-[1] group-open:rounded-b-none">
                    <h2 class="flex flex-1 p-4 font-bold text-htext1 dark:text-htext1-DM">
                        {t("formLabels.profileInfo")}
                    </h2>
                    <div class="flex w-10 items-center justify-center">
                        <div class="ml-2 border-8 border-transparent border-l-border1 transition-transform group-open:rotate-90 dark:border-l-border1-DM"></div>
                    </div>
                </summary>
                <div class="p-4">
                    <div class="align-items-center mb-4 flex items-center justify-center">
                        <Show when={props.editMode === false}>
                            <button
                                class="btn-primary"
                                onclick={props.enableEditMode}
                            >
                                {t("buttons.editProfile")}
                            </button>
                        </Show>
                    </div>
                    <h2 class="pb-4 text-xl font-bold text-htext1 dark:text-htext1-DM">
                        {props.client?.display_name === null
                            ? props.client?.first_name +
                              " " +
                              props.client?.last_name
                            : props.client?.display_name}
                    </h2>

                    <div class="mb-3 flex justify-center">
                        <Show when={props.editMode === false}>
                            <Show
                                when={typeof props.clientImage !== "undefined"}
                            >
                                <div class="relative h-48 w-48 justify-center overflow-hidden rounded-full border border-border1 object-contain dark:border-border1-DM md:h-48 md:w-48 lg:h-64 lg:w-64">
                                    <img
                                        src={props.clientImage}
                                        class="absolute left-1/2 top-1/2 block h-56 -translate-x-1/2 -translate-y-1/2 justify-center object-contain md:h-96"
                                        alt={`${t("postLabels.clientProfileImage")} 1`}
                                    />
                                    {/* TODO: fix internationalization */}
                                </div>
                            </Show>
                        </Show>
                        <Show when={props.editMode === true}>
                            <UserImage
                                url={imageUrl()}
                                size={150}
                                onUpload={(e: Event, url: string) => {
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
                        <Show when={props.editMode === false}>
                            <p
                                id="FirstName"
                                class="mb-4 w-full rounded border border-inputBorder1 px-1 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:focus:border-highlight1-DM"
                            >
                                {props.client?.first_name}
                            </p>
                        </Show>
                        <Show when={props.editMode === true}>
                            <div class="group relative mr-2 flex items-center">
                                <svg
                                    class="peer h-4 w-4 rounded-full border border-inputBorder1 bg-background1 fill-background1 dark:border-inputBorder1-DM dark:bg-background1-DM"
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
                                    value={props.client?.first_name}
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
                        <Show when={props.editMode === false}>
                            <p
                                id="LastName"
                                class="mb-4 w-full rounded border border-inputBorder1 px-1 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:focus:border-highlight1-DM"
                            >
                                {props.client?.last_name}
                            </p>
                        </Show>
                        <Show when={props.editMode === true}>
                            <div class="relative mr-2 flex items-center">
                                <svg
                                    class="peer h-4 w-4 rounded-full border border-inputBorder1 bg-background1 fill-background1 dark:border-inputBorder1-DM dark:bg-background1-DM"
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
                                    value={props.client?.last_name}
                                />
                            </div>
                        </Show>
                    </div>

                    <div class="client-displayName flex flex-row flex-wrap justify-between">
                        <label
                            for="DisplayName"
                            class="text-ptext1 dark:text-ptext1-DM"
                        >
                            {t("formLabels.displayName")}:
                        </label>
                        <Show when={props.editMode === false}>
                            <p
                                id="DisplayName"
                                class="mb-4 w-full rounded border border-inputBorder1 px-1 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:focus:border-highlight1-DM"
                            >
                                {props.client?.display_name
                                    ? props.client?.display_name
                                    : props.client?.first_name +
                                      " " +
                                      props.client?.last_name}
                            </p>
                        </Show>
                        <Show when={props.editMode === true}>
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
                                    value={props.client?.display_name}
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
                        <Show when={props.editMode === false}>
                            <div class="h-0 basis-full"></div>
                            <div class="basis-full">
                                <p
                                    id="email"
                                    class="mb-4 overflow-auto rounded border border-inputBorder1 px-1 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:focus:border-highlight1-DM"
                                >
                                    {props.client?.email}
                                </p>
                            </div>
                        </Show>
                        <Show when={props.editMode === true}>
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
                                    placeholder={t("formLabels.email")}
                                    value={props.client?.email}
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
                        <Show when={props.editMode === false}>
                            <p
                                id="Phone"
                                class="mb-4 w-full rounded border border-inputBorder1 px-1 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:focus:border-highlight1-DM"
                            >
                                {props.client?.client_phone}
                            </p>
                        </Show>
                        <Show when={props.editMode === true}>
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
                                    value={props.client?.client_phone || ""}
                                />
                            </div>
                        </Show>
                    </div>

                    <Show when={props.editMode === true}>
                        <div class="justify-left mb-2 flex flex-row justify-items-center">
                            <h3 class="mr-4 font-bold">Location</h3>
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

                                <span class="invisible absolute m-4 mx-auto w-48 -translate-y-2/3 translate-x-1/4 rounded-md bg-background2 p-2 text-sm text-ptext2 opacity-0 transition-opacity peer-hover:visible peer-hover:opacity-100 dark:bg-background2-DM dark:text-ptext2-DM md:translate-x-1/4 md:translate-y-0">
                                    {t("toolTips.locationUpdate")}
                                </span>
                            </div>
                        </div>
                    </Show>

                    <div class="align-items-center mb-2 mt-4 flex items-center justify-center">
                        <Show when={props.editMode === true}>
                            <button
                                class="btn-primary"
                                type="submit"
                                form="editProfile"
                            >
                                {t("buttons.saveProfile")}
                            </button>
                        </Show>
                    </div>
                </div>
            </details>
        </div>
    );
};
