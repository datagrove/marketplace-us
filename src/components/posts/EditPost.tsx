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
import type { Post } from "@lib/types";
import { sortResourceTypes } from "@lib/utils/resourceSort";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);
const values = ui[lang] as uiObject;

//get the categories from the language files so they translate with changes in the language picker
const productCategoryData = values.subjectCategoryInfo;

let uploadFilesRef: any;

async function updateFormData(formData: FormData) {
    const info = formData;
    const response = await fetch("/api/creatorUpdatePost", {
        method: "POST",
        body: formData,
    });
    const data = await response.json();
    console.log("data", data);
    if (response.status === 200) {
        alert(data.message);
        location.reload();
    }
    return data;
}
interface Props {
    post: Post;
}

export const EditPost: Component<Props> = (props: Props) => {
    const [session, setSession] = createSignal<AuthSession | null>(null);
    const [formData, setFormData] = createSignal<FormData>();
    const [response] = createResource(formData, updateFormData);
    const [imageUrl, setImageUrl] = createSignal<Array<string>>([]);
    const [imageLength, setImageLength] = createSignal(0);
    //prettier-ignore
    const [mode, setMode] = createStore({theme: localStorage.getItem("theme"),});
    //prettier-ignore
    const [subjects, setSubjects] = createSignal<Array<{id: number; subject: string}>>([]);
    //prettier-ignore
    const [subjectPick, setSubjectPick] = createSignal<Array<number>>(props.post?.subjects!);
    //prettier-ignore
    const [grades, setGrades] = createSignal<Array<{id: number; grade: string}>>([]);
    const [gradePick, setGradePick] = createSignal<Array<number>>([]);
    //prettier-ignore
    const [resourceTypesPick, setResourceTypesPick] = createSignal<Array<number>>([]);
    //prettier-ignore
    const [resourceTypes, setResourceTypes] = createSignal<Array<{ id: number; type: string }>>([]);
    const [allRequirementsMet, setAllRequirementsMet] =
        createSignal<boolean>(false);
    const [price, setPrice] = createSignal<string>("");
    const [isFree, setIsFree] = createSignal<boolean>(false);
    const [subjectExpanded, setSubjectExpanded] = createSignal<boolean>(false);
    const [gradeExpanded, setGradeExpanded] = createSignal<boolean>(false);
    const [resourceExpanded, setResourceExpanded] =
        createSignal<boolean>(false);
    const [secular, setSecular] = createSignal<boolean>(false);
    const [draftStatus, setDraftStatus] = createSignal<boolean>(false);
    const [startDraftStatus, setStartDraftStatus] =
        createSignal<boolean>(false);

    onMount(async () => {
        console.log(props.post);

        const { data, error } = await supabase.auth.getSession();
        setSession(data.session);

        setIsFree(props.post?.price === 0);

        window.addEventListener("storage", (event) => {
            if (event.key === "theme") {
                setMode({ theme: event.newValue });
                mountTiny();
            }
        });

        setGradePick(props.post?.grades);
        setSubjectPick(props.post.subjects);
        setResourceTypesPick(props.post?.resource_types);
        setSecular(props.post.secular);
        setDraftStatus(props.post.draft_status);
        setStartDraftStatus(props.post.draft_status);

        if (props.post?.image_urls) {
            setImageUrl(props.post?.image_urls);
            // console.log(imageUrl())
        }
        //Image_urls is a single string of urls comma separated
        // if (props.post?.image_urls) {
        //   setImageUrl(props.post?.image_urls!);
        // }

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
                    }
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

    createEffect(() => {
        setImageLength(imageUrl().length);
        // console.log(imageLength());
    });

    createEffect(async () => {
        console.log("allRequirementsMet: ", allRequirementsMet());

        let title = document.getElementById("Title");

        if (
            title?.nodeValue !== "" &&
            subjectPick().length > 0 &&
            gradePick().length > 0 &&
            resourceTypesPick().length > 0 &&
            imageUrl().length > 0
        ) {
            setAllRequirementsMet(true);
        } else {
            setAllRequirementsMet(false);
        }
    });

    function saveAsDraft(e: Event) {
        e.preventDefault();
        e.stopPropagation();
        setDraftStatus(true);

        const button = e.currentTarget as HTMLFormElement;
        const form = button.closest("form") as HTMLFormElement;

        if (form) {
            form.requestSubmit();
        }
    }

    function listResourcePost(e: Event) {
        e.preventDefault();
        e.stopPropagation();

        const button = e.currentTarget as HTMLFormElement;
        const form = button.closest("form") as HTMLFormElement;

        if (form) {
            setDraftStatus(false);
            form.requestSubmit();
        }
    }

    async function submit(e: SubmitEvent) {
        e.preventDefault();

        const formData = new FormData(e.target as HTMLFormElement);
        formData.append("access_token", session()?.access_token!);
        formData.append("refresh_token", session()?.refresh_token!);
        formData.append("lang", lang);
        if (isFree()) {
            setPrice("0");
            formData.set("Price", price());
        } else {
            formData.set("Price", price());
        }
        formData.append("product_id", props.post?.product_id!);
        let tmpDiv = document.createElement("div");
        tmpDiv.innerHTML = formData.get("Content") as string;
        let description = tmpDiv.textContent || tmpDiv.innerText || "";
        formData.append("description", description);
        formData.append("draft_status", JSON.stringify(draftStatus()));

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
            formData.append("resource_url", "");
        }

        if (secular() !== null) {
            formData.append("secular", secular().toString());
        }

        if (props.post?.id! !== undefined) {
            formData.append("idSupabase", props.post!.id.toString());
        }
        setFormData(formData);
        console.log(formData);
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
        const target = e.target as HTMLInputElement;
        if (target.checked === true) {
            setSubjectPick([...subjectPick(), Number(target.value)]);
        } else if (target.checked === false) {
            if (subjectPick().includes(Number(target.value))) {
                setSubjectPick(
                    subjectPick().filter(
                        (value) => value !== Number(target.value)
                    )
                );
            }
        }
        // if (subjectPick().length > 0) {
        //     document
        //         .getElementById("isSubjectValid")
        //         ?.classList.remove("hidden");
        //     document.getElementById("subjectToolTip")?.classList.add("hidden");
        // } else if (subjectPick().length === 0) {
        //     document.getElementById("isSubjectValid")?.classList.add("hidden");
        //     document
        //         .getElementById("subjectToolTip")
        //         ?.classList.remove("hidden");
        // }
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
        const target = e.target as HTMLInputElement;
        if (target.checked === true) {
            setGradePick([...gradePick(), Number(target.value)]);
        } else if (target.checked === false) {
            if (gradePick().includes(Number(target.value))) {
                setGradePick(
                    gradePick().filter(
                        (value) => value !== Number(target.value)
                    )
                );
            }
        }
        // if (gradePick().length > 0) {
        //     document.getElementById("isGradeValid")?.classList.remove("hidden");
        //     document.getElementById("gradeToolTip")?.classList.add("hidden");
        // } else if (gradePick().length === 0) {
        //     document.getElementById("isGradeValid")?.classList.add("hidden");
        //     document.getElementById("gradeToolTip")?.classList.remove("hidden");
        // }
        // console.log(gradePick());
    }

    function setResourceTypesArray(e: Event) {
        const target = e.target as HTMLInputElement;
        if (target.checked === true) {
            setResourceTypesPick([
                ...resourceTypesPick(),
                Number(target.value),
            ]);
        } else if (target.checked === false) {
            if (resourceTypesPick().includes(Number(target.value))) {
                setResourceTypesPick(
                    resourceTypesPick().filter(
                        (value) => value !== Number(target.value)
                    )
                );
            }
        }
        // if (resourceTypesPick().length > 0) {
        //     document
        //         .getElementById("isResourceTypeValid")
        //         ?.classList.remove("hidden");
        //     document
        //         .getElementById("resourceTypesToolTip")
        //         ?.classList.add("hidden");
        // } else if (gradePick().length === 0) {
        //     document
        //         .getElementById("isResourceTypeValid")
        //         ?.classList.add("hidden");
        //     document
        //         .getElementById("resourceTypesToolTip")
        //         ?.classList.remove("hidden");
        // }
        // console.log(resourceTypesPick());
    }

    function mountTiny() {
        TinyComp({ id: "#Content", mode: mode.theme });
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

    function postButton() {
        if (startDraftStatus() === false) {
            return (
                <>
                    <button
                        id="post"
                        disabled={!allRequirementsMet()}
                        class={`text-2xl ${
                            allRequirementsMet()
                                ? "btn-primary"
                                : "btn-disabled"
                        }`}
                    >
                        {t("buttons.updateResource")}
                    </button>
                </>
            );
        } else if (startDraftStatus() === true) {
            return (
                <>
                    <button
                        id="post"
                        disabled={!allRequirementsMet()}
                        class={`text-2xl ${
                            allRequirementsMet()
                                ? "btn-primary"
                                : "btn-disabled"
                        }`}
                        onclick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            listResourcePost(e);
                        }}
                    >
                        {t("buttons.listResource")}
                    </button>
                </>
            );
        } else {
            return <></>;
        }
    }

    return (
        <div>
            <form onSubmit={submit}>
                <label for="Title" class="text-ptext1 dark:text-ptext1-DM">
                    {t("formLabels.title")}
                    <input
                        type="text"
                        id="Title"
                        name="Title"
                        value={props.post?.title}
                        class="mb-4 w-full rounded border border-inputBorder1 bg-background1 px-1 text-ptext1 focus:border-2 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM dark:focus:border-highlight1-DM"
                        required
                    />
                </label>

                <br />

                <label for="Content" class="text-ptext1 dark:text-ptext1-DM">
                    {t("menus.description")}
                    <textarea
                        id="Content"
                        name="Content"
                        class="w-full rounded border border-inputBorder1 bg-background1 px-1 text-ptext1 placeholder-shown:italic focus:border-2 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM  dark:focus:border-highlight1-DM "
                        placeholder={t("formLabels.enterPostContent")}
                        value={props.post?.content}
                        rows="10"
                        required
                        ref={mountTiny}
                    ></textarea>
                </label>

                <div class="my-4 flex w-full flex-col justify-center">
                    <div class="flex items-center">
                        <p>
                            {t("formLabels.images")} ({imageLength()}/5)
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

                                <span class="translate-x-1/8 invisible absolute m-4 mx-auto w-48 translate-y-2/3 rounded-md bg-background2 p-2 text-sm text-ptext2 transition-opacity peer-hover:visible dark:bg-background2-DM dark:text-ptext2-DM md:translate-x-1/4 md:translate-y-0">
                                    {t("toolTips.postImages")}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="w-full">
                        <PostImage
                            url={imageUrl()}
                            size={96}
                            onUpload={(e: Event, url: string) => {
                                setImageUrl([...imageUrl(), url]);
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
                                                (item) => item.id === subject
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
                            class="hidden max-h-28 grid-cols-2 overflow-y-auto rounded border border-inputBorder1 bg-background1 pt-2 text-ptext1 focus:border-2 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM dark:focus:border-highlight1-DM"
                        >
                            <For each={subjects()}>
                                {(subject) => (
                                    <div>
                                        <Show
                                            when={props.post?.subject!.includes(
                                                subject.subject
                                            )}
                                        >
                                            <label class="ml-2 block">
                                                <input
                                                    type="checkbox"
                                                    id={subject.id.toString()}
                                                    value={subject.id}
                                                    onchange={(e) =>
                                                        setSubjectArray(e)
                                                    }
                                                    checked
                                                />
                                                <span class="ml-2">
                                                    {subject.subject}
                                                </span>
                                            </label>
                                        </Show>
                                        <Show
                                            when={
                                                !props.post?.subject!.includes(
                                                    subject.subject
                                                )
                                            }
                                        >
                                            <label class="ml-2 block">
                                                <input
                                                    type="checkbox"
                                                    id={subject.id.toString()}
                                                    value={subject.id}
                                                    onchange={(e) =>
                                                        setSubjectArray(e)
                                                    }
                                                />
                                                <span class="ml-2">
                                                    {subject.subject}
                                                </span>
                                            </label>
                                        </Show>
                                    </div>
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
                                            .filter((item) => item.id === grade)
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
                            class="hidden max-h-28 grid-cols-2 overflow-y-auto rounded border border-inputBorder1 bg-background1 pt-2 text-ptext1 focus:border-2 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM dark:focus:border-highlight1-DM"
                        >
                            <For each={grades()}>
                                {(grade) => (
                                    <label class="ml-2 block">
                                        <Show
                                            when={props.post?.grade!.includes(
                                                grade.grade
                                            )}
                                        >
                                            <input
                                                checked
                                                type="checkbox"
                                                id={grade.id.toString()}
                                                value={grade.id}
                                                onchange={(e) =>
                                                    setGradeArray(e)
                                                }
                                            />
                                            <span class="ml-2">
                                                {grade.grade}
                                            </span>
                                        </Show>
                                        <Show
                                            when={
                                                !props.post?.grade!.includes(
                                                    grade.grade
                                                )
                                            }
                                        >
                                            <input
                                                type="checkbox"
                                                id={grade.id.toString()}
                                                value={grade.id}
                                                onchange={(e) =>
                                                    setGradeArray(e)
                                                }
                                            />
                                            <span class="ml-2">
                                                {grade.grade}
                                            </span>
                                        </Show>
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
                                                            item.id ===
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
                            class="hidden max-h-28 grid-cols-2 overflow-y-auto rounded border border-inputBorder1 bg-background1 pt-2 text-ptext1 focus:border-2 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM dark:focus:border-highlight1-DM"
                        >
                            <For each={resourceTypes()}>
                                {(type) => (
                                    <label class="ml-2 block">
                                        <Show
                                            when={props.post?.resource_types!.includes(
                                                type.id
                                            )}
                                        >
                                            <input
                                                type="checkbox"
                                                id={type.id.toString()}
                                                value={type.id}
                                                onchange={(e) =>
                                                    setResourceTypesArray(e)
                                                }
                                                checked
                                            />
                                            <span class="ml-2">
                                                {type.type}
                                            </span>
                                        </Show>
                                        <Show
                                            when={
                                                !props.post?.resource_types!.includes(
                                                    type.id
                                                )
                                            }
                                        >
                                            <input
                                                type="checkbox"
                                                id={type.id.toString()}
                                                value={type.id}
                                                onchange={(e) =>
                                                    setResourceTypesArray(e)
                                                }
                                            />
                                            <span class="ml-2">
                                                {type.type}
                                            </span>
                                        </Show>
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
                    </div>
                </div>

                {/* Secular */}
                <div class="mt-2 flex items-center justify-start">
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

                {/* Price Implementation */}
                {/* <div class="justify-evenly mt-6 flex flex-col ">
                    <div class="mt-2 flex justify-between">
                        <p>{t("formLabels.isResourceFree")}?</p>
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
                                <p>{t("formLabels.pricePost")}</p>

                                <div class="flex items-center">
                                    <input
                                        required
                                        type="number"
                                        min={1}
                                        step={0.01}
                                        class="flex w-full rounded border border-inputBorder1 bg-background1 px-1 text-ptext1 focus:border-2 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM  dark:focus:border-highlight1-DM "
                                        id="Price"
                                        value={props.post?.price}
                                        name="Price"
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

                                        <span class="invisible absolute m-4 mx-auto w-48 -translate-x-full -translate-y-2/3 rounded-md bg-background2 p-2 text-sm text-ptext2 transition-opacity peer-hover:visible dark:bg-background2-DM dark:text-ptext2-DM md:translate-x-1/4 md:translate-y-0">
                                            {t("toolTips.price")}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Show>
                </div> */}

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
                    {postButton()}
                </div>
            </form>
        </div>
    );
};
