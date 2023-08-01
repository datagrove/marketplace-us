import { supabase } from '../../lib/supabaseClient'
import type { APIRoute } from "astro";
import type { APIContext } from 'astro';

export const post: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();

  for (let pair of formData.entries()) {
    console.log(pair[0] + ', ' + pair[1]);
  }

  const access_token = formData.get("access_token");
  const refresh_token = formData.get("refresh_token");
  const title = formData.get('Title');
  const serviceCategory = formData.get('ServiceCategory');
  const content = formData.get('Content');
  const country = formData.get('country');
  const majorMunicipality = formData.get('MajorMunicipality');
  const minorMunicipality = formData.get('MinorMunicipality');
  const governingDistrict = formData.get('GoverningDistrict');



  // Validate the formData - you'll probably want to do more than this
  if (!title || !serviceCategory || !content || !country || !majorMunicipality || !minorMunicipality || !governingDistrict) {
    return new Response(
      JSON.stringify({
        message: "Missing required fields",
      }),
      { status: 400 }
    );
  }

  const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
    refresh_token: refresh_token!.toString(),
    access_token: access_token!.toString(),
  })
  if (sessionError) {
    return new Response(
      JSON.stringify({
        message: "Session not found",
      }),
      { status: 500 }
    );
  }

  console.log(sessionData)

  if (!sessionData?.session) {
    return new Response(
      JSON.stringify({
        message: "Session not found",
      }),
      { status: 500 }
    );
  }

  const user = sessionData?.session.user

  if (!user) {
    return new Response(
      JSON.stringify({
        message: "User not found",
      }),
      { status: 500 }
    );
  }

  const { data: districtId, error: districtError } = await supabase.from('governing_district').select('id').eq('id', governingDistrict)
  if (districtError) {
    return new Response(
      JSON.stringify({
        message: "District not found",
      }),
      { status: 500 }
    );
  }

  const { data: minorMunicipalityId, error: minorMunicipalityError } = await supabase.from('minor_municipality').select('id').eq('id', minorMunicipality)
  if (minorMunicipalityError) {
    return new Response(
      JSON.stringify({
        message: "Minor Municipality not found",
      }),
      { status: 500 }
    );
  }

  const { data: majorMunicipalityId, error: majorMunicipalityError } = await supabase.from('major_municipality').select('id').eq('id', majorMunicipality)
  if (majorMunicipalityError) {
    return new Response(
      JSON.stringify({
        message: "Major Municipality not found",
      }),
      { status: 500 }
    );
  }

  const { data: countryId, error: countryError } = await supabase.from('country').select('id').eq('id', country)
  if (countryError) {
    return new Response(
      JSON.stringify({
        message: "Country not found",
      }),
      { status: 500 }
    );
  }

  const { data: categoryId, error: categoryError } = await supabase.from('post_category').select('id').eq('id', serviceCategory)
  if (categoryError) {
    return new Response(
      JSON.stringify({
        message: "Category not found",
      }),
      { status: 500 }
    );
  }

  console.log(districtId)
  console.log(minorMunicipalityId)
  console.log(majorMunicipalityId)
  console.log(countryId)

  let locationSubmission = {
    minor_municipality: minorMunicipalityId[0].id,
    major_municipality: majorMunicipalityId[0].id,
    governing_district: districtId[0].id,
    country: countryId[0].id,
    user_id: user.id,
  }

  console.log("User: " + user)
  console.log("user role: " + user.aud)
  console.log(locationSubmission)

  const { error: locationError, data: location } = await supabase.from('location').insert([locationSubmission]).select('id')
  if (locationError) {
    console.log(locationError)
    return new Response(
      JSON.stringify({
        message: "Location not submitted",
      }),
      { status: 500 }
    );
  }
  

  let postSubmission = {
    title: title,
    content: content,
    location: location[0].id,
    service_category: categoryId[0].id,
    user_id: user.id,
  }

  const { error, data } = await supabase.from('provider_post').insert([postSubmission]).select()

  if (error) {
    console.log(error)
    return new Response(
      JSON.stringify({
        message: "Error creating post",
      }),
      { status: 500 }
    );
  } else if (!data) {
    return new Response(
      JSON.stringify({
        message: "No post returned",
      }),
      { status: 500 }
    );
  } else {
    console.log("Post Data: " + JSON.stringify(data))
  }

  // Do something with the formData, then return a success response
  return new Response(
    JSON.stringify({
      message: "Success!",
      redirect: "/provider/profile",
    }),
    { status: 200 }
  );
};
