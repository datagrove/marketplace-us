import { supabase } from '../../lib/supabaseClient'
import { Component, createSignal } from 'solid-js'

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
              alert("Password Reset")
              location.href="/"
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
              <label for="password">Password</label>
              <input
                id="password"
                class="inputField"
                type="password"
                placeholder="password"
                value={password()}
                onChange={(e) => setPassword(e.currentTarget.value)}
              />
            </div>
            <div>
              <button type="submit" class="button block" aria-live="polite">
                {loading() ? <span>Loading</span> : <span>Reset</span>}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
}