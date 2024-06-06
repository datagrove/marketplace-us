import { AuthMode } from "./AuthMode";
import { CreatorProfileButton } from "./CreatorProfileButton";
import { CreatePostsRouting } from "../posts/CreatePostsRouting";
import { UserRouting } from "../members/UserRouting";
import supabase from "../../lib/supabaseClient";
import { Auth } from "../../lib/Auth";
import { Show, createSignal } from "solid-js";
import { CreatorRegistration } from "../members/CreatorRegistration";
import { CreatorRegistrationRouting } from "../members/CreatorRegistrationRouting";
import { LanguagePicker } from "./LanguagePicker";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";
import { ThemeBtn } from "./ThemeIcon";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

const { data: User, error: UserError } = await supabase.auth.getSession();
export const MobileProfileBtn = () => {
    const [isUser, setIsUser] = createSignal<boolean | null>(false);

    if (User.session === null) {
        // console.log("User don't exist");
    } else {
        setIsUser(User.session!.user.role === "authenticated");
    }

    function clickHandler() {
        const listShow = document.getElementById("mobileProfileItems");
        if (listShow?.classList.contains("hidden")) {
            listShow?.classList.remove("hidden");
            console.log(document.getElementById("mobileProfileBtnBackdrop"));
            document
                .getElementById("mobileProfileBtnBackdrop")
                ?.classList.remove("hidden");
        } else {
            listShow?.classList.add("hidden");
        }
    }

    if (UserError) {
        console.log("User Error: " + UserError.message);
    }

    function hideMenu() {
        console.log("hiding menu");
        document.getElementById("mobileProfileItems")?.classList.add("hidden");
        document
            .getElementById("mobileProfileBtnBackdrop")
            ?.classList.add("hidden");
    }

    function renderWhenUser() {
        if (isUser()) {
            return (
                <div class="">
                    <div class="border-b-2 border-border1 pb-2 dark:border-border1-DM">
                        <UserRouting />
                    </div>
                    <div class="mt-2 border-b-2 border-border1 pb-2 dark:border-border1-DM">
                        <div>
                            <CreatorRegistrationRouting />
                        </div>
                        <CreatePostsRouting />
                    </div>
                </div>
            );
        }
    }

    // ADD EMAIL TO SEND FOR CONTACT US

    return (
        <div class="">
            <button
                onclick={clickHandler}
                class=" flex rounded-lg border-border1 dark:border-border1-DM md:mr-0 md:border"
                aria-label={t("ariaLabels.navigation")}
            >
                <svg
                    class="mr-2 hidden h-4 w-4 fill-icon1 dark:fill-icon1-DM md:block"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M16 15.503A5.041 5.041 0 1 0 16 5.42a5.041 5.041 0 0 0 0 10.083zm0 2.215c-6.703 0-11 3.699-11 5.5v3.363h22v-3.363c0-2.178-4.068-5.5-11-5.5z" />
                </svg>
                <svg
                    class="h-8 w-8 md:h-4 md:w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M4 5C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H4ZM3 12C3 11.4477 3.44772 11 4 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H4C3.44772 13 3 12.5523 3 12ZM3 18C3 17.4477 3.44772 17 4 17H20C20.5523 17 21 17.4477 21 18C21 18.5523 20.5523 19 20 19H4C3.44772 19 3 18.5523 3 18Z"
                        fill="currentColor"
                    />
                </svg>
            </button>
            <div
                id="mobileProfileBtnBackdrop"
                class="absolute left-0 top-0 hidden h-full w-screen"
                onClick={() => hideMenu()}
            >
                {/* This allows that if someone clicks anywhere outside the modal the modal will hide */}
            </div>
            <ul
                id="mobileProfileItems"
                class="fixed left-2 z-50 m-2 hidden justify-start rounded-lg bg-background1 p-2 shadow-md shadow-shadow-LM dark:bg-background1-DM dark:shadow-shadow-DM"
            >
                {renderWhenUser()}
                <div class="mt-2 border-b-2 border-border1 pb-2 dark:border-border1-DM">
                    <a href={`/${lang}/faq`}>{t("buttons.faq")}</a>
                </div>
                <div class="mt-2">
                    <div>
                        <a href={`/${lang}`}>{t("pageTitles.home")}</a>
                    </div>
                    <div>
                        <a href={`mailto:MAIL@.com`}>{t("menus.contactUs")}</a>
                    </div>
                    <AuthMode />
                </div>
                <div class="mt-2 inline-block">
                    <div class="inline-block">
                        <LanguagePicker />
                    </div>
                    <div class="inline-block">
                        <ThemeBtn />
                    </div>
                </div>
            </ul>
        </div>
    );
};
