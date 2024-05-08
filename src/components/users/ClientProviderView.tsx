import type { Component } from "solid-js";
import { createSignal, createEffect, Show, onMount } from "solid-js";
import supabase from "../../lib/supabaseClient";
import { ClientViewProviderPosts } from "../posts/ClientViewProviderPosts";
import type { AuthSession } from "@supabase/supabase-js";
import { ui } from "../../i18n/ui";
import type { uiObject } from "../../i18n/uiType";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";
import { ViewProviderPosts } from "@components/posts/ViewProviderPosts";

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
  // minor_municipality: string;
  // governing_district: string;
  user_id: string;
  image_url: string | null;
  email: string;
  created_at: string;
  first_name: string;
  last_name: string;
  language_spoken: string[];
  languages: string;
}

interface Props {
  id: string | undefined;
}

export const ClientProviderView: Component<Props> = (props) => {
    const [provider, setProvider] = createSignal<Provider>();
    const [providerImage, setProviderImage] = createSignal<string>();
    const [languageSpoken, setLanguageSpoken] = createSignal<string[]>([]);
    const [largeScreen, setLargeScreen] = createSignal<boolean>(false);

    onMount(() => {
      if(props.id !== null && props.id !== undefined) {
        fetchProvider(+props.id)
        
        console.log("test on Mount" + provider()?.email)
      }
    });
  
    createEffect(() => {
      if (props.id === undefined) {
        location.href = `/${lang}/404`;
      } else if (props?.id) {
        fetchProvider(+props?.id);
      }
    });

    // createEffect(() => {
    //   if(window.screen.width >= 768) {
    //     setLargeScreen(true);
    //   } else if(window.screen.width < 768) {
    //     setLargeScreen(false);
    //   }
    // })

    window.onresize = function() {
      if(window.screen.width >= 768) {
        setLargeScreen(true);
      } else if(window.screen.width < 768) {
        setLargeScreen(false);
      }
    }
  
    const fetchProvider = async (id: number) => {
  
        try {
          const { data, error } = await supabase
            .from("sellerview")
            .select("*")
            .eq("seller_id", id);
  
          if (error) {
            console.log(error);
          } else if (data[0] === undefined) {
            alert(t("messages.noProvider"));
            location.href = `/${lang}/services`;
          } else {
            let languageArray = data[0].language_spoken;
            console.log("Languages Array: " + languageArray);
            languageArray?.map((language: number) => {
              if (language == 1) {
                setLanguageSpoken([...languageSpoken(), "English"]);
              }
  
              if (language == 2) {
                setLanguageSpoken([...languageSpoken(), "Español"]);
              }
  
              if (language == 3) {
                setLanguageSpoken([...languageSpoken(), "Français"]);
              }
  
              if (language == 4) {
                setLanguageSpoken([...languageSpoken(), "Chinese"]);
              }
  
              if (language == 5) {
                setLanguageSpoken([...languageSpoken(), "German"]);
              }
  
              if (language == 6) {
                setLanguageSpoken([...languageSpoken(), "French"]);
              }
            });
  
            //set display list of languages for provider
            data[0].languages = languageSpoken().join(", ");

            setProvider(data[0]);
            console.log("test")
          }
        } catch (error) {
          console.log(error);
        }
    };
  
    createEffect(async () => {
      console.log("downloading images");
      if (provider() !== undefined) {
        if (
          provider()?.image_url === undefined ||
          provider()?.image_url === null
        ) {
          console.log("No Image");
          console.log(providerImage());
        } else {
          await downloadImage(provider()?.image_url!);
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
        setProviderImage(url);
      } catch (error) {
        console.log(error);
      }
    };

    function providerViewTabClick(e: Event) {
        e.preventDefault();

        let currLinkId = (e!.currentTarget as HTMLAnchorElement)!.id;
        let currEl = document.getElementById(currLinkId);
        let allClientViewLinks = document.getElementsByClassName("clientViewtabLinkLg");

        let clientViewProfile = document.getElementById("clientProviderViewProfile");
        let clientViewResources = document.getElementById("clientProviderViewResources");
        let clientViewRatings = document.getElementById("clientProviderViewRatings");
        let clientViewQuestions = document.getElementById("clientProviderViewQuestions");
        let clientViewDownload = document.getElementById("clientProviderViewDownload");
        
        if(!currEl?.classList.contains("border-b-2")) {
            Array.from(allClientViewLinks).forEach(function(link) {
                link.classList.remove("border-b-2");
                link.classList.remove("border-green-500");
            })
            
            currEl?.classList.add("border-b-2");
            currEl?.classList.add("border-green-500");
        };

        if(currLinkId === "clientProviderViewProfileLink") {
            clientViewProfile?.classList.remove("hidden");
            clientViewProfile?.classList.add("inline");

            closeResources();
            closeRatings();
            closeQuestions();
            closeDownloads();
        } else if(currLinkId === "clientProviderViewResourcesLink") {
            clientViewResources?.classList.remove("hidden");
            clientViewResources?.classList.add("inline");

            closeProfile();
            closeRatings();
            closeQuestions();
            closeDownloads();
        } else if(currLinkId === "clientProviderViewRatingsLink") {
            clientViewRatings?.classList.remove("hidden");
            clientViewRatings?.classList.add("inline");

            closeProfile();
            closeResources();
            closeQuestions();
            closeDownloads();
        } else if(currLinkId === "clientProviderViewQuestionsLink") {
            clientViewQuestions?.classList.remove("hidden");
            clientViewQuestions?.classList.add("inline");

            closeProfile();
            closeResources();
            closeRatings();
            closeDownloads();
        } else if(currLinkId === "clientProviderViewDownloadLink") {
            clientViewDownload?.classList.remove("hidden");
            clientViewDownload?.classList.add("inline");
            
            closeProfile();
            closeResources();
            closeRatings();
            closeQuestions();
        }
        
    }

    function closeProfile() {
        let profile = document.getElementById("clientProviderViewProfile");

        if(profile?.classList.contains("inline")) {
            profile.classList.remove("inline");
            profile.classList.add("hidden");
        }
    };

    function closeResources() {
        let resources = document.getElementById("clientProviderViewResources");

        if(resources?.classList.contains("inline")) {
            resources.classList.remove("inline");
            resources.classList.add("hidden");
        }
    };

    function closeRatings() {
        let ratings = document.getElementById("clientProviderViewRatings");

        if(ratings?.classList.contains("inline")) {
            ratings.classList.remove("inline");
            ratings.classList.add("hidden");
        }
    };

    function closeQuestions() {
        let questions = document.getElementById("clientProviderViewQuestions");

        if(questions?.classList.contains("inline")) {
            questions.classList.remove("inline");
            questions.classList.add("hidden");
        }
    };

    function closeDownloads() {
        let downloads = document.getElementById("clientProviderViewDownload");

        if(downloads?.classList.contains("inline")) {
            downloads.classList.remove("inline");
            downloads.classList.add("hidden");
        }
    };

    return (
        <div id="client-provider-view-lg" class="">
            <div id="client-provider-view-header" class="h-36 w-full bg-background2 dark:bg-background2-DM relative">
                <Show when={ providerImage() }>
                  <div class="relative">
                    <img 
                        src={ providerImage() }
                        alt={ `${t("postLabels.ProviderProfileImage")} 1` }
                        class="rounded-full h-40 w-40 border-2 border-gray-400 absolute top-12"
                    />
                  </div>
                </Show>

                <Show when={ !providerImage() }>
                  <div class="flex justify-center items-center border-2 border-gray-400 bg-background2 dark:bg-background2-DM rounded-full h-36 w-36 absolute top-6 left-12">
                    <svg width="120px" height="120px" viewBox="0 0 48 48" version="1.1" class="fill-icon2 dark:fill-icon2-DM">
                        <g id="🔍-System-Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" class="fill-icon2 dark:fill-icon2-DM">
                            <g fill="none" fill-rule="nonzero" class="fill-icon2 dark:fill-icon2-DM">
                                <path d="M35.7502,28 C38.0276853,28 39.8876578,29.7909151 39.9950978,32.0427546 L40,32.2487 L40,33 C40,36.7555 38.0583,39.5669 35.0798,41.3802 C32.1509,43.1633 28.2139,44 24,44 C19.7861,44 15.8491,43.1633 12.9202,41.3802 C10.0319285,39.6218485 8.11862909,36.9249713 8.00532378,33.3388068 L8,33 L8,32.2489 C8,29.9703471 9.79294995,28.1122272 12.0440313,28.0048972 L12.2499,28 L35.7502,28 Z M24,4 C29.5228,4 34,8.47715 34,14 C34,19.5228 29.5228,24 24,24 C18.4772,24 14,19.5228 14,14 C14,8.47715 18.4772,4 24,4 Z" id="🎨-Color"></path>
                            </g>
                        </g>
                    </svg>
                  </div>
                </Show>
                
            </div>

            <div id="client-provider-view-username-reviews-follow" class="mt-10 mx-4">
                <h2 class="text-2xl font-bold">
                    {provider()?.seller_name == ""
                    ? provider()?.first_name + " " + provider()?.last_name
                    : provider()?.seller_name}
                </h2>

                <div id="client-provider-view-reviews-div" class="flex items-center">
                    <div id="client-provider-view-ratings-stars-div" class="flex w-fit mr-2">
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

                    <div id="client-provider-view-ratings-text-div" class="flex">
                        <p class="font-bold">4.9</p>
                        <p class="font-light">&nbsp (21.K)</p>
                    </div>

                    <div id="client-provider-view-follow-div" class="flex items-center mx-4">
                        <button 
                            class="flex items-center justify-center bg-btn1 dark:bg-btn1-DM rounded-full px-4 my-2 text-ptext2 dark:ptext-DM"
                            onClick={() => (alert(t("messages.comingSoon")))}
                        >
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
                            {/* TODO: language file updated in mobile version */}
                            <p class="mx-0.5 text-sm">{t("buttons.following")}</p>
                        </button>
                    </div>
                </div>

                <div class="flex justify-center items-center my-4">
                  <button class="md:hidden btn-primary">
                    {t("menus.freeDownload")}
                  </button>
                </div>
            </div>

            <div id="client-provider-view-tabs-content-div" class="mt-2 mx-4">
                <div id="client-provider-view-tabs" class="mt-8 md:mt-0 flex mb-4"> 
                    <a href="#profileClientView" id="clientProviderViewProfileLink" class="clientViewtabLinkLg border-b-2 border-green-500 mr-4 md:mr-6 lg:mr-10 inline" onClick={ providerViewTabClick }><p class=" lg:text-xl font-bold">{t("menus.profile")}</p></a>
                    <a href="#resourcesClientView" id="clientProviderViewResourcesLink" class="clientViewtabLinkLg mr-4 md:mr-6 lg:mr-10" onClick={ providerViewTabClick }><p class="lg:text-xl font-bold">{t("menus.providerResources")}</p></a>
                    <a href="#ratingsClientView" id="clientProviderViewRatingsLink" class="clientViewtabLinkLg mr-4 md:mr-6 lg:mr-10" onClick={ providerViewTabClick }><p class="lg:text-xl font-bold">{t("menus.reviews")}</p></a>
                    <a href="#questionsClientView" id="clientProviderViewQuestionsLink" class="clientViewtabLinkLg mr-4 md:mr-6 lg:mr-10" onClick={ providerViewTabClick }><p class="lg:text-xl font-bold">{t("menus.questions")}</p></a>
                    <a href="#downloadClientView" id="clientProviderViewDownloadLink" class="clientViewtabLinkLg mr-4 md:mr-6 lg:mr-10" onClick={ providerViewTabClick }><p class="hidden md:inline text-sm md:text-base lg:text-xl font-bold">{t("menus.freeDownload")}</p></a>

                    
                </div>

                <div id="clientProviderViewProfile" class="inline">
                  <Show when={ provider()?.email }>
                    <div class="flex">
                        <p class="font-bold">{t("formLabels.email")}:&nbsp;</p>
                        <a href={`mailto:${ provider()?.email }`}><p>{ provider()?.email }</p></a>
                    </div>
                  </Show>

                  <Show when={ provider()?.email == undefined }>
                    <div class="flex">
                        <p class="font-bold">{t("formLabels.email")}:&nbsp;</p>
                        <p class="italic">{ t("messages.emailNotProvided") }</p>
                    </div>
                  </Show>
                  
                </div>

                <div id="clientProviderViewResources" class="hidden">
                  <ClientViewProviderPosts id={ props.id } />
                </div>

                <div id="clientProviderViewRatings" class="hidden">
                    <p class="italic">{t("messages.comingSoon")}</p>
                </div>

                <div id="clientProviderViewQuestions" class="hidden">
                  <p class="italic">{t("messages.comingSoon")}</p>
                </div>

                <div id="clientProviderViewDownload" class="hidden">
                  <p class="italic">{t("messages.comingSoon")}</p>
                </div>
            </div>

        </div>
    )
}