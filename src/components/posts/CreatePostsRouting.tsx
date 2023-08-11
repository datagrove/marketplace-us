import { Show, createSignal } from "solid-js";
import { supabase } from "../../lib/supabaseClient";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";

const { data: User, error: UserError } = await supabase.auth.getSession();

// Internationalization

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

export const CreatePostsRouting = () => {
  const [isUserProvider, setIsUserProvider] = createSignal<boolean>(false);
  if (UserError) {
    console.log("User Error: " + UserError.message);
  }

  const postLink = document.getElementById("createPostLink");

  const isProvider = async () => {
    try {
      const { data, error } = await supabase
        .from("providers")
        .select("*")
        .eq("user_id", User.session!.user.id);

      if (data![0]) {
        setIsUserProvider(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  isProvider();

  return (
    <Show when={isUserProvider()}>
      <a href="../../posts/createpost" class=" " id="createPostLink">
        {t("pageTitles.createPost")}
      </a>
    </Show>
  );
};
