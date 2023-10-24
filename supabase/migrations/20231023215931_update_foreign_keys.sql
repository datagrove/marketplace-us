alter table "public"."clients" drop constraint "clients_user_id_fkey";

alter table "public"."provider_post" drop constraint "provider_post_user_id_fkey";

alter table "public"."providers" drop constraint "providers_user_id_fkey";

alter table "public"."clients" add constraint "clients_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

alter table "public"."clients" validate constraint "clients_user_id_fkey";

alter table "public"."provider_post" add constraint "provider_post_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

alter table "public"."provider_post" validate constraint "provider_post_user_id_fkey";

alter table "public"."providers" add constraint "providers_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

alter table "public"."providers" validate constraint "providers_user_id_fkey";


