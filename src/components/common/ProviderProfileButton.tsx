import { Component, createSignal, createEffect } from 'solid-js'
import { supabase } from '../../lib/supabaseClient'
import { currentSession } from '../../lib/userSessionStore'
import { useStore } from '@nanostores/solid'

import type { AuthSession } from '@supabase/supabase-js'
import { getLangFromUrl, useTranslations } from '../../i18n/utils';

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

export const ProviderProfileButton: Component = () => {
    const [providerProfile, setProviderProfile] = createSignal(null)
    const [user, setUser] = createSignal<AuthSession | null>(null)

    const providerRedirect = async (e: SubmitEvent) => {
        e.preventDefault()

        try {
            setUser(useStore(currentSession)())

            if (user() === null) {
                alert(t('messages.signIn'))
                location.href = `/${lang}/login`
            } else {
                const { data: provider, error: providerError } = await supabase.from('providers').select('*').eq('user_id', user()!.user.id)
                if (providerError) {
                    console.log("Error: " + providerError.message)
                } else if (!provider.length) {
                    alert(t('messages.viewProviderAccount'))
                    location.href = `/${lang}/provider/createaccount`
                } else {
                    location.href = `/${lang}/provider/profile`
                }

            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <form onSubmit={providerRedirect}>
                <button class="btn-primary" type="submit">{t("buttons.providerProfile")}</button>
            </form>
        </div>
    )
}