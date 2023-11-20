alter table "public"."providers" alter column "language_spoken" set data type text[] using "language_spoken"::text[];

create or replace view "public"."providerview" as  SELECT providers.user_id,
    providers.created_at,
    providers.provider_name,
    providers.provider_phone,
    providers.image_url,
    providers.provider_id,
    locationview.major_municipality,
    locationview.minor_municipality,
    locationview.governing_district,
    locationview.country,
    profiles.first_name,
    profiles.last_name,
    profiles.email,
    providers.language_spoken
   FROM ((providers
     LEFT JOIN profiles ON ((providers.user_id = profiles.user_id)))
     LEFT JOIN locationview ON ((providers.location = locationview.id)));

INSERT INTO "public"."language" ("id", "language") VALUES
	(2, 'Español'),
  (3, 'Français');

create policy "Enable select for authenticated users only"
on "public"."language"
as permissive
for select
to authenticated
using (true);
