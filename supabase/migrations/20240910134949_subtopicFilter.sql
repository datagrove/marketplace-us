create table "public"."post_subtopic" (
    "id" bigint generated by default as identity not null,
    "subtopic" text not null default ''::text,
    "subject_id" bigint not null
);


alter table "public"."post_subtopic" enable row level security;

create table "public"."seller_post_subtopic" (
    "post_id" bigint not null,
    "subtopic_id" bigint not null
);


alter table "public"."seller_post_subtopic" enable row level security;

CREATE UNIQUE INDEX post_subtopic_pkey ON public.post_subtopic USING btree (id);

CREATE UNIQUE INDEX seller_post_subtopic_pkey ON public.seller_post_subtopic USING btree (post_id, subtopic_id);

alter table "public"."post_subtopic" add constraint "post_subtopic_pkey" PRIMARY KEY using index "post_subtopic_pkey";

alter table "public"."seller_post_subtopic" add constraint "seller_post_subtopic_pkey" PRIMARY KEY using index "seller_post_subtopic_pkey";

alter table "public"."post_subtopic" add constraint "post_subtopic_subject_id_fkey" FOREIGN KEY (subject_id) REFERENCES post_subject(id) not valid;

alter table "public"."post_subtopic" validate constraint "post_subtopic_subject_id_fkey";

alter table "public"."seller_post_subtopic" add constraint "seller_post_subtopic_post_id_fkey" FOREIGN KEY (post_id) REFERENCES seller_post(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."seller_post_subtopic" validate constraint "seller_post_subtopic_post_id_fkey";

alter table "public"."seller_post_subtopic" add constraint "seller_post_subtopic_subtopic_id_fkey" FOREIGN KEY (subtopic_id) REFERENCES post_subtopic(id) ON UPDATE CASCADE not valid;

alter table "public"."seller_post_subtopic" validate constraint "seller_post_subtopic_subtopic_id_fkey";

create or replace view "public"."sellerposts" WITH ("security_invoker"='on') as  SELECT 
    seller_post.id,
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
    seller_post.listing_status,
    seller_post.secular,
    seller_post.draft_status,
    seller_post.resource_urls,
    seller_post.resource_links,
    ARRAY_AGG(DISTINCT post_subtopic.subtopic) AS subtopics  -- Aggregate subcategories
   FROM ((seller_post
     LEFT JOIN profiles ON ((seller_post.user_id = profiles.user_id)))
     LEFT JOIN sellers ON ((seller_post.user_id = sellers.user_id)))
     LEFT JOIN seller_post_subject ON seller_post.id = seller_post_subject.post_id  -- Join post and subjects
     LEFT JOIN post_subcategory ON seller_post_subject.subject_id = post_subcategory.subject_id  -- Join subjects and subcategories
    GROUP BY 
        seller_post.id, 
        seller_post.title, 
        seller_post.content, 
        seller_post.user_id, 
        seller_post.image_urls, 
        seller_post.product_subject, 
        seller_post.post_grade, 
        sellers.seller_name, 
        sellers.seller_id, 
        profiles.email, 
        seller_post.stripe_price_id, 
        seller_post.stripe_product_id, 
        seller_post.resource_types, 
        seller_post.listing_status, 
        seller_post.secular, 
        seller_post.draft_status, 
        seller_post.resource_urls;


grant delete on table "public"."post_subtopic" to "anon";

grant insert on table "public"."post_subtopic" to "anon";

grant references on table "public"."post_subtopic" to "anon";

grant select on table "public"."post_subtopic" to "anon";

grant trigger on table "public"."post_subtopic" to "anon";

grant truncate on table "public"."post_subtopic" to "anon";

grant update on table "public"."post_subtopic" to "anon";

grant delete on table "public"."post_subtopic" to "authenticated";

grant insert on table "public"."post_subtopic" to "authenticated";

grant references on table "public"."post_subtopic" to "authenticated";

grant select on table "public"."post_subtopic" to "authenticated";

grant trigger on table "public"."post_subtopic" to "authenticated";

grant truncate on table "public"."post_subtopic" to "authenticated";

grant update on table "public"."post_subtopic" to "authenticated";

grant delete on table "public"."post_subtopic" to "service_role";

grant insert on table "public"."post_subtopic" to "service_role";

grant references on table "public"."post_subtopic" to "service_role";

grant select on table "public"."post_subtopic" to "service_role";

grant trigger on table "public"."post_subtopic" to "service_role";

grant truncate on table "public"."post_subtopic" to "service_role";

grant update on table "public"."post_subtopic" to "service_role";

grant delete on table "public"."seller_post_subtopic" to "anon";

grant insert on table "public"."seller_post_subtopic" to "anon";

grant references on table "public"."seller_post_subtopic" to "anon";

grant select on table "public"."seller_post_subtopic" to "anon";

grant trigger on table "public"."seller_post_subtopic" to "anon";

grant truncate on table "public"."seller_post_subtopic" to "anon";

grant update on table "public"."seller_post_subtopic" to "anon";

grant delete on table "public"."seller_post_subtopic" to "authenticated";

grant insert on table "public"."seller_post_subtopic" to "authenticated";

grant references on table "public"."seller_post_subtopic" to "authenticated";

grant select on table "public"."seller_post_subtopic" to "authenticated";

grant trigger on table "public"."seller_post_subtopic" to "authenticated";

grant truncate on table "public"."seller_post_subtopic" to "authenticated";

grant update on table "public"."seller_post_subtopic" to "authenticated";

grant delete on table "public"."seller_post_subtopic" to "service_role";

grant insert on table "public"."seller_post_subtopic" to "service_role";

grant references on table "public"."seller_post_subtopic" to "service_role";

grant select on table "public"."seller_post_subtopic" to "service_role";

grant trigger on table "public"."seller_post_subtopic" to "service_role";

grant truncate on table "public"."seller_post_subtopic" to "service_role";

grant update on table "public"."seller_post_subtopic" to "service_role";

INSERT INTO "public"."post_subtopic" ("id", "subtopic", "subject_id") VALUES
	(1, 'Art', 3),
    (2, 'Music', 3),
    (3, 'Vocal Music', 3),
    (4, 'Dance', 1),
    (5, 'Instrumental Music', 1),
    (6, 'Music Composition', 1),
    (7, 'Music History', 1),
    (8, 'Art History', 1),
    (9, 'Graphic Arts', 1),
    (10, 'Visual Arts', 2),
    (11, 'Other Performing Arts', 1),
    (12, 'Other Art', 1),
    (13, 'Reading', 9),
    (14, 'Spelling', 9),
    (15, 'Vocabulary', 9),
    (16, 'Grammar', 9),
    (17, 'Writing', 9),
    (18, 'Creative Writing', 9),
    (19, 'Poetry', 9),
    (20, 'Earth Day', 4),
    (21, 'Easter', 4),
    (22, 'Halloween', 4),
    (23, 'Thanksgiving', 4),
    (24, 'Christmas', 4),
    (25, 'Back to School', 4),
    (26, 'End of School', 4),
    (27, 'St. Patrick''s Day', 4),
    (28, 'Valentines Day', 4),
    (29, 'Martin Luther King Jr. Day', 4),
    (30, 'Chanukah', 4),
    (31, 'Kwanzaa', 4),
    (32, 'Columbus Day', 4),
    (33, 'New Year''s', 4),
    (34, 'Summer', 4),
    (35, 'Fall', 4),
    (36, 'Winter', 4),
    (37, 'Spring', 4);
