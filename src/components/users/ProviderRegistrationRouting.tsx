import { createSignal } from "solid-js";
import { supabase } from "../../lib/supabaseClient";

const { data: User, error: UserError } = await supabase.auth.getSession();

export const ProviderRegistrationRouting = () => {
  const [isUserProvider, setIsUserProvider] = createSignal<boolean>(false);
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
      createProviderProfileLink?.classList.add("hidden");

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

  console.log(isUserProvider(), "provider profile routing");

  return (
    <a href="../../provider/createaccount" class="" id="createProviderProfile">
      Create Provider Profile
    </a>
  );
};
