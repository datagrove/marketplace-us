import { atom } from 'nanostores'
import type { AuthSession } from '@supabase/supabase-js'

export const currentSession = atom<AuthSession | null>(null);