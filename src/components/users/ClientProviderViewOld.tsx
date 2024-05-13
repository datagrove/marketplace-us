import type { Component } from "solid-js";
import { createSignal, createEffect, Show } from "solid-js";
import supabase from "../../lib/supabaseClient";
import { ClientViewProviderPosts } from "../posts/ClientViewProviderPosts";
import type { AuthSession } from "@supabase/supabase-js";
import { ui } from "../../i18n/ui";
import type { uiObject } from "../../i18n/uiType";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";

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

  createEffect(() => {
    if (props.id === undefined) {
      location.href = `/${lang}/404`;
    } else if (props.id) {
      fetchProvider(+props.id);
    }
  });

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

  return (
    <div class="border-2 border-red-300 m-2 md:grid md:grid-cols-5 md:gap-2">
      {/* Left column for md+ View */}
      <div class="justify-center rounded-md border md:col-span-2 md:px-4 md:pb-4 md:mt-4 border-border1 break-after-column md:drop-shadow-lg md:h-fit dark:border-border1-DM">
        {/* Container for Mobile View */}
        <div class="container">
          {/* Provider Info for Mobile View*/}
          <details class="rounded shadow md:hidden bg-background1 group dark:bg-background1-DM">
            <summary class="flex relative flex-wrap items-center list-none rounded cursor-pointer group-open:rounded-b-none group-open:z-[1]">
              <h2 class="flex flex-1 p-4 font-bold">
                {t("formLabels.providerInfo")}
              </h2>
              {/*Creates the Dropdown Arrow*/}
              <div class="flex justify-center items-center w-10">
                <div class="ml-2 border-8 border-transparent transition-transform border-l-border1 group-open:rotate-90 dark:border-l-border1-DM"></div>
              </div>
            </summary>
            <div class="p-4">
              <h2 class="pb-4 text-xl font-bold text-ptext1 dark:text-ptext1-DM">
                {provider()?.seller_name == ""
                  ? provider()?.first_name + " " + provider()?.last_name
                  : provider()?.seller_name}
              </h2>
              <div class="flex justify-center mb-3">
                <Show when={typeof providerImage() !== "undefined"}>
                  <div class="object-contain overflow-hidden relative justify-center w-48 h-48 rounded-full border md:w-48 md:h-48 lg:w-64 lg:h-64 border-border1 dark:border-border1-DM">
                    <img
                      src={providerImage()}
                      class="block object-contain absolute top-1/2 left-1/2 justify-center h-56 -translate-x-1/2 -translate-y-1/2 md:h-96"
                      alt={`${t("postLabels.ProviderProfileImage")} 1`}
                    />
                  </div>
                </Show>
              </div>
              <p class="my-1">
                <span class="font-bold">{t("postLabels.location")}</span>
                {provider()?.major_municipality}/
                {/*provider()?.minor_municipality*/}/
                {/*provider()?.governing_district*/}
              </p>
              <p class="my-1">
                <span class="font-bold">
                  {t("formLabels.languagesSpoken")}:
                </span>
                {provider()?.languages}
              </p>
              <div class="flex justify-center mt-4">
                <a href={`mailto:${provider()?.email}`} class="btn-primary">
                  {t("buttons.contact")}
                </a>
              </div>
              <div class="flex justify-center mt-4">
                <a href={`tel:${provider()?.seller_phone}`} class="btn-primary">
                  {t("buttons.phone")}
                </a>
              </div>
            </div>
          </details>

          {/* Provider Posts for Mobile View*/}
          <details class="rounded shadow md:hidden bg-background1 group dark:bg-background1-DM">
            <summary class="flex relative flex-wrap items-center list-none rounded cursor-pointer group-open:rounded-b-none group-open:z-[1]">
              <h2 class="flex flex-1 p-4 font-bold text-ptext1 dark:text-ptext1-DM">
                {t("formLabels.posts")}
              </h2>
              {/*Creates the Dropdown Arrow*/}
              <div class="flex justify-center items-center w-10">
                <div class="ml-2 border-8 border-transparent transition-transform border-l-border1 group-open:rotate-90 dark:border-l-border1-DM"></div>
              </div>
            </summary>
            <div class="p-4">
              <div class="my-6">
                <ClientViewProviderPosts id={props.id} />
              </div>
            </div>
          </details>
        </div>

        {/* Profile Information for md+ View */}
        <div class="hidden md:block">
          <h2 class="py-4 text-xl font-bold text-ptext1 dark:text-ptext1-DM">
            {provider()?.seller_name == ""
              ? provider()?.first_name + " " + provider()?.last_name
              : provider()?.seller_name}
          </h2>
          <div class="flex justify-center mb-3">
            <Show when={typeof providerImage() !== "undefined"}>
              <div class="object-contain overflow-hidden relative justify-center w-48 h-48 rounded-full border md:w-48 md:h-48 lg:w-64 lg:h-64 border-border1 dark:border-border1-DM">
                <img
                  src={providerImage()}
                  class="block object-contain absolute top-1/2 left-1/2 justify-center h-56 -translate-x-1/2 -translate-y-1/2 md:h-96"
                  alt={`${t("postLabels.ProviderProfileImage")} 1`}
                />
              </div>
            </Show>
          </div>
          <p class="my-1">
            <span class="font-bold">{t("postLabels.location")}</span>
            {provider()?.major_municipality}
            {/* {provider()?.major_municipality}/{provider()?.minor_municipality}/
            {provider()?.governing_district} */}
          </p>
          <p class="my-1">
            <span class="font-bold">{t("formLabels.languagesSpoken")}: </span>
            {provider()?.languages}
          </p>
          <div class="flex justify-center mt-4">
            <a href={`mailto:${provider()?.email}`} class="btn-primary">
              {t("buttons.contact")}
            </a>
          </div>
          <div class="flex justify-center mt-4">
            <a href={`tel:${provider()?.seller_phone}`} class="btn-primary">
              {t("buttons.phone")}
            </a>
          </div>
        </div>
      </div>

      {/* Right column Post View for md+ View */}
      <div class="md:col-span-3">
        <div class="my-4"></div>
        <div class="hidden md:block">
          <ClientViewProviderPosts id={props.id} />
        </div>
      </div>
    </div>
  );
};
