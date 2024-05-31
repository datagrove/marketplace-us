import type { Component } from "solid-js";
import { createEffect, createSignal } from "solid-js";
import supabase from "./supabaseClient";
import { currentSession } from "./userSessionStore";
import { getLangFromUrl, useTranslations } from "../i18n/utils";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

export const Auth: Component = (props) => {
    // @ts-ignore
    const { mode = "sign_in" } = props;
    const [loading, setLoading] = createSignal(false);
    const [email, setEmail] = createSignal("");
    const [password, setPassword] = createSignal("");
    const [firstName, setFirstName] = createSignal("");
    const [lastName, setLastName] = createSignal("");
    const [confirmPassword, setConfirmPassword] = createSignal("");
    const [passwordMatch, setPasswordMatch] = createSignal(false);
    const match = () => password() === confirmPassword();
    const [authMode, setAuthMode] = createSignal<"sign_in" | "sign_up">(mode);
    const lang = getLangFromUrl(new URL(window.location.href));
    const t = useTranslations(lang);
    const regularExpressionPassword =
        /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    const regularExpressionEmail = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    const handleLogin = async (e: SubmitEvent) => {
        e.preventDefault();

        try {
            setLoading(true);
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email(),
                password: password(),
            });
            if (error) throw error;
            currentSession.set(data.session);
            // const test = useStore(currentSession)
            // console.log("Current Session: " + test()?.user.aud)
            location.href = `/${lang}/resources`;
        } catch (error) {
            if (error instanceof Error) {
                switch (error.message) {
                    case "Email not confirmed":
                        alert(t("apiErrors.emailNotConfirmed"));
                        break;
                    default:
                        alert(error.message);
                }
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async (e: SubmitEvent) => {
        e.preventDefault();

        if (
            regularExpressionPassword.test(password()) &&
            regularExpressionEmail.test(email())
        ) {
            if (password() === confirmPassword()) {
                setPasswordMatch(true);
                try {
                    setLoading(true);
                    const { data, error } = await supabase.auth.signUp({
                        email: email(),
                        password: password(),
                        options: {
                            data: {
                                first_name: firstName(),
                                last_name: lastName(),
                            },
                        },
                    });

                    let profileSubmission = {
                        user_id: data.user?.id,
                        first_name: data.user?.user_metadata.first_name,
                        last_name: data.user?.user_metadata.last_name,
                        email: data.user?.email,
                    };

                    const { data: profileData, error: profileError } =
                        await supabase
                            .from("profiles")
                            .insert([profileSubmission]);
                    if (profileError) {
                        console.log(profileError.message);
                        alert(t("apiErrors.profileCreateError"));
                        return;
                    }

                    let userSubmission = {
                        display_name: null,
                        user_id: data.user?.id,
                        image_url: null,
                    };

                    const { data: userData, error: userError } =
                        await supabase
                            .from("users")
                            .insert([userSubmission]);
                    if (userError) {
                        console.log(userError.message);
                        alert(t("apiErrors.userCreateProfileError"));
                        return;
                    }

                    if (error) throw error;
                    alert(t("messages.checkConfirmEmail"));
                    if (data && data.user) {
                        if (
                            data.user.identities &&
                            data.user.identities.length > 0 &&
                            data.session === null
                        ) {
                            const { error } = await supabase.auth.resend({
                                type: "signup",
                                email: email(),
                            });
                            if (error) console.log(error);
                        }
                    }
                    location.href = `/${lang}`;
                } catch (error) {
                    if (error instanceof Error) {
                        alert(error.message);
                    }
                } finally {
                    setLoading(false);
                }
            } else {
                setPasswordMatch(false);
                alert(t("messages.passwordMatch"));
            }
        } else if (
            !regularExpressionEmail.test(password()) &&
            !regularExpressionPassword.test(email())
        ) {
            alert(t("messages.passwordLackRequirements"));
            alert(t("messages.emailLackRequirements"));
        } else if (!regularExpressionEmail.test(password())) {
            alert(t("messages.passwordLackRequirements"));
        } else if (!regularExpressionPassword.test(email())) {
            alert(t("messages.emailLackRequirements"));
        }
    };

    return (
        <div>
            {/* If the auth mode is sign in then return the sign in form */}
            {authMode() === "sign_in" ? (
                <div class="row flex-center flex">
                    <div class="col-6 form-widget" aria-live="polite">
                        <form class="form-widget" onSubmit={handleLogin}>
                            <div class="mb-4 flex justify-center">
                                <label class="hidden" for="email">
                                    {t("formLabels.email")}
                                </label>
                                <input
                                    id="email"
                                    class="inputField ml-2 w-5/6 rounded-md border border-inputBorder1 bg-background1 pl-2 text-ptext1 focus:border-2 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM dark:focus:border-highlight1-DM"
                                    type="email"
                                    placeholder={t("formLabels.email")}
                                    value={email()}
                                    onChange={(e) =>
                                        setEmail(e.currentTarget.value)
                                    }
                                />
                            </div>
                            <div class="mb-4 flex justify-center">
                                <label class="hidden" for="password">
                                    {t("formLabels.password")}
                                </label>
                                <input
                                    id="password"
                                    class="inputField ml-2 w-5/6 rounded-md border border-inputBorder1 bg-background1 pl-2 text-ptext1 focus:border-2 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM dark:focus:border-highlight1-DM"
                                    type="password"
                                    placeholder={t("formLabels.password")}
                                    value={password()}
                                    onChange={(e) => {
                                        setPassword(e.currentTarget.value);
                                    }}
                                />
                            </div>
                            <div class="mb-4 flex justify-center">
                                <button
                                    type="submit"
                                    class="btn-primary"
                                    aria-live="polite"
                                >
                                    {loading() ? (
                                        <span>{t("buttons.loading")}</span>
                                    ) : (
                                        <span>{t("buttons.login")}</span>
                                    )}
                                </button>
                            </div>
                            <div>
                                <p class="text-sm text-ptext1 dark:text-ptext1-DM">
                                    {" "}
                                    {t("messages.noAccount")}
                                    <a
                                        class="text-link1 hover:underline dark:text-link1-DM"
                                        href={`/${lang}/signup`}
                                    >
                                        {t("buttons.signUp")}
                                    </a>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            ) : //Else if the auth mode is sign up then return the sign up form
            authMode() === "sign_up" ? (
                <div class="row flex-center flex">
                    <div class="col-6 form-widget" aria-live="polite">
                        <form class="form-widget" onSubmit={handleSignUp}>
                            <div class="mb-1 flex justify-center">
                                <div class="group relative flex w-5/6 justify-end">
                                    <svg
                                        class="peer h-4 w-4 rounded-full border-2 border-border1 bg-icon1 fill-iconbg1  dark:border-none dark:bg-background1-DM dark:fill-iconbg1-DM"
                                        version="1.1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 512 512"
                                    >
                                        <g>
                                            <path
                                                d="M255.992,0.008C114.626,0.008,0,114.626,0,256s114.626,255.992,255.992,255.992
                                    C397.391,511.992,512,397.375,512,256S397.391,0.008,255.992,0.008z M300.942,373.528c-10.355,11.492-16.29,18.322-27.467,29.007
                                    c-16.918,16.177-36.128,20.484-51.063,4.516c-21.467-22.959,1.048-92.804,1.597-95.449c4.032-18.564,12.08-55.667,12.08-55.667
                                    s-17.387,10.644-27.709,14.419c-7.613,2.782-16.225-0.871-18.354-8.234c-1.984-6.822-0.404-11.161,3.774-15.822
                                    c10.354-11.484,16.289-18.314,27.467-28.999c16.934-16.185,36.128-20.483,51.063-4.524c21.467,22.959,5.628,60.732,0.064,87.497
                                    c-0.548,2.653-13.742,63.627-13.742,63.627s17.387-10.645,27.709-14.427c7.628-2.774,16.241,0.887,18.37,8.242
                                    C306.716,364.537,305.12,368.875,300.942,373.528z M273.169,176.123c-23.886,2.096-44.934-15.564-47.031-39.467
                                    c-2.08-23.878,15.58-44.934,39.467-47.014c23.87-2.097,44.934,15.58,47.015,39.458
                                    C314.716,152.979,297.039,174.043,273.169,176.123z"
                                            />
                                        </g>
                                    </svg>

                                    <span
                                        class="invisible absolute z-10 m-4 mx-auto w-48 -translate-x-0 -translate-y-0 rounded-md 
                                bg-background2 p-2 text-sm text-ptext2 transition-opacity peer-hover:visible dark:bg-background2-DM dark:text-ptext2-DM md:translate-x-52 md:translate-y-0"
                                    >
                                        {t("toolTips.firstName")}
                                    </span>
                                </div>
                            </div>
                            <div class="mb-1 flex justify-center">
                                <label class="hidden" for="firstName">
                                    {t("formLabels.firstName")}
                                </label>
                                <input
                                    id="firstName"
                                    class="inputField ml-2 w-5/6 rounded-md border border-inputBorder1 bg-background1 pl-2 text-ptext1 focus:border-2 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM dark:focus:border-highlight1-DM"
                                    type="text"
                                    placeholder={t("formLabels.firstName")}
                                    required
                                    value={firstName()}
                                    onChange={(e) =>
                                        setFirstName(e.currentTarget.value)
                                    }
                                />
                            </div>

                            <div class="mb-1 flex justify-center">
                                <div class="group relative flex w-5/6 justify-end">
                                    <svg
                                        class="peer h-4 w-4 rounded-full border-2 border-border1 bg-icon1 fill-iconbg1  dark:border-none dark:bg-background1-DM dark:fill-iconbg1-DM"
                                        version="1.1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 512 512"
                                    >
                                        <g>
                                            <path
                                                d="M255.992,0.008C114.626,0.008,0,114.626,0,256s114.626,255.992,255.992,255.992
                                    C397.391,511.992,512,397.375,512,256S397.391,0.008,255.992,0.008z M300.942,373.528c-10.355,11.492-16.29,18.322-27.467,29.007
                                    c-16.918,16.177-36.128,20.484-51.063,4.516c-21.467-22.959,1.048-92.804,1.597-95.449c4.032-18.564,12.08-55.667,12.08-55.667
                                    s-17.387,10.644-27.709,14.419c-7.613,2.782-16.225-0.871-18.354-8.234c-1.984-6.822-0.404-11.161,3.774-15.822
                                    c10.354-11.484,16.289-18.314,27.467-28.999c16.934-16.185,36.128-20.483,51.063-4.524c21.467,22.959,5.628,60.732,0.064,87.497
                                    c-0.548,2.653-13.742,63.627-13.742,63.627s17.387-10.645,27.709-14.427c7.628-2.774,16.241,0.887,18.37,8.242
                                    C306.716,364.537,305.12,368.875,300.942,373.528z M273.169,176.123c-23.886,2.096-44.934-15.564-47.031-39.467
                                    c-2.08-23.878,15.58-44.934,39.467-47.014c23.87-2.097,44.934,15.58,47.015,39.458
                                    C314.716,152.979,297.039,174.043,273.169,176.123z"
                                            />
                                        </g>
                                    </svg>

                                    <span
                                        class="invisible absolute m-4 mx-auto w-48 -translate-x-0 translate-y-0 rounded-md bg-background2 
                                p-2 text-sm text-ptext2 transition-opacity peer-hover:visible dark:bg-background2-DM dark:text-ptext2-DM md:translate-x-52 md:translate-y-0"
                                    >
                                        {t("toolTips.lastName")}
                                    </span>
                                </div>
                            </div>
                            <div class="mb-5 flex justify-center">
                                <label class="hidden" for="lastName">
                                    {t("formLabels.lastName")}
                                </label>
                                <input
                                    id="lastName"
                                    class="inputField ml-2 w-5/6 rounded-md border border-inputBorder1 bg-background1 pl-2 text-ptext1 focus:border-2 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM dark:focus:border-highlight1-DM"
                                    type="text"
                                    placeholder={t("formLabels.lastName")}
                                    required
                                    value={lastName()}
                                    onChange={(e) =>
                                        setLastName(e.currentTarget.value)
                                    }
                                />
                            </div>
                            <div class="mb-5 flex justify-center">
                                <label class="hidden" for="email">
                                    {t("formLabels.email")}
                                </label>
                                <input
                                    id="email"
                                    class="inputField ml-2 w-5/6 rounded-md border border-inputBorder1 bg-background1 pl-2 text-ptext1 focus:border-2 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM dark:focus:border-highlight1-DM"
                                    type="email"
                                    placeholder={t("formLabels.email")}
                                    required
                                    value={email()}
                                    onChange={(e) =>
                                        setEmail(e.currentTarget.value)
                                    }
                                />
                            </div>

                            <div class="mb-1 flex justify-center">
                                <label for="password" class="hidden">
                                    {t("formLabels.password")}
                                </label>
                                <input
                                    id="password"
                                    class="inputField ml-2 w-5/6 rounded-md border border-inputBorder1 bg-background1 pl-2 text-ptext1 focus:border-2 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM dark:focus:border-highlight1-DM"
                                    type="password"
                                    placeholder={t("formLabels.password")}
                                    required
                                    value={password()}
                                    oninput={(e) =>
                                        setPassword(e.currentTarget.value)
                                    }
                                    aria-describedby="pwlength"
                                />
                            </div>
                            <div class="mb-4 flex justify-center">
                                {regularExpressionPassword.test(password()) ? (
                                    <span
                                        id="pwlength"
                                        class="text-sm text-ptext1 dark:text-ptext1-DM "
                                    >
                                        {t("messages.passwordValid")}
                                    </span>
                                ) : (
                                    <span
                                        id="pwlength"
                                        class="whitespace-pre-wrap text-sm text-ptext1 dark:text-ptext1-DM"
                                    >
                                        {t("messages.passwordLength")}
                                    </span>
                                )}
                            </div>
                            <div class="mb-1 flex justify-center">
                                <label for="confirm password" class="hidden">
                                    {t("formLabels.confirmPassword")}
                                </label>
                                <input
                                    id="confirm password"
                                    class="inputField ml-2 w-5/6 rounded-md border border-inputBorder1 bg-background1 pl-2 text-ptext1 focus:border-2 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM dark:focus:border-highlight1-DM"
                                    type="password"
                                    placeholder={t(
                                        "formLabels.confirmPassword"
                                    )}
                                    required
                                    value={confirmPassword()}
                                    oninput={(e) =>
                                        setConfirmPassword(
                                            e.currentTarget.value
                                        )
                                    }
                                    aria-describedby="pwconfirm"
                                />
                            </div>
                            <div class="mb-4 flex justify-center">
                                {match() ? (
                                    ""
                                ) : (
                                    <span
                                        id="pwconfirm"
                                        class="text-sm font-bold text-alert1 dark:text-alert1-DM"
                                    >
                                        {t("messages.passwordMatch")}
                                    </span>
                                )}
                            </div>
                            <div class="px-10">
                                {t("messages.clickWrap1")}{" "}
                                <span class="font-medium">
                                    {t("pageTitles.signUp")}
                                </span>{" "}
                                {t("messages.clickWrap2")}{" "}
                                <a
                                    href={`/${lang}/terms`}
                                    target="_blank"
                                    class="text-link2-DM hover:underline"
                                >
                                    {t("pageTitles.terms")}
                                </a>{" "}
                                &{" "}
                                <a
                                    href={`/${lang}/privacy`}
                                    target="_blank"
                                    class="text-link2-DM hover:underline"
                                >
                                    {t("pageTitles.privacy")}
                                </a>
                            </div>
                            <div class="mb-4 flex justify-center">
                                <button
                                    type="submit"
                                    class="btn-primary mt-4"
                                    aria-live="polite"
                                    disabled={!match()}
                                >
                                    {loading() ? (
                                        <span>{t("buttons.loading")}</span>
                                    ) : (
                                        <span>{t("pageTitles.signUp")}</span>
                                    )}
                                </button>
                            </div>

                            <div class="my-2">
                                <p class="text-ptext1 dark:text-ptext1-DM">
                                    {t("messages.alreadyAccount")}
                                    <span> </span>
                                    <a
                                        class="text-link2 hover:underline dark:text-link2-DM"
                                        href={`/${lang}/login`}
                                    >
                                        {t("buttons.signIn")}
                                    </a>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            ) : (
                // Else return an error if it is neither auth mode
                "Error"
            )}
        </div>
    );
};
