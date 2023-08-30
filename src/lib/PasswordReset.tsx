import { supabase } from './supabaseClient'
import { Component, createSignal } from 'solid-js'
import { getLangFromUrl, useTranslations } from '../i18n/utils';

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

export const PasswordReset: Component = () => {
    const [loading, setLoading] = createSignal(false)
    const [email, setEmail] = createSignal('')


    return (
        <div class="bg-background1 dark:bg-background1-DM">
            <p class="text-sm text-ptext1 dark:text-ptext1-DM"> {t('messages.forgotPassword')} <a class="text-link1 hover:underline dark:text-link1-DM" href={`/${lang}/password/request`}>{t('buttons.reset')}</a></p>
        </div>
    )
}