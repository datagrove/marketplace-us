import {
  Component,
  Suspense,
  createEffect,
  createResource,
  createSignal,
} from "solid-js";
import { supabase } from "../../lib/supabaseClient";
import type { AuthSession } from "@supabase/supabase-js";
import PostImage from "./PostImage";
import { ui } from '../../i18n/ui'
import type { uiObject } from '../../i18n/uiType';
import { getLangFromUrl, useTranslations } from "../../i18n/utils";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);
const values = ui[lang] as uiObject

//get the categories from the language files so they translate with changes in the language picker
const productCategoryData = values.productCategoryInfo

async function postFormData(formData: FormData) {
  const response = await fetch("/api/providerCreatePost", {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  if (data.redirect) {
    alert(data.message); //TODO: Not sure how to internationalize these 
    window.location.href = `/${lang}` + data.redirect;
  }
  return data;
}

export const CreateNewPost: Component = () => {
  const [session, setSession] = createSignal<AuthSession | null>(null);
  const [formData, setFormData] = createSignal<FormData>();
  const [response] = createResource(formData, postFormData);
  const [imageUrl, setImageUrl] = createSignal<Array<string>>([]);

  createEffect(async () => {
    const { data, error } = await supabase.auth.getSession();
    setSession(data.session);

    if (session()) {
      //Check if they are a provider
      try {
        const { data: providers, error: errorProviders } = await supabase
          .from("providers")
          .select("*")
          .eq("user_id", session()!.user.id);
        if (errorProviders) {
          console.log("supabase error: " + errorProviders.message);
        } else {
          if (providers.length === 0) {
            alert(t("messages.onlyProvider"));
            window.location.href = `/${lang}/provider/createaccount`;
          } else {
          }
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

      //Major Municipality
      try {
        const { data: majorMunicipality, error: errorMajorMunicipality } =
          await supabase.from("major_municipality").select("*");
        if (errorMajorMunicipality) {
          console.log("supabase error: " + errorMajorMunicipality.message);
        } else {
          document.getElementById("country")?.addEventListener("change", () => {
            let municipalitySelect = document.getElementById(
              "MajorMunicipality"
            ) as HTMLSelectElement;

            let length = municipalitySelect?.length;

            for (let i = length - 1; i > -1; i--) {
              if (municipalitySelect.options[i].value !== "-1") {
                municipalitySelect.remove(i);
              }
            }
            let filteredMunicipality = majorMunicipality.filter(
              (municipality) =>
                municipality.country ==
                (document.getElementById("country") as HTMLSelectElement)?.value
            );
            filteredMunicipality.forEach((municipality) => {
              let municipalityOption = new Option(
                municipality.major_municipality,
                municipality.id
              );
              document
                .getElementById("MajorMunicipality")
                ?.append(municipalityOption);
            });
          });
        }
      } catch (error) {
        console.log("Other error: " + error);
      }

      //Minor Municipality
      try {
        const { data: minorMunicipality, error: errorMinorMunicipality } =
          await supabase.from("minor_municipality").select("*");
        if (errorMinorMunicipality) {
          console.log("supabase error: " + errorMinorMunicipality.message);
        } else {
          document
            .getElementById("MajorMunicipality")
            ?.addEventListener("change", () => {
              let municipalitySelect = document.getElementById(
                "MinorMunicipality"
              ) as HTMLSelectElement;

              let length = municipalitySelect?.length;

              for (let i = length - 1; i > -1; i--) {
                if (municipalitySelect.options[i].value !== "-1") {
                  municipalitySelect.remove(i);
                }
              }

              let filteredMunicipality = minorMunicipality.filter(
                (municipality) =>
                  municipality.major_municipality ==
                  (
                    document.getElementById(
                      "MajorMunicipality"
                    ) as HTMLSelectElement
                  )?.value
              );
              filteredMunicipality.forEach((municipality) => {
                let municipalityOption = new Option(
                  municipality.minor_municipality,
                  municipality.id
                );
                document
                  .getElementById("MinorMunicipality")
                  ?.append(municipalityOption);
              });
            });
        }
      } catch (error) {
        console.log("Other error: " + error);
      }

      //Governing District
      try {
        const { data: governingDistrict, error: errorGoverningDistrict } =
          await supabase.from("governing_district").select("*");
        if (errorGoverningDistrict) {
          console.log("supabase error: " + errorGoverningDistrict.message);
        } else {
          document
            .getElementById("MinorMunicipality")
            ?.addEventListener("change", () => {
              let districtSelect = document.getElementById(
                "GoverningDistrict"
              ) as HTMLSelectElement;

              let length = districtSelect?.length;

              for (let i = length - 1; i > -1; i--) {
                if (districtSelect.options[i].value !== "-1") {
                  districtSelect.remove(i);
                }
              }

              let filteredDistrict = governingDistrict.filter(
                (district) =>
                  district.minor_municipality ==
                  (
                    document.getElementById(
                      "MinorMunicipality"
                    ) as HTMLSelectElement
                  )?.value
              );
              filteredDistrict.forEach((district) => {
                let districtOption = new Option(
                  district.governing_district,
                  district.id
                );
                document
                  .getElementById("GoverningDistrict")
                  ?.append(districtOption);
              });
            });
        }
      } catch (error) {
        console.log("Other error: " + error);
      }
    } else {
      alert(t("messages.signInAsProvider"));
      location.href = `/${lang}/login`;
    }
  });

  function submit(e: SubmitEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    formData.append("access_token", session()?.access_token!);
    formData.append("refresh_token", session()?.refresh_token!);
    if (imageUrl() !== null) {
      formData.append("image_url", imageUrl()!.toString());
    }
    setFormData(formData);
  }

  return (
    <div>
      <form onSubmit={submit}>
        <label for="Title" class="text-text1 dark:text-text1-DM">
          {t("formLabels.title")}:
          <input
            type="text"
            id="Title"
            name="Title"
            class="rounded w-full mb-4 px-1 focus:border-border1 dark:focus:border-border1-DM border-2 focus:outline-none text-text1 dark:text-text1-DM"
            required
          />
        </label>


        <label for="ServiceCategory" class="text-text1 dark:text-text1-DM">
          {t("formLabels.serviceCategory")}:
          <select
            id="ServiceCategory"
            name="ServiceCategory"
            class="ml-2 rounded mb-4 dark:text-black focus:border-border1 dark:focus:border-border1-DM border-2 focus:outline-none"
            required>
            <option value="-1">-</option>
            {productCategoryData.categories.map((category) => (
              <option value={category.id}>{category.name}</option>
            ))}
          </select>
        </label>

        <br />


        <label for="Content" class="text-text1 dark:text-text1-DM">
          {t("formLabels.postContent")}:
          <textarea
            id="Content"
            name="Content"
            class="rounded w-full mb-4 px-1 focus:border-border1 dark:focus:border-border1-DM border-2 focus:outline-none text-text1  dark:text-text1-DM"
            placeholder={t('formLabels.enterPostContent')}
            rows="10"
            required>
          </textarea>
        </label>


        <div class="mb-6">
          <label for="country" class="text-text1 dark:text-text1-DM">
            {t("formLabels.country")}:
            <select
              id="country"
              name="country"
              class="ml-2 rounded mb-4 text-text1 dark:text-text1-DM focus:border-border1 dark:focus:border-border1-DM border-2 focus:outline-none"
              required>
              <option value="-1">-</option>
            </select>
          </label>
        </div>

        <div class="mb-6">
          <label for="MajorMunicipality" class="text-text1 dark:text-text1-DM">
            {t("formLabels.majorMunicipality")}:
            <select
              id="MajorMunicipality"
              name="MajorMunicipality"
              class="ml-2 rounded mb-4 text-text1 dark:text-text1-DM focus:border-border1 dark:focus:border-border1-DM border-2 focus:outline-none"
              required>
              <option value="-1">-</option>
            </select>
          </label>
        </div>

        <div class="mb-6">
          <label for="MinorMunicipality">
            {t("formLabels.minorMunicipality")}:
            <select
              id="MinorMunicipality"
              name="MinorMunicipality"
              class="ml-2 rounded mb-4 text-text1 dark:text-text1-DM focus:border-border1 dark:focus:border-border1-DM border-2 focus:outline-none"
              required>
              <option value="-1">-</option>
            </select>
          </label>
        </div>

        <label for="GoverningDistrict">
          {t("formLabels.governingDistrict")}:
          <select
            id="GoverningDistrict"
            name="GoverningDistrict"
            class="ml-2 rounded mb-4 text-text1 dark:text-text1-DM focus:border-border1 dark:focus:border-border1-DM border-2 focus:outline-none"
            required>
            <option value="-1">-</option>
          </select>
        </label>

        <div class="mb-4 flex justify-center">
          <PostImage
            url={imageUrl()[imageUrl().length -1]}
            size={150}
            onUpload={(e: Event, url: string) => {
              setImageUrl([...imageUrl(), url]);
            }}
          />
        </div>

        <br />
        <div class="flex justify-center">
          <button class="btn-primary">
            {t('buttons.post')}
          </button>
        </div>
        <Suspense>{response() && <p>{response().message}</p>}</Suspense>
      </form>
    </div>
  );
};
