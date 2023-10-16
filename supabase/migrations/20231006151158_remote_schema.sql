
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

--
-- Data for Name: country; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."country" ("id", "created_at", "country") VALUES
	(1, '2023-07-07 14:18:29.85077+00', 'Costa Rica');


--
-- Data for Name: major_municipality; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."major_municipality" ("id", "created_at", "major_municipality", "country") VALUES
	(1, '2023-07-07 14:46:39.74855+00', 'Alajuela', 1),
	(2, '2023-07-07 14:46:52.915538+00', 'Cartago', 1),
	(3, '2023-07-07 14:47:07.566904+00', 'Guanacaste', 1),
	(4, '2023-07-07 14:47:21.494838+00', 'Heredia', 1),
	(5, '2023-07-07 14:47:50.791231+00', 'Limón', 1),
	(6, '2023-07-07 14:48:13.945351+00', 'Puntarenas', 1),
	(7, '2023-07-07 14:48:34.836642+00', 'San José', 1);


--
-- Data for Name: minor_municipality; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."minor_municipality" ("id", "created_at", "minor_municipality", "major_municipality") VALUES
	(1, '2023-07-07 14:49:27.262652+00', 'Alajuela', 1),
	(2, '2023-07-07 14:49:45.393684+00', 'San Ramón', 1),
	(3, '2023-07-07 14:50:02.850319+00', 'Grecia', 1),
	(4, '2023-07-07 14:50:46.519736+00', 'San Mateo', 1),
	(5, '2023-07-07 14:51:01.426058+00', 'Atenas', 1),
	(6, '2023-07-07 14:51:19.320805+00', 'Naranjo', 1),
	(7, '2023-07-07 14:51:37.041104+00', 'Palmares', 1),
	(8, '2023-07-07 14:51:57.790651+00', 'Poás', 1),
	(9, '2023-07-07 14:52:13.968192+00', 'Orotina', 1),
	(10, '2023-07-07 14:52:31.543668+00', 'San Carlos', 1),
	(11, '2023-07-07 14:52:46.15924+00', 'Zarcero', 1),
	(12, '2023-07-07 14:53:08.29731+00', 'Sarchí', 1),
	(13, '2023-07-07 14:53:25.65138+00', 'Upala', 1),
	(14, '2023-07-07 14:53:39.799965+00', 'Los Chiles', 1),
	(15, '2023-07-07 14:54:00.542+00', 'Guatuso', 1),
	(16, '2023-07-07 14:54:18.791297+00', 'Río Cuarto', 1),
	(17, '2023-07-07 14:54:45.881935+00', 'Cartago', 2),
	(18, '2023-07-07 14:55:18.866806+00', 'Liberia', 3),
	(19, '2023-07-07 14:55:45.893716+00', 'Heredia', 4),
	(20, '2023-07-07 14:56:21.070207+00', 'Limón', 5),
	(21, '2023-07-07 14:56:52.533532+00', 'Buenos Aires', 6),
	(22, '2023-07-07 14:57:17.751367+00', 'San José', 7),
	(23, '2023-07-13 20:10:26.906781+00', 'Paraíso', 2),
	(24, '2023-07-13 20:10:26.906781+00', 'La Unión', 2),
	(25, '2023-07-13 20:10:26.906781+00', 'Jiménez', 2),
	(26, '2023-07-13 20:10:26.906781+00', 'Turrialba', 2),
	(27, '2023-07-13 20:10:26.906781+00', 'Alvarado', 2),
	(28, '2023-07-13 20:10:26.906781+00', 'Oreamuno', 2),
	(29, '2023-07-13 20:10:26.906781+00', 'El Guarco', 2),
	(30, '2023-07-13 20:10:26.906781+00', 'Nicoya', 3),
	(31, '2023-07-13 20:10:26.906781+00', 'Santa Cruz', 3),
	(33, '2023-07-13 20:10:26.906781+00', 'Carrillo', 3),
	(34, '2023-07-13 20:10:26.906781+00', 'Cañas', 3),
	(35, '2023-07-13 20:10:26.906781+00', 'Abangares', 3),
	(36, '2023-07-13 20:10:26.906781+00', 'Tilarán', 3),
	(37, '2023-07-13 20:10:26.906781+00', 'Nandayure', 3),
	(38, '2023-07-13 20:10:26.906781+00', 'La Cruz', 3),
	(39, '2023-07-13 20:10:26.906781+00', 'Hojancha', 3),
	(40, '2023-07-13 20:10:26.906781+00', 'Barva', 4),
	(41, '2023-07-13 20:10:26.906781+00', 'Santo Domingo', 4),
	(42, '2023-07-13 20:10:26.906781+00', 'Santa Bárbara', 4),
	(43, '2023-07-13 20:10:26.906781+00', 'San Rafael', 4),
	(44, '2023-07-13 20:10:26.906781+00', 'San Isidro', 4),
	(45, '2023-07-13 20:10:26.906781+00', 'Belén', 4),
	(47, '2023-07-13 20:10:26.906781+00', 'San Pablo', 4),
	(48, '2023-07-13 20:10:26.906781+00', 'Sarapiquí', 4),
	(49, '2023-07-13 20:10:26.906781+00', 'Pococí', 5),
	(50, '2023-07-13 20:10:26.906781+00', 'Siquirres', 5),
	(51, '2023-07-13 20:10:26.906781+00', 'Talamanca', 5),
	(52, '2023-07-13 20:10:26.906781+00', 'Matina', 5),
	(53, '2023-07-13 20:10:26.906781+00', 'Guácimo', 5),
	(54, '2023-07-13 20:10:26.906781+00', 'Puntarenas', 6),
	(55, '2023-07-13 20:10:26.906781+00', 'Esparza', 6),
	(56, '2023-07-13 20:10:26.906781+00', 'Montes de Oro', 6),
	(57, '2023-07-13 20:10:26.906781+00', 'Osa', 6),
	(59, '2023-07-13 20:10:26.906781+00', 'Golfito', 6),
	(60, '2023-07-13 20:10:26.906781+00', 'Coto Brus', 6),
	(61, '2023-07-13 20:10:26.906781+00', 'Parrita', 6),
	(62, '2023-07-13 20:10:26.906781+00', 'Corredores', 6),
	(63, '2023-07-13 20:10:26.906781+00', 'Garabito', 6),
	(64, '2023-07-13 20:10:26.906781+00', 'Puerto Jiménez', 6),
	(65, '2023-07-13 20:10:26.906781+00', 'Quepos', 6),
	(66, '2023-07-13 20:10:26.906781+00', 'Escazú', 7),
	(67, '2023-07-13 20:10:26.906781+00', 'Desamparados', 7),
	(68, '2023-07-13 20:10:26.906781+00', 'Puriscal', 7),
	(69, '2023-07-13 20:10:26.906781+00', 'Tarrazú', 7),
	(70, '2023-07-13 20:10:26.906781+00', 'Aserrí', 7),
	(71, '2023-07-13 20:10:26.906781+00', 'Mora', 7),
	(72, '2023-07-13 20:10:26.906781+00', 'Goicoechea', 7),
	(73, '2023-07-13 20:10:26.906781+00', 'Santa Ana', 7),
	(74, '2023-07-13 20:10:26.906781+00', 'Alajuelita', 7),
	(75, '2023-07-13 20:10:26.906781+00', 'Vásquez de Coronado', 7),
	(76, '2023-07-13 20:10:26.906781+00', 'Acosta', 7),
	(77, '2023-07-13 20:10:26.906781+00', 'Tibás', 7),
	(78, '2023-07-13 20:10:26.906781+00', 'Moravia', 7),
	(79, '2023-07-13 20:10:26.906781+00', 'Montes de Oca', 7),
	(80, '2023-07-13 20:10:26.906781+00', 'Turrubares', 7),
	(81, '2023-07-13 20:10:26.906781+00', 'Dota', 7),
	(82, '2023-07-13 20:10:26.906781+00', 'Curridabat', 7),
	(83, '2023-07-13 20:10:26.906781+00', 'Pérez Zeledón', 7),
	(84, '2023-07-13 20:10:26.906781+00', 'León Cortés', 7),
	(32, '2023-07-13 20:10:26.906781+00', 'Bagaces', 3),
	(58, '2023-07-13 20:10:26.906781+00', 'Monteverde', 6),
	(46, '2023-07-13 20:10:26.906781+00', 'Flores', 4);


--
-- Data for Name: governing_district; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."governing_district" ("id", "created_at", "governing_district", "minor_municipality") VALUES
	(1, '2023-07-07 14:57:45.531672+00', 'Carmen', 22),
	(2, '2023-07-07 14:59:44.412258+00', 'Buenos Aires', 21),
	(3, '2023-07-07 15:00:10.896289+00', 'Limón', 20),
	(4, '2023-07-07 15:00:38.327404+00', 'Heredia', 19),
	(5, '2023-07-07 15:01:18.559929+00', 'Liberia', 18),
	(6, '2023-07-07 15:01:48.641032+00', 'Oriental', 17),
	(7, '2023-07-07 15:02:15.061616+00', 'Alajuela', 1),
	(8, '2023-07-14 16:14:23.64637+00', 'Merced', 22),
	(9, '2023-07-14 16:14:23.64637+00', 'Hospital', 22),
	(10, '2023-07-14 16:14:23.64637+00', 'Catedral', 22),
	(11, '2023-07-14 16:14:23.64637+00', 'Zapote', 22),
	(12, '2023-07-14 16:14:23.64637+00', 'San Francisco de Dos Ríos', 22),
	(13, '2023-07-14 16:14:23.64637+00', 'Uruca ', 22),
	(14, '2023-07-14 16:14:23.64637+00', 'Mata Redonda', 22),
	(15, '2023-07-14 16:14:23.64637+00', 'Hatillo', 22),
	(16, '2023-07-14 16:14:23.64637+00', 'San Sebastián', 22),
	(17, '2023-07-14 16:14:23.64637+00', 'Pavas', 22),
	(18, '2023-07-14 16:14:23.64637+00', 'Escazú', 66),
	(19, '2023-07-14 16:14:23.64637+00', 'San Antonio', 66),
	(20, '2023-07-14 16:14:23.64637+00', 'San Rafael', 66),
	(21, '2023-07-14 16:14:23.64637+00', 'Desamparados', 67),
	(22, '2023-07-14 16:14:23.64637+00', 'San Miguel', 67),
	(23, '2023-07-14 16:14:23.64637+00', 'San Juan de Dios', 67),
	(24, '2023-07-14 16:14:23.64637+00', 'San Rafael arriba', 67),
	(25, '2023-07-14 16:14:23.64637+00', 'San Antonio', 67),
	(26, '2023-07-14 16:14:23.64637+00', 'Frailes', 67),
	(27, '2023-07-14 16:14:23.64637+00', 'Patarra', 67),
	(28, '2023-07-14 16:14:23.64637+00', 'San Cristobal', 67),
	(29, '2023-07-14 16:14:23.64637+00', 'Rosario', 67),
	(30, '2023-07-14 16:14:23.64637+00', 'Damas', 67),
	(31, '2023-07-14 16:14:23.64637+00', 'San Rafael abajo', 67),
	(32, '2023-07-14 16:14:23.64637+00', 'Gravilias', 67),
	(33, '2023-07-14 16:14:23.64637+00', 'Los Guido', 67),
	(34, '2023-07-14 16:14:23.64637+00', 'Santiago', 68),
	(35, '2023-07-14 16:14:23.64637+00', 'Mercedes Sur', 68),
	(36, '2023-07-14 16:14:23.64637+00', 'Barbacoas', 68),
	(37, '2023-07-14 16:14:23.64637+00', 'Grifo Alto', 68),
	(38, '2023-07-14 16:14:23.64637+00', 'San Rafael', 68),
	(39, '2023-07-14 16:14:23.64637+00', 'Candelarita', 68),
	(40, '2023-07-14 16:14:23.64637+00', 'Desamparaditos', 68),
	(41, '2023-07-14 16:14:23.64637+00', 'San Antonio', 68),
	(42, '2023-07-14 16:14:23.64637+00', 'Chires', 68),
	(43, '2023-07-14 16:14:23.64637+00', 'San Marcos', 69),
	(44, '2023-07-14 16:14:23.64637+00', 'San Lorenzo', 69),
	(45, '2023-07-14 16:14:23.64637+00', 'San Carlos', 69),
	(46, '2023-07-14 16:14:23.64637+00', 'Aserrí', 70),
	(47, '2023-07-14 16:14:23.64637+00', 'Tarbaca', 70),
	(48, '2023-07-14 16:14:23.64637+00', 'Vuelta de Jorco', 70),
	(49, '2023-07-14 16:14:23.64637+00', 'San Gabriel', 70),
	(50, '2023-07-14 16:14:23.64637+00', 'Legua', 70),
	(51, '2023-07-14 16:14:23.64637+00', 'Monterrey', 70),
	(52, '2023-07-14 16:14:23.64637+00', 'Salitrillos', 70),
	(53, '2023-07-14 16:14:23.64637+00', 'Colón', 71),
	(54, '2023-07-14 16:14:23.64637+00', 'Guayabo', 71),
	(55, '2023-07-14 16:14:23.64637+00', 'Tabarcia', 71),
	(56, '2023-07-14 16:14:23.64637+00', 'Piedras Negras', 71),
	(57, '2023-07-14 16:14:23.64637+00', 'Picagres', 71),
	(58, '2023-07-14 16:14:23.64637+00', 'Jaris', 71),
	(59, '2023-07-14 16:14:23.64637+00', 'Quitirrisí', 71),
	(60, '2023-07-14 16:14:23.64637+00', 'Guadalupe', 72),
	(61, '2023-07-14 16:14:23.64637+00', 'San Francisco', 72),
	(62, '2023-07-14 16:14:23.64637+00', 'Calle Blancos', 72),
	(63, '2023-07-14 16:14:23.64637+00', 'Mata de Plátano', 72),
	(64, '2023-07-14 16:14:23.64637+00', 'Ipis', 72),
	(65, '2023-07-14 16:14:23.64637+00', 'Rancho Redondo', 72),
	(66, '2023-07-14 16:14:23.64637+00', 'Purral', 72),
	(67, '2023-07-14 16:14:23.64637+00', 'Santa Ana', 73),
	(68, '2023-07-14 16:14:23.64637+00', 'Salitral', 73),
	(69, '2023-07-14 16:14:23.64637+00', 'Pozos', 73),
	(70, '2023-07-14 16:14:23.64637+00', 'Uruca ', 73),
	(71, '2023-07-14 16:14:23.64637+00', 'Piedades', 73),
	(72, '2023-07-14 16:14:23.64637+00', 'Brasil', 73),
	(73, '2023-07-14 16:14:23.64637+00', 'Alajuelita', 74),
	(74, '2023-07-14 16:14:23.64637+00', 'San Jocesito', 74),
	(75, '2023-07-14 16:14:23.64637+00', 'San Antonio', 74),
	(76, '2023-07-14 16:14:23.64637+00', 'Concepción', 74),
	(77, '2023-07-14 16:14:23.64637+00', 'San Felipe', 74),
	(78, '2023-07-14 16:14:23.64637+00', 'San Isidro', 75),
	(79, '2023-07-14 16:14:23.64637+00', 'San Rafael', 75),
	(80, '2023-07-14 16:14:23.64637+00', 'Dulce Nombre de Jesús', 75),
	(81, '2023-07-14 16:14:23.64637+00', 'Patalillo', 75),
	(82, '2023-07-14 16:14:23.64637+00', 'Cascajal', 75),
	(83, '2023-07-14 16:14:23.64637+00', 'San Ignacio', 76),
	(84, '2023-07-14 16:14:23.64637+00', 'Guaitil', 76),
	(85, '2023-07-14 16:14:23.64637+00', 'Palmichal', 76),
	(86, '2023-07-14 16:14:23.64637+00', 'Cangrejal', 76),
	(87, '2023-07-14 16:14:23.64637+00', 'Sabanillas', 76),
	(88, '2023-07-14 16:14:23.64637+00', 'Cinco Esquinas', 77),
	(89, '2023-07-14 16:14:23.64637+00', 'Anselmo Llorente', 77),
	(90, '2023-07-14 16:14:23.64637+00', ' León XIII', 77),
	(91, '2023-07-14 16:14:23.64637+00', 'Colima', 77),
	(92, '2023-07-14 16:14:23.64637+00', 'San Juan', 77),
	(93, '2023-07-14 16:14:23.64637+00', 'San Vicente', 78),
	(94, '2023-07-14 16:14:23.64637+00', 'San Jerónimo', 78),
	(95, '2023-07-14 16:14:23.64637+00', 'La Trinidad', 78),
	(96, '2023-07-14 16:14:23.64637+00', 'San Pedro', 79),
	(97, '2023-07-14 16:14:23.64637+00', 'Sabanilla', 79),
	(98, '2023-07-14 16:14:23.64637+00', 'Mercedes', 79),
	(99, '2023-07-14 16:14:23.64637+00', 'San Rafael', 79),
	(100, '2023-07-14 16:14:23.64637+00', 'San Pablo', 80),
	(101, '2023-07-14 16:14:23.64637+00', 'San Pedro', 80),
	(102, '2023-07-14 16:14:23.64637+00', 'San Juan de Mata', 80),
	(103, '2023-07-14 16:14:23.64637+00', 'San Luis', 80),
	(104, '2023-07-14 16:14:23.64637+00', 'Carara', 80),
	(105, '2023-07-14 16:14:23.64637+00', 'Santa María', 81),
	(106, '2023-07-14 16:14:23.64637+00', 'Jardín', 81),
	(107, '2023-07-14 16:14:23.64637+00', 'Copey', 81),
	(108, '2023-07-14 16:14:23.64637+00', 'Curridabat', 82),
	(109, '2023-07-14 16:14:23.64637+00', 'Granadilla', 82),
	(110, '2023-07-14 16:14:23.64637+00', 'Sánchez', 82),
	(111, '2023-07-14 16:14:23.64637+00', 'Tirrases', 82),
	(112, '2023-07-14 16:14:23.64637+00', 'San Isidro de El General', 83),
	(113, '2023-07-14 16:14:23.64637+00', 'El General', 83),
	(114, '2023-07-14 16:14:23.64637+00', 'Daniel Flores', 83),
	(115, '2023-07-14 16:14:23.64637+00', 'Rivas', 83),
	(116, '2023-07-14 16:14:23.64637+00', 'San Pedro', 83),
	(117, '2023-07-14 16:14:23.64637+00', 'Platanares', 83),
	(118, '2023-07-14 16:14:23.64637+00', 'Pejibaye', 83),
	(119, '2023-07-14 16:14:23.64637+00', 'Cajón', 83),
	(120, '2023-07-14 16:14:23.64637+00', 'Barú', 83),
	(121, '2023-07-14 16:14:23.64637+00', 'Río Nuevo', 83),
	(122, '2023-07-14 16:14:23.64637+00', 'Paramo', 83),
	(123, '2023-07-14 16:14:23.64637+00', 'La Amistad', 83),
	(124, '2023-07-14 16:14:23.64637+00', 'San Pablo', 84),
	(125, '2023-07-14 16:14:23.64637+00', 'San Andrés', 84),
	(126, '2023-07-14 16:14:23.64637+00', 'Llano Bonito', 84),
	(127, '2023-07-14 16:14:23.64637+00', 'San Isidro', 84),
	(128, '2023-07-14 16:14:23.64637+00', 'Santa Cruz', 84),
	(129, '2023-07-14 16:14:23.64637+00', 'San Antonio', 84),
	(130, '2023-07-14 16:14:23.64637+00', 'San José', 1),
	(131, '2023-07-14 16:14:23.64637+00', 'Carrizal', 1),
	(132, '2023-07-14 16:14:23.64637+00', 'San Antonio', 1),
	(133, '2023-07-14 16:14:23.64637+00', 'Guácima', 1),
	(134, '2023-07-14 16:14:23.64637+00', 'San Isidro', 1),
	(135, '2023-07-14 16:14:23.64637+00', 'Sabanilla', 1),
	(136, '2023-07-14 16:14:23.64637+00', 'San Rafael', 1),
	(137, '2023-07-14 16:14:23.64637+00', 'Río Segundo', 1),
	(138, '2023-07-14 16:14:23.64637+00', 'Desamparados', 1),
	(139, '2023-07-14 16:14:23.64637+00', 'Turrucares', 1),
	(140, '2023-07-14 16:14:23.64637+00', 'Tambor', 1),
	(141, '2023-07-14 16:14:23.64637+00', 'Garita', 1),
	(142, '2023-07-14 16:14:23.64637+00', 'Sarapiquí', 1),
	(143, '2023-07-14 16:14:23.64637+00', 'San Ramón', 2),
	(144, '2023-07-14 16:14:23.64637+00', 'Santiago', 2),
	(145, '2023-07-14 16:14:23.64637+00', 'San Juan', 2),
	(146, '2023-07-14 16:14:23.64637+00', 'Piedades Norte', 2),
	(147, '2023-07-14 16:14:23.64637+00', 'Piedades Sur', 2),
	(148, '2023-07-14 16:14:23.64637+00', 'San Rafael', 2),
	(149, '2023-07-14 16:14:23.64637+00', 'San Isidro', 2),
	(150, '2023-07-14 16:14:23.64637+00', 'Ángeles', 2),
	(151, '2023-07-14 16:14:23.64637+00', 'Alfaro', 2),
	(152, '2023-07-14 16:14:23.64637+00', 'Volio', 2),
	(153, '2023-07-14 16:14:23.64637+00', 'Concepción', 2),
	(154, '2023-07-14 16:14:23.64637+00', 'Zapotal', 2),
	(155, '2023-07-14 16:14:23.64637+00', ' Peñas Blancas', 2),
	(156, '2023-07-14 16:14:23.64637+00', 'San Lorenzo', 2),
	(157, '2023-07-14 16:14:23.64637+00', 'Grecia', 3),
	(158, '2023-07-14 16:14:23.64637+00', 'San Isidro', 3),
	(159, '2023-07-14 16:14:23.64637+00', 'San José', 3),
	(160, '2023-07-14 16:14:23.64637+00', 'San Roque', 3),
	(161, '2023-07-14 16:14:23.64637+00', 'Tacares', 3),
	(162, '2023-07-14 16:14:23.64637+00', 'Puente de Piedra', 3),
	(163, '2023-07-14 16:14:23.64637+00', 'Bolivar', 3),
	(164, '2023-07-14 16:14:23.64637+00', 'San Mateo', 4),
	(165, '2023-07-14 16:14:23.64637+00', 'Desmonte', 4),
	(166, '2023-07-14 16:14:23.64637+00', 'Jesús María', 4),
	(167, '2023-07-14 16:14:23.64637+00', 'Labrador', 4),
	(168, '2023-07-14 16:14:23.64637+00', 'Atenas', 5),
	(169, '2023-07-14 16:14:23.64637+00', 'Jesús', 5),
	(170, '2023-07-14 16:14:23.64637+00', 'Mercedes', 5),
	(171, '2023-07-14 16:14:23.64637+00', 'San Isidro', 5),
	(172, '2023-07-14 16:14:23.64637+00', 'Concepción', 5),
	(173, '2023-07-14 16:14:23.64637+00', 'San José', 5),
	(174, '2023-07-14 16:14:23.64637+00', 'Santa Eulalia', 5),
	(175, '2023-07-14 16:14:23.64637+00', 'Escobal', 5),
	(176, '2023-07-14 16:14:23.64637+00', 'Naranjo', 6),
	(177, '2023-07-14 16:14:23.64637+00', 'San Miguel', 6),
	(178, '2023-07-14 16:14:23.64637+00', 'San José', 6),
	(179, '2023-07-14 16:14:23.64637+00', 'Cirrí Sur', 6),
	(180, '2023-07-14 16:14:23.64637+00', 'San Jerónimo', 6),
	(181, '2023-07-14 16:14:23.64637+00', 'San Juan', 6),
	(182, '2023-07-14 16:14:23.64637+00', 'El Rosario', 6),
	(183, '2023-07-14 16:14:23.64637+00', 'Palmitos', 6),
	(184, '2023-07-14 16:14:23.64637+00', 'Palmares', 7),
	(185, '2023-07-14 16:14:23.64637+00', 'Zaragoza', 7),
	(186, '2023-07-14 16:14:23.64637+00', 'Buenos Aires', 7),
	(187, '2023-07-14 16:14:23.64637+00', 'Santiago', 7),
	(188, '2023-07-14 16:14:23.64637+00', 'Candelaria', 7),
	(189, '2023-07-14 16:14:23.64637+00', 'Esquipulas', 7),
	(190, '2023-07-14 16:14:23.64637+00', 'La Granja', 7),
	(191, '2023-07-14 16:14:23.64637+00', 'San Pedro', 8),
	(192, '2023-07-14 16:14:23.64637+00', 'San Juan', 8),
	(193, '2023-07-14 16:14:23.64637+00', 'San Rafael', 8),
	(194, '2023-07-14 16:14:23.64637+00', 'Carrillos', 8),
	(195, '2023-07-14 16:14:23.64637+00', 'Sabana Redonda', 8),
	(196, '2023-07-14 16:14:23.64637+00', 'Orotina', 9),
	(197, '2023-07-14 16:14:23.64637+00', 'El Mastate', 9),
	(198, '2023-07-14 16:14:23.64637+00', 'Hacienda Vieja', 9),
	(199, '2023-07-14 16:14:23.64637+00', 'Coyolar', 9),
	(200, '2023-07-14 16:14:23.64637+00', 'La Ceiba', 9),
	(201, '2023-07-14 16:14:23.64637+00', 'Quesada', 10),
	(202, '2023-07-14 16:14:23.64637+00', 'Florencia', 10),
	(203, '2023-07-14 16:14:23.64637+00', 'Buenavista', 10),
	(204, '2023-07-14 16:14:23.64637+00', 'Aguas Zarcas', 10),
	(205, '2023-07-14 16:14:23.64637+00', 'Venecia', 10),
	(206, '2023-07-14 16:14:23.64637+00', 'Pital', 10),
	(207, '2023-07-14 16:14:23.64637+00', 'La Fortuna', 10),
	(208, '2023-07-14 16:14:23.64637+00', 'La Tigra', 10),
	(209, '2023-07-14 16:14:23.64637+00', 'La Palmera', 10),
	(210, '2023-07-14 16:14:23.64637+00', 'Venado', 10),
	(211, '2023-07-14 16:14:23.64637+00', 'Cutris', 10),
	(212, '2023-07-14 16:14:23.64637+00', 'Monterrey', 10),
	(213, '2023-07-14 16:14:23.64637+00', 'Pocosol', 10),
	(214, '2023-07-14 16:14:23.64637+00', 'Zarcero', 11),
	(215, '2023-07-14 16:14:23.64637+00', 'Laguna', 11),
	(216, '2023-07-14 16:14:23.64637+00', 'Tapesco', 11),
	(217, '2023-07-14 16:14:23.64637+00', 'Guadalupe', 11),
	(218, '2023-07-14 16:14:23.64637+00', 'Palmira', 11),
	(219, '2023-07-14 16:14:23.64637+00', 'Zapote', 11),
	(220, '2023-07-14 16:14:23.64637+00', 'Brisas', 11),
	(221, '2023-07-14 16:14:23.64637+00', 'Sarchí Norte', 12),
	(222, '2023-07-14 16:14:23.64637+00', 'Sarchí Sur', 12),
	(223, '2023-07-14 16:14:23.64637+00', 'Toro Amarillo', 12),
	(224, '2023-07-14 16:14:23.64637+00', 'San Pedro', 12),
	(225, '2023-07-14 16:14:23.64637+00', 'Rodríguez', 12),
	(226, '2023-07-14 16:14:23.64637+00', 'Upala', 13),
	(227, '2023-07-14 16:14:23.64637+00', 'Aguas Claras', 13),
	(228, '2023-07-14 16:14:23.64637+00', 'Pizote (San Jose)', 13),
	(229, '2023-07-14 16:14:23.64637+00', 'Bijagua', 13),
	(230, '2023-07-14 16:14:23.64637+00', 'Delicias', 13),
	(231, '2023-07-14 16:14:23.64637+00', 'Dos Ríos', 13),
	(232, '2023-07-14 16:14:23.64637+00', 'Yolillal', 13),
	(233, '2023-07-14 16:14:23.64637+00', 'Canalete', 13),
	(234, '2023-07-14 16:14:23.64637+00', 'Los Chiles', 14),
	(235, '2023-07-14 16:14:23.64637+00', 'Caño Negro', 14),
	(236, '2023-07-14 16:14:23.64637+00', 'El Amparo', 14),
	(237, '2023-07-14 16:14:23.64637+00', 'San Jorge', 14),
	(238, '2023-07-14 16:14:23.64637+00', 'San Rafael', 15),
	(239, '2023-07-14 16:14:23.64637+00', 'Buenavista', 15),
	(240, '2023-07-14 16:14:23.64637+00', 'Cote', 15),
	(241, '2023-07-14 16:14:23.64637+00', 'Katira', 15),
	(242, '2023-07-14 16:14:23.64637+00', 'Río Cuarto', 16),
	(243, '2023-07-14 16:14:23.64637+00', 'Santa Rita', 16),
	(244, '2023-07-14 16:14:23.64637+00', 'Santa Isabel', 16),
	(245, '2023-07-14 16:14:23.64637+00', 'Occidental', 17),
	(246, '2023-07-14 16:14:23.64637+00', 'San Nicolás', 17),
	(247, '2023-07-14 16:14:23.64637+00', 'Aguacaliente (San Francisco)', 17),
	(248, '2023-07-14 16:14:23.64637+00', 'Guadalupe (Arenilla)', 17),
	(249, '2023-07-14 16:14:23.64637+00', 'Corralillo', 17),
	(250, '2023-07-14 16:14:23.64637+00', 'Tierra Blanca', 17),
	(251, '2023-07-14 16:14:23.64637+00', 'Dulce Nombre de Jesús', 17),
	(252, '2023-07-14 16:14:23.64637+00', 'Llano Grande', 17),
	(253, '2023-07-14 16:14:23.64637+00', 'Quebradilla', 17),
	(254, '2023-07-14 16:14:23.64637+00', 'Carmen', 17),
	(255, '2023-07-14 16:14:23.64637+00', 'Paraíso', 23),
	(256, '2023-07-14 16:14:23.64637+00', 'Santiago', 23),
	(257, '2023-07-14 16:14:23.64637+00', 'Orosi', 23),
	(258, '2023-07-14 16:14:23.64637+00', 'Cachí', 23),
	(259, '2023-07-14 16:14:23.64637+00', 'Llanos de Santa Lucía', 23),
	(260, '2023-07-14 16:14:23.64637+00', 'Birrisito', 23),
	(261, '2023-07-14 16:14:23.64637+00', 'Tres Ríos', 24),
	(262, '2023-07-14 16:14:23.64637+00', 'San Diego', 24),
	(263, '2023-07-14 16:14:23.64637+00', 'San Juan', 24),
	(264, '2023-07-14 16:14:23.64637+00', 'San Rafael', 24),
	(265, '2023-07-14 16:14:23.64637+00', 'Concepción', 24),
	(266, '2023-07-14 16:14:23.64637+00', 'Dulce Nombre', 24),
	(267, '2023-07-14 16:14:23.64637+00', 'San Ramón', 24),
	(268, '2023-07-14 16:14:23.64637+00', 'Río Azul', 24),
	(269, '2023-07-14 16:14:23.64637+00', 'Juan Viñas', 25),
	(270, '2023-07-14 16:14:23.64637+00', 'Tucurrique', 25),
	(271, '2023-07-14 16:14:23.64637+00', 'Pejibaye', 25),
	(272, '2023-07-14 16:14:23.64637+00', 'Turrialba', 26),
	(273, '2023-07-14 16:14:23.64637+00', 'La Suiza', 26),
	(274, '2023-07-14 16:14:23.64637+00', 'Peralta', 26),
	(275, '2023-07-14 16:14:23.64637+00', 'Santa Cruz', 26),
	(276, '2023-07-14 16:14:23.64637+00', 'Santa Teresita', 26),
	(277, '2023-07-14 16:14:23.64637+00', 'Pavones', 26),
	(278, '2023-07-14 16:14:23.64637+00', 'Tuis', 26),
	(279, '2023-07-14 16:14:23.64637+00', 'Tayutic', 26),
	(280, '2023-07-14 16:14:23.64637+00', 'Santa Rosa', 26),
	(281, '2023-07-14 16:14:23.64637+00', 'Tres Equis', 26),
	(282, '2023-07-14 16:14:23.64637+00', 'La Isabel', 26),
	(283, '2023-07-14 16:14:23.64637+00', 'Chirripó', 26),
	(284, '2023-07-14 16:14:23.64637+00', 'Pacayas', 27),
	(285, '2023-07-14 16:14:23.64637+00', 'Cervantes', 27),
	(286, '2023-07-14 16:14:23.64637+00', 'Capellades', 27),
	(287, '2023-07-14 16:14:23.64637+00', 'San Rafael', 28),
	(288, '2023-07-14 16:14:23.64637+00', 'Cot', 28),
	(289, '2023-07-14 16:14:23.64637+00', 'Potrero Cerrado', 28),
	(290, '2023-07-14 16:14:23.64637+00', 'Santa Rosa', 28),
	(291, '2023-07-14 16:14:23.64637+00', 'Cipreses', 28),
	(292, '2023-07-14 16:14:23.64637+00', 'El Tejar', 29),
	(293, '2023-07-14 16:14:23.64637+00', 'San Isidro', 29),
	(294, '2023-07-14 16:14:23.64637+00', 'Tobosi', 29),
	(295, '2023-07-14 16:14:23.64637+00', 'Patio de Agua', 29),
	(296, '2023-07-14 16:14:23.64637+00', 'Mercedes', 19),
	(297, '2023-07-14 16:14:23.64637+00', 'San Francisco', 19),
	(298, '2023-07-14 16:14:23.64637+00', 'Ulloa', 19),
	(299, '2023-07-14 16:14:23.64637+00', 'Vara Blanca', 19),
	(300, '2023-07-14 16:14:23.64637+00', 'Barva', 40),
	(301, '2023-07-14 16:14:23.64637+00', 'San Pedro', 40),
	(302, '2023-07-14 16:14:23.64637+00', 'San Pablo', 40),
	(303, '2023-07-14 16:14:23.64637+00', 'San Roque', 40),
	(304, '2023-07-14 16:14:23.64637+00', 'Santa Lucía', 40),
	(305, '2023-07-14 16:14:23.64637+00', 'San José de la Montaña', 40),
	(306, '2023-07-14 16:14:23.64637+00', 'Santo Domingo', 41),
	(307, '2023-07-14 16:14:23.64637+00', 'San Vicente', 41),
	(308, '2023-07-14 16:14:23.64637+00', 'San Miguel', 41),
	(309, '2023-07-14 16:14:23.64637+00', 'Paracito', 41),
	(310, '2023-07-14 16:14:23.64637+00', 'Santo Tomás', 41),
	(311, '2023-07-14 16:14:23.64637+00', 'Santa Rosa', 41),
	(312, '2023-07-14 16:14:23.64637+00', 'Tures', 41),
	(313, '2023-07-14 16:14:23.64637+00', 'Pará', 41),
	(314, '2023-07-14 16:14:23.64637+00', 'Santa Bárbara', 42),
	(315, '2023-07-14 16:14:23.64637+00', 'San Pedro', 42),
	(316, '2023-07-14 16:14:23.64637+00', 'San Juan', 42),
	(317, '2023-07-14 16:14:23.64637+00', 'Jesús', 42),
	(318, '2023-07-14 16:14:23.64637+00', 'Santo Domingo', 42),
	(319, '2023-07-14 16:14:23.64637+00', 'Purabá', 42),
	(320, '2023-07-14 16:14:23.64637+00', 'San Rafael', 43),
	(321, '2023-07-14 16:14:23.64637+00', 'San Josecito', 43),
	(322, '2023-07-14 16:14:23.64637+00', 'Santiago', 43),
	(323, '2023-07-14 16:14:23.64637+00', 'Ángeles', 43),
	(324, '2023-07-14 16:14:23.64637+00', 'Concepción', 43),
	(325, '2023-07-14 16:14:23.64637+00', 'San Isidro', 44),
	(326, '2023-07-14 16:14:23.64637+00', 'San José', 44),
	(327, '2023-07-14 16:14:23.64637+00', 'Concepción', 44),
	(328, '2023-07-14 16:14:23.64637+00', 'San Francisco', 44),
	(329, '2023-07-14 16:14:23.64637+00', 'San Antonio', 45),
	(330, '2023-07-14 16:14:23.64637+00', 'La Ribera', 45),
	(331, '2023-07-14 16:14:23.64637+00', 'La Asunción', 45),
	(332, '2023-07-14 16:14:23.64637+00', 'San Joaquín', 46),
	(333, '2023-07-14 16:14:23.64637+00', 'Llorente', 46),
	(334, '2023-07-14 16:14:23.64637+00', 'Barrantes', 46),
	(335, '2023-07-14 16:14:23.64637+00', 'San Pablo', 47),
	(336, '2023-07-14 16:14:23.64637+00', 'Rincón de Sabanilla', 47),
	(337, '2023-07-14 16:14:23.64637+00', 'Puerto Viejo', 48),
	(338, '2023-07-14 16:14:23.64637+00', 'La Virgen', 48),
	(339, '2023-07-14 16:14:23.64637+00', 'Las Horquetas', 48),
	(340, '2023-07-14 16:14:23.64637+00', 'Llanuras del Gaspar', 48),
	(341, '2023-07-14 16:14:23.64637+00', 'Cureña', 48),
	(342, '2023-07-14 16:14:23.64637+00', 'Cañas Dulces', 18),
	(343, '2023-07-14 16:14:23.64637+00', 'Mayorga', 18),
	(344, '2023-07-14 16:14:23.64637+00', 'Nacascolo', 18),
	(345, '2023-07-14 16:14:23.64637+00', 'Curubandé', 18),
	(346, '2023-07-14 16:14:23.64637+00', 'Nicoya', 30),
	(347, '2023-07-14 16:14:23.64637+00', 'Mansión', 30),
	(348, '2023-07-14 16:14:23.64637+00', 'San Antonio', 30),
	(349, '2023-07-14 16:14:23.64637+00', 'Quebrada Honda', 30),
	(350, '2023-07-14 16:14:23.64637+00', 'Sámara', 30),
	(351, '2023-07-14 16:14:23.64637+00', 'Nosara', 30),
	(352, '2023-07-14 16:14:23.64637+00', 'Belén de Nosarita', 30),
	(353, '2023-07-14 16:14:23.64637+00', 'Santa Cruz', 31),
	(354, '2023-07-14 16:14:23.64637+00', 'Bolsón', 31),
	(355, '2023-07-14 16:14:23.64637+00', 'Veintisiete de Abril', 31),
	(356, '2023-07-14 16:14:23.64637+00', 'Tempate', 31),
	(357, '2023-07-14 16:14:23.64637+00', 'Cartagena', 31),
	(358, '2023-07-14 16:14:23.64637+00', 'Cuajiniquil', 31),
	(359, '2023-07-14 16:14:23.64637+00', 'Diriá', 31),
	(360, '2023-07-14 16:14:23.64637+00', 'Cabo Velas', 31),
	(361, '2023-07-14 16:14:23.64637+00', 'Tamarindo', 31),
	(362, '2023-07-14 16:14:23.64637+00', 'Bagaces', 32),
	(363, '2023-07-14 16:14:23.64637+00', 'Río Naranjo', 32),
	(364, '2023-07-14 16:14:23.64637+00', 'La Fortuna', 32),
	(365, '2023-07-14 16:14:23.64637+00', 'Mogote', 32),
	(366, '2023-07-14 16:14:23.64637+00', 'Filadelfia', 33),
	(367, '2023-07-14 16:14:23.64637+00', 'Palmira', 33),
	(368, '2023-07-14 16:14:23.64637+00', 'Sardinal', 33),
	(369, '2023-07-14 16:14:23.64637+00', 'Belén', 33),
	(370, '2023-07-14 16:14:23.64637+00', 'Cañas', 34),
	(371, '2023-07-14 16:14:23.64637+00', 'Palmira', 34),
	(372, '2023-07-14 16:14:23.64637+00', 'San Miguel', 34),
	(373, '2023-07-14 16:14:23.64637+00', 'Bebedero', 34),
	(374, '2023-07-14 16:14:23.64637+00', 'Porozal', 34),
	(375, '2023-07-14 16:14:23.64637+00', 'Las Juntas', 35),
	(376, '2023-07-14 16:14:23.64637+00', 'Colorado', 35),
	(377, '2023-07-14 16:14:23.64637+00', 'Sierra', 35),
	(378, '2023-07-14 16:14:23.64637+00', 'San Juan', 35),
	(379, '2023-07-14 16:14:23.64637+00', 'Tilarán', 36),
	(380, '2023-07-14 16:14:23.64637+00', 'Quebrada Grande', 36),
	(381, '2023-07-14 16:14:23.64637+00', 'Tronadora', 36),
	(382, '2023-07-14 16:14:23.64637+00', 'Santa Rosa', 36),
	(383, '2023-07-14 16:14:23.64637+00', 'Líbano', 36),
	(384, '2023-07-14 16:14:23.64637+00', 'Tierras Morenas', 36),
	(385, '2023-07-14 16:14:23.64637+00', 'Cabeceras', 36),
	(386, '2023-07-14 16:14:23.64637+00', 'Arenal', 36),
	(387, '2023-07-14 16:14:23.64637+00', 'Carmona', 37),
	(388, '2023-07-14 16:14:23.64637+00', 'Santa Rita', 37),
	(389, '2023-07-14 16:14:23.64637+00', 'Zapotal', 37),
	(390, '2023-07-14 16:14:23.64637+00', 'San Pablo', 37),
	(391, '2023-07-14 16:14:23.64637+00', 'Porvenir', 37),
	(392, '2023-07-14 16:14:23.64637+00', 'Bejuco', 37),
	(393, '2023-07-14 16:14:23.64637+00', 'La Curz', 38),
	(394, '2023-07-14 16:14:23.64637+00', 'Santa Cecilia', 38),
	(395, '2023-07-14 16:14:23.64637+00', 'La Garita', 38),
	(396, '2023-07-14 16:14:23.64637+00', 'Santa Elena', 38),
	(397, '2023-07-14 16:14:23.64637+00', 'Hojancha', 39),
	(398, '2023-07-14 16:14:23.64637+00', 'Monte Romo', 39),
	(399, '2023-07-14 16:14:23.64637+00', 'Puerto Carrillo', 39),
	(400, '2023-07-14 16:14:23.64637+00', 'Huacas', 39),
	(401, '2023-07-14 16:14:23.64637+00', 'Matambú', 39),
	(402, '2023-07-14 16:14:23.64637+00', 'Puntarenas', 54),
	(403, '2023-07-14 16:14:23.64637+00', 'Pitahaya', 54),
	(404, '2023-07-14 16:14:23.64637+00', 'Chomes', 54),
	(405, '2023-07-14 16:14:23.64637+00', 'Lepanto', 54),
	(406, '2023-07-14 16:14:23.64637+00', 'Paquera', 54),
	(407, '2023-07-14 16:14:23.64637+00', 'Manzanillo', 54),
	(408, '2023-07-14 16:14:23.64637+00', 'Guacimal', 54),
	(409, '2023-07-14 16:14:23.64637+00', 'Barranca', 54),
	(410, '2023-07-14 16:14:23.64637+00', 'Isla del Coco', 54),
	(411, '2023-07-14 16:14:23.64637+00', 'Cóbano', 54),
	(412, '2023-07-14 16:14:23.64637+00', 'Chacarita', 54),
	(413, '2023-07-14 16:14:23.64637+00', 'Chira', 54),
	(414, '2023-07-14 16:14:23.64637+00', 'Acapulco', 54),
	(415, '2023-07-14 16:14:23.64637+00', 'El Roble', 54),
	(416, '2023-07-14 16:14:23.64637+00', 'Arancibia', 54),
	(417, '2023-07-14 16:14:23.64637+00', 'Espíritu Santo', 55),
	(418, '2023-07-14 16:14:23.64637+00', 'San Juan Grande', 55),
	(419, '2023-07-14 16:14:23.64637+00', 'Macacona', 55),
	(420, '2023-07-14 16:14:23.64637+00', 'San Rafael', 55),
	(421, '2023-07-14 16:14:23.64637+00', 'San Jerónimo', 55),
	(422, '2023-07-14 16:14:23.64637+00', 'Caldera', 55),
	(423, '2023-07-14 16:14:23.64637+00', 'Volcán', 21),
	(424, '2023-07-14 16:14:23.64637+00', 'Potrero Grande', 21),
	(425, '2023-07-14 16:14:23.64637+00', 'Boruca', 21),
	(426, '2023-07-14 16:14:23.64637+00', 'Pilas', 21),
	(427, '2023-07-14 16:14:23.64637+00', 'Colinas', 21),
	(428, '2023-07-14 16:14:23.64637+00', 'Chánguena', 21),
	(429, '2023-07-14 16:14:23.64637+00', 'Biolley', 21),
	(430, '2023-07-14 16:14:23.64637+00', 'Brunka', 21),
	(431, '2023-07-14 16:14:23.64637+00', 'La Unión', 56),
	(432, '2023-07-14 16:14:23.64637+00', 'Miramar', 56),
	(433, '2023-07-14 16:14:23.64637+00', 'San Isidro', 56),
	(434, '2023-07-14 16:14:23.64637+00', 'Puerto Cortés', 57),
	(435, '2023-07-14 16:14:23.64637+00', 'Palmar', 57),
	(436, '2023-07-14 16:14:23.64637+00', 'Sierpe', 57),
	(437, '2023-07-14 16:14:23.64637+00', 'Bahía Ballena', 57),
	(438, '2023-07-14 16:14:23.64637+00', 'Piedras Blancas', 57),
	(439, '2023-07-14 16:14:23.64637+00', 'Bahía Drake', 57),
	(440, '2023-07-14 16:14:23.64637+00', 'Quepos', 65),
	(441, '2023-07-14 16:14:23.64637+00', 'Savegre', 65),
	(442, '2023-07-14 16:14:23.64637+00', 'Naranjito', 65),
	(444, '2023-07-14 16:14:23.64637+00', 'Guaycará', 59),
	(445, '2023-07-14 16:14:23.64637+00', 'Pavón', 59),
	(446, '2023-07-14 16:14:23.64637+00', 'Golfito', 59),
	(447, '2023-07-14 16:14:23.64637+00', 'San Vito', 60),
	(448, '2023-07-14 16:14:23.64637+00', 'Sabalito', 60),
	(449, '2023-07-14 16:14:23.64637+00', 'Aguabuena', 60),
	(450, '2023-07-14 16:14:23.64637+00', 'Limoncito', 60),
	(451, '2023-07-14 16:14:23.64637+00', 'Pittier', 60),
	(452, '2023-07-14 16:14:23.64637+00', 'Gutiérrez Braun', 60),
	(453, '2023-07-14 16:14:23.64637+00', 'Parrita', 61),
	(454, '2023-07-14 16:14:23.64637+00', 'Corredor', 62),
	(455, '2023-07-14 16:14:23.64637+00', 'Canoas', 62),
	(456, '2023-07-14 16:14:23.64637+00', 'La Cuesta', 62),
	(457, '2023-07-14 16:14:23.64637+00', 'Laurel', 62),
	(458, '2023-07-14 16:14:23.64637+00', 'Jacó', 63),
	(459, '2023-07-14 16:14:23.64637+00', 'Tárcoles', 63),
	(460, '2023-07-14 16:14:23.64637+00', 'Lagunillas', 63),
	(461, '2023-07-14 16:14:23.64637+00', 'Monteverde', 58),
	(462, '2023-07-14 16:14:23.64637+00', 'Valle la Estrella', 20),
	(463, '2023-07-14 16:14:23.64637+00', 'Río Blanco', 20),
	(464, '2023-07-14 16:14:23.64637+00', 'Matama', 20),
	(465, '2023-07-14 16:14:23.64637+00', 'Guápiles', 49),
	(466, '2023-07-14 16:14:23.64637+00', 'Jiménez', 49),
	(467, '2023-07-14 16:14:23.64637+00', 'Rita', 49),
	(468, '2023-07-14 16:14:23.64637+00', 'Roxana', 49),
	(469, '2023-07-14 16:14:23.64637+00', 'Cariari', 49),
	(470, '2023-07-14 16:14:23.64637+00', 'Colorado', 49),
	(471, '2023-07-14 16:14:23.64637+00', 'La Colonia', 49),
	(472, '2023-07-14 16:14:23.64637+00', 'Siquirres', 50),
	(473, '2023-07-14 16:14:23.64637+00', 'Pacuarito', 50),
	(474, '2023-07-14 16:14:23.64637+00', 'Florida', 50),
	(475, '2023-07-14 16:14:23.64637+00', 'Germania', 50),
	(476, '2023-07-14 16:14:23.64637+00', 'El Cairo', 50),
	(477, '2023-07-14 16:14:23.64637+00', 'Alegría', 50),
	(478, '2023-07-14 16:14:23.64637+00', 'Reventazón', 50),
	(479, '2023-07-14 16:14:23.64637+00', 'Bratsi', 51),
	(480, '2023-07-14 16:14:23.64637+00', 'Sixaola', 51),
	(481, '2023-07-14 16:14:23.64637+00', 'Cahuita', 51),
	(482, '2023-07-14 16:14:23.64637+00', 'Telire', 51),
	(483, '2023-07-14 16:14:23.64637+00', 'Matina', 52),
	(484, '2023-07-14 16:14:23.64637+00', 'Batán', 52),
	(485, '2023-07-14 16:14:23.64637+00', 'Carrandí', 52),
	(486, '2023-07-14 16:14:23.64637+00', 'Guácimo', 53),
	(487, '2023-07-14 16:14:23.64637+00', 'Pocora', 53),
	(488, '2023-07-14 16:14:23.64637+00', 'Mercedes', 53),
	(443, '2023-07-14 16:14:23.64637+00', 'Puerto Jiménez', 64),
	(489, '2023-07-16 12:54:51.363289+00', 'La Victoria', 25),
	(490, '2023-07-16 12:54:51.363289+00', 'Puente Salas ', 40),
	(491, '2023-07-16 12:54:51.363289+00', 'Río Jiménez', 53);

--
-- Data for Name: language; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."language" ("id", "language") VALUES
	(1, 'English (American)');


--
-- Data for Name: post_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."post_category" ("id", "category", "language") VALUES
	(1, 'Gardening', 1),
	(3, 'Construction', 1),
	(2, 'Beauty', 1),
	(5, 'Automotive', 1),
	(4, 'Computer', 1),
	(6, 'Creative', 1),
	(7, 'Financial', 1),
	(8, 'Cleaning', 1),
	(9, 'Pet', 1),
	(10, 'Legal', 1),
	(11, 'Health', 1),
	(12, 'Labor', 1),
	(13, 'Travel', 1);


RESET ALL;
