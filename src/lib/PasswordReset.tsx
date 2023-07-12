import { supabase } from './supabaseClient'
import { Component, createSignal } from 'solid-js'

export const PasswordReset: Component = () => {
    const [loading, setLoading] = createSignal(false)
    const [email, setEmail] = createSignal('')


    return (
        <div>
            <p class="text-sm text-gray-600"> Forgot your password? Click here to <a class="text-blue-600 hover:underline dark:text-gray-200" href="/password_reset_request">Reset</a></p>
        </div>
    )
}