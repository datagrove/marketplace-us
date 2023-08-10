import { createSignal } from "solid-js";
import { supabase } from "../../lib/supabaseClient";

const { data: User, error: UserError } = await supabase.auth.getSession();

export const ProviderRegistrationRouting = () => {
  const [isUserProvider, setIsUserProvider] = createSignal<boolean>(false);
  const [providerRouting, setProviderRouting] = createSignal<string>(
    "../../provider/createaccount"
  );
  const [createText, setCreateText] = createSignal<string>(
    "Create Provider Profile"
  );

  const createProviderProfileLink = document.getElementById(
    "createProviderProfile"
  );
  const isProvider = async () => {
    try {
      const { data, error } = await supabase
        .from("providers")
        .select("*")
        .eq("user_id", User.session!.user.id);

      setIsUserProvider(true);
      if (data![0]) {
        setCreateText("My Provider Profile");
        setProviderRouting("../../provider/profile");
      }
    } catch (error) {
      console.log(error);
    }
  };

  isProvider();

  return (
    <a href={providerRouting()} class="" id="createEditProviderProfile">
      {createText()}
    </a>
  );
};
