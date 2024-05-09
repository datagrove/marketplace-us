alter table "public"."sellers" drop constraint "sellers_location_fkey";

drop view if exists "public"."sellerview";

alter table "public"."sellers" drop column "location";

alter table "public"."sellers" drop column "seller_phone";

CREATE OR REPLACE VIEW "public"."sellerview" WITH ("security_invoker"='on') AS
 SELECT "sellers"."user_id",
    "sellers"."created_at",
    "sellers"."seller_name",
    "sellers"."image_url",
    "sellers"."seller_id",
    "profiles"."first_name",
    "profiles"."last_name",
    "profiles"."email"
   FROM (("public"."sellers"
     LEFT JOIN "public"."profiles" ON (("sellers"."user_id" = "profiles"."user_id"))));

ALTER TABLE "public"."sellerview" OWNER TO "postgres"; 