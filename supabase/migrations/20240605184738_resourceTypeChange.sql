

drop policy "Enable read access for all users" on "public"."resource_types";

alter table "public"."seller_post" alter column "resource_types" set data type text[] using "resource_types"::text[];

create or replace view "public"."sellerposts" WITH ("security_invoker"='on') as  SELECT seller_post.id,
    seller_post.title,
    seller_post.content,
    seller_post.user_id,
    seller_post.image_urls,
    seller_post.product_subject,
    seller_post.post_grade,
    sellers.seller_name,
    sellers.seller_id,
    profiles.email,
    seller_post.stripe_price_id AS price_id,
    seller_post.stripe_product_id AS product_id,
    seller_post.resource_types
   FROM ((seller_post
     LEFT JOIN profiles ON ((seller_post.user_id = profiles.user_id)))
     LEFT JOIN sellers ON ((seller_post.user_id = sellers.user_id)));

CREATE OR REPLACE FUNCTION "public"."title_content"("public"."sellerposts") RETURNS "text"
    LANGUAGE "sql" IMMUTABLE
    AS $_$
  select $1.title || ' ' || $1.content;
$_$;

create policy "Enable read access for all users"
on "public"."resource_types"
as permissive
for select
to public
using (true);

DELETE FROM resource_types;

INSERT INTO "public"."resource_types" ("id", "type") VALUES
	(1, 'Activities'),
	(2, 'Worksheets'),
	(3, 'Assessment'),
	(4, 'Bulletin Board'),
	(5, 'Flash Cards'),
	(6, 'Lesson Plan'),
  (7, 'Study Guide'),
  (8, 'Unit Plan'),
  (9, 'Workbook'),
  (10, 'Projects'),
  (11, 'Other');

