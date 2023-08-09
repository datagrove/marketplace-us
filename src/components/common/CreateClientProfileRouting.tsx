import { createSignal } from "solid-js";
import { supabase } from "../../lib/supabaseClient";

const { data: User, error: UserError } = await supabase.auth.getSession();

export const CreateClientProfileRouting = () => {
  const [isUserClient, setIsUserClient] = createSignal<boolean>(false);

  const createClientProfileLink = document.getElementById(
    "createClientProfile"
  );
  const isClient = async () => {
    try {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("user_id", User.session!.user.id);
      setIsUserClient(true);
      createClientProfileLink?.classList.add("hidden");

      if (error) {
        console.log(error);
      } else if (data[0] === undefined) {
        console.log("User is not a client");
      } else {
        console.log("User is a client");
      }
    } catch (error) {
      console.log(error);
    }
  };

  isClient();

  console.log(isUserClient(), "client profile routing");

  return <a href="">Create Client Profile</a>;
};
