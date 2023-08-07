import { Show, createSignal } from "solid-js";
import { supabase } from "../../lib/supabaseClient";

const { data: User, error: UserError } = await supabase.auth.getSession();
export const ClientRouting = () => {
  const isUser = User.session!.user.role === "authenticated";
  const [isUserClient, setIsUserClient] = createSignal<boolean>(false);
  const [createText, setCreateText] = createSignal<string>(
    "Create Client Account"
  );
  const [routing, setRouting] = createSignal<string>(
    "../../client/createaccount"
  );

  const isClient = async () => {
    try {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("user_id", User.session!.user.id);
      setIsUserClient(true);
      setCreateText("Edit Client Account");
      setRouting("../../client/editaccount");
      console.log(isUserClient());
      console.log(User.session!);
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
  return (
    <Show when={isUser}>
      <div>
        <a href={routing()}>{createText()}</a>
      </div>
    </Show>
  );
};
