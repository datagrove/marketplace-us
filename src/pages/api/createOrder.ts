import supabase from "../../lib/supabaseClientServer";
import type { APIRoute } from "astro";
import { useTranslations } from "@i18n/utils";

export const POST: APIRoute = async ({ request, redirect }) => {
  const order = await request.json();

  //Set internationalization values
  const lang = order.lang;
  //@ts-ignore
  const t = useTranslations(lang);

  // Validate the formData makes sure none of the fields are blank. Could probably do more than this like check for invalid phone numbers, blank strings, unselected location info etc.
  if (!order) {
    return new Response(
      JSON.stringify({
        message: t("apiErrors.missingFields"),
      }),
      { status: 400 }
    );
  }

  if (order.refresh_token !== undefined && order.access_token !== undefined) {
    //Get the session from supabase (for the server side) based on the access and refresh tokens
    const { data: sessionData, error: sessionError } =
      await supabase.auth.setSession({
        refresh_token: order.refresh_token!.toString(),
        access_token: order.access_token!.toString(),
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
  }

  if (order.refresh_token === undefined || order.access_token === undefined) {
    try {
      const { error } = await supabase.auth.signInWithOtp({email: order.email});
      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
    
  }
  
  
  //Build our submission to the location table keys need to match the field in the database you are trying to fill.
  let locationSubmission = {
    major_municipality: majorMunicipalityId[0].id,
    country: countryId[0].id,
    user_id: user.id,
  };

  //Insert the submission to the location table and select it back from the database
  const { error: locationError, data: location } = await supabase
    .from("location")
    .insert([locationSubmission])
    .select("id");
  if (locationError) {
    console.log(locationError);
    return new Response(
      JSON.stringify({
        message: t("apiErrors.locationError"),
      }),
      { status: 500 }
    );
  }

  //Build our submission to the providers table including the location id from the select from the location table on line 158
  let submission = {
    seller_name: providerName,
    seller_phone: phone,
    location: location[0].id,
    user_id: user.id,
    image_url: imageUrl,
  };

  //submit to the providers table and select it back
  const { error, data: seller } = await supabase
    .from("sellers")
    .insert([submission])
    .select();

  if (error) {
    console.log(error);
    return new Response(
      JSON.stringify({
        message: t("apiErrors.providerCreateProfileError"),
      }),
      { status: 500 }
    );
  } else if (!data) {
    return new Response(
      JSON.stringify({
        message: t("apiErrors.noProfileData"),
      }),
      { status: 500 }
    );
  } else {
    console.log("Profile Data: " + JSON.stringify(data));
  }

  // If everything works send a success response
  return new Response(
    JSON.stringify({
      // message: t("apiErrors.success"),
    }),
    { status: 200 }
  );
};
