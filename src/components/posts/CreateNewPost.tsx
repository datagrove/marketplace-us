import type { Component } from "solid-js";
import {
  Suspense,
  createEffect,
  createResource,
  createSignal,
  onMount,
} from "solid-js";
import supabase from "../../lib/supabaseClient";
import type { AuthSession } from "@supabase/supabase-js";
import PostImage from "./PostImage";
import { ui } from "../../i18n/ui";
import type { uiObject } from "../../i18n/uiType";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";
import { TinyComp } from "./TinyComp";
import { createStore } from "solid-js/store";
import { CreateStripeProductPrice } from "./CreateStripeProductPrice";
import stripe from "../../lib/stripe";
import Dropdown from "@components/common/Dropdown";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);
const values = ui[lang] as uiObject;

//get the categories from the language files so they translate with changes in the language picker
const productCategoryData = values.productCategoryInfo;

const excludeTaxCodes = new Set([
  //Website/online dating products
  /^txcd_107.*/,
  //Streaming products
  /^txcd_10201003.*/,
  /^txcd_10201004.*/,
  /^txcd_10401000.*/,
  /^txcd_10401200.*/,
  /^txcd_10402000.*/,
  /^txcd_10402200.*/,
  /^txcd_10402300.*/,
  /^txcd_10804001.*/,
  /^txcd_10804002.*/,
  /^txcd_10804003.*/,
  /^txcd_10804010.*/,
  //Infrastructure as Service
  /^txcd_10010001.*/,
  /^txcd_10101000.*/,
  //Platform as a Service
  /^txcd_10102000.*/,
  /^txcd_10102001.*/,
  //Cloud Based Business Process as Service
  /^txcd_10104001.*/,
  //Video Games, non-subscription, conditional or limited rights
  /^txcd_10201001.*/,
  /^txcd_10201002.*/,
  //Digital Books limited/conditional rights
  /^txcd_10302001.*/,
  /^txcd_10302002.*/,
  /^txcd_10302003.*/,
  //Digital Magazines limited/conditional rights or subscription
  /^txcd_10303000.*/,
  /^txcd_10303001.*/,
  /^txcd_10303002.*/,
  /^txcd_10303101.*/,
  /^txcd_10303102.*/,
  /^txcd_10303104.*/,
  //Digital Newspapers limited/conditional rights or subscription
  /^txcd_10304001.*/,
  /^txcd_10304002.*/,
  /^txcd_10304003.*/,
  /^txcd_10304100.*/,
  /^txcd_10304101.*/,
  /^txcd_10304102.*/,
  //Digital School Books limited/conditional rights
  /^txcd_10305000.*/,
  //Digital Audio Works limited/conditional rights
  /^txcd_10401001.*/,
  /^txcd_10401200.*/,
  /^txcd_10402000.*/,
  /^txcd_10402110.*/,
  /^txcd_10402200.*/,
  //Digital Video Streaming
  /^txcd_10402300.*/,
  //Digital other news or documents limited/conditional rights
  /^txcd_10503001.*/,
  /^txcd_10503002.*/,
  /^txcd_10503003.*/,
  /^txcd_10503004.*/,
  /^txcd_10503005.*/,
  //Electronic software manuals
  /^txcd_10504000.*/,
  /^txcd_10504003.*/,
  //Digital Finished Artwork limited/conditional rights
  /^txcd_10505000.*/,
  /^txcd_10505002.*/,
  //Digital Audio Visual Works bundle limited/conditional rights
  /^txcd_10804001.*/,
  /^txcd_10804002.*/,
  /^txcd_10804010.*/,
  //Gift card
  /^txcd_10502.*/,
]);

async function postFormData(formData: FormData) {
  const info = formData;
  const response = await fetch("/api/providerCreatePost", {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  console.log(response.status);
  if (response.status === 200) {
    CreateStripeProductPrice({
      name: String(formData.get("Title")),
      description: formData.get("Content") as string,
      price: parseInt(formData.get("Price") as string),
      id: data.id,
      access_token: formData.get("access_token") as string,
      refresh_token: formData.get("refresh_token") as string,
      tax_code: formData.get("TaxCode") as string,
    });
  }
  // I think we are going to do this in the CreateStripeProductPrice component
  // if (data.redirect) {
  //   alert(data.message);
  //   window.location.href = `/${lang}` + data.redirect;
  // }
  return data;
}

export const CreateNewPost: Component = () => {
  const [session, setSession] = createSignal<AuthSession | null>(null);
  const [formData, setFormData] = createSignal<FormData>();
  const [response] = createResource(formData, postFormData);
  const [imageUrl, setImageUrl] = createSignal<Array<string>>([]);
  const [mode, setMode] = createStore({
    theme: localStorage.getItem("theme"),
  });
  const taxCodeOptions: HTMLOptionElement[] = [];
  const [selectedTaxCode, setSelectedTaxCode] =
    createSignal<HTMLOptionElement>();

  onMount(() => {
    window.addEventListener("storage", (event) => {
      if (event.key === "theme") {
        setMode({ theme: event.newValue });
        console.log("Theme changed: " + mode.theme);
      }
    });
  });

  // createEffect(() => {
  //   if(selectedTaxCode() !== undefined) {
  //     console.log("Tax Code: " + selectedTaxCode()!.value);
  //   }
  // });

  createEffect(async () => {
    const { data, error } = await supabase.auth.getSession();
    setSession(data.session);

    if (session()) {
      //Check if they are a provider
      try {
        const { data: providers, error: errorProviders } = await supabase
          .from("sellers")
          .select("*")
          .eq("user_id", session()!.user.id);
        if (errorProviders) {
          console.log("supabase error: " + errorProviders.message);
        } else {
          if (providers.length === 0) {
            alert(t("messages.onlyProvider"));
            window.location.href = `/${lang}/provider/createaccount`;
          } else if (providers[0].stripe_connected_account_id === null) {
            alert(t("messages.noStripeAccount"));
            window.location.href = `/${lang}/provider/profile`;
          }
        }
      } catch (error) {
        console.log("Other error: " + error);
      }

      //Tax Code
      try {
        const { data: taxCodes } = await stripe.taxCodes.list({ limit: 100 });
        if (error) {
          console.log("stripe error: " + error.message);
        } else {
          taxCodes.forEach((taxCode) => {
            if (
              //Digital Products
              /^txcd_1.*/.test(taxCode.id) &&
              //Not in our filter list
              !Array.from(excludeTaxCodes).some((excludeTaxCode) =>
                excludeTaxCode.test(taxCode.id)
              )
            ) {
              let taxCodeOption = new Option(taxCode.name, taxCode.id);
              taxCodeOption.setAttribute("data-description", taxCode.description);
              taxCodeOptions.push(taxCodeOption);
            }
          });
        }
      } catch (error) {
        console.log("Other error: " + error);
      }

      //Country
      try {
        const { data: countries, error } = await supabase
          .from("country")
          .select("*");
        if (error) {
          console.log("supabase error: " + error.message);
        } else {
          countries.forEach((country) => {
            let countryOption = new Option(country.country, country.id);
            document.getElementById("country")?.append(countryOption);
          });
        }
      } catch (error) {
        console.log("Other error: " + error);
      }

      // //Major Municipality
      // try {
      //   const { data: majorMunicipality, error: errorMajorMunicipality } =
      //     //TODO: optimize these calls to the database for PWA caching (if we don't need the created date don't return it)
      //     await supabase.from("major_municipality").select("*");
      //   if (errorMajorMunicipality) {
      //     console.log("supabase error: " + errorMajorMunicipality.message);
      //   } else {
      //     document.getElementById("country")?.addEventListener("change", () => {
      //       let municipalitySelect = document.getElementById(
      //         "MajorMunicipality"
      //       ) as HTMLSelectElement;

      //       let length = municipalitySelect?.length;

      //       for (let i = length - 1; i > -1; i--) {
      //         if (municipalitySelect.options[i].value !== "") {
      //           municipalitySelect.remove(i);
      //         }
      //       }
      //       let filteredMunicipality = majorMunicipality.filter(
      //         (municipality) =>
      //           municipality.country ==
      //           (document.getElementById("country") as HTMLSelectElement)?.value
      //       );
      //       filteredMunicipality.forEach((municipality) => {
      //         let municipalityOption = new Option(
      //           municipality.major_municipality,
      //           municipality.id
      //         );
      //         document
      //           .getElementById("MajorMunicipality")
      //           ?.append(municipalityOption);
      //       });
      //     });
      //   }
      // } catch (error) {
      //   console.log("Other error: " + error);
      // }
    } else {
      alert(t("messages.signInAsProvider"));
      location.href = `/${lang}/login`;
    }
  });

  async function submit(e: SubmitEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    formData.append("access_token", session()?.access_token!);
    formData.append("refresh_token", session()?.refresh_token!);
    formData.append("lang", lang);
    //TODO: Collect Price from Form
    formData.append("Price", "2000");
    if (selectedTaxCode() !== undefined) {
      formData.append("TaxCode", selectedTaxCode()!.value.toString());
    }

    if (imageUrl() !== null) {
      formData.append("image_url", imageUrl()!.toString());
    }
    setFormData(formData);
  }

  createEffect(() => {
    console.log("mode: " + mode.theme);
    TinyComp({ id: "#Content", mode: mode.theme });
  });

  return (
    <div>
      <form onSubmit={submit}>
        <label for="Title" class="text-ptext1 dark:text-ptext1-DM">
          {t("formLabels.title")}:
          <input
            type="text"
            id="Title"
            name="Title"
            class="rounded w-full mb-4 px-1 focus:border-highlight1 dark:focus:border-highlight1-DM border focus:border-2 border-inputBorder1 dark:border-inputBorder1-DM focus:outline-none bg-background1 dark:bg-background2-DM text-ptext1 dark:text-ptext2-DM"
            required
          />
        </label>

        <label for="ServiceCategory" class="text-ptext1 dark:text-ptext1-DM">
          {t("formLabels.serviceCategory")}:
          <select
            id="ServiceCategory"
            name="ServiceCategory"
            class="ml-2 rounded mb-4 border border-inputBorder1 dark:border-inputBorder1-DM focus:border-highlight1 dark:focus:border-highlight1-DM focus:border-2 focus:outline-none bg-background1 dark:bg-background2-DM text-ptext1  dark:text-ptext2-DM"
            required
          >
            <option value="">-</option>
            {productCategoryData.categories.map((category) => (
              <option value={category.id}>{category.name}</option>
            ))}
          </select>
        </label>

        <br />

        <label for="Content" class="text-ptext1 dark:text-ptext1-DM">
          {t("formLabels.postContent")}:
          <textarea
            id="Content"
            name="Content"
            class="rounded w-full mb-4 px-1 border border-inputBorder1 dark:border-inputBorder1-DM focus:border-highlight1 dark:focus:border-highlight1-DM focus:border-2 focus:outline-none bg-background1 dark:bg-background2-DM text-ptext1  dark:text-ptext2-DM "
            placeholder={t("formLabels.enterPostContent")}
            rows="10"
            required
          ></textarea>
        </label>

        <div class="mb-6 mt-6">
          <label for="country" class="text-ptext1 dark:text-ptext1-DM">
            {t("formLabels.country")}:
            <select
              id="country"
              name="country"
              class="ml-2 rounded mb-4 focus:border-highlight1 dark:focus:border-highlight1-DM border border-inputBorder1 dark:border-inputBorder1-DM focus:border-2 focus:outline-none bg-background1 dark:bg-background2-DM text-ptext1 dark:text-ptext2-DM"
              required
            >
              <option value="">-</option>
            </select>
          </label>
        </div>

        <div class="mb-6 mt-6">
          <label for="taxCode" class="text-ptext1 dark:text-ptext1-DM">
            {t("formLabels.taxCode")}:
            <Dropdown
              options={taxCodeOptions}
              selectedOption={selectedTaxCode()!}
              setSelectedOption={setSelectedTaxCode}
            />
          </label>
        </div>

        {/* <div class="mb-6">
          <label
            for="MajorMunicipality"
            class="text-ptext1 dark:text-ptext1-DM"
          >
            {t("formLabels.majorMunicipality")}:
            <select
              id="MajorMunicipality"
              name="MajorMunicipality"
              class="ml-2 rounded mb-4 focus:border-highlight1 dark:focus:border-highlight1-DM border border-inputBorder1 dark:border-inputBorder1-DM focus:border-2 focus:outline-none bg-background1 dark:bg-background2-DM text-ptext1 dark:text-ptext2-DM"
              required
            >
              <option value="">-</option>
            </select>
          </label>
        </div> */}

        <div class="mb-4 flex justify-center">
          <div class="flex items-end justify-end">
            <div class="group flex items-center relative mr-2 w-4"></div>
          </div>
          <div class="">
            <PostImage
              url={imageUrl()[imageUrl().length - 1]}
              size={150}
              onUpload={(e: Event, url: string) => {
                setImageUrl([...imageUrl(), url]);
              }}
            />
          </div>
          <div class="flex items-end justify-end">
            <div class="group flex items-center relative ml-2">
              <svg
                class="peer w-4 h-4 border-2 bg-icon1 dark:bg-background1-DM fill-iconbg1 dark:fill-iconbg1-DM  border-border1 dark:border-none rounded-full"
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
                class="peer-hover:visible transition-opacity bg-background2 dark:bg-background2-DM text-sm text-ptext2 dark:text-ptext2-DM rounded-md absolute 
                md:translate-x-1/4 -translate-x-full -translate-y-2/3 md:translate-y-0 invisible m-4 mx-auto p-2 w-48"
              >
                {t("toolTips.postImages")}
              </span>
            </div>
          </div>
        </div>

        <br />
        <div class="flex justify-center">
          <button class="btn-primary">{t("buttons.post")}</button>
        </div>
        <Suspense>
          {response() && (
            <p class="mt-2 font-bold text-center text-alert1 dark:text-alert1-DM">
              {response().message}
            </p>
          )}
        </Suspense>
      </form>
    </div>
  );
};
