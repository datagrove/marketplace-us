import { getLangFromUrl, useTranslations } from "@i18n/utils";
import type { DragOptions } from '@neodrag/solid';
import {
    createEffect,
    createResource,
    createSignal,
    onMount,
    Suspense,
    Show,
    type Component,
} from "solid-js";
import { createDraggable } from '@neodrag/solid';

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

interface Props {
    resourceId: number | null;
    selectedReviewValue: number | null;
}

export const ReviewSlider: Component<Props> = (props) => {
    const { draggable } = createDraggable();

    const options: DragOptions = {
        axis: 'x',
        bounds: 'parent',
        grid: [40, 40],
    };


    return (
        <div class="w-[210px] border border-green-500 my-2 flex items-center">
            <div use:draggable={ options } id="thumb" class="w-2 h-4 border border-gray-500 rounded-sm bg-white cursor-pointer relative"></div>
            <div class="w-[194px] h-2 rounded-sm bg-gray-200"></div>   
        </div>
    )
}