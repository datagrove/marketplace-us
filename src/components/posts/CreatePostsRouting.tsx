import { Show, createSignal } from "solid-js";
import supabase from "../../lib/supabaseClient";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";

const { data: User, error: UserError } = await supabase.auth.getSession();

// Internationalization

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

export const CreatePostsRouting = () => {
    const [isUserCreator, setIsUserCreator] = createSignal<boolean>(false);
    if (UserError) {
        console.log("User Error: " + UserError.message);
    }

    const postLink = document.getElementById("createPostLink");

    const isCreator = async () => {
        try {
            const { data, error } = await supabase
                .from("sellers")
                .select("*")
                .eq("user_id", User.session!.user.id);

            if (data![0]) {
                setIsUserCreator(true);
            }
        } catch (error) {
            console.log(error);
        }
    };

    isCreator();

    return (
        <Show when={isUserCreator()}>
            <a href={`/${lang}/posts/createpost`} class=" " id="createPostLink">
                {t("pageTitles.createPost")}
            </a>
        </Show>
    );
};
