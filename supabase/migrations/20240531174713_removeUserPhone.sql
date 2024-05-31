drop policy "Allow users to update their own data" on "public"."clients";

drop policy "Enable insert for anon and authenticated users" on "public"."clients";

drop policy "Enable select authenticated users only" on "public"."clients";

revoke delete on table "public"."clients" from "anon";

revoke insert on table "public"."clients" from "anon";

revoke references on table "public"."clients" from "anon";

revoke select on table "public"."clients" from "anon";

revoke trigger on table "public"."clients" from "anon";

revoke truncate on table "public"."clients" from "anon";

revoke update on table "public"."clients" from "anon";

revoke delete on table "public"."clients" from "authenticated";

revoke insert on table "public"."clients" from "authenticated";

revoke references on table "public"."clients" from "authenticated";

revoke select on table "public"."clients" from "authenticated";

revoke trigger on table "public"."clients" from "authenticated";

revoke truncate on table "public"."clients" from "authenticated";

revoke update on table "public"."clients" from "authenticated";

revoke delete on table "public"."clients" from "service_role";

revoke insert on table "public"."clients" from "service_role";

revoke references on table "public"."clients" from "service_role";

revoke select on table "public"."clients" from "service_role";

revoke trigger on table "public"."clients" from "service_role";

revoke truncate on table "public"."clients" from "service_role";

revoke update on table "public"."clients" from "service_role";

alter table "public"."clients" drop constraint "clients_id_key";

alter table "public"."clients" drop constraint "clients_user_id_fkey";

drop view if exists "public"."clientview";

alter table "public"."clients" drop constraint "clients_pkey";

drop index if exists "public"."clients_id_key";

drop index if exists "public"."clients_pkey";

drop table "public"."clients";

create table "public"."users" (
    "user_id" uuid not null,
    "created_at" timestamp with time zone default now(),
    "display_name" text,
    "image_url" text
);


alter table "public"."users" enable row level security;

CREATE UNIQUE INDEX clients_id_key ON public.users USING btree (user_id);

CREATE UNIQUE INDEX clients_pkey ON public.users USING btree (user_id);

alter table "public"."users" add constraint "clients_pkey" PRIMARY KEY using index "clients_pkey";

alter table "public"."users" add constraint "clients_id_key" UNIQUE using index "clients_id_key";

alter table "public"."users" add constraint "clients_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."users" validate constraint "clients_user_id_fkey";


grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant select on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";

create policy "Allow users to update their own data"
on "public"."users"
as permissive
for update
to authenticated
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));


create policy "Enable insert for anon and authenticated users"
on "public"."users"
as permissive
for insert
to authenticated, anon
with check (true);


create policy "Enable select authenticated users only"
on "public"."users"
as permissive
for select
to authenticated
using (true);

drop view if exists "public"."clientview";

CREATE OR REPLACE VIEW "public"."user_view" WITH ("security_invoker"='on') AS
 SELECT "users"."user_id",
    "users"."created_at",
    "users"."display_name",
    "users"."image_url",
    "profiles"."first_name",
    "profiles"."last_name",
    "profiles"."email"
   FROM (("public"."users"
     LEFT JOIN "public"."profiles" ON (("users"."user_id" = "profiles"."user_id"))));


