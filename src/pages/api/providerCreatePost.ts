import supabase from "../../lib/supabaseClientServer";
import type { APIRoute } from "astro";
import type { APIContext } from "astro";
import { useTranslations } from "@i18n/utils";

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();

  for (let pair of formData.entries()) {
    console.log(pair[0] + ", " + pair[1]);
  }

  //Set internationalization values
  const lang = formData.get("lang");
  //@ts-ignore
  const t = useTranslations(lang);

  const access_token = formData.get("access_token");
  const refresh_token = formData.get("refresh_token");
  const title = formData.get("Title");
  const serviceCategory = formData.get("ServiceCategory");
  const content = formData.get("Content");
  const country = formData.get("country");
  const tax_code = formData.get("TaxCode");
  // const majorMunicipality = formData.get("MajorMunicipality");
  // const minorMunicipality = formData.get("MinorMunicipality");
  // const governingDistrict = formData.get("GoverningDistrict");
  const imageUrl = formData.get("image_url") ? formData.get("image_url") : null;
  console.log("imageURL: " + imageUrl);

  // Validate the formData - you'll probably want to do more than this
  if (
    !title ||
    !serviceCategory ||
    !content ||
    !country ||
    !tax_code
    // !minorMunicipality ||
    // !majorMunicipality ||
    // !governingDistrict
  ) {
    return new Response(
      JSON.stringify({
        message: t("apiErrors.missingFields"),
      }),
      { status: 400 },
    );
  }

  const { data: sessionData, error: sessionError } =
    await supabase.auth.setSession({
      refresh_token: refresh_token!.toString(),
      access_token: access_token!.toString(),
    });
  if (sessionError) {
    return new Response(
      JSON.stringify({
        message: t("apiErrors.noSession"),
      }),
      { status: 500 },
    );
  }

  // console.log(sessionData)

  if (!sessionData?.session) {
    return new Response(
      JSON.stringify({
        message: t("apiErrors.noSession"),
      }),
      { status: 500 },
    );
  }

  const user = sessionData?.session.user;

  if (!user) {
    return new Response(
      JSON.stringify({
        message: t("apiErrors.noUser"),
      }),
      { status: 500 },
    );
  }

  // const { data: districtId, error: districtError } = await supabase
  //   .from("governing_district")
  //   .select("id")
  //   .eq("id", governingDistrict);
  // if (districtError) {
  //   return new Response(
  //     JSON.stringify({
  //       message: t("apiErrors.noDistrict"),
  //     }),
  //     { status: 500 },
  //   );
  // }

  // const { data: minorMunicipalityId, error: minorMunicipalityError } =
  //   await supabase
  //     .from("minor_municipality")
  //     .select("id")
  //     .eq("id", minorMunicipality);
  // if (minorMunicipalityError) {
  //   return new Response(
  //     JSON.stringify({
  //       message: (t("apiErrors.noMinorMunicipality")),
  //     }),
  //     { status: 500 }
  //   );
  // }

  // const { data: majorMunicipalityId, error: majorMunicipalityError } =
  //   await supabase
  //     .from("major_municipality")
  //     .select("id")
  //     .eq("id", majorMunicipality);
  // if (majorMunicipalityError) {
  //   return new Response(
  //     JSON.stringify({
  //       message: t("apiErrors.noMajorMunicipality"),
  //     }),
  //     { status: 500 },
  //   );
  // }

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

  const { data: categoryId, error: categoryError } = await supabase
    .from("post_category")
    .select("id")
    .eq("id", serviceCategory);
  if (categoryError) {
    return new Response(
      JSON.stringify({
        message: t("apiErrors.noCategory"),
      }),
      { status: 500 },
    );
  }

  let locationSubmission = {
    // minor_municipality: minorMunicipalityId[0].id,
    // major_municipality: majorMunicipalityId[0].id,
    // governing_district: districtId[0].id,
    country: countryId[0].id,
    user_id: user.id,
  };

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
      { status: 500 },
    );
  }

  let postSubmission = {
    title: title,
    content: content,
    location: location[0].id,
    product_category: categoryId[0].id,
    image_urls: imageUrl,
    user_id: user.id,
  };

  const { error, data } = await supabase
    .from("seller_post")
    .insert([postSubmission])
    .select();

  if (error) {
    console.log(error);
    return new Response(
      JSON.stringify({
        message: t("apiErrors.postError"),
      }),
      { status: 500 },
    );
  } else if (!data) {
    return new Response(
      JSON.stringify({
        message: t("apiErrors.noPost"),
      }),
      { status: 500 },
    );
  } else {
    console.log("Post Data: " + JSON.stringify(data));
  }

  // Do something with the formData, then return a success response
  return new Response(
    JSON.stringify({
      message: t("apiErrors.success"),
      id: data[0].id,
    }),
    { status: 200 },
  );
};
