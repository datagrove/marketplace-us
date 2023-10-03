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

const { data: user, error: userError } = await supabase.auth.getSession();
if(userError){
    console.log(userError)
}
if (user.session === null || user.session === undefined) {
    alert(t('messages.signIn'));
    location.href = `/${lang}/login`;
}

const { data, error } = await supabase.from('providerposts').select('*');

data?.map(item => {
    productCategories.forEach(productCategories => {
        if (item.service_category.toString() === productCategories.id) {
            item.category = productCategories.name
        }
    })
    delete item.service_category
})



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

    const clearAllFilters = () => {
        let searchInput = document.getElementById("search") as HTMLInputElement;
        let selectedCategories = document.querySelectorAll(".selected");
        const majorMuniCheckboxes = document.querySelectorAll("input[type='checkbox'].major-muni") as NodeListOf<HTMLInputElement>;
        const minorMuniCheckboxes = document.querySelectorAll("input[type='checkbox'].minor-muni") as NodeListOf<HTMLInputElement>;
        const districtCheckboxes = document.querySelectorAll("input[type='checkbox'].district") as NodeListOf<HTMLInputElement>;

        if(searchInput.value !== null ) {
            searchInput.value = "";
        }

        selectedCategories.forEach((category) => {
            category.classList.remove("selected");
        })
        
        selectedCategories.forEach((category) => {
            category.classList.remove("selected");
        })
        
        majorMuniCheckboxes.forEach((checkbox) => {
            if(checkbox && checkbox.checked) checkbox.checked = false;
        })

        minorMuniCheckboxes.forEach((checkbox) => {
            if(checkbox && checkbox.checked) checkbox.checked = false;
        })

        districtCheckboxes.forEach((checkbox) => {
            if(checkbox && checkbox.checked) checkbox.checked = false;
        })

        setSearchPost([]);
        setFilters([]);
        setLocationFilters([]);
        setMinorLocationFilters([]);
        setGoverningLocationFilters([]);
        filterPosts();
    }

    const clearServiceCategories = () => {
        let selectedCategories = document.querySelectorAll(".selected");
        
        selectedCategories.forEach((category) => {
            category.classList.remove("selected");
        })
        
        setFilters([]);
        filterPosts();
    }

    const clearMajorMunicipality = () => {
        const majorMuniCheckboxes = document.querySelectorAll("input[type='checkbox'].major-muni") as NodeListOf<HTMLInputElement>;
        
        majorMuniCheckboxes.forEach((checkbox) => {
          if(checkbox && checkbox.checked) checkbox.checked = false;
        })
    
        setLocationFilters([]);
        filterPosts();
    }

    const clearMinorMunicipality = () => {
        const minorMuniCheckboxes = document.querySelectorAll("input[type='checkbox'].minor-muni") as NodeListOf<HTMLInputElement>;
        
        minorMuniCheckboxes.forEach((checkbox) => {
          if(checkbox && checkbox.checked) checkbox.checked = false;
        })
    
        setMinorLocationFilters([]);
        filterPosts();
    }

    const clearDistrict = () => {
        const districtCheckboxes = document.querySelectorAll("input[type='checkbox'].district") as NodeListOf<HTMLInputElement>;
    
        districtCheckboxes.forEach((checkbox) => {
          if(checkbox && checkbox.checked) checkbox.checked = false;
        })

        setGoverningLocationFilters([]);
        filterPosts();
    }

    return (
        <div class=''>
            <div>
                <SearchBar search={searchPosts} />
            </div>
            
            <div class="clear-filters-btns flex flex-wrap justify-center items-center ">
                <button class="clearBtnRectangle" onclick={ clearAllFilters } aria-label={t('clearFilters.filterButtons.0.ariaLabel')}>
                    <p class="text-xs">{t('clearFilters.filterButtons.0.text')}</p>
                </button>
                
                <button class="clearBtnRectangle" onclick={ clearServiceCategories } aria-label={t('clearFilters.filterButtons.1.ariaLabel')}>
                    <p class="text-xs">{t('clearFilters.filterButtons.1.text')}</p>
                </button>

                <button class="clearBtnRectangle" onclick={ clearMajorMunicipality } aria-label={t('clearFilters.filterButtons.2.ariaLabel')}>
                    <p class="text-xs">{t('clearFilters.filterButtons.2.text')}</p>
                </button>

                <button class="clearBtnRectangle" onclick={ clearMinorMunicipality } aria-label={t('clearFilters.filterButtons.3.ariaLabel')}>
                    <p class="text-xs">{t('clearFilters.filterButtons.3.text')}</p>
                </button>

                <button class="clearBtnRectangle" onclick={ clearDistrict } aria-label={t('clearFilters.filterButtons.4.ariaLabel')}>
                    <p class="text-xs">{t('clearFilters.filterButtons.4.text')}</p>
                </button>
            </div>

            <div>
                <div class="flex justify-end items-center">

                </div>
                <CategoryCarousel
                    filterPosts={setCategoryFilter}
                />
            </div>

            <div class="md:h-full flex flex-col md:flex-row items-center md:items-start ">
                <div class="md:w-48 md:mr-4 w-11/12">
                    <LocationFilter filterPostsByMajorMunicipality={filterPostsByMajorMunicipality} filterPostsByMinorMunicipality={filterPostsByMinorMunicipality} filterPostsByGoverningDistrict={filterPostsByGoverningDistrict} />
                </div>
                
                <div class="md:flex-1 w-11/12 items-center">
                    <ViewCard posts={currentPosts()} />
                </div>
            </div>
        </div>
    )
}