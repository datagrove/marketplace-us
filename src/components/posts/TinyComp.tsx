import { createEffect, createSignal, onCleanup } from "solid-js";
import { createStore } from "solid-js/store";

import tinymce from "tinymce";

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
    const [mode, setMode] = createSignal(props.mode);
    const currentEditor = tinymce.get(props.id);

    const initializeTinyMCE = async () => {
        if(currentEditor) {
            currentEditor.destroy();
        }
        console.log(props.id)
        // Initialize TinyMCE
        await tinymce.init({
            selector: props.id,
            max_width: 384,
            skin_url: mode() === "dark" ? "/tinymce/skins/ui/oxide-dark" : "/tinymce/skins/ui/oxide",
            content_css: mode() === "dark" ? "/tinymce/skins/content/dark/content.min.css" : "/tinymce/skins/content/default/content.min.css",
            promotion: false,
            plugins: "lists, quickbars",
            quickbars_image_toolbar: false,
            quickbars_insert_toolbar: false,
            toolbar: [
                "undo redo | bold italic | alignleft aligncenter alignright",
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

    const removeScripts = () => {
        const scripts = document.querySelectorAll("script[src^='/tinymce/']");
        scripts.forEach((script) => script.remove());
    };

    const loadScripts = async () => {
        const loadScript = (src: string) => {
            return new Promise<void>((resolve, reject) => {
                const script = document.createElement("script");
                script.src = src;
                script.async = true;
                script.onload = () => resolve();
                script.onerror = (error) => reject(error);
                document.body.appendChild(script);
            });
        };

        try {
            await loadScript("/tinymce/tinymce.min.js");
            await loadScript("/tinymce/plugins/lists/plugin.min.js");
            await loadScript("/tinymce/plugins/quickbars/plugin.min.js");
            await initializeTinyMCE();
        } catch (error) {
            console.error("Failed to load TinyMCE scripts:", error);
        }
    };

    createEffect(() => {
        removeScripts();
        loadScripts();

        return () => {
            const currentEditor = tinymce.get(props.id);
            if (currentEditor) {
                currentEditor.destroy();
            }
        };
    });

    return null;
};