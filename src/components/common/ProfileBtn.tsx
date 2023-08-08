import { AuthMode } from "./AuthMode";
import { ProviderProfileButton } from "./ProviderProfileButton";
import { CreatePostsRouting } from "../posts/CreatePostsRouting";
import { ClientRouting } from "../users/ClientRouting";
import { supabase } from "../../lib/supabaseClient";
import { Auth } from "../../lib/Auth";
import { Show, createSignal } from "solid-js";

const { data: User, error: UserError } = await supabase.auth.getSession();
export const ProfileBtn = () => {
  const [isUser, setIsUser] = createSignal<boolean | null>(false);

  if (User.session === null) {
    console.log("User dont exist");
  } else {
    setIsUser(User.session!.user.role === "authenticated");
  }

  function clickHandler() {
    const listShow = document.getElementById("profileItems");
    if (listShow?.classList.contains("hidden")) {
      listShow?.classList.remove("hidden");
    } else {
      listShow?.classList.add("hidden");
    }
  }

  if (UserError) {
    console.log("User Error: " + UserError.message);
  }

  function renderWhenUser() {
    console.log("User is authenticated");
    console.log(isUser(), "holaaaaa");
    if (isUser()) {
      return (
        <div>
          <div class="mx-2">
            <CreatePostsRouting />
          </div>
          <div class="mx-2">
            <ClientRouting />
          </div>
        </div>
      );
    }
  }

  return (
    <div>
      <button onClick={clickHandler} class="rounded border mx-5">
        Click Me
      </button>
      <ul id="profileItems" class="hidden absolute">
        <div class="mx-2">
          <AuthMode />
        </div>

        <div class="mx-2">
          <ProviderProfileButton />
        </div>
        {renderWhenUser()}
      </ul>
    </div>
  );
};
