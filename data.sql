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

COPY "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") FROM stdin;
00000000-0000-0000-0000-000000000000	e193cb5e-8624-4766-ab6b-51b8795995d2	{"action":"login","actor_id":"a23376db-215d-49c4-9d9d-791c26579543","actor_username":"test4@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2024-05-30 18:49:56.032438+00	
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."flow_state" ("id", "user_id", "auth_code", "code_challenge_method", "code_challenge", "provider_type", "provider_access_token", "provider_refresh_token", "created_at", "updated_at", "authentication_method", "auth_code_issued_at") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") FROM stdin;
00000000-0000-0000-0000-000000000000	84a298b6-9caf-4305-9bfe-3ea325df9188	authenticated	authenticated	germanzarkovich@gmail.com	$2a$10$zDwI4WhdTYEEClfJm1VxVuhbXO.D8//bpMVwgV.dlYG.VujvRpi3q	2024-03-05 15:35:23.695951+00	\N		\N		\N			\N	\N	{"provider": "email", "providers": ["email"]}	{}	\N	2024-03-05 15:35:23.693491+00	2024-03-05 15:35:23.696028+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	1caa66a7-d9a2-462f-93c4-e65946d61c02	authenticated	authenticated	someone@email.com	$2a$10$qQA4UXgQC42VEL7Jj0BMI.lSolPCyHTQA0dy0209AT9/DTDoQ8./O	2024-03-05 16:20:21.660728+00	\N		\N		\N			\N	2024-03-05 16:20:21.673034+00	{"provider": "email", "providers": ["email"]}	{}	\N	2024-03-05 16:20:21.658888+00	2024-03-05 16:20:21.673672+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	bae9af94-3ee7-47dd-9389-181cd5906814	authenticated	authenticated	test@test.com	$2a$10$v1Rtv0uewR20qe0sxcmdGuhbIzqqIeRA0RU1UFXnakRTPONEt8Vjq	2024-03-26 13:26:01.837792+00	\N		\N		\N			\N	2024-03-26 13:26:01.841642+00	{"provider": "email", "providers": ["email"]}	{"last_name": "Test", "first_name": "Test"}	\N	2024-03-26 13:26:01.826478+00	2024-03-26 19:29:25.886671+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	df10c4ca-2f2a-4ff1-b2c6-68a51ca94cf9	authenticated	authenticated	test10@test.com	$2a$10$57DpbJB6eJ0TwKwpV7xR3.pB2CO2rzh2U4U7gLbelm3Pu9F7FlbsO	2024-03-27 16:09:26.189581+00	\N		\N		\N			\N	2024-03-27 16:09:26.190696+00	{"provider": "email", "providers": ["email"]}	{"last_name": "test", "first_name": "test"}	\N	2024-03-27 16:09:26.186335+00	2024-03-27 16:09:26.192962+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	df188225-8970-42a4-a54f-97b303c2b2ed	authenticated	authenticated	test5@test.com	$2a$10$0y/mcUrcfjUWWy/.jwc3HOoNYFJdydypaDykaLCzxYrPXOrGF65Hi	2024-03-20 15:28:45.002582+00	\N		\N		\N			\N	2024-03-20 15:28:45.005413+00	{"provider": "email", "providers": ["email"]}	{"last_name": "test", "first_name": "Test"}	\N	2024-03-20 15:28:44.990631+00	2024-03-27 13:14:30.947697+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	111d3bed-1c92-4cf5-a66f-2ecaf3e717c3	authenticated	authenticated	test13@test.com	$2a$10$HC.RmWBBeeD1Ay4YwGJnQ.O8qkBVqgfffmzc8JQgMRV9eV.M2eCTS	2024-03-27 16:18:49.041032+00	\N		\N		\N			\N	2024-03-27 16:18:49.044415+00	{"provider": "email", "providers": ["email"]}	{"last_name": "Test", "first_name": "Test"}	\N	2024-03-27 16:18:49.035351+00	2024-03-27 18:53:13.107192+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	b78eab21-c34e-41ef-9a72-64ee49f4cbc0	authenticated	authenticated	test6@test.com	$2a$10$upU6bJwUd0aXUifcbc.dauT/ak2wLw1dPHva/l7HmYZKhlRnz7a7S	2024-03-27 14:23:24.235522+00	\N		\N		\N			\N	2024-03-27 14:23:24.23826+00	{"provider": "email", "providers": ["email"]}	{"last_name": "test", "first_name": "Test"}	\N	2024-03-27 14:23:24.226145+00	2024-03-27 14:23:24.241546+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	ec946adf-7315-4721-a238-ed600dd153d7	authenticated	authenticated	test2@test.com	$2a$10$Bg3uVVpxeilQRtTim1/OCuWYqGhu1fhl2B5uSgLIo.K/t4F/XugQS	2024-03-26 13:43:25.939314+00	\N		\N		\N			\N	2024-03-26 13:43:25.940954+00	{"provider": "email", "providers": ["email"]}	{"last_name": "Test", "first_name": "Test2"}	\N	2024-03-26 13:43:25.93158+00	2024-03-26 16:38:24.704182+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	b00f3d62-4eb1-40ba-b73e-e3dc78eff08a	authenticated	authenticated	test8@test.com	$2a$10$/Cs2ysAPlBv5DOa9eNUo7uJAtC7rp57Lz5XTJ1eXmWJ6P9hbzWdN.	2024-03-27 15:17:02.810911+00	\N		\N		\N			\N	2024-03-27 15:17:02.813624+00	{"provider": "email", "providers": ["email"]}	{"last_name": "test", "first_name": "TEST"}	\N	2024-03-27 15:17:02.803115+00	2024-03-27 19:04:24.849828+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	2ae7eb64-750a-42b9-8d8d-c8b9bf780092	authenticated	authenticated	test11@test.com	$2a$10$MPDSSQJyE4mIKl1kUvgrx.xdlM0qaO9PmLOE3/mKwqTbg/Tr6AsIm	2024-03-27 16:12:36.47631+00	\N		\N		\N			\N	2024-03-27 16:12:36.479218+00	{"provider": "email", "providers": ["email"]}	{"last_name": "test", "first_name": "test"}	\N	2024-03-27 16:12:36.471934+00	2024-03-27 16:12:36.481996+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	f885208b-ef4a-4f75-8543-a808db576a13	authenticated	authenticated	test7@test.com	$2a$10$Xb00Z4wZuelapLp85KCfBOWExlPs8fzFwYhQ2vOKyZglHg6IQ5q3i	2024-03-27 15:58:08.759078+00	\N		\N		\N			\N	2024-03-27 15:58:08.76109+00	{"provider": "email", "providers": ["email"]}	{"last_name": "tes", "first_name": "test"}	\N	2024-03-27 15:58:08.75323+00	2024-03-27 15:58:08.764263+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	a23376db-215d-49c4-9d9d-791c26579543	authenticated	authenticated	test4@test.com	$2a$10$kb28zFsgV7Ff2KLr19LZ/.W3iEM.GssnZ5hPZf2I8YoQ1303cHOAm	2024-03-19 18:42:48.187063+00	\N		\N		\N			\N	2024-05-30 18:49:56.033009+00	{"provider": "email", "providers": ["email"]}	{"last_name": "test", "first_name": "test"}	\N	2024-03-19 18:42:48.175446+00	2024-05-30 18:49:56.034188+00	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") FROM stdin;
84a298b6-9caf-4305-9bfe-3ea325df9188	84a298b6-9caf-4305-9bfe-3ea325df9188	{"sub": "84a298b6-9caf-4305-9bfe-3ea325df9188", "email": "germanzarkovich@gmail.com", "email_verified": false, "phone_verified": false}	email	2024-03-05 15:35:23.694546+00	2024-03-05 15:35:23.694566+00	2024-03-05 15:35:23.694566+00	90e98ab8-ce45-4579-bb03-41d5c42a8e72
1caa66a7-d9a2-462f-93c4-e65946d61c02	1caa66a7-d9a2-462f-93c4-e65946d61c02	{"sub": "1caa66a7-d9a2-462f-93c4-e65946d61c02", "email": "someone@email.com", "email_verified": false, "phone_verified": false}	email	2024-03-05 16:20:21.660274+00	2024-03-05 16:20:21.660292+00	2024-03-05 16:20:21.660292+00	d75943f8-4ef2-4690-95af-d2e9cda392db
a23376db-215d-49c4-9d9d-791c26579543	a23376db-215d-49c4-9d9d-791c26579543	{"sub": "a23376db-215d-49c4-9d9d-791c26579543", "email": "test4@test.com", "email_verified": false, "phone_verified": false}	email	2024-03-19 18:42:48.184286+00	2024-03-19 18:42:48.184314+00	2024-03-19 18:42:48.184314+00	3a7e7e73-99a6-4988-8399-283ad3fffdb6
df188225-8970-42a4-a54f-97b303c2b2ed	df188225-8970-42a4-a54f-97b303c2b2ed	{"sub": "df188225-8970-42a4-a54f-97b303c2b2ed", "email": "test5@test.com", "email_verified": false, "phone_verified": false}	email	2024-03-20 15:28:44.999614+00	2024-03-20 15:28:44.999638+00	2024-03-20 15:28:44.999638+00	33bb9f73-e7b4-4ad7-941c-3e6121631ce5
bae9af94-3ee7-47dd-9389-181cd5906814	bae9af94-3ee7-47dd-9389-181cd5906814	{"sub": "bae9af94-3ee7-47dd-9389-181cd5906814", "email": "test@test.com", "email_verified": false, "phone_verified": false}	email	2024-03-26 13:26:01.834401+00	2024-03-26 13:26:01.83444+00	2024-03-26 13:26:01.83444+00	8412cd73-8bb5-4756-8710-a8195c11dfb8
ec946adf-7315-4721-a238-ed600dd153d7	ec946adf-7315-4721-a238-ed600dd153d7	{"sub": "ec946adf-7315-4721-a238-ed600dd153d7", "email": "test2@test.com", "email_verified": false, "phone_verified": false}	email	2024-03-26 13:43:25.937675+00	2024-03-26 13:43:25.937728+00	2024-03-26 13:43:25.937728+00	0e37cf84-44fc-44cf-9838-596070485990
b78eab21-c34e-41ef-9a72-64ee49f4cbc0	b78eab21-c34e-41ef-9a72-64ee49f4cbc0	{"sub": "b78eab21-c34e-41ef-9a72-64ee49f4cbc0", "email": "test6@test.com", "email_verified": false, "phone_verified": false}	email	2024-03-27 14:23:24.23297+00	2024-03-27 14:23:24.232995+00	2024-03-27 14:23:24.232995+00	3e08e025-1a44-41ca-a5bc-975180ec4057
b00f3d62-4eb1-40ba-b73e-e3dc78eff08a	b00f3d62-4eb1-40ba-b73e-e3dc78eff08a	{"sub": "b00f3d62-4eb1-40ba-b73e-e3dc78eff08a", "email": "test8@test.com", "email_verified": false, "phone_verified": false}	email	2024-03-27 15:17:02.80911+00	2024-03-27 15:17:02.809144+00	2024-03-27 15:17:02.809144+00	d41041c4-0470-4270-8c04-ee10836a6e49
f885208b-ef4a-4f75-8543-a808db576a13	f885208b-ef4a-4f75-8543-a808db576a13	{"sub": "f885208b-ef4a-4f75-8543-a808db576a13", "email": "test7@test.com", "email_verified": false, "phone_verified": false}	email	2024-03-27 15:58:08.757066+00	2024-03-27 15:58:08.757096+00	2024-03-27 15:58:08.757096+00	84ba1abd-1c76-42cb-abcb-8e9afff3a20c
df10c4ca-2f2a-4ff1-b2c6-68a51ca94cf9	df10c4ca-2f2a-4ff1-b2c6-68a51ca94cf9	{"sub": "df10c4ca-2f2a-4ff1-b2c6-68a51ca94cf9", "email": "test10@test.com", "email_verified": false, "phone_verified": false}	email	2024-03-27 16:09:26.188502+00	2024-03-27 16:09:26.188531+00	2024-03-27 16:09:26.188531+00	c136d41b-9029-44b5-9557-d31f5f86a8df
2ae7eb64-750a-42b9-8d8d-c8b9bf780092	2ae7eb64-750a-42b9-8d8d-c8b9bf780092	{"sub": "2ae7eb64-750a-42b9-8d8d-c8b9bf780092", "email": "test11@test.com", "email_verified": false, "phone_verified": false}	email	2024-03-27 16:12:36.474881+00	2024-03-27 16:12:36.474909+00	2024-03-27 16:12:36.474909+00	88238b38-8322-4188-b1f8-6bdb1be24b9d
111d3bed-1c92-4cf5-a66f-2ecaf3e717c3	111d3bed-1c92-4cf5-a66f-2ecaf3e717c3	{"sub": "111d3bed-1c92-4cf5-a66f-2ecaf3e717c3", "email": "test13@test.com", "email_verified": false, "phone_verified": false}	email	2024-03-27 16:18:49.039164+00	2024-03-27 16:18:49.039197+00	2024-03-27 16:18:49.039197+00	dfe86529-b020-4a4f-97ec-80ecf5e18de6
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."instances" ("id", "uuid", "raw_base_config", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") FROM stdin;
bbcd024c-ced7-4a5e-a835-585973a170da	1caa66a7-d9a2-462f-93c4-e65946d61c02	2024-03-05 16:20:21.673063+00	2024-03-05 16:20:21.673063+00	\N	aal1	\N	\N	curl/7.81.0	172.18.0.1	\N
4c03eedf-a936-4315-9497-3daa7549d826	df188225-8970-42a4-a54f-97b303c2b2ed	2024-03-20 15:28:45.005467+00	2024-03-27 13:14:30.948873+00	\N	aal1	\N	2024-03-27 13:14:30.94881	node	192.168.65.1	\N
2971c683-db98-4085-91da-1faf2ddb71e4	f885208b-ef4a-4f75-8543-a808db576a13	2024-03-27 15:58:08.761141+00	2024-03-27 15:58:08.761141+00	\N	aal1	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36	192.168.65.1	\N
d90cdfff-94c8-4a3e-9c28-80d064839cda	df10c4ca-2f2a-4ff1-b2c6-68a51ca94cf9	2024-03-27 16:09:26.190736+00	2024-03-27 16:09:26.190736+00	\N	aal1	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15	192.168.65.1	\N
b7eed9b9-6a5a-4caf-a9cc-d909c86e8ce4	2ae7eb64-750a-42b9-8d8d-c8b9bf780092	2024-03-27 16:12:36.479266+00	2024-03-27 16:12:36.479266+00	\N	aal1	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36	192.168.65.1	\N
b9b588e8-7f7f-4f13-816c-68aab85cfef2	111d3bed-1c92-4cf5-a66f-2ecaf3e717c3	2024-03-27 16:18:49.044478+00	2024-03-27 18:53:13.108184+00	\N	aal1	\N	2024-03-27 18:53:13.108131	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15	192.168.65.1	\N
0a2c73ca-752a-45a0-9d65-494dac44c1fa	ec946adf-7315-4721-a238-ed600dd153d7	2024-03-26 13:43:25.941006+00	2024-03-26 16:38:24.705762+00	\N	aal1	\N	2024-03-26 16:38:24.705687	node	192.168.65.1	\N
6a8baafa-3de0-45e5-bf3b-b3e6f162b202	b00f3d62-4eb1-40ba-b73e-e3dc78eff08a	2024-03-27 15:17:02.81368+00	2024-03-27 19:04:24.851184+00	\N	aal1	\N	2024-03-27 19:04:24.851089	node	192.168.65.1	\N
0b849222-0486-42b0-b78f-19f8f28d0462	bae9af94-3ee7-47dd-9389-181cd5906814	2024-03-26 13:26:01.84171+00	2024-03-26 19:29:25.891851+00	\N	aal1	\N	2024-03-26 19:29:25.891756	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36	192.168.65.1	\N
989db7c9-0d5f-4c66-a6c6-c350d0b62d93	a23376db-215d-49c4-9d9d-791c26579543	2024-03-19 18:42:48.188973+00	2024-03-20 14:01:58.315995+00	\N	aal1	\N	2024-03-20 14:01:58.314276	node	192.168.65.1	\N
a6d127e9-be45-4ab8-a73e-235e7a5de31a	a23376db-215d-49c4-9d9d-791c26579543	2024-05-30 18:49:56.033032+00	2024-05-30 18:49:56.033032+00	\N	aal1	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36	172.19.0.1	\N
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") FROM stdin;
bbcd024c-ced7-4a5e-a835-585973a170da	2024-03-05 16:20:21.67379+00	2024-03-05 16:20:21.67379+00	password	a0f28147-3610-4695-b4c2-defb7fe28862
989db7c9-0d5f-4c66-a6c6-c350d0b62d93	2024-03-19 18:42:48.191624+00	2024-03-19 18:42:48.191624+00	password	82f16c2a-f041-4adc-999b-151fc389cf7a
4c03eedf-a936-4315-9497-3daa7549d826	2024-03-20 15:28:45.010246+00	2024-03-20 15:28:45.010246+00	password	2b1ef24f-f170-418b-852d-446ea4b3c503
0b849222-0486-42b0-b78f-19f8f28d0462	2024-03-26 13:26:01.845716+00	2024-03-26 13:26:01.845716+00	password	27b95ef5-7f0b-4bda-bd39-9d16ca78132d
0a2c73ca-752a-45a0-9d65-494dac44c1fa	2024-03-26 13:43:25.943737+00	2024-03-26 13:43:25.943737+00	password	fc97791e-6a3b-49d1-b9cc-71d28e1c73c8
6a8baafa-3de0-45e5-bf3b-b3e6f162b202	2024-03-27 15:17:02.816835+00	2024-03-27 15:17:02.816835+00	password	a99e3c1b-a3f7-4acc-936f-baa5a7d0bd79
2971c683-db98-4085-91da-1faf2ddb71e4	2024-03-27 15:58:08.76447+00	2024-03-27 15:58:08.76447+00	password	f6def15b-193d-40ee-b9c7-f737b38f1e7d
d90cdfff-94c8-4a3e-9c28-80d064839cda	2024-03-27 16:09:26.193147+00	2024-03-27 16:09:26.193147+00	password	fc3cca4a-d1cc-432a-b7b8-05c932061cf2
b7eed9b9-6a5a-4caf-a9cc-d909c86e8ce4	2024-03-27 16:12:36.482194+00	2024-03-27 16:12:36.482194+00	password	e0727084-36dd-48cf-9b66-ed0e4ee03c42
b9b588e8-7f7f-4f13-816c-68aab85cfef2	2024-03-27 16:18:49.047205+00	2024-03-27 16:18:49.047205+00	password	6b4f835c-6e52-41d7-90fd-761fcecc2fed
a6d127e9-be45-4ab8-a73e-235e7a5de31a	2024-05-30 18:49:56.034475+00	2024-05-30 18:49:56.034475+00	password	d3032f9b-44f9-40c3-89ce-473ac66b1cee
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_factors" ("id", "user_id", "friendly_name", "factor_type", "status", "created_at", "updated_at", "secret") FROM stdin;
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_challenges" ("id", "factor_id", "created_at", "verified_at", "ip_address") FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") FROM stdin;
00000000-0000-0000-0000-000000000000	5	XQHtbosave7lsbOO6yPeyQ	a23376db-215d-49c4-9d9d-791c26579543	f	2024-05-30 18:49:56.033568+00	2024-05-30 18:49:56.033568+00	\N	a6d127e9-be45-4ab8-a73e-235e7a5de31a
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."sso_providers" ("id", "resource_id", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."saml_providers" ("id", "sso_provider_id", "entity_id", "metadata_xml", "metadata_url", "attribute_mapping", "created_at", "updated_at", "name_id_format") FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."saml_relay_states" ("id", "sso_provider_id", "request_id", "for_email", "redirect_to", "created_at", "updated_at", "flow_state_id") FROM stdin;
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."sso_domains" ("id", "sso_provider_id", "domain", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: key; Type: TABLE DATA; Schema: pgsodium; Owner: supabase_admin
--

COPY "pgsodium"."key" ("id", "status", "created", "expires", "key_type", "key_id", "key_context", "name", "associated_data", "raw_key", "raw_key_nonce", "parent_key", "comment", "user_data") FROM stdin;
\.


--
-- Data for Name: clients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."clients" ("user_id", "created_at", "client_phone", "display_name", "image_url") FROM stdin;
a23376db-215d-49c4-9d9d-791c26579543	2024-03-05 15:37:01.129356+00	\N	\N	\N
df188225-8970-42a4-a54f-97b303c2b2ed	2024-03-05 15:37:01.129356+00	\N	\N	\N
bae9af94-3ee7-47dd-9389-181cd5906814	2024-03-05 15:37:01.129356+00	\N	\N	\N
ec946adf-7315-4721-a238-ed600dd153d7	2024-03-05 15:37:01.129356+00	\N	\N	\N
b78eab21-c34e-41ef-9a72-64ee49f4cbc0	2024-03-05 15:37:01.129356+00	\N	\N	\N
b00f3d62-4eb1-40ba-b73e-e3dc78eff08a	2024-03-05 15:37:01.129356+00	\N	\N	\N
f885208b-ef4a-4f75-8543-a808db576a13	2024-03-05 15:37:01.129356+00	\N	\N	\N
df10c4ca-2f2a-4ff1-b2c6-68a51ca94cf9	2024-03-05 15:37:01.129356+00	\N	\N	\N
2ae7eb64-750a-42b9-8d8d-c8b9bf780092	2024-03-05 15:37:01.129356+00	\N	\N	\N
111d3bed-1c92-4cf5-a66f-2ecaf3e717c3	2024-03-05 15:37:01.129356+00	\N	\N	\N
\.


--
-- Data for Name: country; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."country" ("id", "created_at", "country") FROM stdin;
1	2023-07-07 14:18:29.85077+00	United States
\.


--
-- Data for Name: major_municipality; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."major_municipality" ("id", "created_at", "major_municipality", "country") FROM stdin;
1	2024-03-05 10:22:01.74855+00	Alabama	1
2	2024-03-05 10:22:01.74855+00	Alaska	1
3	2024-03-05 10:22:01.74855+00	Arizona	1
4	2024-03-05 10:22:01.74855+00	Arkansas	1
5	2024-03-05 10:22:01.74855+00	California	1
6	2024-03-05 10:22:01.74855+00	Colorado	1
7	2024-03-05 10:22:01.74855+00	Connecticut	1
8	2024-03-05 10:22:01.74855+00	Delaware	1
9	2024-03-05 10:22:01.74855+00	Florida	1
10	2024-03-05 10:22:01.74855+00	Georgia	1
11	2024-03-05 10:22:01.74855+00	Hawaii	1
12	2024-03-05 10:22:01.74855+00	Idaho	1
13	2024-03-05 10:22:01.74855+00	Illinois	1
14	2024-03-05 10:22:01.74855+00	Indiana	1
15	2024-03-05 10:22:01.74855+00	Iowa	1
16	2024-03-05 10:22:01.74855+00	Kansas	1
17	2024-03-05 10:22:01.74855+00	Kentucky	1
18	2024-03-05 10:22:01.74855+00	Louisiana	1
19	2024-03-05 10:22:01.74855+00	Maine	1
20	2024-03-05 10:22:01.74855+00	Maryland	1
21	2024-03-05 10:22:01.74855+00	Massachusetts	1
22	2024-03-05 10:22:01.74855+00	Michigan	1
23	2024-03-05 10:22:01.74855+00	Minnesota	1
24	2024-03-05 10:22:01.74855+00	Mississippi	1
25	2024-03-05 10:22:01.74855+00	Missouri	1
26	2024-03-05 10:22:01.74855+00	Montana	1
27	2024-03-05 10:22:01.74855+00	Nebraska	1
28	2024-03-05 10:22:01.74855+00	Nevada	1
29	2024-03-05 10:22:01.74855+00	New Hampshire	1
30	2024-03-05 10:22:01.74855+00	New Jersey	1
31	2024-03-05 10:22:01.74855+00	New Mexico	1
32	2024-03-05 10:22:01.74855+00	New York	1
33	2024-03-05 10:22:01.74855+00	North Carolina	1
34	2024-03-05 10:22:01.74855+00	North Dakota	1
35	2024-03-05 10:22:01.74855+00	Ohio	1
36	2024-03-05 10:22:01.74855+00	Oklahoma	1
37	2024-03-05 10:22:01.74855+00	Oregon	1
38	2024-03-05 10:22:01.74855+00	Pennsylvania	1
39	2024-03-05 10:22:01.74855+00	Rhode Island	1
40	2024-03-05 10:22:01.74855+00	South Carolina	1
41	2024-03-05 10:22:01.74855+00	South Dakota	1
42	2024-03-05 10:22:01.74855+00	Tennessee	1
43	2024-03-05 10:22:01.74855+00	Texas	1
44	2024-03-05 10:22:01.74855+00	Utah	1
45	2024-03-05 10:22:01.74855+00	Vermont	1
46	2024-03-05 10:22:01.74855+00	Virginia	1
47	2024-03-05 10:22:01.74855+00	Washington	1
48	2024-03-05 10:22:01.74855+00	West Virginia	1
49	2024-03-05 10:22:01.74855+00	Wisconsin	1
50	2024-03-05 10:22:01.74855+00	Wyoming	1
51	2024-03-05 10:22:01.74855+00	Other	1
\.


--
-- Data for Name: minor_municipality; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."minor_municipality" ("id", "created_at", "minor_municipality", "major_municipality") FROM stdin;
\.


--
-- Data for Name: governing_district; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."governing_district" ("id", "created_at", "governing_district", "minor_municipality") FROM stdin;
\.


--
-- Data for Name: grade_level; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."grade_level" ("id", "grade") FROM stdin;
1	PreK
2	K
3	1st
4	2nd
5	3rd
6	4th
7	5th
8	6th
9	7th
10	8th
11	9th
12	10th
13	11th
14	12th
15	College
16	Adult
\.


--
-- Data for Name: language; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."language" ("id", "language") FROM stdin;
1	English (American)
\.


--
-- Data for Name: location; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."location" ("id", "created_at", "street_number", "street_number_suffix", "street_name", "street_type", "street_direction", "address_type", "address_type_identifier", "minor_municipality", "major_municipality", "governing_district", "postal_area", "country", "user_id") FROM stdin;
1	2024-03-05 15:36:33.909601+00	1		Little Hill 	\N	\N	\N	\N	\N	\N	\N	\N	1	84a298b6-9caf-4305-9bfe-3ea325df9188
2	2024-03-19 19:37:25.616992+00	\N	\N	\N	\N	\N	\N	\N	\N	3	\N	\N	1	a23376db-215d-49c4-9d9d-791c26579543
3	2024-03-26 13:43:48.513815+00	\N	\N	\N	\N	\N	\N	\N	\N	3	\N	\N	1	ec946adf-7315-4721-a238-ed600dd153d7
4	2024-03-26 21:49:40.716283+00	\N	\N	\N	\N	\N	\N	\N	\N	5	\N	\N	1	df188225-8970-42a4-a54f-97b303c2b2ed
5	2024-03-27 14:23:47.644818+00	\N	\N	\N	\N	\N	\N	\N	\N	13	\N	\N	1	b78eab21-c34e-41ef-9a72-64ee49f4cbc0
6	2024-03-27 14:25:37.124905+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	b78eab21-c34e-41ef-9a72-64ee49f4cbc0
7	2024-03-27 15:00:50.919938+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	b78eab21-c34e-41ef-9a72-64ee49f4cbc0
8	2024-03-27 15:05:24.256555+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	b78eab21-c34e-41ef-9a72-64ee49f4cbc0
9	2024-03-27 15:18:06.596304+00	\N	\N	\N	\N	\N	\N	\N	\N	7	\N	\N	1	b00f3d62-4eb1-40ba-b73e-e3dc78eff08a
10	2024-03-27 15:18:49.51043+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	b00f3d62-4eb1-40ba-b73e-e3dc78eff08a
11	2024-03-27 15:49:08.232158+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	b00f3d62-4eb1-40ba-b73e-e3dc78eff08a
12	2024-03-27 15:50:36.084493+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	b00f3d62-4eb1-40ba-b73e-e3dc78eff08a
13	2024-03-27 15:53:32.278633+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	b00f3d62-4eb1-40ba-b73e-e3dc78eff08a
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."orders" ("order_number", "order_date", "customer_id", "order_status") FROM stdin;
\.


--
-- Data for Name: seller_post; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."seller_post" ("id", "created_at", "title", "content", "user_id", "image_urls", "stripe_price_id", "stripe_product_id", "product_subject", "post_grade", "resource_urls", "resource_types") FROM stdin;
1	2024-03-05 15:38:02.509065+00	Test Post 1	<p>This post is for testing provider images in the cart and also longer post content so here is some more content to see if the cards properly cut off after three lines like we expect? Is this working? Test Test Test TESt testing Test</p>	84a298b6-9caf-4305-9bfe-3ea325df9188	\N	price_1OtG6cBRZLMDvS4Ri22IpzGq	prod_PihVI0liGFkala	{1,2,3}	{1,2,3}	\N	\N
5	2024-03-05 21:53:47.560102+00	Geography course	<p>test</p>	84a298b6-9caf-4305-9bfe-3ea325df9188	\N	price_1OtFqrBRZLMDvS4RK5Ajf7na	prod_PihF0aDvvT4PeU	{2,6,7}	{1}	\N	\N
3	2024-03-05 21:52:06.919336+00	Math course	<p>test</p>	84a298b6-9caf-4305-9bfe-3ea325df9188	\N	price_1OtFmkBRZLMDvS4RJ8TNXGrH	prod_PihB8lq2HWY15J	{3}	{1}	\N	\N
2	2024-03-05 15:40:05.243892+00	Test Post 2	<p>test</p>	84a298b6-9caf-4305-9bfe-3ea325df9188	\N	price_1OtFjpBRZLMDvS4RPoOg78AS	prod_Pih8Qrjfpr0Zmo	{1}	{1}	\N	\N
6	2024-03-05 21:54:44.695358+00	programming course 	<p>test learn programming</p>	a23376db-215d-49c4-9d9d-791c26579543	\N	price_1OtFmFBRZLMDvS4RsYXD3Q3C	prod_PihAqPK24WxqZp	{3,4,5}	{1,4,6}	\N	\N
7	2024-03-27 14:25:37.137856+00	Test	<p>This post is for testing provider images in the cart and also longer post content so here is some more content to see if the cards properly cut off after three lines like we expect? Is this working? Test Test Test TESt testing Test</p>	b78eab21-c34e-41ef-9a72-64ee49f4cbc0	\N	price_1OyxQ5BRZLMDvS4RJ1oWeAIj	prod_PoabbRuN1tqxj0	{7}	{1}	\N	\N
10	2024-03-27 15:49:08.243995+00	Testing testing	<p>test</p>	b00f3d62-4eb1-40ba-b73e-e3dc78eff08a	\N	price_1OyyiuBRZLMDvS4Rpb0hhUK3	prod_PobwysGlI4L0OK	{5}	{1}	\N	\N
11	2024-03-27 15:50:36.102267+00	New Test	<p>Test</p>	b00f3d62-4eb1-40ba-b73e-e3dc78eff08a	\N	price_1OyykKBRZLMDvS4RC4SRSDLb	prod_PobyNSYyDLZArR	{6}	{1}	\N	\N
12	2024-03-27 15:53:32.292584+00	Another test	<p>test</p>	b00f3d62-4eb1-40ba-b73e-e3dc78eff08a	\N	price_1OyynABRZLMDvS4RMi5Z83UK	prod_Poc1Kl6ObNXQ89	{4}	{1}	\N	\N
13	2024-05-17 16:10:12.692569+00	Free Post Test	<p>Test free post</p>	a23376db-215d-49c4-9d9d-791c26579543	\N	\N	\N	{3}	{3}	\N	\N
\.


--
-- Data for Name: order_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."order_details" ("order_number", "product_id", "quantity") FROM stdin;
\.


--
-- Data for Name: post_subject; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."post_subject" ("id", "subject", "language") FROM stdin;
1	Geography	1
2	History	1
3	Art & Music	1
4	Holiday	1
5	Math	1
6	Science	1
7	Social Studies	1
8	Specialty	1
\.


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."profiles" ("created_at", "first_name", "last_name", "user_id", "email") FROM stdin;
2024-03-19 18:42:48.238071+00	test	test	a23376db-215d-49c4-9d9d-791c26579543	test4@test.com
2024-03-20 15:28:45.055463+00	Test	test	df188225-8970-42a4-a54f-97b303c2b2ed	test5@test.com
2024-03-26 13:26:01.908789+00	Test	Test	bae9af94-3ee7-47dd-9389-181cd5906814	test@test.com
2024-03-26 13:43:25.957113+00	Test2	Test	ec946adf-7315-4721-a238-ed600dd153d7	test2@test.com
2024-03-27 14:23:24.262505+00	Test	test	b78eab21-c34e-41ef-9a72-64ee49f4cbc0	test6@test.com
2024-03-27 15:17:02.840813+00	TEST	test	b00f3d62-4eb1-40ba-b73e-e3dc78eff08a	test8@test.com
2024-03-27 15:58:08.787305+00	test	tes	f885208b-ef4a-4f75-8543-a808db576a13	test7@test.com
2024-03-27 16:09:26.205269+00	test	test	df10c4ca-2f2a-4ff1-b2c6-68a51ca94cf9	test10@test.com
2024-03-27 16:12:36.501596+00	test	test	2ae7eb64-750a-42b9-8d8d-c8b9bf780092	test11@test.com
2024-03-27 16:18:49.069242+00	Test	Test	111d3bed-1c92-4cf5-a66f-2ecaf3e717c3	test13@test.com
\.


--
-- Data for Name: resource_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."resource_types" ("id", "type") FROM stdin;
1	PDF
3	ZIP File
4	Whiteboard
5	Image
6	Google Apps
2	Word
\.


--
-- Data for Name: sellers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."sellers" ("created_at", "seller_name", "user_id", "image_url", "seller_id", "language_spoken", "stripe_connected_account_id", "seller_about", "contribution") FROM stdin;
2024-03-05 15:42:34.225911+00	German	84a298b6-9caf-4305-9bfe-3ea325df9188	\N	3	\N	acct_1Otw7FPdu3Mnre1j	\N	0
2024-03-19 19:37:25.638743+00	test test	a23376db-215d-49c4-9d9d-791c26579543	\N	4	\N	acct_1Ow8TSB0tPFjRwUY	\N	0
2024-03-26 13:43:48.52652+00	Test2 Test	ec946adf-7315-4721-a238-ed600dd153d7	\N	5	\N	acct_1OyaI4B1rj93e0iW	\N	0
2024-03-26 21:49:40.736227+00	Test test	df188225-8970-42a4-a54f-97b303c2b2ed	\N	6	\N	acct_1OyhsGBGXYM1FOiH	\N	0
2024-03-27 14:23:47.653382+00	Test test	b78eab21-c34e-41ef-9a72-64ee49f4cbc0	\N	7	\N	acct_1OyxOKB0i6JTeUGm	\N	0
2024-03-27 15:18:06.611913+00	TEST test	b00f3d62-4eb1-40ba-b73e-e3dc78eff08a	\N	8	\N	acct_1OyyEsBI0fpQ1wEW	\N	0
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") FROM stdin;
user.image	user.image	\N	2023-07-13 19:25:41.126949+00	2023-07-13 19:25:41.126949+00	f	f	\N	\N	\N
post.image	post.image	\N	2023-08-01 19:11:48.793899+00	2023-08-01 19:11:48.793899+00	f	f	\N	\N	\N
resources	resources	\N	2024-04-29 17:25:46.219535+00	2024-04-29 17:25:46.219535+00	f	f	\N	\N	\N
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id") FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."s3_multipart_uploads" ("id", "in_progress_size", "upload_signature", "bucket_id", "key", "version", "owner_id", "created_at") FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."s3_multipart_uploads_parts" ("id", "upload_id", "size", "part_number", "bucket_id", "key", "etag", "owner_id", "version", "created_at") FROM stdin;
\.


--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--

COPY "supabase_functions"."hooks" ("id", "hook_table_id", "hook_name", "created_at", "request_id") FROM stdin;
\.


--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--

COPY "vault"."secrets" ("id", "name", "description", "secret", "key_id", "nonce", "created_at", "updated_at") FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 5, true);


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

SELECT pg_catalog.setval('"public"."seller_post_id_seq"', 13, true);


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
