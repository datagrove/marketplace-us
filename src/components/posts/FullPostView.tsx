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
            alert(t('messages')) //TODO: Post does not exist
            location.href = `/${lang}/404`
        } else if(props.id) {
            fetchPost(+props.id); 
            setSession(User.session);
        }
    });

    const fetchPost = async (id: number) => {
        if (session()) {
            try {
                const { data, error } = await supabase
                    .from("providerposts")
                    .select("*")
                    .eq("id", props.id);

                if (error) {
                    console.log(error);
                } else if (data === null) {
                    console.log("Post not found");
                } else {
                    setPost(data[0]);
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            alert(t('messages'))
            location.href = `/${lang}/login`
        }
    }

        return (
            <div>
                <h1>{post()?.title}</h1>
                <p>{post()?.content}</p>
            </div>
        );

    };
