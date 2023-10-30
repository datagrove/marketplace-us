alter table "public"."providers" add constraint "providers_language_spoken_fkey" FOREIGN KEY (language_spoken) REFERENCES language(language) not valid;

alter table "public"."providers" validate constraint "providers_language_spoken_fkey";

create or replace view "public"."providerviewlang" as  SELECT providers.user_id,
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



