import {
  Component,
  Suspense,
  createEffect,
  createResource,
  createSignal,
} from "solid-js";
import { supabase } from "../../lib/supabaseClient";
import type { AuthSession } from "@supabase/supabase-js";
import { ui } from '../../i18n/ui'
import type { uiObject } from '../../i18n/uiType';
import { getLangFromUrl, useTranslations } from "../../i18n/utils";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);
const values = ui[lang] as uiObject
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

      // //Post Category
      // try {
      //   const { data: postCategory, error: errorPostCategory } = await supabase
      //     .from("post_category")
      //     .select("*");
      //   if (errorPostCategory) {
      //     console.log("supabase error: " + errorPostCategory.message);
      //   } else {
      //     postCategory.forEach((category) => {
      //       let categoryOption = new Option(category.category, category.id);
      //       document.getElementById("ServiceCategory")?.append(categoryOption);
      //     });
      //   }
      // } catch (error) {
      //   console.log("Other error: " + error);
      // }

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
    setFormData(formData);
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div class="mb-6">
          <label for="Title">
            {t("formLabels.title")}:
            <input type="text" id="Title" name="Title" required />
          </label>
        </div>

        <div class="mb-6">
          <label for="ServiceCategory">
            {t("formLabels.serviceCategory")}:
            <select id="ServiceCategory" name="ServiceCategory" required>
              <option value="-1">-</option>
              {productCategoryData.categories.map((category) => (
                <option value={category.id}>{category.name}</option>
              ))}
            </select>
          </label>
        </div>

        <div class="mb-6">
          <label for="Content">
            {t("formLabels.postContent")}:
            <textarea id="Content" name="Content" rows="5" required>
              Enter Post Content Here:
            </textarea>
          </label>
        </div>

        <div class="mb-6">
          <label for="country">
            {t("formLabels.country")}:
            <select id="country" name="country" required>
              <option value="-1">-</option>
            </select>
          </label>
        </div>

        <div class="mb-6">
          <label for="MajorMunicipality">
            {t("formLabels.majorMunicipality")}:
            <select id="MajorMunicipality" name="MajorMunicipality" required>
              <option value="-1">-</option>
            </select>
          </label>
        </div>

        <div class="mb-6">
          <label for="MinorMunicipality">
            {t("formLabels.minorMunicipality")}:
            <select id="MinorMunicipality" name="MinorMunicipality" required>
              <option value="-1">-</option>
            </select>
          </label>
        </div>

        <label for="GoverningDistrict">
          {t("formLabels.governingDistrict")}:
          <select id="GoverningDistrict" name="GoverningDistrict" required>
            <option value="-1">-</option>
          </select>
        </label>

        <button class="btn-primary">Post</button>
        <Suspense>{response() && <p>{response().message}</p>}</Suspense>
      </form>
    </div>
  );
};
