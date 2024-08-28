import type { Component } from "solid-js";
import {
    For,
    Show,
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
import { UploadFiles } from "@components/posts/UploadResource";
import tinymce from "tinymce";
import { sortResourceTypes } from "@lib/utils/resourceSort";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);
const values = ui[lang] as uiObject;

//get the categories from the language files so they translate with changes in the language picker
const productCategoryData = values.subjectCategoryInfo;

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
    //Software as a service
    /^txcd_1010300.*/,
    /^txcd_1010310.*/,
    //Downloadable Software - Custom
    /^txcd_1020300.*/,
    //Business Use
    /^txcd_10202003.*/,
]);

let uploadFilesRef: any;

async function postFormData(formData: FormData) {
    const info = formData;
    const response = await fetch("/api/creatorCreatePost", {
        method: "POST",
        body: formData,
    });
    const data = await response.json();
    console.log(response.status);
    if (response.status === 200) {
        //Get plain text description
        let tmpDiv = document.createElement("div");
        tmpDiv.innerHTML = formData.get("Content") as string;
        let description = tmpDiv.textContent || tmpDiv.innerText || "";
        if ((formData.get("Price") as string) != null) {
            CreateStripeProductPrice({
                name: String(formData.get("Title")),
                description: description,
                price: parseInt(formData.get("Price") as string),
                id: data.id,
                access_token: formData.get("access_token") as string,
                refresh_token: formData.get("refresh_token") as string,
                tax_code: formData.get("TaxCode") as string,
            });
        } else if ((formData.get("Price") as string) == null) {
            alert(data.message + " " + t("messages.freeResourceCreated"));
            window.location.href = `/${lang}/creator/profile`;
        }
        // if (uploadFilesRef) {
        //     uploadFilesRef.upload();
        // }
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
    const [subjects, setSubjects] = createSignal<
        Array<{ id: number; subject: string }>
    >([]);
    const [subjectPick, setSubjectPick] = createSignal<Array<string>>([]);
    const [grades, setGrades] = createSignal<
        Array<{ id: number; grade: string }>
    >([]);
    const [gradePick, setGradePick] = createSignal<Array<string>>([]);
    const [resourceTypesPick, setResourceTypesPick] = createSignal<
        Array<string>
    >([]);
    const [resourceTypes, setResourceTypes] = createSignal<
        Array<{ id: number; type: string }>
    >([]);
    const [uploadFinished, setUploadFinished] = createSignal(false);
    const [resourceURL, setResourceURL] = createSignal<Array<string>>([]);
    const [price, setPrice] = createSignal<string>("");
    const [isFree, setIsFree] = createSignal<boolean>(false);
    const [allRequirementsMet, setAllRequirementsMet] =
        createSignal<boolean>(false);
    const [showDescriptionErrorMessage, setShowDescriptionErrorMessage] =
        createSignal<boolean>(false);
    const [description, setDescription] = createSignal<boolean>(false);

    const [subjectExpanded, setSubjectExpanded] = createSignal<boolean>(false);
    const [gradeExpanded, setGradeExpanded] = createSignal<boolean>(false);
    const [resourceExpanded, setResourceExpanded] =
        createSignal<boolean>(false);
    const [secular, setSecular] = createSignal<boolean>(false);
    const [isAdmin, setIsAdmin] = createSignal<boolean>(false);
    const [isHosted, setIsHosted] = createSignal<boolean>(false);
    const [resourceLinks, setResourceLinks] = createSignal<string>("");
    const [draftStatus, setDraftStatus] = createSignal<boolean>(false);

    onMount(() => {
        window.addEventListener("storage", (event) => {
            if (event.key === "theme") {
                setMode({ theme: event.newValue });
                mountTiny();
            }
        });

        let description = document.getElementById("Content");
        description?.addEventListener("invalid", (e) => {
            e.preventDefault();

            setShowDescriptionErrorMessage(true);
            window.location.href = "#content-label";

            setTimeout(() => {
                setShowDescriptionErrorMessage(false);
            }, 5000);
        });
    });

    createEffect(async () => {
        const { data, error } = await supabase.auth.getSession();
        setSession(data.session);

        if (session()) {
            //Check if they are a creator
            try {
                const { data: creators, error: errorCreators } = await supabase
                    .from("sellers")
                    .select("*")
                    .eq("user_id", session()!.user.id);
                if (errorCreators) {
                    console.log("supabase error: " + errorCreators.message);
                } else {
                    if (creators.length === 0) {
                        alert(t("messages.onlyCreator"));
                        window.location.href = `/${lang}/creator/createaccount`;
                    } else if (
                        creators[0].stripe_connected_account_id === null
                    ) {
                        alert(t("messages.noStripeAccount"));
                        window.location.href = `/${lang}/creator/profile`;

                        //Check if the user as claims_admin role
                    } else if (session()?.user.app_metadata.claims_admin) {
                        setIsAdmin(true);
                    }
                }
            } catch (error) {
                console.log("Other error: " + error);
            }

            //Tax Code
            try {
                const { data: taxCodes } = await stripe.taxCodes.list({
                    limit: 100,
                });
                if (error) {
                    console.log("stripe error: " + error.message);
                } else {
                    taxCodes.forEach((taxCode) => {
                        if (
                            //Digital Products
                            /^txcd_1.*/.test(taxCode.id) &&
                            //Not in our filter list
                            !Array.from(excludeTaxCodes).some(
                                (excludeTaxCode) =>
                                    excludeTaxCode.test(taxCode.id)
                            )
                        ) {
                            let taxCodeOption = new Option(
                                taxCode.name,
                                taxCode.id
                            );
                            taxCodeOption.setAttribute(
                                "data-description",
                                taxCode.description
                            );
                            taxCodeOptions.push(taxCodeOption);
                        }
                    });
                }
            } catch (error) {
                console.log("Other error: " + error);
            }

            //Resource Type Level
            try {
                const { data: resourceType, error } = await supabase
                    .from("resource_types")
                    .select("*");
                if (error) {
                    console.log("supabase error: " + error.message);
                } else {
                    sortResourceTypes(resourceType);
                    resourceType.forEach((type) => {
                        setResourceTypes([
                            ...resourceTypes(),
                            { id: type.id, type: type.type },
                        ]);
                    });
                }
            } catch (error) {
                console.log("Other error: " + error);
            }

            productCategoryData.subjects.map((subject) =>
                setSubjects([
                    ...subjects(),
                    { id: Number(subject.id), subject: subject.name },
                ])
            );
            try {
                const { data: gradeData, error } = await supabase
                    .from("grade_level")
                    .select("*");
                if (error) {
                    console.log("supabase error: " + error.message);
                } else {
                    gradeData.forEach((grade) => {
                        setGrades([
                            ...grades(),
                            { id: grade.id, grade: grade.grade },
                        ]);
                    });
                }
            } catch (error) {
                console.log("Other error: " + error);
            }
        } else {
            alert(t("messages.signInAsCreator"));
            location.href = `/${lang}/login`;
        }
    });

    //Check if all requirements have been met
    createEffect(async () => {
        console.log("allRequirementsMet: ", allRequirementsMet());

        let title = document.getElementById("Title");

        if (
            title?.nodeValue !== "" &&
            description() &&
            subjectPick().length > 0 &&
            gradePick().length > 0 &&
            resourceTypesPick().length > 0 &&
            isFree() &&
            uploadFinished() &&
            imageUrl().length > 0
        ) {
            setAllRequirementsMet(true);
        } else if (
            title?.nodeValue !== "" &&
            description() &&
            subjectPick().length > 0 &&
            gradePick().length > 0 &&
            resourceTypesPick().length > 0 &&
            !isFree() &&
            price().length > 0 &&
            selectedTaxCode()?.value !== "" &&
            uploadFinished() &&
            imageUrl().length > 0
        ) {
            setAllRequirementsMet(true);
        } else if (
            isAdmin() &&
            title?.nodeValue !== "" &&
            description() &&
            subjectPick().length > 0 &&
            gradePick().length > 0 &&
            resourceTypesPick().length > 0 &&
            //Remove is free if we allow paid hosted resources in the future
            isFree() &&
            imageUrl().length > 0 &&
            resourceLinks() !== "" &&
            resourceLinks() !== null &&
            resourceLinks() !== undefined
        ) {
            setAllRequirementsMet(true);
        } else {
            setAllRequirementsMet(false);
        }
    });

    function saveAsDraft(e: Event) {
        e.preventDefault();
        setDraftStatus(true);

        const button = e.currentTarget as HTMLFormElement;
        const form = button.closest("form") as HTMLFormElement;

        if (form) {
            form.requestSubmit();
        }
    }

    async function submit(e: SubmitEvent) {
        e.preventDefault();

        const formData = new FormData(e.target as HTMLFormElement);
        formData.append("access_token", session()?.access_token!);
        formData.append("refresh_token", session()?.refresh_token!);
        formData.append("draft_status", JSON.stringify(draftStatus()));
        formData.append("lang", lang);
        if (isFree()) {
            setPrice("0");
            formData.set("Price", price());
        } else {
            formData.set("Price", price());
        }

        if (selectedTaxCode() !== undefined) {
            formData.append("TaxCode", selectedTaxCode()!.value.toString());
        } else if (price() === "0") {
            formData.append("TaxCode", "txcd_10000000");
        }

        if (subjectPick() !== undefined) {
            formData.append("subject", JSON.stringify(subjectPick()));
        }

        if (gradePick() !== undefined) {
            formData.append("grade", JSON.stringify(gradePick()));
        }

        if (resourceTypesPick() !== undefined) {
            formData.append(
                "resource_types",
                JSON.stringify(resourceTypesPick())
            );
        }

        if (imageUrl() !== null) {
            formData.append("image_url", imageUrl()!.toString());
        }

        if (imageUrl() !== null) {
            formData.append("resource_url", resourceURL()!.toString());
        }

        if (secular() !== null) {
            formData.append("secular", secular().toString());
        }

        if (isHosted() && resourceLinks() !== null && resourceLinks() !== "") {
            formData.append("resource_links", resourceLinks());
        }

        setFormData(formData);
    }

    function subjectCheckboxes() {
        if (gradeExpanded()) {
            gradeCheckboxes();
        }
        if (resourceExpanded()) {
            resourceTypesCheckboxes();
        }
        let checkboxes = document.getElementById("subjectCheckboxes");
        let subjectArrow = document.getElementById("subject-arrow");

        if (!subjectExpanded()) {
            checkboxes?.classList.remove("hidden");
            checkboxes?.classList.add("md:grid");
            subjectArrow?.classList.add("rotate-180");
            setSubjectExpanded(true);
        } else {
            checkboxes?.classList.remove("md:grid");
            checkboxes?.classList.add("hidden");
            subjectArrow?.classList.remove("rotate-180");
            setSubjectExpanded(false);
        }
    }

    function gradeCheckboxes() {
        if (subjectExpanded()) {
            subjectCheckboxes();
        }
        if (resourceExpanded()) {
            resourceTypesCheckboxes();
        }
        let checkboxes = document.getElementById("gradeCheckboxes");
        let gradeArrow = document.getElementById("grade-arrow");

        if (!gradeExpanded()) {
            checkboxes?.classList.remove("hidden");
            checkboxes?.classList.add("md:grid");
            gradeArrow?.classList.add("rotate-180");
            setGradeExpanded(true);
        } else {
            checkboxes?.classList.remove("md:grid");
            checkboxes?.classList.add("hidden");
            gradeArrow?.classList.remove("rotate-180");
            setGradeExpanded(false);
        }
    }

    function resourceTypesCheckboxes() {
        if (subjectExpanded()) {
            subjectCheckboxes();
        }
        if (gradeExpanded()) {
            gradeCheckboxes();
        }
        let checkboxes = document.getElementById("resourceTypesCheckboxes");
        let resourceArrow = document.getElementById("resource-arrow");

        if (!resourceExpanded()) {
            checkboxes?.classList.remove("hidden");
            checkboxes?.classList.add("md:grid");
            resourceArrow?.classList.add("rotate-180");
            setResourceExpanded(true);
        } else {
            checkboxes?.classList.remove("md:grid");
            checkboxes?.classList.add("hidden");
            resourceArrow?.classList.remove("rotate-180");
            setResourceExpanded(false);
        }
    }
    function setSubjectArray(e: Event) {
        if ((e.target as HTMLInputElement).checked) {
            setSubjectPick([
                ...subjectPick(),
                (e.target as HTMLInputElement).value,
            ]);
        } else if ((e.target as HTMLInputElement).checked === false) {
            if (subjectPick().includes((e.target as HTMLInputElement).value)) {
                setSubjectPick(
                    subjectPick().filter(
                        (value) =>
                            value !== (e.target as HTMLInputElement).value
                    )
                );
            }
        }
        if (subjectPick().length > 0) {
            document
                .getElementById("isSubjectValid")
                ?.classList.remove("hidden");
            document.getElementById("subjectToolTip")?.classList.add("hidden");
        } else if (subjectPick().length === 0) {
            document.getElementById("isSubjectValid")?.classList.add("hidden");
            document
                .getElementById("subjectToolTip")
                ?.classList.remove("hidden");
        }
        console.log(subjectPick());
    }

    function formatPrice(resourcePrice: string) {
        if (resourcePrice.indexOf(".") === -1) {
            setPrice(resourcePrice + "00");
        } else if (resourcePrice.indexOf(".") >= 0) {
            setPrice(resourcePrice.replace(".", ""));
        } else {
            console.log("Price error");
        }
    }

    function setGradeArray(e: Event) {
        if ((e.target as HTMLInputElement).checked) {
            setGradePick([
                ...gradePick(),
                (e.target as HTMLInputElement).value,
            ]);
        } else if ((e.target as HTMLInputElement).checked === false) {
            if (gradePick().includes((e.target as HTMLInputElement).value)) {
                setGradePick(
                    gradePick().filter(
                        (value) =>
                            value !== (e.target as HTMLInputElement).value
                    )
                );
            }
        }
        if (gradePick().length > 0) {
            document.getElementById("isGradeValid")?.classList.remove("hidden");
            document.getElementById("gradeToolTip")?.classList.add("hidden");
        } else if (gradePick().length === 0) {
            document.getElementById("isGradeValid")?.classList.add("hidden");
            document.getElementById("gradeToolTip")?.classList.remove("hidden");
        }
        console.log(gradePick());
    }

    function setResourceTypesArray(e: Event) {
        if ((e.target as HTMLInputElement).checked) {
            setResourceTypesPick([
                ...resourceTypesPick(),
                (e.target as HTMLInputElement).value,
            ]);
        } else if ((e.target as HTMLInputElement).checked === false) {
            if (
                resourceTypesPick().includes(
                    (e.target as HTMLInputElement).value
                )
            ) {
                setResourceTypesPick(
                    resourceTypesPick().filter(
                        (value) =>
                            value !== (e.target as HTMLInputElement).value
                    )
                );
            }
        }
        if (resourceTypesPick().length > 0) {
            document
                .getElementById("isResourceTypeValid")
                ?.classList.remove("hidden");
            document
                .getElementById("resourceTypeToolTip")
                ?.classList.add("hidden");
        } else if (gradePick().length === 0) {
            document
                .getElementById("isResourceTypeValid")
                ?.classList.add("hidden");
            document
                .getElementById("resourceTypeToolTip")
                ?.classList.remove("hidden");
        }
        console.log(resourceTypesPick());
    }

    function setHostedLinks(value: string) {
        setResourceLinks(value);
    }

    function mountTiny() {
        TinyComp({
            id: "#Content",
            mode: mode.theme,
            currentContent: processContent,
        });

        if (!TinyComp) {
            console.log("No tiny comp");
        }
    }

    function processContent(content: string) {
        if (content.length > 0) {
            setDescription(true);
            console.log("Description: " + description());
        } else {
            setDescription(false);
            console.log("Description: " + description());
        }
    }

    function removeImage(imageId: string) {
        console.log(imageUrl());
        const index = imageUrl().indexOf(imageId);
        const imageArray = [...imageUrl()];
        if (index > -1) {
            imageArray.splice(index, 1);
            setImageUrl(imageArray);
            console.log(imageUrl());
        }
    }

    return (
        <div>
            <form onSubmit={submit}>
                <div class="text-center text-xs">
                    <span class="text-alert1">* </span>
                    <span class="italic">{t("formLabels.required")}</span>
                </div>
                <label for="Title" class="text-ptext1 dark:text-ptext1-DM">
                    <span class="text-alert1">* </span>
                    {t("formLabels.title")}
                    <input
                        type="text"
                        id="Title"
                        name="Title"
                        class="mb-4 w-full rounded border border-inputBorder1 bg-background1 px-1 text-ptext1 focus:border-2 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM dark:focus:border-highlight1-DM"
                        required
                    />
                </label>

                <br />

                <label
                    id="content-label"
                    for="Content"
                    class="text-ptext1 dark:text-ptext1-DM"
                >
                    <span class="text-alert1">* </span>
                    {t("menus.description")}
                    <textarea
                        id="Content"
                        name="Content"
                        class="w-full rounded border border-inputBorder1 bg-background1 px-1 text-ptext1 placeholder-shown:italic focus:border-2 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM  dark:focus:border-highlight1-DM "
                        placeholder={t("formLabels.enterPostContent")}
                        rows="10"
                        required
                        ref={mountTiny}
                    ></textarea>
                </label>

                <Show when={showDescriptionErrorMessage()}>
                    <p class="font-lg italic text-alert1 dark:text-alert1-DM">
                        {t("messages.descriptionRequired")}
                    </p>
                </Show>

                <div class="my-4 flex w-full flex-col justify-center">
                    <div class="flex items-center">
                        <p>
                            {t("formLabels.images")} ({imageUrl().length}/5)
                        </p>

                        <div class="ml-2 flex items-end justify-end">
                            <div class="group relative flex items-center">
                                <svg
                                    class="peer h-4 w-4 rounded-full border-2 border-border1 bg-icon1 fill-iconbg1  dark:border-none dark:bg-background1-DM dark:fill-iconbg1-DM"
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

                                <span class="translate-x-1/8 invisible absolute z-10 m-4 mx-auto w-48 translate-y-2/3 rounded-md bg-background2 p-2 text-sm text-ptext2 transition-opacity peer-hover:visible dark:bg-background2-DM dark:text-ptext2-DM md:translate-x-1/4 md:translate-y-0">
                                    {t("toolTips.postImages")}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="w-full">
                        <PostImage
                            url={imageUrl()[imageUrl().length - 1]}
                            size={96}
                            onUpload={(e: Event, url: string) => {
                                setImageUrl([...imageUrl(), url]);
                                console.log(imageUrl());
                            }}
                            removeImage={(imageId) => removeImage(imageId)}
                        />
                    </div>
                </div>

                {/* Subject Picker */}
                <div class="mt-2 flex justify-start">
                    <label
                        for="subject"
                        class="hidden w-4/12 text-ptext1 dark:text-ptext1-DM"
                    >
                        <span class="text-alert1 dark:text-alert1-DM">* </span>
                        {t("formLabels.subjects")}:
                    </label>

                    {/* Creates a list of checkboxes that drop down to multiple select */}
                    <div class="flex-grow">
                        <div
                            class="relative flex w-full items-center justify-between rounded border border-inputBorder1 focus-within:border-2 focus-within:border-highlight1 focus-within:outline-none dark:bg-background2-DM"
                            onClick={() => subjectCheckboxes()}
                        >
                            <div
                                id="chooseSubject"
                                class="bg-background w-11/12 px-1 text-ptext1 dark:bg-background2-DM dark:text-ptext2-DM"
                            >
                                <Show when={subjectPick().length > 0}>
                                    {subjectPick().map((subject) =>
                                        subjects()
                                            .filter(
                                                (item) =>
                                                    item.id.toString() ===
                                                    subject
                                            )
                                            .map((item) => (
                                                <span class="mr-1">
                                                    {item.subject},
                                                </span>
                                            ))
                                    )}
                                </Show>
                                <Show when={subjectPick().length === 0}>
                                    <span class="text-alert1">* </span>
                                    {t("formLabels.chooseSubject")}
                                </Show>
                            </div>

                            <svg
                                id="subject-arrow"
                                class="inline-block h-5 w-5 transform fill-icon1 transition-transform dark:fill-icon1-DM"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                        </div>
                        <div
                            id="subjectCheckboxes"
                            class="hidden max-h-28 grid-cols-2 overflow-y-auto bg-background1 pt-2 text-ptext1 focus:border-2 focus:border-highlight1 focus:outline-none dark:bg-background2-DM dark:text-ptext2-DM dark:focus:border-highlight1-DM"
                        >
                            <For each={subjects()}>
                                {(subject) => (
                                    <label class="ml-2 block">
                                        <input
                                            type="checkbox"
                                            id={subject.id.toString()}
                                            value={subject.id.toString()}
                                            onchange={(e) => setSubjectArray(e)}
                                        />
                                        <span class="ml-2">
                                            {subject.subject}
                                        </span>
                                    </label>
                                )}
                            </For>
                        </div>
                    </div>

                    <div class="w-fit">
                        <div
                            class="relative ml-2 mt-1 flex items-start"
                            id="subjectToolTip"
                        >
                            <svg
                                class="peer h-4 w-4 rounded-full border-2 border-border1 bg-icon1 fill-iconbg1 dark:border-none dark:bg-background1-DM dark:fill-iconbg1-DM"
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

                            <span class="invisible absolute z-10 m-4 mx-auto w-48 -translate-x-full translate-y-3 rounded-md bg-background2 p-2 text-sm text-ptext2 opacity-0 transition-opacity peer-hover:visible peer-hover:opacity-100 dark:bg-background2-DM dark:text-ptext2-DM">
                                {t("toolTips.subjects")}
                            </span>
                        </div>
                        <svg
                            id="isSubjectValid"
                            class="ml-1 mt-0.5 hidden h-4 w-4 fill-btn1 dark:fill-btn1-DM"
                            viewBox="0 0 12 12"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="m4.94960124 7.88894106-1.91927115-1.91927115c-.29289322-.29289321-.76776696-.29289321-1.06066018 0-.29289321.29289322-.29289321.76776696 0 1.06066018l2.5 2.5c.31185072.31185071.82415968.28861186 1.10649605-.05019179l5.00000004-6c.265173-.31820767.22218-.7911312-.0960277-1.05630426s-.7911312-.22218001-1.05630426.09602766z" />
                        </svg>
                    </div>
                </div>

                {/* Grade Picker */}
                <div class="mt-2 flex justify-start">
                    <label
                        for="grade"
                        class="hidden w-4/12 text-ptext1 dark:text-ptext1-DM"
                    >
                        <span class="text-alert1 dark:text-alert1-DM">* </span>
                        {t("formLabels.grades")}:
                    </label>

                    {/* Creates a list of checkboxes that drop down to multiple select */}
                    <div class="flex-grow">
                        <div
                            class="relative flex w-full items-center justify-between rounded border border-inputBorder1 dark:bg-background2-DM"
                            onClick={() => gradeCheckboxes()}
                        >
                            <div
                                id="chooseGrade"
                                class="bg-background flex w-11/12 flex-wrap px-1 text-ptext1 dark:bg-background2-DM dark:text-ptext2-DM"
                            >
                                <Show when={gradePick().length > 0}>
                                    {gradePick().map((grade) =>
                                        grades()
                                            .filter(
                                                (item) =>
                                                    item.id.toString() === grade
                                            )
                                            .map((item) => (
                                                <span class="mr-1">
                                                    {item.grade},
                                                </span>
                                            ))
                                    )}
                                </Show>
                                <Show when={gradePick().length === 0}>
                                    <span class="text-alert1">* </span>
                                    {t("formLabels.chooseGrade")}
                                </Show>
                            </div>

                            <svg
                                id="grade-arrow"
                                class="inline-block h-5 w-5 transform fill-icon1 transition-transform dark:fill-icon1-DM"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                        </div>
                        <div
                            id="gradeCheckboxes"
                            class="hidden max-h-28 grid-cols-2 overflow-y-auto  bg-background1 pt-2 text-ptext1 focus:border-2 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM dark:focus:border-highlight1-DM"
                        >
                            <For each={grades()}>
                                {(grade) => (
                                    <label class="ml-2 block">
                                        <input
                                            type="checkbox"
                                            id={grade.id.toString()}
                                            value={grade.id.toString()}
                                            onchange={(e) => setGradeArray(e)}
                                        />
                                        <span class="ml-2">{grade.grade}</span>
                                    </label>
                                )}
                            </For>
                        </div>
                    </div>

                    <div class="w-fit">
                        <div
                            class="relative ml-2 mt-1 flex items-start"
                            id="gradeToolTip"
                        >
                            <svg
                                class="peer h-4 w-4 rounded-full border-2 border-border1 bg-icon1 fill-iconbg1 dark:border-none dark:bg-background1-DM dark:fill-iconbg1-DM"
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

                            <span class="invisible absolute z-10 m-4 mx-auto w-48 -translate-x-full translate-y-3 rounded-md bg-background2 p-2 text-sm text-ptext2 opacity-0 transition-opacity peer-hover:visible peer-hover:opacity-100 dark:bg-background2-DM dark:text-ptext2-DM">
                                {t("toolTips.grades")}
                            </span>
                        </div>
                        <svg
                            id="isGradeValid"
                            class="ml-1 mt-0.5 hidden h-4 w-4 fill-btn1 dark:fill-btn1-DM"
                            viewBox="0 0 12 12"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="m4.94960124 7.88894106-1.91927115-1.91927115c-.29289322-.29289321-.76776696-.29289321-1.06066018 0-.29289321.29289322-.29289321.76776696 0 1.06066018l2.5 2.5c.31185072.31185071.82415968.28861186 1.10649605-.05019179l5.00000004-6c.265173-.31820767.22218-.7911312-.0960277-1.05630426s-.7911312-.22218001-1.05630426.09602766z" />
                        </svg>
                    </div>
                </div>

                {/* resourceTypes Picker */}
                <div class="mt-2 flex justify-start">
                    <label
                        for="resourceTypes"
                        class="hidden w-4/12 text-ptext1 dark:text-ptext1-DM"
                    >
                        <span class="text-alert1 dark:text-alert1-DM">* </span>
                        {t("formLabels.resourceTypes")}
                    </label>

                    {/* Creates a list of checkboxes that drop down to multiple select */}
                    <div class="flex-grow">
                        <div
                            class="relative rounded border border-inputBorder1 dark:bg-background2-DM"
                            onClick={() => resourceTypesCheckboxes()}
                        >
                            <div class="flex items-center justify-between">
                                <div
                                    id="chooseResourceType"
                                    class="bg-background flex w-11/12 flex-wrap px-1 text-ptext1 dark:bg-background2-DM dark:text-ptext2-DM"
                                >
                                    <Show when={resourceTypesPick().length > 0}>
                                        {resourceTypesPick().map(
                                            (resourceType) =>
                                                resourceTypes()
                                                    .filter(
                                                        (item) =>
                                                            item.id.toString() ===
                                                            resourceType
                                                    )
                                                    .map((item) => (
                                                        <span class="mr-1">
                                                            {item.type},
                                                        </span>
                                                    ))
                                        )}
                                    </Show>
                                    <Show
                                        when={resourceTypesPick().length === 0}
                                    >
                                        <span class="text-alert1">* </span>{" "}
                                        {t("formLabels.chooseResourceTypes")}
                                    </Show>
                                </div>

                                <svg
                                    id="resource-arrow"
                                    class="inline-block h-5 w-5 transform fill-icon1 transition-transform dark:fill-icon1-DM"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clip-rule="evenodd"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div
                            id="resourceTypesCheckboxes"
                            class="hidden max-h-28 grid-cols-2 overflow-y-auto rounded bg-background1 pt-2 text-ptext1 focus:border-2 focus:border-highlight1 focus:outline-none dark:bg-background2-DM dark:text-ptext2-DM dark:focus:border-highlight1-DM"
                        >
                            <For each={resourceTypes()}>
                                {(type) => (
                                    <label class="ml-2 block">
                                        <input
                                            type="checkbox"
                                            id={type.id.toString()}
                                            value={type.id.toString()}
                                            onchange={(e) =>
                                                setResourceTypesArray(e)
                                            }
                                        />
                                        <span class="ml-2">{type.type}</span>
                                    </label>
                                )}
                            </For>
                        </div>
                    </div>

                    <div class="w-fit">
                        <div
                            class="relative ml-2 mt-1 flex items-start"
                            id="resourceTypeToolTip"
                        >
                            <svg
                                class="peer h-4 w-4 rounded-full border-2 border-border1 bg-icon1 fill-iconbg1 dark:border-none dark:bg-background1-DM dark:fill-iconbg1-DM"
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

                            <span class="invisible absolute z-10 m-4 mx-auto w-48 -translate-x-full translate-y-3 rounded-md bg-background2 p-2 text-sm text-ptext2 opacity-0 transition-opacity peer-hover:visible peer-hover:opacity-100 dark:bg-background2-DM dark:text-ptext2-DM">
                                {t("toolTips.resourceTypes")}
                            </span>
                        </div>
                        <svg
                            id="isResourceTypeValid"
                            class="ml-1 mt-0.5 hidden h-4 w-4 fill-btn1 dark:fill-btn1-DM"
                            viewBox="0 0 12 12"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="m4.94960124 7.88894106-1.91927115-1.91927115c-.29289322-.29289321-.76776696-.29289321-1.06066018 0-.29289321.29289322-.29289321.76776696 0 1.06066018l2.5 2.5c.31185072.31185071.82415968.28861186 1.10649605-.05019179l5.00000004-6c.265173-.31820767.22218-.7911312-.0960277-1.05630426s-.7911312-.22218001-1.05630426.09602766z" />
                        </svg>
                    </div>
                </div>

                {/* Secular Implementation */}
                <div class="mt-2 flex items-center justify-center">
                    <div class="mt-2 flex flex-grow justify-between">
                        <div class="inline-block">
                            {t("formLabels.secular")}?
                        </div>
                        <div class="inline-block">
                            <label class="ml-4">{t("formLabels.yes")}</label>
                            <input
                                type="checkbox"
                                id="secularCheckbox"
                                class="ml-1"
                                checked={secular()}
                                onChange={() => setSecular(!secular())}
                            />
                        </div>
                    </div>
                    <div class="w-fit">
                        <div
                            class="relative ml-2 mt-1 flex items-start"
                            id="secularToolTip"
                        >
                            <svg
                                class="peer h-4 w-4 rounded-full border-2 border-border1 bg-icon1 fill-iconbg1 dark:border-none dark:bg-background1-DM dark:fill-iconbg1-DM"
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

                            <span class="invisible absolute z-10 m-4 mx-auto w-72 -translate-x-full -translate-y-72 rounded-md bg-background2 p-2 text-sm text-ptext2 opacity-0 transition-opacity peer-hover:visible peer-hover:opacity-100 dark:bg-background2-DM dark:text-ptext2-DM">
                                {t("toolTips.secular")}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Hosted Implementation */}
                <Show when={isAdmin()}>
                    <div class="mt-2 flex justify-between">
                        <p>Hosted Resource?</p>
                        <div>
                            <label for="isHostedCheckbox" class="ml-4">
                                {t("formLabels.yes")}
                            </label>
                            <input
                                type="checkbox"
                                id="isHostedCheckbox"
                                class="ml-1"
                                checked={isHosted()}
                                onChange={() => {
                                    setIsHosted(true);
                                    // Currently we are only allowing FREE hosted resources
                                    setIsFree(true);
                                }}
                            />

                            <label for="isNotHostedCheckbox" class="ml-4">
                                {t("formLabels.no")}
                            </label>
                            <input
                                type="checkbox"
                                id="isNotHostedCheckbox"
                                class="ml-1"
                                checked={!isHosted()}
                                onChange={() => setIsHosted(false)}
                            />
                        </div>
                    </div>
                </Show>
                <Show when={isHosted()}>
                    <p class="">Enter a comma separated list of links</p>
                    <input
                        required
                        type="text"
                        class="flex w-full rounded border border-inputBorder1 bg-background1 px-1 text-ptext1 focus:border-2 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM  dark:focus:border-highlight1-DM "
                        id="HostedLink"
                        name="HostedLink"
                        onInput={(e) => setHostedLinks(e.target.value)}
                    />
                </Show>

                {/* Price Implementation */}
                <div class="mt-2 flex flex-col justify-evenly ">
                    <div class="mt-2 flex justify-between">
                        <p>
                            <span class="text-alert1">* </span>
                            {t("formLabels.isResourceFree")}?
                        </p>
                        <div>
                            <label for="isFreeCheckbox" class="ml-4">
                                {t("formLabels.yes")}
                            </label>
                            <input
                                type="checkbox"
                                id="isFreeCheckbox"
                                class="ml-1"
                                checked={isFree()}
                                onChange={() => setIsFree(true)}
                            />

                            <label for="isNotFreeCheckbox" class="ml-4">
                                {t("formLabels.no")}
                            </label>
                            <input
                                type="checkbox"
                                id="isNotFreeCheckbox"
                                class="ml-1"
                                checked={!isFree()}
                                onChange={() => setIsFree(false)}
                            />
                        </div>
                    </div>

                    <Show when={!isFree()}>
                        <div class="flex items-center">
                            <div class="mt-2 flex w-full flex-col">
                                <p>
                                    <span class="text-alert1">* </span>
                                    {t("formLabels.pricePost")}
                                </p>

                                <div class="flex items-center">
                                    <input
                                        required
                                        type="number"
                                        min={1}
                                        step={0.01}
                                        class="flex w-full rounded border border-inputBorder1 bg-background1 px-1 text-ptext1 focus:border-2 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM  dark:focus:border-highlight1-DM "
                                        id="Price"
                                        name="Price"
                                        placeholder={"0.00"}
                                        onInput={(e) =>
                                            formatPrice(e.target.value)
                                        }
                                    />

                                    <div class="group relative flex items-center">
                                        <svg
                                            class="peer ml-2 h-4 w-4 rounded-full border-2 border-border1 bg-icon1 fill-iconbg1  dark:border-none dark:bg-background1-DM dark:fill-iconbg1-DM"
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

                                        <span class="invisible absolute z-10 m-4 mx-auto w-48 -translate-x-full translate-y-3 rounded-md bg-background2 p-2 text-sm text-ptext2 opacity-0 transition-opacity peer-hover:visible peer-hover:opacity-100 dark:bg-background2-DM dark:text-ptext2-DM">
                                            {t("toolTips.price")}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="mt-2 flex items-start justify-center">
                            <div class="w-full">
                                <Dropdown
                                    options={taxCodeOptions}
                                    selectedOption={selectedTaxCode()!}
                                    setSelectedOption={setSelectedTaxCode}
                                />
                            </div>

                            <div class="flex h-7 items-center justify-center">
                                <div class="group relative flex items-center">
                                    <svg
                                        class="peer ml-2 h-4 w-4 rounded-full border-2 border-border1 bg-icon1 fill-iconbg1  dark:border-none dark:bg-background1-DM dark:fill-iconbg1-DM"
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

                                    <span class="invisible absolute z-10 m-4 mx-auto w-48 -translate-x-full translate-y-3 rounded-md bg-background2 p-2 text-sm text-ptext2 opacity-0 transition-opacity peer-hover:visible peer-hover:opacity-100 dark:bg-background2-DM dark:text-ptext2-DM">
                                        {t("toolTips.taxCode")}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <a href={`/${lang}/faq`}>
                                <p class="mt-1 text-[10px] italic text-link1 dark:text-link1-DM md:text-xs">
                                    {t("pageDescriptions.taxCodeLearnMore")}
                                </p>
                            </a>
                        </div>
                    </Show>
                </div>

                <Show when={!isHosted()}>
                    <div class="mt-6">
                        {/* TODO: Mark this as required and provide Error if no files uploaded when trying to post */}
                        {/* TODO: Fix the text centering for Drop files here or browse files */}
                        <UploadFiles
                            target={"#uploadResource"}
                            bucket="resources"
                            setUppyRef={(uppy) => (uploadFilesRef = uppy)}
                            onUpload={(url: string) => {
                                setResourceURL([...resourceURL(), url]);
                            }}
                            removeFile={(url: string) => {
                                setResourceURL(
                                    resourceURL().filter((u) => u !== url)
                                );
                            }}
                            setUploadFinished={(uploadFinished) =>
                                setUploadFinished(uploadFinished)
                            }
                        />
                        <div id="uploadResource" class="w-full"></div>
                    </div>
                </Show>

                <br />
                <div class="flex justify-center">
                    <button
                        id="save-as-draft"
                        class={`btn-primary text-2xl`}
                        onclick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            saveAsDraft(e);
                        }}
                    >
                        Save as Draft
                    </button>
                    <button
                        id="post"
                        disabled={!allRequirementsMet()}
                        class={`text-2xl ${
                            allRequirementsMet()
                                ? "btn-primary"
                                : "btn-disabled"
                        }`}
                    >
                        {t("buttons.listResource")}
                    </button>
                </div>
                <Suspense>
                    {response() && (
                        <p class="mt-2 text-center font-bold text-alert1 dark:text-alert1-DM">
                            {response().message}
                        </p>
                    )}
                </Suspense>
            </form>
        </div>
    );
};
