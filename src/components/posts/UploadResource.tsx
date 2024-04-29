import type { Component } from "solid-js";
import { createSignal, onCleanup, onMount } from "solid-js";

import supabase from "@lib/supabaseClient";

import Uppy from "@uppy/core";
import Dashboard from "@uppy/dashboard";
// import '@uppy/core/dist/style.min.css';
import "@uppy/dashboard/dist/style.min.css";

import Tus from "@uppy/tus";
import RemoteSources from "@uppy/remote-sources";

const supabaseUrl = import.meta.env.PUBLIC_VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_VITE_SUPABASE_ANON_KEY;

const folder = "";
const supbaseStorageURL = `${supabaseUrl}/storage/v1/upload/resumable`;

const {
  data: { session },
} = await supabase.auth.getSession();

interface Props {
  target: string;
  bucket: string;
  setUppyRef: (uppy: Uppy<Record<string, unknown>, Record<string, unknown>>) => void;
}

export const UploadFiles: Component<Props> = (props: Props) => {
  const [theme, setTheme] = createSignal<"auto" | "light" | "dark">("auto");

  const currentTheme = localStorage.getItem("theme");

  if (!currentTheme) {
    setTheme("auto");
  } else if (["auto", "light", "dark"].includes(currentTheme)) {
    setTheme(currentTheme as "auto" | "light" | "dark");
  } else {
    setTheme("auto");
  }

  let uppy: Uppy<Record<string, unknown>, Record<string, unknown>> ;

  onMount(() => {
    uppy = new Uppy()
      .use(Dashboard, {
        inline: true,
        target: props.target,
        showProgressDetails: true,
        proudlyDisplayPoweredByUppy: false,
        width: "100%",
        height: "100%",
        hideUploadButton: true,
      })
      .use(Tus, {
        endpoint: supbaseStorageURL,
        headers: {
          authorization: `Bearer ${session?.access_token}`,
          apikey: supabaseAnonKey,
        },
        uploadDataDuringCreation: true,
        removeFingerprintOnSuccess: true,
        chunkSize: 6 * 1024 * 1024,
        allowedMetaFields: [
          "bucketName",
          "objectName",
          "contentType",
          "cacheControl",
        ],
      });

    uppy.on("upload-error", (file, error) => {
      if (!file) {
        console.error("File is undefined");
        return;
      }

      console.error(`Error uploading file ${file.name}:`, error);
    });

    props.setUppyRef(uppy);

    uppy.on("file-added", (file) => {
      const supabaseMetadata = {
        bucketName: props.bucket,
        objectName: folder ? `${folder}/${file.name}` : file.name,
        contentType: file.type,
      };

      file.meta = {
        ...file.meta,
        ...supabaseMetadata,
      };

      console.log("file added", file);
    });

    uppy.on("complete", (result) => {
      console.log(
        "Upload complete! We’ve uploaded these files:",
        result.successful
      );
    });
    onCleanup(() => {
      uppy.close();
    });
  });

  return null;
};
