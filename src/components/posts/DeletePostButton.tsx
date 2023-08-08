import { Component, Show, createSignal } from "solid-js";
import { supabase } from "../../lib/supabaseClient";
import type { AuthSession } from "@supabase/supabase-js";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

interface Props {
  // Define the type of the prop
  Id: number;
  UserId: string;
}

// (Id, UserId)

const { data: User, error: UserError } = await supabase.auth.getSession();

export const DeletePostButton: Component<Props> = (props) => {
  const [session, setSession] = createSignal<AuthSession | null>(null);

  if (UserError) {
    console.log("User Error: " + UserError.message);
  } else {
    setSession(User.session);
  }
  const deletePost = async (e: SubmitEvent) => {
    e.preventDefault();
    function hello() {
      console.log("hello");
    }

    function checkIfUserIsProvider() {
      if (session()!.user.id === props.UserId) {
        return true;
      } else {
        return false;
      }
    }
    if (props.UserId === session()!.user.id) {
      try {
        const { error } = await supabase
          .from("provider_post")
          .delete()
          .eq("id", props.Id);
        console.log("deleted post", props.Id);
      } catch (error) {
        console.log(error);
      } finally {
        window.location.reload();
      }
    } else {
      console.log("You can't delete this post because it is not yours.");
    }
  };

  return (
    <Show when={session()!.user.id === props.UserId}>
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
