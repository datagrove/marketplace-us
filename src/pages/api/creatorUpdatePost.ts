import supabase from "../../lib/supabaseClientServer";
import type { APIRoute } from "astro";
import type { APIContext } from "astro";
import { useTranslations } from "@i18n/utils";
import stripe from "../../lib/stripe";

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
  const subject = formData.get("subject");
  const content = formData.get("Content");
  const product_id = formData.get("product_id");
  const description = formData.get("description");
  const price = formData.get("Price");
  const gradeLevel = formData.get("grade");
  const idSupabase = formData.get("idSupabase");
  const imageUrl = formData.get("image_url")
    ? formData.get("image_url")
    : null;
  // const resourceUrl = formData.get("resource_url");
  const resourceType = formData.get("resource_types");
  const secular = formData.get("secular");
  console.log("imageURL: " + imageUrl);
  console.log(formData, "api");

  // Validate the formData - you'll probably want to do more than this
  if (
    !title ||
    !subject ||
    !content ||
    !gradeLevel
    // !resourceUrl ||
    // !tax_code
  ) {
    return new Response(
      JSON.stringify({
        message: t("apiErrors.missingFields"),
      }),
      { status: 400 }
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
      { status: 500 }
    );
  }

  // console.log(sessionData)

  if (!sessionData?.session) {
    return new Response(
      JSON.stringify({
        message: t("apiErrors.noSession"),
      }),
      { status: 500 }
    );
  }

  const user = sessionData?.session.user;

  if (!user) {
    return new Response(
      JSON.stringify({
        message: t("apiErrors.noUser"),
      }),
      { status: 500 }
    );
  }

  const prices = await stripe.prices.list({
    product: String(product_id),
    active: true,
  });

  const pricesToArchive = prices.data.map((item) => {
    return item.id;
  })

  const price_info = await stripe.prices.create({
    unit_amount: Number(price),
    currency: "usd",
    tax_behavior: "exclusive",
    product: String(product_id),
  });

  const default_price = price_info.id;

  const stripe_update = await stripe.products.update(String(product_id), {
    name: String(title),
    description: String(description),
    default_price: default_price,
  });

  pricesToArchive.forEach(async (item) => {
    await stripe.prices.update(String(item), {
      active: false,
    });
  })

  if (stripe_update.active) {
    let postSubmission = {
      title: title,
      content: content,
      product_subject: JSON.parse(subject as string),
      post_grade: JSON.parse(gradeLevel as string),
      image_urls: imageUrl,
      user_id: user.id,
      stripe_price_id: default_price,
      resource_types: JSON.parse(resourceType as string),
      secular: secular?.valueOf(),
    };
    const { error, data } = await supabase
      .from("seller_post")
      .update([postSubmission])
      .eq("id", idSupabase);
    console.log(postSubmission);

    if (error) {
      console.log(error);
      return new Response(
        JSON.stringify({
          message: t("apiErrors.postError"),
        }),
        { status: 500 }
      );
    } else {
      console.log("Post Data: " + JSON.stringify(data));
    }
  } else {
    return new Response(
      JSON.stringify({
        message: "Stripe Product not active",
      }),
      { status: 500 }
    )
  }
  // Do something with the formData, then return a success response
  return new Response(
    JSON.stringify({
      message: t("apiErrors.success"),
      id: idSupabase,
    }),
    { status: 200 }
  );
};
