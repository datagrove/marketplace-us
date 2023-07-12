import { Component, createSignal } from 'solid-js'
import { supabase } from './supabaseClient'
import { currentSession } from './userSessionStore'
import { useStore } from '@nanostores/solid'

export const Auth: Component = (props) => {
  // @ts-ignore
  const { mode = "sign_in" } = props;
  const [loading, setLoading] = createSignal(false)
  const [email, setEmail] = createSignal('')
  const [password, setPassword] = createSignal('')
  const [confirmPassword, setConfirmPassword] = createSignal('')
  const [passwordMatch, setPasswordMatch] = createSignal(false)
  const match = () => password() === confirmPassword()
  const [authMode, setAuthMode] = createSignal<"sign_in"|"sign_up">(mode)

  const handleLogin = async (e: SubmitEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({ email: email(), password: password() })
      if (error) throw error
      currentSession.set(data.session)
      const test = useStore(currentSession)
      console.log("Current Session: " + test()?.user.aud)
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

    if (password() === confirmPassword()) {
      setPasswordMatch(true)
      try {
        setLoading(true)
        const { error } = await supabase.auth.signUp({ email: email(), password: password() })
        if (error) throw error
        alert('Check your email for the confirmation link!')
        location.href="/"
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message)
        }
      } finally {
        setLoading(false)
      }
    } else {
      setPasswordMatch(false);
      alert('Passwords do not match');
    }
  }

    

  return (
    <div>
      {/* If the auth mode is sign in then return the sign in form */}
      {authMode() === "sign_in" ? (
        <div class="row flex-center flex">
        <div class="col-6 form-widget" aria-live="polite">
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
              <button type="submit" class="button block" aria-live="polite">
                {loading() ? <span>Loading</span> : <span>Login</span>}
              </button>
            </div>
            <div>
              <p class="text-sm text-gray-600"> Don't have an account? Click here to <a class="text-blue-600 hover:underline dark:text-gray-200" href="/signup">sign up</a></p>
            </div>
          </form>
        </div>
      </div>
      ) : (
        //Else if the auth mode is sign up then return the sign up form
        authMode() === "sign_up" ? (
          <div class="row flex-center flex">
      <div class="col-6 form-widget" aria-live="polite">
        <h1 class="header">Create an account</h1>
        <div>
          <p class="text-sm text-gray-600">Already have an account? Click here to <a class="text-blue-600 hover:underline dark:text-gray-200" href="/login">sign in</a></p>
        </div>
        <form class="form-widget" onSubmit={handleSignUp}>
          <div>
            <label for="email">Email</label>
            <input
              id="email"
              class="inputField"
              type="email"
              placeholder="Your email"
              required
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
              required
              value={password()}
              oninput={(e) => setPassword(e.currentTarget.value)}
            />
          </div>
          <div>
          {password().length>5 ? '' : <p class="text-sm text-gray-600"> Passwords must be at least 6 characters</p>}
          </div>
          <div>
            <label for="confirm password">Confirm Password</label>
            <input
              id="confirm password"
              class="inputField"
              type="password"
              placeholder="password"
              required
              value={confirmPassword()}
              oninput={(e) => setConfirmPassword(e.currentTarget.value)}
            />
          </div>
          <div>
          {match() ? '' : <span>Passwords do not match</span>}
          </div>
          <div>
            <button type="submit" class="button block" aria-live="polite" disabled={!match()}>
              {loading() ? <span>Loading</span> : <span>Sign Up</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
        ): (
          // Else return an error if it is neither auth mode
          "Error")
          )}
    
  </div>
  )
}