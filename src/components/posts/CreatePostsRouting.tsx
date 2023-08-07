import { Show, createSignal } from "solid-js";
import { supabase } from "../../lib/supabaseClient";

const { data: User, error: UserError } = await supabase.auth.getSession();

export const CreatePostsRouting = () => {
  const [isUserProvider, setIsUserProvider] = createSignal<boolean>(false);

  if (UserError) {
    console.log("User Error: " + UserError.message);
  }

  const isProvider = async () => {
    try {
      const { data, error } = await supabase
        .from("providers")
        .select("*")
        .eq("user_id", User.session!.user.id);
      setIsUserProvider(true);
      console.log(isUserProvider());

      if (error) {
        console.log(error);
      } else if (data[0] === undefined) {
        console.log("User is not a provider");
      } else {
        console.log("User is a provider");
      }
    } catch (error) {
      console.log(error);
    }
  };

  isProvider();

  return (
    <Show when={isUserProvider()}>
      <div>
        <a href="../../posts/createpost.astro">Create Posts</a>
      </div>
    </Show>
  );
};
