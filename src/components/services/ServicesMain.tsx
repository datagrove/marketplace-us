import { Component, createComputed, createEffect, createMemo, createSignal } from 'solid-js'
import { supabase } from '../../lib/supabaseClient'
import { CategoryCarousel } from './CategoryCarousel'
import { ViewCard } from './ViewCard';
import { LocationFilter } from './LocationFilter';

interface ProviderPost {
    content: string;
    id: number;
    category: string;
    title: string;
    provider_name: string;
    major_municipality: string;
    minor_municipality: string;
    governing_district: string;
}

const { data, error } = await supabase.from('providerposts').select('*');

export const ServicesView: Component = () => {
    const [posts, setPosts] = createSignal<Array<ProviderPost>>([])
    const [currentPosts, setCurrentPosts] = createSignal<Array<ProviderPost>>([])
    const [filters, setFilters] = createSignal<Array<string>>([])
    const [locationFilters, setLocationFilters] = createSignal<Array<string>>([])
    const [minorLocationFilters, setMinorLocationFilters] = createSignal<Array<string>>([])
    const [governingLocationFilters, setGoverningLocationFilters] = createSignal<Array<string>>([])

    if (!data) {
        alert("No posts available.")
    } else {
        //Start each filter with all the posts so that when you switch categories it is filtering ALL posts again
        setPosts(data)
        setCurrentPosts(data)
    }

    const filterPosts = (currentCategory: string) => {
        if (filters().includes(currentCategory)) {
            let currentFilters = filters().filter((el) => el !== currentCategory)
            setFilters(currentFilters)
        } else {
            setFilters([...filters(), currentCategory])
        }

        console.log("Category Filters: ")
        console.log(filters())

        // if (!data) {
        //     alert("No posts available.")
        // } else {
        //     //Start each filter with all the posts so that when you switch categories it is filtering ALL posts again
        //     setPosts(data)
        // }
    }

    const filteredPosts = () => {
        //Allows for a button for "clear filters" or "Show all posts" or something similar
        if (filters().length === 0) {
            return posts()
        } else {
            let filterPosts = filters().map((currentCategory) => {
                let tempPosts = posts().filter((post: any) => {
                    return post.category === currentCategory
                })
                return tempPosts;
            })
            return filterPosts.flat()
        }
    }
    console.log("Filtered Posts: ")
    console.log(filteredPosts())
    // setPosts(filteredPosts())

    const filterByLocation = () => {
        let filtered: ProviderPost[] = []

        if (locationFilters().length === 0 && minorLocationFilters().length === 0 && governingLocationFilters().length === 0) {
            return posts()
        } else if (locationFilters().length !== 0) {
            let majorMuniFilter = locationFilters().map((currentLocation) => {
                let tempPosts = filteredPosts().filter((post: any) => {
                    return post.major_municipality === currentLocation
                })
                return tempPosts
            })
            let filter2 = majorMuniFilter.flat()
            if (minorLocationFilters().length === 0 && governingLocationFilters().length === 0) {
                filtered = filter2
                return filtered
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
                    return filtered
                } else {
                    let governingMuniFilter = governingLocationFilters().map((currentLocation) => {
                        let tempPosts = filter3.filter((post: any) => {
                            return post.governing_district === currentLocation
                        })
                        return tempPosts
                    })
                    let filter4 = governingMuniFilter.flat()
                    filtered = filter4
                    return filtered
                }
            }
            return filtered
        } else if (minorLocationFilters().length !== 0) {
            if (governingLocationFilters().length === 0) {
                let minorMuniFilter = minorLocationFilters().map((currentLocation) => {
                    let tempPosts = filteredPosts().filter((post: any) => {
                        return post.minor_municipality === currentLocation
                    })
                    return tempPosts
                })
                let filter5 = minorMuniFilter.flat()
                filtered = filter5
                return filtered
            } else {
                let minorMuniFilter = minorLocationFilters().map((currentLocation) => {
                    let tempPosts = filteredPosts().filter((post: any) => {
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
                return filtered
            }
            // return filtered
        } else if (governingLocationFilters().length !== 0) {
            let governingMuniFilter = governingLocationFilters().map((currentLocation) => {
                let tempPosts = filteredPosts().filter((post: any) => {
                    return post.governing_district === currentLocation
                })
                return tempPosts
            })
            let filter8 = governingMuniFilter.flat()
            filtered = filter8
            return filtered
        }
    }
    setPosts(filterByLocation()!)

    console.log(filterByLocation())
    console.log("Posts: ")
    console.log(posts())



    const filterPostsByMajorMunicipality = (location: string) => {
        if (locationFilters().includes(location)) {
            let currentLocationFilters = locationFilters().filter((el) => el !== location)
            setLocationFilters(currentLocationFilters)
        } else {
            setLocationFilters([...locationFilters(), location])
        }

        console.log("Location Filters: ")
        console.log(locationFilters())

        // const filteredPosts = () => {
        //     //Allows for a button for "clear filters" and if unchecked removes the filter
        //     if (locationFilters().length === 0) {
        //         return posts()
        //     } else {
        //         let filterPosts = locationFilters().map((currentLocation) => {
        //             let tempPosts = posts().filter((post: any) => {
        //                 return post.major_municipality === currentLocation
        //             })
        //             return tempPosts;
        //         })
        //         return filterPosts.flat() //need some way of combining the filters
        //     }
        // }
        // console.log("Filtered Posts: ")
        // console.log(filteredPosts())
        // setPosts(filteredPosts())
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

        // const filteredPosts = () => {
        //     //Allows for a button for "clear filters" and if unchecked removes the filter
        //     if (locationFilters().length === 0) {
        //         return posts()
        //     } else {
        //         let filterPosts = minorLocationFilters().map((currentLocation) => {
        //             let tempPosts = posts().filter((post: any) => {
        //                 return post.minor_municipality === currentLocation
        //             })
        //             return tempPosts;
        //         })
        //         return filterPosts.flat() //need some way of combining the filters
        //     }
        // }
        // setPosts(filteredPosts())
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

        // const filteredPosts = () => {
        //     //Allows for a button for "clear filters" and if unchecked removes the filter
        //     if (governingLocationFilters().length === 0) {
        //         return posts()
        //     } else {
        //         let filterPosts = governingLocationFilters().map((currentLocation) => {
        //             let tempPosts = posts().filter((post: any) => {
        //                 return post.governing_district === currentLocation
        //             })
        //             return tempPosts;
        //         })
        //         return filterPosts.flat() //need some way of combining the filters
        //     }
        // }
        // setPosts(filteredPosts())
    }

    createEffect(() => {
        setCurrentPosts(posts());
    }, [posts()])

    createEffect(() => {
        console.log("Effect Triggered")
            if (!data) {
                alert("No posts available.")
            } else {
                setPosts(data);
                console.log(posts())
                setPosts(filterByLocation()!);
                console.log(posts())
            }
    }, [filters(), locationFilters(), minorLocationFilters(), governingLocationFilters()])

    // createComputed(() => {
    //     const currentPostValue = currentPosts();
    // })


    return (
        <div class='border-8 border-click'>
            <div>
                <CategoryCarousel
                    filterPosts={filterPosts}
                />
            </div>
            <div>
                <LocationFilter filterPostsByMajorMunicipality={filterPostsByMajorMunicipality} filterPostsByMinorMunicipality={filterPostsByMinorMunicipality} filterPostsByGoverningDistrict={filterPostsByGoverningDistrict} />
            </div>
            <ViewCard posts={currentPosts()} />
        </div>
    )
}