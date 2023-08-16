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

        if (props.postImage) {
          console.log(props.postImage?.split(","));
          const { error } = await supabase
            .storage
            .from("post.image")
            .remove(props.postImage?.split(","));
          if (error) {
            console.log("supabase errror: " + error.message);
            console.log(error)
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
      <div>
        <form onSubmit={deletePost}>
          <button
            class="bg-[#B21010] dark:bg-[#F56B6B] text-white dark:text-black font-bold py-2 px-4 rounded"
            type="submit"
          >
            {t("buttons.delete")}
          </button>
        </form>
      </div>
    </Show>
  );
};
