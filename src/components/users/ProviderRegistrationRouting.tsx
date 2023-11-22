import { createSignal } from "solid-js";
import { supabase } from "../../lib/supabaseClient";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";

const { data: User, error: UserError } = await supabase.auth.getSession();

// Internationalization

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

export const ProviderRegistrationRouting = () => {
    const [isUserProvider, setIsUserProvider] = createSignal<boolean>(false);
    const [providerRouting, setProviderRouting] = createSignal<string>(
        `/${lang}/provider/createaccount`
    );
    const [createText, setCreateText] = createSignal<string>(
        t("pageTitles.createProviderAccount")
    );

    const createProviderProfileLink = document.getElementById(
        "createProviderAccount"
    );
    const isProvider = async () => {
        try {
            const { data, error } = await supabase
                .from("providers")
                .select("*")
                .eq("user_id", User.session!.user.id);

            setIsUserProvider(true);
            if (data![0]) {
                setCreateText(t("pageTitles.viewProviderAccount"));
                setProviderRouting(`/${lang}/provider/profile`);
            }
        } catch (error) {
            console.log(error);
        }
    };

    isProvider();

    return (
        <a href={providerRouting()} class="" id="createEditProviderProfile">
            {createText()}
        </a>
    );
};
