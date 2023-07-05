import { Component, createSignal } from 'solid-js'
import { supabase } from './supabaseClient'

export const Auth: Component = () => {
  const [loading, setLoading] = createSignal(false)
  const [email, setEmail] = createSignal('')
  const [password, setPassword] = createSignal('')
  const [confirmPassword, setConfirmPassword] = createSignal('')
  const [passwordMatch, setPasswordMatch] = createSignal(false)
  const [authMode, setAuthMode] = createSignal<"sign_in"|"sign_up">("sign_in")

  if (password() !== confirmPassword()) {
    setPasswordMatch(false)
  } else (setPasswordMatch(true))

  const handleLogin = async (e: SubmitEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOtp({ email: email() })
      if (error) throw error
      alert('Check your email for the login link!')
      location.href="/"
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: SubmitEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      const { error } = await supabase.auth.signUp({ email: email(), password: password() })
      if (error) throw error
      alert('Check your email for the login link!')
      location.href="/"
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
        <h1 class="header">Create an account</h1>
        <form class="form-widget" onSubmit={handleLogin}>
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
            <label for="confirm password">Confirm Password</label>
            <input
              id="confirm password"
              class="inputField"
              type="password"
              placeholder="password"
              value={confirmPassword()}
              onChange={(e) => setConfirmPassword(e.currentTarget.value)}
            />
          </div>
          <div>
            <button type="submit" class="button block" aria-live="polite" disabled={passwordMatch()}>
              {passwordMatch() ? '' : <span>Passwords Do Not Match</span> }
              {loading() ? <span>Loading</span> : <span>Sign Up</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}