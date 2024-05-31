import { createSignal } from "solid-js";
import supabase from "../../lib/supabaseClient";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";

const { data: User, error: UserError } = await supabase.auth.getSession();

// Internationalization

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

export const CreatorRegistrationRouting = () => {
    const [isUserCreator, setIsUserCreator] = createSignal<boolean>(false);
    const [creatorRouting, setCreatorRouting] = createSignal<string>(
        `/${lang}/creator/createaccount`
    );
    const [createText, setCreateText] = createSignal<string>(
        t("pageTitles.createCreatorAccount")
    );

    const createCreatorProfileLink = document.getElementById(
        "createCreatorAccount"
    );
    const isCreator = async () => {
        try {
            const { data, error } = await supabase
                .from("sellers")
                .select("*")
                .eq("user_id", User.session!.user.id);

            setIsUserCreator(true);
            if (data![0]) {
                setCreateText(t("pageTitles.viewCreatorAccount"));
                setCreatorRouting(`/${lang}/creator/profile`);
            }
        } catch (error) {
            console.log(error);
        }
    };

    isCreator();

    return (
        <a href={creatorRouting()} class="" id="createEditCreatorProfile">
            {createText()}
        </a>
    );
};
