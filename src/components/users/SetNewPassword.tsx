import { supabase } from '../../lib/supabaseClient'
import { Component, createSignal } from 'solid-js'
import { getLangFromUrl, useTranslations } from '../../i18n/utils';

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

export const SetNewPassword: Component = () => {
  const [loading, setLoading] = createSignal(false)
  const [password, setPassword] = createSignal('')
  const [confirmPassword, setConfirmPassword] = createSignal('')
  const [passwordMatch, setPasswordMatch] = createSignal(false)
  const match = () => password() === confirmPassword()

  const handleResetPassword = async (e: SubmitEvent) => {
    e.preventDefault()

    if (password() === confirmPassword()) {
      setPasswordMatch(true)
      try {
        setLoading(true)
        const { data, error } = await supabase.auth.updateUser({ password: password() })
        if (error) throw error
        if (data) {
          alert(t('messages.passwordReset'))
          location.href = `/${lang}`
        }
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message)
        }
      } finally {
        setLoading(false)
      }
    } else {
      setPasswordMatch(false);
      alert(t('messages.passwordMatch'));
    }
  }

  return (
    <div class="row flex flex-col">
      <div class="col-6 form-widget" aria-live="polite">
        <form class="form-widget" onSubmit={handleResetPassword}>
          <div class="mb-1 flex justify-center">
            <label
              for="password"
              class="hidden"
            >
              {t('formLabels.password')}
            </label>
            <input
              id="password"
              class="inputField  ml-2 rounded-md pl-2 w-5/6 border border-border1 dark:border-border1-DM"
              type="password"
              placeholder={t('formLabels.password')}
              value={password()}
              oninput={(e) => setPassword(e.currentTarget.value)}
              aria-describedby='pwlength'
            />
          </div>
          <div class="mb-4 flex justify-center">
            {password().length > 5 ? '' : <span id='pwlength' class="text-sm text-ptext1 dark:text-ptext1-DM"> {t('messages.passwordLength')}</span>}
          </div>
          <div class="mb-1 flex justify-center">
            <label for="confirm password" class="hidden">{t('formLabels.confirmPassword')}</label>
            <input
              id="confirm password"
              class="inputField ml-2 rounded-md pl-2 w-5/6 border border-border1 dark:border-border1-DM"
              type="password"
              placeholder={t('formLabels.confirmPassword')}
              required
              value={confirmPassword()}
              oninput={(e) => setConfirmPassword(e.currentTarget.value)}
              aria-describedby='pwconfirm'
            />
          </div>
          <div class="mb-4 flex justify-center">
            {match() ? '' : <span id="pwconfirm" class="text-sm text-ptext1 dark:text-ptext1-DM">{t('messages.passwordMatch')}</span>}
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
  )
}