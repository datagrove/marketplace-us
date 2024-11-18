
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
  //@ts-ignore
  const t = useTranslations(lang);

  //set the formData fields to variables
  const access_token = formData.get("access_token");
  const refresh_token = formData.get("refresh_token");

  const reviewTitle = formData.get("review_title");
  const reviewText = formData.get("review_text");
  const overallRating = formData.get("overall_rating");
  const resourceId = formData.get("resource_id");
  const userId = formData.get("user_id");



  // Validate the formData makes sure none of the fields are blank. Could probably do more than this like check for invalid phone numbers, blank strings, unselected location info etc.

  if (
    // !reviewTitle ||
    // !reviewText ||
    !overallRating ||
    !resourceId ||
    !userId ||
    access_token === ""
  ) {
    return new Response(
      JSON.stringify({
        message: t("apiErrors.missingFields"),
      }),
      { status: 500 }
    );
  }

  //Get the session from supabase (for the server side) based on the access and refresh tokens
  const { data: sessionData, error: sessionError } =
    await supabase.auth.setSession({
      refresh_token: refresh_token!.toString(),
      access_token: access_token!.toString(),
    });
  if (sessionError) {
    console.log("supabase error: " + sessionError.message);
    return new Response(
      JSON.stringify({
        message: t("apiErrors.noSession"),
      }),
      { status: 500 }
    );
  }

  console.log(sessionData);

  //Make sure we have a session
  if (!sessionData?.session) {
    return new Response(
      JSON.stringify({
        message: t("apiErrors.noSession"),
      }),
      { status: 500 }
    );
  }

  //Get the user and make sure we have a user
  const user = sessionData?.session.user;

  if (!user) {
    return new Response(
      JSON.stringify({
        message: t("apiErrors.noUser"),
      }),
      { status: 500 }
    );
  }


  let submission = {
    resource_id: resourceId,
    reviewer_id: userId,
    review_title: reviewTitle || null,
    review_text: reviewText || null,
    overall_rating: overallRating,
  };

  const { error, data } = await supabase
    .from("reviews")
    .insert([submission])
    .select();

  if (error) {
    console.log(error);
    return new Response(
      JSON.stringify({
        // message: t("apiErrors.creatorCreateProfileError"),
        //TODO: Internationalize
        message: t("apiErrors.problemPostingReview")
      }),
      { status: 500 }
    );
  } else if (!data) {
    return new Response(
      JSON.stringify({
        // message: t("apiErrors.noProfileData"),
        //TODO: Internationalize
        message: t("apiErrors.noDataFound"),
      }),
      { status: 500 }
    );
  } else {
    console.log("Profile Data: " + JSON.stringify(data));
  }

  // If everything works send a success response
  return new Response(
    JSON.stringify({
      message: t("apiErrors.success"),
    }),
    { status: 200 }
  );
};
