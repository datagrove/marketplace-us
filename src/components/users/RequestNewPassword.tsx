import { Component, createSignal } from 'solid-js'
import { supabase } from '../../lib/supabaseClient'

export const NewPassword: Component = () => {
  const [loading, setLoading] = createSignal(false)
  const [email, setEmail] = createSignal('')


  const handleReset = async (e: SubmitEvent) => {
    e.preventDefault()

    try {
        setLoading(true)
        const { data, error } = await supabase.auth.resetPasswordForEmail(email(), { redirectTo: "http://localhost:3000/password_reset" })
        if (error) throw error
    } catch (error) {
        if (error instanceof Error) {
            alert(error.message)
        }
    } finally {
        setLoading(false)
        alert("Check your email for the reset link!")
    }
}

    

  return (
    <div>
        <div class="row flex-center flex">
        <div class="col-6 form-widget" aria-live="polite">
          <form class="form-widget" onSubmit={handleReset}>
            <div>
              <label for="email">Email</label>
              <input
                id="email"
                class="inputField"
                type="email"
                placeholder="Your email"
                value={email()}
                onChange={(e) => setEmail(e.currentTarget.value)}
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
  </div>
  )
}