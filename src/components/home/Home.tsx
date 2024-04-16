import type { Component } from "solid-js";
import { createEffect, createSignal } from "solid-js";
import { HomeCard } from "@components/home/HomeCard";
import supabase from "../../lib/supabaseClient";
import { ui } from "../../i18n/ui";
import type { uiObject } from "../../i18n/uiType";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";
import stripe from "@lib/stripe"; 

const lang = getLangFromUrl(new URL(window.location.href));
const values = ui[lang] as unknown as uiObject
const productCategories = values.productCategoryInfo.categories

interface ProviderPost {
    user_id: string;
    content: string;
    id: number;
    //TODO: update this to allow a list of Subjects
    subject: string;
    title: string;
    seller_name: string;
    seller_img: string;
    major_municipality: string;
    image_urls: string;
    price: number;
    price_id: string;
    quantity: number;
    product_id: string;
}

interface Props {
    id: string | undefined;
}

export const Home: Component = () => {
    const [popularPosts, setPopularPosts] = createSignal<Array<ProviderPost>>([]);
    const [newPosts, setNewPosts] = createSignal<Array<ProviderPost>>([])

    createEffect(async () => {
        const { data, error } = await supabase
          .from("sellerposts")
          .select("*")
          .limit(5)
        if (!data) {
          alert("No posts available.");
        }
        if (error) {
          console.log("supabase error: " + error.message);
        } else {
          const newItems = await Promise.all(
          data?.map(async (item) => {
            productCategories.forEach((productCategories) => {
              if (item.product_subject.toString() === productCategories.id) {
                item.subject = productCategories.name;
              }
            });
            delete item.product_subject;
    
            if (item.price_id !== null) {
              const priceData = await stripe.prices.retrieve(item.price_id);
              item.price = priceData.unit_amount! / 100;
            }
            return item;
          }))
          ;
          setPopularPosts(data);
        }        
    });

    createEffect(async() => {
        const { data, error } = await supabase
            .from("sellerposts")
            .select("*")
            .order("id", { ascending: false })
            .limit(5)
        
        if(!data) {
            alert("No posts available");
        }

        if(error) {
            console.error("supabase error: " + error.message);
        } else {
            const popItems = await Promise.all(
                data?.map(async(item) => {
                    productCategories.forEach((productCategories) => {
                        if(item.product_subject.toString() === productCategories.id) {
                            item.subject = productCategories.name;
                        }
                    });
                    delete item.product_subject;

                    if(item.price_id !== null) {
                        const priceData = await stripe.prices.retrieve(item.price_id);
                        item.price = priceData.unit_amount! / 100;
                    }
                    return item;
                }))
            setNewPosts(data);
        }
    })
    
    return (
        <div class=" border-2 border-orange-500">
            <div id="top-sticky-filter">

            </div>

            <div id="header-image">

            </div>

            <div id="popular-resources" class="border-2 border-blue-500 w-full mb-1">
                <h3 class="text-center text-lg py-1">Popular Resources</h3>
                <HomeCard posts={ popularPosts() }/>
            </div>

            <div id="home-subject-filter">

            </div>

            <div id="home-image-1">

            </div>

            <div id="new-resources">
                <h3 class="text-center text-lg py-1">New Resources</h3>
                <HomeCard posts={ newPosts() }/>
            </div>

            <div id="home-grade-filter">

            </div>
        </div>
    )
}