import type { Component } from "solid-js";
import type { Post } from "@lib/types";
import { createSignal, createEffect, Show } from "solid-js";
import supabase from "../../lib/supabaseClient";
import { DeletePostButton } from "../posts/DeletePostButton";
import { ui } from "../../i18n/ui";
import type { uiObject } from "../../i18n/uiType";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

//get the categories from the language files so they translate with changes in the language picker
const values = ui[lang] as uiObject;
const productCategories = values.subjectCategoryInfo.subjects;

interface Props {
  id: string | undefined;
}

export const MobileViewFullPost: Component<Props> = (props)=> {
    const [post, setPost] = createSignal<Post>();
    const [postImages, setPostImages] = createSignal<string[]>([]);

    createEffect(() => {
        if (props.id === undefined) {
          location.href = `/${lang}/404`;
        } else if (props.id) {
          fetchPost(+props.id);
        }
    });

    const fetchPost = async (id: number) => {
        try {
            const { data, error } = await supabase
            .from("sellerposts")
            .select("*")
            .eq("id", id);

        if (error) {
            console.log(error);
        } else if (data[0] === undefined) {
            alert(t("messages.noPost"));
            location.href = `/${lang}/services`;
        } else {
            data?.map(async (item) => {
                item.subject = [];
                productCategories.forEach((productCategories) => {
                    item.product_subject.map((productSubject: string) => {
                        if (productSubject === productCategories.id) {
                            item.subject.push(productCategories.name);
                            console.log(productCategories.name);
                        }
                    });
                });
                delete item.product_subject;

                const { data: gradeData, error: gradeError } = await supabase
                .from("grade_level")
                .select("*");

                if (gradeError) {
                console.log("supabase error: " + gradeError.message);
                } else {
                item.grade = [];
                gradeData.forEach((databaseGrade) => {
                    item.post_grade.map((itemGrade: string) => {
                    if (itemGrade === databaseGrade.id.toString()) {
                        item.grade.push(databaseGrade.grade);
                    }
                    });
                });
                }
            });
        setPost(data[0]);
        console.log(post());
        }
    } catch (error) {
        console.log(error);
    }
    };

    createEffect(async () => {
        if (post() !== undefined) {
          if (post()?.image_urls === undefined || post()?.image_urls === null) {
          } else {
            await downloadImages(post()?.image_urls!);
          }
        }
    });

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

    return (
        <div class="border-2 border-red-400 w-96">
            <div>
                <p class="text-2xl font-bold">{ post()?.title }</p>
            </div>

            <div id="ratings-div" class="flex my-1">
                <div id="ratings-stars-div" class="flex w-fit mr-2">
                    <svg fill="none" width="20px" height="20px" viewBox="0 0 32 32" class="fill-icon1 dark:fill-icon1-DM">
                        <path d="M 30.335938 12.546875 L 20.164063 11.472656 L 16 2.132813 L 11.835938 11.472656 L 1.664063 12.546875 L 9.261719 19.394531 L 7.140625 29.398438 L 16 24.289063 L 24.859375 29.398438 L 22.738281 19.394531 Z"/>
                    </svg>

                    <svg fill="none" width="20px" height="20px" viewBox="0 0 32 32" class="fill-icon1 dark:fill-icon1-DM">
                        <path d="M 30.335938 12.546875 L 20.164063 11.472656 L 16 2.132813 L 11.835938 11.472656 L 1.664063 12.546875 L 9.261719 19.394531 L 7.140625 29.398438 L 16 24.289063 L 24.859375 29.398438 L 22.738281 19.394531 Z"/>
                    </svg>

                    <svg fill="none" width="20px" height="20px" viewBox="0 0 32 32" class="fill-icon1 dark:fill-icon1-DM">
                        <path d="M 30.335938 12.546875 L 20.164063 11.472656 L 16 2.132813 L 11.835938 11.472656 L 1.664063 12.546875 L 9.261719 19.394531 L 7.140625 29.398438 L 16 24.289063 L 24.859375 29.398438 L 22.738281 19.394531 Z"/>
                    </svg>

                    <svg fill="none" width="20px" height="20px" viewBox="0 0 32 32" class="fill-icon1 dark:fill-icon1-DM">
                        <path d="M 30.335938 12.546875 L 20.164063 11.472656 L 16 2.132813 L 11.835938 11.472656 L 1.664063 12.546875 L 9.261719 19.394531 L 7.140625 29.398438 L 16 24.289063 L 24.859375 29.398438 L 22.738281 19.394531 Z"/>
                    </svg>

                    <svg fill="none" width="20px" height="20px" viewBox="0 0 32 32" class="fill-icon1 dark:fill-icon1-DM">
                        <path d="M 30.335938 12.546875 L 20.164063 11.472656 L 16 2.132813 L 11.835938 11.472656 L 1.664063 12.546875 L 9.261719 19.394531 L 7.140625 29.398438 L 16 24.289063 L 24.859375 29.398438 L 22.738281 19.394531 Z"/>
                    </svg>
                </div>

                {/* TODO: fix hard coding */}
                <div id="ratings-text-div" class="flex">
                    <p class="font-bold">4.9</p>
                    <p>(30.3K ratings)</p>
                </div>
            </div>

            <div id="creator-followers-div" class="flex w-full items-center">
                <div id="creator-img-div" class="flex justify-center w-16 h-16 items-center bg-gray-300 rounded-full">
                    <svg fill="none" width="40px" height="40px" viewBox="0 0 32 32" class="fill-icon1 dark:fill-icon1-DM">
                        <path d="M16 15.503A5.041 5.041 0 1 0 16 5.42a5.041 5.041 0 0 0 0 10.083zm0 2.215c-6.703 0-11 3.699-11 5.5v3.363h22v-3.363c0-2.178-4.068-5.5-11-5.5z"/>
                    </svg>
                </div>

                <div id="creator-follower-text-div" class="ml-1 w-5/6">
                    <div>
                        <a href={`/${ lang }/provider/${ post()?.seller_id }`}>
                            <p class="font-bold">{ post()?.seller_name }</p>
                        </a>
                    </div>

                    <div class="flex w-full items-center">
                        <div>
                            117.1K Followers
                        </div>

                        <div>

                        <button class="flex items-center justify-center bg-btn1 dark:bg-btn1-DM rounded-full px-4 text-ptext2 dark:ptext-DM mx-4">
                            <svg width="18px" height="20px" viewBox="0 0 24 24" fill="none" class="mx-0.5">
                                <circle cx="9" cy="7" r="4" stroke="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="stroke-icon2 dark:stroke-icon2-DM"/>
                                <path d="M2 21V17C2 15.8954 2.89543 15 4 15H14C15.1046 15 16 15.8954 16 17V21" stroke="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="stroke-icon2 dark:stroke-icon2-DM"/>
                                <path d="M19 8V14M16 11H22" stroke="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="stroke-icon2 dark:stroke-icon2-DM"/>
                            </svg>
                            <p class="mx-0.5 text-sm">{t("buttons.follow")}</p>
                        </button>

                        <button class="hidden items-center justify-center bg-btn1 dark:bg-btn1-DM rounded-full px-4 text-ptext2 dark:ptext-DM mx-4">
                            <svg width="18px" height="20px" viewBox="0 0 24 24" fill="none" class="mx-0.5">
                                <circle cx="9" cy="7" r="4" stroke="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="stroke-icon2 dark:stroke-icon2-DM"/>
                                <path d="M2 21V17C2 15.8954 2.89543 15 4 15H14C15.1046 15 16 15.8954 16 17V21" stroke="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="stroke-icon2 dark:stroke-icon2-DM"/>
                            </svg>
                            <p class="mx-0.5 text-sm">{t("buttons.following")}</p>
                        </button>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                Images div
            </div>

            <div>
                Add to Cart div
            </div>

            <div class="flex justify-start pb-2 border-b border-border1 dark:border-border1-DM">
                <p class="mr-6 border-b-2 border-green-500">{t("menus.details")}</p>
                <p class="mr-6 border-b-2 border-green-500">{t("menus.description")}</p>
                <p class="mr-6 border-b-2 border-green-500">{t("menus.reviews")}</p>
                <p class="mr-6 border-b-2 border-green-500">{t("menus.qA")}</p>
            </div>

            <div>
                <p class="text-lg">{t("menus.details")}</p>

                <div>
                    <p class="font-light uppercase">{t("formLabels.grades")}</p>
                </div>

                <div>
                    <p class="font-light uppercase">{t("formLabels.subjects")}</p>
                </div>

                <div>
                    <p class="font-light uppercase">{t("formLabels.resourceTypes")}</p>
                </div>

                <div>
                    <p class="font-light uppercase">{t("formLabels.fileTypes")}</p>
                </div>
            </div>

            <div>
                Description
            </div>

            <div>
                Reviews
            </div>

            <div>
                Q&A
            </div>

            <div>
                Report
            </div>

            <div>
                Back to Top
            </div>

        </div>
    )

}