import type { Component } from "solid-js";
import { Show } from "solid-js";
import { useStore } from "@nanostores/solid";
import { windowSize } from "@components/common/WindowSizeStore";
import { SITE } from "../../config";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";
import { ThemeBtn } from "./ThemeIcon";

import { ProfileBtn } from "./ProfileBtn";
import { MobileProfileBtn } from "./MobileProfileBtn";
import { Cart } from "@components/common/cart/Cart";
import { CreatePostsRouting } from "../posts/CreatePostsRouting";
import { SearchBar } from "@components/common/HeaderSearchBar";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

export const Header: Component = () => {

    const screenSize = useStore(windowSize);

    return (
        <header>
            <div class="flex h-full items-center justify-between px-4 md:pb-4">
                <div class="md:hidden">
                    <MobileProfileBtn />
                </div>
                <div class="navLines flex items-center" id="navLines">
                    <div class="all-logo">
                        <a id="logo" href={`/${lang}`} aria-label={t("ariaLabels.todo")}>
                            <svg
                                width="180"
                                height="180"
                                viewBox="0 0 180 180"
                                version="1.1"
                                id="svg1"
                                class="ml-1 h-8 w-8 fill-logo1 stroke-logo1 dark:fill-logo1-DM dark:stroke-logo1-DM md:ml-0 md:h-12 md:w-12"
                            >
                                <g id="layer1">
                                    <circle
                                        style="fill:none;fill-opacity:1;stroke-width:2.31085;stroke-dasharray:none;stroke-opacity:1"
                                        id="path4-5"
                                        cx="90.255104"
                                        cy="90.192787"
                                        r="86.344574"
                                    ></circle>
                                    <circle
                                        style="fill:none;fill-opacity:1;stroke-width:2.13599;stroke-dasharray:none;stroke-opacity:1"
                                        id="path4-1-6"
                                        cx="90.114067"
                                        cy="90.788353"
                                        r="79.811508"
                                    ></circle>
                                    <g
                                        style="fill-opacity:1;stroke-width:1.00012;stroke-dasharray:none;stroke-opacity:1"
                                        id="g5-7"
                                        transform="matrix(5.909063,0,0,6.1904404,17.876796,12.726997)"
                                    >
                                        <path
                                            fill-rule="evenodd"
                                            clip-rule="evenodd"
                                            d="m 12.0634,4.04209 c 2.997,-0.36695 5.7363,1.71348 6.219,4.68849 0.0512,0.31544 0.2501,0.58742 0.5351,0.73186 1.1441,0.57966 1.9861,1.70296 2.1528,3.07616 0.2655,2.1874 -1.2848,4.1698 -3.4526,4.4353 -0.3051,0.0373 -0.6782,0.037 -1.0178,-0.0164 -0.3615,-0.0569 -0.5654,-0.1548 -0.6411,-0.2174 -0.4257,-0.3518 -1.056,-0.2918 -1.4078,0.1339 -0.3518,0.4257 -0.2919,1.0561 0.1338,1.4079 0.4755,0.3929 1.0901,0.5704 1.6044,0.6513 0.5362,0.0844 1.0962,0.084 1.5716,0.0258 3.2712,-0.4005 5.5925,-3.3862 5.195,-6.6614 C 22.7275,10.4174 21.6524,8.84696 20.162,7.9256 19.3016,4.16205 15.7296,1.57827 11.8203,2.05692 9.22789,2.37434 7.10232,3.96441 5.98423,6.12144 2.75534,6.63544 0.999995,9.6056 1,12.6317 c 0,0.9741 0.33367,2.5007 1.49103,3.7971 1.18623,1.3288 3.13057,2.2968 6.11678,2.2968 0.55229,0 1,-0.4477 1,-1 0,-0.5523 -0.44771,-1 -1,-1 -2.52548,0 -3.88504,-0.8 -4.62479,-1.6287 C 3.2144,14.2359 3,13.2155 3,12.6317 3,10.7371 3.84959,9.16206 5.21959,8.45213 5.11229,9.13669 5.09664,9.84705 5.18413,10.5678 5.25068,11.1161 5.74908,11.5066 6.29734,11.44 6.8456,11.3735 7.23611,10.8751 7.16956,10.3268 7.04587,9.30783 7.20007,8.32218 7.57135,7.44331 8.33213,5.64245 10.0002,4.29471 12.0634,4.04209 Z m 4.5951,8.71051 c 0.4156,-0.3637 0.4578,-0.9955 0.0941,-1.4111 -0.3637,-0.4156 -0.9955,-0.4577 -1.4111,-0.0941 l -3.3573,2.9377 -2.34402,-1.9533 c -0.42427,-0.3536 -1.05484,-0.2962 -1.4084,0.128 -0.35357,0.4243 -0.29624,1.0549 0.12804,1.4084 L 11,15.9684 V 22 c 0,0.5523 0.4477,1 1,1 0.5523,0 1,-0.4477 1,-1 v -6.0462 z"
                                            id="path1-8"
                                            style="fill-opacity:1;stroke:none;stroke-width:1.00012;stroke-dasharray:none;stroke-opacity:1"
                                        ></path>
                                    </g>
                                </g>
                            </svg>
                        </a>
                    </div>

                    <div>
                        <h1 class="pl-2 text-3xl text-ptext1 dark:text-ptext1-DM md:text-5xl">
                            <a href={`/${lang}`}>{SITE.title}</a>
                        </h1>
                    </div>
                </div>
                <Show when={screenSize() !== "sm"}>
                <SearchBar />
                </Show>

                <div class="flex items-center md:w-[50%] md:justify-end lg:w-[40%] xl:w-[35%]">
                    <div class="hidden md:block">
                        <ThemeBtn />
                    </div>

                    <div class="">
                        <Cart />
                    </div>

                    <div class="hidden md:block">
                        <ProfileBtn />
                    </div>
                </div>
            </div>
            <Show when={screenSize() === "sm"}>
                <div class="flex w-full px-4 pb-1">
                <SearchBar />
                </div>
            </Show>
        </header>
    );
};
