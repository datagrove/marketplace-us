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
            <p class="text-sm text-text1 dark:text-text1-DM"> {t('messages.forgotPassword')} <a class="text-link2 hover:underline dark:text-link2-DM" href={`/${lang}/password_reset_request`}>{t('buttons.reset')}</a></p>
        </div>
    )
}