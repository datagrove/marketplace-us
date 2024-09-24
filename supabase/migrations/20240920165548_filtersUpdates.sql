drop policy "Allow Read Access for Everyone" on "public"."post_subtopic"

create policy "Allow Read Access for Everyone"
on "public"."post_subtopic"
as permissive
for select
to authenticated, anon
using (true);