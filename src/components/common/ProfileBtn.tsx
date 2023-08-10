import { AuthMode } from "./AuthMode";
import { ProviderProfileButton } from "./ProviderProfileButton";
import { CreatePostsRouting } from "../posts/CreatePostsRouting";
import { ClientRouting } from "../users/ClientRouting";
import { supabase } from "../../lib/supabaseClient";
import { Auth } from "../../lib/Auth";
import { Show, createSignal } from "solid-js";
import { ProviderRegistration } from "../users/ProviderRegistration";
import { ProviderRegistrationRouting } from "../users/ProviderRegistrationRouting";
import { CreateClientProfileRouting } from "./CreateClientProfileRouting";

const { data: User, error: UserError } = await supabase.auth.getSession();
export const ProfileBtn = () => {
  const [isUser, setIsUser] = createSignal<boolean | null>(false);

  if (User.session === null) {
    console.log("User don't exist");
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
    if (isUser()) {
      return (
        <div>
          <div>
            <ClientRouting />
          </div>
          <div>
            <ProviderRegistrationRouting />
          </div>

          <div class="">
            <CreatePostsRouting />
          </div>
        </div>
      );
    }
  }

  return (
    <div>
      <button onClick={clickHandler} class="rounded border px-3 py-2 mx-5">
        Home
      </button>
      <ul id="profileItems" class="hidden absolute">
        {renderWhenUser()}
        <div class="">
          <AuthMode />
        </div>
      </ul>
    </div>
  );
};
