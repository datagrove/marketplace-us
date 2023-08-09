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

  // function clickHandler() {
  //   const listShow = document.getElementById("providerList");
  //   if (listShow?.classList.contains("hidden")) {
  //     listShow?.classList.remove("hidden");
  //   } else {
  //     listShow?.classList.add("hidden");
  //   }
  // }

  return (
    <Show when={isUserProvider()}>
      <a href="../../posts/createpost" class=" ">
        Create Posts
      </a>
    </Show>
  );
};
