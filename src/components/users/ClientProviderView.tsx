import { Component, createSignal, createEffect, Show } from "solid-js";
import { supabase } from "../../lib/supabaseClient";
import { DeletePostButton } from "../posts/DeletePostButton";
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
                    alert(t('messages.noPost')); //TODO change this message
                    location.href = `/${lang}/services`
                } else {
                    console.log(data)
                    // data?.map(async (item) => {
                    //     productCategories.forEach(productCategories => {
                    //         if (item.service_category.toString() === productCategories.id) {
                    //             item.category = productCategories.name
                    //         }
                    //     })
                    //     delete item.service_category
                    // })
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
        <div>
            <h2 class="text-xl text-text1 dark:text-text1-DM pb-4 font-bold">
                {provider()?.provider_name}
            </h2>
            <div class="relative w-full">
                <div class="relative h-56 overflow-hidden rounded-lg md:h-96">
                    <div class="slide duration-700 ease-in-out">
                        <img
                            src={providerImage()}
                            class="absolute block -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 object-contain"
                            alt={`${t('postLabels.image')} 1`} />
                    </div>
                </div>
            </div>
            <p class="my-1">
                <span class="font-bold">{t('postLabels.location')}</span>{provider()?.major_municipality}/{provider()?.minor_municipality}/
                {provider()?.governing_district}
            </p>
            <div class="mt-4">
                <a href={`mailto:${provider()?.email}`} class="btn-primary">{t('buttons.contact')}</a>
            </div>
            <div class="mt-4">
                <a href={`mailto:${provider()?.provider_phone}`} class="btn-primary">{t('buttons.contact')}</a>
                {/* TODO switch label to Call */}
            </div>
        </div>
    );

};
