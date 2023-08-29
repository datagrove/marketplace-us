import { supabase } from './supabaseClient'
import { Component, createSignal } from 'solid-js'
import { getLangFromUrl, useTranslations } from '../i18n/utils';

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

export const PasswordReset: Component = () => {
    const [loading, setLoading] = createSignal(false)
    const [email, setEmail] = createSignal('')


    return (
        <div class="bg-background1 dark:bg:background1-DM">
            <p class="text-sm text-ptext1 dark:text-ptext1-DM"> {t('messages.forgotPassword')} <a class="text-link2 hover:underline dark:text-link2-DM" href={`/${lang}/password/request`}>{t('buttons.reset')}</a></p>
        </div>
    )
}