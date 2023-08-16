import { Component, createEffect, createSignal } from 'solid-js'
import { supabase } from '../../lib/supabaseClient'
import { CategoryCarousel } from './CategoryCarousel'
import { ViewCard } from './ViewCard';
import { LocationFilter } from './LocationFilter';
import { SearchBar } from './SearchBar'
import { ui } from '../../i18n/ui'
import type { uiObject } from '../../i18n/uiType';
import { getLangFromUrl, useTranslations } from "../../i18n/utils";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

//get the categories from the language files so they translate with changes in the language picker
const values = ui[lang] as uiObject
const productCategories = values.productCategoryInfo.categories


const { data, error } = await supabase.from('providerposts').select('*');
console.log(data)
console.log(productCategories)

data?.map(item => {
    productCategories.forEach(productCategories => {
        if (item.service_category.toString() === productCategories.id) {
            item.category = productCategories.name
        }
    })
    delete item.service_category
})

console.log(data)


interface ProviderPost {
    content: string;
    id: number;
    category: string;
    title: string;
    provider_name: string;
    major_municipality: string;
    minor_municipality: string;
    governing_district: string;
    user_id: string;
    image_urls: string;
}

export const ServicesView: Component = () => {
    const [posts, setPosts] = createSignal<Array<ProviderPost>>([])
    const [searchPost, setSearchPost] = createSignal<Array<ProviderPost>>([])
    const [currentPosts, setCurrentPosts] = createSignal<Array<ProviderPost>>([])
    const [filters, setFilters] = createSignal<Array<string>>([])
    const [locationFilters, setLocationFilters] = createSignal<Array<string>>([])
    const [minorLocationFilters, setMinorLocationFilters] = createSignal<Array<string>>([])
    const [governingLocationFilters, setGoverningLocationFilters] = createSignal<Array<string>>([])

    //start the page as displaying all posts
    if (!data) {
        alert(t('messages.noPosts'))
    } else {
        setPosts(data)
        setCurrentPosts(data)
    }

    const searchPosts = async (searchString: string) => {
        console.log(searchString);
        if (searchString === '') {
            console.log("Data: ")
            console.log(data)
            setSearchPost(data!)
        } else {
            const { data: searchResults, error: searchError } = await supabase
                .from('providerposts')
                .select()
                .textSearch('title_content', searchString);

            if (searchError) {
                console.log("supabase error: " + searchError.message);
            } else {
                console.log(searchResults)
                searchResults?.map(item => {
                    productCategories.forEach(productCategories => {
                        if (item.service_category.toString() === productCategories.id) {
                            item.category = productCategories.name
                        }
                    })
                    delete item.service_category
                })
                setSearchPost(searchResults)
            }
        }

        filterPosts()
    }

    const setCategoryFilter = (currentCategory: string) => {

        if (filters().includes(currentCategory)) {
            let currentFilters = filters().filter((el) => el !== currentCategory)
            setFilters(currentFilters)
        } else {
            setFilters([...filters(), currentCategory])
            console.log("Category Filters Updated: ")
            console.log(filters())
        }

        console.log("Category Filters: ")
        console.log(filters())

        filterPosts()
    }

    const filterPosts = () => {

        if (!data) {
            alert(t('messages.noPosts'))
        } else if (searchPost().length === 0) {
            //Start each filter with all the posts so that when you switch categories it is filtering ALL posts again
            console.log(data)
            setPosts(data)
        } else (
            setPosts(searchPost())
        )

        console.log("Posts: ")
        console.log(posts())

        let filtered: ProviderPost[] = posts()

        if (filters().length === 0 && locationFilters().length === 0 && minorLocationFilters().length === 0 && governingLocationFilters().length === 0) {
            setCurrentPosts(filtered)
        } else {
            if (filters().length !== 0) {
                let filterPosts = filters().map((currentCategory) => {
                    let tempPosts = filtered.filter((post: any) => {
                        return post.category === currentCategory
                    })
                    return tempPosts;
                })
                console.log("Filtered Posts: ")
                console.log(filterPosts.flat())
                let filter1 = filterPosts.flat()
                filtered = filter1
                setCurrentPosts(filtered)
            }

            if (locationFilters().length !== 0) {
                let majorMuniFilter = locationFilters().map((currentLocation) => {
                    let tempPosts = filtered.filter((post: any) => {
                        return post.major_municipality === currentLocation
                    })
                    return tempPosts
                })
                let filter2 = majorMuniFilter.flat()
                if (minorLocationFilters().length === 0 && governingLocationFilters().length === 0) {
                    filtered = filter2
                    setCurrentPosts(filtered)
                } else if (minorLocationFilters().length !== 0) {
                    let minorMuniFilter = minorLocationFilters().map((currentLocation) => {
                        let tempPosts = filter2.filter((post: any) => {
                            return post.minor_municipality === currentLocation
                        })
                        return tempPosts
                    })
                    let filter3 = minorMuniFilter.flat()
                    if (governingLocationFilters().length === 0) {
                        filtered = filter3
                        setCurrentPosts(filtered)
                    } else {
                        let governingMuniFilter = governingLocationFilters().map((currentLocation) => {
                            let tempPosts = filter3.filter((post: any) => {
                                return post.governing_district === currentLocation
                            })
                            return tempPosts
                        })
                        let filter4 = governingMuniFilter.flat()
                        filtered = filter4
                        setCurrentPosts(filtered)
                    }
                }
            } else if (minorLocationFilters().length !== 0) {
                if (governingLocationFilters().length === 0) {
                    let minorMuniFilter = minorLocationFilters().map((currentLocation) => {
                        let tempPosts = filtered.filter((post: any) => {
                            return post.minor_municipality === currentLocation
                        })
                        return tempPosts
                    })
                    let filter5 = minorMuniFilter.flat()
                    filtered = filter5
                    setCurrentPosts(filtered)
                } else {
                    let minorMuniFilter = minorLocationFilters().map((currentLocation) => {
                        let tempPosts = filtered.filter((post: any) => {
                            return post.minor_municipality === currentLocation
                        })
                        return tempPosts
                    })
                    let filter6 = minorMuniFilter.flat()
                    let governingMuniFilter = governingLocationFilters().map((currentLocation) => {
                        let tempPosts = filter6.filter((post: any) => {
                            return post.governing_district === currentLocation
                        })
                        return tempPosts
                    })
                    let filter7 = governingMuniFilter.flat()
                    filtered = filter7
                    setCurrentPosts(filtered)
                }
                // return filtered
            } else if (governingLocationFilters().length !== 0) {
                let governingMuniFilter = governingLocationFilters().map((currentLocation) => {
                    let tempPosts = filtered.filter((post: any) => {
                        return post.governing_district === currentLocation
                    })
                    return tempPosts
                })
                let filter8 = governingMuniFilter.flat()
                filtered = filter8
                setCurrentPosts(filtered)
            }
        }
    }

    const filterPostsByMajorMunicipality = (location: string) => {
        if (locationFilters().includes(location)) {
            let currentLocationFilters = locationFilters().filter((el) => el !== location)
            setLocationFilters(currentLocationFilters)
        } else {
            setLocationFilters([...locationFilters(), location])
        }

        console.log("Location Filters: ")
        console.log(locationFilters())

        filterPosts()
    }

    const filterPostsByMinorMunicipality = (location: string) => {
        if (minorLocationFilters().includes(location)) {
            let currentLocationFilters = minorLocationFilters().filter((el) => el !== location)
            setMinorLocationFilters(currentLocationFilters)
        } else {
            setMinorLocationFilters([...minorLocationFilters(), location])
        }

        console.log("Minor Location Filters: ")
        console.log(minorLocationFilters())
        filterPosts()
    }

    const filterPostsByGoverningDistrict = (location: string) => {
        if (governingLocationFilters().includes(location)) {
            let currentLocationFilters = governingLocationFilters().filter((el) => el !== location)
            setGoverningLocationFilters(currentLocationFilters)
        } else {
            setGoverningLocationFilters([...governingLocationFilters(), location])
        }

        console.log("Governing Location Filters: ")
        console.log(governingLocationFilters())
        filterPosts()
    }

    return (
        <div class=''>
            <div>
                <SearchBar search={searchPosts} />
            </div>
            <div>
                <CategoryCarousel
                    filterPosts={setCategoryFilter}
                />
            </div>
            <div class="md:flex md:h-full">
                <div class="md:w-48">
                    <LocationFilter filterPostsByMajorMunicipality={filterPostsByMajorMunicipality} filterPostsByMinorMunicipality={filterPostsByMinorMunicipality} filterPostsByGoverningDistrict={filterPostsByGoverningDistrict} />
                </div>
                <div class="md:flex-1 ">
                    <ViewCard posts={currentPosts()} />
                </div>
            </div>
        </div>
    )
}