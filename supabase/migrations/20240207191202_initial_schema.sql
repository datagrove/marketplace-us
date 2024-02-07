SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

CREATE EXTENSION IF NOT EXISTS "http" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."country" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "country" "text" NOT NULL
);

ALTER TABLE "public"."country" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."governing_district" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "governing_district" "text" NOT NULL,
    "minor_municipality" bigint NOT NULL
);

ALTER TABLE "public"."governing_district" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."location" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "street_number" bigint,
    "street_number_suffix" "text",
    "street_name" "text",
    "street_type" "text",
    "street_direction" "text",
    "address_type" "text",
    "address_type_identifier" "text",
    "minor_municipality" bigint,
    "major_municipality" bigint,
    "governing_district" bigint,
    "postal_area" "text",
    "country" bigint NOT NULL,
    "user_id" "uuid" NOT NULL
);

ALTER TABLE "public"."location" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."major_municipality" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "major_municipality" "text" NOT NULL,
    "country" bigint NOT NULL
);

ALTER TABLE "public"."major_municipality" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."minor_municipality" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "minor_municipality" "text" NOT NULL,
    "major_municipality" bigint NOT NULL
);

ALTER TABLE "public"."minor_municipality" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."locationview" WITH ("security_invoker"='on') AS
 SELECT "location"."id",
    "major_municipality"."major_municipality",
    "minor_municipality"."minor_municipality",
    "governing_district"."governing_district",
    "country"."country"
   FROM (((("public"."location"
     LEFT JOIN "public"."country" ON (("location"."country" = "country"."id")))
     LEFT JOIN "public"."major_municipality" ON (("location"."major_municipality" = "major_municipality"."id")))
     LEFT JOIN "public"."minor_municipality" ON (("location"."minor_municipality" = "minor_municipality"."id")))
     LEFT JOIN "public"."governing_district" ON (("location"."governing_district" = "governing_district"."id")));

ALTER TABLE "public"."locationview" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "created_at" timestamp with time zone DEFAULT "now"(),
    "first_name" "text" NOT NULL,
    "last_name" "text" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "email" "text" NOT NULL
);

ALTER TABLE "public"."profiles" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."seller_post" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "title" "text" NOT NULL,
    "product_category" bigint NOT NULL,
    "content" "text" NOT NULL,
    "location" bigint NOT NULL,
    "user_id" "uuid" NOT NULL,
    "image_urls" "text"
);

ALTER TABLE "public"."seller_post" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."sellers" (
    "created_at" timestamp with time zone DEFAULT "now"(),
    "seller_name" "text",
    "user_id" "uuid" NOT NULL,
    "location" bigint NOT NULL,
    "seller_phone" "text" NOT NULL,
    "image_url" "text",
    "seller_id" bigint NOT NULL,
    CONSTRAINT "Sellers_seller_name_check" CHECK (("length"("seller_name") < 255))
);

ALTER TABLE "public"."sellers" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."sellerposts" WITH ("security_invoker"='on') AS
 SELECT "seller_post"."id",
    "seller_post"."title",
    "seller_post"."content",
    "seller_post"."user_id",
    "seller_post"."image_urls",
    "seller_post"."product_category",
    "locationview"."major_municipality",
    "locationview"."minor_municipality",
    "locationview"."governing_district",
    "sellers"."seller_name",
    "sellers"."seller_id",
    "profiles"."email"
   FROM ((("public"."seller_post"
     LEFT JOIN "public"."profiles" ON (("seller_post"."user_id" = "profiles"."user_id")))
     LEFT JOIN "public"."sellers" ON (("seller_post"."user_id" = "sellers"."user_id")))
     LEFT JOIN "public"."locationview" ON (("seller_post"."location" = "locationview"."id")));

ALTER TABLE "public"."sellerposts" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."title_content"("public"."sellerposts") RETURNS "text"
    LANGUAGE "sql" IMMUTABLE
    AS $_$
  select $1.title || ' ' || $1.content;
$_$;

ALTER FUNCTION "public"."title_content"("public"."sellerposts") OWNER TO "postgres";

ALTER TABLE "public"."country" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Country_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE "public"."location" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Location_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."clients" (
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "location" bigint,
    "client_phone" bigint,
    "display_name" "text",
    "image_url" "text"
);

ALTER TABLE "public"."clients" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."clientview" WITH ("security_invoker"='on') AS
 SELECT "clients"."user_id",
    "clients"."created_at",
    "clients"."display_name",
    "clients"."client_phone",
    "clients"."image_url",
    "locationview"."major_municipality",
    "locationview"."minor_municipality",
    "locationview"."governing_district",
    "locationview"."country",
    "profiles"."first_name",
    "profiles"."last_name",
    "profiles"."email"
   FROM (("public"."clients"
     LEFT JOIN "public"."profiles" ON (("clients"."user_id" = "profiles"."user_id")))
     LEFT JOIN "public"."locationview" ON (("clients"."location" = "locationview"."id")));

ALTER TABLE "public"."clientview" OWNER TO "postgres";

ALTER TABLE "public"."major_municipality" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."major_municipality_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE "public"."governing_district" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."governing_district_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."language" (
    "id" bigint NOT NULL,
    "language" "text" NOT NULL
);

ALTER TABLE "public"."language" OWNER TO "postgres";

ALTER TABLE "public"."language" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."language_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE "public"."minor_municipality" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."minor_municipality_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."post_category" (
    "id" bigint NOT NULL,
    "category" "text" NOT NULL,
    "language" bigint NOT NULL
);

ALTER TABLE "public"."post_category" OWNER TO "postgres";

ALTER TABLE "public"."post_category" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."post_category_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE "public"."seller_post" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."seller_post_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE "public"."sellers" ALTER COLUMN "seller_id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."sellers_seller_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE OR REPLACE VIEW "public"."sellerview" WITH ("security_invoker"='on') AS
 SELECT "sellers"."user_id",
    "sellers"."created_at",
    "sellers"."seller_name",
    "sellers"."seller_phone",
    "sellers"."image_url",
    "sellers"."seller_id",
    "locationview"."major_municipality",
    "locationview"."minor_municipality",
    "locationview"."governing_district",
    "locationview"."country",
    "profiles"."first_name",
    "profiles"."last_name",
    "profiles"."email"
   FROM (("public"."sellers"
     LEFT JOIN "public"."profiles" ON (("sellers"."user_id" = "profiles"."user_id")))
     LEFT JOIN "public"."locationview" ON (("sellers"."location" = "locationview"."id")));

ALTER TABLE "public"."sellerview" OWNER TO "postgres";

ALTER TABLE ONLY "public"."country"
    ADD CONSTRAINT "Country_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."location"
    ADD CONSTRAINT "Location_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."sellers"
    ADD CONSTRAINT "sellers_seller_phone_key" UNIQUE ("seller_phone");

ALTER TABLE ONLY "public"."sellers"
    ADD CONSTRAINT "sellers_user_id_key" UNIQUE ("user_id");

ALTER TABLE ONLY "public"."clients"
    ADD CONSTRAINT "clients_id_key" UNIQUE ("user_id");

ALTER TABLE ONLY "public"."clients"
    ADD CONSTRAINT "clients_pkey" PRIMARY KEY ("user_id");

ALTER TABLE ONLY "public"."country"
    ADD CONSTRAINT "country_id_key" UNIQUE ("id");

ALTER TABLE ONLY "public"."major_municipality"
    ADD CONSTRAINT "major_municipality_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."governing_district"
    ADD CONSTRAINT "governing_district_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."language"
    ADD CONSTRAINT "language_id_key" UNIQUE ("id");

ALTER TABLE ONLY "public"."language"
    ADD CONSTRAINT "language_language_key" UNIQUE ("language");

ALTER TABLE ONLY "public"."language"
    ADD CONSTRAINT "language_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."minor_municipality"
    ADD CONSTRAINT "minor_municipality_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."post_category"
    ADD CONSTRAINT "post_category_id_key" UNIQUE ("id");

ALTER TABLE ONLY "public"."post_category"
    ADD CONSTRAINT "post_category_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_email_key" UNIQUE ("email");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("user_id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_user_id_key" UNIQUE ("user_id");

ALTER TABLE ONLY "public"."seller_post"
    ADD CONSTRAINT "seller_post_id_key" UNIQUE ("id");

ALTER TABLE ONLY "public"."seller_post"
    ADD CONSTRAINT "seller_post_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."sellers"
    ADD CONSTRAINT "sellers_pkey" PRIMARY KEY ("user_id");

ALTER TABLE ONLY "public"."sellers"
    ADD CONSTRAINT "sellers_seller_id_key" UNIQUE ("seller_id");

ALTER TABLE ONLY "public"."clients"
    ADD CONSTRAINT "clients_location_fkey" FOREIGN KEY ("location") REFERENCES "public"."location"("id");

ALTER TABLE ONLY "public"."clients"
    ADD CONSTRAINT "clients_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("user_id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."governing_district"
    ADD CONSTRAINT "governing_district_minor_municipality_fkey" FOREIGN KEY ("minor_municipality") REFERENCES "public"."minor_municipality"("id");

ALTER TABLE ONLY "public"."location"
    ADD CONSTRAINT "location_country_fkey" FOREIGN KEY ("country") REFERENCES "public"."country"("id");

ALTER TABLE ONLY "public"."location"
    ADD CONSTRAINT "location_governing_district_fkey" FOREIGN KEY ("governing_district") REFERENCES "public"."governing_district"("id");

ALTER TABLE ONLY "public"."location"
    ADD CONSTRAINT "location_major_municipality_fkey" FOREIGN KEY ("major_municipality") REFERENCES "public"."major_municipality"("id");

ALTER TABLE ONLY "public"."location"
    ADD CONSTRAINT "location_minor_municipality_fkey" FOREIGN KEY ("minor_municipality") REFERENCES "public"."minor_municipality"("id");

ALTER TABLE ONLY "public"."location"
    ADD CONSTRAINT "location_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."major_municipality"
    ADD CONSTRAINT "major_municipality_country_fkey" FOREIGN KEY ("country") REFERENCES "public"."country"("id");

ALTER TABLE ONLY "public"."minor_municipality"
    ADD CONSTRAINT "minor_municipality_major_municipality_fkey" FOREIGN KEY ("major_municipality") REFERENCES "public"."major_municipality"("id");

ALTER TABLE ONLY "public"."post_category"
    ADD CONSTRAINT "post_category_language_fkey" FOREIGN KEY ("language") REFERENCES "public"."language"("id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."seller_post"
    ADD CONSTRAINT "seller_post_location_fkey" FOREIGN KEY ("location") REFERENCES "public"."location"("id");

ALTER TABLE ONLY "public"."seller_post"
    ADD CONSTRAINT "seller_post_product_category_fkey" FOREIGN KEY ("product_category") REFERENCES "public"."post_category"("id");

ALTER TABLE ONLY "public"."seller_post"
    ADD CONSTRAINT "seller_post_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."sellers"("user_id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."sellers"
    ADD CONSTRAINT "sellers_location_fkey" FOREIGN KEY ("location") REFERENCES "public"."location"("id");

ALTER TABLE ONLY "public"."sellers"
    ADD CONSTRAINT "sellers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("user_id") ON DELETE CASCADE;

CREATE POLICY "Allow Users to update own data" ON "public"."sellers" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));

CREATE POLICY "Allow Users to update their own data" ON "public"."profiles" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));

CREATE POLICY "Allow users to update their own data" ON "public"."clients" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));

CREATE POLICY "Enable delete for users based on user_id" ON "public"."seller_post" FOR DELETE USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Enable insert for authenticated users only" ON "public"."clients" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."location" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."profiles" FOR INSERT TO "anon" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."seller_post" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."sellers" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable select access for all users" ON "public"."location" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Enable select authenticated users only" ON "public"."clients" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Enable select for authenticated users only" ON "public"."country" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Enable select for authenticated users only" ON "public"."governing_district" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Enable select for authenticated users only" ON "public"."major_municipality" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Enable select for authenticated users only" ON "public"."minor_municipality" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Enable select for authenticated users only" ON "public"."post_category" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Enable select for authenticated users only" ON "public"."profiles" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Enable select for authenticated users only" ON "public"."seller_post" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Enable select for authenticated users only" ON "public"."sellers" FOR SELECT TO "authenticated" USING (true);

ALTER TABLE "public"."clients" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."country" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."governing_district" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."language" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."location" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."major_municipality" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."minor_municipality" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."post_category" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."seller_post" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."sellers" ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON TABLE "public"."country" TO "anon";
GRANT ALL ON TABLE "public"."country" TO "authenticated";
GRANT ALL ON TABLE "public"."country" TO "service_role";

GRANT ALL ON TABLE "public"."governing_district" TO "anon";
GRANT ALL ON TABLE "public"."governing_district" TO "authenticated";
GRANT ALL ON TABLE "public"."governing_district" TO "service_role";

GRANT ALL ON TABLE "public"."location" TO "anon";
GRANT ALL ON TABLE "public"."location" TO "authenticated";
GRANT ALL ON TABLE "public"."location" TO "service_role";

GRANT ALL ON TABLE "public"."major_municipality" TO "anon";
GRANT ALL ON TABLE "public"."major_municipality" TO "authenticated";
GRANT ALL ON TABLE "public"."major_municipality" TO "service_role";

GRANT ALL ON TABLE "public"."minor_municipality" TO "anon";
GRANT ALL ON TABLE "public"."minor_municipality" TO "authenticated";
GRANT ALL ON TABLE "public"."minor_municipality" TO "service_role";

GRANT ALL ON TABLE "public"."locationview" TO "anon";
GRANT ALL ON TABLE "public"."locationview" TO "authenticated";
GRANT ALL ON TABLE "public"."locationview" TO "service_role";

GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";

GRANT ALL ON TABLE "public"."seller_post" TO "anon";
GRANT ALL ON TABLE "public"."seller_post" TO "authenticated";
GRANT ALL ON TABLE "public"."seller_post" TO "service_role";

GRANT ALL ON TABLE "public"."sellers" TO "anon";
GRANT ALL ON TABLE "public"."sellers" TO "authenticated";
GRANT ALL ON TABLE "public"."sellers" TO "service_role";

GRANT ALL ON TABLE "public"."sellerposts" TO "anon";
GRANT ALL ON TABLE "public"."sellerposts" TO "authenticated";
GRANT ALL ON TABLE "public"."sellerposts" TO "service_role";

GRANT ALL ON FUNCTION "public"."title_content"("public"."sellerposts") TO "anon";
GRANT ALL ON FUNCTION "public"."title_content"("public"."sellerposts") TO "authenticated";
GRANT ALL ON FUNCTION "public"."title_content"("public"."sellerposts") TO "service_role";

GRANT ALL ON SEQUENCE "public"."Country_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Country_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Country_id_seq" TO "service_role";

GRANT ALL ON SEQUENCE "public"."Location_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Location_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Location_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."clients" TO "anon";
GRANT ALL ON TABLE "public"."clients" TO "authenticated";
GRANT ALL ON TABLE "public"."clients" TO "service_role";

GRANT ALL ON TABLE "public"."clientview" TO "anon";
GRANT ALL ON TABLE "public"."clientview" TO "authenticated";
GRANT ALL ON TABLE "public"."clientview" TO "service_role";

GRANT ALL ON SEQUENCE "public"."major_municipality_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."major_municipality_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."major_municipality_id_seq" TO "service_role";

GRANT ALL ON SEQUENCE "public"."governing_district_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."governing_district_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."governing_district_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."language" TO "anon";
GRANT ALL ON TABLE "public"."language" TO "authenticated";
GRANT ALL ON TABLE "public"."language" TO "service_role";

GRANT ALL ON SEQUENCE "public"."language_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."language_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."language_id_seq" TO "service_role";

GRANT ALL ON SEQUENCE "public"."minor_municipality_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."minor_municipality_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."minor_municipality_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."post_category" TO "anon";
GRANT ALL ON TABLE "public"."post_category" TO "authenticated";
GRANT ALL ON TABLE "public"."post_category" TO "service_role";

GRANT ALL ON SEQUENCE "public"."post_category_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."post_category_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."post_category_id_seq" TO "service_role";

GRANT ALL ON SEQUENCE "public"."seller_post_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."seller_post_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."seller_post_id_seq" TO "service_role";

GRANT ALL ON SEQUENCE "public"."sellers_seller_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."sellers_seller_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."sellers_seller_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."sellerview" TO "anon";
GRANT ALL ON TABLE "public"."sellerview" TO "authenticated";
GRANT ALL ON TABLE "public"."sellerview" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

--
-- Data for Name: country; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."country" ("id", "created_at", "country") VALUES
	(1, '2023-07-07 14:18:29.85077+00', 'United States');

--
-- Data for Name: language; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."language" ("id", "language") VALUES
	(1, 'English (American)');

RESET ALL;

alter table "storage"."buckets" drop constraint IF EXISTS "buckets_owner_fkey";

alter table "storage"."buckets" add column IF NOT EXISTS "owner_id" text;

alter table "storage"."objects" add column IF NOT EXISTS "owner_id" text;

--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") VALUES
	('user.image', 'user.image', NULL, '2023-07-13 19:25:41.126949+00', '2023-07-13 19:25:41.126949+00', false, false, NULL, NULL, NULL),
	('post.image', 'post.image', NULL, '2023-08-01 19:11:48.793899+00', '2023-08-01 19:11:48.793899+00', false, false, NULL, NULL, NULL);


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

drop policy "Enable insert for authenticated users only" on "public"."profiles";

create policy "Enable insert for authenticated users only"
on "public"."profiles"
as permissive
for insert
to anon, authenticated
with check (true);

alter table "public"."clients" drop constraint "clients_user_id_fkey";

alter table "public"."seller_post" drop constraint "seller_post_user_id_fkey";

alter table "public"."sellers" drop constraint "sellers_user_id_fkey";

alter table "public"."clients" add constraint "clients_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

alter table "public"."clients" validate constraint "clients_user_id_fkey";

alter table "public"."seller_post" add constraint "seller_post_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

alter table "public"."seller_post" validate constraint "seller_post_user_id_fkey";

alter table "public"."sellers" add constraint "sellers_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

alter table "public"."sellers" validate constraint "sellers_user_id_fkey";

alter table "public"."sellers" add column "language_spoken" text;

alter table "public"."sellers" alter column "language_spoken" set not null;

alter table "public"."sellers" alter column "language_spoken" set data type text[] using "language_spoken"::text[];

create or replace view "public"."sellerview" as  SELECT sellers.user_id,
    sellers.created_at,
    sellers.seller_name,
    sellers.seller_phone,
    sellers.image_url,
    sellers.seller_id,
    locationview.major_municipality,
    locationview.minor_municipality,
    locationview.governing_district,
    locationview.country,
    profiles.first_name,
    profiles.last_name,
    profiles.email,
    sellers.language_spoken
   FROM ((sellers
     LEFT JOIN profiles ON ((sellers.user_id = profiles.user_id)))
     LEFT JOIN locationview ON ((sellers.location = locationview.id)));

create policy "Enable select for authenticated users only"
on "public"."language"
as permissive
for select
to authenticated
using (true);

