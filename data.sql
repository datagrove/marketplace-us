SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1 (Ubuntu 15.1-1.pgdg20.04+1)
-- Dumped by pg_dump version 15.6 (Ubuntu 15.6-1.pgdg20.04+1)

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

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', '3eddd066-cf1c-4bb8-bbe1-c7fcf59ba0f6', '{"action":"login","actor_id":"2ae7eb64-750a-42b9-8d8d-c8b9bf780092","actor_username":"test11@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-06-07 17:21:25.183291+00', ''),
	('00000000-0000-0000-0000-000000000000', '2edd65b0-03b2-4839-806c-f4739a2dff7f', '{"action":"token_refreshed","actor_id":"2ae7eb64-750a-42b9-8d8d-c8b9bf780092","actor_username":"test11@test.com","actor_via_sso":false,"log_type":"token"}', '2024-06-07 19:29:48.001401+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd7b0683f-78ed-4b03-9321-3c8256079ea6', '{"action":"token_revoked","actor_id":"2ae7eb64-750a-42b9-8d8d-c8b9bf780092","actor_username":"test11@test.com","actor_via_sso":false,"log_type":"token"}', '2024-06-07 19:29:48.003119+00', ''),
	('00000000-0000-0000-0000-000000000000', '57331a2d-1382-4873-9754-326789064847', '{"action":"token_refreshed","actor_id":"2ae7eb64-750a-42b9-8d8d-c8b9bf780092","actor_username":"test11@test.com","actor_via_sso":false,"log_type":"token"}', '2024-06-07 20:43:08.786183+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ca5baf3a-a870-472d-8d6a-3a95f9704378', '{"action":"token_revoked","actor_id":"2ae7eb64-750a-42b9-8d8d-c8b9bf780092","actor_username":"test11@test.com","actor_via_sso":false,"log_type":"token"}', '2024-06-07 20:43:08.787204+00', ''),
	('00000000-0000-0000-0000-000000000000', '206e0246-a441-4519-af85-947a86a9cc0a', '{"action":"token_refreshed","actor_id":"2ae7eb64-750a-42b9-8d8d-c8b9bf780092","actor_username":"test11@test.com","actor_via_sso":false,"log_type":"token"}', '2024-06-08 13:34:36.631484+00', ''),
	('00000000-0000-0000-0000-000000000000', '15911d6d-398e-4f28-b566-74a69e9229cc', '{"action":"token_revoked","actor_id":"2ae7eb64-750a-42b9-8d8d-c8b9bf780092","actor_username":"test11@test.com","actor_via_sso":false,"log_type":"token"}', '2024-06-08 13:34:36.63474+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ddb40d77-822f-4181-95db-356da395a792', '{"action":"token_refreshed","actor_id":"2ae7eb64-750a-42b9-8d8d-c8b9bf780092","actor_username":"test11@test.com","actor_via_sso":false,"log_type":"token"}', '2024-06-09 00:45:35.779596+00', ''),
	('00000000-0000-0000-0000-000000000000', '46242ac4-8049-4091-8579-bd26a032bda1', '{"action":"token_revoked","actor_id":"2ae7eb64-750a-42b9-8d8d-c8b9bf780092","actor_username":"test11@test.com","actor_via_sso":false,"log_type":"token"}', '2024-06-09 00:45:35.780634+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bce7abeb-8a13-425c-8e40-7c62c22d8499', '{"action":"token_refreshed","actor_id":"2ae7eb64-750a-42b9-8d8d-c8b9bf780092","actor_username":"test11@test.com","actor_via_sso":false,"log_type":"token"}', '2024-06-09 23:55:05.424291+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f385bc66-14b7-44f4-92ea-7c016abddef6', '{"action":"token_revoked","actor_id":"2ae7eb64-750a-42b9-8d8d-c8b9bf780092","actor_username":"test11@test.com","actor_via_sso":false,"log_type":"token"}', '2024-06-09 23:55:05.428557+00', ''),
	('00000000-0000-0000-0000-000000000000', '64e7a097-cabf-4b31-add7-e87e16a5e45b', '{"action":"token_refreshed","actor_id":"2ae7eb64-750a-42b9-8d8d-c8b9bf780092","actor_username":"test11@test.com","actor_via_sso":false,"log_type":"token"}', '2024-06-10 01:07:04.334606+00', ''),
	('00000000-0000-0000-0000-000000000000', '750f798b-d849-4f52-a340-48bb900e8de4', '{"action":"token_revoked","actor_id":"2ae7eb64-750a-42b9-8d8d-c8b9bf780092","actor_username":"test11@test.com","actor_via_sso":false,"log_type":"token"}', '2024-06-10 01:07:04.336447+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd1d526c0-15cd-41fe-9516-3b386d3686c3', '{"action":"token_refreshed","actor_id":"2ae7eb64-750a-42b9-8d8d-c8b9bf780092","actor_username":"test11@test.com","actor_via_sso":false,"log_type":"token"}', '2024-06-10 14:41:38.874133+00', ''),
	('00000000-0000-0000-0000-000000000000', '4903d0c9-4f59-473a-99fc-0c2bb9c0ca68', '{"action":"token_revoked","actor_id":"2ae7eb64-750a-42b9-8d8d-c8b9bf780092","actor_username":"test11@test.com","actor_via_sso":false,"log_type":"token"}', '2024-06-10 14:41:38.8779+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a3c01d02-3ec9-4e3e-8735-be8f98248c1e', '{"action":"token_refreshed","actor_id":"2ae7eb64-750a-42b9-8d8d-c8b9bf780092","actor_username":"test11@test.com","actor_via_sso":false,"log_type":"token"}', '2024-06-10 15:45:07.009106+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fc5ba707-b6fe-4ab6-b0d7-da8e02ddf8f8', '{"action":"token_revoked","actor_id":"2ae7eb64-750a-42b9-8d8d-c8b9bf780092","actor_username":"test11@test.com","actor_via_sso":false,"log_type":"token"}', '2024-06-10 15:45:07.010058+00', ''),
	('00000000-0000-0000-0000-000000000000', '90e2546c-f451-4405-8add-fb8aa8df7bc0', '{"action":"logout","actor_id":"2ae7eb64-750a-42b9-8d8d-c8b9bf780092","actor_username":"test11@test.com","actor_via_sso":false,"log_type":"account"}', '2024-06-10 15:49:14.143106+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a5697a22-fe82-42fb-bc7b-f263ccac0b80', '{"action":"login","actor_id":"a23376db-215d-49c4-9d9d-791c26579543","actor_username":"test4@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-06-10 15:54:33.845054+00', ''),
	('00000000-0000-0000-0000-000000000000', '88722cbd-f474-4fa2-8efe-b2f6b8bd333b', '{"action":"token_refreshed","actor_id":"a23376db-215d-49c4-9d9d-791c26579543","actor_username":"test4@test.com","actor_via_sso":false,"log_type":"token"}', '2024-06-10 16:53:21.964446+00', ''),
	('00000000-0000-0000-0000-000000000000', 'eba64873-128d-4d7e-9cb4-faa00479d6a5', '{"action":"token_revoked","actor_id":"a23376db-215d-49c4-9d9d-791c26579543","actor_username":"test4@test.com","actor_via_sso":false,"log_type":"token"}', '2024-06-10 16:53:21.967551+00', ''),
	('00000000-0000-0000-0000-000000000000', '79dbc38b-cbad-4d56-a7de-66dfa03d2e60', '{"action":"token_refreshed","actor_id":"a23376db-215d-49c4-9d9d-791c26579543","actor_username":"test4@test.com","actor_via_sso":false,"log_type":"token"}', '2024-06-10 20:51:33.230964+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a0f13561-cf40-483e-a57e-2c9674f903e1', '{"action":"token_revoked","actor_id":"a23376db-215d-49c4-9d9d-791c26579543","actor_username":"test4@test.com","actor_via_sso":false,"log_type":"token"}', '2024-06-10 20:51:33.233408+00', ''),
	('00000000-0000-0000-0000-000000000000', '180de612-9283-4ea6-8b8d-977b44a63e73', '{"action":"token_refreshed","actor_id":"a23376db-215d-49c4-9d9d-791c26579543","actor_username":"test4@test.com","actor_via_sso":false,"log_type":"token"}', '2024-06-11 13:28:46.14129+00', ''),
	('00000000-0000-0000-0000-000000000000', '866db05f-7c36-4af8-8ba6-0a5d6166efd9', '{"action":"token_revoked","actor_id":"a23376db-215d-49c4-9d9d-791c26579543","actor_username":"test4@test.com","actor_via_sso":false,"log_type":"token"}', '2024-06-11 13:28:46.192131+00', ''),
	('00000000-0000-0000-0000-000000000000', '6ea76e40-1ff2-4b9b-887c-5147d0827a86', '{"action":"token_refreshed","actor_id":"a23376db-215d-49c4-9d9d-791c26579543","actor_username":"test4@test.com","actor_via_sso":false,"log_type":"token"}', '2024-06-11 14:26:47.0543+00', ''),
	('00000000-0000-0000-0000-000000000000', '5eb2a768-a58b-44b2-942f-3f5a225afe14', '{"action":"token_revoked","actor_id":"a23376db-215d-49c4-9d9d-791c26579543","actor_username":"test4@test.com","actor_via_sso":false,"log_type":"token"}', '2024-06-11 14:26:47.060516+00', ''),
	('00000000-0000-0000-0000-000000000000', '395d0b6b-6244-4f30-98aa-3c92f9fc7d33', '{"action":"logout","actor_id":"a23376db-215d-49c4-9d9d-791c26579543","actor_username":"test4@test.com","actor_via_sso":false,"log_type":"account"}', '2024-06-11 14:46:31.821361+00', ''),
	('00000000-0000-0000-0000-000000000000', '7a75fe27-86b5-487b-a0cb-5418c5c041b7', '{"action":"login","actor_id":"2ae7eb64-750a-42b9-8d8d-c8b9bf780092","actor_username":"test11@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-06-11 14:48:05.055812+00', ''),
	('00000000-0000-0000-0000-000000000000', '10905918-7905-4eaf-8483-a410a52a9e94', '{"action":"token_refreshed","actor_id":"2ae7eb64-750a-42b9-8d8d-c8b9bf780092","actor_username":"test11@test.com","actor_via_sso":false,"log_type":"token"}', '2024-06-11 15:46:12.949249+00', ''),
	('00000000-0000-0000-0000-000000000000', '837fae91-31b1-4be3-92cf-fc03f0c21c37', '{"action":"token_revoked","actor_id":"2ae7eb64-750a-42b9-8d8d-c8b9bf780092","actor_username":"test11@test.com","actor_via_sso":false,"log_type":"token"}', '2024-06-11 15:46:12.953056+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '84a298b6-9caf-4305-9bfe-3ea325df9188', 'authenticated', 'authenticated', 'germanzarkovich@gmail.com', '$2a$10$zDwI4WhdTYEEClfJm1VxVuhbXO.D8//bpMVwgV.dlYG.VujvRpi3q', '2024-03-05 15:35:23.695951+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2024-03-05 15:35:23.693491+00', '2024-03-05 15:35:23.696028+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '1caa66a7-d9a2-462f-93c4-e65946d61c02', 'authenticated', 'authenticated', 'someone@email.com', '$2a$10$qQA4UXgQC42VEL7Jj0BMI.lSolPCyHTQA0dy0209AT9/DTDoQ8./O', '2024-03-05 16:20:21.660728+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-03-05 16:20:21.673034+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2024-03-05 16:20:21.658888+00', '2024-03-05 16:20:21.673672+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'bae9af94-3ee7-47dd-9389-181cd5906814', 'authenticated', 'authenticated', 'test@test.com', '$2a$10$v1Rtv0uewR20qe0sxcmdGuhbIzqqIeRA0RU1UFXnakRTPONEt8Vjq', '2024-03-26 13:26:01.837792+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-03-26 13:26:01.841642+00', '{"provider": "email", "providers": ["email"]}', '{"last_name": "Test", "first_name": "Test"}', NULL, '2024-03-26 13:26:01.826478+00', '2024-03-26 19:29:25.886671+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'df10c4ca-2f2a-4ff1-b2c6-68a51ca94cf9', 'authenticated', 'authenticated', 'test10@test.com', '$2a$10$57DpbJB6eJ0TwKwpV7xR3.pB2CO2rzh2U4U7gLbelm3Pu9F7FlbsO', '2024-03-27 16:09:26.189581+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-03-27 16:09:26.190696+00', '{"provider": "email", "providers": ["email"]}', '{"last_name": "test", "first_name": "test"}', NULL, '2024-03-27 16:09:26.186335+00', '2024-03-27 16:09:26.192962+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'df188225-8970-42a4-a54f-97b303c2b2ed', 'authenticated', 'authenticated', 'test5@test.com', '$2a$10$0y/mcUrcfjUWWy/.jwc3HOoNYFJdydypaDykaLCzxYrPXOrGF65Hi', '2024-03-20 15:28:45.002582+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-03-20 15:28:45.005413+00', '{"provider": "email", "providers": ["email"]}', '{"last_name": "test", "first_name": "Test"}', NULL, '2024-03-20 15:28:44.990631+00', '2024-03-27 13:14:30.947697+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '111d3bed-1c92-4cf5-a66f-2ecaf3e717c3', 'authenticated', 'authenticated', 'test13@test.com', '$2a$10$HC.RmWBBeeD1Ay4YwGJnQ.O8qkBVqgfffmzc8JQgMRV9eV.M2eCTS', '2024-03-27 16:18:49.041032+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-03-27 16:18:49.044415+00', '{"provider": "email", "providers": ["email"]}', '{"last_name": "Test", "first_name": "Test"}', NULL, '2024-03-27 16:18:49.035351+00', '2024-03-27 18:53:13.107192+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'b78eab21-c34e-41ef-9a72-64ee49f4cbc0', 'authenticated', 'authenticated', 'test6@test.com', '$2a$10$upU6bJwUd0aXUifcbc.dauT/ak2wLw1dPHva/l7HmYZKhlRnz7a7S', '2024-03-27 14:23:24.235522+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-03-27 14:23:24.23826+00', '{"provider": "email", "providers": ["email"]}', '{"last_name": "test", "first_name": "Test"}', NULL, '2024-03-27 14:23:24.226145+00', '2024-03-27 14:23:24.241546+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'ec946adf-7315-4721-a238-ed600dd153d7', 'authenticated', 'authenticated', 'test2@test.com', '$2a$10$Bg3uVVpxeilQRtTim1/OCuWYqGhu1fhl2B5uSgLIo.K/t4F/XugQS', '2024-03-26 13:43:25.939314+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-03-26 13:43:25.940954+00', '{"provider": "email", "providers": ["email"]}', '{"last_name": "Test", "first_name": "Test2"}', NULL, '2024-03-26 13:43:25.93158+00', '2024-03-26 16:38:24.704182+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'b00f3d62-4eb1-40ba-b73e-e3dc78eff08a', 'authenticated', 'authenticated', 'test8@test.com', '$2a$10$/Cs2ysAPlBv5DOa9eNUo7uJAtC7rp57Lz5XTJ1eXmWJ6P9hbzWdN.', '2024-03-27 15:17:02.810911+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-03-27 15:17:02.813624+00', '{"provider": "email", "providers": ["email"]}', '{"last_name": "test", "first_name": "TEST"}', NULL, '2024-03-27 15:17:02.803115+00', '2024-03-27 19:04:24.849828+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'f885208b-ef4a-4f75-8543-a808db576a13', 'authenticated', 'authenticated', 'test7@test.com', '$2a$10$Xb00Z4wZuelapLp85KCfBOWExlPs8fzFwYhQ2vOKyZglHg6IQ5q3i', '2024-03-27 15:58:08.759078+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-03-27 15:58:08.76109+00', '{"provider": "email", "providers": ["email"]}', '{"last_name": "tes", "first_name": "test"}', NULL, '2024-03-27 15:58:08.75323+00', '2024-03-27 15:58:08.764263+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'a23376db-215d-49c4-9d9d-791c26579543', 'authenticated', 'authenticated', 'test4@test.com', '$2a$10$kb28zFsgV7Ff2KLr19LZ/.W3iEM.GssnZ5hPZf2I8YoQ1303cHOAm', '2024-03-19 18:42:48.187063+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-06-10 15:54:33.846334+00', '{"provider": "email", "providers": ["email"]}', '{"last_name": "test", "first_name": "test"}', NULL, '2024-03-19 18:42:48.175446+00', '2024-06-11 14:26:47.07262+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '2ae7eb64-750a-42b9-8d8d-c8b9bf780092', 'authenticated', 'authenticated', 'test11@test.com', '$2a$10$MPDSSQJyE4mIKl1kUvgrx.xdlM0qaO9PmLOE3/mKwqTbg/Tr6AsIm', '2024-03-27 16:12:36.47631+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-06-11 14:48:05.057663+00', '{"provider": "email", "providers": ["email"]}', '{"last_name": "test", "first_name": "test"}', NULL, '2024-03-27 16:12:36.471934+00', '2024-06-11 15:46:12.962553+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('84a298b6-9caf-4305-9bfe-3ea325df9188', '84a298b6-9caf-4305-9bfe-3ea325df9188', '{"sub": "84a298b6-9caf-4305-9bfe-3ea325df9188", "email": "germanzarkovich@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2024-03-05 15:35:23.694546+00', '2024-03-05 15:35:23.694566+00', '2024-03-05 15:35:23.694566+00', '90e98ab8-ce45-4579-bb03-41d5c42a8e72'),
	('1caa66a7-d9a2-462f-93c4-e65946d61c02', '1caa66a7-d9a2-462f-93c4-e65946d61c02', '{"sub": "1caa66a7-d9a2-462f-93c4-e65946d61c02", "email": "someone@email.com", "email_verified": false, "phone_verified": false}', 'email', '2024-03-05 16:20:21.660274+00', '2024-03-05 16:20:21.660292+00', '2024-03-05 16:20:21.660292+00', 'd75943f8-4ef2-4690-95af-d2e9cda392db'),
	('a23376db-215d-49c4-9d9d-791c26579543', 'a23376db-215d-49c4-9d9d-791c26579543', '{"sub": "a23376db-215d-49c4-9d9d-791c26579543", "email": "test4@test.com", "email_verified": false, "phone_verified": false}', 'email', '2024-03-19 18:42:48.184286+00', '2024-03-19 18:42:48.184314+00', '2024-03-19 18:42:48.184314+00', '3a7e7e73-99a6-4988-8399-283ad3fffdb6'),
	('df188225-8970-42a4-a54f-97b303c2b2ed', 'df188225-8970-42a4-a54f-97b303c2b2ed', '{"sub": "df188225-8970-42a4-a54f-97b303c2b2ed", "email": "test5@test.com", "email_verified": false, "phone_verified": false}', 'email', '2024-03-20 15:28:44.999614+00', '2024-03-20 15:28:44.999638+00', '2024-03-20 15:28:44.999638+00', '33bb9f73-e7b4-4ad7-941c-3e6121631ce5'),
	('bae9af94-3ee7-47dd-9389-181cd5906814', 'bae9af94-3ee7-47dd-9389-181cd5906814', '{"sub": "bae9af94-3ee7-47dd-9389-181cd5906814", "email": "test@test.com", "email_verified": false, "phone_verified": false}', 'email', '2024-03-26 13:26:01.834401+00', '2024-03-26 13:26:01.83444+00', '2024-03-26 13:26:01.83444+00', '8412cd73-8bb5-4756-8710-a8195c11dfb8'),
	('ec946adf-7315-4721-a238-ed600dd153d7', 'ec946adf-7315-4721-a238-ed600dd153d7', '{"sub": "ec946adf-7315-4721-a238-ed600dd153d7", "email": "test2@test.com", "email_verified": false, "phone_verified": false}', 'email', '2024-03-26 13:43:25.937675+00', '2024-03-26 13:43:25.937728+00', '2024-03-26 13:43:25.937728+00', '0e37cf84-44fc-44cf-9838-596070485990'),
	('b78eab21-c34e-41ef-9a72-64ee49f4cbc0', 'b78eab21-c34e-41ef-9a72-64ee49f4cbc0', '{"sub": "b78eab21-c34e-41ef-9a72-64ee49f4cbc0", "email": "test6@test.com", "email_verified": false, "phone_verified": false}', 'email', '2024-03-27 14:23:24.23297+00', '2024-03-27 14:23:24.232995+00', '2024-03-27 14:23:24.232995+00', '3e08e025-1a44-41ca-a5bc-975180ec4057'),
	('b00f3d62-4eb1-40ba-b73e-e3dc78eff08a', 'b00f3d62-4eb1-40ba-b73e-e3dc78eff08a', '{"sub": "b00f3d62-4eb1-40ba-b73e-e3dc78eff08a", "email": "test8@test.com", "email_verified": false, "phone_verified": false}', 'email', '2024-03-27 15:17:02.80911+00', '2024-03-27 15:17:02.809144+00', '2024-03-27 15:17:02.809144+00', 'd41041c4-0470-4270-8c04-ee10836a6e49'),
	('f885208b-ef4a-4f75-8543-a808db576a13', 'f885208b-ef4a-4f75-8543-a808db576a13', '{"sub": "f885208b-ef4a-4f75-8543-a808db576a13", "email": "test7@test.com", "email_verified": false, "phone_verified": false}', 'email', '2024-03-27 15:58:08.757066+00', '2024-03-27 15:58:08.757096+00', '2024-03-27 15:58:08.757096+00', '84ba1abd-1c76-42cb-abcb-8e9afff3a20c'),
	('df10c4ca-2f2a-4ff1-b2c6-68a51ca94cf9', 'df10c4ca-2f2a-4ff1-b2c6-68a51ca94cf9', '{"sub": "df10c4ca-2f2a-4ff1-b2c6-68a51ca94cf9", "email": "test10@test.com", "email_verified": false, "phone_verified": false}', 'email', '2024-03-27 16:09:26.188502+00', '2024-03-27 16:09:26.188531+00', '2024-03-27 16:09:26.188531+00', 'c136d41b-9029-44b5-9557-d31f5f86a8df'),
	('2ae7eb64-750a-42b9-8d8d-c8b9bf780092', '2ae7eb64-750a-42b9-8d8d-c8b9bf780092', '{"sub": "2ae7eb64-750a-42b9-8d8d-c8b9bf780092", "email": "test11@test.com", "email_verified": false, "phone_verified": false}', 'email', '2024-03-27 16:12:36.474881+00', '2024-03-27 16:12:36.474909+00', '2024-03-27 16:12:36.474909+00', '88238b38-8322-4188-b1f8-6bdb1be24b9d'),
	('111d3bed-1c92-4cf5-a66f-2ecaf3e717c3', '111d3bed-1c92-4cf5-a66f-2ecaf3e717c3', '{"sub": "111d3bed-1c92-4cf5-a66f-2ecaf3e717c3", "email": "test13@test.com", "email_verified": false, "phone_verified": false}', 'email', '2024-03-27 16:18:49.039164+00', '2024-03-27 16:18:49.039197+00', '2024-03-27 16:18:49.039197+00', 'dfe86529-b020-4a4f-97ec-80ecf5e18de6');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") VALUES
	('bbcd024c-ced7-4a5e-a835-585973a170da', '1caa66a7-d9a2-462f-93c4-e65946d61c02', '2024-03-05 16:20:21.673063+00', '2024-03-05 16:20:21.673063+00', NULL, 'aal1', NULL, NULL, 'curl/7.81.0', '172.18.0.1', NULL),
	('4c03eedf-a936-4315-9497-3daa7549d826', 'df188225-8970-42a4-a54f-97b303c2b2ed', '2024-03-20 15:28:45.005467+00', '2024-03-27 13:14:30.948873+00', NULL, 'aal1', NULL, '2024-03-27 13:14:30.94881', 'node', '192.168.65.1', NULL),
	('2971c683-db98-4085-91da-1faf2ddb71e4', 'f885208b-ef4a-4f75-8543-a808db576a13', '2024-03-27 15:58:08.761141+00', '2024-03-27 15:58:08.761141+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '192.168.65.1', NULL),
	('d90cdfff-94c8-4a3e-9c28-80d064839cda', 'df10c4ca-2f2a-4ff1-b2c6-68a51ca94cf9', '2024-03-27 16:09:26.190736+00', '2024-03-27 16:09:26.190736+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15', '192.168.65.1', NULL),
	('b9b588e8-7f7f-4f13-816c-68aab85cfef2', '111d3bed-1c92-4cf5-a66f-2ecaf3e717c3', '2024-03-27 16:18:49.044478+00', '2024-03-27 18:53:13.108184+00', NULL, 'aal1', NULL, '2024-03-27 18:53:13.108131', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15', '192.168.65.1', NULL),
	('0a2c73ca-752a-45a0-9d65-494dac44c1fa', 'ec946adf-7315-4721-a238-ed600dd153d7', '2024-03-26 13:43:25.941006+00', '2024-03-26 16:38:24.705762+00', NULL, 'aal1', NULL, '2024-03-26 16:38:24.705687', 'node', '192.168.65.1', NULL),
	('6a8baafa-3de0-45e5-bf3b-b3e6f162b202', 'b00f3d62-4eb1-40ba-b73e-e3dc78eff08a', '2024-03-27 15:17:02.81368+00', '2024-03-27 19:04:24.851184+00', NULL, 'aal1', NULL, '2024-03-27 19:04:24.851089', 'node', '192.168.65.1', NULL),
	('0b849222-0486-42b0-b78f-19f8f28d0462', 'bae9af94-3ee7-47dd-9389-181cd5906814', '2024-03-26 13:26:01.84171+00', '2024-03-26 19:29:25.891851+00', NULL, 'aal1', NULL, '2024-03-26 19:29:25.891756', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '192.168.65.1', NULL),
	('1fdb56b9-d51f-46df-8fe3-e6301e1b6c17', '2ae7eb64-750a-42b9-8d8d-c8b9bf780092', '2024-06-11 14:48:05.058027+00', '2024-06-11 15:46:12.967056+00', NULL, 'aal1', NULL, '2024-06-11 15:46:12.966991', 'Mozilla/5.0 (iPad; CPU OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1', '192.168.65.1', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('bbcd024c-ced7-4a5e-a835-585973a170da', '2024-03-05 16:20:21.67379+00', '2024-03-05 16:20:21.67379+00', 'password', 'a0f28147-3610-4695-b4c2-defb7fe28862'),
	('4c03eedf-a936-4315-9497-3daa7549d826', '2024-03-20 15:28:45.010246+00', '2024-03-20 15:28:45.010246+00', 'password', '2b1ef24f-f170-418b-852d-446ea4b3c503'),
	('0b849222-0486-42b0-b78f-19f8f28d0462', '2024-03-26 13:26:01.845716+00', '2024-03-26 13:26:01.845716+00', 'password', '27b95ef5-7f0b-4bda-bd39-9d16ca78132d'),
	('0a2c73ca-752a-45a0-9d65-494dac44c1fa', '2024-03-26 13:43:25.943737+00', '2024-03-26 13:43:25.943737+00', 'password', 'fc97791e-6a3b-49d1-b9cc-71d28e1c73c8'),
	('6a8baafa-3de0-45e5-bf3b-b3e6f162b202', '2024-03-27 15:17:02.816835+00', '2024-03-27 15:17:02.816835+00', 'password', 'a99e3c1b-a3f7-4acc-936f-baa5a7d0bd79'),
	('2971c683-db98-4085-91da-1faf2ddb71e4', '2024-03-27 15:58:08.76447+00', '2024-03-27 15:58:08.76447+00', 'password', 'f6def15b-193d-40ee-b9c7-f737b38f1e7d'),
	('d90cdfff-94c8-4a3e-9c28-80d064839cda', '2024-03-27 16:09:26.193147+00', '2024-03-27 16:09:26.193147+00', 'password', 'fc3cca4a-d1cc-432a-b7b8-05c932061cf2'),
	('b9b588e8-7f7f-4f13-816c-68aab85cfef2', '2024-03-27 16:18:49.047205+00', '2024-03-27 16:18:49.047205+00', 'password', '6b4f835c-6e52-41d7-90fd-761fcecc2fed'),
	('1fdb56b9-d51f-46df-8fe3-e6301e1b6c17', '2024-06-11 14:48:05.066469+00', '2024-06-11 14:48:05.066469+00', 'password', '6868ff56-97bc-49b4-ba25-e5006a2f4c3c');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 19, '4X2_ElB1oVu1V6PWytRfnQ', '2ae7eb64-750a-42b9-8d8d-c8b9bf780092', true, '2024-06-11 14:48:05.061503+00', '2024-06-11 15:46:12.953378+00', NULL, '1fdb56b9-d51f-46df-8fe3-e6301e1b6c17'),
	('00000000-0000-0000-0000-000000000000', 20, 'FGsvQx4nSjhXycy1WdqxEA', '2ae7eb64-750a-42b9-8d8d-c8b9bf780092', false, '2024-06-11 15:46:12.958777+00', '2024-06-11 15:46:12.958777+00', '4X2_ElB1oVu1V6PWytRfnQ', '1fdb56b9-d51f-46df-8fe3-e6301e1b6c17');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: key; Type: TABLE DATA; Schema: pgsodium; Owner: supabase_admin
--



--
-- Data for Name: country; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."country" ("id", "created_at", "country") VALUES
	(1, '2023-07-07 14:18:29.85077+00', 'United States');


--
-- Data for Name: major_municipality; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."major_municipality" ("id", "created_at", "major_municipality", "country") VALUES
	(1, '2024-03-05 10:22:01.74855+00', 'Alabama', 1),
	(2, '2024-03-05 10:22:01.74855+00', 'Alaska', 1),
	(3, '2024-03-05 10:22:01.74855+00', 'Arizona', 1),
	(4, '2024-03-05 10:22:01.74855+00', 'Arkansas', 1),
	(5, '2024-03-05 10:22:01.74855+00', 'California', 1),
	(6, '2024-03-05 10:22:01.74855+00', 'Colorado', 1),
	(7, '2024-03-05 10:22:01.74855+00', 'Connecticut', 1),
	(8, '2024-03-05 10:22:01.74855+00', 'Delaware', 1),
	(9, '2024-03-05 10:22:01.74855+00', 'Florida', 1),
	(10, '2024-03-05 10:22:01.74855+00', 'Georgia', 1),
	(11, '2024-03-05 10:22:01.74855+00', 'Hawaii', 1),
	(12, '2024-03-05 10:22:01.74855+00', 'Idaho', 1),
	(13, '2024-03-05 10:22:01.74855+00', 'Illinois', 1),
	(14, '2024-03-05 10:22:01.74855+00', 'Indiana', 1),
	(15, '2024-03-05 10:22:01.74855+00', 'Iowa', 1),
	(16, '2024-03-05 10:22:01.74855+00', 'Kansas', 1),
	(17, '2024-03-05 10:22:01.74855+00', 'Kentucky', 1),
	(18, '2024-03-05 10:22:01.74855+00', 'Louisiana', 1),
	(19, '2024-03-05 10:22:01.74855+00', 'Maine', 1),
	(20, '2024-03-05 10:22:01.74855+00', 'Maryland', 1),
	(21, '2024-03-05 10:22:01.74855+00', 'Massachusetts', 1),
	(22, '2024-03-05 10:22:01.74855+00', 'Michigan', 1),
	(23, '2024-03-05 10:22:01.74855+00', 'Minnesota', 1),
	(24, '2024-03-05 10:22:01.74855+00', 'Mississippi', 1),
	(25, '2024-03-05 10:22:01.74855+00', 'Missouri', 1),
	(26, '2024-03-05 10:22:01.74855+00', 'Montana', 1),
	(27, '2024-03-05 10:22:01.74855+00', 'Nebraska', 1),
	(28, '2024-03-05 10:22:01.74855+00', 'Nevada', 1),
	(29, '2024-03-05 10:22:01.74855+00', 'New Hampshire', 1),
	(30, '2024-03-05 10:22:01.74855+00', 'New Jersey', 1),
	(31, '2024-03-05 10:22:01.74855+00', 'New Mexico', 1),
	(32, '2024-03-05 10:22:01.74855+00', 'New York', 1),
	(33, '2024-03-05 10:22:01.74855+00', 'North Carolina', 1),
	(34, '2024-03-05 10:22:01.74855+00', 'North Dakota', 1),
	(35, '2024-03-05 10:22:01.74855+00', 'Ohio', 1),
	(36, '2024-03-05 10:22:01.74855+00', 'Oklahoma', 1),
	(37, '2024-03-05 10:22:01.74855+00', 'Oregon', 1),
	(38, '2024-03-05 10:22:01.74855+00', 'Pennsylvania', 1),
	(39, '2024-03-05 10:22:01.74855+00', 'Rhode Island', 1),
	(40, '2024-03-05 10:22:01.74855+00', 'South Carolina', 1),
	(41, '2024-03-05 10:22:01.74855+00', 'South Dakota', 1),
	(42, '2024-03-05 10:22:01.74855+00', 'Tennessee', 1),
	(43, '2024-03-05 10:22:01.74855+00', 'Texas', 1),
	(44, '2024-03-05 10:22:01.74855+00', 'Utah', 1),
	(45, '2024-03-05 10:22:01.74855+00', 'Vermont', 1),
	(46, '2024-03-05 10:22:01.74855+00', 'Virginia', 1),
	(47, '2024-03-05 10:22:01.74855+00', 'Washington', 1),
	(48, '2024-03-05 10:22:01.74855+00', 'West Virginia', 1),
	(49, '2024-03-05 10:22:01.74855+00', 'Wisconsin', 1),
	(50, '2024-03-05 10:22:01.74855+00', 'Wyoming', 1),
	(51, '2024-03-05 10:22:01.74855+00', 'Other', 1);


--
-- Data for Name: minor_municipality; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: governing_district; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: grade_level; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."grade_level" ("id", "grade") VALUES
	(1, 'PreK'),
	(2, 'K'),
	(3, '1st'),
	(4, '2nd'),
	(5, '3rd'),
	(6, '4th'),
	(7, '5th'),
	(8, '6th'),
	(9, '7th'),
	(10, '8th'),
	(11, '9th'),
	(12, '10th'),
	(13, '11th'),
	(14, '12th'),
	(15, 'College'),
	(16, 'Adult');


--
-- Data for Name: language; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."language" ("id", "language") VALUES
	(1, 'English (American)');


--
-- Data for Name: location; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."location" ("id", "created_at", "street_number", "street_number_suffix", "street_name", "street_type", "street_direction", "address_type", "address_type_identifier", "minor_municipality", "major_municipality", "governing_district", "postal_area", "country", "user_id") VALUES
	(1, '2024-03-05 15:36:33.909601+00', 1, '', 'Little Hill ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '84a298b6-9caf-4305-9bfe-3ea325df9188'),
	(2, '2024-03-19 19:37:25.616992+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 3, NULL, NULL, 1, 'a23376db-215d-49c4-9d9d-791c26579543'),
	(3, '2024-03-26 13:43:48.513815+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 3, NULL, NULL, 1, 'ec946adf-7315-4721-a238-ed600dd153d7'),
	(4, '2024-03-26 21:49:40.716283+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 5, NULL, NULL, 1, 'df188225-8970-42a4-a54f-97b303c2b2ed'),
	(5, '2024-03-27 14:23:47.644818+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 13, NULL, NULL, 1, 'b78eab21-c34e-41ef-9a72-64ee49f4cbc0'),
	(6, '2024-03-27 14:25:37.124905+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 'b78eab21-c34e-41ef-9a72-64ee49f4cbc0'),
	(7, '2024-03-27 15:00:50.919938+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 'b78eab21-c34e-41ef-9a72-64ee49f4cbc0'),
	(8, '2024-03-27 15:05:24.256555+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 'b78eab21-c34e-41ef-9a72-64ee49f4cbc0'),
	(9, '2024-03-27 15:18:06.596304+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 7, NULL, NULL, 1, 'b00f3d62-4eb1-40ba-b73e-e3dc78eff08a'),
	(10, '2024-03-27 15:18:49.51043+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 'b00f3d62-4eb1-40ba-b73e-e3dc78eff08a'),
	(11, '2024-03-27 15:49:08.232158+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 'b00f3d62-4eb1-40ba-b73e-e3dc78eff08a'),
	(12, '2024-03-27 15:50:36.084493+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 'b00f3d62-4eb1-40ba-b73e-e3dc78eff08a'),
	(13, '2024-03-27 15:53:32.278633+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 'b00f3d62-4eb1-40ba-b73e-e3dc78eff08a');


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."orders" ("order_number", "order_date", "customer_id", "order_status") VALUES
	('45a91280-07df-45a3-8d71-a9ffa772eee0', '2024-06-10 15:57:05.098571+00', 'a23376db-215d-49c4-9d9d-791c26579543', true);


--
-- Data for Name: seller_post; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."seller_post" ("id", "created_at", "title", "content", "user_id", "image_urls", "stripe_price_id", "stripe_product_id", "product_subject", "post_grade", "resource_urls", "resource_types", "listing_status") VALUES
	(1, '2024-03-05 15:38:02.509065+00', 'Test Post 1', '<p>This post is for testing provider images in the cart and also longer post content so here is some more content to see if the cards properly cut off after three lines like we expect? Is this working? Test Test Test TESt testing Test</p>', '84a298b6-9caf-4305-9bfe-3ea325df9188', NULL, 'price_1OtG6cBRZLMDvS4Ri22IpzGq', 'prod_PihVI0liGFkala', '{1,2,3}', '{1,2,3}', NULL, '{1,2,3}', true),
	(5, '2024-03-05 21:53:47.560102+00', 'Geography course', '<p>test</p>', '84a298b6-9caf-4305-9bfe-3ea325df9188', NULL, 'price_1OtFqrBRZLMDvS4RK5Ajf7na', 'prod_PihF0aDvvT4PeU', '{2,6,7}', '{1}', NULL, '{1,2,3}', true),
	(3, '2024-03-05 21:52:06.919336+00', 'Math course', '<p>test</p>', '84a298b6-9caf-4305-9bfe-3ea325df9188', NULL, 'price_1OtFmkBRZLMDvS4RJ8TNXGrH', 'prod_PihB8lq2HWY15J', '{3}', '{1}', NULL, '{1,2,3}', true),
	(2, '2024-03-05 15:40:05.243892+00', 'Test Post 2', '<p>test</p>', '84a298b6-9caf-4305-9bfe-3ea325df9188', NULL, 'price_1OtFjpBRZLMDvS4RPoOg78AS', 'prod_Pih8Qrjfpr0Zmo', '{1}', '{1}', NULL, '{1,2,3}', true),
	(7, '2024-03-27 14:25:37.137856+00', 'Test', '<p>This post is for testing provider images in the cart and also longer post content so here is some more content to see if the cards properly cut off after three lines like we expect? Is this working? Test Test Test TESt testing Test</p>', 'b78eab21-c34e-41ef-9a72-64ee49f4cbc0', NULL, 'price_1OyxQ5BRZLMDvS4RJ1oWeAIj', 'prod_PoabbRuN1tqxj0', '{7}', '{1}', NULL, '{1,2,3}', true),
	(10, '2024-03-27 15:49:08.243995+00', 'Testing testing', '<p>test</p>', 'b00f3d62-4eb1-40ba-b73e-e3dc78eff08a', NULL, 'price_1OyyiuBRZLMDvS4Rpb0hhUK3', 'prod_PobwysGlI4L0OK', '{5}', '{1}', NULL, '{1,2,3}', true),
	(11, '2024-03-27 15:50:36.102267+00', 'New Test', '<p>Test</p>', 'b00f3d62-4eb1-40ba-b73e-e3dc78eff08a', NULL, 'price_1OyykKBRZLMDvS4RC4SRSDLb', 'prod_PobyNSYyDLZArR', '{6}', '{1}', NULL, '{1,2,3}', true),
	(12, '2024-03-27 15:53:32.292584+00', 'Another test', '<p>test</p>', 'b00f3d62-4eb1-40ba-b73e-e3dc78eff08a', NULL, 'price_1OyynABRZLMDvS4RMi5Z83UK', 'prod_Poc1Kl6ObNXQ89', '{4}', '{1}', NULL, '{1,2,3}', true),
	(13, '2024-05-17 16:10:12.692569+00', 'Free Post Test', '<p>Test free post</p>', 'a23376db-215d-49c4-9d9d-791c26579543', NULL, 'price_1PMZvBBRZLMDvS4RcPyxuTRL', 'prod_QCzvzVmGr9GP84', '{3}', '{3}', NULL, '{1,2,3}', true),
	(6, '2024-03-05 21:54:44.695358+00', 'programming course ', '<p>test learn programming</p>', 'a23376db-215d-49c4-9d9d-791c26579543', NULL, 'price_1OtFmFBRZLMDvS4RsYXD3Q3C', 'prod_PihAqPK24WxqZp', '{3,4,5}', '{1,4,6}', NULL, '{1,2,3}', false),
	(14, '2024-06-10 16:10:12.7797+00', 'Test Pictures and delete post', '<p>test</p>', 'a23376db-215d-49c4-9d9d-791c26579543', '0.6757387375168475.png,0.7062042953347016.jpg', 'price_1PQAnRBRZLMDvS4R7blM6uKt', 'prod_QGiDMgeCYWe5FK', '{1,5,6}', '{3,8}', '76510cda-463e-4816-9aba-2bbbf00ed67c', '{3,4}', true),
	(15, '2024-06-10 20:55:07.011444+00', 'Testing post forrmation', '<ul>
<li>These</li>
<li>are</li>
<li>bullets</li>
<li>bullets are&nbsp;</li>
<li>awesome</li>
</ul>
<ol>
<li>This&nbsp;</li>
<li>is&nbsp;</li>
<li>a&nbsp;</li>
<li>numbered</li>
<li>list</li>
</ol>
<p>&nbsp;</p>
<p style="text-align: center;">this is some centered text</p>
<p style="text-align: center;">&nbsp;</p>
<h2 style="text-align: center;">This is a heading</h2>
<p>&nbsp;</p>
<blockquote>
<p>this is a quote</p>
</blockquote>', 'a23376db-215d-49c4-9d9d-791c26579543', NULL, 'price_1PQFF9BRZLMDvS4RfifKW4yg', 'prod_QGmoJMMH842iHa', '{3,4}', '{1}', 'c7b16552-cfd8-410e-91b1-6c452b980205', '{3}', true),
	(16, '2024-06-11 14:09:36.678264+00', 'Title', '<p>test</p>', 'a23376db-215d-49c4-9d9d-791c26579543', NULL, 'price_1PQVOHBRZLMDvS4RziERWKWU', 'prod_QH3VIvhFG0kltW', '{1}', '{1}', 'e9bd755b-6997-40fb-aa24-2148c78dde4b', '{3,4,5}', true);


--
-- Data for Name: order_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."order_details" ("order_number", "product_id", "quantity") VALUES
	('45a91280-07df-45a3-8d71-a9ffa772eee0', 6, 1);


--
-- Data for Name: post_subject; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."post_subject" ("id", "subject", "language") VALUES
	(1, 'Geography', 1),
	(2, 'History', 1),
	(3, 'Art & Music', 1),
	(4, 'Holiday', 1),
	(5, 'Math', 1),
	(6, 'Science', 1),
	(7, 'Social Studies', 1),
	(8, 'Specialty', 1);


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."profiles" ("created_at", "first_name", "last_name", "user_id", "email") VALUES
	('2024-03-20 15:28:45.055463+00', 'Test', 'test', 'df188225-8970-42a4-a54f-97b303c2b2ed', 'test5@test.com'),
	('2024-03-26 13:26:01.908789+00', 'Test', 'Test', 'bae9af94-3ee7-47dd-9389-181cd5906814', 'test@test.com'),
	('2024-03-26 13:43:25.957113+00', 'Test2', 'Test', 'ec946adf-7315-4721-a238-ed600dd153d7', 'test2@test.com'),
	('2024-03-27 14:23:24.262505+00', 'Test', 'test', 'b78eab21-c34e-41ef-9a72-64ee49f4cbc0', 'test6@test.com'),
	('2024-03-27 15:17:02.840813+00', 'TEST', 'test', 'b00f3d62-4eb1-40ba-b73e-e3dc78eff08a', 'test8@test.com'),
	('2024-03-27 15:58:08.787305+00', 'test', 'tes', 'f885208b-ef4a-4f75-8543-a808db576a13', 'test7@test.com'),
	('2024-03-27 16:09:26.205269+00', 'test', 'test', 'df10c4ca-2f2a-4ff1-b2c6-68a51ca94cf9', 'test10@test.com'),
	('2024-03-27 16:12:36.501596+00', 'test', 'test', '2ae7eb64-750a-42b9-8d8d-c8b9bf780092', 'test11@test.com'),
	('2024-03-27 16:18:49.069242+00', 'Test', 'Test', '111d3bed-1c92-4cf5-a66f-2ecaf3e717c3', 'test13@test.com'),
	('2024-03-19 18:42:48.238071+00', 'test', 'test', 'a23376db-215d-49c4-9d9d-791c26579543', 'test4@test.com');


--
-- Data for Name: resource_types; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: sellers; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."sellers" ("created_at", "seller_name", "user_id", "image_url", "seller_id", "language_spoken", "stripe_connected_account_id", "seller_about", "contribution") VALUES
	('2024-03-05 15:42:34.225911+00', 'German', '84a298b6-9caf-4305-9bfe-3ea325df9188', NULL, 3, NULL, 'acct_1Otw7FPdu3Mnre1j', NULL, 0),
	('2024-03-26 13:43:48.52652+00', 'Test2 Test', 'ec946adf-7315-4721-a238-ed600dd153d7', NULL, 5, NULL, 'acct_1OyaI4B1rj93e0iW', NULL, 0),
	('2024-03-26 21:49:40.736227+00', 'Test test', 'df188225-8970-42a4-a54f-97b303c2b2ed', NULL, 6, NULL, 'acct_1OyhsGBGXYM1FOiH', NULL, 0),
	('2024-03-27 14:23:47.653382+00', 'Test test', 'b78eab21-c34e-41ef-9a72-64ee49f4cbc0', NULL, 7, NULL, 'acct_1OyxOKB0i6JTeUGm', NULL, 0),
	('2024-03-27 15:18:06.611913+00', 'TEST test', 'b00f3d62-4eb1-40ba-b73e-e3dc78eff08a', NULL, 8, NULL, 'acct_1OyyEsBI0fpQ1wEW', NULL, 0),
	('2024-03-19 19:37:25.638743+00', 'test test', 'a23376db-215d-49c4-9d9d-791c26579543', NULL, 4, NULL, 'acct_1Ow8TSB0tPFjRwUY', '', 0);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."users" ("user_id", "created_at", "display_name", "image_url") VALUES
	('a23376db-215d-49c4-9d9d-791c26579543', '2024-03-05 15:37:01.129356+00', NULL, NULL),
	('df188225-8970-42a4-a54f-97b303c2b2ed', '2024-03-05 15:37:01.129356+00', NULL, NULL),
	('bae9af94-3ee7-47dd-9389-181cd5906814', '2024-03-05 15:37:01.129356+00', NULL, NULL),
	('ec946adf-7315-4721-a238-ed600dd153d7', '2024-03-05 15:37:01.129356+00', NULL, NULL),
	('b78eab21-c34e-41ef-9a72-64ee49f4cbc0', '2024-03-05 15:37:01.129356+00', NULL, NULL),
	('b00f3d62-4eb1-40ba-b73e-e3dc78eff08a', '2024-03-05 15:37:01.129356+00', NULL, NULL),
	('f885208b-ef4a-4f75-8543-a808db576a13', '2024-03-05 15:37:01.129356+00', NULL, NULL),
	('df10c4ca-2f2a-4ff1-b2c6-68a51ca94cf9', '2024-03-05 15:37:01.129356+00', NULL, NULL),
	('2ae7eb64-750a-42b9-8d8d-c8b9bf780092', '2024-03-05 15:37:01.129356+00', NULL, NULL),
	('111d3bed-1c92-4cf5-a66f-2ecaf3e717c3', '2024-03-05 15:37:01.129356+00', NULL, NULL);


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") VALUES
	('user.image', 'user.image', NULL, '2023-07-13 19:25:41.126949+00', '2023-07-13 19:25:41.126949+00', false, false, NULL, NULL, NULL),
	('post.image', 'post.image', NULL, '2023-08-01 19:11:48.793899+00', '2023-08-01 19:11:48.793899+00', false, false, NULL, NULL, NULL),
	('resources', 'resources', NULL, '2024-04-29 17:25:46.219535+00', '2024-04-29 17:25:46.219535+00', false, false, NULL, NULL, NULL);


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id") VALUES
	('3ae159a8-dbc0-48a3-bc9c-02e9820f8d5d', 'post.image', '0.6757387375168475.png', 'a23376db-215d-49c4-9d9d-791c26579543', '2024-06-10 16:09:31.580009+00', '2024-06-10 16:09:31.580009+00', '2024-06-10 16:09:31.580009+00', '{"eTag": "\"d59d861cdf9a730531a697c5d3cd94d9\"", "size": 224629, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-06-10T16:09:31.560Z", "contentLength": 224629, "httpStatusCode": 200}', '141dc018-8dd7-4a96-862a-5ee68001dedc', 'a23376db-215d-49c4-9d9d-791c26579543'),
	('0d5cd753-177b-4ca4-aa94-8a5b2d0d0462', 'post.image', '0.7062042953347016.jpg', 'a23376db-215d-49c4-9d9d-791c26579543', '2024-06-10 16:09:39.206047+00', '2024-06-10 16:09:39.206047+00', '2024-06-10 16:09:39.206047+00', '{"eTag": "\"ddef8ba810054e0defbaa9cc6c7965aa\"", "size": 123278, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2024-06-10T16:09:39.200Z", "contentLength": 123278, "httpStatusCode": 200}', '5a9e3997-c501-495d-a71f-10aa91761b22', 'a23376db-215d-49c4-9d9d-791c26579543'),
	('15effd65-a514-4a4b-a2e2-80dfc813db6a', 'resources', '76510cda-463e-4816-9aba-2bbbf00ed67c', 'a23376db-215d-49c4-9d9d-791c26579543', '2024-06-10 16:10:06.845057+00', '2024-06-10 16:10:06.845057+00', '2024-06-10 16:10:06.845057+00', '{"eTag": "\"28541f5ddd8f9fd184c22f08126bad2e\"", "size": 224053, "mimetype": "image/png", "cacheControl": "no-cache", "lastModified": "2024-06-10T16:10:06.800Z", "contentLength": 224053, "httpStatusCode": 200}', 'e8d28b87-1278-4279-a171-d94bb90efa9f', 'a23376db-215d-49c4-9d9d-791c26579543'),
	('fd541749-82f6-4c26-85c7-911b3273b85c', 'resources', 'c7b16552-cfd8-410e-91b1-6c452b980205', 'a23376db-215d-49c4-9d9d-791c26579543', '2024-06-10 20:55:04.618356+00', '2024-06-10 20:55:04.618356+00', '2024-06-10 20:55:04.618356+00', '{"eTag": "\"22e9866ebcfed980dbb671692203a1bf\"", "size": 496, "mimetype": "image/svg+xml", "cacheControl": "no-cache", "lastModified": "2024-06-10T20:55:04.609Z", "contentLength": 496, "httpStatusCode": 200}', '4596cd15-7f7b-49c7-88ba-d414dcb89611', 'a23376db-215d-49c4-9d9d-791c26579543'),
	('86fd9512-0244-4e4b-814b-02810a1d7624', 'resources', 'e9bd755b-6997-40fb-aa24-2148c78dde4b', 'a23376db-215d-49c4-9d9d-791c26579543', '2024-06-11 14:09:21.022699+00', '2024-06-11 14:09:21.022699+00', '2024-06-11 14:09:21.022699+00', '{"eTag": "\"d59d861cdf9a730531a697c5d3cd94d9\"", "size": 224629, "mimetype": "image/png", "cacheControl": "no-cache", "lastModified": "2024-06-11T14:09:21.002Z", "contentLength": 224629, "httpStatusCode": 200}', 'd430c1a4-4e6b-4394-bc36-934fceafc4d6', 'a23376db-215d-49c4-9d9d-791c26579543');


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 20, true);


--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: supabase_admin
--

SELECT pg_catalog.setval('"pgsodium"."key_key_id_seq"', 1, false);


--
-- Name: Country_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."Country_id_seq"', 1, true);


--
-- Name: Location_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."Location_id_seq"', 15, true);


--
-- Name: governing_district_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."governing_district_id_seq"', 1, false);


--
-- Name: grade_level_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."grade_level_id_seq"', 16, true);


--
-- Name: language_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."language_id_seq"', 1, true);


--
-- Name: major_municipality_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."major_municipality_id_seq"', 51, true);


--
-- Name: minor_municipality_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."minor_municipality_id_seq"', 1, false);


--
-- Name: post_subject_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."post_subject_id_seq"', 8, true);


--
-- Name: resource_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."resource_types_id_seq"', 6, true);


--
-- Name: seller_post_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."seller_post_id_seq"', 16, true);


--
-- Name: sellers_seller_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."sellers_seller_id_seq"', 8, true);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, true);


--
-- PostgreSQL database dump complete
--

RESET ALL;
