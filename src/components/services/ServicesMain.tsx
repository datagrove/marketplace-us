import { Component, createComputed, createEffect, createMemo, createSignal } from 'solid-js'
import { supabase } from '../../lib/supabaseClient'
import { CategoryCarousel } from './CategoryCarousel'
import { ViewCard } from './ViewCard';

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

        console.log("Current Filters: ")
        console.log(filters())

        if (!data) {
            alert("No posts available.")
        } else {
            //Start each filter with all the posts so that when you switch categories it is filtering ALL posts again
            setPosts(data)
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
        setPosts(filteredPosts())
        console.log("Posts: ")
        console.log(posts())
    }
    createEffect(() => {
        setCurrentPosts(posts());
    }, [posts()])

    createComputed(() => {
        const currentPostValue = currentPosts();
    })


    return (
        <div class='border-8 border-click'>
            <CategoryCarousel
                filterPosts={filterPosts}
            />
            <ViewCard posts={currentPosts()} />
        </div>
    )
}