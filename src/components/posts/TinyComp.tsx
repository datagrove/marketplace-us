import { createEffect, createSignal } from "solid-js";

import tinymce from "tinymce";

//@ts-ignore
import { model } from "../../../node_modules/tinymce/models/dom/model";
//@ts-ignore
import { theme } from "../../../node_modules/tinymce/themes/silver/theme";
//@ts-ignore
import { icons } from "../../../node_modules/tinymce/icons/default/icons";
//To add new plugins import the main js file from the node modules and add the min file to public and add a script definition to the init call
//@ts-ignore
import lists from "../../../node_modules/tinymce/plugins/lists/plugin";
//@ts-ignore
import quickbars from "../../../node_modules/tinymce/plugins/quickbars/plugin";

export const TinyComp= () => {

  const [mode, setMode] = createSignal<"dark" | "light">(
    //@ts-ignore
    localStorage.getItem("theme")
  );


  createEffect(() => {
    window.addEventListener("storage", (event) => {
      if (event.key === "theme") {
        //@ts-ignore
        setMode(event.newValue);
      }
      window.location.reload();
      console.log(event.key);
      console.log("Mode: " + mode());
    });
  });

  createEffect(() => {
    const script = document.createElement("script");
    script.src = "/tinymce/tinymce.min.js";
    script.async = true;
    script.onload = () => {
      const listPlugin = document.createElement("script");
      listPlugin.src = "/tinymce/plugins/lists/plugin.min.js";
      listPlugin.async = true;
      listPlugin.onload = () => {
        const quickBarsPlugin = document.createElement("script");
        quickBarsPlugin.src = "/tinymce/plugins/quickbars/plugin.min.js";
        quickBarsPlugin.async = true;
        quickBarsPlugin.onload = () => {
          console.log("tinymce loaded");
          tinymce.init({
            selector: "#Content",
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
        document.body.appendChild(quickBarsPlugin);
      };
      document.body.appendChild(listPlugin);
    };
    document.body.appendChild(script);
  });





    return (
        <div>
            <h1>TinyMCE</h1>
        </div>
    )
}

