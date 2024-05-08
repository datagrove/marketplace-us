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
import { ViewProviderPosts } from "../../components/posts/ViewProviderPosts";
import type { AuthSession } from "@supabase/supabase-js";
import UserImage from "./UserImage";
import { ui } from "../../i18n/ui";
import type { uiObject } from "../../i18n/uiType";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";
import { StripeButton } from "./provider/StripeButton";
import { MobileViewCard } from "@components/services/MobileViewCard";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

//get the categories from the language files so they translate with changes in the language picker
const values = ui[lang] as uiObject;
const productCategories = values.subjectCategoryInfo.subjects;

interface Provider {
    seller_name: string;
    seller_id: number;
    seller_phone: string;
    major_municipality: string;
    minor_municipality: string;
    governing_district: string;
    user_id: string;
    image_url: string | null;
    email: string;
    created_at: string;
    first_name: string;
    last_name: string;
    country: string;
    language_spoken: string[];
    languages: string;
  }
  
  async function postFormData(formData: FormData) {
    const response = await fetch("/api/providerProfileEdit", {
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

  export const ProviderProfileView: Component<Props> = (props) => {
    const [provider, setProvider] = createSignal<Provider>();
    const [session, setSession] = createSignal<AuthSession | null>(null);
    const [providerImage, setProviderImage] = createSignal<string>("");
    const [editMode, setEditMode] = createSignal<boolean>(false); //TODO Set back to false
    const [imageUrl, setImageUrl] = createSignal<string | null>(null);
    const [screenSize, setScreenSize] = createSignal<
      "sm" | "md" | "lg" | "xl" | "2xl"
    >();
    const [formData, setFormData] = createSignal<FormData>();
    const [response] = createResource(formData, postFormData);
    const [languageSpoken, setLanguageSpoken] = createSignal<string[]>([]);
    const [languages, setLanguages] =
      createSignal<Array<{ id: number; language: string; checked: boolean }>>();
    const [languagePick, setLanguagePick] = createSignal<Array<string>>([]);

    createEffect(() => {
        setSession(User.session);
        if (typeof session() !== "undefined") {
          fetchProvider(session()?.user.id!);
        }
    });

    const fetchProvider = async (user_id: string) => {
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
              alert(t("messages.noProvider"));
              location.href = `/${lang}/provider/createaccount`;
            } else {
              setProvider(data[0]);
            }
          } catch (error) {
            console.log(error);
          }
        } else {
          alert(t("messages.signIn"));
          location.href = `/${lang}/login`;
        }
      };
    
    const enableEditMode = () => {
        setEditMode(!editMode());
    };
    
    function providerViewTabClick(e) {
        e.preventDefault();

        let currLinkId = e.currentTarget.id;
        let currEl = document.getElementById(currLinkId);
        let allLgLinks = document.getElementsByClassName("providerViewtabLinkLg");

        let profile = document.getElementById("providerViewProfile");
        let resources = document.getElementById("providerViewResources");
        let ratings = document.getElementById("providerViewRatings");
        let questions = document.getElementById("providerViewQuestions");
        let downloads = document.getElementById("providerViewDownload");
        let payouts = document.getElementById("providerViewPayouts");

        if(!currEl.classList.contains("border-b-2")) {
            Array.from(allLgLinks).forEach(function(link) {
                link.classList.remove("border-b-2");
                link.classList.remove("border-green-500");
            })
            
            currEl.classList.add("border-b-2");
            currEl.classList.add("border-green-500");
        };

        if(currLinkId === "creatorViewProfileLink") {
            profile.classList.remove("hidden");
            profile.classList.add("inline");

            closeResources();
            closeRatings();
            closeQuestions();
            closeDownloads();
            closePayouts();
        } else if(currLinkId === "creatorViewResourcesLink") {
            resources.classList.remove("hidden");
            resources.classList.add("inline");

            closeProfile();
            closeRatings();
            closeQuestions();
            closeDownloads();
            closePayouts();
        } else if(currLinkId === "creatorViewRatingsLink") {
            ratings.classList.remove("hidden");
            ratings.classList.add("inline");

            closeProfile();
            closeResources();
            closeQuestions();
            closeDownloads();
            closePayouts();
        } else if(currLinkId === "creatorViewQuestionsLink") {
            questions.classList.remove("hidden");
            questions.classList.add("inline");

            closeProfile();
            closeRatings();
            closeResources();
            closeDownloads();
            closePayouts();
        } else if(currLinkId === "creatorViewDownloadLink") {
            downloads.classList.remove("hidden");
            downloads.classList.add("inline");

            closeProfile();
            closeRatings();
            closeResources();
            closeQuestions();
            closePayouts();
        } else if(currLinkId === "creatorViewPayoutsLink") {
            payouts.classList.remove("hidden");
            payouts.classList.add("inline");

            closeProfile();
            closeRatings();
            closeResources();
            closeQuestions();
            closeDownloads();
        }
    };

    function closeProfile() {
        let profile = document.getElementById("providerViewProfile");

        if(profile.classList.contains("inline")) {
            profile.classList.remove("inline");
            profile.classList.add("hidden");
        }
    };

    function closeResources() {
        let resources = document.getElementById("providerViewResources");

        if(resources.classList.contains("inline")) {
            resources.classList.remove("inline");
            resources.classList.add("hidden")
        }
    };

    function closeRatings() {
        let ratings = document.getElementById("providerViewRatings");

        if(ratings.classList.contains("inline")) {
            ratings.classList.remove("inline");
            ratings.classList.add("hidden")
        }
    };

    function closeQuestions() {
        let questions = document.getElementById("providerViewQuestions");

        if(questions.classList.contains("inline")) {
            questions.classList.remove("inline");
            questions.classList.add("hidden")
        }
    };

    function closeDownloads() {
        let downloads = document.getElementById("providerViewDownload");

        if(downloads.classList.contains("inline")) {
            downloads.classList.remove("inline");
            downloads.classList.add("hidden")
        }
    };

    function closePayouts() {
        let payouts = document.getElementById("providerViewPayouts");

        if(payouts.classList.contains("inline")) {
            payouts.classList.remove("inline");
            payouts.classList.add("hidden")
        }
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
        formData.append("languageArray", JSON.stringify(languagePick()));
        if (imageUrl() !== null) {
          formData.append("image_url", imageUrl()!);
        }
        setFormData(formData);
    };

    return (
        <div>
            <div id="provider-view-header" class="h-36 w-full bg-background2 dark:bg-background2-DM">
                <Show when={editMode() === false}>
                    <Show when={typeof providerImage() !== "undefined"}>
                        <div class="object-contain overflow-hidden relative justify-center w-24 h-24 rounded-full border md:w-24 md:h-24 lg:w-24 lg:h-24 border-border1 dark:border-border1-DM">
                            <img
                            src={providerImage()}
                            class="block object-contain absolute top-1/2 left-1/2 justify-center h-56 -translate-x-1/2 -translate-y-1/2 md:h-96"
                            alt={`${t("postLabels.providerProfileImage")} 1`}
                            />
                        </div>
                    </Show>
                </Show>

                <Show when={editMode() === true}>
                    <UserImage
                        url={imageUrl()}
                        size={150}
                        onUpload={(e: Event, url: string) => {
                        setImageUrl(url);
                        }}
                    />
                </Show>
            </div>

            <div class="text-xl italic font-bold text-end mt-4 underline text-alert1 dark:text-alert1-DM">
                <Show when={editMode() === true}>
                    <h1 class="text-alert1 dark:text-alert1-DM">
                        {t("messages.profileEdits")}
                    </h1>
                </Show>
            </div>

            <div id="provider-view-username-reviews-edit" class="mt-10 w-full">
                <div class="grid md:grid-cols-[525px_50px_150px] lg:grid-cols-[750px_50px_150px] xl:grid-cols-[900px_50px_200px]">
                    <div class="provider-name-edit-button-div">
                        <Show when={ editMode() === false }>
                            <div class="">
                                <h2 class="lg:text-2xl font-bold line-clamp-2">
                                    {provider()?.seller_name == ""
                                    ? provider()?.first_name + " " + provider()?.last_name
                                    : provider()?.seller_name}
                                </h2>
                            </div>
                        </Show>

                        <Show when={editMode() === true}>
                            <div class="flex relative items-center mr-2">
                                <svg
                                    class="w-4 h-4 rounded-full border-2 dark:border-none peer bg-icon1 fill-iconbg1 border-border1 dark:bg-background1-DM dark:fill-iconbg1-DM"
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
                                    class="absolute invisible p-2 m-4 mx-auto w-48 text-sm rounded-md opacity-0 transition-opacity -translate-x-full -translate-y-2/3 md:translate-x-1/4 md:translate-y-0 peer-hover:opacity-100 peer-hover:visible bg-background2 text-ptext2 dark:bg-background2-DM dark:text-ptext2-DM"
                                >
                                    {t("toolTips.displayName")}
                                </span>
                            </div>

                            <div class="h-0 basis-full"></div>

                            <div class="basis-full">
                                <input
                                    type="text"
                                    id="ProviderName"
                                    name="ProviderName"
                                    class="px-1 mb-4 rounded border focus:border-2 focus:outline-none border-inputBorder1 bg-background1 text-ptext1 dark:focus:border-highlight1-DM dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM focus:border-highlight1"
                                    value={provider()?.seller_name}
                                />
                            </div>
                      </Show>
                    </div>

                    <div id="provider-edit-btn-div" class="flex items-center justify-center">
                        <button 
                            onClick={ enableEditMode }
                        >
                            <Show when={ editMode() !== true }>
                                <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" class="fill-icon1 dark:fill-icon1-DM stroke-icon2 dark:stroke-icon2-DM xl:w-[50px] xl:h-[50px]">
                                    <path d="M13.0207 5.82839L15.8491 2.99996L20.7988 7.94971L17.9704 10.7781M13.0207 5.82839L3.41405 15.435C3.22652 15.6225 3.12116 15.8769 3.12116 16.1421V20.6776H7.65669C7.92191 20.6776 8.17626 20.5723 8.3638 20.3847L17.9704 10.7781M13.0207 5.82839L17.9704 10.7781" stroke="none" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </Show>
                            
                            <Show when={ editMode() === true }>
                                <svg width="30px" height="30px" viewBox="0 0 24 24" role="img" aria-labelledby="saveIconTitle" stroke="none" stroke-width="1" stroke-linecap="square" stroke-linejoin="miter" fill="none" color="none" class="stroke-icon2 dark:stroke-icon1 fill-icon1 dark:fill-icon1-DM xl:w-[50px] xl:h-[50px]"> 
                                    <path d="M17.2928932,3.29289322 L21,7 L21,20 C21,20.5522847 20.5522847,21 20,21 L4,21 C3.44771525,21 3,20.5522847 3,20 L3,4 C3,3.44771525 3.44771525,3 4,3 L16.5857864,3 C16.8510029,3 17.1053568,3.10535684 17.2928932,3.29289322 Z"/> <rect width="10" height="8" x="7" y="13"/> <rect width="8" height="5" x="8" y="3"/> 
                                </svg>
                            </Show>
                        </button>
                    </div>

                    <div class="add-resource-div flex justify-end items-center w-full">
                        <button
                            class="btn-primary flex items-center justify-center w-full"
                            onClick={ () => window.location.href=`/${lang}/posts/createpost` }
                        >
                            <svg fill="none" width="20px" height="20px" viewBox="0 0 1920 1920" class="fill-icon2 dark:fill-icon2-DM pr-1">
                                <path d="M915.744 213v702.744H213v87.842h702.744v702.744h87.842v-702.744h702.744v-87.842h-702.744V213z" fill-rule="evenodd"/>
                            </svg>
                            <p class="pl-1 text-lg font-light">{t("pageTitles.createPost")}</p>
                        </button>
                    </div>
                </div>

                <div id="provider-view-reviews-div" class="flex items-center">
                    <div id="provider-view-ratings-stars-div" class="flex w-fit mr-2">
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

                    <div id="provider-view-ratings-text-div" class="flex">
                        <p class="font-bold">4.9</p>
                        <p class="font-light">&nbsp (21.K)</p>
                    </div>
                </div>
            </div>

            <div id="provider-view-tabs-content-div" class="mt-2">
                <div id="provider-view-tabs" class="flex mb-4"> 
                    <a href="#profileCreatorView" id="creatorViewProfileLink" class="providerViewtabLinkLg border-b-2 border-green-500 mr-2 md:mr-6 lg:mr-10 inline" onClick={ providerViewTabClick }><p class="text-sm md:text-base lg:text-xl font-bold">{t("menus.profile")}</p></a>
                    <a href="#resourcesCreatorView" id="creatorViewResourcesLink" class="providerViewtabLinkLg mr-2 md:mr-6 lg:mr-10" onClick={ providerViewTabClick }><p class="text-sm md:text-base lg:text-xl font-bold">{t("menus.providerResources")}</p></a>
                    <a href="#ratingsCreatorView" id="creatorViewRatingsLink" class="providerViewtabLinkLg mr-2 md:mr-6 lg:mr-10" onClick={ providerViewTabClick }><p class="text-sm md:text-base lg:text-xl font-bold">{t("menus.ratingsReviews")}</p></a>
                    <a href="#questionsCreatorView" id="creatorViewQuestionsLink" class="providerViewtabLinkLg mr-2 md:mr-6 lg:mr-10" onClick={ providerViewTabClick }><p class="text-sm md:text-base lg:text-xl font-bold">{t("menus.questions")}</p></a>
                    <a href="#downloadCreatorView" id="creatorViewDownloadLink" class="providerViewtabLinkLg mr-2 md:mr-6 lg:mr-10" onClick={ providerViewTabClick }><p class="text-sm md:text-base lg:text-xl font-bold">{t("menus.freeDownload")}</p></a>
                    <a href="#payoutsCreatorView" id="creatorViewPayoutsLink" class="providerViewtabLinkLg mr-2 md:mr-6 lg:mr-10" onClick={ providerViewTabClick }><p class="text-sm md:text-base lg:text-xl font-bold">{t("menus.payouts")}</p></a>
                </div>

                <div id="providerViewProfile" class="inline">
                    <div class="first-name flex my-2">
                        <label
                            for="FirstName"
                            class="text-ptext1 dark:text-ptext1-DM font-bold"
                        >
                            {t("formLabels.firstName")}:
                        </label>

                        <Show when={editMode() === false}>
                            <p
                                id="FirstName"
                                class="px-1"
                            >
                            {provider()?.first_name}
                            </p>
                        </Show>

                        <Show when={editMode() === true}>
                            <div class="flex relative items-center mr-2">
                                <svg
                                    class="w-4 h-4 rounded-full border peer bg-background1 fill-background1 border-inputBorder1 dark:bg-background1-DM dark:border-inputBorder1-DM"
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
                                    class="absolute invisible p-2 m-4 mx-auto w-48 text-sm rounded-md opacity-0 transition-opacity -translate-x-full -translate-y-2/3 md:translate-x-1/4 md:translate-y-0 peer-hover:opacity-100 peer-hover:visible bg-background2 text-ptext2 dark:bg-background2-DM dark:text-ptext2-DM"
                                >
                                    {t("toolTips.firstName")}
                                </span>
                            </div>

                            <div class="">
                                <input
                                    type="text"
                                    id="FirstName"
                                    name="FirstName"
                                    class="px-1 rounded border focus:border-2 focus:outline-none border-inputBorder1 bg-background1 text-ptext1 dark:focus:border-highlight1-DM dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM focus:border-highlight1"
                                    value={provider()?.first_name}
                                    required
                                />
                            </div>
                        </Show>
                    </div>

                    <div class="last-name flex my-2">
                        <label
                            for="LastName"
                            class="text-ptext1 dark:text-ptext1-DM font-bold"
                        >
                            {t("formLabels.lastName")}:
                        </label>

                        <Show when={editMode() === false}>
                            <p
                                id="LastName"
                                class="px-1"
                            >
                                {provider()?.last_name}
                            </p>
                        </Show>

                        <Show when={editMode() === true}>
                            <div class="flex relative items-center mr-2">
                                <svg
                                    class="w-4 h-4 rounded-full border peer bg-background1 fill-background1 border-inputBorder1 dark:bg-background1-DM dark:border-inputBorder1-DM"
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
                                class="absolute invisible p-2 m-4 mx-auto w-48 text-sm rounded-md opacity-0 transition-opacity -translate-x-full -translate-y-2/3 md:translate-x-1/4 md:translate-y-0 peer-hover:opacity-100 peer-hover:visible bg-background2 text-ptext2 dark:bg-background2-DM dark:text-ptext2-DM"
                                >
                                {t("toolTips.lastName")}
                                </span>
                            </div>
                            <div class="">
                                <input
                                type="text"
                                id="LastName"
                                name="LastName"
                                class="px-1 rounded border focus:border-2 focus:outline-none border-inputBorder1 bg-background1 text-ptext1 dark:focus:border-highlight1-DM dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM focus:border-highlight1"
                                value={provider()?.last_name}
                                />
                            </div>
                        </Show>
                    </div>

                    <div class="email flex my-2">
                        <label
                            for="email"
                            class="text-ptext1 dark:text-ptext1-DM font-bold"
                        >
                            {t("formLabels.email")}: &nbsp;
                        </label>

                        <Show when={ editMode() === false }>
                            <div class="flex">
                                {/* <p class="font-bold">{t("formLabels.email")}:&nbsp;</p> */}
                                <a href={`mailto:${ provider()?.email }`}><p>{ provider()?.email }</p></a>
                            </div>
                        </Show>

                        <Show when={ editMode() === true }>
                            <div class="flex relative items-center mr-2">
                                <svg
                                    class="w-4 h-4 rounded-full border-2 dark:border-none peer bg-icon1 fill-iconbg1 border-border1 dark:bg-background1-DM dark:fill-iconbg1-DM"
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
                                    class="absolute invisible p-2 m-4 mx-auto w-48 text-sm rounded-md opacity-0 transition-opacity -translate-x-full -translate-y-2/3 md:translate-x-1/4 md:translate-y-0 peer-hover:opacity-100 peer-hover:visible bg-background2 text-ptext2 dark:bg-background2-DM dark:text-ptext2-DM"
                                >
                                    {t("toolTips.changeEmail")}
                                </span>
                            </div>
                            
                            <div class="">
                                <input
                                    id="email"
                                    name="email"
                                    class="px-1 rounded border focus:border-2 focus:outline-none border-inputBorder1 bg-background1 text-ptext1 dark:focus:border-highlight1-DM dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM focus:border-highlight1"
                                    type="email"
                                    placeholder={t("formLabels.email")}
                                    value={provider()?.email}
                                />
                            </div>
                        </Show>
                    </div>
                    
                </div>

                <div id="providerViewResources" class="hidden">
                    <ViewProviderPosts />
                </div>

                <div id="providerViewRatings" class="hidden">
                    <p class="italic">{t("messages.comingSoon")}</p>
                </div>

                <div id="providerViewQuestions" class="hidden">
                    <p class="italic">{t("messages.comingSoon")}</p>
                </div>

                <div id="providerViewDownload" class="hidden">
                    <p class="italic">{t("messages.comingSoon")}</p>
                </div>

                <div id="providerViewPayouts" class="hidden">
                    <StripeButton />
                </div>
            </div>
        </div>
    )
  }