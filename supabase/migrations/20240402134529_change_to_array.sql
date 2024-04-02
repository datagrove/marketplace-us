alter table "public"."seller_post" alter column "product_subject" set data type text[] using "product_subject"::text[];


