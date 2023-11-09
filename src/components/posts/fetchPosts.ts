import { supabase } from '../../lib/supabaseClient';
import { ui } from '../../i18n/ui';
import type { uiObject } from '../../i18n/uiType';
import { getLangFromUrl, useTranslations } from "../../i18n/utils";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

// one giant filter function that includes the logic for all combinations 
export async function fetchFilteredPosts(categoryFilters: Array<number>, locationFilters: Array<string>, minorLocationFilters: Array<string>, governingLocationFilters: Array<string>, searchString: string) {
    try {
            let query = supabase.from("providerposts").select("*");
            if(categoryFilters.length !== 0) {    
                query = query.in('service_category', categoryFilters);
            }
            if(locationFilters.length !== 0) {
                query = query.in('major_municipality', locationFilters);
            }
            if(minorLocationFilters.length !== 0) {
                query = query.in('minor_municipality', minorLocationFilters);
            }
            if(governingLocationFilters.length !== 0) {
                query = query.in('governing_district', governingLocationFilters);
            }
            if(searchString.length !== 0) {
                query = query.textSearch('title_content', searchString);
            }

            try {
                const { data: posts, error } = await query
                if(error) {
                    console.log("supabase error: " + error.message);
                } else {
                    return posts;
                }
            } catch (e) {
                console.error(e);
            }
         
    } catch(e) { 
        console.error(e)
    }
} 

export async function fetchAllPosts() {
    try {
        const { data: allPosts, error } = await supabase.from("providerposts").select("*")

        if(error) {
            console.log("supabase error: " + error.message);
        } else {
            //     await allPosts.map(post => {
            //         // console.log("service_category: ", post.service_category)
            //         // post.service_category = post.service_category.toString()
            //     switch(post.service_category) {
            //         case 1:
            //             post.service_category = "Gardening"
            //             break
            //         case 2:
            //             post.service_category = "Beauty"
            //             break
            //         case 3:
            //             post.service_category = "Construction"
            //             break
            //         case 4:
            //             post.service_category = "Computer"
            //             break
            //         case 5:
            //             post.service_category = "Automotive"
            //             break
            //         case 6:
            //             post.service_category = "Creative"
            //             break
            //         case 7:
            //             post.service_category = "Financial"
            //             break
            //         case 8:
            //             post.service_category = "Cleaning"
            //             break
            //         case 9:
            //             post.service_category = "Pet"
            //             break
            //         case 10:
            //             post.service_category = "Legal"
            //             break
            //         case 11:
            //             post.service_category = "Health"
            //             break
            //         case 12:
            //             post.service_category = "Labor"
            //             break
            //         case 13:
            //             post.service_category = "Travel"
            //             break
            //     }
            // })

            console.log("allPosts in fetchAllPosts: ", allPosts)

            return allPosts
        }
    } catch(e) {
        console.error(e);
    }
}