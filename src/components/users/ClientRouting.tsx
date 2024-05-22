import { Show, createSignal } from "solid-js";
import supabase from "../../lib/supabaseClient";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";

// Internationalization
const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

//

const { data: User, error: UserError } = await supabase.auth.getSession();
export const ClientRouting = () => {
    const [isUser, setIsUser] = createSignal<boolean>(false);
    const [isUserClient, setIsUserClient] = createSignal<boolean>(false);
    const [createText, setCreateText] = createSignal<string>(
        t("pageTitles.createClientAccount")
    );
    const [routing, setRouting] = createSignal<string>(
        `/${lang}/client/createaccount`
    );

    const CreateEditClientProfilelink = document.getElementById(
        "createEditClientProfileLink"
    );

    setIsUser(User.session!.user.role === "authenticated");

    if (UserError) {
        console.log("User Error: " + UserError.message);
    }

    const isClient = async () => {
        try {
            const { data, error } = await supabase
                .from("clients")
                .select("*")
                .eq("user_id", User.session!.user.id);

            if (data![0] === undefined) {
                // console.log("user is not a client");
            } else {
                setCreateText(t("pageTitles.viewClientAccount"));
                setRouting(`/${lang}/client/profile`);
                setIsUserClient(true);
            }
        } catch (error) {
            console.log(error);
        }
    };

    isClient();

    return (
        <Show when={isUser}>
            <div>
                <a href={`/${lang}/resources`} class=" ">
                    {t("menus.resources")}
                </a>
            </div>
            <a class=" " id="createEditClientProfileLink" href={routing()}>
                {createText()}
            </a>
        </Show>
    );
};
