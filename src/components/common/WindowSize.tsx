import type { Accessor } from "solid-js";
import {
    createSignal,
    createContext,
    useContext,
    onMount,
    onCleanup,
    Suspense,
    type JSX,
} from "solid-js";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

const setSize = () => {
    if (window.innerWidth <= 767) {
        return "sm";
    } else if (window.innerWidth > 767 && window.innerWidth < 1024) {
        return "md";
    } else if (window.innerWidth >= 1024 && window.innerWidth < 1280) {
        return "lg";
    } else if (window.innerWidth >= 1280 && window.innerWidth < 1536) {
         return "xl";
    } else {
        return "2xl";
    }
};

const [screenSize, setScreenSize] = createSignal<
        "sm" | "md" | "lg" | "xl" | "2xl"
    >(setSize());
export const WindowSizeContext = createContext();

export function WindowSizeProvider (props: any) {
    const [screenSize, setScreenSize] = createSignal<
        "sm" | "md" | "lg" | "xl" | "2xl"
    >(setSize());

    const resize = () => {
        setScreenSize(setSize());
        console.log(screenSize());
    }

    onMount(() => {
        window.addEventListener("resize", resize);
        setSize();
    });

    onCleanup(() => {
        window.removeEventListener("resize", resize);
    });

    return (
        <WindowSizeContext.Provider value={screenSize}>
            {props.children}
        </WindowSizeContext.Provider>
    );
};

export function useWindowSize() {
    const context = useContext(WindowSizeContext);
    if (!context) {
        throw new Error('Missing Context');
    } else return context;
}
