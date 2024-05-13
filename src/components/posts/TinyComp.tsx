import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { createStore } from "solid-js/store";

import tinymce, { type Editor } from "tinymce";

//New tiny imports

import "tinymce/models/dom";

import "tinymce/themes/silver";

import "tinymce/icons/default";

import "tinymce/plugins/lists";

import "tinymce/plugins/quickbars";

interface Props {
    id: string;
    mode: string | null;
}

export const TinyComp = (props: Props) => {
    const [mode, setMode] = createSignal(props.mode); // Moved inside the component's body

    const currentEditor = tinymce.get(props.id);

    const initializeTinyMCE = async () => {
        console.log(tinymce.get(props.id));

        if (currentEditor) {
            currentEditor.destroy();
            console.log("tinymce destroyed");
        }
        console.log("intializing tinymce " + mode());
        tinymce.init({
            selector: props.id,
            max_width: 384,
            skin_url:
                mode() === "dark"
                    ? "/tinymce/skins/ui/oxide-dark"
                    : "/tinymce/skins/ui/oxide",
            content_css:
                mode() === "dark"
                    ? "/tinymce/skins/content/dark/content.min.css"
                    : "/tinymce/skins/content/default/content.min.css",
            promotion: false,
            plugins: "lists, quickbars",
            quickbars_image_toolbar: false,
            quickbars_insert_toolbar: false,
            toolbar: [
                "undo redo | bold italic |alignleft aligncenter alignright",
                "styles bullist numlist outdent indent",
            ],
            toolbar_mode: "wrap",
            statusbar: false,
            setup: function (editor) {
                editor.on("change", function () {
                    tinymce.triggerSave();
                });
            },
        });
    };

    onMount(() => {
        const script = document.createElement("script");
        script.src = "/tinymce/tinymce.min.js";
        script.async = true;
        script.onload = () => {
            const listPlugin = document.createElement("script");
            listPlugin.src = "/tinymce/plugins/lists/plugin.min.js";
            listPlugin.async = true;
            listPlugin.onload = () => {
                const quickBarsPlugin = document.createElement("script");
                quickBarsPlugin.src =
                    "/tinymce/plugins/quickbars/plugin.min.js";
                quickBarsPlugin.async = true;
                quickBarsPlugin.onload = () => {
                    // console.log("tinymce loaded");
                    initializeTinyMCE();
                    return () => {
                        if (currentEditor) {
                            currentEditor.destroy();
                            console.log("tinymce destroyed");
                        }
                    };
                };
                document.body.appendChild(quickBarsPlugin);
            };
            document.body.appendChild(listPlugin);
        };
        document.body.appendChild(script);
    });

    onCleanup(() => {
        if (currentEditor) {
            currentEditor.destroy();
            console.log("tinymce destroyed");
        }
    });

    return null;
};
