import { Show, createSignal } from "solid-js";
import { supabase } from "../../lib/supabaseClient";

const { data: User, error: UserError } = await supabase.auth.getSession();
export const ClientRouting = () => {
  const [isUser, setIsUser] = createSignal<boolean>(false);
  const [isUserClient, setIsUserClient] = createSignal<boolean>(false);
  const [createText, setCreateText] = createSignal<string>(
    "Create Client Account"
  );
  const [routing, setRouting] = createSignal<string>(
    "../../client/createaccount"
  );

  const CreateEditClientProfilelink = document.getElementById(
    "createEditClientProfileLink"
  );

  setIsUser(User.session!.user.role === "authenticated");

  if (UserError) {
    console.log("User Error: " + UserError.message);
  }

  const isClient = async () => {
    try {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("user_id", User.session!.user.id);

      if (data![0] === undefined) {
        console.log("user is not a client");
      } else {
        setCreateText("Edit Client Profile");
        setRouting("../../client/editaccount");
        // console.log("user is a client");
        setIsUserClient(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  isClient();

  return (
    <Show when={isUser}>
      <a class=" " id="createEditClientProfileLink" href={routing()}>
        {createText()}
      </a>
    </Show>
  );
};
