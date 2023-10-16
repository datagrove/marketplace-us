alter table "storage"."buckets" drop constraint IF EXISTS "buckets_owner_fkey";

alter table "storage"."buckets" add column IF NOT EXISTS "owner_id" text;

alter table "storage"."objects" add column IF NOT EXISTS "owner_id" text;

--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") VALUES
	('user.image', 'user.image', NULL, '2023-07-13 19:25:41.126949+00', '2023-07-13 19:25:41.126949+00', false, false, NULL, NULL, NULL),
	('post.image', 'post.image', NULL, '2023-08-01 19:11:48.793899+00', '2023-08-01 19:11:48.793899+00', false, false, NULL, NULL, NULL);


create policy "All Authenticated Users can Upload an Image 8n3q0o_0"
on "storage"."objects"
as permissive
for insert
to authenticated
with check ((bucket_id = 'user.image'::text));


create policy "Allow users to delete their own images 8n3q0o_0"
on "storage"."objects"
as permissive
for select
to authenticated
using (((bucket_id = 'user.image'::text) AND (auth.uid() = owner)));


create policy "Allow users to delete their own images 8n3q0o_1"
on "storage"."objects"
as permissive
for delete
to authenticated
using (((bucket_id = 'user.image'::text) AND (auth.uid() = owner)));


create policy "Anyone can update their own post images."
on "storage"."objects"
as permissive
for update
to authenticated
using ((auth.uid() = owner))
with check ((bucket_id = 'post.image'::text));


create policy "Anyone can update their own profile image."
on "storage"."objects"
as permissive
for update
to authenticated
using ((auth.uid() = owner))
with check ((bucket_id = 'user.image'::text));


create policy "Authenticated Users can Insert 936eml_0"
on "storage"."objects"
as permissive
for insert
to authenticated
with check ((bucket_id = 'post.image'::text));


create policy "Give users access to delete their own images 936eml_0"
on "storage"."objects"
as permissive
for select
to authenticated
using (((bucket_id = 'post.image'::text) AND (auth.uid() = owner)));


create policy "Give users access to delete their own images 936eml_1"
on "storage"."objects"
as permissive
for delete
to authenticated
using (((bucket_id = 'post.image'::text) AND (auth.uid() = owner)));


create policy "Give users authenticated select access 936eml_0"
on "storage"."objects"
as permissive
for select
to authenticated
using (((bucket_id = 'post.image'::text) AND (auth.role() = 'authenticated'::text)));


create policy "Images Available To Authenticated Users 8n3q0o_0"
on "storage"."objects"
as permissive
for select
to authenticated
using ((bucket_id = 'user.image'::text));



