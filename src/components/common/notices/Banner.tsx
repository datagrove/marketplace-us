import type { Component, JSX } from "solid-js";
import { createSignal, createEffect, onCleanup, Show } from "solid-js";

type BannerProps = {
    content: string | JSX.Element;
    linkLocation?: string; //Optional link location
    linkLabel?: string; //Optional link label but required if you use link location
    startDate?: string; //Optional start date in YYYY-MM-DD format
    endDate?: string; // Optional end date in YYYY-MM-DD format
};

const Banner: Component<BannerProps> = (props) => {
    const [isInDateRange, setIsInDateRange] = createSignal(false);

    createEffect(() => {
        const today = new Date();
        const startDate = props.startDate ? new Date(`${props.startDate}T00:00:00`) : null;
        const endDate = props.endDate ? new Date(`${props.endDate}T23:59:59`) : null;

        if (startDate && endDate) {
            setIsInDateRange(today >= startDate && today <= endDate);
        } else if (startDate) {
            setIsInDateRange(today >= startDate);
        } else if (endDate) {
            setIsInDateRange(today <= endDate);
        } else {
            setIsInDateRange(true); // If no dates are provided, always render
        }
    });
    return (
        <>
            <Show when={isInDateRange()}>
                <Show when={props.linkLocation}>
                    <a
                        href={props.linkLocation}
                        aria-label={props.linkLabel}
                        target="_blank"
                    >
                        <div class="w-full bg-btn1-DM text-center">
                            <div class="prose mx-auto line-clamp-2 max-w-[calc(100vw-4rem)]">
                                {props.content}
                            </div>
                        </div>
                    </a>
                </Show>
                <Show when={!props.linkLocation}>
                    <div class="w-full bg-btn1-DM text-center">
                        <div class="prose mx-auto line-clamp-2 max-w-[calc(100vw-4rem)]">
                            {props.content}
                        </div>
                    </div>
                </Show>
            </Show>
        </>
    );
};

export default Banner;
