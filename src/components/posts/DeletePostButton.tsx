import { Component, Show, createSignal } from "solid-js";
import { supabase } from "../../lib/supabaseClient";
import type { AuthSession } from "@supabase/supabase-js";

const [session, setSession] = createSignal<AuthSession | null>(null);

const { data: User, error: UserError } = await supabase.auth.getSession();
if (UserError) {
  console.log("User Error: " + UserError.message);
} else {
  setSession(User.session);
  console.log(User);
}

export function DeletePostButton(Id, propsUserId) {
  const deletePost = async (e: SubmitEvent) => {
    e.preventDefault();
    function hello() {
      console.log("hello");
    }

    function checkIfUserIsProvider() {
      if (session()!.user.id === propsUserId) {
        return true;
      } else {
        return false;
      }
    }
    if (propsUserId === session()!.user.id) {
      try {
        const { error } = await supabase
          .from("provider_post")
          .delete()
          .eq("id", Id);
        console.log("deleted post", Id);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("You can't delete this post because it is not yours.");
    }
  };

  return (
    <Show when={session()!.user.id === propsUserId}>
      <div>
        <form onSubmit={deletePost}>
          <button
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            type="submit"
          >
            Delete
          </button>
        </form>
      </div>
    </Show>
  );
}
