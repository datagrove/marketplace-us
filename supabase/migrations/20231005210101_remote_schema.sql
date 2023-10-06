alter table "storage"."objects" add constraint "objects_owner_fkey" FOREIGN KEY (owner) REFERENCES auth.users(id) not valid;

alter table "storage"."objects" validate constraint "objects_owner_fkey";

create policy "All Authenticated Users can Upload an Image 8n3q0o_0"
on "storage"."objects"
as permissive
for insert
to authenticated
with check ((bucket_id = 'user.image'::text));


create policy "All Authenticated Users can Upload an Image 936eml_0"
on "storage"."objects"
as permissive
for insert
to authenticated
with check ((bucket_id = 'post.image'::text));


create policy "All Authenticated users can View Images 8n3q0o_0"
on "storage"."objects"
as permissive
for select
to authenticated
using ((bucket_id = 'user.image'::text));


create policy "All Authenticated users can view images 936eml_0"
on "storage"."objects"
as permissive
for select
to authenticated
using ((bucket_id = 'post.image'::text));


create policy "Users can delete their own images 8n3q0o_0"
on "storage"."objects"
as permissive
for select
to authenticated
using (((bucket_id = 'user.image'::text) AND (auth.uid() = owner)));


create policy "Users can delete their own images 8n3q0o_1"
on "storage"."objects"
as permissive
for delete
to authenticated
using (((bucket_id = 'user.image'::text) AND (auth.uid() = owner)));


create policy "Users can delete their own images 936eml_0"
on "storage"."objects"
as permissive
for select
to authenticated
using (((bucket_id = 'post.image'::text) AND (auth.uid() = owner)));


create policy "Users can delete their own images 936eml_1"
on "storage"."objects"
as permissive
for update
to authenticated
using (((bucket_id = 'post.image'::text) AND (auth.uid() = owner)));



