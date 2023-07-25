import { Component, createEffect, createSignal, JSX } from "solid-js";
import { supabase } from "../../lib/supabaseClient";

interface Props {
  size: number;
  url: string | null;
  onUpload: (event: Event, filePath: string) => void;
}

const UserImage: Component<Props> = (props) => {
  const [imageUrl, setImageUrl] = createSignal<string | null>(null);
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
        throw new Error("You must select an image to upload.");
      }

      const file = target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from("user.image")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
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
    <div style={{ width: `${props.size}px` }} aria-live="polite">
      {imageUrl() ? (
        <img
          src={imageUrl()!}
          alt={imageUrl() ? "Image" : "No image"}
          class="user image"
          style={{ height: `${props.size}px`, width: `${props.size}px` }}
        />
      ) : (
        <div
          class="user no-image"
          style={{ height: `${props.size}px`, width: `${props.size}px` }}
        />
      )}
      <div style={{ width: `${props.size}px` }}>
        <label
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          for="single"
        >
          {uploading() ? "Uploading ..." : "Upload Image"}
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
