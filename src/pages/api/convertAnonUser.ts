import supabase from "@lib/supabaseClientServiceRole";
import type { APIRoute } from "astro";
import { useTranslations } from "@i18n/utils";
import { SITE } from "@src/config";
import type { Post } from "@lib/types";

export const POST: APIRoute = async ({ request, redirect }) => {
  const response = await request.json();
  const user_id = response.userId;


  // Validate the formData makes sure none of the fields are blank. Could probably do more than this like check for invalid phone numbers, blank strings, unselected location info etc.
  if (!user_id) {
    return new Response(
      JSON.stringify({
        //TODO Internationalize
        message: "No User ID",
      }),
      { status: 400 }
    );
  }

//   const { data, error } = await supabase.auth.admin.updateUserById(user_id, {
//       email: response.email,
//   })


  // If everything works send a success response
  return new Response(
    JSON.stringify({
      message: "Success",
    }),
    { status: 200 }
  );
};