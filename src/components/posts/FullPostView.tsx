import type { Component } from "solid-js";
import type { Post } from "@lib/types";
import { createSignal, createEffect, Show } from "solid-js";
import supabase from "../../lib/supabaseClient";
import { DeletePostButton } from "../posts/DeletePostButton";
import { ui } from "../../i18n/ui";
import type { uiObject } from "../../i18n/uiType";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";
import SocialModal from "./SocialModal";
import { AddToCart } from "@components/common/cart/AddToCartButton";
import { Quantity } from "@components/common/cart/Quantity";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

//get the categories from the language files so they translate with changes in the language picker
const values = ui[lang] as uiObject;
const productCategories = values.subjectCategoryInfo.subjects;

interface Props {
  id: string | undefined;
}

export const ViewFullPost: Component<Props> = (props) => {
  const test1 = ["../../../src/assets/services.png"]
  const test2 = ["../../../src/assets/services.png", "../../../src/assets/question.svg", "../../../src/assets/servicesDM.png", "../../../src/assets/userImagePlaceholder.svg", "../../../src/assets/attention-mark.svg"]
  
  const [post, setPost] = createSignal<Post>();
  const [postImages, setPostImages] = createSignal<string[]>([]);
  const [testImages, setTestImages] = createSignal<string[]>([]);
  const [quantity, setQuantity] = createSignal<number>(1);

  setTestImages(test2);

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

  function imageClick(e) {
    e.preventDefault();

    let currImageID = e.currentTarget.id;
    let currImage = document.getElementById(currImageID);
    let allImages = document.getElementsByClassName("imageLink");
    let mainImage = document.getElementById("main-image");
    let arrayIndex = Number(currImageID.slice(-1));

    if(!currImage.classList.contains("border-b-2")) {
        Array.from(allImages).forEach(function(image) {
            image.classList.remove("border-b-2");
            image.classList.remove("border-green-500");
        })
        
        currImage.classList.add("border-b-2");
        currImage.classList.add("border-green-500");
    };

    mainImage.setAttribute('src', testImages()[arrayIndex])
  }

  return (
    <div class="flex">
      <div id="image-title-details-cart-div" class="flex">
        <div id="images-div" class="flex flex-col items-center justify-center w-1/2 mr-1">
          <Show when={ testImages().length > 0 }>
            <Show when={ testImages().length === 1}>
                <div class="border border-gray-400 flex justify-center items-center rounded h-[400px] w-[400px]">
                    <img 
                        src={ testImages()[0]}
                        id="one-image"
                        class="rounded flex justify-center items-center dark:bg-background1"
                        alt={`${t("postLabels.image")}`}
                    />
                    
                </div>
            </Show>

            <Show when={ testImages().length > 1 }>
              <div class="w-full flex flex-col justify-start">
                <div class="flex justify-center items-center border border-gray-400 rounded h-[400px] max-w-[3400px]">
                    <img 
                        src={ testImages()[0]}
                        id="main-image"
                        class="rounded dark:bg-background1"
                        alt={`${t("postLabels.image")}`}
                    />
                    
                </div>

                  <div class="flex justify-between my-4">
                    { testImages().map((image: string, index: number) => (
                      <div class="flex justify-center items-center w-1/6 h-16">
                        { index === 0 ? (
                          <div 
                          // id={ index.toString() }
                          id={`img${ index.toString() }`}
                          class="imageLink border-b-2 border-green-500 h-16 flex justify-center items-center"
                          onClick={ imageClick }
                          >
                              <img 
                              src={ image } 
                              class="rounded mb-2"
                              alt={ `${t("postLabels.image")} ${ index + 2 }`}
                              />
                          </div>
                        ) : (
                          <div 
                          // id={ index.toString() }
                          id={`img${ index.toString() }`}
                          class="imageLink flex justify-center items-center h-16"
                          onClick={ imageClick }
                          >
                              <img 
                              src={ image } 
                              class="rounded mb-2 dark:bg-background1"
                              alt={ `${t("postLabels.image")} ${ index + 2 }`}
                              />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
            </Show>
          </Show>
        </div>

        <div id="details-cart-div" class="border-2 border-red-400 w-1/2 ml-1">
          <div id="title-div">
              <div>
                <h3 class="font-bold text-2xl">{ post()?.title }</h3>
              </div>
          </div>

          <div id="ratings-div" class="flex flex-col border-2 border-yellow-500 my-1">
            <div id="ratings-stars-div" class="flex border-2 border-orange-400 w-fit mr-2">
                <svg fill="none" width="20px" height="20px" viewBox="0 0 32 32" class="fill-icon1 dark:fill-icon1-DM">
                    <path d="M 30.335938 12.546875 L 20.164063 11.472656 L 16 2.132813 L 11.835938 11.472656 L 1.664063 12.546875 L 9.261719 19.394531 L 7.140625 29.398438 L 16 24.289063 L 24.859375 29.398438 L 22.738281 19.394531 Z"/>
                </svg>

                <svg fill="none" width="20px" height="20px" viewBox="0 0 32 32" class="fill-icon1 dark:fill-icon1-DM">
                    <path d="M 30.335938 12.546875 L 20.164063 11.472656 L 16 2.132813 L 11.835938 11.472656 L 1.664063 12.546875 L 9.261719 19.394531 L 7.140625 29.398438 L 16 24.289063 L 24.859375 29.398438 L 22.738281 19.394531 Z"/>
                </svg>

                <svg fill="none" width="20px" height="20px" viewBox="0 0 32 32" class="fill-icon1 dark:fill-icon1-DM">
                    <path d="M 30.335938 12.546875 L 20.164063 11.472656 L 16 2.132813 L 11.835938 11.472656 L 1.664063 12.546875 L 9.261719 19.394531 L 7.140625 29.398438 L 16 24.289063 L 24.859375 29.398438 L 22.738281 19.394531 Z"/>
                </svg>

                <svg fill="none" width="20px" height="20px" viewBox="0 0 32 32" class="fill-icon1 dark:fill-icon1-DM">
                    <path d="M 30.335938 12.546875 L 20.164063 11.472656 L 16 2.132813 L 11.835938 11.472656 L 1.664063 12.546875 L 9.261719 19.394531 L 7.140625 29.398438 L 16 24.289063 L 24.859375 29.398438 L 22.738281 19.394531 Z"/>
                </svg>

                <svg fill="none" width="20px" height="20px" viewBox="0 0 32 32" class="fill-icon1 dark:fill-icon1-DM">
                    <path d="M 30.335938 12.546875 L 20.164063 11.472656 L 16 2.132813 L 11.835938 11.472656 L 1.664063 12.546875 L 9.261719 19.394531 L 7.140625 29.398438 L 16 24.289063 L 24.859375 29.398438 L 22.738281 19.394531 Z"/>
                </svg>
            </div>

            {/* TODO: fix hard coding */}
            <div id="ratings-text-div" class="flex">
              <p class="font-bold">4.9</p>
              <p>(30.3K ratings)</p>
            </div>
          </div>

          <div id="creator-followers-div" class="flex w-full items-center border-2 border-purple-400">
            <div id="creator-img-div" class="flex justify-center w-16 h-16 items-center bg-gray-300 rounded-full">
                <a href={`/${ lang }/provider/${ post()?.seller_id }`}>
                    <svg fill="none" width="40px" height="40px" viewBox="0 0 32 32" class="fill-icon1 dark:fill-icon1-DM">
                        <path d="M16 15.503A5.041 5.041 0 1 0 16 5.42a5.041 5.041 0 0 0 0 10.083zm0 2.215c-6.703 0-11 3.699-11 5.5v3.363h22v-3.363c0-2.178-4.068-5.5-11-5.5z"/>
                    </svg>
                </a>
            </div>

            <div id="creator-text-div" class="ml-1">
              <div>
                  <a href={`/${ lang }/provider/${ post()?.seller_id }`}>
                      <p class="font-bold">{ post()?.seller_name }</p>
                  </a>
              </div>

              <div class="flex items-center">
                <div>
                    117.1K Followers
                </div>
              </div>
            </div>
          </div>

          <div id="follower-div" class="flex border-2 border-blue-400">
            <button 
              class="flex items-center justify-center bg-btn1 dark:bg-btn1-DM rounded-full px-4 my-2 text-ptext2 dark:ptext-DM"
              onClick={() => (alert(t("messages.comingSoon")))}
            >
              <svg width="18px" height="20px" viewBox="0 0 24 24" fill="none" class="mx-0.5">
                  <circle cx="9" cy="7" r="4" stroke="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="stroke-icon2 dark:stroke-icon2-DM"/>
                  <path d="M2 21V17C2 15.8954 2.89543 15 4 15H14C15.1046 15 16 15.8954 16 17V21" stroke="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="stroke-icon2 dark:stroke-icon2-DM"/>
                  <path d="M19 8V14M16 11H22" stroke="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="stroke-icon2 dark:stroke-icon2-DM"/>
              </svg>
              <p class="mx-0.5 text-sm">{t("buttons.follow")}</p>
            </button>

            <button class="hidden items-center justify-center bg-btn1 dark:bg-btn1-DM rounded-full px-4 text-ptext2 dark:ptext-DM mx-4">
                <svg width="18px" height="20px" viewBox="0 0 24 24" fill="none" class="mx-0.5">
                    <circle cx="9" cy="7" r="4" stroke="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="stroke-icon2 dark:stroke-icon2-DM"/>
                    <path d="M2 21V17C2 15.8954 2.89543 15 4 15H14C15.1046 15 16 15.8954 16 17V21" stroke="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="stroke-icon2 dark:stroke-icon2-DM"/>
                </svg>
                {/* TODO: language file updated in mobile version */}
                <p class="mx-0.5 text-sm">{t("buttons.following")}</p>
            </button>
          </div>
        </div>

        <div id="add-cart-div">

        </div>

        

      </div>

      <div id="resource-info-div">

    </div>









  
    </div>
  );
};
