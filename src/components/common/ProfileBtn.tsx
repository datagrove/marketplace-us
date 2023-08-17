import { AuthMode } from "./AuthMode";
import { ProviderProfileButton } from "./ProviderProfileButton";
import { CreatePostsRouting } from "../posts/CreatePostsRouting";
import { ClientRouting } from "../users/ClientRouting";
import { supabase } from "../../lib/supabaseClient";
import { Auth } from "../../lib/Auth";
import { Show, createSignal } from "solid-js";
import { ProviderRegistration } from "../users/ProviderRegistration";
import { ProviderRegistrationRouting } from "../users/ProviderRegistrationRouting";
import { LanguagePicker } from "./LanguagePicker";

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
    <div class="border border-red-500">
      <button onclick={clickHandler} class="rounded-lg border px-3 py-2 mx-5 flex">
        <svg class="w-4 h-4 fill-black dark:fill-white mr-2" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M16 15.503A5.041 5.041 0 1 0 16 5.42a5.041 5.041 0 0 0 0 10.083zm0 2.215c-6.703 0-11 3.699-11 5.5v3.363h22v-3.363c0-2.178-4.068-5.5-11-5.5z" /></svg>
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M4 5C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H4ZM3 12C3 11.4477 3.44772 11 4 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H4C3.44772 13 3 12.5523 3 12ZM3 18C3 17.4477 3.44772 17 4 17H20C20.5523 17 21 17.4477 21 18C21 18.5523 20.5523 19 20 19H4C3.44772 19 3 18.5523 3 18Z" fill="currentColor" />
        </svg>
      </button>
      <ul id="profileItems" class="absolute bg-background1 dark:bg-black m-2 p-2 rounded-lg border border-green-500">
        {renderWhenUser()}
        <div class="">
          <AuthMode />
        </div>
        <div class="md:hidden mt-2">
          <LanguagePicker />
        </div>
      </ul>
    </div>
  );
};
