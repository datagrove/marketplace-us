import { Component, Suspense, createEffect, createResource, createSignal } from 'solid-js'
import { supabase } from '../../lib/supabaseClient'
import { CategoryCarousel } from './CategoryCarousel'
//import Card from Post Card 

interface ProviderPost {
    content: string;
    created_at: string;
    id: number;
    location: number;
    service_category: number;
    title: string;
    user_id: string;
}

const { data, error } = await supabase.from('provider_post').select('*');

export const ServicesView: Component = () => {
    //retype this array when we know what the post data looks like
    const [posts, setPosts] = createSignal<Array<ProviderPost>>([])

    const filterPosts = (currentCategory: string) => {
        if (!data) {
            alert("No posts available.")
        } else {
            //Start each filter with all the posts so that when you switch categories it is filtering ALL posts again
            setPosts(data)
        }
        const filteredPosts = posts().filter((post: any) => {
            //Allows for a button for "clear filters" or "Show all posts" or something similar
            if (currentCategory === "All") {
                return post
            } else {
                return post.service_category === currentCategory
            }
        })
        console.log(filteredPosts)
        setPosts(filteredPosts)
    }

    return (
        <div>
            <CategoryCarousel
                filterPosts={filterPosts}
            />
            {/* <ViewCard posts={posts()} /> Or whatever component we come up with for cards*/}
        </div>
    )
}