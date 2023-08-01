import { Component, createSignal } from 'solid-js'
import { supabase } from '../../lib/supabaseClient'
import { SITE } from '../../config'
import { getLangFromUrl, useTranslations } from '../../i18n/utils';

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

export const NewPassword: Component = () => {
  const [loading, setLoading] = createSignal(false)
  const [email, setEmail] = createSignal('')


  const handleReset = async (e: SubmitEvent) => {
    e.preventDefault()

    try {
        setLoading(true)
        const { data, error } = await supabase.auth.resetPasswordForEmail(email(), { redirectTo: SITE.url + `/${lang}/password_reset` })
        if (error) throw error
    } catch (error) {
        if (error instanceof Error) {
            alert(error.message)
        }
    } finally {
        setLoading(false)
        alert(t('messages.checkEmail'))
        location.href=`/${lang}`
    }
}

    

  return (
    <div>
      <div class="row flex flex-col bg-background1 dark:bg-background1-DM">
        <div class="col-6 form-widget" aria-live="polite">
          <form class="form-widget" onSubmit={handleReset}>
            <div class="p-2 w-full">
              <label 
                for="email"
                class="px-2 text-text1 dark:text-text1-DM"
              >
                {t('formLabels.email')}
              </label>
              <input
                id="email"
                class="inputField border border-border dark:border-border-DM rounded px-1"
                type="email"
                placeholder={t('formLabels.email')}
                value={email()}
                onChange={(e) => setEmail(e.currentTarget.value)}
              />
            </div>
            <div class="flex justify-center">
              <button 
                type="submit" 
                class="button block border border-border dark:border-border-DM bg-btn1 dark:bg-btn1-DM px-4 rounded-full my-2 hover:bg-btn1hov dark:hover:bg-btn1hov-DM" 
                aria-live="polite"
              >
                {loading() ? <span>{t('buttons.loading')}</span> : <span class="text-text2 dark:text-text2-DM">{t('buttons.reset')}</span>}
              </button>
            </div>
          </form>
        </div>
      </div>
  </div>
  )
}