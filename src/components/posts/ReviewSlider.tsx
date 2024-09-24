import { getLangFromUrl, useTranslations } from "@i18n/utils";
import type { DragOptions } from "@neodrag/solid";
import {
    createEffect,
    createResource,
    createSignal,
    onMount,
    Suspense,
    Show,
    type Component,
} from "solid-js";
import { createDraggable } from "@neodrag/solid";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

interface Props {
    resourceId: number | null;
    selectedReviewValue: number | null;
}

export const ReviewSlider: Component<Props> = (props) => {
    const { draggable } = createDraggable();

    const options: DragOptions = {
        axis: "x",
        bounds: "parent",
        grid: [40, 40],
    };

    return (
        <div class="my-2 flex w-[210px] items-center border border-green-500">
            <div
                use:draggable={options}
                id="thumb"
                class="relative h-4 w-2 cursor-pointer rounded-sm border border-gray-500 bg-white"
            ></div>
            <div class="h-2 w-[194px] rounded-sm bg-gray-200"></div>
        </div>
    );
};
