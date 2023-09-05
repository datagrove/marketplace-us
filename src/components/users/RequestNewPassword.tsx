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
        const { data, error } = await supabase.auth.resetPasswordForEmail(email(), { redirectTo: SITE.url + `/${lang}/password/reset` })
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
      <div class="row flex flex-col">
        <div class="col-6 form-widget" aria-live="polite">
          <form class="form-widget" onSubmit={handleReset}>
            <div class="mb-4 flex justify-center">
              <label 
                for="email"
                class="hidden"
              >
                {t('formLabels.email')}
              </label>
              <input
                id="email"
                class="inputField ml-2 rounded-md pl-2 w-5/6 border px-1 focus:border-highlight1 dark:focus:border-highlight1-DM focus:border-2 border-inputBorder1 dark:border-inputBorder1-DM focus:outline-none bg-background1 dark:bg-background2-DM text-ptext1 dark:text-ptext2-DM"
                type="email"
                placeholder={t('formLabels.email')}
                value={email()}
                onChange={(e) => setEmail(e.currentTarget.value)}
              />
            </div>
            <div class="flex justify-center">
              <button 
                type="submit" 
                class="btn-primary" 
                aria-live="polite"
              >
                {loading() ? <span>{t('buttons.loading')}</span> : <span>{t('buttons.reset')}</span>}
              </button>
            </div>
          </form>
        </div>
      </div>
  </div>
  )
}