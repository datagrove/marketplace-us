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
  console.log(response, "response");
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
  const [postImages, setPostImages] = createSignal<Array<string>>([]);
  //prettier-ignore
  const [mode, setMode] = createStore({ theme: localStorage.getItem("theme"), });
  //prettier-ignore
  const [subjects, setSubjects] = createSignal<Array<{ id: number; subject: string }>>([]);
  //prettier-ignore
  const [subjectPick, setSubjectPick] = createSignal<Array<string>>(props.post?.product_subject!);
  //prettier-ignore
  const [grades, setGrades] = createSignal<Array<{ id: number; grade: string }>>([]);
  const [gradePick, setGradePick] = createSignal<Array<string>>([]);
  //prettier-ignore
  const [resourceTypesPick, setResourceTypesPick] = createSignal<Array<string>>([]);
  //prettier-ignore
  const [resourceTypes, setResourceTypes] = createSignal<Array<{ id: number; type: string }>>([]);
  const [uploadFinished, setUploadFinished] = createSignal(false);
  // const [resourceURL, setResourceURL] = createSignal<Array<string>>([]);
  const [price, setPrice] = createSignal<string>("");
  const [isFree, setIsFree] = createSignal<boolean>(false);
  const [secular, setSecular] = createSignal<boolean>(false)

  onMount(async () => {
    console.log(props.post)

    const { data, error } = await supabase.auth.getSession();
    setSession(data.session);

    setIsFree(props.post?.price === 0);

    window.addEventListener("storage", (event) => {
      if (event.key === "theme") {
        setMode({ theme: event.newValue });
        mountTiny();
      }
    });

    setGradePick(props.post?.post_grade!);
    setSubjectPick(props.post.product_subject);
    setResourceTypesPick(props.post?.resource_types!);
    setSecular(props.post.secular)

    if (props.post?.image_urls) {
      setImageUrl(props.post?.image_urls.split(","));
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
  })

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

    if (secular() !== null) {
      formData.append("secular", secular().toString())
    }

    if (imageUrl() !== null) {
      formData.append("image_url", imageUrl()!.toString());
    }

    if (imageUrl() !== null) {
      formData.append("resource_url", "");
    }
    if (props.post?.id! !== undefined) {
      formData.append("idSupabase", props.post!.id.toString());
    }
    setFormData(formData);
    console.log(formData);
  }

  let expanded = false;
  function subjectCheckboxes() {
    let checkboxes = document.getElementById("subjectCheckboxes");
    if (!expanded) {
      checkboxes?.classList.remove("hidden");
      checkboxes?.classList.add("md:grid");
      expanded = true;
    } else {
      checkboxes?.classList.remove("block");
      checkboxes?.classList.add("hidden");
      expanded = false;
    }
  }

  function gradeCheckboxes() {
    let checkboxes = document.getElementById("gradeCheckboxes");
    if (!expanded) {
      checkboxes?.classList.remove("hidden");
      checkboxes?.classList.add("md:grid");
      expanded = true;
    } else {
      checkboxes?.classList.remove("block");
      checkboxes?.classList.add("hidden");
      expanded = false;
    }
  }
  function resourceTypesCheckboxes() {
    let checkboxes = document.getElementById("resourceTypesCheckboxes");
    if (!expanded) {
      checkboxes?.classList.remove("hidden");
      checkboxes?.classList.add("md:grid");
      expanded = true;
    } else {
      checkboxes?.classList.remove("block");
      checkboxes?.classList.add("hidden");
      expanded = false;
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
    // console.log(gradePick());
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
    // console.log(gradePick());
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
        .getElementById("resourceTypesToolTip")
        ?.classList.add("hidden");
    } else if (gradePick().length === 0) {
      document
        .getElementById("isResourceTypeValid")
        ?.classList.add("hidden");
      document
        .getElementById("resourceTypesToolTip")
        ?.classList.remove("hidden");
    }
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
        <div class="mt-2 flex flex-wrap justify-start">
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
              class="relative"
              onClick={() => subjectCheckboxes()}
            >
              <p
                id="chooseSubject"
                class="bg-background after:height-[20px] after:width-[20px] w-full rounded border border-inputBorder1 px-1 text-ptext1 after:absolute after:-top-0.5 after:right-2 after:rotate-180 after:text-inputBorder1 after:content-['_^'] focus:border-2 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM after:dark:text-inputBorder1-DM dark:focus:border-highlight1-DM"
              >
                {t("formLabels.chooseSubject")}
              </p>

              <div class="absolute"></div>
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
                          value={subject.id.toString()}
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
                          value={subject.id.toString()}
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
        <div class="mt-2 flex flex-wrap justify-start">
          <label
            for="grade"
            class="hidden w-4/12 text-ptext1 dark:text-ptext1-DM"
          >
            <span class="text-alert1 dark:text-alert1-DM">* </span>
            {t("formLabels.grades")}:
          </label>

          {/* Creates a list of checkboxes that drop down to multiple select */}
          <div class="flex-grow">
            <div class="relative" onClick={() => gradeCheckboxes()}>
              <p
                id="chooseGrade"
                class="bg-background after:height-[20px] after:width-[20px] w-full rounded border border-inputBorder1 px-1 text-ptext1 after:absolute after:-top-0.5 after:right-2 after:rotate-180 after:text-inputBorder1 after:content-['_^'] focus:border-2 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM after:dark:text-inputBorder1-DM dark:focus:border-highlight1-DM"
              >
                {t("formLabels.chooseGrade")}
              </p>

              <div class="absolute"></div>
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
                        value={grade.id.toString()}
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
                        value={grade.id.toString()}
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
        <div class="mt-2 flex flex-wrap justify-start">
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
              class="relative"
              onClick={() => resourceTypesCheckboxes()}
            >
              <p
                id="chooseResourceType"
                class="bg-background after:height-[20px] after:width-[20px] w-full rounded border border-inputBorder1 px-1 text-ptext1 after:absolute after:-top-0.5 after:right-2 after:rotate-180 after:text-inputBorder1 after:content-['_^'] focus:border-2 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM after:dark:text-inputBorder1-DM dark:focus:border-highlight1-DM"
              >
                {t("formLabels.chooseResourceTypes")}
              </p>

              <div class="absolute"></div>
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
                        type.id.toString()
                      )}
                    >
                      <input
                        type="checkbox"
                        id={type.id.toString()}
                        value={type.id.toString()}
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
                          type.id.toString()
                        )
                      }
                    >
                      <input
                        type="checkbox"
                        id={type.id.toString()}
                        value={type.id.toString()}
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

        {/* Secular */}
        <div class="justify-evenly mt-6 flex flex-col ">
          <div class="mt-2 flex justify-between">
            <p>
              <span class="text-alert1">* </span>
              {t("formLabels.secular")}?
            </p>
            <div>
              <label class="ml-4">
                {t("formLabels.yes")}
              </label>
              <input
                type="checkbox"
                id="secularCheckbox"
                class="ml-1"
                checked={secular()}
                onChange={() => setSecular(!secular())}
              />
            </div>
          </div>
        </div>

        {/* Price Implementation */}
        <div class="justfify-evenly mt-6 flex flex-col ">
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
        </div>

        <br />
        <div class="flex justify-center">
          <button
            id="post"
            // disabled={!uploadFinished()}
            class={`text-2xl btn-primary mb-4`}
          >
            {t("buttons.updateResource")}
          </button>
        </div>
      </form>
    </div>
  );
};
