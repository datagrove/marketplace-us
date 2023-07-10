import { Component, createEffect, createSignal } from 'solid-js'
import { supabase } from '../../lib/supabaseClient'
import { currentSession } from '../../lib/userSessionStore'
import { useStore } from '@nanostores/solid'
import type { AuthSession } from '@supabase/supabase-js'

export const ProviderRegistration: Component = () => {
    const [session, setSession] = createSignal<AuthSession | null | undefined>(null)
    const [country, setCountry] = createSignal('')
    const [count, setCount] = createSignal(0)

    const sessionStore = currentSession.get()

    createEffect(() => {
        setSession(sessionStore)
    }, [count])

    console.log(sessionStore)

    // setSession(useStore(currentSession))
    
    console.log(session()?.user.id)

    createEffect(async () => {
        if (session) {
            try {
                const { data: countries, error } = await supabase.from('country').select('*').eq('user_id', session()?.user.id);
                if (error) {
                    console.log("supabase error: " + error.message)
                } else {
                    console.log(countries)
                }
            }
            catch (error) {
                console.log("Other error: " + error)
            }
        } else {
            console.log("No session")
        }
    
    }, [count])

    return (
    <div>  
        <p>Count: {count()}</p>
        <button onClick={() => setCount(count() + 1)}>Click</button>
    </div>
    );
}

