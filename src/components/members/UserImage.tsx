import type { Component } from "solid-js";
import { createEffect, createSignal, type JSX } from "solid-js";
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

const UserImage: Component<Props> = (props) => {
    const [imageUrl, setImageUrl] = createSignal<{
        webpUrl: string;
        jpegUrl: string;
    }>({
        webpUrl: "",
        jpegUrl: "",
    });
    // const [imageUrl, setImageUrl] = createSignal({ placeholderImg });
    const [uploading, setUploading] = createSignal(false);

    createEffect(() => {
        if (props.url) downloadImage(props.url);
    });

    const downloadImage = async (path: string) => {
        try {
            const { data: webpData, error: webpError } = await supabase.storage
                .from("user.image")
                .createSignedUrl(`webp/${path}.webp`, 60 * 60);
            if (webpError) {
                throw webpError;
            }

            const { data: jpegData, error: jpegError } = await supabase.storage
                .from("user.image")
                .createSignedUrl(`jpeg/${path}.jpeg`, 60 * 60);
            if (jpegError) {
                throw jpegError;
            }

            const webpUrl = webpData.signedUrl;
            const jpegUrl = jpegData.signedUrl;
            const url = { webpUrl, jpegUrl };

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
                throw new Error(t("messages.selectAnImage"));
            }

            const file = target.files[0];

            let jpegFile = file;
            let webpFile = file;

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const src = reader.result as string;

                const img = new Image();
                img.onload = async () => {
                    const formatFiles = await resizeImage(img);
                    webpFile = formatFiles.webpFile;
                    console.log("New File", webpFile);
                    jpegFile = formatFiles.jpegFile;
                    console.log("New File", jpegFile);

                    if (webpFile && jpegFile) {
                        const filePath = `${webpFile.name.split(".")[0]}`;

                        let { error: uploadWebpError } = await supabase.storage
                            .from("user.image")
                            .upload(`webp/${webpFile.name}`, webpFile);

                        if (uploadWebpError) {
                            throw uploadWebpError;
                        }

                        let { error: uploadjpegError } = await supabase.storage
                            .from("user.image")
                            .upload(`jpeg/${jpegFile.name}`, jpegFile);

                        if (uploadjpegError) {
                            throw uploadjpegError;
                        }
                        props.onUpload(event, filePath);

                        downloadImage(filePath);
                    } else {
                        throw new Error("Image formatting failed.");
                    }
                };

                img.src = src;
            };
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            }
        } finally {
            setUploading(false);
        }
    };

    const resizeImage = async (image: HTMLImageElement) => {
        let canvas = document.createElement("canvas");
        const maxWidth = 500;
        const maxHeight = 500;
        let width = image.width;
        let height = image.height;
        if (width > height) {
            if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
            }
        } else {
            if (height > maxHeight) {
                width *= maxHeight / height;
                height = maxHeight;
            }
        }

        canvas.width = width;
        canvas.height = height;

        let ctx = canvas.getContext("2d");
        ctx?.drawImage(image, 0, 0, width, height);

        const imageName = crypto.randomUUID();

        const jpegFilePromise = new Promise<File>((resolve, reject) =>
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        const file = new File([blob], `${imageName}.jpeg`, {
                            type: "image/jpeg",
                            lastModified: new Date().getTime(),
                        });
                        resolve(file);
                    } else {
                        reject(new Error("Failed to convert image to blob"));
                    }
                },
                "image/jpeg",
                0.8
            )
        );

        const webpFilePromise = new Promise<File>((resolve, reject) =>
            canvas.toBlob((blob) => {
                if (blob) {
                    const file = new File([blob], `${imageName}.webp`, {
                        type: "image/webp",
                        lastModified: new Date().getTime(),
                    });
                    resolve(file);
                } else {
                    reject(new Error("Failed to convert image to blob"));
                }
            }, "image/webp")
        );

        const [jpegFile, webpFile] = await Promise.all([
            jpegFilePromise,
            webpFilePromise,
        ]);
        return { webpFile, jpegFile };
    };

    return (
        <div class="">
            <div
                aria-live="polite"
                class="h-36 w-36 flex-row justify-center rounded-full border-2 border-gray-400 text-center"
            >
                {imageUrl() ? (
                    <picture>
                        <source srcset={imageUrl().webpUrl} type="image/webp" />
                        <img
                            src={imageUrl().jpegUrl}
                            alt={imageUrl() ? "Image" : "No image"}
                            class="user image"
                            style={{
                                height: `${props.size}px`,
                                width: `${props.size}px`,
                            }}
                        />
                    </picture>
                ) : (
                    <div class="flex h-36 w-36 justify-center">
                        <svg
                            width="144px"
                            height="144px"
                            viewBox="0 0 512 512"
                            version="1.1"
                            class="rounded-full bg-background2 fill-logo2 object-scale-down dark:bg-icon2-DM dark:fill-icon1"
                        >
                            <title>image-filled</title>
                            <g id="Page-1" stroke="none" stroke-width="1">
                                <g
                                    id="icon"
                                    transform="translate(64.000000, 64.000000)"
                                >
                                    <path
                                        d="M384,1.42108547e-14 L384,384 L1.42108547e-14,384 L1.42108547e-14,1.42108547e-14 L384,1.42108547e-14 Z M109.226667,142.933333 L42.666,249.881 L42.666,341.333 L341.333,341.333 L341.333,264.746 L277.333333,200.746667 L211.84,266.24 L109.226667,142.933333 Z M245.333333,85.3333333 C227.660221,85.3333333 213.333333,99.6602213 213.333333,117.333333 C213.333333,135.006445 227.660221,149.333333 245.333333,149.333333 C263.006445,149.333333 277.333333,135.006445 277.333333,117.333333 C277.333333,99.6602213 263.006445,85.3333333 245.333333,85.3333333 Z"
                                        id="Combined-Shape"
                                    ></path>
                                </g>
                            </g>
                        </svg>
                    </div>
                )}
            </div>

            <div class="mt-1 flex justify-center">
                <label class="btn-primary" for="single">
                    {uploading()
                        ? t("buttons.uploading")
                        : t("buttons.uploadImage")}
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
