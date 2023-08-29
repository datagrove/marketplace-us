import { Component, createSignal, createEffect, Show } from "solid-js";
import { supabase } from "../../lib/supabaseClient";
import { ClientViewProviderPosts } from "../posts/ClientViewProviderPosts";
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
}

interface Props {
    id: string | undefined;
}

const { data: User, error: UserError } = await supabase.auth.getSession();

export const ClientProviderView: Component<Props> = (props) => {
    const [provider, setProvider] = createSignal<Provider>();
    const [session, setSession] = createSignal<AuthSession | null>(null);
    const [providerImage, setProviderImage] = createSignal<string>();

    createEffect(() => {
        if (props.id === undefined) {
            location.href = `/${lang}/404`
        } else if (props.id) {
            setSession(User.session);
            fetchProvider(+props.id);
        }
    });

    const fetchProvider = async (id: number) => {
        if (session()) {
            try {
                const { data, error } = await supabase
                    .from("providerview")
                    .select("*")
                    .eq("provider_id", id);

                if (error) {
                    console.log(error);
                } else if (data[0] === undefined) {
                    alert(t('messages.noProvider'));
                    location.href = `/${lang}/services`
                } else {
                    setProvider(data[0]);
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
        <div class="m-2 md:grid md:grid-cols-5 md:gap-2">

            {/* Left column for md+ View */}
            <div class="md:col-span-2 md:drop-shadow-lg border border-border1 dark:border-border1-DM md:mt-4 rounded-md md:h-fit md:px-4 md:pb-4 break-after-column justify-center">

                {/* Container for Mobile View */}
                <div class="container">
                    {/* Provider Info for Mobile View*/}
                    <details class="bg-background1 dark:bg-black shadow rounded group md:hidden">
                        <summary class="list-none flex flex-wrap items-center cursor-pointer rounded group-open:rounded-b-none group-open:z-[1] relative">
                            <h2 class="flex flex-1 p-4 font-bold">{t('formLabels.providerInfo')}</h2>
                            {/*Creates the Dropdown Arrow*/}
                            <div class="flex w-10 items-center justify-center">
                                <div class="border-8 border-transparent border-l-border1 dark:border-l-border1-DM ml-2 group-open:rotate-90 transition-transform"></div>
                            </div>
                        </summary>
                        <div class="p-4">
                            <h2 class="text-xl text-ptext1 dark:text-ptext1-DM pb-4 font-bold">
                                {provider()?.provider_name == '' ? provider()?.first_name + ' ' + provider()?.last_name : provider()?.provider_name}
                            </h2>
                            <div class="flex justify-center mb-3">
                                <Show when={typeof providerImage() !== "undefined"}>
                                    <div class="relative w-48 h-48 overflow-hidden rounded-full md:h-48 md:w-48 lg:h-64 lg:w-64 object-contain justify-center border border-border1 dark:border-border1-DM">
                                        <img
                                            src={providerImage()}
                                            class="absolute block -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 object-contain justify-center h-56 md:h-96"
                                            alt={`${t('postLabels.ProviderProfileImage')} 1`} />
                                    </div>
                                </Show>
                            </div>
                            <p class="my-1">
                                <span class="font-bold">{t('postLabels.location')}</span>{provider()?.major_municipality}/{provider()?.minor_municipality}/
                                {provider()?.governing_district}
                            </p>
                            <div class="mt-4 flex justify-center">
                                <a href={`mailto:${provider()?.email}`} class="btn-primary">{t('buttons.contact')}</a>
                            </div>
                            <div class="mt-4 flex justify-center">
                                <a href={`tel:${provider()?.provider_phone}`} class="btn-primary">{t('buttons.phone')}</a>
                            </div>
                        </div>
                    </details>

                    {/* Provider Posts for Mobile View*/}
                    <details class="bg-background1 dark:bg-background1-DM shadow rounded group md:hidden" open>
                        <summary class="list-none flex flex-wrap items-center cursor-pointer rounded group-open:rounded-b-none group-open:z-[1] relative">
                        <h2 class="flex flex-1 p-4 font-bold text-ptext1 dark:text-ptext1-DM">{t('formLabels.posts')}</h2>
                        {/*Creates the Dropdown Arrow*/}
                        <div class="flex w-10 items-center justify-center">
                                <div class="border-8 border-transparent border-l-border1 dark:border-l-border1-DM ml-2 group-open:rotate-90 transition-transform"></div>
                            </div>
                        </summary>
                        <div class='p-4'>
                            <div class="my-6">
                                <ClientViewProviderPosts id={props.id} />
                            </div>
                        </div>
                    </details>
                </div>

                {/* Profile Information for md+ View */}
                <div class="hidden md:block">
                    <h2 class="text-xl text-ptext1 dark:text-ptext1-DM py-4 font-bold">
                        {provider()?.provider_name == '' ? provider()?.first_name + ' ' + provider()?.last_name : provider()?.provider_name}
                    </h2>
                    <div class="flex justify-center mb-3">
                        <Show when={typeof providerImage() !== "undefined"}>
                            <div class="relative w-48 h-48 overflow-hidden rounded-full md:h-48 md:w-48 lg:h-64 lg:w-64 object-contain justify-center border border-border1 dark:border-border1-DM">
                                <img
                                    src={providerImage()}
                                    class="absolute block -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 object-contain justify-center h-56 md:h-96"
                                    alt={`${t('postLabels.ProviderProfileImage')} 1`} />
                            </div>
                        </Show>
                    </div>
                    <p class="my-1">
                        <span class="font-bold">{t('postLabels.location')}</span>{provider()?.major_municipality}/{provider()?.minor_municipality}/
                        {provider()?.governing_district}
                    </p>
                    <div class="mt-4 flex justify-center">
                        <a href={`mailto:${provider()?.email}`} class="btn-primary">{t('buttons.contact')}</a>
                    </div>
                    <div class="mt-4 flex justify-center">
                        <a href={`tel:${provider()?.provider_phone}`} class="btn-primary">{t('buttons.phone')}</a>
                    </div>
                </div>
            </div>

            {/* Right column Post View for md+ View */}
            <div class="md:col-span-3">
                <div class="my-4"></div>
                <div class="hidden md:block">
                    <ClientViewProviderPosts id={props.id} />
                </div>
            </div>
        </div>
    );

};
