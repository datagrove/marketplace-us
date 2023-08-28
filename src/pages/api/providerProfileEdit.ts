import { supabase } from "../../lib/supabaseClientServer";
import type { APIRoute } from "astro";

export const post: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();

  //Just console.log the formData for troubleshooting
  for (let pair of formData.entries()) {
    console.log(pair[0] + ", " + pair[1]);
  }

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
        message: "Missing required fields",
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
        message: "Session not found",
      }),
      { status: 500 }
    );
  }

  console.log(sessionData);

  //Make sure we have a session
  if (!sessionData?.session) {
    return new Response(
      JSON.stringify({
        message: "Session not found",
      }),
      { status: 500 }
    );
  }

  //Get the user and make sure we have a user
  const user = sessionData?.session.user;

  if (!user) {
    return new Response(
      JSON.stringify({
        message: "User not found",
      }),
      { status: 500 }
    );
  }

  if (user.email !== email) {
    const { data, error } = await supabase.auth.updateUser({ email: email!.toString() });
    if (error) {
      return new Response(
        JSON.stringify({
          message: "Error updating email",
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
          message: "Error updating profile",
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

    /*Each of these retrieves the appropriate id from the database for the area level
    (governing district, minor municipality, major municipality, country)
    in order to make a proper submission to the location table */
    const { data: districtId, error: districtError } = await supabase
      .from("governing_district")
      .select("id")
      .eq("governing_district", governingDistrict);
    if (districtError) {
      return new Response(
        JSON.stringify({
          message: "District not found",
        }),
        { status: 500 }
      );
    }

    const { data: minorMunicipalityId, error: minorMunicipalityError } =
      await supabase
        .from("minor_municipality")
        .select("id")
        .eq("minor_municipality", minorMunicipality);
    if (minorMunicipalityError) {
      return new Response(
        JSON.stringify({
          message: "Minor Municipality not found",
        }),
        { status: 500 }
      );
    }

    const { data: majorMunicipalityId, error: majorMunicipalityError } =
      await supabase
        .from("major_municipality")
        .select("id")
        .eq("major_municipality", majorMunicipality);
    if (majorMunicipalityError) {
      return new Response(
        JSON.stringify({
          message: "Major Municipality not found",
        }),
        { status: 500 }
      );
    }

    const { data: countryId, error: countryError } = await supabase
      .from("country")
      .select("id")
      .eq("country", country);
    if (countryError) {
      return new Response(
        JSON.stringify({
          message: "Country not found",
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
    const { error: locationError, data: locationData } = await supabase
      .from("location")
      .insert([locationSubmission])
      .select("id");
    if (locationError) {
      console.log(locationError);
      return new Response(
        JSON.stringify({
          message: "Location not submitted",
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
        message: "Error updating provider profile",
      }),
      { status: 500 }
    );
  } else if (!data) {
    return new Response(
      JSON.stringify({
        message: "No profile Data returned",
      }),
      { status: 500 }
    );
  } else {
    console.log("Profile Data: " + JSON.stringify(data[0]));
  }



  // If everything works send a success response
  return new Response(
    JSON.stringify({
      message: "Success!",
      redirect: "/provider/profile",
    }),
    { status: 200 }
  );
};
