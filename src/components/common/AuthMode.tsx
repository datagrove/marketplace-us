import { Component, createSignal, createEffect } from 'solid-js'
import { supabase } from '../../lib/supabaseClient'
import { currentSession } from '../../lib/userSessionStore'
import { useStore } from '@nanostores/solid'
import { SignOut } from '../../lib/sign_out'
import { getLangFromUrl, useTranslations } from '../../i18n/utils';
import '../../styles/global.css'

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

export const AuthMode: Component = () => {
    const [authMode, setAuthMode] = createSignal<"signed_in"|"signed_out">("signed_in")

    createEffect (() => {
        supabase.auth.onAuthStateChange((_event, session) => {
            currentSession.set(session)
            console.log(authMode())
        })

        if (useStore(currentSession)() === null) {
            setAuthMode("signed_out")
         } else if (useStore(currentSession)() !== null) {
             setAuthMode("signed_in")
         }

    })
   
    
    return (
        <div>
          {/* If the auth mode is sign in then return the sign in button */}
          {authMode() === "signed_in" ? (
            <SignOut />
          ) : (
            //Else if the auth mode is sign up then return the sign out button
            authMode() === "signed_out" ? (
                <div>
                <form>
                <button class="btn-primary" type="submit" formaction="/login">{t('pageTitles.signIn')}</button>
                </form>
            </div>
            ): (
              // Else return an error if it is neither auth mode
              "Error")
              )}
        
      </div>
      )
    }