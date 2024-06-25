import type { Component } from "solid-js";
import {
    Suspense,
    createEffect,
    createResource,
    createSignal,
    onMount,
    For,
    Show,
} from "solid-js";
import supabase from "../../lib/supabaseClient";
import type { AuthSession } from "@supabase/supabase-js";
import UserImage from "./UserImage";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";
import stripe from "src/lib/stripe";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

async function createStripeAccount(formData: FormData) {
    const account = await stripe.accounts.create({
        type: "express",
        country: "US",
        //TODO: Prefill email
        email: formData.get("email") as string,
        settings: {
            payouts: {
                schedule: {
                    interval: "manual",
                },
            },
        },
    });
    formData.append("account_id", account.id);
    postStripeAccount(formData);
}

//Send the data to the APIRoute and wait for a JSON response see src/pages/api for APIRoute
async function postFormData(formData: FormData) {
    const response = await fetch("/api/creatorProfileSubmit", {
        method: "POST",
        body: formData,
    });
    const data = await response.json();
    if (data.redirect) {
        window.location.href = data.redirect;
    }
    if (response.status === 200) {
        createStripeAccount(formData);
    }
    return data;
}

async function postStripeAccount(stripeData: FormData) {
    const response = await fetch("/api/updateAccountStripe", {
        method: "POST",
        body: stripeData,
    });
    const data = await response.json();
    if (data.redirect) {
        window.location.href = data.redirect;
    }
    return data;
}

//Component that creates the form and collects the data
export const CreatorRegistration: Component = () => {
    const [session, setSession] = createSignal<AuthSession | null>(null);
    const [formData, setFormData] = createSignal<FormData>();
    const [response] = createResource(formData, postFormData);
    const [imageUrl, setImageUrl] = createSignal<string | null>(null);
    const [firstName, setFirstName] = createSignal<string>("");
    const [lastName, setLastName] = createSignal<string>("");
    const [email, setEmail] = createSignal<string>("");
    const [creatorName, setCreatorName] = createSignal<string>("");
    const [loading, setLoading] = createSignal(false);
    const [contributeOther, setContributeOther] = createSignal(false);
    const [contribution, setContribution] = createSignal<number>(15);

    createEffect(async () => {
        const { data, error } = await supabase.auth.getSession();
        setSession(data.session);

        //Create/Fill dropdown options for the form based on each selection if there is a session (Meaning the user is signed in)
        if (session()) {
            try {
                const { data: profile, error } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("user_id", session()!.user.id);
                if (error) {
                    console.log("supabase error: " + error.message);
                } else {
                    setFirstName(profile[0].first_name);
                    setLastName(profile[0].last_name);
                    setCreatorName(firstName() + " " + lastName());
                    setEmail(profile[0].email);
                }
            } catch (error) {
                console.log("Other error: " + error);
            }
            //If the user is not signed in then tell them to sign in and send them to the login page
        } else {
            alert(t("messages.createCreatorAccount"));
            location.href = `/${lang}/login`;
        }
    });

    function contributionButton(e: Event, contribution: number) {
        e.preventDefault();
        e.stopPropagation();

        setContribution(contribution);
    }
    //This happens with the form is submitted. Builds the form data to be sent to the APIRoute.
    //Must send the access_token and refresh_token to the APIRoute because the server can't see the local session
    function submit(e: SubmitEvent) {
        e.preventDefault();

        const formData = new FormData(e.target as HTMLFormElement);

        if (formData.get("CreatorName") === "") {
            formData.set("CreatorName", firstName() + " " + lastName());
        }

        formData.set("contribution", contribution().toString());
        formData.append("access_token", session()?.access_token!);
        formData.append("refresh_token", session()?.refresh_token!);
        formData.append("email", email());
        formData.append("lang", lang);

        if (imageUrl() !== null) {
            formData.append("image_url", imageUrl()!);
        }

        //Comment back out for testing
        setFormData(formData);

        //Comment in for testing
        // for (let pair of formData.entries()) {
        //   console.log(pair[0] + ", " + pair[1]);
        // }
    }

    // }

    //Actual Form that gets displayed for users to fill
    return (
        <div class="">
            <form onSubmit={submit}>
                <div class="mb-4">
                    <span class="text-alert1">* </span>
                    <span class="italic">{t("formLabels.required")}</span>
                </div>
                <div class="">
                    <div class="flex flex-row justify-between">
                        <label
                            for="FirstName"
                            class="text-ptext1 dark:text-ptext1-DM"
                        >
                            {t("formLabels.firstName")}:
                        </label>
                        <div class="group relative mr-2 flex items-center">
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
                                class="invisible absolute m-4 mx-auto w-48 -translate-x-full -translate-y-2/3 rounded-md bg-background2 
                        p-2 text-sm text-ptext2 transition-opacity peer-hover:visible dark:bg-background2-DM dark:text-ptext2-DM md:translate-x-1/4 md:translate-y-0"
                            >
                                {t("toolTips.firstNameEdit")}
                            </span>
                        </div>
                    </div>
                    <p
                        id="FirstName"
                        class="mb-4 w-full rounded border border-inputBorder1 bg-gray-100 px-1 text-gray-700 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:bg-background1-DM dark:text-ptext1-DM dark:focus:border-highlight1-DM"
                    >
                        {firstName()}
                    </p>
                </div>

                <div class="">
                    <div class="flex flex-row justify-between">
                        <label
                            for="LastName"
                            class="text-ptext1 dark:text-ptext1-DM"
                        >
                            {t("formLabels.lastName")}:
                        </label>
                        <div class="group relative mr-2 flex items-center">
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
                                class="invisible absolute m-4 mx-auto w-48 -translate-x-full -translate-y-2/3 rounded-md bg-background2 
                                p-2 text-sm text-ptext2 transition-opacity peer-hover:visible dark:bg-background2-DM dark:text-ptext2-DM md:translate-x-1/4 md:translate-y-0"
                            >
                                {t("toolTips.lastNameEdit")}
                            </span>
                        </div>
                    </div>
                    <p
                        id="LastName"
                        class="mb-4 w-full rounded border border-inputBorder1 bg-gray-100 px-1 text-gray-700 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:bg-background1-DM dark:text-ptext1-DM dark:focus:border-highlight1-DM"
                    >
                        {lastName()}
                    </p>
                </div>

                <div class="">
                    <div class="flex flex-row justify-between">
                        <label
                            for="CreatorName"
                            class="text-ptext1 dark:text-ptext1-DM"
                        >
                            {t("formLabels.creatorName")}:
                        </label>
                        <div class="group relative mr-2 flex items-center">
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
                                class="invisible absolute m-4 mx-auto w-48 -translate-x-full -translate-y-2/3 rounded-md bg-background2 
                                p-2 text-sm text-ptext2 transition-opacity peer-hover:visible dark:bg-background2-DM dark:text-ptext2-DM md:translate-x-1/4 md:translate-y-0"
                            >
                                {t("toolTips.displayName")}
                            </span>
                        </div>
                    </div>
                    <input
                        type="text"
                        id="CreatorName"
                        name="CreatorName"
                        placeholder={
                            firstName() +
                            " " +
                            lastName() +
                            " " +
                            t("formLabels.optional")
                        }
                        class="bg-background mb-4 w-full rounded border border-inputBorder1 px-1 text-ptext1 focus:border-2 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM dark:focus:border-highlight1-DM"
                        oninput={(e) => setCreatorName(e.target.value)}
                    />
                </div>

                <div class="flex justify-center">
                    <div class="mb-4 flex justify-center">
                        <UserImage
                            url={imageUrl()}
                            size={150}
                            onUpload={(e: Event, url: string) => {
                                setImageUrl(url);
                            }}
                        />
                    </div>

                    <div class="mb-4 flex justify-center">
                        <div class="">
                            <div class="flex flex-row justify-end">
                                <div class="group relative mr-2 flex items-center">
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
                                        class="invisible absolute m-4 mx-auto w-48 -translate-x-full -translate-y-2/3 rounded-md bg-background2 
                p-2 text-sm text-ptext2 transition-opacity peer-hover:visible dark:bg-background2-DM dark:text-ptext2-DM md:translate-x-1/4 md:translate-y-0"
                                    >
                                        {t("toolTips.profileImage")}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* aca  */}

                <div class="mb-2">
                    <div class="flex flex-row justify-between">
                        <label
                            for="contribution"
                            class="text-ptext1 dark:text-ptext1-DM"
                        >
                            {t("formLabels.platformSupport")}:
                            <div class="inline"> {contribution()}%</div>
                        </label>

                        <div class="group relative mr-2 flex items-center">
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
                                class="invisible absolute m-4 mx-auto w-48 -translate-x-full -translate-y-2/3 rounded-md bg-background2 
                                p-2 text-sm text-ptext2 transition-opacity peer-hover:visible dark:bg-background2-DM dark:text-ptext2-DM md:translate-x-1/4 md:translate-y-0"
                            >
                                {t("toolTips.contribution")}
                            </span>
                        </div>
                    </div>

                    <div class="flex justify-between">
                        <button
                            class="btn-primary"
                            onclick={(e) => contributionButton(e, 10)}
                        >
                            10%
                        </button>
                        <button
                            class="btn-primary"
                            onclick={(e) => contributionButton(e, 20)}
                        >
                            20%
                        </button>
                        <button
                            class="btn-primary"
                            onclick={(e) => contributionButton(e, 40)}
                        >
                            40%
                        </button>
                        <button
                            class="btn-primary"
                            onclick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setContributeOther(true);
                            }}
                        >
                            Other
                        </button>
                        <Show when={contributeOther()}>
                            <input
                                type="number"
                                min={0}
                                max={100}
                                step={1}
                                id="contribution"
                                name="contribution"
                                class="bg-background mt-2 w-full rounded border border-inputBorder1 px-1 text-ptext1 focus:border-2 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM dark:focus:border-highlight1-DM"
                                oninput={(e) =>
                                    setContribution(parseInt(e.target.value))
                                }
                            />
                        </Show>
                    </div>
                </div>

                <div class="flex justify-center">
                    <button
                        class={`${loading() ? "btn-disabled" : "btn-primary"}`}
                        onClick={() => setLoading(true)}
                    >
                        <Show when={!loading()} fallback={t("buttons.loading")}>
                            <p>{t("buttons.register")}</p>
                        </Show>
                    </button>
                </div>

                <Suspense>
                    {response() && (
                        <p class="mt-2 text-center font-bold text-alert1 dark:text-alert1-DM">
                            {response().message}
                        </p>
                    )}
                </Suspense>
            </form>
        </div>
    );
};
