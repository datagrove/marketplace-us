import { Show, createSignal } from "solid-js";
import supabase from "../../lib/supabaseClient";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";

// Internationalization
const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

//

const { data: User, error: UserError } = await supabase.auth.getSession();
export const UserRouting = () => {
    const [isUser, setIsUser] = createSignal<boolean>(false);
    const [isUserUser, setIsUserUser] = createSignal<boolean>(false);
    const [createText, setCreateText] = createSignal<string>(
        t("pageTitles.createUserAccount")
    );
    const [routing, setRouting] = createSignal<string>(
        `/${lang}/user/profile`
    );

    const CreateEditUserProfilelink = document.getElementById(
        "createEditUserProfileLink"
    );

    setIsUser(User.session!.user.role === "authenticated");

    if (UserError) {
        console.log("User Error: " + UserError.message);
    }

    const isUserMember = async () => {
        try {
            const { data, error } = await supabase
                .from("users")
                .select("*")
                .eq("user_id", User.session!.user.id);

            if (data![0] === undefined) {
                // console.log("user is not a user");
            } else {
                setCreateText(t("pageTitles.viewUserAccount"));
                setRouting(`/${lang}/user/profile`);
                setIsUserUser(true);
            }
        } catch (error) {
            console.log(error);
        }
    };

    isUserMember();

    return (
        <Show when={isUser}>
            <div>
                <a href={`/${lang}/resources`} class=" ">
                    {t("menus.resources")}
                </a>
            </div>
            <a class=" " id="createEditUserProfileLink" href={routing()}>
                {createText()}
            </a>
        </Show>
    );
};
