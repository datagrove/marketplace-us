import { supabase } from './supabaseClient'
import { Component, createSignal } from 'solid-js'
import { getLangFromUrl, useTranslations } from '../i18n/utils';

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

export const PasswordReset: Component = () => {
    const [loading, setLoading] = createSignal(false)
    const [email, setEmail] = createSignal('')


    return (
        <div class="bg-primaryBackground">
            <p class="text-sm text-gray-600"> {t('messages.forgotPassword')} <a class="text-blue-600 hover:underline dark:text-gray-200" href={`/${lang}/password_reset_request`}>{t('buttons.reset')}</a></p>
        </div>
    )
}