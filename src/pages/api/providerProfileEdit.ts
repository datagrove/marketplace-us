import { supabase } from "../../lib/supabaseClientServer";
import type { APIRoute } from "astro";
import { useTranslations } from "../../i18n/utils";

export const post: APIRoute = async ({ request, redirect }) => {
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
  const providerName = formData.get("ProviderName");
  const phone = formData.get("Phone");
  const email = formData.get("email");
  const country = formData.get("country");
  const majorMunicipality = formData.get("MajorMunicipality");
  const minorMunicipality = formData.get("MinorMunicipality");
  const governingDistrict = formData.get("GoverningDistrict");
  const postalArea = formData.get("PostalArea");
  const imageUrl = formData.get("image_url") ? formData.get("image_url") : null;
  console.log("imageURL: " + imageUrl);

  // Validate the formData makes sure none of the fields are blank. Could probably do more than this like check for invalid phone numbers, blank strings, unselected location info etc.
  if (
    !firstName ||
    !lastName ||
    !phone
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
          message: (t("apiErrors.profileError")),
        }),
        { status: 500 }
      );
    }
    console.log(profileData);
  }


  let location;

  //If any location fields are blank then set location to null
  if (!country ||
    !majorMunicipality ||
    !minorMunicipality ||
    !governingDistrict) {
    location = null;
  } else {
    //Make a new location submission to the location table
   
    //Build our submission to the location table keys need to match the field in the database you are trying to fill.
    let locationSubmission = {
      minor_municipality: minorMunicipality,
      major_municipality: majorMunicipality,
      governing_district: governingDistrict,
      country: country,
      user_id: user.id,
    };


    //Insert the submission to the location table and select it back from the database
    const { error: locationError, data: locationData } = await supabase
      .from("location")
      .insert([locationSubmission])
      .select("id");
    if (locationError) {
      console.log(locationError);
      return new Response(
        JSON.stringify({
          message: (t("apiErrors.locationError")),
        }),
        { status: 500 }
      );
    }
    location = locationData[0];
  }
  //Build our submission to the providers table including the location id from the select from the location table on line 158
  let submission;

  //If the location is null then leave the current value for location
  if (location === null) {
    submission = {
      provider_name: providerName,
      provider_phone: phone,
      image_url: imageUrl,
    };
  } else {
    //Update the location with the new location
    submission = {
      provider_name: providerName,
      provider_phone: phone,
      location: location.id,
      image_url: imageUrl,
    };
  };

  //submit to the providers table and select it back
  const { error, data } = await supabase
    .from("providers")
    .update([submission])
    .eq("user_id", user.id)
    .select();

  if (error) {
    console.log(error);
    return new Response(
      JSON.stringify({
        message: (t("apiErrors.providerEditProfileError")),
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
      redirect: "/provider/profile",
    }),
    { status: 200 }
  );
};
