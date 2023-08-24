import {
  Component,
  createSignal,
  createEffect,
  Show,
  Suspense,
  onMount,
  onCleanup,
  createResource,
} from "solid-js";
import { supabase } from "../../lib/supabaseClient";
import { ViewProviderPosts } from "../../components/posts/ViewProviderPosts";
import { EditProfileButton } from "../../components/users/EditProfileButton";
import type { AuthSession } from "@supabase/supabase-js";
import UserImage from "./UserImage";
import { ui } from "../../i18n/ui";
import type { uiObject } from "../../i18n/uiType";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";
import { image } from "astro:content";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

//get the categories from the language files so they translate with changes in the language picker
const values = ui[lang] as uiObject;
const productCategories = values.productCategoryInfo.categories;

interface Provider {
  provider_name: string;
  provider_id: number;
  provider_phone: string;
  major_municipality: string;
  minor_municipality: string;
  governing_district: string;
  user_id: string;
  image_url: string | null;
  email: string;
  created_at: string;
  first_name: string;
  last_name: string;
  country: string | null;
}

//TODO: Deal with possibly blank locations
async function postFormData(formData: FormData) {
  const response = await fetch("/api/providerProfileEdit", {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  //Checks the API response for the redirect and sends them to the redirect page if there is one
  if (data.redirect) {
    //TODO: Not sure how to deal with internationalization here
    alert(data.message);
    window.location.href = `/${lang}` + data.redirect;
  }
  return data;
}

const { data: User, error: UserError } = await supabase.auth.getSession();

export const ProviderProfileView: Component = () => {
  const [provider, setProvider] = createSignal<Provider>();
  const [session, setSession] = createSignal<AuthSession | null>(null);
  const [providerImage, setProviderImage] = createSignal<string>("");
  const [editMode, setEditMode] = createSignal<boolean>(true); //TODO Set back to false
  const [imageUrl, setImageUrl] = createSignal<string | null>(null);
  const [screenSize, setScreenSize] = createSignal<
    "sm" | "md" | "lg" | "xl" | "2xl"
  >();
  const [formData, setFormData] = createSignal<FormData>();
  const [response] = createResource(formData, postFormData);

  const setSize = (e: Event) => {
    if (window.innerWidth <= 640) {
      setScreenSize("sm");
    } else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
      setScreenSize("md");
    } else if (window.innerWidth >= 1024 && window.innerWidth < 1280) {
      setScreenSize("lg");
    } else if (window.innerWidth >= 1280 && window.innerWidth < 1536) {
      setScreenSize("xl");
    } else {
      setScreenSize("2xl");
    }
  };

  onMount(() => {
    window.addEventListener("resize", setSize);
    if (window.innerWidth <= 640) {
      setScreenSize("sm");
    } else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
      setScreenSize("md");
    } else if (window.innerWidth >= 1024 && window.innerWidth < 1280) {
      setScreenSize("lg");
    } else if (window.innerWidth >= 1280 && window.innerWidth < 1536) {
      setScreenSize("xl");
    } else {
      setScreenSize("2xl");
    }
  });

  onCleanup(() => {
    window.removeEventListener("resize", setSize);
  });

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
          .from("providerview")
          .select("*")
          .eq("user_id", user_id);

        if (error) {
          console.log(error);
        } else if (data[0] === undefined) {
          alert(t("messages.noProvider"));
          location.href = `/${lang}/services`;
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

  createEffect(async () => {
    if (provider() !== undefined) {
      if (
        provider()?.image_url === undefined ||
        provider()?.image_url === null
      ) {
        // console.log("No Image")
        // console.log(providerImage())
      } else {
        await downloadImage(provider()?.image_url!);
        setImageUrl(provider()?.image_url!);
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

  const enableEditMode = () => {
    setEditMode(true);
  };

  createEffect(async () => {
    if (editMode() === true) {
      //Will create a dropdown of all the countries in the database (Currently only Costa Rica)
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

      //Will create a list of Major Municipalities based on the selected country
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
              if (municipalitySelect.options[i].value !== "") {
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

      //Creates drop down options for Minor Municipality based on selected Major Municipality
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
                if (municipalitySelect.options[i].value !== "") {
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

      //Creates filtered drop down options for Governing District base on selected Minor Municipality
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
                if (districtSelect.options[i].value !== "") {
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

      //If the user is not signed in then tell them to sign in and send them to the login page
    }
  });

  const required = (e: Event) => {
    e.preventDefault();

    const country = document.getElementById("country") as HTMLSelectElement;
    const majorMunicipality = document.getElementById(
      "MajorMunicipality"
    ) as HTMLSelectElement;
    const minorMunicipality = document.getElementById(
      "MinorMunicipality"
    ) as HTMLSelectElement;
    const governingDistrict = document.getElementById(
      "GoverningDistrict"
    ) as HTMLSelectElement;

    if (
      country.value !== "" ||
      majorMunicipality.value !== "" ||
      minorMunicipality.value !== "" ||
      governingDistrict.value !== ""
    ) {
      country.required = true;
      majorMunicipality.required = true;
      minorMunicipality.required = true;
      governingDistrict.required = true;
    } else if (
      country.value === "" &&
      majorMunicipality.value === "" &&
      minorMunicipality.value === "" &&
      governingDistrict.value === ""
    ) {
      country.required = false;
      majorMunicipality.required = false;
      minorMunicipality.required = false;
      governingDistrict.required = false;
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
    if (imageUrl() !== null) {
      formData.append("image_url", imageUrl()!);
    }
    setFormData(formData);
  }

  //TODO: Style improvement - when posts section is opened in mobile view, it takes up full screen width some margin might be nice not sure but this might be due to current card styling
  //TODO: Style improvement - when boxes are collapsed in mobile view they are narrower than when they are expanded might be nice to keep it the same size

  return (
    <div>
      <div class="text-2xl font-bold underline italic text-link2-DM text-center">
        <Show when={editMode() === true}>
          <h1>{t("messages.profileEdits")}</h1>
        </Show>
      </div>
      <div class="m-2 md:grid md:grid-cols-5 md:gap-2">
        {/* Left column for md+ View */}
        <div class="md:col-span-2 md:drop-shadow-lg border border-border dark:border-border-DM md:mt-4 rounded-md md:h-fit md:px-4 md:pb-4 break-after-column justify-center">
          <form onSubmit={submit} id="editProfile">
            {/* Container for Mobile View */}
            <Show when={screenSize() === "sm"}>
              <div class="container">
                {/* Profile Information for Mobile View */}
                <details
                  class="bg-background1 dark:bg-black shadow rounded group md:hidden"
                  open
                >
                  <summary class="list-none flex flex-wrap items-center cursor-pointer rounded group-open:rounded-b-none group-open:z-[1] relative">
                    <h2 class="flex flex-1 p-4 font-bold">
                      {t("formLabels.profileInfo")}
                    </h2>
                    <div class="flex w-10 items-center justify-center">
                      <div class="border-8 border-transparent border-l-gray-600 ml-2 group-open:rotate-90 transition-transform"></div>
                    </div>
                  </summary>
                  <div class="p-4">
                    <div class="mb-2 flex justify-center items-center align-items-center">
                      <Show when={editMode() === false}>
                        <button class="btn-primary" onclick={enableEditMode}>
                          {t("buttons.editProfile")}
                        </button>
                      </Show>
                    </div>
                    <h2 class="text-xl text-text1 dark:text-text1-DM pb-4 font-bold">
                      {provider()?.provider_name == ""
                        ? provider()?.first_name + " " + provider()?.last_name
                        : provider()?.provider_name}
                    </h2>

                    <div class="flex justify-center mb-3">
                      <Show when={editMode() === false}>
                        <Show when={typeof providerImage() !== "undefined"}>
                          <div class="relative w-48 h-48 overflow-hidden rounded-full md:h-48 md:w-48 lg:h-64 lg:w-64 object-contain justify-center border border-border dark:border-border-DM">
                            <img
                              src={providerImage()}
                              class="absolute block -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 object-contain justify-center h-56 md:h-96"
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
                    <label
                      for="FirstName"
                      class="text-text2 dark:text-text1-DM"
                    >
                      {t("formLabels.firstName")}:
                    </label>
                    <Show when={editMode() === false}>
                      <p
                        id="FirstName"
                        class="rounded w-full mb-4 px-1 focus:border-btn1 dark:focus:border-btn1-DM border-2 border-border dark:border-border-DM focus:outline-none"
                      >
                        {provider()?.first_name}
                      </p>
                    </Show>
                    <Show when={editMode() === true}>
                      <input
                        type="text"
                        id="FirstName"
                        name="FirstName"
                        class="rounded w-full mb-4 px-1 text-text1 focus:border-btn1 dark:focus:border-btn1-DM border-2 focus:outline-none"
                        value={provider()?.first_name}
                      />
                    </Show>

                    <label for="LastName" class="text-text2 dark:text-text1-DM">
                      {t("formLabels.lastName")}:
                    </label>
                    <Show when={editMode() === false}>
                      <p
                        id="LastName"
                        class="rounded w-full mb-4 px-1 focus:border-btn1 dark:focus:border-btn1-DM border-2 border-border dark:border-border-DM focus:outline-none"
                      >
                        {provider()?.last_name}
                      </p>
                    </Show>
                    <Show when={editMode() === true}>
                      <input
                        type="text"
                        id="LastName"
                        name="LastName"
                        class="rounded w-full mb-4 px-1 text-text1 focus:border-btn1 dark:focus:border-btn1-DM border-2 focus:outline-none"
                        value={provider()?.last_name}
                      />
                    </Show>

                    <label
                      for="ProviderName"
                      class="text-text1 dark:text-text1-DM"
                    >
                      {t("formLabels.providerName")}:
                    </label>
                    <Show when={editMode() === false}>
                      <p
                        id="ProviderName"
                        class="rounded w-full mb-4 px-1 focus:border-btn1 dark:focus:border-btn1-DM border-2 border-border dark:border-border-DM focus:outline-none"
                      >
                        {provider()?.provider_name
                          ? provider()?.provider_name
                          : t("formLabels.noValue")}
                      </p>
                    </Show>
                    <Show when={editMode() === true}>
                      <input
                        type="text"
                        id="ProviderName"
                        name="ProviderName"
                        class="rounded w-full mb-4 px-1 text-text1 focus:border-btn1 dark:focus:border-btn1-DM border-2 focus:outline-none"
                        value={provider()?.provider_name}
                      />
                    </Show>

                    <div class="w-full overflow-auto mb-4">
                      <label for="email" class="text-text1 dark:text-text1-DM">
                        {t("formLabels.email")}:
                        {/* I would like this to have a tool tip that lets them know that they can't change the email because it is associated with their account. */}
                      </label>
                      <Show when={editMode() === false}>
                        <p
                          id="email"
                          class="rounded px-1 focus:border-btn1 dark:focus:border-btn1-DM border-2 border-border dark:border-border-DM focus:outline-none"
                        >
                          {provider()?.email}
                        </p>
                      </Show>
                      <Show when={editMode() === true}>
                        <input
                          id="email"
                          name="email"
                          class="inputField ml-2 rounded-md pl-2 w-5/6 border border-border"
                          type="email"
                          placeholder={t("formLabels.email")}
                          value={provider()?.email}
                        />
                      </Show>
                    </div>

                    <label for="Phone" class="text-text1 dark:text-text1-DM">
                      {t("formLabels.phone")}:
                    </label>
                    <Show when={editMode() === false}>
                      <p
                        id="Phone"
                        class="rounded w-full mb-4 px-1 focus:border-btn1 dark:focus:border-btn1-DM border-2 border-border dark:border-border-DM focus:outline-none"
                      >
                        {provider()?.provider_phone}
                      </p>
                    </Show>
                    <Show when={editMode() === true}>
                      <input
                        type="text"
                        id="Phone"
                        class="rounded w-full mb-4 text-text1 focus:border-btn1 dark:focus:border-btn1-DM border-2 focus:outline-none"
                        name="Phone"
                        value={provider()?.provider_phone}
                      />
                    </Show>

                    <label for="country" class="text-text1 dark:text-text1-DM">
                      {t("formLabels.country")}:
                    </label>
                    <Show when={editMode() === false}>
                      <p
                        id="country"
                        class="rounded w-full px-1 focus:border-btn1 dark:focus:border-btn1-DM border-2 border-border dark:border-border-DM focus:outline-none"
                      >
                        {provider()?.country}
                      </p>
                    </Show>
                    <Show when={editMode() === true}>
                      <select
                        id="country"
                        class="ml-2 rounded mb-4 dark:text-black focus:border-btn1 dark:focus:border-btn1-DM border-2 focus:outline-none"
                        name="country"
                        oninput={required}
                      >
                        <option value="">-</option>
                      </select>
                      <div>
                        <label class="text-text1 dark:text-text1-DM">
                          {t("formLabels.country")}
                          <p class="rounded w-full px-1 focus:border-btn1 dark:focus:border-btn1-DM border-2 border-border dark:border-border-DM focus:outline-none">
                            {provider()?.country}
                          </p>
                        </label>
                      </div>
                    </Show>

                    <br />

                    <label
                      for="MajorMunicipality"
                      class="text-text1 dark:text-text1-DM"
                    >
                      {t("formLabels.majorMunicipality")}:
                    </label>
                    <Show when={editMode() === false}>
                      <p
                        id="MajorMunicipality"
                        class="rounded w-full px-1 focus:border-btn1 dark:focus:border-btn1-DM border-2 border-border dark:border-border-DM focus:outline-none"
                      >
                        {provider()?.major_municipality}
                      </p>
                    </Show>
                    <Show when={editMode() === true}>
                      <select
                        id="MajorMunicipality"
                        class="ml-2 rounded mb-4 dark:text-black focus:border-btn1 dark:focus:border-btn1-DM border-2 focus:outline-none"
                        name="MajorMunicipality"
                        oninput={required}
                      >
                        <option value="">-</option>
                      </select>
                      <div>
                        <label class="text-text1 dark:text-text1-DM">
                          {t("formLabels.majorMunicipality")}:
                          <p class="rounded w-full px-1 focus:border-btn1 dark:focus:border-btn1-DM border-2 border-border dark:border-border-DM focus:outline-none">
                            {provider()?.major_municipality}
                          </p>
                        </label>
                      </div>
                    </Show>

                    <br />

                    <label
                      for="MinorMunicipality"
                      class="text-text1 dark:text-text1-DM"
                    >
                      {t("formLabels.minorMunicipality")}:
                    </label>
                    <Show when={editMode() === false}>
                      <p
                        id="MinorMunicipality"
                        class="rounded w-full px-1 focus:border-btn1 dark:focus:border-btn1-DM border-2 border-border dark:border-border-DM focus:outline-none"
                      >
                        {provider()?.minor_municipality}
                      </p>
                    </Show>
                    <Show when={editMode() === true}>
                      <select
                        id="MinorMunicipality"
                        class="ml-2 rounded mb-4 dark:text-black focus:border-btn1 dark:focus:border-btn1-DM border-2 focus:outline-none"
                        name="MinorMunicipality"
                        oninput={required}
                      >
                        <option value="">-</option>
                      </select>
                      <div>
                        <label class="text-text1 dark:text-text1-DM">
                          {t("formLabels.minorMunicipality")}:
                          <p class="rounded w-full px-1 focus:border-btn1 dark:focus:border-btn1-DM border-2 border-border dark:border-border-DM focus:outline-none">
                            {provider()?.minor_municipality}
                          </p>
                        </label>
                      </div>
                    </Show>

                    <br />

                    <label
                      for="GoverningDistrict"
                      class="text-text1 dark:text-text1-DM"
                    >
                      {t("formLabels.governingDistrict")}:
                    </label>
                    <Show when={editMode() === false}>
                      <p class="rounded w-full px-1 focus:border-btn1 dark:focus:border-btn1-DM border-2 border-border dark:border-border-DM focus:outline-none">
                        {provider()?.governing_district}
                      </p>
                    </Show>
                    <Show when={editMode() === true}>
                      <select
                        id="GoverningDistrict"
                        class="ml-2 rounded mb-4 dark:text-black focus:border-btn1 dark:focus:border-btn1-DM border-2 focus:outline-none"
                        name="GoverningDistrict"
                        oninput={required}
                      >
                        <option value="">-</option>
                      </select>
                      <div>
                        <label class="text-text1 dark:text-text1-DM">
                          {t("formLabels.governingDistrict")}:
                          <p class="rounded w-full px-1 focus:border-btn1 dark:focus:border-btn1-DM border-2 border-border dark:border-border-DM focus:outline-none">
                            {provider()?.governing_district}
                          </p>
                        </label>
                      </div>
                    </Show>
                    <div class="mb-2 mt-4 flex justify-center items-center align-items-center">
                      <Show when={editMode() === true}>
                        <button
                          class="btn-primary"
                          type="submit"
                          form="editProfile"
                        >
                          {t("buttons.saveProfile")}
                        </button>
                      </Show>
                    </div>
                  </div>
                </details>

                {/* View Posts for Mobile View */}
                <details class="bg-background1 dark:bg-black shadow rounded group md:hidden">
                  <summary class="list-none flex flex-wrap items-center cursor-pointer rounded group-open:rounded-b-none group-open:z-[1] relative">
                    <h2 class="flex flex-1 p-4 font-bold">
                      {t("formLabels.yourPosts")}
                    </h2>
                    <div class="flex w-10 items-center justify-center">
                      <div class="border-8 border-transparent border-l-gray-600 ml-2 group-open:rotate-90 transition-transform"></div>
                    </div>
                  </summary>
                  <div class="p-2">
                    <div class="justify-center flex">
                      <a
                        class="btn-primary mx-6 mb-4"
                        href={`/${lang}/posts/createpost`}
                      >
                        {t("pageTitles.createPost")}
                      </a>
                    </div>
                    <div class="md:col-span-3">
                      <div class="">
                        <ViewProviderPosts />
                      </div>
                    </div>
                  </div>
                </details>
              </div>
            </Show>

            {/* Profile Information for md+ View */}
            <Show when={screenSize() !== "sm"}>
              <div class="hidden md:block">
                <h2 class="text-xl text-text1 dark:text-text1-DM py-4 font-bold">
                  {provider()?.provider_name == ""
                    ? provider()?.first_name + " " + provider()?.last_name
                    : provider()?.provider_name}
                </h2>
                <div class="flex justify-center mb-3">
                  <Show when={editMode() === false}>
                    <Show when={typeof providerImage() !== "undefined"}>
                      <div class="relative w-48 h-48 overflow-hidden rounded-full md:h-48 md:w-48 lg:h-64 lg:w-64 object-contain justify-center border border-border dark:border-border-DM">
                        <img
                          src={providerImage()}
                          class="absolute block -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 object-contain justify-center h-56 md:h-96"
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

                <label for="FirstName" class="text-text2 dark:text-text1-DM">
                  {t("formLabels.firstName")}:
                </label>
                <Show when={editMode() === false}>
                  <p
                    id="FirstName"
                    class="rounded w-full mb-4 px-1 focus:border-btn1 dark:focus:border-btn1-DM border-2 border-border dark:border-border-DM focus:outline-none"
                  >
                    {provider()?.first_name}
                  </p>
                </Show>
                <Show when={editMode() === true}>
                  <input
                    type="text"
                    id="FirstName"
                    name="FirstName"
                    class="rounded w-full mb-4 px-1 text-text1 focus:border-btn1 dark:focus:border-btn1-DM border-2 focus:outline-none"
                    value={provider()?.first_name}
                  />
                </Show>

                <label for="LastName" class="text-text2 dark:text-text1-DM">
                  {t("formLabels.lastName")}:
                </label>
                <Show when={editMode() === false}>
                  <p
                    id="LastName"
                    class="rounded w-full mb-4 px-1 focus:border-btn1 dark:focus:border-btn1-DM border-2 border-border dark:border-border-DM focus:outline-none"
                  >
                    {provider()?.last_name}
                  </p>
                </Show>
                <Show when={editMode() === true}>
                  <input
                    type="text"
                    id="LastName"
                    name="LastName"
                    class="rounded w-full mb-4 px-1 text-text1 focus:border-btn1 dark:focus:border-btn1-DM border-2 focus:outline-none"
                    value={provider()?.last_name}
                  />
                </Show>

                <label for="ProviderName" class="text-text1 dark:text-text1-DM">
                  {t("formLabels.providerName")}:
                </label>
                <Show when={editMode() === false}>
                  <p
                    id="ProviderName"
                    class="rounded w-full mb-4 px-1 focus:border-btn1 dark:focus:border-btn1-DM border-2 border-border dark:border-border-DM focus:outline-none"
                  >
                    {provider()?.provider_name
                      ? provider()?.provider_name
                      : t("formLabels.noValue")}
                  </p>
                </Show>
                <Show when={editMode() === true}>
                  <input
                    type="text"
                    id="ProviderName"
                    name="ProviderName"
                    class="rounded w-full mb-4 px-1 text-text1 focus:border-btn1 dark:focus:border-btn1-DM border-2 focus:outline-none"
                    value={provider()?.provider_name}
                  />
                </Show>

                <div class="w-full overflow-auto mb-4">
                  <label for="email" class="text-text1 dark:text-text1-DM">
                    {t("formLabels.email")}:
                    {/* I would like this to have a tool tip that lets them know that they can't change the email because it is associated with their account. */}
                  </label>
                  <Show when={editMode() === false}>
                    <p
                      id="email"
                      class="rounded px-1 focus:border-btn1 dark:focus:border-btn1-DM border-2 border-border dark:border-border-DM focus:outline-none"
                    >
                      {provider()?.email}
                    </p>
                  </Show>
                  <Show when={editMode() === true}>
                    <input
                      id="email"
                      name="email"
                      class="inputField ml-2 rounded-md pl-2 w-5/6 border border-border"
                      type="email"
                      placeholder={t("formLabels.email")}
                      value={provider()?.email}
                    />
                  </Show>
                </div>

                <label for="Phone" class="text-text1 dark:text-text1-DM">
                  {t("formLabels.phone")}:
                </label>
                <Show when={editMode() === false}>
                  <p
                    id="Phone"
                    class="rounded w-full mb-4 px-1 focus:border-btn1 dark:focus:border-btn1-DM border-2 border-border dark:border-border-DM focus:outline-none"
                  >
                    {provider()?.provider_phone}
                  </p>
                </Show>
                <Show when={editMode() === true}>
                  <input
                    type="text"
                    id="Phone"
                    class="rounded w-full mb-4 text-text1 focus:border-btn1 dark:focus:border-btn1-DM border-2 focus:outline-none"
                    name="Phone"
                    value={provider()?.provider_phone}
                  />
                </Show>

                <label for="country" class="text-text1 dark:text-text1-DM">
                  {t("formLabels.country")}:
                </label>
                <Show when={editMode() === false}>
                  <p
                    id="country"
                    class="rounded w-full px-1 focus:border-btn1 dark:focus:border-btn1-DM border-2 border-border dark:border-border-DM focus:outline-none"
                  >
                    {provider()?.country}
                  </p>
                </Show>
                <Show when={editMode() === true}>
                  <select
                    id="country"
                    class="ml-2 rounded mb-4 dark:text-black focus:border-btn1 dark:focus:border-btn1-DM border-2 focus:outline-none"
                    name="country"
                    oninput={required}
                  >
                    <option value="">-</option>
                  </select>
                </Show>

                <br />

                <label
                  for="MajorMunicipality"
                  class="text-text1 dark:text-text1-DM"
                >
                  {t("formLabels.majorMunicipality")}:
                </label>
                <Show when={editMode() === false}>
                  <p
                    id="MajorMunicipality"
                    class="rounded w-full px-1 focus:border-btn1 dark:focus:border-btn1-DM border-2 border-border dark:border-border-DM focus:outline-none"
                  >
                    {provider()?.major_municipality}
                  </p>
                </Show>
                <Show when={editMode() === true}>
                  <select
                    id="MajorMunicipality"
                    class="ml-2 rounded mb-4 dark:text-black focus:border-btn1 dark:focus:border-btn1-DM border-2 focus:outline-none"
                    name="MajorMunicipality"
                    oninput={required}
                  >
                    <option value="">-</option>
                  </select>
                </Show>

                <br />

                <label
                  for="MinorMunicipality"
                  class="text-text1 dark:text-text1-DM"
                >
                  {t("formLabels.minorMunicipality")}:
                </label>
                <Show when={editMode() === false}>
                  <p
                    id="MinorMunicipality"
                    class="rounded w-full px-1 focus:border-btn1 dark:focus:border-btn1-DM border-2 border-border dark:border-border-DM focus:outline-none"
                  >
                    {provider()?.minor_municipality}
                  </p>
                </Show>
                <Show when={editMode() === true}>
                  <select
                    id="MinorMunicipality"
                    class="ml-2 rounded mb-4 dark:text-black focus:border-btn1 dark:focus:border-btn1-DM border-2 focus:outline-none"
                    name="MinorMunicipality"
                    oninput={required}
                  >
                    <option value="">-</option>
                  </select>
                </Show>

                <br />

                <label
                  for="GoverningDistrict"
                  class="text-text1 dark:text-text1-DM"
                >
                  {t("formLabels.governingDistrict")}:
                </label>
                <Show when={editMode() === false}>
                  <p class="rounded w-full px-1 focus:border-btn1 dark:focus:border-btn1-DM border-2 border-border dark:border-border-DM focus:outline-none">
                    {provider()?.governing_district}
                  </p>
                </Show>
                <Show when={editMode() === true}>
                  <select
                    id="GoverningDistrict"
                    class="ml-2 rounded mb-4 dark:text-black focus:border-btn1 dark:focus:border-btn1-DM border-2 focus:outline-none"
                    name="GoverningDistrict"
                    oninput={required}
                  >
                    <option value="">-</option>
                  </select>
                </Show>
              </div>
            </Show>
            <Suspense>{response() && <p>{response().message}</p>}</Suspense>
          </form>
        </div>

        {/* Right Column Post View and Buttons for md+ View */}
        <div class="md:col-span-3">
          <div class="hidden md:block">
            <div class="justify-end hidden md:flex mr-4">
              {/* Create Post Button*/}
              <a class="btn-primary mx-6" href={`/${lang}/posts/createpost`}>
                {t("pageTitles.createPost")}
              </a>
              {/* Edit Profile Button*/}
              <Show when={editMode() === false}>
                <button class="btn-primary" onclick={enableEditMode}>
                  {t("buttons.editProfile")}
                </button>
              </Show>
              <Show when={editMode() === true}>
                <button class="btn-primary" type="submit" form="editProfile">
                  {t("buttons.saveProfile")}
                </button>
              </Show>
            </div>

            {/* View Post Cards*/}
            <div class="my-6">
              <ViewProviderPosts />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
