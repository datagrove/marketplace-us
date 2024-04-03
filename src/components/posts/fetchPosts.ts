import supabase from '../../lib/supabaseClient';
import { ui } from '../../i18n/ui';
import type { uiObject } from '../../i18n/uiType';
import { getLangFromUrl, useTranslations } from "../../i18n/utils";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

// one giant filter function that includes the logic for all combinations 
export async function fetchFilteredPosts(categoryFilters: Array<number>, locationFilters: Array<string>, minorLocationFilters: Array<string>, governingLocationFilters: Array<string>, searchString: string) {
    try {
            let query = supabase.from("sellerposts").select("*");
            if(categoryFilters.length !== 0) {    
                query = query.in('product_subject', categoryFilters);
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
        const { data: allPosts, error } = await supabase.from("sellerposts").select("*")

        if(error) {
            console.log("supabase error: " + error.message);
        } else {
            return allPosts
        }
    } catch(e) {
        console.error(e);
    }
}