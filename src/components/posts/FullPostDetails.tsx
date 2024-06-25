import type { Component } from "solid-js";
import {Show } from "solid-js";
import { ViewFullPost } from "@components/posts/FullPostView";
import { MobileViewFullPost } from "@components/posts/MobileFullPostView";
import { useStore } from "@nanostores/solid";
import { windowSize } from "@components/common/WindowSizeStore";

interface Props {
    postId: string | undefined;
}

export const FullPostDetails: Component<Props> = (props: Props) => {
    const screenSize = useStore(windowSize);
    return (
        <div class="w-full">
            <Show when={screenSize() !== "sm"}>
            <div class="w-full flex justify-center">
                <ViewFullPost postId={props.postId}/>
            </div>
            </Show>

            <Show when={screenSize() === "sm"}>
            <div class="w-full flex justify-center">
                <MobileViewFullPost postId={props.postId} />
            </div>
            </Show>
        </div>
    )
}