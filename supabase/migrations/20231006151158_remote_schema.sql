
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

CREATE TABLE IF NOT EXISTS "public"."provider_post" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "title" "text" NOT NULL,
    "service_category" bigint NOT NULL,
    "content" "text" NOT NULL,
    "location" bigint NOT NULL,
    "user_id" "uuid" NOT NULL,
    "image_urls" "text",
    "promoted" boolean DEFAULT false NOT NULL,
    "promotedStartDate" "date",
    "promotedFinishDate" "date"
);

ALTER TABLE "public"."provider_post" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."providers" (
    "created_at" timestamp with time zone DEFAULT "now"(),
    "provider_name" "text",
    "user_id" "uuid" NOT NULL,
    "location" bigint NOT NULL,
    "provider_phone" "text" NOT NULL,
    "image_url" "text",
    "provider_id" bigint NOT NULL,
    CONSTRAINT "Providers_provider_name_check" CHECK (("length"("provider_name") < 255))
);

ALTER TABLE "public"."providers" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."providerposts" WITH ("security_invoker"='on') AS
 SELECT "provider_post"."id",
    "provider_post"."title",
    "provider_post"."content",
    "provider_post"."user_id",
    "provider_post"."image_urls",
    "provider_post"."service_category",
    "locationview"."major_municipality",
    "locationview"."minor_municipality",
    "locationview"."governing_district",
    "providers"."provider_name",
    "providers"."provider_id",
    "profiles"."email"
   FROM ((("public"."provider_post"
     LEFT JOIN "public"."profiles" ON (("provider_post"."user_id" = "profiles"."user_id")))
     LEFT JOIN "public"."providers" ON (("provider_post"."user_id" = "providers"."user_id")))
     LEFT JOIN "public"."locationview" ON (("provider_post"."location" = "locationview"."id")));

ALTER TABLE "public"."providerposts" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."title_content"("public"."providerposts") RETURNS "text"
    LANGUAGE "sql" IMMUTABLE
    AS $_$
  select $1.title || ' ' || $1.content;
$_$;

ALTER FUNCTION "public"."title_content"("public"."providerposts") OWNER TO "postgres";

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

CREATE TABLE IF NOT EXISTS "public"."TEST" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE "public"."TEST" OWNER TO "postgres";

ALTER TABLE "public"."TEST" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."TEST_id_seq"
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
    SEQUENCE NAME "public"."cr_major_municipality_id_seq"
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

ALTER TABLE "public"."provider_post" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."provider_post_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE "public"."providers" ALTER COLUMN "provider_id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."providers_provider_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE OR REPLACE VIEW "public"."providerview" WITH ("security_invoker"='on') AS
 SELECT "providers"."user_id",
    "providers"."created_at",
    "providers"."provider_name",
    "providers"."provider_phone",
    "providers"."image_url",
    "providers"."provider_id",
    "locationview"."major_municipality",
    "locationview"."minor_municipality",
    "locationview"."governing_district",
    "locationview"."country",
    "profiles"."first_name",
    "profiles"."last_name",
    "profiles"."email"
   FROM (("public"."providers"
     LEFT JOIN "public"."profiles" ON (("providers"."user_id" = "profiles"."user_id")))
     LEFT JOIN "public"."locationview" ON (("providers"."location" = "locationview"."id")));

ALTER TABLE "public"."providerview" OWNER TO "postgres";

ALTER TABLE ONLY "public"."country"
    ADD CONSTRAINT "Country_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."location"
    ADD CONSTRAINT "Location_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."providers"
    ADD CONSTRAINT "Providers_provider_phone_key" UNIQUE ("provider_phone");

ALTER TABLE ONLY "public"."providers"
    ADD CONSTRAINT "Providers_user_id_key" UNIQUE ("user_id");

ALTER TABLE ONLY "public"."TEST"
    ADD CONSTRAINT "TEST_id_key" UNIQUE ("id");

ALTER TABLE ONLY "public"."TEST"
    ADD CONSTRAINT "TEST_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."clients"
    ADD CONSTRAINT "clients_id_key" UNIQUE ("user_id");

ALTER TABLE ONLY "public"."clients"
    ADD CONSTRAINT "clients_pkey" PRIMARY KEY ("user_id");

ALTER TABLE ONLY "public"."country"
    ADD CONSTRAINT "country_id_key" UNIQUE ("id");

ALTER TABLE ONLY "public"."major_municipality"
    ADD CONSTRAINT "cr_major_municipality_pkey" PRIMARY KEY ("id");

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

ALTER TABLE ONLY "public"."provider_post"
    ADD CONSTRAINT "provider_post_id_key" UNIQUE ("id");

ALTER TABLE ONLY "public"."provider_post"
    ADD CONSTRAINT "provider_post_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."providers"
    ADD CONSTRAINT "providers_pkey" PRIMARY KEY ("user_id");

ALTER TABLE ONLY "public"."providers"
    ADD CONSTRAINT "providers_provider_id_key" UNIQUE ("provider_id");

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

ALTER TABLE ONLY "public"."provider_post"
    ADD CONSTRAINT "provider_post_location_fkey" FOREIGN KEY ("location") REFERENCES "public"."location"("id");

ALTER TABLE ONLY "public"."provider_post"
    ADD CONSTRAINT "provider_post_service_category_fkey" FOREIGN KEY ("service_category") REFERENCES "public"."post_category"("id");

ALTER TABLE ONLY "public"."provider_post"
    ADD CONSTRAINT "provider_post_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."providers"("user_id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."providers"
    ADD CONSTRAINT "providers_location_fkey" FOREIGN KEY ("location") REFERENCES "public"."location"("id");

ALTER TABLE ONLY "public"."providers"
    ADD CONSTRAINT "providers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("user_id") ON DELETE CASCADE;

CREATE POLICY "Allow Users to update own data" ON "public"."providers" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));

CREATE POLICY "Allow Users to update their own data" ON "public"."profiles" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));

CREATE POLICY "Allow users to update their own data" ON "public"."clients" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));

CREATE POLICY "Enable delete for users based on user_id" ON "public"."provider_post" FOR DELETE USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Enable insert for authenticated users only" ON "public"."clients" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."location" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."profiles" FOR INSERT TO "anon" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."provider_post" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."providers" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON "public"."TEST" FOR SELECT USING (true);

CREATE POLICY "Enable select access for all users" ON "public"."location" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Enable select authenticated users only" ON "public"."clients" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Enable select for authenticated users only" ON "public"."country" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Enable select for authenticated users only" ON "public"."governing_district" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Enable select for authenticated users only" ON "public"."major_municipality" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Enable select for authenticated users only" ON "public"."minor_municipality" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Enable select for authenticated users only" ON "public"."post_category" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Enable select for authenticated users only" ON "public"."profiles" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Enable select for authenticated users only" ON "public"."provider_post" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Enable select for authenticated users only" ON "public"."providers" FOR SELECT TO "authenticated" USING (true);

ALTER TABLE "public"."TEST" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."clients" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."country" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."governing_district" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."language" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."location" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."major_municipality" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."minor_municipality" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."post_category" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."provider_post" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."providers" ENABLE ROW LEVEL SECURITY;

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

GRANT ALL ON TABLE "public"."provider_post" TO "anon";
GRANT ALL ON TABLE "public"."provider_post" TO "authenticated";
GRANT ALL ON TABLE "public"."provider_post" TO "service_role";

GRANT ALL ON TABLE "public"."providers" TO "anon";
GRANT ALL ON TABLE "public"."providers" TO "authenticated";
GRANT ALL ON TABLE "public"."providers" TO "service_role";

GRANT ALL ON TABLE "public"."providerposts" TO "anon";
GRANT ALL ON TABLE "public"."providerposts" TO "authenticated";
GRANT ALL ON TABLE "public"."providerposts" TO "service_role";

GRANT ALL ON FUNCTION "public"."title_content"("public"."providerposts") TO "anon";
GRANT ALL ON FUNCTION "public"."title_content"("public"."providerposts") TO "authenticated";
GRANT ALL ON FUNCTION "public"."title_content"("public"."providerposts") TO "service_role";

GRANT ALL ON SEQUENCE "public"."Country_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Country_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Country_id_seq" TO "service_role";

GRANT ALL ON SEQUENCE "public"."Location_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Location_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Location_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."TEST" TO "anon";
GRANT ALL ON TABLE "public"."TEST" TO "authenticated";
GRANT ALL ON TABLE "public"."TEST" TO "service_role";

GRANT ALL ON SEQUENCE "public"."TEST_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."TEST_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."TEST_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."clients" TO "anon";
GRANT ALL ON TABLE "public"."clients" TO "authenticated";
GRANT ALL ON TABLE "public"."clients" TO "service_role";

GRANT ALL ON TABLE "public"."clientview" TO "anon";
GRANT ALL ON TABLE "public"."clientview" TO "authenticated";
GRANT ALL ON TABLE "public"."clientview" TO "service_role";

GRANT ALL ON SEQUENCE "public"."cr_major_municipality_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."cr_major_municipality_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."cr_major_municipality_id_seq" TO "service_role";

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

GRANT ALL ON SEQUENCE "public"."provider_post_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."provider_post_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."provider_post_id_seq" TO "service_role";

GRANT ALL ON SEQUENCE "public"."providers_provider_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."providers_provider_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."providers_provider_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."providerview" TO "anon";
GRANT ALL ON TABLE "public"."providerview" TO "authenticated";
GRANT ALL ON TABLE "public"."providerview" TO "service_role";

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

RESET ALL;
