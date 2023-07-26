import { supabase } from '../../lib/supabaseClient'
import { Component, createSignal } from 'solid-js'
import { getLangFromUrl, useTranslations } from '../../i18n/utils';

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

export const SetNewPassword: Component = () => {
    const [loading, setLoading] = createSignal(false)
    const [password, setPassword] = createSignal('')

    const handleResetPassword = async (e: SubmitEvent) => {
        e.preventDefault()

        try {
            setLoading(true)
            const { data, error } = await supabase.auth.updateUser({password: password()})
            if (error) throw error
            if (data) {
              alert(t('messages.passwordReset'))
              location.href=`/${lang}`
            }
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
      <div class="row flex-center flex">
        <div class="col-6 form-widget" aria-live="polite">
          <form class="form-widget" onSubmit={handleResetPassword}>
            <div>
              <label for="password">{t('formLabels.password')}</label>
              <input
                id="password"
                class="inputField"
                type="password"
                placeholder={t('formLabels.password')}
                value={password()}
                onChange={(e) => setPassword(e.currentTarget.value)}
              />
            </div>
            <div>
              <button type="submit" class="button block" aria-live="polite">
                {loading() ? <span>{t('buttons.loading')}</span> : <span>{t('buttons.reset')}</span>}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
}