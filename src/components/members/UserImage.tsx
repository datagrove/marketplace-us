import type { Component } from "solid-js";
import { createEffect, createSignal, type JSX } from "solid-js";
import supabase from "../../lib/supabaseClient";
import placeholderImg from '../../assets/userImagePlaceholder.svg';
import { getLangFromUrl, useTranslations } from '../../i18n/utils';

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

interface Props {
  size: number;
  url: string | null;
  onUpload: (event: Event, filePath: string) => void;
}

const UserImage: Component<Props> = (props) => {
  const [imageUrl, setImageUrl] = createSignal<string | null>(null);
  // const [imageUrl, setImageUrl] = createSignal({ placeholderImg });
  const [uploading, setUploading] = createSignal(false);

  createEffect(() => {
    if (props.url) downloadImage(props.url);
  });

  const downloadImage = async (path: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("user.image")
        .download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      setImageUrl(url);
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error downloading image: ", error.message);
      }
    }
  };

  const uploadImage: JSX.EventHandler<HTMLInputElement, Event> = async (
    event
  ) => {
    try {
      setUploading(true);

      const target = event.currentTarget;
      if (!target?.files || target.files.length === 0) {
        throw new Error(t('messages.selectAnImage'));
      }

      const file = target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;
      console.log(filePath);

      let { error: uploadError } = await supabase.storage
        .from("user.image")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      if (imageUrl()) {
        const { error } = await supabase
          .storage
          .from("user.image")
          .remove([props.url!]);

        if (error) {
          console.log("supabase errror: " + error.message);
        } else {
          console.log("deleted images", [props.url!]);
          setImageUrl(null);
        }
      }

      props.onUpload(event, filePath);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div class="">
      <div aria-live="polite" class="w-36 border-2 border-gray-400 rounded-full flex-row text-center justify-center h-36">
        {imageUrl() ? (
          <img
            src={imageUrl()!}
            alt={imageUrl() ? "Image" : "No image"}
            class="user image"
            style={{ height: `${props.size}px`, width: `${props.size}px` }}
          />
        ) : (
          <div class="flex justify-center h-36 w-36">
            <svg
              width="144px"
              height="144px"
              viewBox="0 0 512 512"
              version="1.1"
              class="fill-logo2 dark:fill-icon1 bg-background2 dark:bg-icon2-DM rounded-full object-scale-down"
            >
              <title>image-filled</title>
              <g id="Page-1" stroke="none" stroke-width="1">
                <g id="icon" transform="translate(64.000000, 64.000000)">
                  <path d="M384,1.42108547e-14 L384,384 L1.42108547e-14,384 L1.42108547e-14,1.42108547e-14 L384,1.42108547e-14 Z M109.226667,142.933333 L42.666,249.881 L42.666,341.333 L341.333,341.333 L341.333,264.746 L277.333333,200.746667 L211.84,266.24 L109.226667,142.933333 Z M245.333333,85.3333333 C227.660221,85.3333333 213.333333,99.6602213 213.333333,117.333333 C213.333333,135.006445 227.660221,149.333333 245.333333,149.333333 C263.006445,149.333333 277.333333,135.006445 277.333333,117.333333 C277.333333,99.6602213 263.006445,85.3333333 245.333333,85.3333333 Z" id="Combined-Shape"></path>
                </g>
              </g>
            </svg>
          </div>
        )}


      </div>
      
      <div class="flex justify-center mt-1">
          <label
            class="btn-primary"
            for="single"
          >
            {uploading() ? t('buttons.uploading') : t('buttons.uploadImage')}
          </label>
          <span style="display:none">
            <input
              type="file"
              id="single"
              accept="image/*"
              onChange={uploadImage}
              disabled={uploading()}
            />
          </span>
        </div>
      
    </div>
  );
};

export default UserImage;