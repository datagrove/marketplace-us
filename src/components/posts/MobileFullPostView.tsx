import type { Component } from "solid-js";
import type { Post } from "@lib/types";
import { createSignal, createEffect, Show, For, onMount } from "solid-js";
import supabase from "../../lib/supabaseClient";
import { DeletePostButton } from "../posts/DeletePostButton";
import { ui } from "../../i18n/ui";
import type { uiObject } from "../../i18n/uiType";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";
import { AddToCart } from "@components/common/cart/AddToCartButton";
import { Quantity } from "@components/common/cart/Quantity";
import { FavoriteButton } from "@components/posts/AddFavorite";
import stripe from "@lib/stripe";
import { EditPost } from "./EditPost";
import type { AuthSession } from "@supabase/supabase-js";
import { ReportResource } from "./ReportResource";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

//get the categories from the language files so they translate with changes in the language picker
const values = ui[lang] as uiObject;
const postSubjects = values.subjectCategoryInfo.subjects;

interface Props {
    postId: string | undefined;
}

const { data: User, error: UserError } = await supabase.auth.getSession();
export const MobileViewFullPost: Component<Props> = (props) => {
    const test1 = ["../../../src/assets/services.png"];
    const test2 = [
        "../../../src/assets/services.png",
        "../../../src/assets/question.svg",
        "../../../src/assets/servicesDM.png",
        "../../../src/assets/userImagePlaceholder.svg",
        "../../../src/assets/attention-mark.svg",
    ];

    const [post, setPost] = createSignal<Post>();
    const [postImages, setPostImages] = createSignal<string[]>([]);
    const [testImages, setTestImages] = createSignal<string[]>([]);
    const [quantity, setQuantity] = createSignal<number>(1);
    const [session, setSession] = createSignal<AuthSession | null>(null);

    const [editRender, setEditRender] = createSignal<boolean>(false);

    onMount(async () => {
        const { data: User, error: UserError } =
            await supabase.auth.getSession();
        if (UserError) {
            console.log("User Error: " + UserError.message);
        } else {
            if (User.session === null) {
                console.log("User Session: " + User.session);
                setSession(null);
            } else {
                setSession(User.session);
            }
        }
    });

    onMount(async () => {
        if (props.postId === undefined) {
            location.href = `/${lang}/404`;
        } else if (props.postId) {
            await fetchPost(+props.postId);
        }
    });

    onMount(async () => {
        if (post() !== undefined) {
            if (
                post()?.image_urls === undefined ||
                post()?.image_urls === null
            ) {
            } else {
                await downloadImages(post()?.image_urls!);
            }
        }
    });

    const fetchPost = async (id: number) => {
        try {
            const { data, error } = await supabase
                .from("sellerposts")
                .select("*")
                .eq("id", id)
                .eq("listing_status", true);

            if (error) {
                console.log(error);
            } else if (data[0] === undefined) {
                alert(t("messages.noPost"));
                location.href = `/${lang}/resources`;
            } else {
                const updatedPost = await Promise.all(
                    data?.map(async (item) => {
                        item.subject = [];
                        postSubjects.forEach((postSubject) => {
                            item.product_subject.map(
                                (productSubject: string) => {
                                    if (productSubject === postSubject.id) {
                                        item.subject.push(postSubject.name);
                                        console.log(postSubject.name);
                                    }
                                }
                            );
                        });

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

                        const { data: resourceTypeData, error } = await supabase
                            .from("resource_types")
                            .select("*");

                        if (error) {
                            console.log("supabase error: " + error.message);
                        } else {
                            item.resourceTypes = [];
                            resourceTypeData.forEach(
                                (databaseResourceTypes) => {
                                    item.resource_types.map(
                                        (itemResourceType: string) => {
                                            if (
                                                itemResourceType ===
                                                databaseResourceTypes.id.toString()
                                            ) {
                                                item.resourceTypes!.push(
                                                    databaseResourceTypes.type
                                                );
                                            }
                                        }
                                    );
                                }
                            );
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

                console.log(updatedPost[0]);
                setPost(updatedPost[0]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    createEffect(async () => {
        if (post() !== undefined) {
            if (
                post()?.image_urls === undefined ||
                post()?.image_urls === null
            ) {
            } else {
                await downloadImages(post()?.image_urls!);
            }
        }
    });

    const updateQuantity = (quantity: number) => {
        setQuantity(quantity);
    };

    const resetQuantity = () => {
        setQuantity(1);
    };

    const downloadImages = async (image_Urls: string) => {
        try {
            const imageUrls = image_Urls.split(",");
            imageUrls.forEach(async (imageUrl: string) => {
                const { data, error } = await supabase.storage
                    .from("post.image")
                    .download(imageUrl);
                if (error) {
                    throw error;
                }
                const url = URL.createObjectURL(data);
                setPostImages([...postImages(), url]);
            });
        } catch (error) {
            console.log(error);
        }
    };

    function changeDetails() {
        let detailsDiv = document.getElementById("post-details-div");
        let detailsArrow = document.getElementById("details-arrow");

        if (detailsDiv?.classList.contains("hidden")) {
            detailsDiv?.classList.remove("hidden");
            detailsDiv?.classList.add("inline");

            detailsArrow?.classList.add("rotate-180");
        } else if (detailsDiv?.classList.contains("inline")) {
            detailsDiv?.classList.remove("inline");
            detailsDiv?.classList.add("hidden");

            detailsArrow?.classList.remove("rotate-180");
        }
    }

    function changeDescription() {
        let descriptionDiv = document.getElementById("post-description-div");
        let descriptionArrow = document.getElementById("description-arrow");

        if (descriptionDiv?.classList.contains("hidden")) {
            descriptionDiv?.classList.remove("hidden");
            descriptionDiv?.classList.add("inline");

            descriptionArrow?.classList.add("rotate-180");
        } else if (descriptionDiv?.classList.contains("inline")) {
            descriptionDiv?.classList.remove("inline");
            descriptionDiv?.classList.add("hidden");

            descriptionArrow?.classList.remove("rotate-180");
        }
    }

    function changeReviews() {
        let reviewsDiv = document.getElementById("post-reviews-div");
        let reviewsArrow = document.getElementById("reviews-arrow");

        if (reviewsDiv?.classList.contains("hidden")) {
            reviewsDiv?.classList.remove("hidden");
            reviewsDiv?.classList.add("inline");

            reviewsArrow?.classList.add("rotate-180");
        } else if (reviewsDiv?.classList.contains("inline")) {
            reviewsDiv?.classList.remove("inline");
            reviewsDiv?.classList.add("hidden");

            reviewsArrow?.classList.remove("rotate-180");
        }
    }

    function changeQA() {
        let qaDiv = document.getElementById("post-qa-div");
        let qaArrow = document.getElementById("qa-arrow");

        if (qaDiv?.classList.contains("hidden")) {
            qaDiv?.classList.remove("hidden");
            qaDiv?.classList.add("inline");

            qaArrow?.classList.add("rotate-180");
        } else if (qaDiv?.classList.contains("inline")) {
            qaDiv?.classList.remove("inline");
            qaDiv?.classList.add("hidden");

            qaArrow?.classList.remove("rotate-180");
        }
    }

    function tabLinkClick(e: Event) {
        e.preventDefault();

        let currLinkEl = e.currentTarget as HTMLAnchorElement;
        let currLinkID = currLinkEl.id; // <a> element id
        let currEl = document.getElementById(currLinkID); // <a> element clicked
        let allLinks = document.getElementsByClassName("tabLink"); // all links

        let detailsDiv = document.getElementById("post-details-div");
        let detailsArrow = document.getElementById("details-arrow");
        let descriptionDiv = document.getElementById("post-description-div");
        let descriptionArrow = document.getElementById("description-arrow");
        let reviewsDiv = document.getElementById("post-reviews-div");
        let reviewsArrow = document.getElementById("reviews-arrow");
        let qaDiv = document.getElementById("post-qa-div");
        let qaArrow = document.getElementById("qa-arrow");

        if (!currEl?.classList.contains("border-b-2")) {
            Array.from(allLinks).forEach(function (link) {
                link.classList.remove("border-b-2");
                link.classList.remove("border-green-500");
            });

            currEl?.classList.add("border-b-2");
            currEl?.classList.add("border-green-500");
        }

        console.log(currLinkID);

        if (currLinkID === "detailsLink") {
            changeDetails();
            window.location.href = "#details";
        }

        if (currLinkID === "descriptionLink") {
            changeDescription();
            window.location.href = "#description";
        }

        if (currLinkID === "reviewsLink") {
            changeReviews();
            window.location.href = "#reviews";
        }

        if (currLinkID === "qaLink") {
            changeQA();
            window.location.href = "#qa";
        }

        let sectionID = currLinkID.slice(0, -4);
        let jumpToSection = `#${sectionID}`;
        window.location.href = jumpToSection;
    }

    function imageClick(e: Event) {
        e.preventDefault();

        let mobileCurrImageEle = e.currentTarget as HTMLDivElement;
        let mobileCurrImageID = mobileCurrImageEle.id;
        let mobileCurrImage = document.getElementById(mobileCurrImageID);
        let allMobileImages =
            document.getElementsByClassName("mobileImageLink");
        let mainImage = document.getElementById("mobile-main-image");
        let arrayIndex = Number(mobileCurrImageID.slice(-1));

        console.log(mobileCurrImage);

        console.log(Array.from(allMobileImages));

        if (!mobileCurrImage?.classList.contains("border-b-2")) {
            Array.from(allMobileImages).forEach(function (image) {
                console.log(image.classList);
                console.log("Test");
                image.classList.remove("border-b-2");
                image.classList.remove("border-green-500");
            });

            mobileCurrImage?.classList.add("border-b-2");
            mobileCurrImage?.classList.add("border-green-500");
        }

        mainImage?.setAttribute("src", postImages()[arrayIndex]);
    }

    return (
        <>
            <Show when={!editRender()}>
                <div id="mobile-full-card" class="h-full w-11/12">
                    <div
                        id="full-resource-title"
                        class="sticky top-0 z-30 bg-background1 dark:bg-background1-DM"
                    >
                        <p class="text-2xl font-bold">{post()?.title}</p>
                    </div>

                    {/* TODO: Add back ratings
            <div id="ratings-div" class="my-1 flex">
                <div id="ratings-stars-div" class="mr-2 flex w-fit">
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

                TODO: fix hard coding
                <div id="ratings-text-div" class="flex">
                    <p class="font-bold">4.9</p>
                    <p>(30.3K ratings)</p>
                </div>
            </div> */}

                    <div
                        id="creator-followers-div"
                        class="flex h-16 w-full items-center"
                    >
                        <div
                            id="creator-img-div border"
                            class="flex h-14 w-14 items-center justify-center rounded-full bg-gray-300"
                        >
                            <a href={`/${lang}/creator/${post()?.seller_id}`}>
                                <svg
                                    fill="none"
                                    viewBox="0 0 32 32"
                                    class="h-12 w-12 fill-icon1 dark:fill-icon1-DM"
                                >
                                    <path d="M16 15.503A5.041 5.041 0 1 0 16 5.42a5.041 5.041 0 0 0 0 10.083zm0 2.215c-6.703 0-11 3.699-11 5.5v3.363h22v-3.363c0-2.178-4.068-5.5-11-5.5z" />
                                </svg>
                            </a>
                        </div>

                        <div
                            id="creator-follower-text-div"
                            class="border-red- ml-1 w-4/6"
                        >
                            <div>
                                <a
                                    href={`/${lang}/creator/${post()?.seller_id}`}
                                >
                                    <p class="font-bold">
                                        {post()?.seller_name}
                                    </p>
                                </a>
                            </div>

                            {/* <div class="flex w-full items-center">
                            <div>117.1K Followers</div>

                        <div>
                            <button
                                class="dark:ptext-DM mx-4 flex items-center justify-center rounded-full bg-btn1 px-4 text-ptext2 dark:bg-btn1-DM"
                                onClick={() => alert(t("messages.comingSoon"))}
                            >
                                <svg
                                    width="18px"
                                    height="20px"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    class="mx-0.5"
                                >
                                    <circle
                                        cx="9"
                                        cy="7"
                                        r="4"
                                        stroke="none"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        class="stroke-icon2 dark:stroke-icon2-DM"
                                    />
                                    <path
                                        d="M2 21V17C2 15.8954 2.89543 15 4 15H14C15.1046 15 16 15.8954 16 17V21"
                                        stroke="none"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        class="stroke-icon2 dark:stroke-icon2-DM"
                                    />
                                    <path
                                        d="M19 8V14M16 11H22"
                                        stroke="none"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        class="stroke-icon2 dark:stroke-icon2-DM"
                                    />
                                </svg>
                                <p class="mx-0.5 text-sm">
                                    {t("buttons.follow")}
                                </p>
                            </button>

                            <button class="dark:ptext-DM mx-4 hidden items-center justify-center rounded-full bg-btn1 px-4 text-ptext2 dark:bg-btn1-DM">
                                <svg
                                    width="18px"
                                    height="20px"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    class="mx-0.5"
                                >
                                    <circle
                                        cx="9"
                                        cy="7"
                                        r="4"
                                        stroke="none"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        class="stroke-icon2 dark:stroke-icon2-DM"
                                    />
                                    <path
                                        d="M2 21V17C2 15.8954 2.89543 15 4 15H14C15.1046 15 16 15.8954 16 17V21"
                                        stroke="none"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        class="stroke-icon2 dark:stroke-icon2-DM"
                                    />
                                </svg>
                                <p class="mx-0.5 text-sm">
                                    {t("buttons.following")}
                                </p>
                            </button>
                        </div>
                    </div> */}
                        </div>
                        <Show when={session()?.user.id === post()?.user_id}>
                            <div class="flex">
                                <button
                                    class="btn-primary"
                                    onclick={() => {
                                        setEditRender(!editRender());
                                        //(editRender());
                                    }}
                                >
                                    {t("buttons.editPost")}
                                </button>
                            </div>
                        </Show>
                    </div>

                    <div
                        id="images"
                        class="flex flex-col items-center justify-center"
                    >
                        <Show when={postImages().length > 0}>
                            <Show when={postImages().length === 1}>
                                <div class="mt-2 flex h-[375px] w-[375px] items-center justify-center rounded p-1">
                                    <img
                                        src={postImages()[0]}
                                        id="one-image"
                                        class="flex max-h-[370px] max-w-full items-center justify-center rounded dark:bg-background1"
                                        alt={`${t("postLabels.image")}`}
                                    />
                                </div>
                            </Show>

                            <Show when={postImages().length > 1}>
                                <div class="mt-2 flex max-h-[370px] max-w-full items-center justify-center rounded p-1">
                                    <img
                                        src={postImages()[0]}
                                        id="mobile-main-image"
                                        class="max-h-[370px] max-w-full rounded dark:bg-background1"
                                        alt={`${t("postLabels.image")}`}
                                    />
                                </div>

                                <div class="mt-4 flex w-full justify-start">
                                    {postImages().map(
                                        (image: string, index: number) => (
                                            <div class="flex h-16 w-1/5 items-center justify-center">
                                                {index === 0 ? (
                                                    <div
                                                        // id={ index.toString() }
                                                        id={`mobileImg${index.toString()}`}
                                                        class="mobileImageLink flex h-16 w-16 items-center justify-center"
                                                        onClick={(e) =>
                                                            imageClick(e)
                                                        }
                                                    >
                                                        <img
                                                            src={image}
                                                            class="mb-2 h-full w-full rounded object-cover"
                                                            alt={`${t("postLabels.image")} ${index + 2}`}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div
                                                        // id={ index.toString() }
                                                        id={`mobileImg${index.toString()}`}
                                                        class="mobileImageLink flex h-16 w-16 items-center justify-center"
                                                        onClick={(e) =>
                                                            imageClick(e)
                                                        }
                                                    >
                                                        <img
                                                            src={image}
                                                            class="mb-2 h-full w-full rounded object-cover dark:bg-background1"
                                                            alt={`${t("postLabels.image")} ${index + 2}`}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    )}
                                </div>
                            </Show>
                        </Show>
                    </div>

                    <div
                        id="cart-price-div"
                        class="sticky top-0 my-4 flex flex-col bg-background1 dark:bg-background1-DM"
                    >
                        <div class="mx-1 flex justify-end">
                            <Show when={post()?.price! === 0}>
                                <p class="text-2xl font-bold">
                                    {t("messages.free")}
                                </p>
                            </Show>
                            <Show when={post()?.price! > 0}>
                                <p class="text-2xl font-bold">
                                    ${post()?.price.toFixed(2)}
                                </p>
                            </Show>
                        </div>

                        <div class="my-2 flex justify-between">
                            <Quantity
                                quantity={1}
                                updateQuantity={updateQuantity}
                            />
                            <div class="ml-4 w-full">
                                <AddToCart
                                    item={{ ...post()!, quantity: 1 }}
                                    buttonClick={resetQuantity}
                                />
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-start pb-2 ">
                        <a
                            href="#details"
                            id="detailsLink"
                            class="tabLink mr-6 border-b-2 border-green-500"
                            onClick={tabLinkClick}
                        >
                            <p id="details-text" class="">
                                {t("menus.details")}
                            </p>
                        </a>
                        <a
                            href="#description"
                            id="descriptionLink"
                            class="tabLink mr-6"
                            onClick={tabLinkClick}
                        >
                            <p id="description-text" class="">
                                {t("menus.description")}
                            </p>
                        </a>
                        {/* TODO: Add back for reviews and Q&A
                <a
                    href="#reviews"
                    id="reviewsLink"
                    class="tabLink mr-6"
                    onClick={tabLinkClick}
                >
                    <p id="reviews-text" class="">
                        {t("menus.reviews")}
                    </p>
                </a>
                <a
                    href="#qa"
                    id="qaLink"
                    class="tabLink mr-6"
                    onClick={tabLinkClick}
                >
                    <p id="qa-text" class="">
                        {t("menus.qA")}
                    </p>
                </a> */}
                    </div>

                    <div
                        id="details"
                        class="mb-2 border-t border-border1 dark:border-border1-DM"
                    >
                        <div class="flex justify-between">
                            <p class="text-lg">{t("menus.details")}</p>

                            <button onClick={changeDetails}>
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="none"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    id="details-arrow"
                                    class="rotate-180 stroke-icon1 dark:stroke-icon1-DM"
                                >
                                    <polyline points="19 12 12 19 5 12" />
                                </svg>
                            </button>
                        </div>

                        <div id="post-details-div" class="inline">
                            <div>
                                <p class="mt-1 font-light uppercase">
                                    {t("formLabels.grades")}
                                </p>
                                <div class="flex">
                                    {post()?.grade?.join(", ")}
                                </div>
                            </div>

                            <div>
                                <p class="mt-4 font-light uppercase">
                                    {t("formLabels.subjects")}
                                </p>
                                <div class="flex">
                                    {post()?.subject?.join(", ")}
                                </div>
                            </div>

                            <div>
                                <p class="mt-4 font-light uppercase">
                                    {t("formLabels.resourceTypes")}
                                </p>
                                <div>{post()?.resourceTypes!.join(", ")}</div>
                            </div>

                            {/* TODO Add Back
                    <div>
                        <p class="mt-4 font-light uppercase">
                            {t("formLabels.fileTypes")}
                        </p>
                        <p class="italic">{t("messages.comingSoon")}</p>
                        TODO: add file type to database and then populate
                        { post()?.file_type.join(", ")}
                    </div>

                    <div>
                        <p class="mt-4 font-light uppercase">
                            {t("formLabels.pages")}
                        </p>
                        <p class="italic">{t("messages.comingSoon")}</p>
                        TODO: add file type to database and then populate
                        { post()?.file_type.join(", ")}
                    </div> */}
                        </div>
                    </div>

                    <div
                        id="description"
                        class="mb-2 border-t border-border1 dark:border-border1-DM"
                    >
                        <div class="flex justify-between">
                            <p class="text-lg">{t("menus.description")}</p>
                            <button onClick={changeDescription}>
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="none"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    id="description-arrow"
                                    class="stroke-icon1 dark:stroke-icon1-DM"
                                >
                                    <polyline points="19 12 12 19 5 12" />
                                </svg>
                            </button>
                        </div>
                        {/* <p>{ post()?.grade.join(", ") }</p> */}

                        <div
                            id="post-description-div"
                            class="prose hidden dark:prose-invert"
                            innerHTML={post()?.content}
                        ></div>
                    </div>

                    {/* TODO: Add back for Reviews
            <div
                id="reviews"
                class="mb-2 border-t border-border1 dark:border-border1-DM"
            >
                <div class="flex justify-between">
                    <p class="text-lg">{t("menus.reviews")}</p>
                    <button onClick={changeReviews}>
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="none"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            id="reviews-arrow"
                            class="stroke-icon1 dark:stroke-icon1-DM"
                        >
                            <polyline points="19 12 12 19 5 12" />
                        </svg>
                    </button>
                </div>

                <p id="post-reviews-div" class="hidden italic">
                    {t("messages.comingSoon")}
                </p>
            </div> */}

                    {/* TODO: Add back for Q&A
            <div
                id="qa"
                class="mb-2 border-t border-border1 dark:border-border1-DM"
            >
                <div class="flex justify-between">
                    <p class="text-lg">{t("menus.qA")}</p>
                    <button onClick={changeQA}>
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="none"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            id="qa-arrow"
                            class="stroke-icon1 dark:stroke-icon1-DM"
                        >
                            <polyline points="19 12 12 19 5 12" />
                        </svg>
                    </button>
                </div>

                <p id="post-qa-div" class="hidden italic">
                    {t("messages.comingSoon")}
                </p>
            </div> */}

                    <div class="flex w-full items-center justify-between">
                        <div class="mb-1 mr-2 mt-4">
                            <ReportResource
                                post={post()!}
                                user_id={User.session?.user.id!}
                            />
                        </div>
                    </div>

                    <div class="flex w-full items-center justify-end">
                        <div class="mt-2 flex w-fit items-end justify-end bg-background2 px-2 dark:bg-background2-DM">
                            <a href="#mobile-full-card">
                                <p class="text-ptext2 dark:text-ptext2-DM">
                                    {t("buttons.top")}
                                </p>
                            </a>
                        </div>
                    </div>
                </div>
            </Show>
            <Show when={editRender() && post()}>
                <div class="p-2">
                    <EditPost post={post()!} />
                </div>
            </Show>
        </>
    );
};
