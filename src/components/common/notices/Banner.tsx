import type { Component, JSX } from "solid-js";
import { createSignal, createEffect, onCleanup, Show } from "solid-js";

type BannerProps = {
    content: string | JSX.Element;
    linkLocation: string;
    linkLabel: string;
};

const Banner: Component<BannerProps> = (props) => {
    return (
        <>
        <a href={props.linkLocation} aria-label={props.linkLabel} target="_blank">
            <div class="w-full bg-btn1-DM text-center">
                <div class="max-w-[calc(100vw-4rem)] mx-auto prose line-clamp-2">{props.content}</div>
            </div>
        </a>
        </>
    );
};

export default Banner;
