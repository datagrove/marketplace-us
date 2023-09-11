import { Component, Show, createSignal } from "solid-js";
import { supabase } from "../../lib/supabaseClient";
import type { AuthSession } from "@supabase/supabase-js";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

interface Props {
  // Define the type of the prop
  // (Id, UserId)
  id: number;
  userId: string;
  postImage: string | null | undefined;
}

const { data: User, error: UserError } = await supabase.auth.getSession();

export const DeletePostButton: Component<Props> = (props) => {
  // initialize session
  const [session, setSession] = createSignal<AuthSession | null>(null);

  if (UserError) {
    console.log("User Error: " + UserError.message);
  } else {
    setSession(User.session);
  }

  //Pre: User is logged in, there is a click to delete a post
  //Post: The post is deleted from the database
  const deletePost = async (e: SubmitEvent) => {
    e.preventDefault();

    // check if user is provider and if they are the owner of the post
    // if they are, delete the post
    if (props.userId === session()!.user.id) {
      try {
        const { error } = await supabase
          .from("provider_post")
          .delete()
          .eq("id", props.id)

        //if there are post images delete them from storage
        if (props.postImage) {
          console.log(props.postImage?.split(","));
          const { error } = await supabase
            .storage
            .from("post.image")
            .remove(props.postImage?.split(","));
          if (error) {
            console.log("supabase errror: " + error.message);
          } else {
            console.log("deleted images", props.postImage?.split(","));
          }
        }

        if (error) {
          console.log(error)
        } else {
          console.log("deleted post", props.id);
        }


        // console.log("deleted post", props.Id);
      } catch (error) {
        console.log(error);
      } finally {
        // refresh the page
        window.location.reload();
      }

    } else {
      console.log("Not your post");
    }
  };

  // const {data, error} = await supabase.storage.listBuckets();
  //         console.log(data)

  return (
    <Show when={session()!.user.id === props.userId}>
      <div class="w-fit h-fit">
        <form onSubmit={deletePost}>
          <button
            class="text-alert1 dark:text-alert1-DM font-bold p-1 rounded"
            type="submit"
            aria-label={t("buttons.delete")}
          >
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 7V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V7M6 7H5M6 7H8M18 7H19M18 7H16M10 11V16M14 11V16M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7M8 7H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
          </button>
        </form>
      </div>
    </Show>
  );
};
