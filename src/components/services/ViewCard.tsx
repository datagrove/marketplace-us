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
    <div class="flex justify-center w-full">
      <ul class="md:flex md:flex-wrap md:justify-center md:w-full">
        {newPosts().map((post: any) => (
          <li class=" w-[99%]">
            <a href={`/${lang}/posts/${post.id}`}>
              <div class="mb-2 flex flex-col md:flex-row md:justify-start justify-center items-center rounded-lg md:h-48 shadow-lg shadow-shadow-LM dark:shadow-shadow-DM">
                <div class="flex md:w-48 w-full h-80 md:h-48 md:mr-2 items-center justify-center bg-background1 dark:bg-background1-DM rounded-lg">
                  {post.image_url ? (
                    <img
                      src={post.image_url}
                      alt={post.image_urls.split(',')[0] ? "User Image" : "No image"}
                      class="bg-background1 dark:bg-icon1-DM rounded-lg md:shadow-lg dark:shadow-2xl w-full h-full object-cover"
                    // style={{height: `120px`, width: `120px`}}
                    />
                  ) : (
                    <svg
                      viewBox="0 0 512 512"
                      version="1.1"
                      class="dark:bg-icon1-DM fill-logo rounded-lg w-full h-full object-cover"
                    >
                      <g id="Page-1" stroke="none" stroke-width="1">
                        <g id="icon" transform="translate(64.000000, 64.000000)">
                          <path d="M384,1.42108547e-14 L384,384 L1.42108547e-14,384 L1.42108547e-14,1.42108547e-14 L384,1.42108547e-14 Z M109.226667,142.933333 L42.666,249.881 L42.666,341.333 L341.333,341.333 L341.333,264.746 L277.333333,200.746667 L211.84,266.24 L109.226667,142.933333 Z M245.333333,85.3333333 C227.660221,85.3333333 213.333333,99.6602213 213.333333,117.333333 C213.333333,135.006445 227.660221,149.333333 245.333333,149.333333 C263.006445,149.333333 277.333333,135.006445 277.333333,117.333333 C277.333333,99.6602213 263.006445,85.3333333 245.333333,85.3333333 Z" id="Combined-Shape"></path>
                        </g>
                      </g>
                    </svg>
                  )}
                </div>

                {/* <br /> */}
                <div id="cardContent" class="px-1 pt-1 text-left w-full md:w-5/6 md:h-full">
                  <div class="grid grid-cols-4">
                    <p class="text-lg font-bold mb-2 text-ptext1 dark:text-ptext1-DM overflow-hidden max-h-14 col-span-3">
                      {post.title}
                    </p>
                    <div class="justify-self-end pt-2 pr-4">
                      <DeletePostButton id={post.id} userId={post.user_id} postImage={post.image_urls} />
                    </div>
                  </div>
                  <p class=" text-ptext1 dark:text-ptext1-DM text-xs max-h-12 md:h-12 overflow-hidden mb-2 border-2 border-border1 dark:border-border1-DM mr-4">{post.content}</p>
                  <p class="overflow-hidden text-ptext1 dark:text-ptext1-DM text-xs">{t('postLabels.provider')}{post.provider_name}</p>
                  <p class="overflow-hidden text-ptext1 dark:text-ptext1-DM text-xs">
                    {t('postLabels.location')}{post.major_municipality}/{post.minor_municipality}/
                    {post.governing_district}
                  </p>
                  <p class="overflow-hidden text-ptext1 dark:text-ptext1-DM pt-1 text-lg">{t('postLabels.category')}{post.category}</p>

                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};