drop view if exists "public"."sellerview";

alter table "public"."sellers" alter column "language_spoken" drop not null;

create or replace view "public"."sellerview" as  SELECT sellers.user_id,
    sellers.created_at,
    sellers.seller_name,
    sellers.seller_phone,
    sellers.image_url,
    sellers.seller_id,
    locationview.major_municipality,
    profiles.first_name,
    profiles.last_name,
    profiles.email
   FROM ((sellers
     LEFT JOIN profiles ON ((sellers.user_id = profiles.user_id)))
     LEFT JOIN locationview ON ((sellers.location = locationview.id)));

alter table "public"."sellers" add column "stripe_connected_account_id" text;

CREATE UNIQUE INDEX sellers_stripe_connected_account_id_key ON public.sellers USING btree (stripe_connected_account_id);

alter table "public"."sellers" add constraint "sellers_stripe_connected_account_id_key" UNIQUE using index "sellers_stripe_connected_account_id_key";
