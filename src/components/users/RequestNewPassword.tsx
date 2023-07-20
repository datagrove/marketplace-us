import { Component, createSignal } from 'solid-js'
import { supabase } from '../../lib/supabaseClient'
import { SITE } from '../../config'
// import '../../styles/global.css';

export const NewPassword: Component = () => {
  const [loading, setLoading] = createSignal(false)
  const [email, setEmail] = createSignal('')


  const handleReset = async (e: SubmitEvent) => {
    e.preventDefault()

    try {
        setLoading(true)
        const { data, error } = await supabase.auth.resetPasswordForEmail(email(), { redirectTo: SITE + "/password_reset" })
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
      <div class="row flex flex-col">
        <div class="col-6 form-widget" aria-live="polite">
          <form class="form-widget" onSubmit={handleReset}>
            <div class="p-2 w-full">
              <label 
                for="email"
                class="px-2 text-secondaryText"
              >
                Email
              </label>
              <input
                id="email"
                class="inputField rounded px-1"
                type="email"
                placeholder="Your email"
                value={email()}
                onChange={(e) => setEmail(e.currentTarget.value)}
              />
            </div>
            <div class="flex justify-center">
              <button 
                type="submit" 
                class="button block" 
                aria-live="polite"
              >
                {loading() ? <span>Loading</span> : <span class="text-text1">Reset</span>}
              </button>
            </div>
          </form>
        </div>
      </div>
  </div>
  )
}