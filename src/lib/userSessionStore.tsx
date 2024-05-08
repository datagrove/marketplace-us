import { persistentAtom } from "@nanostores/persistent";
import type { AuthSession } from "@supabase/supabase-js";

export const currentSession = persistentAtom<AuthSession | null>(
    "session",
    null,
    {
        encode: JSON.stringify,
        decode: JSON.parse,
    }
);
