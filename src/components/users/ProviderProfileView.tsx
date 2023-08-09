import { Component, createSignal, createEffect, Show } from "solid-js";
import { supabase } from "../../lib/supabaseClient";
import { ViewProviderPosts } from "../../components/posts/ViewProviderPosts";
import { EditProfileButton } from "../../components/users/EditProfileButton";
import type { AuthSession } from "@supabase/supabase-js";
import { ui } from '../../i18n/ui'
import type { uiObject } from '../../i18n/uiType';
import { getLangFromUrl, useTranslations } from '../../i18n/utils';

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

//get the categories from the language files so they translate with changes in the language picker
const values = ui[lang] as uiObject
const productCategories = values.productCategoryInfo.categories

interface Provider {
    provider_name: string;
    provider_id: number;
    provider_phone: string;
    major_municipality: string;
    minor_municipality: string;
    governing_district: string;
    user_id: string;
    image_url: string | null;
    email: string;
    created_at: string;
    first_name: string;
    last_name: string;
    country: string | null;
}


const { data: User, error: UserError } = await supabase.auth.getSession();

export const ProviderProfileView: Component = () => {
    const [provider, setProvider] = createSignal<Provider>();
    const [session, setSession] = createSignal<AuthSession | null>(null);
    const [providerImage, setProviderImage] = createSignal<string>();

    createEffect(() => {
        setSession(User.session);
        if (typeof session() !== "undefined") {
            fetchProvider(session()?.user.id!);
        }
    }
    );

    const fetchProvider = async (user_id: string) => {
        if (session()) {
            try {
                const { data, error } = await supabase
                    .from("providerview")
                    .select("*")
                    .eq("user_id", user_id);

                if (error) {
                    console.log(error);
                } else if (data[0] === undefined) {
                    alert(t('messages.noProvider'));
                    location.href = `/${lang}/services`
                } else {
                    console.log(data)
                    setProvider(data[0]);
                    console.log(provider())
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            alert(t('messages.signIn'))
            location.href = `/${lang}/login`
        }
    }

    createEffect(async () => {
        console.log("downloading images")
        if (provider() !== undefined) {
            if (provider()?.image_url === undefined || provider()?.image_url === null) {
                console.log("No Image")
                console.log(providerImage())
            } else {
                await downloadImage(provider()?.image_url!)
            }
        }
    })

    const downloadImage = async (image_Url: string) => {
        try {
            const { data, error } = await supabase.storage
                .from("user.image")
                .download(image_Url);
            if (error) {
                throw error;
            }
            const url = URL.createObjectURL(data);
            setProviderImage(url);
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div class="mb-6 md:grid md:grid-cols-5 md:gap-6">
            <div class="md:col-span-1 md:drop-shadow-lg md:border md:border-border md:dark:border-border-DM md:mt-4 md:rounded-md md:h-fit md:p-4 break-after-column justify-center">
                <h2 class="text-xl text-text1 dark:text-text1-DM pb-4 font-bold">
                    {provider()?.provider_name}
                </h2>
                <div class="flex justify-center mb-3">
                <Show when={typeof providerImage() !== "undefined"}>
                    <div class="relative w-48 h-48 overflow-hidden rounded-full md:h-24 md:w-24 lg:h-36 lg:w-36 object-contain justify-center border border-red-500">
                        <img
                            src={providerImage()}
                            class="absolute block -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 object-contain justify-center h-56 md:h-96"
                            alt={`${t('postLabels.ProviderProfileImage')} 1`} />
                    </div>
                </Show>
                </div>

                <label for="FirstName" class="text-text2 dark:text-text1-DM">{t('formLabels.firstName')}:
                    <p class="rounded w-full mb-4 px-1 focus:border-btn1 dark:focus:border-btn1-DM border-2 border-border dark:border-border-DM focus:outline-none">{provider()?.first_name}</p>

                </label>

                <label for="LastName" class="text-text2 dark:text-text1-DM">{t('formLabels.lastName')}:
                    <p class="rounded w-full mb-4 px-1 focus:border-btn1 dark:focus:border-btn1-DM border-2 border-border dark:border-border-DM focus:outline-none">{provider()?.last_name}</p>
                </label>


                <label for="ProviderName" class="text-text1 dark:text-text1-DM">{t('formLabels.providerName')}:
                    <p class="rounded w-full mb-4 px-1 focus:border-btn1 dark:focus:border-btn1-DM border-2 border-border dark:border-border-DM focus:outline-none">{provider()?.provider_name ? provider()?.provider_name : t('formLabels.noValue')}</p>
                </label>

                <div class="">
                    <label for="Email" class="text-text1 dark:text-text1-DM">{t('formLabels.email')}:
                        {/* I would like this to have a tool tip that lets them know that they can't change the email because it is associated with their account. */}
                        <p class="w-full rounded mb-4 px-1 focus:border-btn1 dark:focus:border-btn1-DM border-2 border-border dark:border-border-DM focus:outline-none break-words">{provider()?.email}</p>
                    </label>
                </div>

                <div class="w-full overflow-auto mb-4">
                    <label for="Email" class="text-text1 dark:text-text1-DM">{t('formLabels.email')}:
                        {/* I would like this to have a tool tip that lets them know that they can't change the email because it is associated with their account. */}
                        <p class="rounded px-1 focus:border-btn1 dark:focus:border-btn1-DM border-2 border-border dark:border-border-DM focus:outline-none">{provider()?.email}</p>
                    </label>
                </div>

                <label for="Phone" class="text-text1 dark:text-text1-DM">{t('formLabels.phone')}:
                    <p class="rounded w-full mb-4 px-1 focus:border-btn1 dark:focus:border-btn1-DM border-2 border-border dark:border-border-DM focus:outline-none">{provider()?.provider_phone}</p>
                </label>

                <label for="country" class="text-text1 dark:text-text1-DM">{t('formLabels.country')}:
                    <p class="rounded w-full px-1 focus:border-btn1 dark:focus:border-btn1-DM border-2 border-border dark:border-border-DM focus:outline-none">{provider()?.country}</p>
                </label>

                <br />

                <label for="MajorMunicipality" class="text-text1 dark:text-text1-DM">{t('formLabels.majorMunicipality')}:
                    <p class="rounded w-full px-1 focus:border-btn1 dark:focus:border-btn1-DM border-2 border-border dark:border-border-DM focus:outline-none">{provider()?.major_municipality}</p>
                </label>

                <br />

                <label for="MinorMunicipality" class="text-text1 dark:text-text1-DM">{t('formLabels.minorMunicipality')}:
                    <p class="rounded w-full px-1 focus:border-btn1 dark:focus:border-btn1-DM border-2 border-border dark:border-border-DM focus:outline-none">{provider()?.minor_municipality}</p>
                </label>

                <br />

                <label for="GoverningDistrict" class="text-text1 dark:text-text1-DM">{t('formLabels.governingDistrict')}:
                    <p class="rounded w-full px-1 focus:border-btn1 dark:focus:border-btn1-DM border-2 border-border dark:border-border-DM focus:outline-none">{provider()?.governing_district}</p>
                </label>
            </div>
            <div class="md:col-span-4">
                <div class="flex justify-end">
                    <a class="btn-primary mx-6" href={`/${lang}/posts/createpost`}>{t('pageTitles.createPost')}</a>
                    <EditProfileButton />
                </div>
                <div class="my-6">
                    <ViewProviderPosts />
                </div>
            </div>

        </div>
    );

};
