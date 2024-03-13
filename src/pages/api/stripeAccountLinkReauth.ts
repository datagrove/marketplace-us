import stripe from "../../lib/stripe";
import type { APIRoute } from "astro";
import { useTranslations } from "@i18n/utils";
import { SITE } from "../../config";

export const POST: APIRoute = async ({ request, redirect }) => {
    const formData = await request.formData();
    const lang = formData.get("lang");
    //@ts-ignore
    const t = useTranslations(lang);

    return new Response(
        JSON.stringify({
          message: t("apiErrors.success"),
          redirect: "/provider/profile",
        }),
        { status: 200 }
      );
}