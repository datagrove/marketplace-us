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
  const t = useTranslations(lang);

  //set the formData fields to variables
  const access_token = formData.get("access_token");
  const refresh_token = formData.get("refresh_token");

  // const firstName = formData.get("FirstName");
  // const lastName = formData.get("LastName");
  const providerName = formData.get("ProviderName");
  const phone = formData.get("Phone");
  const country = formData.get("country");
  const majorMunicipality = formData.get("MajorMunicipality");
  const minorMunicipality = formData.get("MinorMunicipality");
  const governingDistrict = formData.get("GoverningDistrict");
  const postalArea = formData.get("PostalArea");
  const imageUrl = formData.get("image_url") ? formData.get("image_url") : null;
  console.log("imageURL: " + imageUrl);

  // Validate the formData makes sure none of the fields are blank. Could probably do more than this like check for invalid phone numbers, blank strings, unselected location info etc.
  if (
    !phone ||
    !country ||
    !majorMunicipality ||
    !minorMunicipality ||
    !governingDistrict
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

  //Check if provider profile exists and if it does sets a redirect in the json response to send the user to their provider profile

  const { data: providerExists, error: providerExistsError } = await supabase
    .from("providers")
    .select("user_id")
    .eq("user_id", user.id);
  if (providerExistsError) {
    console.log("supabase error: " + providerExistsError.message);
  } else if (providerExists[0] !== undefined) {
    return new Response(
      JSON.stringify({
        message: (t("apiErrors.providerExists")),
        redirect: "/provider/profile",
      }),
      { status: 302 }
    );
  }

  // //Check if a profile exists
  // const { data: profileExists, error: profileExistsError } = await supabase
  //   .from("profiles")
  //   .select("user_id")
  //   .eq("user_id", user.id);
  // console.log(profileExists!.length);
  // if (profileExistsError) {
  //   console.log("supabase error: " + profileExistsError.message);
  // } else if (profileExists.length !== 0) {
  //   console.log("Profile already exists");
  // } else if (profileExists.length === 0) {
  //   //Build a submission to the profile table
  //   let profileSubmission = {
  //     user_id: user.id,
  //     first_name: firstName,
  //     last_name: lastName,
  //     email: user.email,
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

  /*Each of these retrieves the appropriate id from the database for the area level
  (governing district, minor municipality, major municipality, country)
  in order to make a proper submission to the location table */
  const { data: districtId, error: districtError } = await supabase
    .from("governing_district")
    .select("id")
    .eq("id", governingDistrict);
  if (districtError) {
    return new Response(
      JSON.stringify({
        message: (t("apiErrors.noDistrict")),
      }),
      { status: 500 }
    );
  }

  const { data: minorMunicipalityId, error: minorMunicipalityError } =
    await supabase
      .from("minor_municipality")
      .select("id")
      .eq("id", minorMunicipality);
  if (minorMunicipalityError) {
    return new Response(
      JSON.stringify({
        message: (t("apiErrors.noMinorMunicipality")),
      }),
      { status: 500 }
    );
  }

  const { data: majorMunicipalityId, error: majorMunicipalityError } =
    await supabase
      .from("major_municipality")
      .select("id")
      .eq("id", majorMunicipality);
  if (majorMunicipalityError) {
    return new Response(
      JSON.stringify({
        message: (t("apiErrors.noMajorMunicipality")),
      }),
      { status: 500 }
    );
  }

  const { data: countryId, error: countryError } = await supabase
    .from("country")
    .select("id")
    .eq("id", country);
  if (countryError) {
    return new Response(
      JSON.stringify({
        message: (t("apiErrors.noCountry")),
      }),
      { status: 500 }
    );
  }

  //Build our submission to the location table keys need to match the field in the database you are trying to fill.
  let locationSubmission = {
    minor_municipality: minorMunicipalityId[0].id,
    major_municipality: majorMunicipalityId[0].id,
    governing_district: districtId[0].id,
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
        message: (t("apiErrors.locationError")),
      }),
      { status: 500 }
    );
  }

  //Build our submission to the providers table including the location id from the select from the location table on line 158
  let submission = {
    provider_name: providerName,
    provider_phone: phone,
    location: location[0].id,
    user_id: user.id,
    image_url: imageUrl,
  };

  //submit to the providers table and select it back
  const { error, data } = await supabase
    .from("providers")
    .insert([submission])
    .select();

  if (error) {
    console.log(error);
    return new Response(
      JSON.stringify({
        message: (t("apiErrors.providerCreateProfileError")),
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
    console.log("Profile Data: " + JSON.stringify(data));
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
