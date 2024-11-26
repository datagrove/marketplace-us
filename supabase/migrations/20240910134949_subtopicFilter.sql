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
    (4, 'Dance', 3),
    (5, 'Instrumental Music', 3),
    (6, 'Music Composition', 3),
    (7, 'Music History', 3),
    (8, 'Art History', 3),
    (9, 'Graphic Arts', 3),
    (10, 'Visual Arts', 3),
    (11, 'Other Performing Arts', 3),
    (12, 'Other Art', 3),
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
    (37, 'Spring', 4),
    (38, 'Geography', 7),
    (39, 'History', 7),
    (40, 'African History', 7),
    (41, 'U.S History', 7),
    (42, 'British History', 7),
    (43, 'Government', 7),
    (44, 'European History', 7),
    (45, 'Middle Ages', 7),
    (46, 'Ancient Civilizations', 7),
    (47, 'Economics', 7),
    (48, 'Civics', 7),
    (49, 'World History', 7),
    (50, 'Criminal Justice & Law', 7),
    (51, 'Native American History', 7),
    (52, 'Australian History', 7),
    (53, 'Algebra', 5),
    (54, 'Geometry', 5),
    (55, 'Trigonometry', 5),
    (56, 'Statistics', 5),
    (57, 'Precalculus', 5),
    (58, 'Calculus', 5),
    (59, 'Algebra II', 5),
    (60, 'Arithmetic', 5),
    (61, 'Basic Operations', 5),
    (62, 'Decimals', 5),
    (63, 'Fractions', 5),
    (64, 'Graphing', 5),
    (65, 'Measurement', 5),
    (66, 'Numbers', 5),
    (67, 'Order of Operations', 5),
    (68, 'Place Value', 5),
    (69, 'Word Problems', 5),
    (70, 'Mental Math', 5),
    (71, 'Anatomy', 6),
    (72, 'Physiology', 6),
    (73, 'Chemistry', 6),
    (74, 'Biology', 6),
    (75, 'Earth Science', 6),
    (76, 'Astronomy', 6),
    (77, 'Geology', 6),
    (78, 'Life Science', 6),
    (79, 'Physical Science', 6),
    (80, 'Physics', 6),
    (81, 'Computer Science', 6),
    (82, 'Engineering', 6),
    (83, 'Archaeology', 6),
    (84, 'Environment', 6),
    (85, 'Forensics', 6),
    (86, 'Religion', 8),
    (87, 'Business', 8),
    (88, 'Law', 8),
    (89, 'Pharmacy', 8),
    (90, 'Continuing Professional Education', 8),
    (91, 'Career & Technical Education', 8),
    (92, 'Critical Thinking', 8),
    (93, 'Homeschool Administration', 8),
    (94, 'Coaching', 8),
    (95, 'Child Care', 8),
    (96, 'Cooking & Culinary Arts', 8),
    (97, 'Physical Education', 8),
    (98, 'Vocational', 8),
    (99, 'Life Skills', 8),
    (100, 'Library Skills', 8),
    (101, 'Traffic & Bicycle Safety', 8),
    (102, 'Fire Prevention & Safety', 8),
    (103, 'Health', 6),
    (104, 'Patriotism & Citizenship', 7);

-- Add Join tables for grades, subjects, resource types

create table "public"."seller_post_grade" (
    "post_id" bigint not null,
    "grade_id" bigint not null
);


alter table "public"."seller_post_grade" enable row level security;

create table "public"."seller_post_subject" (
    "post_id" bigint not null,
    "subject_id" bigint not null
);

create table "public"."seller_post_resource_types" (
    "post_id" bigint not null,
    "resource_type_id" bigint not null
);

create table "public"."seller_post_image" (
    "id" bigint generated by default as identity not null,
    "post_id" bigint not null,
    "image_uuid" text not null
);


alter table "public"."seller_post_image" enable row level security;

alter table "public"."seller_post_subject" enable row level security;

CREATE UNIQUE INDEX seller_post_image_image_uuid_key ON public.seller_post_image USING btree (image_uuid);

CREATE UNIQUE INDEX seller_post_image_pkey ON public.seller_post_image USING btree (id);

alter table "public"."seller_post_image" add constraint "seller_post_image_pkey" PRIMARY KEY using index "seller_post_image_pkey";

alter table "public"."seller_post_image" add constraint "seller_post_image_image_uuid_key" UNIQUE using index "seller_post_image_image_uuid_key";

alter table "public"."seller_post_image" add constraint "seller_post_image_post_id_fkey" FOREIGN KEY (post_id) REFERENCES seller_post(id) ON DELETE CASCADE not valid;

alter table "public"."seller_post_image" validate constraint "seller_post_image_post_id_fkey";

grant delete on table "public"."seller_post_image" to "anon";

grant insert on table "public"."seller_post_image" to "anon";

grant references on table "public"."seller_post_image" to "anon";

grant select on table "public"."seller_post_image" to "anon";

grant trigger on table "public"."seller_post_image" to "anon";

grant truncate on table "public"."seller_post_image" to "anon";

grant update on table "public"."seller_post_image" to "anon";

grant delete on table "public"."seller_post_image" to "authenticated";

grant insert on table "public"."seller_post_image" to "authenticated";

grant references on table "public"."seller_post_image" to "authenticated";

grant select on table "public"."seller_post_image" to "authenticated";

grant trigger on table "public"."seller_post_image" to "authenticated";

grant truncate on table "public"."seller_post_image" to "authenticated";

grant update on table "public"."seller_post_image" to "authenticated";

grant delete on table "public"."seller_post_image" to "service_role";

grant insert on table "public"."seller_post_image" to "service_role";

grant references on table "public"."seller_post_image" to "service_role";

grant select on table "public"."seller_post_image" to "service_role";

grant trigger on table "public"."seller_post_image" to "service_role";

grant truncate on table "public"."seller_post_image" to "service_role";

grant update on table "public"."seller_post_image" to "service_role";

CREATE UNIQUE INDEX seller_post_grade_pkey ON public.seller_post_grade USING btree (post_id, grade_id);

CREATE UNIQUE INDEX seller_post_subject_pkey ON public.seller_post_subject USING btree (post_id, subject_id);

alter table "public"."seller_post_grade" add constraint "seller_post_grade_pkey" PRIMARY KEY using index "seller_post_grade_pkey";

alter table "public"."seller_post_subject" add constraint "seller_post_subject_pkey" PRIMARY KEY using index "seller_post_subject_pkey";

alter table "public"."seller_post_grade" add constraint "seller_post_grade_grade_id_fkey" FOREIGN KEY (grade_id) REFERENCES grade_level(id) not valid;

alter table "public"."seller_post_grade" validate constraint "seller_post_grade_grade_id_fkey";

alter table "public"."seller_post_grade" add constraint "seller_post_grade_post_id_fkey" FOREIGN KEY (post_id) REFERENCES seller_post(id) ON DELETE CASCADE not valid;

alter table "public"."seller_post_grade" validate constraint "seller_post_grade_post_id_fkey";

alter table "public"."seller_post_subject" add constraint "seller_post_subject_post_id_fkey" FOREIGN KEY (post_id) REFERENCES seller_post(id) ON DELETE CASCADE not valid;

alter table "public"."seller_post_subject" validate constraint "seller_post_subject_post_id_fkey";

alter table "public"."seller_post_subject" add constraint "seller_post_subject_subject_id_fkey" FOREIGN KEY (subject_id) REFERENCES post_subject(id) not valid;

alter table "public"."seller_post_subject" validate constraint "seller_post_subject_subject_id_fkey";

grant delete on table "public"."seller_post_grade" to "anon";

grant insert on table "public"."seller_post_grade" to "anon";

grant references on table "public"."seller_post_grade" to "anon";

grant select on table "public"."seller_post_grade" to "anon";

grant trigger on table "public"."seller_post_grade" to "anon";

grant truncate on table "public"."seller_post_grade" to "anon";

grant update on table "public"."seller_post_grade" to "anon";

grant delete on table "public"."seller_post_grade" to "authenticated";

grant insert on table "public"."seller_post_grade" to "authenticated";

grant references on table "public"."seller_post_grade" to "authenticated";

grant select on table "public"."seller_post_grade" to "authenticated";

grant trigger on table "public"."seller_post_grade" to "authenticated";

grant truncate on table "public"."seller_post_grade" to "authenticated";

grant update on table "public"."seller_post_grade" to "authenticated";

grant delete on table "public"."seller_post_grade" to "service_role";

grant insert on table "public"."seller_post_grade" to "service_role";

grant references on table "public"."seller_post_grade" to "service_role";

grant select on table "public"."seller_post_grade" to "service_role";

grant trigger on table "public"."seller_post_grade" to "service_role";

grant truncate on table "public"."seller_post_grade" to "service_role";

grant update on table "public"."seller_post_grade" to "service_role";

grant delete on table "public"."seller_post_subject" to "anon";

grant insert on table "public"."seller_post_subject" to "anon";

grant references on table "public"."seller_post_subject" to "anon";

grant select on table "public"."seller_post_subject" to "anon";

grant trigger on table "public"."seller_post_subject" to "anon";

grant truncate on table "public"."seller_post_subject" to "anon";

grant update on table "public"."seller_post_subject" to "anon";

grant delete on table "public"."seller_post_subject" to "authenticated";

grant insert on table "public"."seller_post_subject" to "authenticated";

grant references on table "public"."seller_post_subject" to "authenticated";

grant select on table "public"."seller_post_subject" to "authenticated";

grant trigger on table "public"."seller_post_subject" to "authenticated";

grant truncate on table "public"."seller_post_subject" to "authenticated";

grant update on table "public"."seller_post_subject" to "authenticated";

grant delete on table "public"."seller_post_subject" to "service_role";

grant insert on table "public"."seller_post_subject" to "service_role";

grant references on table "public"."seller_post_subject" to "service_role";

grant select on table "public"."seller_post_subject" to "service_role";

grant trigger on table "public"."seller_post_subject" to "service_role";

grant truncate on table "public"."seller_post_subject" to "service_role";

grant update on table "public"."seller_post_subject" to "service_role";

alter table "public"."seller_post_resource_types" enable row level security;

CREATE UNIQUE INDEX seller_post_resource_types_pkey ON public.seller_post_resource_types USING btree (post_id, resource_type_id);

alter table "public"."seller_post_resource_types" add constraint "seller_post_resource_types_pkey" PRIMARY KEY using index "seller_post_resource_types_pkey";

alter table "public"."seller_post_resource_types" add constraint "seller_post_resource_types_post_id_fkey" FOREIGN KEY (post_id) REFERENCES seller_post(id) ON DELETE CASCADE not valid;

alter table "public"."seller_post_resource_types" validate constraint "seller_post_resource_types_post_id_fkey";

alter table "public"."seller_post_resource_types" add constraint "seller_post_resource_types_resource_type_id_fkey" FOREIGN KEY (resource_type_id) REFERENCES resource_types(id) ON DELETE CASCADE not valid;

alter table "public"."seller_post_resource_types" validate constraint "seller_post_resource_types_resource_type_id_fkey";

grant delete on table "public"."seller_post_resource_types" to "anon";

grant insert on table "public"."seller_post_resource_types" to "anon";

grant references on table "public"."seller_post_resource_types" to "anon";

grant select on table "public"."seller_post_resource_types" to "anon";

grant trigger on table "public"."seller_post_resource_types" to "anon";

grant truncate on table "public"."seller_post_resource_types" to "anon";

grant update on table "public"."seller_post_resource_types" to "anon";

grant delete on table "public"."seller_post_resource_types" to "authenticated";

grant insert on table "public"."seller_post_resource_types" to "authenticated";

grant references on table "public"."seller_post_resource_types" to "authenticated";

grant select on table "public"."seller_post_resource_types" to "authenticated";

grant trigger on table "public"."seller_post_resource_types" to "authenticated";

grant truncate on table "public"."seller_post_resource_types" to "authenticated";

grant update on table "public"."seller_post_resource_types" to "authenticated";

grant delete on table "public"."seller_post_resource_types" to "service_role";

grant insert on table "public"."seller_post_resource_types" to "service_role";

grant references on table "public"."seller_post_resource_types" to "service_role";

grant select on table "public"."seller_post_resource_types" to "service_role";

grant trigger on table "public"."seller_post_resource_types" to "service_role";

grant truncate on table "public"."seller_post_resource_types" to "service_role";

grant update on table "public"."seller_post_resource_types" to "service_role";

-- Convert current posts to use join tables for subject and grade

INSERT INTO public.seller_post_subject (post_id, subject_id)
SELECT id, unnest(product_subject)::bigint  -- Unnest the subject array into individual rows
FROM public.seller_post;

INSERT INTO public.seller_post_grade (post_id, grade_id)
SELECT id, unnest(post_grade)::bigint  -- Unnest the grade array into individual rows
FROM public.seller_post;

INSERT INTO public.seller_post_resource_types (post_id, resource_type_id)
SELECT id, unnest(resource_types)::bigint  -- Unnest the resource_type array into individual rows
FROM public.seller_post;

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
    seller_post.stripe_product_id AS product_id,
    seller_post.listing_status,
    seller_post.secular,
    seller_post.draft_status,
    seller_post.resource_urls,
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
    seller_post.stripe_product_id, 
    seller_post.listing_status, 
    seller_post.secular, 
    seller_post.draft_status, 
    seller_post.resource_urls;

--ALTER TABLE public.seller_post
--DROP COLUMN product_subject,
--DROP COLUMN post_grade,
--DROP COLUMN resource_types;

CREATE OR REPLACE FUNCTION "public"."title_content"("public"."sellerposts") RETURNS "text"
    LANGUAGE "sql" IMMUTABLE
    AS $_$
  select $1.title || ' ' || $1.content;
$_$;

drop policy "Enable insert for authenticated users only" on "public"."seller_post";

create policy "Allow Read Access for Everyone"
on "public"."post_subtopic"
as permissive
for select
to anon
using (true);


create policy "Enable insert for users based on user_id"
on "public"."seller_post"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM sellers
  WHERE (sellers.user_id = auth.uid()))));


create policy "Allow Read Access for Anon"
on "public"."seller_post_grade"
as permissive
for select
to public
using (true);


create policy "Enable Update for  users based on user_id"
on "public"."seller_post_grade"
as permissive
for update
to public
using ((EXISTS ( SELECT 1
   FROM seller_post
  WHERE ((seller_post.id = seller_post_grade.post_id) AND (seller_post.user_id = auth.uid())))));


create policy "Enable delete for users based on user_id"
on "public"."seller_post_grade"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM seller_post
  WHERE ((seller_post.id = seller_post_grade.post_id) AND (seller_post.user_id = auth.uid())))));


create policy "Enable insert for users based on user_id"
on "public"."seller_post_grade"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM seller_post
  WHERE ((seller_post.id = seller_post_grade.post_id) AND (seller_post.user_id = auth.uid())))));


create policy "Enable delete for users based on user_id"
on "public"."seller_post_resource_types"
as permissive
for delete
to public
using ((EXISTS ( SELECT 1
   FROM seller_post
  WHERE ((seller_post.id = seller_post_resource_types.post_id) AND (seller_post.user_id = auth.uid())))));


create policy "Enable insert for users based on user_id"
on "public"."seller_post_resource_types"
as permissive
for insert
to public
with check ((EXISTS ( SELECT 1
   FROM seller_post
  WHERE ((seller_post.id = seller_post_resource_types.post_id) AND (seller_post.user_id = auth.uid())))));


create policy "Enable read access for all users"
on "public"."seller_post_resource_types"
as permissive
for select
to public
using (true);


create policy "Enable update for users based on user_id"
on "public"."seller_post_resource_types"
as permissive
for update
to public
using ((EXISTS ( SELECT 1
   FROM seller_post
  WHERE ((seller_post.id = seller_post_resource_types.post_id) AND (seller_post.user_id = auth.uid())))));


create policy "Enable delete for users based on user_id"
on "public"."seller_post_subject"
as permissive
for delete
to public
using ((EXISTS ( SELECT 1
   FROM seller_post
  WHERE ((seller_post.id = seller_post_subject.post_id) AND (seller_post.user_id = auth.uid())))));


create policy "Enable insert for users based on user_id"
on "public"."seller_post_subject"
as permissive
for insert
to public
with check ((EXISTS ( SELECT 1
   FROM seller_post
  WHERE ((seller_post.id = seller_post_subject.post_id) AND (seller_post.user_id = auth.uid())))));


create policy "Enable read access for all users"
on "public"."seller_post_subject"
as permissive
for select
to public
using (true);


create policy "Enable update for users based on user_id"
on "public"."seller_post_subject"
as permissive
for update
to public
using ((EXISTS ( SELECT 1
   FROM seller_post
  WHERE ((seller_post.id = seller_post_subject.post_id) AND (seller_post.user_id = auth.uid())))));


create policy "Enable delete for users based on user_id"
on "public"."seller_post_subtopic"
as permissive
for delete
to public
using ((EXISTS ( SELECT 1
   FROM seller_post
  WHERE ((seller_post.id = seller_post_subtopic.post_id) AND (seller_post.user_id = auth.uid())))));


create policy "Enable insert for users based on user_id"
on "public"."seller_post_subtopic"
as permissive
for insert
to public
with check ((EXISTS ( SELECT 1
   FROM seller_post
  WHERE ((seller_post.id = seller_post_subtopic.post_id) AND (seller_post.user_id = auth.uid())))));


create policy "Enable read access for all users"
on "public"."seller_post_subtopic"
as permissive
for select
to public
using (true);


create policy "Enable update for users based on user_id"
on "public"."seller_post_subtopic"
as permissive
for update
to public
using ((EXISTS ( SELECT 1
   FROM seller_post
  WHERE ((seller_post.id = seller_post_subtopic.post_id) AND (seller_post.user_id = auth.uid())))));

create policy "Enable delete for users based on user_id"
on "public"."seller_post_image"
as permissive
for delete
to public
using ((EXISTS ( SELECT 1
   FROM seller_post
  WHERE ((seller_post.id = seller_post_image.post_id) AND (seller_post.user_id = auth.uid())))));


create policy "Enable insert for users based on user_id"
on "public"."seller_post_image"
as permissive
for insert
to public
with check ((EXISTS ( SELECT 1
   FROM seller_post
  WHERE ((seller_post.id = seller_post_image.post_id) AND (seller_post.user_id = auth.uid())))));


create policy "Enable read access for all users"
on "public"."seller_post_image"
as permissive
for select
to public
using (true);


create policy "Enable update for users based on user_id"
on "public"."seller_post_image"
as permissive
for update
to public
using ((EXISTS ( SELECT 1
   FROM seller_post
  WHERE ((seller_post.id = seller_post_image.post_id) AND (seller_post.user_id = auth.uid())))));


CREATE OR REPLACE FUNCTION public.update_post_with_join_data(
    edit_post_id BIGINT,
    new_title TEXT,
    new_content TEXT,
    new_image_urls TEXT[],
    new_stripe_price_id TEXT,
    new_secular BOOLEAN,
    new_draft_status BOOLEAN,
    new_subjects BIGINT[],
    new_grades BIGINT[],
    new_resource_types BIGINT[],
    new_subtopics BIGINT[],
    new_resource_links TEXT[]
)
RETURNS VOID AS $$
BEGIN

    -- Step 1: Delete existing records in join tables only if they exist
    IF EXISTS (SELECT 1 FROM seller_post_image WHERE seller_post_image.post_id = edit_post_id) THEN
        DELETE FROM seller_post_image WHERE seller_post_image.post_id = edit_post_id;
    END IF;
    
    IF EXISTS (SELECT 1 FROM seller_post_subject WHERE seller_post_subject.post_id = edit_post_id) THEN
        DELETE FROM seller_post_subject WHERE seller_post_subject.post_id = edit_post_id;
    END IF;

    IF EXISTS (SELECT 1 FROM seller_post_grade WHERE seller_post_grade.post_id = edit_post_id) THEN
        DELETE FROM seller_post_grade WHERE seller_post_grade.post_id = edit_post_id;
    END IF;

    IF EXISTS (SELECT 1 FROM seller_post_resource_types WHERE seller_post_resource_types.post_id = edit_post_id) THEN
        DELETE FROM seller_post_resource_types WHERE seller_post_resource_types.post_id = edit_post_id;
    END IF;

    IF EXISTS (SELECT 1 FROM seller_post_subtopic WHERE seller_post_subtopic.post_id = edit_post_id) THEN
        DELETE FROM seller_post_subtopic WHERE seller_post_subtopic.post_id = edit_post_id;
    END IF;

    -- Step 2: Insert new records in join tables
    IF array_length(new_image_urls, 1) IS NOT NULL THEN
        INSERT INTO seller_post_image (post_id, image_uuid)
        SELECT edit_post_id, unnest(new_image_urls);
    END IF;

    IF array_length(new_subjects, 1) IS NOT NULL THEN
        INSERT INTO seller_post_subject (post_id, subject_id)
        SELECT edit_post_id, unnest(new_subjects);
    END IF;

    IF array_length(new_grades, 1) IS NOT NULL THEN
        INSERT INTO seller_post_grade (post_id, grade_id)
        SELECT edit_post_id, unnest(new_grades);
    END IF;

    IF array_length(new_resource_types, 1) IS NOT NULL THEN
        INSERT INTO seller_post_resource_types (post_id, resource_type_id)
        SELECT edit_post_id, unnest(new_resource_types);
    END IF;

    IF array_length(new_subtopics, 1) IS NOT NULL THEN
        INSERT INTO seller_post_subtopic (post_id, subtopic_id)
        SELECT edit_post_id, unnest(new_subtopics);
    END IF;

    -- Step 3: Update the seller_post table
    UPDATE seller_post
    SET 
        title = new_title,
        content = new_content,
        stripe_price_id = new_stripe_price_id,
        secular = new_secular,
        draft_status = new_draft_status,
        resource_links = new_resource_links
    WHERE seller_post.id = edit_post_id;

EXCEPTION
    -- If anything fails, rollback all changes
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Transaction failed: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;

-- Switch posts with Geography and History to subtopic 38 and 39
INSERT INTO seller_post_subtopic (post_id, subtopic_id)
SELECT post_id, 
       CASE 
           WHEN subject_id = 1 THEN 38
           WHEN subject_id = 2 THEN 39
       END AS subtopic_id
FROM seller_post_subject
WHERE subject_id IN (1, 2);

-- Remove references to Geography and History on Posts
DELETE FROM seller_post_subject
WHERE subject_id IN (1, 2);

--Delete Geography and History as Subjects
DELETE FROM post_subject
WHERE id IN (1, 2);

ALTER TABLE public.seller_post
DROP COLUMN product_subject,
DROP COLUMN post_grade,
DROP COLUMN resource_types;