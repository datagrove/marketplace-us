alter table "public"."seller_post" add column "resource_urls" text;

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") VALUES
	('resources', 'resources', NULL, '2024-04-29 17:25:46.219535+00', '2024-04-29 17:25:46.219535+00', false, false, NULL, NULL, NULL);

create policy "Authenticated Users can Insert 128fyud_0"
on "storage"."objects"
as permissive
for insert
to authenticated
with check ((bucket_id = 'resources'::text));


create policy "Give users access to delete their own resources 128fyud_0"
on "storage"."objects"
as permissive
for select
to anon
using (((bucket_id = 'resources'::text) AND (auth.uid() = owner)));


create policy "Give users access to delete their own resources 128fyud_1"
on "storage"."objects"
as permissive
for delete
to anon
using (((bucket_id = 'resources'::text) AND (auth.uid() = owner)));
