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

    createEffect(() => {
        if (props.id === undefined) {
            location.href = `/${lang}/404`
        } else if(props.id) {
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

        return (
            <div>
                <DeletePostButton Id={+props.id!} UserId={(post()?.user_id !== undefined ? (post()!.user_id) : ("")) } />
                <h1>{post()?.title}</h1>
                <p>{post()?.content}</p>
            </div>
        );

    };
