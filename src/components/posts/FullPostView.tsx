import type { Component } from "solid-js";
import type { Post } from "@lib/types";
import { createSignal, createEffect, Show } from "solid-js";
import supabase from "../../lib/supabaseClient";
import { DeletePostButton } from "../posts/DeletePostButton";
import { ui } from "../../i18n/ui";
import type { uiObject } from "../../i18n/uiType";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";
import SocialModal from "./SocialModal";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

//get the categories from the language files so they translate with changes in the language picker
const values = ui[lang] as uiObject;
const productCategories = values.subjectCategoryInfo.subjects;

interface Props {
  id: string | undefined;
}

export const ViewFullPost: Component<Props> = (props) => {
  const [post, setPost] = createSignal<Post>();
  const [postImages, setPostImages] = createSignal<string[]>([]);

  createEffect(() => {
    if (props.id === undefined) {
      location.href = `/${lang}/404`;
    } else if (props.id) {
      fetchPost(+props.id);
    }
  });

  const fetchPost = async (id: number) => {
    try {
      const { data, error } = await supabase
        .from("sellerposts")
        .select("*")
        .eq("id", id);

      if (error) {
        console.log(error);
      } else if (data[0] === undefined) {
        alert(t("messages.noPost"));
        location.href = `/${lang}/services`;
      } else {
        data?.map(async (item) => {
            item.subject = [];
            productCategories.forEach((productCategories) => {
                item.product_subject.map((productSubject: string) => {
                    if (productSubject === productCategories.id) {
                        item.subject.push(productCategories.name);
                        console.log(productCategories.name);
                    }
                });
            });
            delete item.product_subject;

            const { data: gradeData, error: gradeError } = await supabase
            .from("grade_level")
            .select("*");

          if (gradeError) {
            console.log("supabase error: " + gradeError.message);
          } else {
            item.grade = [];
            gradeData.forEach((databaseGrade) => {
              item.post_grade.map((itemGrade: string) => {
                if (itemGrade === databaseGrade.id.toString()) {
                  item.grade.push(databaseGrade.grade);
                }
              });
            });
          }
        });
        setPost(data[0]);
        console.log(post());
      }
    } catch (error) {
      console.log(error);
    }
  };

  createEffect(async () => {
    if (post() !== undefined) {
      if (post()?.image_urls === undefined || post()?.image_urls === null) {
      } else {
        await downloadImages(post()?.image_urls!);
      }
    }
  });

  const downloadImages = async (image_Urls: string) => {
    try {
      const imageUrls = image_Urls.split(",");
      imageUrls.forEach(async (imageUrl: string) => {
        const { data, error } = await supabase.storage
          .from("post.image")
          .download(imageUrl);
        if (error) {
          throw error;
        }
        const url = URL.createObjectURL(data);
        setPostImages([...postImages(), url]);
      });
    } catch (error) {
      console.log(error);
    }
  };

  let slideIndex = 1;
  showSlide(slideIndex);

  function moveSlide(n: number) {
    showSlide((slideIndex += n));
  }

  function currentSlide(n: number) {
    showSlide((slideIndex = n));
  }

  function showSlide(n: number) {
    let i;
    const slides = document.getElementsByClassName("slide");
    // console.log(slides)
    const dots = document.getElementsByClassName("dot");

    if (n > slides.length) {
      slideIndex = 1;
    }
    if (n < 1) {
      slideIndex = slides.length;
    }

    for (i = 0; i < slides.length; i++) {
      slides[i].classList.add("hidden");
    }

    for (i = 0; i < dots.length; i++) {
      dots[i].classList.remove(`bg-white`);
      dots[i].classList.remove(`dark:bg-gray-600`);
      dots[i].classList.add(`bg-slate-300`);
      dots[i].classList.add(`dark:bg-gray-800`);
    }

    //show the active slide
    if (slides.length > 0) {
      slides[slideIndex - 1].classList.remove("hidden");
    }

    //show the active dot
    if (dots.length > 0) {
      dots[slideIndex - 1].classList.remove(`bg-slate-300`);
      dots[slideIndex - 1].classList.remove(`dark:bg-gray-800`);
      dots[slideIndex - 1].classList.add(`bg-white`);
      dots[slideIndex - 1].classList.add(`dark:bg-gray-600`);
    }
  }

  const twitterUrl =
    "https://twitter.com/intent/tweet?text=Check%20this%20out%20!";
  const facebookUrl = "https://www.facebook.com/sharer/sharer.php?u=";
  const whatsappUrl = "https://wa.me/?text=";
  const linkTarget = "_top";
  const windowOptions = "menubar=yes,status=no,height=300,width=600";

  function extractTitleText() {
    return document.querySelector("h2")?.innerText;
  }

  function extractAnchorLink() {
    return document.querySelector("a")?.href;
  }

  function extractWindowLink() {
    const currLink = window.location.href;
    return currLink;
  }

  function openTwitterWindow(text: any, link: any) {
    const twitterQuery = `${text} ${link}`;
    return window.open(
      `${twitterUrl} ${twitterQuery}&`,
      linkTarget,
      windowOptions
    );
  }

  function registerShareButton() {
    extractWindowLink();
    const text = extractTitleText();
    const link = extractWindowLink();
    const twitterButton = document.querySelector("#button--twitter");
    twitterButton?.addEventListener("click", () =>
      openTwitterWindow(text, link)
    );
  }

  function openFacebookWindow(text: any, link: any) {
    const currPage = extractWindowLink();
    const testLink =
      "https://www.facebook.com/sharer/sharer.php?u=" +
      encodeURIComponent(currPage);
    window.open(
      "https://www.facebook.com/sharer/sharer.php?u=" +
        encodeURIComponent(currPage) +
        "&t=" +
        text,
      "",
      "menubar=yes,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600"
    );
    console.log("TestLink: ", testLink);
    // return false;
  }

  function registerFacebookButton() {
    extractWindowLink();
    const text = extractTitleText();
    const link = extractWindowLink();
    const facebookButton = document.querySelector("#button--facebook");
    facebookButton?.addEventListener("click", () =>
      openFacebookWindow(text, link)
    );
  }

  function openWhatsappWindow(text: any, link: any) {
    const currPage = extractWindowLink();
    const testLink =
      whatsappUrl +
      "Check%20out%20this%20awesome%20service%20on%20TodoServis! ";
    window.open(
      testLink + encodeURIComponent(currPage),
      "menubar=yes,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600"
    );
  }

  function registerWhatsAppButton() {
    const text = extractTitleText();
    const link = extractWindowLink();
    const whatsAppButton = document.querySelector("#button--whatsapp");
    whatsAppButton?.addEventListener("click", () =>
      openWhatsappWindow(text, link)
    );
  }

  return (
    <div class="flex">
      <div class="w-[98%]">
        <h2 class="pb-4 text-xl font-bold text-ptext1 dark:text-ptext1-DM">
          {post()?.title}
        </h2>

        {/* <SocialModal id={ ost.id } title={ post.title } image_urls={ post.image_urls }/> */}

        <Show when={postImages().length > 0}>
          <div class="relative w-full">
            <div class="overflow-hidden relative h-56 rounded-lg md:h-96">
              <div class="slide">
                <img
                  src={postImages()[0]}
                  class="block object-contain absolute top-1/2 left-1/2 h-56 -translate-x-1/2 -translate-y-1/2 md:h-96"
                  alt={`${t("postLabels.image")} 1`}
                />
              </div>
              <Show when={postImages().length > 1}>
                {postImages()
                  .slice(1)
                  .map((image: string, index: number) => (
                    <div class="hidden slide">
                      <img
                        src={image}
                        class="block object-contain absolute top-1/2 left-1/2 h-56 -translate-x-1/2 -translate-y-1/2 md:h-96"
                        alt={`${t("postLabels.image")} ${index + 2}`}
                      />
                    </div>
                  ))}
              </Show>
            </div>
            <Show when={postImages().length > 1}>
              <div class="flex absolute bottom-5 left-1/2 z-30 space-x-3 -translate-x-1/2">
                <button
                  type="button"
                  class="w-3 h-3 rounded-full cursor-pointer dot bg-background1 dark:bg-background1-DM"
                  aria-label={`${t("postLabels.slide")} 1`}
                  onClick={() => currentSlide(1)}
                ></button>
                {postImages()
                  .slice(1)
                  .map((image: string, index: number) => (
                    <button
                      type="button"
                      class="w-3 h-3 rounded-full cursor-pointer dot bg-background1 dark:bg-background1-DM"
                      aria-label={`${t("postLabels.slide")} ${index + 1}`}
                      onClick={() => currentSlide(index + 2)}
                    ></button>
                  ))}
              </div>
              <button
                type="button"
                class="flex absolute top-0 left-0 z-30 justify-center items-center px-4 h-full cursor-pointer focus:outline-none group"
                onclick={() => moveSlide(-1)}
              >
                <span class="inline-flex justify-center items-center w-10 h-10 rounded-full group-focus:ring-4 group-focus:ring-white group-focus:outline-none bg-white/30 dark:bg-white/50 dark:group-hover:bg-gray-800/60 dark:group-focus:ring-gray-800/70 group-hover:bg-white/50">
                  <svg
                    class="w-4 h-4 text-[#4A4A4A] dark:text-gray-800"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 1 1 5l4 4"
                    />
                  </svg>
                  <span class="sr-only">{t("buttons.previous")}</span>
                </span>
              </button>
              <button
                type="button"
                class="flex absolute top-0 right-0 z-30 justify-center items-center px-4 h-full cursor-pointer focus:outline-none group"
                onclick={() => moveSlide(1)}
              >
                <span class="inline-flex justify-center items-center w-10 h-10 rounded-full group-focus:ring-4 group-focus:ring-white group-focus:outline-none bg-white/30 dark:bg-white/50 dark:group-hover:bg-gray-800/60 dark:group-focus:ring-gray-800/70 group-hover:bg-white/50">
                  <svg
                    class="w-4 h-4 text-[#4A4A4A] dark:text-gray-800"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
                  <span class="sr-only">{t("buttons.next")}</span>
                </span>
              </button>
            </Show>
          </div>
        </Show>
        <p class="my-1">
          <span class="font-bold">{t("postLabels.provider")}</span>
          <a
            href={`/${lang}/provider/${post()?.seller_id}`}
            class="text-link1 dark:text-link1-DM dark:hover:bg-link1Hov-DM hover:text-link1Hov"
          >
            {post()?.seller_name}
          </a>
        </p>
        {/* <p class="my-1">
                    <span class="font-bold">{t("postLabels.location")}</span>
                    {post()?.major_municipality}/{post()?.minor_municipality}/
                    {post()?.governing_district}
                </p> */}
        <p class="my-1">
          <span class="font-bold">{t("postLabels.categories")}</span>
          {post()?.subject}
        </p>
        <div
          class="my-10 prose dark:prose-invert"
          id="post-content"
          innerHTML={post()?.content}
        ></div>
        <div class="mt-4">
          <a href={`mailto:${post()?.email}`} class="btn-primary">
            {t("buttons.contact")}
          </a>
        </div>
        <div class="flex justify-center mt-4">
          <DeletePostButton
            id={+props.id!}
            userId={post()?.user_id !== undefined ? post()!.user_id : ""}
            postImage={post()?.image_urls}
          />
        </div>
      </div>

      <div class="">
        <SocialModal
          post={post()!}
        />
      </div>
    </div>
  );
};
