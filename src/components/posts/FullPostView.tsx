import { Component, createSignal, createEffect } from "solid-js";
import { supabase } from "../../lib/supabaseClient";
import { DeletePostButton } from "../posts/DeletePostButton";
import type { AuthSession } from "@supabase/supabase-js";
import { getLangFromUrl, useTranslations } from '../../i18n/utils';

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

interface Post {
    content: string;
    id: number;
    category: string;
    title: string;
    provider_name: string;
    major_municipality: string;
    minor_municipality: string;
    governing_district: string;
    user_id: string;
    image_urls: string | null;
}

interface Props {
    id: string | undefined;
}

const { data: User, error: UserError } = await supabase.auth.getSession();

export const ViewFullPost: Component<Props> = (props) => {
    const [post, setPost] = createSignal<Post>();
    const [session, setSession] = createSignal<AuthSession | null>(null);
    const [postImages, setPostImages] = createSignal<string[]>([]);

    createEffect(() => {
        if (props.id === undefined) {
            location.href = `/${lang}/404`
        } else if (props.id) {
            setSession(User.session);
            fetchPost(+props.id);
        }
    });

    const fetchPost = async (id: number) => {
        if (session()) {
            try {
                const { data, error } = await supabase
                    .from("providerposts")
                    .select("*")
                    .eq("id", id);

                if (error) {
                    console.log(error);
                } else if (data[0] === undefined) {
                    console.log("Post not found"); //TODO: Change to alert message
                    location.href = `/${lang}/404` //TODO: Redirect to Services Page
                } else {
                    setPost(data[0]);
                    console.log(post())
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            alert(t('messages.signIn'))
            location.href = `/${lang}/login`
        }
    }

    createEffect(async () => {
        console.log("downloading images")
        if (post() !== undefined) {
            if (post()?.image_urls === undefined || post()?.image_urls === null) {
                console.log("No Images")
            } else {
                await downloadImages(post()?.image_urls!)
            }
        }
    })

    const downloadImages = async (image_Urls: string) => {
        try {
            const { data, error } = await supabase.storage
                .from("post.image")
                .createSignedUrls(image_Urls.split(','), 60, { download: true })
            if (error) {
                throw error;
            } else {
            console.log(data)
            data.forEach(async (image: any) => {
                const response = await fetch(image.signedUrl)
                const blob = await response.blob()
                const blob_url = URL.createObjectURL(blob)
                const image_url = blob_url.split('blob:')[1]
                console.log(image_url.toString())
                setPostImages([...postImages(), image_url]);
                console.log(postImages())
            })
            }
            
            // setPostImages([...postImages(), data[0]]);
        } catch (error) {
            console.log(error)
        }  
    }

    return (
        <div>
            <ul>
                {postImages().map((image: string) => (
                    <li>
                        <img src={image} />
                    </li>
                ))}
            </ul>
            <DeletePostButton Id={+props.id!} UserId={(post()?.user_id !== undefined ? (post()!.user_id) : (""))} />
            <h1 class="text-xl w-full font-bold">{post()?.title}</h1>
            <p>Provider: {post()?.provider_name}</p>
            <p>
                Location: {post()?.major_municipality}/{post()?.minor_municipality}/
                {post()?.governing_district}
            </p>
            <p>Category: {post()?.category}</p>
            <p>{post()?.content}</p>
        </div>
    );

};
