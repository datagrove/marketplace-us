import supabase from "../../lib/supabaseClientServer";
import type { APIRoute } from "astro";
import { useTranslations } from "@i18n/utils";
import stripe from "@lib/stripe";
import { SITE } from "@src/config";
import type { Post } from "@lib/types";

export const POST: APIRoute = async ({ request, redirect }) => {
  const items = await request.json();
  console.log("checkout items: " + items);

  //Just console.log the formData for troubleshooting
  //   const lang = formData.get("lang");
  //    //@ts-ignore
  //    const t = useTranslations(lang);

  // Validate the formData makes sure none of the fields are blank. Could probably do more than this like check for invalid phone numbers, blank strings, unselected location info etc.
  if (!items) {
    return new Response(
      JSON.stringify({
        //TODO Internationalize
        message: "No items",
      }),
      { status: 400 }
    );
  }

  const lineItems: [] = items.map((item: Post) => {
    return { 
      price: item.price_id, 
      quantity: item.quantity 
    };
  });

  // items.map((item: Post) => {
  //   lineItems.push({ price: item.price_id, quantity: item.quantity });
  // });
  //Get the session from supabase (for the server side) based on the access and refresh tokens
  //   const { data: sessionData, error: sessionError } =
  //     await supabase.auth.setSession({
  //       refresh_token: refresh_token!.toString(),
  //       access_token: access_token!.toString(),
  //     });
  //   if (sessionError) {
  //     return new Response(
  //       JSON.stringify({
  //         message: (t("apiErrors.noSession")),
  //       }),
  //       { status: 500 }
  //     );
  //   }

  //Make sure we have a session
  //   if (!sessionData?.session) {
  //     return new Response(
  //       JSON.stringify({
  //         message: (t("apiErrors.noSession")),
  //       }),
  //       { status: 500 }
  //     );
  //   }

  //Get the user and make sure we have a user
  //   const user = sessionData?.session.user;
  //   console.log(user)

  //   if (!user) {
  //     return new Response(
  //       JSON.stringify({
  //         message: (t("apiErrors.noUser")),
  //       }),
  //       { status: 500 }
  //     );
  //   }

  // const { data: profileExists, error: profileExistsError } = await supabase
  //   .from("profiles")
  //   .select("user_id")
  //   .eq("user_id", user.id);
  // if (profileExistsError) {
  //   console.log("supabase error: " + profileExistsError.message);
  // } else if (profileExists[0] !== undefined) {
  //   console.log("Profile already exists");
  // } else if (profileExists[0] === undefined) {
  //   //Build a submission to the profile table
  //   let profileSubmission = {
  //     user_id: user.id,
  //     first_name: firstName,
  //     last_name: lastName,
  //   };

  //   //Submit to the profile table and select it back (the select back is not entirely necessary)

  //   const { data: profileData, error: profileError } = await supabase
  //     .from("profiles")
  //     .insert([profileSubmission])
  //     .select();
  //   if (profileError) {
  //     console.log(profileError);
  //     return new Response(
  //       JSON.stringify({
  //         message: (t("apiErrors.profileError")),
  //       }),
  //       { status: 500 }
  //     );
  //   }
  // }
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    line_items: lineItems,
    mode: "payment",
    return_url: `${SITE.devUrl}/return.html?session_id={CHECKOUT_SESSION_ID}`,
    automatic_tax: { enabled: true },
    metadata: {
      items: JSON.stringify(items),
    }
  });

  // If everything works send a success response
  return new Response(
    JSON.stringify({
      message: "Success",
      clientSecret: session.client_secret,
    }),
    { status: 200 }
  );
};
