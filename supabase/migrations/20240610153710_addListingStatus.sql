alter table "public"."seller_post" add column "listing_status" boolean not null default true;

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
    seller_post.resource_types,
    seller_post.listing_status
   FROM ((seller_post
     LEFT JOIN profiles ON ((seller_post.user_id = profiles.user_id)))
     LEFT JOIN sellers ON ((seller_post.user_id = sellers.user_id)));

CREATE OR REPLACE FUNCTION "public"."title_content"("public"."sellerposts") RETURNS "text"
    LANGUAGE "sql" IMMUTABLE
    AS $_$
  select $1.title || ' ' || $1.content;
$_$;
