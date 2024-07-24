import type { Component, JSX } from "solid-js";
import { createSignal, createEffect, onCleanup, Show, onMount } from "solid-js";

type BannerProps = {
    content: string | JSX.Element;
    linkLocation?: string; //Optional link location
    linkLabel?: string; //Optional link label but required if you use link location
    startDate?: string; //Optional start date in YYYY-MM-DD format
    endDate?: string; // Optional end date in YYYY-MM-DD format
};

const Banner: Component<BannerProps> = (props) => {
    const [isInDateRange, setIsInDateRange] = createSignal(false);
    const [bannerState, setBannerState] = createSignal<boolean>(false);
    const [bannerStateTimestamp, setBannerStateTimestamp] =
        createSignal<number>(Date.parse('01 Jan 1970 00:00:00 GMT'));

    onMount(() => {
        //Check if the banner was last dismissed more than  30 days ago, if so clear the local storage for banner
        const todayLess30Days = new Date().getTime() - (30 * 24 * 60 * 60 * 1000);
        if(localStorage.getItem("bannerDismissedTimestamp") !== null) {
            if (parseInt(localStorage.getItem("bannerDismissedTimestamp")!) < todayLess30Days) {
                localStorage.removeItem("bannerDismissedTimestamp");
            }
        }

        //If the banner is dismissed and the timestamp is set in local storage then set bannerState to true and set timestamp
        if (localStorage.getItem("bannerDismissed") !== null && localStorage.getItem("bannerDismissedTimestamp") !== null) {
            setBannerState(localStorage.getItem("bannerDismissed") === "true");
            setBannerStateTimestamp(parseInt(localStorage.getItem("bannerDismissedTimestamp")!));
        }

        //If there is a start date for this banner and it is after the last time the banner was dismissed then remove the local storage for banner
        if(props.startDate) {
            const startDate = new Date(`${props.startDate}T00:00:00`);
            const startIndex = Date.parse(startDate.toString());
            if (startIndex > bannerStateTimestamp()) {
                setBannerState(false);
                setBannerStateTimestamp(Date.parse('01 Jan 1970 00:00:00 GMT'));
                localStorage.removeItem("bannerDismissed");
                localStorage.removeItem("bannerDismissedTimestamp");
            }
        }
    });

    createEffect(() => {
        const today = new Date();
        const startDate = props.startDate
            ? new Date(`${props.startDate}T00:00:00`)
            : null;
        const endDate = props.endDate
            ? new Date(`${props.endDate}T23:59:59`)
            : null;

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

    function closeBanner(e: Event) {
        e.preventDefault();
        e.stopPropagation();
        setBannerState(true);
        localStorage.setItem("bannerDismissed", "true");
        localStorage.setItem("bannerDismissedTimestamp", Date.now().toString());
    }

    return (
        <>
            <Show when={isInDateRange() && !bannerState()}>
                <Show when={props.linkLocation}>
                    <a
                        href={props.linkLocation}
                        aria-label={props.linkLabel}
                        target="_blank"
                    >
                        <div class="w-full bg-btn1-DM text-center flex relative">
                            <div class="prose mx-auto line-clamp-2 max-w-[calc(100vw-4rem)]">
                                {props.content}
                            </div>
                            <button
                                aria-label="Close Banner"
                                class="banner__close text-xl inline-block absolute right-3 top-1/2 -translate-y-1/2 -translate-x-1/2"
                                onClick={(e) => closeBanner(e)}
                            >
                                &times;
                            </button>
                        </div>
                        
                    </a>
                </Show>
                <Show when={!props.linkLocation}>
                    <div class="w-full bg-btn1-DM text-center">
                        <div class="prose mx-auto line-clamp-2 max-w-[calc(100vw-4rem)]">
                            {props.content}
                        </div>
                        <button
                            aria-label="Close Banner"
                            class="banner__close text-xl"
                            onClick={(e) => closeBanner(e)}
                        >
                            &times;
                        </button>
                    </div>
                </Show>
            </Show>
        </>
    );
};

export default Banner;
