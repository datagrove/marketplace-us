import type { Component } from "solid-js";
import { createEffect, createSignal, type JSX, Show } from "solid-js";
import supabase from "../../lib/supabaseClient";
import placeholderImg from "../../assets/userImagePlaceholder.svg";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

interface Props {
    size: number;
    url: string | null;
    onUpload: (event: Event, filePath: string) => void;
}

const PostImage: Component<Props> = (props) => {
    const [imageUrl, setImageUrl] = createSignal<Array<string>>([]);
    // const [imageUrl, setImageUrl] = createSignal({ placeholderImg });
    const [uploading, setUploading] = createSignal(false);

    createEffect(() => {
        if (props.url) downloadImage(props.url);
    });

    const downloadImage = async (path: string) => {
        try {
            const { data, error } = await supabase.storage
                .from("post.image")
                .download(path);
            if (error) {
                throw error;
            }
            const url = URL.createObjectURL(data);
            setImageUrl([...imageUrl(), url]);
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
                .from("post.image")
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
        <div
            class="flex w-full flex-row flex-wrap justify-start text-center"
            aria-live="polite"
        >
            <div class="h-fit w-fit">
                <Show when={imageUrl().length < 5}>
                    <div class="mb-4 mr-2">
                        <label for="single">
                            {uploading() ? (
                                t("buttons.uploading")
                            ) : (
                                <div class="flex h-24 w-24 flex-col items-center justify-center rounded bg-background2 dark:bg-background2-DM">
                                    <div class="flex flex-col items-center justify-center">
                                        <svg
                                            width="50px"
                                            height="50px"
                                            viewBox="0 0 48 48"
                                            fill="none"
                                            class="fill-icon2 dark:fill-icon2-DM"
                                        >
                                            <path d="M20.5152 7C18.9718 7 17.5496 7.83679 16.8 9.18602L15.5145 11.5H11.75C8.57436 11.5 6 14.0744 6 17.25V34.25C6 37.4256 8.57436 40 11.75 40H22.9963C22.6642 39.2037 22.4091 38.3672 22.2402 37.5H11.75C9.95507 37.5 8.5 36.0449 8.5 34.25V17.25C8.5 15.4551 9.95507 14 11.75 14H16.9855L18.9854 10.4001C19.2941 9.84456 19.8797 9.5 20.5152 9.5H27.4848C28.1203 9.5 28.7059 9.84456 29.0146 10.4001L31.0145 14H36.25C38.0449 14 39.5 15.4551 39.5 17.25V22.7999C40.3823 23.1255 41.2196 23.544 42 24.0436V17.25C42 14.0744 39.4256 11.5 36.25 11.5H32.4855L31.2 9.18602C30.4504 7.83679 29.0282 7 27.4848 7H20.5152Z" />
                                            <path d="M24 17C27.5278 17 30.5222 19.2834 31.586 22.4529C30.7711 22.6741 29.988 22.9726 29.2451 23.34C28.5411 21.1138 26.459 19.5 24 19.5C20.9624 19.5 18.5 21.9624 18.5 25C18.5 27.6415 20.3622 29.8481 22.8454 30.3786C22.5516 31.151 22.3292 31.9587 22.1865 32.7936C18.6418 31.972 16 28.7945 16 25C16 20.5817 19.5817 17 24 17Z" />
                                            <path d="M46 35C46 41.0751 41.0751 46 35 46C28.9249 46 24 41.0751 24 35C24 28.9249 28.9249 24 35 24C41.0751 24 46 28.9249 46 35ZM36 29C36 28.4477 35.5523 28 35 28C34.4477 28 34 28.4477 34 29V34H29C28.4477 34 28 34.4477 28 35C28 35.5523 28.4477 36 29 36H34V41C34 41.5523 34.4477 42 35 42C35.5523 42 36 41.5523 36 41V36H41C41.5523 36 42 35.5523 42 35C42 34.4477 41.5523 34 41 34H36V29Z" />
                                        </svg>
                                        <p class="pt-1 text-xs text-ptext2 dark:text-ptext2-DM">
                                            {t("buttons.uploadImage")}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </label>
                    </div>
                </Show>

                <span style="display:none">
                    <input
                        type="file"
                        id="single"
                        accept="image/*"
                        multiple
                        onChange={uploadImage}
                        disabled={uploading()}
                    />
                </span>
            </div>

            {imageUrl().length > 0 && imageUrl().length <= 5 ? (
                imageUrl().map((image) => (
                    <img
                        src={image}
                        alt={imageUrl() ? "Image" : "No image"}
                        class="user image mb-4 mr-2 rounded border-2 border-inputBorder1 dark:border-inputBorder1-DM"
                        style={{
                            height: `${props.size}px`,
                            width: `${props.size}px`,
                        }}
                    />
                ))
            ) : (
                <div class="flex justify-center"></div>
            )}
        </div>
    );
};

export default PostImage;
