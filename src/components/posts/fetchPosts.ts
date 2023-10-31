import { supabase } from '../../lib/supabaseClient';
import { ui } from '../../i18n/ui'
import type { uiObject } from '../../i18n/uiType';
import { getLangFromUrl, useTranslations } from "../../i18n/utils";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

// one giant filter function that includes the logic for all combinations 

export async function fetchFilteredPosts(categoryFilters: any, locationFilters: any, minorLocationFilters: any, governingLocationFilters: any, searchString: string) {
    // alert("category + location: " + categoryFilters + ", " + locationFilters)

    try {
        // all posts
        if(categoryFilters.length === 0 && locationFilters.length === 0 && minorLocationFilters.length === 0 && governingLocationFilters.length === 0 && searchString.length === 0) {
            try {
                const { data: allPosts, error } = await supabase
                .from("providerposts")
                .select("*")
                console.log("allPosts: ", allPosts)
        
                if(error) {
                    console.log("supabase error: " + error.message);
                } else {
                    return allPosts
                }
            } catch (e) {
                console.error(e);
            }
        // only category filter
        } else if(categoryFilters.length > 0 && locationFilters.length === 0 && minorLocationFilters.length === 0 && governingLocationFilters.length === 0 && searchString.length === 0) {    
            // alert(categoryFilters)
            let categoryIntegers: Array<number> = []
            
            categoryFilters.map((category: string) => {
                if(category === "Gardening") {
                    categoryIntegers.push(1)
                } else if(category === "Beauty") {
                    categoryIntegers.push(2)
                } else if(category === "Construction") {
                    categoryIntegers.push(3)
                } else if(category === "Computer") {
                    categoryIntegers.push(4)
                } else if(category === "Automotive") {
                    categoryIntegers.push(5)
                } else if(category === "Creative") {
                    categoryIntegers.push(6)
                } else if(category === "Financial") {
                    categoryIntegers.push(7)
                } else if(category === "Cleaning") {
                    categoryIntegers.push(8)
                } else if(category === "Pet") {
                    categoryIntegers.push(9)
                } else if(category === "Legal") {
                    categoryIntegers.push(10)
                } else if(category === "Health") {
                    categoryIntegers.push(11)
                } else if(category === "Labor") {
                    categoryIntegers.push(12)
                } else if(category === "Travel") {
                    categoryIntegers.push(13)
                }

                // alert("Integers: " + categoryIntegers)
            })

            const { data: catPosts, error } = await supabase
                .from("providerposts")
                .select("*")
                .in("service_category", categoryIntegers)
        
                if(!catPosts) {
                    alert(t('messages.noPosts'))
                }
        
                if(error) {
                    console.log("supabase error: " + error.message);
                } else {
                    return catPosts;
                }
        // category and first location filter        
        } else if(categoryFilters.length > 0 && locationFilters.length > 0 && minorLocationFilters.length === 0 && governingLocationFilters.length === 0 && searchString.length === 0) {
            try {
                // alert("In two filters")
                let categoryIntegers: Array<number> = []
            
            categoryFilters.map((category: string) => {
                if(category === "Gardening") {
                    categoryIntegers.push(1)
                } else if(category === "Beauty") {
                    categoryIntegers.push(2)
                } else if(category === "Construction") {
                    categoryIntegers.push(3)
                } else if(category === "Computer") {
                    categoryIntegers.push(4)
                } else if(category === "Automotive") {
                    categoryIntegers.push(5)
                } else if(category === "Creative") {
                    categoryIntegers.push(6)
                } else if(category === "Financial") {
                    categoryIntegers.push(7)
                } else if(category === "Cleaning") {
                    categoryIntegers.push(8)
                } else if(category === "Pet") {
                    categoryIntegers.push(9)
                } else if(category === "Legal") {
                    categoryIntegers.push(10)
                } else if(category === "Health") {
                    categoryIntegers.push(11)
                } else if(category === "Labor") {
                    categoryIntegers.push(12)
                } else if(category === "Travel") {
                    categoryIntegers.push(13)
                }
            })

                const { data, error } = await supabase
                .from("providerposts")
                .select("*")
                .in("service_category", categoryIntegers)
                .in("major_municipality", locationFilters)
                
                if(error) {
                    console.log("supabase error: " + error.message);
                } else {
                    console.log("cat and local filter: ", data)
                    return data;
                }

            } catch(e) {
                console.error(e)
            }
        // category, first, and second location filter    
        } else if(categoryFilters.length > 0 && locationFilters.length > 0 && minorLocationFilters.length > 0 && governingLocationFilters.length === 0 && searchString.length === 0) {
            try {
                // alert("In the three filters")
                let categoryIntegers: Array<number> = []
            
            categoryFilters.map((category: string) => {
                if(category === "Gardening") {
                    categoryIntegers.push(1)
                } else if(category === "Beauty") {
                    categoryIntegers.push(2)
                } else if(category === "Construction") {
                    categoryIntegers.push(3)
                } else if(category === "Computer") {
                    categoryIntegers.push(4)
                } else if(category === "Automotive") {
                    categoryIntegers.push(5)
                } else if(category === "Creative") {
                    categoryIntegers.push(6)
                } else if(category === "Financial") {
                    categoryIntegers.push(7)
                } else if(category === "Cleaning") {
                    categoryIntegers.push(8)
                } else if(category === "Pet") {
                    categoryIntegers.push(9)
                } else if(category === "Legal") {
                    categoryIntegers.push(10)
                } else if(category === "Health") {
                    categoryIntegers.push(11)
                } else if(category === "Labor") {
                    categoryIntegers.push(12)
                } else if(category === "Travel") {
                    categoryIntegers.push(13)
                }
            })

                const { data, error } = await supabase
                .from("providerposts")
                .select("*")
                .in("service_category", categoryIntegers)
                .in("major_municipality", locationFilters)
                .in("minor_municipality", minorLocationFilters)
                
                if(error) {
                    console.log("supabase error: " + error.message);
                } else {
                    console.log("cat and local filter: ", data)
                    return data;
                }

            } catch(e) {
                console.error(e)
            }
        // all filters on
        } else if(categoryFilters.length > 0 && locationFilters.length > 0 && minorLocationFilters.length > 0 && governingLocationFilters.length > 0 && searchString.length === 0) {
            try {
                // alert("All filters")
                let categoryIntegers: Array<number> = []
            
            categoryFilters.map((category: string) => {
                if(category === "Gardening") {
                    categoryIntegers.push(1)
                } else if(category === "Beauty") {
                    categoryIntegers.push(2)
                } else if(category === "Construction") {
                    categoryIntegers.push(3)
                } else if(category === "Computer") {
                    categoryIntegers.push(4)
                } else if(category === "Automotive") {
                    categoryIntegers.push(5)
                } else if(category === "Creative") {
                    categoryIntegers.push(6)
                } else if(category === "Financial") {
                    categoryIntegers.push(7)
                } else if(category === "Cleaning") {
                    categoryIntegers.push(8)
                } else if(category === "Pet") {
                    categoryIntegers.push(9)
                } else if(category === "Legal") {
                    categoryIntegers.push(10)
                } else if(category === "Health") {
                    categoryIntegers.push(11)
                } else if(category === "Labor") {
                    categoryIntegers.push(12)
                } else if(category === "Travel") {
                    categoryIntegers.push(13)
                }
            })

                const { data, error } = await supabase
                .from("providerposts")
                .select("*")
                .in("service_category", categoryIntegers)
                .in("major_municipality", locationFilters)
                .in("minor_municipality", minorLocationFilters)
                .in("governing_district", governingLocationFilters)
                
                if(error) {
                    console.log("supabase error: " + error.message);
                } else {
                    console.log("cat and local filter: ", data)
                    return data;
                }

            } catch(e) {
                console.error(e)
            }
        // only first location filter
        } else if(categoryFilters.length === 0 && locationFilters.length > 0 && minorLocationFilters.length === 0 && governingLocationFilters.length === 0 && searchString.length === 0) {
            try {
                // alert("First location filter")

                const { data, error } = await supabase
                .from("providerposts")
                .select("*")
                .in("major_municipality", locationFilters)
                
                if(error) {
                    console.log("supabase error: " + error.message);
                } else {
                    console.log("cat and local filter: ", data)
                    return data;
                }

            } catch(e) {
                console.error(e)
            }

        // first and second location filters on
        } else if(categoryFilters.length === 0 && locationFilters.length > 0 && minorLocationFilters.length > 0 && governingLocationFilters.length === 0 && searchString.length === 0) {
            try {
                // alert("Major and minor location filters")

                const { data, error } = await supabase
                .from("providerposts")
                .select("*")
                .in("major_municipality", locationFilters)
                .in("minor_municipality", minorLocationFilters)
                
                if(error) {
                    console.log("supabase error: " + error.message);
                } else {
                    console.log("cat and local filter: ", data)
                    return data;
                }

            } catch(e) {
                console.error(e)
            }
        // all location filters on
        } else if(categoryFilters.length === 0 && locationFilters.length > 0 && minorLocationFilters.length > 0 && governingLocationFilters.length > 0 && searchString.length === 0) {
            try {
                // alert("All and only location filters")

                const { data, error } = await supabase
                .from("providerposts")
                .select("*")
                .in("major_municipality", locationFilters)
                .in("minor_municipality", minorLocationFilters)
                .in("governing_district", governingLocationFilters)
                
                if(error) {
                    console.log("supabase error: " + error.message);
                } else {
                    console.log("cat and local filter: ", data)
                    return data;
                }

            } catch(e) {
                console.error(e)
            }
        } else if (categoryFilters.length === 0 && locationFilters.length === 0 && minorLocationFilters.length === 0 && governingLocationFilters.length === 0 && searchString.length > 0) {
            try {
                const { data: searchPosts, error } = await supabase
                .from('providerposts')
                .select('*')
                .textSearch('title', searchString);

                if(error) {
                    console.log("supabase error: " + error.message);
                } else if( searchPosts.length === 0) {
                    alert(t('messages.noPosts'))
                } else {
                    console.log("fetch Search bar: ", searchPosts)
                    return searchPosts
                }
            } catch(e) {
                console.error(e)
            }
        } else if(categoryFilters.length > 0 && locationFilters.length === 0 && minorLocationFilters.length === 0 && governingLocationFilters.length === 0 && searchString.length > 0) {
            let categoryIntegers: Array<number> = []
            
            categoryFilters.map((category: string) => {
                if(category === "Gardening") {
                    categoryIntegers.push(1)
                } else if(category === "Beauty") {
                    categoryIntegers.push(2)
                } else if(category === "Construction") {
                    categoryIntegers.push(3)
                } else if(category === "Computer") {
                    categoryIntegers.push(4)
                } else if(category === "Automotive") {
                    categoryIntegers.push(5)
                } else if(category === "Creative") {
                    categoryIntegers.push(6)
                } else if(category === "Financial") {
                    categoryIntegers.push(7)
                } else if(category === "Cleaning") {
                    categoryIntegers.push(8)
                } else if(category === "Pet") {
                    categoryIntegers.push(9)
                } else if(category === "Legal") {
                    categoryIntegers.push(10)
                } else if(category === "Health") {
                    categoryIntegers.push(11)
                } else if(category === "Labor") {
                    categoryIntegers.push(12)
                } else if(category === "Travel") {
                    categoryIntegers.push(13)
                }
            })

            try {
                const { data: posts, error } = await supabase
                .from('providerposts')
                .select('*')
                .textSearch('title', searchString)
                .in("service_category", categoryIntegers)

                if(!posts) {
                    alert(t('messages.noPosts'))
                }

                if(error) {
                    console.log("supabase error: " + error.message);
                } else {
                    return posts;
                }
            } catch(e) {
                console.error(e)
            }
        //serach bar, category, and major muni
        } else if(categoryFilters.length > 0 && locationFilters.length > 0 && minorLocationFilters.length === 0 && governingLocationFilters.length === 0 && searchString.length > 0) {
            let categoryIntegers: Array<number> = []
            
            categoryFilters.map((category: string) => {
                if(category === "Gardening") {
                    categoryIntegers.push(1)
                } else if(category === "Beauty") {
                    categoryIntegers.push(2)
                } else if(category === "Construction") {
                    categoryIntegers.push(3)
                } else if(category === "Computer") {
                    categoryIntegers.push(4)
                } else if(category === "Automotive") {
                    categoryIntegers.push(5)
                } else if(category === "Creative") {
                    categoryIntegers.push(6)
                } else if(category === "Financial") {
                    categoryIntegers.push(7)
                } else if(category === "Cleaning") {
                    categoryIntegers.push(8)
                } else if(category === "Pet") {
                    categoryIntegers.push(9)
                } else if(category === "Legal") {
                    categoryIntegers.push(10)
                } else if(category === "Health") {
                    categoryIntegers.push(11)
                } else if(category === "Labor") {
                    categoryIntegers.push(12)
                } else if(category === "Travel") {
                    categoryIntegers.push(13)
                }
            })

            try {
                const { data: posts, error } = await supabase
                .from('providerposts')
                .select('*')
                .textSearch('title', searchString)
                .in("service_category", categoryIntegers)
                .in("major_municipality", locationFilters)

                if(!posts) {
                    alert(t('messages.noPosts'))
                }

                if(error) {
                    console.log("supabase error: " + error.message);
                } else {
                    return posts;
                }
            } catch(e) {
                console.error(e)
            }
        // search bar, category, major muni, minor muni
        } else if(categoryFilters.length > 0 && locationFilters.length > 0 && minorLocationFilters.length > 0 && governingLocationFilters.length === 0 && searchString.length > 0) {
            let categoryIntegers: Array<number> = []
            
            categoryFilters.map((category: string) => {
                if(category === "Gardening") {
                    categoryIntegers.push(1)
                } else if(category === "Beauty") {
                    categoryIntegers.push(2)
                } else if(category === "Construction") {
                    categoryIntegers.push(3)
                } else if(category === "Computer") {
                    categoryIntegers.push(4)
                } else if(category === "Automotive") {
                    categoryIntegers.push(5)
                } else if(category === "Creative") {
                    categoryIntegers.push(6)
                } else if(category === "Financial") {
                    categoryIntegers.push(7)
                } else if(category === "Cleaning") {
                    categoryIntegers.push(8)
                } else if(category === "Pet") {
                    categoryIntegers.push(9)
                } else if(category === "Legal") {
                    categoryIntegers.push(10)
                } else if(category === "Health") {
                    categoryIntegers.push(11)
                } else if(category === "Labor") {
                    categoryIntegers.push(12)
                } else if(category === "Travel") {
                    categoryIntegers.push(13)
                }
            })

            try {
                const { data: posts, error } = await supabase
                .from('providerposts')
                .select('*')
                .textSearch('title', searchString)
                .in("service_category", categoryIntegers)
                .in("major_municipality", locationFilters)
                .in("minor_municipality", minorLocationFilters)

                if(!posts) {
                    alert(t('messages.noPosts'))
                }

                if(error) {
                    console.log("supabase error: " + error.message);
                } else {
                    return posts;
                }
            } catch(e) {
                console.error(e)
            }
        // search bar, category, major muni, minor muni, district
        } else if(categoryFilters.length > 0 && locationFilters.length > 0 && minorLocationFilters.length > 0 && governingLocationFilters.length > 0 && searchString.length > 0) {
            let categoryIntegers: Array<number> = []
            
            categoryFilters.map((category: string) => {
                if(category === "Gardening") {
                    categoryIntegers.push(1)
                } else if(category === "Beauty") {
                    categoryIntegers.push(2)
                } else if(category === "Construction") {
                    categoryIntegers.push(3)
                } else if(category === "Computer") {
                    categoryIntegers.push(4)
                } else if(category === "Automotive") {
                    categoryIntegers.push(5)
                } else if(category === "Creative") {
                    categoryIntegers.push(6)
                } else if(category === "Financial") {
                    categoryIntegers.push(7)
                } else if(category === "Cleaning") {
                    categoryIntegers.push(8)
                } else if(category === "Pet") {
                    categoryIntegers.push(9)
                } else if(category === "Legal") {
                    categoryIntegers.push(10)
                } else if(category === "Health") {
                    categoryIntegers.push(11)
                } else if(category === "Labor") {
                    categoryIntegers.push(12)
                } else if(category === "Travel") {
                    categoryIntegers.push(13)
                }
            })

            try {
                const { data: posts, error } = await supabase
                .from('providerposts')
                .select('*')
                .textSearch('title', searchString)
                .in("service_category", categoryIntegers)
                .in("major_municipality", locationFilters)
                .in("minor_municipality", minorLocationFilters)
                .in("governing_district", governingLocationFilters)

                if(!posts) {
                    alert(t('messages.noPosts'))
                }

                if(error) {
                    console.log("supabase error: " + error.message);
                } else {
                    return posts;
                }
            } catch(e) {
                console.error(e)
            }
        // search bar, major muni
        } else if(categoryFilters.length === 0 && locationFilters.length > 0 && minorLocationFilters.length === 0 && governingLocationFilters.length === 0 && searchString.length > 0) {
            try {
                const { data: posts, error } = await supabase
                .from('providerposts')
                .select('*')
                .textSearch('title', searchString)
                .in("major_municipality", locationFilters)

                if(!posts) {
                    alert(t('messages.noPosts'))
                }

                if(error) {
                    console.log("supabase error: " + error.message);
                } else {
                    return posts;
                }
            } catch(e) {
                console.error(e)
            }
        // search bar, major muni, minor muni
        } else if(categoryFilters.length === 0 && locationFilters.length > 0 && minorLocationFilters.length > 0 && governingLocationFilters.length === 0 && searchString.length > 0) {
            try {
                const { data: posts, error } = await supabase
                .from('providerposts')
                .select('*')
                .textSearch('title', searchString)
                .in("major_municipality", locationFilters)
                .in("minor_municipality", minorLocationFilters)

                if(!posts) {
                    alert(t('messages.noPosts'))
                }

                if(error) {
                    console.log("supabase error: " + error.message);
                } else {
                    return posts;
                }
            } catch(e) {
                console.error(e)
            }
        // search bar, major muni, minor muni, district
        } else if(categoryFilters.length === 0 && locationFilters.length > 0 && minorLocationFilters.length > 0 && governingLocationFilters.length > 0 && searchString.length > 0) {
            try {
                const { data: posts, error } = await supabase
                .from('providerposts')
                .select('*')
                .textSearch('title', searchString)
                .in("major_municipality", locationFilters)
                .in("minor_municipality", minorLocationFilters)
                .in("governing_district", governingLocationFilters)

                if(!posts) {
                    alert(t('messages.noPosts'))
                }

                if(error) {
                    console.log("supabase error: " + error.message);
                } else {
                    return posts;
                }
            } catch(e) {
                console.error(e)
            }
        }
    } catch(e) { 
        console.error(e)
    }
}

export async function fetchAllPosts() {
    try {
        const { data: allPosts, error } = await supabase
        .from("providerposts")
        .select("*")
        console.log("allPosts: ", allPosts)

        if(error) {
            console.log("supabase error: " + error.message);
        } else {
            return allPosts
        }
    } catch (e) {
        console.error(e);
    }

    // const { data: allPosts, error} = await supabase
    //     .from("providerposts")
    //     .select("*")

    //     var allPostsArr = Object.keys(allPosts).map((key) => [key, allPosts[key]]);

    //     console.log("allPostsArr: ", allPostsArr)

    //     return allPostsArr

    // const { data: allPosts, error} = await supabase
    // .from("providerposts")
    // .select("*")

    // console.log("allPosts in fetch function: ", allPosts)
    // console.log("allPosts TYPE in fetch function: ", typeof(allPosts))
    // console.log("allPosts in fetch function ARRAY?: ", Array.isArray(allPosts))

    // return allPosts;
}

export async function fetchPostsByCategory(selectedCats: Array<string>) {
    console.log("selectedCats: ", selectedCats)
    
    let catArray = selectedCats.map((item) => Number(item))
    
    const { data: catPosts, error } = await supabase
            .from("providerposts")
            .select("*")
            .in('service_category', catArray)
            console.log("category data: ", catPosts)

        if(!catPosts) {
            alert(t('messages.noPosts'))
        }

        if(error) {
            console.log("supabase error: " + error.message);
        }

        return catPosts;
}