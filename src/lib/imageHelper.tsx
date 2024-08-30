import supabase from "@lib/supabaseClient";

const urlCache = new Map<string, { webpUrl: string; jpegUrl: string }>();

export const downloadPostImage = async (path: string) => {
    if (urlCache.has(path)) {
        return urlCache.get(path);
    }

    try {
        const { data: webpData, error: webpError } = await supabase.storage
            .from("post.image")
            .createSignedUrl(`webp/${path}.webp`, 60 * 60 * 24 * 30);
        if (webpError) {
            throw webpError;
        }
        const webpUrl = webpData.signedUrl;

        const { data: jpegData, error: jpegError } = await supabase.storage
            .from("post.image")
            .createSignedUrl(`jpeg/${path}.jpeg`, 60 * 60 * 24 * 30);
        if (jpegError) {
            throw jpegError;
        }
        const jpegUrl = jpegData.signedUrl;

        const url = { webpUrl, jpegUrl };
        urlCache.set(path, url); // Cache the URL
        return url;
    } catch (error) {
        if (error instanceof Error) {
            console.log("Error downloading image: ", error.message);
        }
    }
};

export const downloadUserImage = async (path: string) => {
    if (urlCache.has(path)) {
        return urlCache.get(path);
    }

    try {
        const { data: webpData, error: webpError } = await supabase.storage
            .from("user.image")
            .createSignedUrl(`webp/${path}.webp`, 60 * 60 * 24 * 30);
        if (webpError) {
            throw webpError;
        }
        const webpUrl = webpData.signedUrl;

        const { data: jpegData, error: jpegError } = await supabase.storage
            .from("user.image")
            .createSignedUrl(`jpeg/${path}.jpeg`, 60 * 60 * 24 * 30);
        if (jpegError) {
            throw jpegError;
        }
        const jpegUrl = jpegData.signedUrl;

        const url = { webpUrl, jpegUrl };
        urlCache.set(path, url); // Cache the URL
        return url;
    } catch (error) {
        if (error instanceof Error) {
            console.log("Error downloading image: ", error.message);
        }
    }
};

export const lazyLoadImage = (img: HTMLImageElement) => {
    console.log("Lazy loading image:", img);
    const dataSrc = img.dataset.src;
    console.log("Data set:", img.dataset);
    // Check if the image src is already set to data-src
    if (dataSrc && img.src !== dataSrc) {
        console.log("Original src:", img.src);
        console.log("Data src:", dataSrc);
        // Update the img src with the value of data-src
        img.src = dataSrc;
        console.log("Updated src:", img.src);
    }

    // Get all source elements within the parent <picture> element
    const sources = img.parentElement?.querySelectorAll("source");
    if (sources) {
        sources.forEach((source) => {
            const sourceElement = source as HTMLSourceElement;
            const dataSrcSet = sourceElement.dataset.srcset;
            // Check if the source srcset is already set to data-srcset
            if (dataSrcSet && sourceElement.srcset !== dataSrcSet) {
                console.log("Original srcset:", sourceElement.srcset);
                console.log("Data srcset:", dataSrcSet);
                // Update the source srcset with the value of data-srcset
                sourceElement.srcset = dataSrcSet;
                console.log("Updated srcset:", sourceElement.srcset);
            }
        });
    }
};

export const lazyLoadAllImages = () => {
    console.log("Lazy loading all images...");
    const images = document.querySelectorAll("img[data-src]");
    console.log("Images:", images);
    console.log("Images length:", images.length);

    images.forEach((img) => {
        const imageElement = img as HTMLImageElement;
        console.log("Image:", imageElement);

        // Check if the image has already loaded (in case of caching)
        if (imageElement.complete) {
            lazyLoadImage(imageElement);
        } else {
            imageElement.onload = () => lazyLoadImage(imageElement);
        }
    });
};
