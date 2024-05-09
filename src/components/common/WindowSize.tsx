
import type { Component } from "solid-js";
import { windowSize } from "@components/common/WindowSizeStore";
import { onMount, onCleanup } from "solid-js";

export const WindowSize: Component = () => {
    

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

const handleResize = () => {
    windowSize.set(setSize());
}

onMount(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
})

onCleanup(() => {
    window.removeEventListener("resize", handleResize);
})

return (null)

}
