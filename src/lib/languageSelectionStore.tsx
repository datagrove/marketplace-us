import { persistentAtom } from "@nanostores/persistent";

export const currentLanguage = persistentAtom<string>("en");
