drop view if exists"public"."sellerposts" cascade;

CREATE OR REPLACE VIEW "public"."sellerposts" WITH ("security_invoker"='on') AS 
SELECT 
    seller_post.id,
    seller_post.title,
    seller_post.content,
    seller_post.user_id,
    sellers.seller_name,
    sellers.seller_id,
    profiles.email,
    seller_post.stripe_price_id AS price_id,
    seller_post.price_value,
    seller_post.stripe_product_id AS product_id,
    seller_post.listing_status,
    seller_post.secular,
    seller_post.draft_status,
    seller_post.resource_urls,
    seller_post.created_at,
    COALESCE(
        ARRAY_AGG(DISTINCT seller_post_image.image_uuid) FILTER (WHERE seller_post_image.image_uuid IS NOT NULL),
        '{}'
    ) as image_urls,
    COALESCE(
        ARRAY_AGG(DISTINCT post_subtopic.id) FILTER (WHERE post_subtopic.id IS NOT NULL),
        '{}'
    ) AS subtopics,  -- Aggregate subcategories
    COALESCE(
        ARRAY_AGG(DISTINCT post_subject.id) FILTER (WHERE post_subject.id IS NOT NULL),
        '{}'
    ) AS subjects,            -- Aggregate subjects
    COALESCE(
        ARRAY_AGG(DISTINCT grade_level.id) FILTER (WHERE grade_level.id IS NOT NULL), 
        '{}'
    ) AS grades,
    COALESCE(
        ARRAY_AGG(DISTINCT resource_types.id) FILTER (WHERE resource_types.id IS NOT NULL), 
        '{}'
    ) AS resource_types           -- Aggregate resource types
FROM 
    seller_post
LEFT JOIN profiles ON seller_post.user_id = profiles.user_id
LEFT JOIN sellers ON seller_post.user_id = sellers.user_id
LEFT JOIN seller_post_image ON seller_post.id = seller_post_image.post_id
LEFT JOIN seller_post_subject ON seller_post.id = seller_post_subject.post_id  -- Join post and subjects
LEFT JOIN post_subject ON seller_post_subject.subject_id = post_subject.id    -- Join subjects
LEFT JOIN seller_post_subtopic ON seller_post.id = seller_post_subtopic.post_id   -- Join subcategories
LEFT JOIN post_subtopic ON seller_post_subtopic.subtopic_id = post_subtopic.id   -- Join subcategories
LEFT JOIN seller_post_grade ON seller_post.id = seller_post_grade.post_id     -- Join post and grades
LEFT JOIN grade_level ON seller_post_grade.grade_id = grade_level.id            -- Join grades
LEFT JOIN seller_post_resource_types ON seller_post.id = seller_post_resource_types.post_id 
LEFT JOIN resource_types ON seller_post_resource_types.resource_type_id = resource_types.id  -- Join resource types
GROUP BY 
    seller_post.id, 
    seller_post.title, 
    seller_post.content, 
    seller_post.user_id, 
    sellers.seller_name, 
    sellers.seller_id, 
    profiles.email, 
    seller_post.stripe_price_id, 
    seller_post.price_value,
    seller_post.stripe_product_id, 
    seller_post.listing_status, 
    seller_post.secular, 
    seller_post.draft_status, 
    seller_post.resource_urls,
    seller_post.created_at;

CREATE OR REPLACE FUNCTION "public"."title_content"("public"."sellerposts") RETURNS "text"
    LANGUAGE "sql" IMMUTABLE
    AS $_$
  select $1.title || ' ' || $1.content;
$_$;