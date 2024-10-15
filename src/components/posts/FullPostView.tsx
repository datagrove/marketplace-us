import type { Component } from "solid-js";
import type { Post } from "@lib/types";
import { createSignal, createEffect, Show } from "solid-js";
import supabase from "../../lib/supabaseClient";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";
import SocialModal from "./SocialModal";
import { AddToCart } from "@components/common/cart/AddToCartButton";
import { Quantity } from "@components/common/cart/Quantity";
import { CreateEditPost } from "@components/posts/CreateEditPost";
import { FavoriteButton } from "@components/posts/AddFavorite";
import type { AuthSession } from "@supabase/supabase-js";
import type { FilterPostsParams } from "@lib/types";
import { ReportResource } from "./ReportResource";
import { AverageRatingStars } from "../posts/AverageRatingStars";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

interface Props {
    postId: string | undefined;
}

async function fetchPosts({
    listing_status,
    draft_status,
    post_id,
    user_id,
}: FilterPostsParams) {
    const response = await fetch("/api/fetchFilterPosts", {
        method: "POST",
        body: JSON.stringify({
            lang: lang,
            listing_status: listing_status,
            draft_status: draft_status,
            post_id: post_id,
            user_id: user_id,
        }),
    });
    const data = await response.json();

    return data;
}

const { data: User, error: UserError } = await supabase.auth.getSession();

export const ViewFullPost: Component<Props> = (props) => {
    const [post, setPost] = createSignal<Post>();
    // const [postData, setPostData] = createSignal<Array<Post>>([]);
    const [postImages, setPostImages] = createSignal<
        { webpUrl: string; jpegUrl: string }[]
    >([]);
    const [quantity, setQuantity] = createSignal<number>(1);

    const [session, setSession] = createSignal<AuthSession | null>(null);

    const [editRender, setEditRender] = createSignal<boolean>(false);

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
    // setTestImages(test2);

    createEffect(() => {
        if (props.postId === undefined) {
            location.href = `/${lang}/404`;
        } else if (props.postId) {
            fetchPost(+props.postId);
        }
    });

    const fetchPost = async (id: number) => {
        try {
            const res = await fetchPosts({
                lang: lang,
                listing_status: true,
                draft_status: false,
                post_id: [id],
            });

            if (res.body.length < 1 && User.session) {
                const userRes = await fetchPosts({
                    lang: lang,
                    listing_status: true,
                    draft_status: false,
                    post_id: [id],
                    user_id: User.session?.user.id,
                });

                if (userRes.body.length < 1) {
                    alert(t("messages.noPost"));
                    location.href = `/${lang}/resources`;
                } else {
                    setPost(userRes.body[0]);
                    setPostImages(userRes.body[0].image_signedUrls);
                    console.log(post());
                }
            } else if (res.body.length < 1 && User.session === null) {
                alert(t("messages.noPost"));
                location.href = `/${lang}/resources`;
            } else {
                setPost(res.body[0]);
                setPostImages(res.body[0].image_signedUrls);
                console.log(post());
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchOwnedPost = async function (id: number) {
        const { data, error } = supabase.from("orders").select("*");

        if (error) {
            console.error(error);
        } else {
            console.log(data, "0000000000000000000");
        }
    };

    fetchOwnedPost(10);

    const updateQuantity = (quantity: number) => {
        setQuantity(quantity);
    };

    const resetQuantity = () => {
        setQuantity(1);
    };

    let slideIndex = 1;
    showSlide(slideIndex);

    function moveSlide(n: number) {
        showSlide((slideIndex += n));
    }

    function currentSlide(n: number) {
        showSlide((slideIndex = n));
    }

    function showSlide(n: number) {
        let i;
        const slides = document.getElementsByClassName("slide");
        // console.log(slides)
        const dots = document.getElementsByClassName("dot");

        if (n > slides.length) {
            slideIndex = 1;
        }
        if (n < 1) {
            slideIndex = slides.length;
        }

        for (i = 0; i < slides.length; i++) {
            slides[i].classList.add("hidden");
        }

        for (i = 0; i < dots.length; i++) {
            dots[i].classList.remove(`bg-white`);
            dots[i].classList.remove(`dark:bg-gray-600`);
            dots[i].classList.add(`bg-slate-300`);
            dots[i].classList.add(`dark:bg-gray-800`);
        }

        //show the active slide
        if (slides.length > 0) {
            slides[slideIndex - 1].classList.remove("hidden");
        }

        //show the active dot
        if (dots.length > 0) {
            dots[slideIndex - 1].classList.remove(`bg-slate-300`);
            dots[slideIndex - 1].classList.remove(`dark:bg-gray-800`);
            dots[slideIndex - 1].classList.add(`bg-white`);
            dots[slideIndex - 1].classList.add(`dark:bg-gray-600`);
        }
    }

    // const twitterUrl =
    //     "https://twitter.com/intent/tweet?text=Check%20this%20out%20!";
    // const facebookUrl = "https://www.facebook.com/sharer/sharer.php?u=";
    // const whatsappUrl = "https://wa.me/?text=";
    // const linkTarget = "_top";
    // const windowOptions = "menubar=yes,status=no,height=300,width=600";

    // function extractTitleText() {
    //     return document.querySelector("h2")?.innerText;
    // }

    // function extractAnchorLink() {
    //     return document.querySelector("a")?.href;
    // }

    // function extractWindowLink() {
    //     const currLink = window.location.href;
    //     return currLink;
    // }

    // function openTwitterWindow(text: any, link: any) {
    //     const twitterQuery = `${text} ${link}`;
    //     return window.open(
    //         `${twitterUrl} ${twitterQuery}&`,
    //         linkTarget,
    //         windowOptions
    //     );
    // }

    // function registerShareButton() {
    //     extractWindowLink();
    //     const text = extractTitleText();
    //     const link = extractWindowLink();
    //     const twitterButton = document.querySelector("#button--twitter");
    //     twitterButton?.addEventListener("click", () =>
    //         openTwitterWindow(text, link)
    //     );
    // }

    // function openFacebookWindow(text: any, link: any) {
    //     const currPage = extractWindowLink();
    //     const testLink =
    //         "https://www.facebook.com/sharer/sharer.php?u=" +
    //         encodeURIComponent(currPage);
    //     window.open(
    //         "https://www.facebook.com/sharer/sharer.php?u=" +
    //             encodeURIComponent(currPage) +
    //             "&t=" +
    //             text,
    //         "",
    //         "menubar=yes,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600"
    //     );
    //     // console.log("TestLink: ", testLink);
    //     // return false;
    // }

    // function registerFacebookButton() {
    //     extractWindowLink();
    //     const text = extractTitleText();
    //     const link = extractWindowLink();
    //     const facebookButton = document.querySelector("#button--facebook");
    //     facebookButton?.addEventListener("click", () =>
    //         openFacebookWindow(text, link)
    //     );
    // }

    // function openWhatsappWindow(text: any, link: any) {
    //     const currPage = extractWindowLink();
    //     const testLink =
    //         whatsappUrl +
    //         // TODO Update to LearnGrove
    //         "Check%20out%20this%20awesome%20resource%20on%20LearnGrove! ";
    //     window.open(
    //         testLink + encodeURIComponent(currPage),
    //         "menubar=yes,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600"
    //     );
    // }

    // function registerWhatsAppButton() {
    //     const text = extractTitleText();
    //     const link = extractWindowLink();
    //     const whatsAppButton = document.querySelector("#button--whatsapp");
    //     whatsAppButton?.addEventListener("click", () =>
    //         openWhatsappWindow(text, link)
    //     );
    // }

    function imageClick(e: Event) {
        e.preventDefault();

        let currImageDiv = e.currentTarget as HTMLDivElement;
        let currImageID = currImageDiv.id;
        let currImage = document.getElementById(currImageID);
        let allImages = document.getElementsByClassName("imageLink");
        let mainImage = document.getElementById("main-image");
        let mainPicture = mainImage?.parentElement as HTMLPictureElement;
        let arrayIndex = Number(currImageID.slice(-1));

        if (!currImage?.classList.contains("border-b-2")) {
            Array.from(allImages).forEach(function (image) {
                image.classList.remove("border-b-2");
                image.classList.remove("border-green-500");
            });

            currImage?.classList.add("border-b-2");
            currImage?.classList.add("border-green-500");
        }

        mainImage?.setAttribute("src", postImages()[arrayIndex].jpegUrl);

        let sourceElement = mainPicture?.querySelector(
            "source[type='image/webp']"
        );
        sourceElement?.setAttribute("srcset", postImages()[arrayIndex].webpUrl);
    }

    function lgTabLinkClick(e: Event) {
        e.preventDefault();

        let currLinkDiv = e.currentTarget as HTMLAnchorElement;
        let currLinkId = currLinkDiv.id;
        let currEl = document.getElementById(currLinkId);
        let allLgLinks = document.getElementsByClassName("tabLinkLg");

        let details = document.getElementById("lg-details-div");
        let description = document.getElementById("lg-description-div");
        let reviews = document.getElementById("lg-reviews-div");
        let qa = document.getElementById("lg-qa-div");

        if (!currEl?.classList.contains("border-b-2")) {
            Array.from(allLgLinks).forEach(function (link) {
                link.classList.remove("border-b-2");
                link.classList.remove("border-green-500");
            });

            currEl?.classList.add("border-b-2");
            currEl?.classList.add("border-green-500");
        }

        if (currLinkId === "detailsLgLink") {
            details?.classList.remove("hidden");
            details?.classList.add("inline");

            closeDescription();
            closeReviews();
            closeQA();
        } else if (currLinkId === "descriptionLgLink") {
            description?.classList.remove("hidden");
            description?.classList.add("inline");

            closeDetails();
            closeReviews();
            closeQA();
        } else if (currLinkId === "reviewsLgLink") {
            reviews?.classList.remove("hidden");
            reviews?.classList.add("inline");

            closeDetails();
            closeDescription();
            closeQA();
        } else if (currLinkId === "qaLgLink") {
            qa?.classList.remove("hidden");
            qa?.classList.add("inline");

            closeDetails();
            closeDescription();
            closeReviews();
        }
    }

    function closeDetails() {
        let details = document.getElementById("lg-details-div");

        if (details?.classList.contains("inline")) {
            details.classList.remove("inline");
            details.classList.add("hidden");
        }
    }

    function closeDescription() {
        let description = document.getElementById("lg-description-div");

        if (description?.classList.contains("inline")) {
            description.classList.remove("inline");
            description.classList.add("hidden");
        }
    }

    function closeReviews() {
        let reviews = document.getElementById("lg-reviews-div");

        if (reviews?.classList.contains("inline")) {
            reviews.classList.remove("inline");
            reviews.classList.add("hidden");
        }
    }

    function closeQA() {
        let qa = document.getElementById("lg-qa-div");

        if (qa?.classList.contains("inline")) {
            qa.classList.remove("inline");
            qa.classList.add("hidden");
        }
    }
    // console.log(postImages());

    return (
        <div class="flex w-full justify-center">
            <Show when={!editRender()}>
                <div id="large-full-card-div" class="mx-2 mb-2 h-full w-3/4">
                    <div
                        id="image-title-details-cart-div"
                        class="grid grid-cols-7"
                    >
                        <div
                            id="images-div"
                            class="col-span-3 mr-1 flex w-[300px] flex-col items-center justify-center lg:h-[400px] lg:w-[400px]"
                        >
                            <Show when={() => postImages().length > 0}>
                                <Show when={postImages().length === 1}>
                                    <div class="relative flex h-[300px] w-[300px] items-center justify-center rounded">
                                        <picture>
                                            <source
                                                srcset={postImages()[0].webpUrl}
                                                type="image/webp"
                                            />
                                            <img
                                                src={postImages()[0].jpegUrl}
                                                id="one-image"
                                                class="flex h-[300px] w-[300px] items-center justify-center rounded object-contain dark:bg-background1-DM"
                                                alt={`${t("postLabels.image")}`}
                                            />
                                        </picture>
                                        <div class="absolute right-2 top-2 col-span-1 flex justify-end">
                                            <div class="inline-block">
                                                <FavoriteButton
                                                    id={Number(props.postId)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Show>

                                <Show when={postImages().length > 1}>
                                    <div class="flex h-full w-full flex-col items-center justify-center">
                                        <div class="relative flex h-[290px] w-[290px] items-center justify-center lg:h-[330px] lg:w-[330px]">
                                            <div class="top-4.5 absolute">
                                                <picture>
                                                    <source
                                                        srcset={
                                                            postImages()[0]
                                                                .webpUrl
                                                        }
                                                        type="image/webp"
                                                    />
                                                    <img
                                                        src={
                                                            postImages()[0]
                                                                .jpegUrl
                                                        }
                                                        id="main-image"
                                                        class="h-[290px] w-[290px] rounded object-contain dark:bg-background1-DM"
                                                        alt={`${t("postLabels.image")}`}
                                                    />
                                                </picture>
                                                <div class="absolute right-2 top-2 col-span-1 flex justify-end">
                                                    <div class="inline-block">
                                                        <FavoriteButton
                                                            id={Number(
                                                                props.postId
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="mt-1 flex w-full justify-around px-1">
                                            {postImages().map(
                                                (
                                                    image: {
                                                        webpUrl: string;
                                                        jpegUrl: string;
                                                    },
                                                    index: number
                                                ) => (
                                                    <div class="flex h-12 w-12 items-center justify-center md:mt-2">
                                                        {index === 0 ? (
                                                            <div
                                                                // id={ index.toString() }
                                                                id={`img ${index.toString()}`}
                                                                class="imageLink flex h-full w-full items-center justify-center"
                                                                onClick={
                                                                    imageClick
                                                                }
                                                            >
                                                                <picture>
                                                                    <source
                                                                        srcset={
                                                                            image.webpUrl
                                                                        }
                                                                        type="image/webp"
                                                                    />
                                                                    <img
                                                                        src={
                                                                            image.jpegUrl
                                                                        }
                                                                        class="mb-2 h-12 w-12 rounded object-cover"
                                                                        alt={`${t("postLabels.image")} ${index + 2}`}
                                                                    />
                                                                </picture>
                                                            </div>
                                                        ) : (
                                                            <div
                                                                // id={ index.toString() }
                                                                id={`img${index.toString()}`}
                                                                class="imageLink flex h-full w-full items-center justify-center"
                                                                onClick={
                                                                    imageClick
                                                                }
                                                            >
                                                                <picture>
                                                                    <source
                                                                        srcset={
                                                                            image.webpUrl
                                                                        }
                                                                        type="image/webp"
                                                                    />
                                                                    <img
                                                                        src={
                                                                            image.jpegUrl
                                                                        }
                                                                        class="mb-2 h-12 w-12 rounded object-cover"
                                                                        alt={`${t("postLabels.image")} ${index + 2}`}
                                                                    />
                                                                </picture>
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </Show>
                            </Show>
                        </div>

                        <div
                            id="details-cart-div"
                            class="col-span-4 col-start-4 ml-1"
                        >
                            <div id="title-div">
                                <div>
                                    <div class="flex w-full flex-row justify-between pr-2 text-2xl font-bold">
                                        {post()?.title}
                                        <Show
                                            when={post()?.draft_status === true}
                                        >
                                            <div class="w-1/4">
                                                <Show
                                                    when={
                                                        post()?.draft_status ===
                                                        true
                                                    }
                                                >
                                                    <div class="rounded-full bg-black text-center text-white dark:bg-white dark:text-black">
                                                        {t("formLabels.draft")}
                                                    </div>
                                                </Show>
                                            </div>
                                        </Show>
                                    </div>
                                </div>
                            </div>

                            <div
                                id="ratings-div-desktop"
                                class="my-1 flex justify-start"
                            >
                                {post() !== undefined ? (
                                    <AverageRatingStars
                                        resourceId={post()!.id}
                                        page={"fullCard"}
                                    />
                                ) : (
                                    <div></div>
                                )}
                            </div>

                            <div
                                id="creator-followers-div"
                                class="mt-4 flex w-full items-center"
                            >
                                <div
                                    id="creator-img-div"
                                    class="flex h-16 w-16 items-center justify-center rounded-full bg-gray-300"
                                >
                                    <a
                                        href={`/${lang}/creator/${post()?.seller_id}`}
                                    >
                                        {post()?.seller_img ? (
                                            <picture>
                                                <source
                                                    type="image/webp"
                                                    srcset={
                                                        post()?.seller_img
                                                            ?.webpUrl
                                                    }
                                                />
                                                <img
                                                    src={
                                                        post()?.seller_img
                                                            ?.jpegUrl
                                                    }
                                                    alt="Seller image"
                                                    class="h-16 w-16 rounded-full object-cover"
                                                />
                                            </picture>
                                        ) : (
                                            <svg
                                                fill="none"
                                                width="40px"
                                                height="40px"
                                                viewBox="0 0 32 32"
                                                class="fill-icon1 dark:fill-icon1-DM"
                                            >
                                                <path d="M16 15.503A5.041 5.041 0 1 0 16 5.42a5.041 5.041 0 0 0 0 10.083zm0 2.215c-6.703 0-11 3.699-11 5.5v3.363h22v-3.363c0-2.178-4.068-5.5-11-5.5z" />
                                            </svg>
                                        )}
                                    </a>
                                </div>

                                <div id="creator-text-div" class="ml-2">
                                    <div>
                                        <a
                                            href={`/${lang}/creator/${post()?.seller_id}`}
                                        >
                                            <p class="font-bold">
                                                {post()?.seller_name}
                                            </p>
                                        </a>
                                    </div>

                                    {/* <div class="flex items-center">
                                <div>117.1K Followers</div>
                            </div> */}
                                </div>
                            </div>

                            <div id="follower-div" class="flex">
                                {/* <button
                            class="dark:ptext-DM my-2 flex items-center justify-center rounded-full bg-btn1 px-4 text-ptext2 dark:bg-btn1-DM"
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
                            <p class="mx-0.5 text-sm">{t("buttons.follow")}</p>
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
                        </button> */}
                            </div>

                            <div id="resource-info-div" class="my-4 ml-6">
                                <div class="">
                                    <div class="my-2 grid w-full grid-cols-4 text-[10px]">
                                        <div class="col-span-1 mr-2 text-end">
                                            <div class="font-bold">
                                                {t("formLabels.subjects")}:
                                            </div>
                                        </div>
                                        <div class="prose col-span-3 flex-wrap text-[10px] text-ptext1 dark:prose-invert dark:text-ptext1-DM">
                                            <div class="flex-wrap">
                                                {post()?.subject?.join(", ")}
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        class={`my-2 grid w-full grid-cols-4 text-[10px] ${post() && post()!.subtopic && post()!.subtopic!.length > 0 ? "" : "hidden"}`}
                                    >
                                        <div class="col-span-1 mr-2 text-end">
                                            <div class="font-bold">
                                                {t("postLabels.subtopics")}:
                                            </div>
                                        </div>
                                        <div class="prose col-span-3 flex-wrap text-[10px] text-ptext1 dark:prose-invert dark:text-ptext1-DM">
                                            <div class="flex-wrap">
                                                {post()?.subtopic?.join(", ")}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="my-2 grid w-full grid-cols-4 text-[10px]">
                                        <div class="col-span-1 mr-2 text-end">
                                            <div class="font-bold">
                                                {t("formLabels.grades")}:
                                            </div>
                                        </div>
                                        <div class="prose col-span-3 flex-wrap text-[10px] text-ptext1 dark:prose-invert dark:text-ptext1-DM">
                                            <div class="flex-wrap">
                                                {post()?.grade?.join(", ")}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="my-2 grid w-full grid-cols-4 text-[10px]">
                                        <div class="col-span-1 mr-2 text-end">
                                            <div class="font-bold">
                                                {t("formLabels.resourceTypes")}:
                                            </div>
                                        </div>
                                        <div class="prose col-span-3 flex-wrap align-middle text-[10px] text-ptext1 dark:prose-invert dark:text-ptext1-DM">
                                            <div class="flex-wrap">
                                                {post()?.resourceTypes!.join(
                                                    ", "
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div
                                id="resource-labels"
                                class="mr-2 flex w-2/5 flex-col items-end justify-end"
                            >
                                <p class="lg:text-md text-xs font-light uppercase">
                                    {t("formLabels.grades")}
                                </p>
                                <p class="lg:text-md text-xs font-light uppercase">
                                    {t("formLabels.subjects")}
                                </p>
                                <p class="lg:text-md text-xs font-light uppercase">
                                    {t("formLabels.resourceTypes")}
                                </p>
                                <p class="lg:text-md text-xs font-light uppercase">
                                    {t("formLabels.fileTypes")}
                                </p>
                                <p class="lg:text-md text-xs font-light uppercase">
                                    {t("formLabels.pages")}
                                </p>
                            </div>

                            <div id="resource-information" class="ml-2 w-3/5">
                                <p class="lg:text-md truncate text-xs">
                                    {post()?.grade?.join(", ")}
                                </p>
                                <p class="lg:text-md truncate text-xs">
                                    {post()?.subject?.join(", ")}
                                </p>
                                <p class="lg:text-md truncate text-xs italic">
                                    {t("messages.comingSoon")}
                                </p>
                                <p class="lg:text-md truncate text-xs italic">
                                    {t("messages.comingSoon")}
                                </p>
                                <p class="lg:text-md truncate text-xs italic">
                                    {t("messages.comingSoon")}
                                </p>
                            </div> */}
                                </div>
                            </div>

                            {/* <Show */}
                            {/*   when={ */}
                            {/*     ( */}
                            {/*       session() === null */}
                            {/*       //     || */}
                            {/*       //   session()?.user.id !== */}
                            {/*       //   post().user_id) && */}
                            {/*       // post().price === undefined */}
                            {/*     ) */}
                            {/*   } */}
                            {/* > */}
                            <Show when={session()?.user.id === post()?.user_id}>
                                <button
                                    class="btn-primary"
                                    onclick={() => {
                                        setEditRender(!editRender());
                                        //(editRender());
                                    }}
                                >
                                    {t("buttons.editPost")}
                                </button>
                            </Show>

                            <Show when={session()?.user.id === post()?.user_id}>
                                <button
                                    class="btn-primary"
                                    onclick={() => {
                                        setEditRender(!editRender());
                                        //(editRender());
                                    }}
                                >
                                    Reviews
                                </button>
                            </Show>

                            {/* </Show> */}
                            {/* NOTE: Quantity and AddToCart styles updated/correct in mobile merge */}
                            <div class="price-div mx-2 mb-4 flex justify-end">
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

                            <div
                                id="add-cart-div"
                                class="mb-1 mr-2 flex justify-end "
                            >
                                <Quantity
                                    quantity={1}
                                    updateQuantity={updateQuantity}
                                />
                                <div class=" ml-4">
                                    {/* TODO: Add FreeDownloadButton component if resource is free */}

                                    {/* TODO: Change resetQuantity because it is not neccesary in free  */}

                                    <AddToCart
                                        item={{ ...post()!, quantity: 1 }}
                                        buttonClick={resetQuantity}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="description-tabs-div" class="mt-2 2xl:mt-0">
                        <div
                            id="desktop-tabs-div"
                            class="mb-2 flex justify-start border-b border-gray-400 pb-2"
                        >
                            <a
                                href="#detailsLg"
                                id="detailsLgLink"
                                class="tabLinkLg mr-10 inline border-b-2 border-green-500"
                                onClick={lgTabLinkClick}
                            >
                                <p class="text-xl">{t("menus.details")}</p>
                            </a>
                            <a
                                href="#descriptionLg"
                                id="descriptionLgLink"
                                class="tabLinkLg mr-10"
                                onClick={lgTabLinkClick}
                            >
                                <p class="text-xl">{t("menus.description")}</p>
                            </a>
                            {/* TODO : Add back for reviews and Q&A
                     <a
                        href="#reviewsLg"
                        id="reviewsLgLink"
                        class="tabLinkLg mr-10"
                        onClick={lgTabLinkClick}
                    >
                        <p class="text-xl">{t("menus.reviews")}</p>
                    </a>
                    <a
                        href="#qaLg"
                        id="qaLgLink"
                        class="tabLinkLg mr-10"
                        onClick={lgTabLinkClick}
                    >
                        <p class="text-xl">{t("menus.qA")}</p>
                    </a> */}
                        </div>

                        <div id="lg-details-div" class="inline">
                            <div class="flex justify-between">
                                {/* <p class="text-lg">{t("menus.details")}</p> */}

                                {/* <button onClick={ changeDetails }>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" id="details-arrow" class="stroke-icon1 dark:stroke-icon1-DM rotate-180">
                    <polyline points="19 12 12 19 5 12" />
                </svg>
            </button> */}
                            </div>

                            <div id="" class="inline">
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
                                    <div>
                                        {/* TODO: add resource type to database and then populate */}
                                        {post()?.resourceTypes!.join(", ")}
                                    </div>
                                </div>

                                {/* TODO: Add back for filetypes and pages
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

                        <div id="lg-description-div" class="hidden">
                            <div class="flex justify-between">
                                {/* TODO: Language file in mobile merge is updated, delete this hardcoding upon merging */}
                                {/* <p class="text-lg">{t("menus.description")}Description</p> */}
                                {/* <button>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" id="description-arrow" class="stroke-icon1 dark:stroke-icon1-DM">
                      <polyline points="19 12 12 19 5 12" />
                  </svg>
              </button> */}
                            </div>
                            {/* <p>{ post()?.grade.join(", ") }</p> */}
                            <div
                                class="prose dark:prose-invert"
                                innerHTML={post()?.content}
                            ></div>
                        </div>

                        <div id="lg-reviews-div" class="hidden">
                            <div class="flex justify-between">
                                {/* TODO: Language file in mobile component merge is updated, delete hardcoding upon merging */}
                                {/* <p class="text-lg">{t("menus.reviews")}Reviews</p> */}
                            </div>
                            <p id="" class="italic">
                                {t("messages.comingSoon")}
                            </p>
                        </div>

                        <div id="lg-qa-div" class="hidden">
                            <div class="flex justify-between">
                                {/* <p class="text-lg">{t("menus.qA")}</p> */}
                            </div>
                            <p id="" class="italic">
                                {t("messages.comingSoon")}
                            </p>
                        </div>
                    </div>

                    <div class="flex w-full items-center justify-between">
                        <div class="mb-1 mr-2 mt-4">
                            <ReportResource
                                post={post()!}
                                user_id={session()?.user.id!}
                            />
                        </div>
                        <div class="mt-2 flex w-fit items-end justify-end bg-background2 px-2 dark:bg-background2-DM">
                            <a href="#large-full-card-div">
                                <p class="text-ptext2 dark:text-ptext2-DM">
                                    {t("buttons.top")}
                                </p>
                            </a>
                        </div>
                    </div>
                </div>
            </Show>
            <Show when={editRender() && post()}>
                <div class="flex w-full justify-center">
                    <CreateEditPost mode="Edit" post={post()!} />
                </div>
            </Show>
        </div>
    );
};
