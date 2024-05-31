import supabase from "../../lib/supabaseClientServer";
import type { APIRoute } from "astro";
import { useTranslations } from "@i18n/utils";

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();

  //Just console.log the formData for troubleshooting
  for (let pair of formData.entries()) {
    console.log(pair[0] + ", " + pair[1]);
  }

  //Set internationalization values
  const lang = formData.get("lang");
  //We know that this will be a string value from our languages array so just tell typescript to trust us
  //@ts-ignore
  const t = useTranslations(lang);

  //set the formData fields to variables
  const access_token = formData.get("access_token");
  const refresh_token = formData.get("refresh_token");

  const firstName = formData.get("FirstName");
  const lastName = formData.get("LastName");
  const creatorName = formData.get("CreatorName");
  const email = formData.get("email");
  const sellerAbout = formData.get("AboutContent");
  const contribution = formData.get("contribution");
  const imageUrl = formData.get("image_url") ? formData.get("image_url") : null;
  console.log("imageURL: " + imageUrl);


  // Validate the formData makes sure none of the fields are blank. Could probably do more than this like check for invalid phone numbers, blank strings, unselected location info etc.
  if (
    !firstName ||
    !lastName 
  ) {
    return new Response(
      JSON.stringify({
        message: (t("apiErrors.missingFields")),
      }),
      { status: 400 }
    );
  }

  //Get the session from supabase (for the server side) based on the access and refresh tokens
  const { data: sessionData, error: sessionError } =
    await supabase.auth.setSession({
      refresh_token: refresh_token!.toString(),
      access_token: access_token!.toString(),
    });
  if (sessionError) {
    return new Response(
      JSON.stringify({
        message: (t("apiErrors.noSession")),
      }),
      { status: 500 }
    );
  }

  console.log(sessionData);

  //Make sure we have a session
  if (!sessionData?.session) {
    return new Response(
      JSON.stringify({
        message: (t("apiErrors.noSession")),
      }),
      { status: 500 }
    );
  }

  //Get the user and make sure we have a user
  const user = sessionData?.session.user;

  if (!user) {
    return new Response(
      JSON.stringify({
        message: (t("apiErrors.noUser")),
      }),
      { status: 500 }
    );
  }

  if (user.email !== email) {
    const { data, error } = await supabase.auth.updateUser({ email: email!.toString() });
    if (error) {
      return new Response(
        JSON.stringify({
          message: (t("apiErrors.emailError")),
        }),
        { status: 500 }
      );
    }
    console.log(data);
  }


  //Check if a profile exists
  const { data: profileExists, error: profileExistsError } = await supabase
    .from("profiles")
    .select("user_id")
    .eq("user_id", user.id);
  if (profileExistsError) {
    console.log("supabase error: " + profileExistsError.message);
  } else if (profileExists[0] === undefined) {
    console.log("Profile doesn't exists");
  } else if (profileExists[0] !== undefined) {
    console.log("Profile updating");
    //Build a submission to the profile table
    let profileSubmission = {
      first_name: firstName,
      last_name: lastName,
      email: email,
    };


    //Submit to the profile table and select it back (the select back is not entirely necessary)
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .update([profileSubmission])
      .eq("user_id", user.id)
      .select();
    if (profileError) {
      console.log(profileError);
      return new Response(
        JSON.stringify({
          message: (t("apiErrors.profileEditError")),
        }),
        { status: 500 }
      );
    }
    console.log(profileData);
  }

  //Build our submission to the creators table including the location id from the select from the location table on line 158
  let submission;

  submission = {
    seller_name: creatorName,
    image_url: imageUrl,
    seller_about: sellerAbout,
    contribution: contribution,
  };

  //submit to the creators table and select it back
  const { error, data } = await supabase
    .from("sellers")
    .update([submission])
    .eq("user_id", user.id)
    .select();

  if (error) {
    console.log(error);
    return new Response(
      JSON.stringify({
        message: (t("apiErrors.creatorEditProfileError")),
      }),
      { status: 500 }
    );
  } else if (!data) {
    return new Response(
      JSON.stringify({
        message: (t("apiErrors.noProfileData")),
      }),
      { status: 500 }
    );
  } else {
    console.log("Profile Data: " + JSON.stringify(data[0]));
  }

  // If everything works send a success response
  return new Response(
    JSON.stringify({
      message: (t("apiErrors.success")),
      redirect: "/creator/profile",
    }),
    { status: 200 }
  );
};