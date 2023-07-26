import {
  Component,
  Suspense,
  createEffect,
  createResource,
  createSignal,
} from "solid-js";
import { supabase } from "../../lib/supabaseClient";
import type { AuthSession } from "@supabase/supabase-js";
import UserImage from "./UserImage";

async function postFormData(formData: FormData) {
  const response = await fetch("/api/clientProfileSubmit", {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  if (data.redirect) {
    alert(data.message);
    window.location.href = data.redirect;
  }
  return data;
}

export const ClientRegistration: Component = () => {
  const [session, setSession] = createSignal<AuthSession | null>(null);
  const [formData, setFormData] = createSignal<FormData>();
  const [response] = createResource(formData, postFormData);
  const [imageUrl, setImageUrl] = createSignal<string | null>(null);

  createEffect(async () => {
    const { data, error } = await supabase.auth.getSession();
    console.log(data);
    setSession(data.session);

    if (session()) {
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
      alert("Please sign in to create a provider profile.");
      location.href = "/login";
    }
  });

  function submit(e: SubmitEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    formData.append("access_token", session()?.access_token!);
    formData.append("refresh_token", session()?.refresh_token!);
    setFormData(formData);
    console.log(formData);
  }

  return (
    <div class="">
      <form onSubmit={submit} class="">
        <label for="DisplayName" class="text-text1 dark:text-text1-DM">
          Display Name:
          <input 
            type="text" 
            id="DisplayName" 
            class="rounded w-full mb-4 px-1 focus:border-btn1 dark:focus:border-btn1-DM border-2 focus:outline-none"
            name="DisplayName" 
            required 
          />
        </label>

        <br />

        <label for="Phone" class="text-text1 dark:text-text1-DM">
          Phone Number:
          <br />
          <input 
            type="text" 
            id="Phone" 
            class="rounded w-full mb-4 focus:border-btn1 dark:focus:border-btn1-DM border-2 focus:outline-none"
            name="Phone" 
            required 
          />
        </label>

        <br />

        <label for="country" class="text-text1 dark:text-text1-DM">
          Country:
          <select 
            id="country" 
            class="ml-2 rounded mb-4 dark:text-black focus:border-btn1 dark:focus:border-btn1-DM border-2 focus:outline-none"
            name="country" 
            required
          >
            <option value="-1">-</option>
          </select>
        </label>

        <br />

        <label for="MajorMunicipality" class="text-text1 dark:text-text1-DM">
          Major Municipality:
          <select 
            id="MajorMunicipality" 
            class="ml-2 rounded mb-4 dark:text-black focus:border-btn1 dark:focus:border-btn1-DM border-2 focus:outline-none"
            name="MajorMunicipality" 
            required
          >
            <option value="-1">-</option>
          </select>
        </label>

        <br />

        <label for="MinorMunicipality" class="text-text1 dark:text-text1-DM">
          Minor Municipality:
          <select 
            id="MinorMunicipality" 
            class="ml-2 rounded mb-4 dark:text-black focus:border-btn1 dark:focus:border-btn1-DM border-2 focus:outline-none"
            name="MinorMunicipality" 
            required
          >
            <option value="-1">-</option>
          </select>
        </label>

        <br />

        <label for="GoverningDistrict" class="text-text1 dark:text-text1-DM">
          Governing District:
          <select 
            id="GoverningDistrict" 
            class="ml-2 rounded mb-4 dark:text-black focus:border-btn1 dark:focus:border-btn1-DM border-2 focus:outline-none"
            name="GoverningDistrict" 
            required
          >
            <option value="-1">-</option>
          </select>
        </label>

        <UserImage
          url={imageUrl()}
          size={150}
          onUpload={(e: Event, url: string) => {
            setImageUrl(url);
          }}
        />

        <button class="my-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Register
        </button>
        <Suspense>{response() && <p>{response().message}</p>}</Suspense>
      </form>
    </div>
  );
};
