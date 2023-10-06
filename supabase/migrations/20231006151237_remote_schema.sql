alter table "storage"."buckets" drop constraint "buckets_owner_fkey";

alter table "storage"."buckets" add column "owner_id" text;

alter table "storage"."objects" add column "owner_id" text;

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



