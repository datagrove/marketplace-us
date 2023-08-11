import { Component, createSignal, createEffect } from "solid-js";
import { DeletePostButton } from "../posts/DeletePostButton";
import { supabase } from "../../lib/supabaseClient";
import { getLangFromUrl, useTranslations } from '../../i18n/utils';

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

interface Post {
  content: string;
  id: number;
  category: string;
  title: string;
  provider_name: string;
  major_municipality: string;
  minor_municipality: string;
  governing_district: string;
  user_id: string;
  image_urls: string | null;
}

interface Props {
  // Define the type for the filterPosts prop
  posts: Array<Post>;
}

export const ViewCard: Component<Props> = (props) => {
  const [newPosts, setNewPosts] = createSignal<Array<any>>([]);

  createEffect(async () => {
    if (props.posts) {
      const updatedPosts = await Promise.all(
        props.posts.map(async (post: any) => {
          post.image_urls ? (
            post.image_url = await downloadImage(post.image_urls.split(',')[0])
          ) : (
            post.image_url = null
          );
          return post;
        })
      );
      console.log("Updated Posts:")
      console.log(updatedPosts)
      setNewPosts(updatedPosts);
    };
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
      return url;
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error downloading image: ", error.message);
      }
    }
  };


  return (
    <div class="flex justify-center">
      <ul class="md:flex md:flex-wrap md:justify-center">
        {newPosts().map((post: any) => (
          <li>
            <a href={`/${lang}/posts/${post.id}`}>
            <div class="my-8 mx-4 flex flex-col md:flex-row justify-center items-center rounded-lg w-80 md:w-[650px] md:h-48 shadow-lg dark:shadow-gray-700">
              <div class="image-div md:w-auto md:h-auto md:mr-2">
                {post.image_url ? (
                  <img
                    src={post.image_url}
                    alt={post.image_urls.split(',')[0] ? "User Image" : "No image"}
                    class="dark:bg-background1 user image rounded-lg md:shadow-lg dark:shadow-2xl w-80 h-80 md:h-48 md:w-48 object-fit md:object-cover"
                    // style={{height: `120px`, width: `120px`}}
                  />
                ) : (
                  <svg
                    width="120px"
                    height="120px"
                    viewBox="0 0 512 512"
                    version="1.1"
                    class="fill-logo rounded-lg shadow-lg dark:shadow-2xl dark:fill-logo-DM bg-background2 dark:bg-background2-DM w-80 h-80 md:h-48 md:w-48 md:object-cover"
                  >
                    <title>image-filled</title>
                    <g id="Page-1" stroke="none" stroke-width="1">
                      <g id="icon" transform="translate(64.000000, 64.000000)">
                        <path d="M384,1.42108547e-14 L384,384 L1.42108547e-14,384 L1.42108547e-14,1.42108547e-14 L384,1.42108547e-14 Z M109.226667,142.933333 L42.666,249.881 L42.666,341.333 L341.333,341.333 L341.333,264.746 L277.333333,200.746667 L211.84,266.24 L109.226667,142.933333 Z M245.333333,85.3333333 C227.660221,85.3333333 213.333333,99.6602213 213.333333,117.333333 C213.333333,135.006445 227.660221,149.333333 245.333333,149.333333 C263.006445,149.333333 277.333333,135.006445 277.333333,117.333333 C277.333333,99.6602213 263.006445,85.3333333 245.333333,85.3333333 Z" id="Combined-Shape"></path>
                      </g>
                    </g>
                  </svg>
                )}
              </div>

              {/* <br /> */}
              <div class="px-1 pt-1 text-justify w-full md:w-3/4 md:h-full">
                <p class="text-lg font-bold mb-2 text-text1 dark:text-text1-DM overflow-hidden">{post.title}</p>
                <p class=" text-text1 dark:text-text1-DM text-xs max-h-12 md:h-12 overflow-auto mb-2 border-b-2 border-gray-400">{post.content}</p>
                <p class="overflow-hidden text-text1 dark:text-text1-DM text-xs">{t('postLabels.provider')}{post.provider_name}</p>
                <p class="overflow-hidden text-text1 dark:text-text1-DM text-xs">
                {t('postLabels.location')}{post.major_municipality}/{post.minor_municipality}/
                  {post.governing_district}
                </p>
                <p class="overflow-hidden text-text1 dark:text-text1-DM pt-1 text-lg">{t('postLabels.category')}{post.category}</p>
                <DeletePostButton Id={post.id} UserId={post.user_id} />
              </div>
            </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
