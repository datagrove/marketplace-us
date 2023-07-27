import { Component, createSignal } from 'solid-js'
import { supabase } from './supabaseClient'
import { currentSession } from './userSessionStore'
import { getLangFromUrl, useTranslations } from '../i18n/utils';

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

export const SignOut: Component = () => {
    const [loading, setLoading] = createSignal(false)

    const handleSignOut = async (e: SubmitEvent) => {
        e.preventDefault()

        try {
            setLoading(true)
            const { error } = await supabase.auth.signOut()
            if (error) {
                console.log(error)
            }
            currentSession.set(null)
            localStorage.clear()
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message)
            }
        } finally {
            setLoading(false)
            location.href = `/${lang}`
        }
    }

    return (
        <div>
            <form onSubmit={handleSignOut}>
            <button class="bg-btn1 hover:bg-btn1hov text-white font-bold py-2 px-4 rounded" type="submit">{t('buttons.signOut')}</button>
            </form>
        </div>
    )
}