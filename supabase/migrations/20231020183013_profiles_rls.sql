drop policy "Enable insert for authenticated users only" on "public"."profiles";

create policy "Enable insert for authenticated users only"
on "public"."profiles"
as permissive
for insert
to anon, authenticated
with check (true);



