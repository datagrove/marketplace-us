
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
	('00000000-0000-0000-0000-000000000000', '2ae7eb64-750a-42b9-8d8d-c8b9bf780092', 'authenticated', 'authenticated', 'test11@test.com', '$2a$10$MPDSSQJyE4mIKl1kUvgrx.xdlM0qaO9PmLOE3/mKwqTbg/Tr6AsIm', '2024-03-27 16:12:36.47631+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-03-27 16:12:36.479218+00', '{"provider": "email", "providers": ["email"]}', '{"last_name": "test", "first_name": "test"}', NULL, '2024-03-27 16:12:36.471934+00', '2024-03-27 16:12:36.481996+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'f885208b-ef4a-4f75-8543-a808db576a13', 'authenticated', 'authenticated', 'test7@test.com', '$2a$10$Xb00Z4wZuelapLp85KCfBOWExlPs8fzFwYhQ2vOKyZglHg6IQ5q3i', '2024-03-27 15:58:08.759078+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-03-27 15:58:08.76109+00', '{"provider": "email", "providers": ["email"]}', '{"last_name": "tes", "first_name": "test"}', NULL, '2024-03-27 15:58:08.75323+00', '2024-03-27 15:58:08.764263+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'a23376db-215d-49c4-9d9d-791c26579543', 'authenticated', 'authenticated', 'test4@test.com', '$2a$10$kb28zFsgV7Ff2KLr19LZ/.W3iEM.GssnZ5hPZf2I8YoQ1303cHOAm', '2024-03-19 18:42:48.187063+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-09-13 18:55:19.013411+00', '{"provider": "email", "providers": ["email"]}', '{"last_name": "test", "first_name": "test"}', NULL, '2024-03-19 18:42:48.175446+00', '2024-09-18 15:33:07.125761+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


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
	('b7eed9b9-6a5a-4caf-a9cc-d909c86e8ce4', '2ae7eb64-750a-42b9-8d8d-c8b9bf780092', '2024-03-27 16:12:36.479266+00', '2024-03-27 16:12:36.479266+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '192.168.65.1', NULL),
	('b9b588e8-7f7f-4f13-816c-68aab85cfef2', '111d3bed-1c92-4cf5-a66f-2ecaf3e717c3', '2024-03-27 16:18:49.044478+00', '2024-03-27 18:53:13.108184+00', NULL, 'aal1', NULL, '2024-03-27 18:53:13.108131', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15', '192.168.65.1', NULL),
	('0a2c73ca-752a-45a0-9d65-494dac44c1fa', 'ec946adf-7315-4721-a238-ed600dd153d7', '2024-03-26 13:43:25.941006+00', '2024-03-26 16:38:24.705762+00', NULL, 'aal1', NULL, '2024-03-26 16:38:24.705687', 'node', '192.168.65.1', NULL),
	('6a8baafa-3de0-45e5-bf3b-b3e6f162b202', 'b00f3d62-4eb1-40ba-b73e-e3dc78eff08a', '2024-03-27 15:17:02.81368+00', '2024-03-27 19:04:24.851184+00', NULL, 'aal1', NULL, '2024-03-27 19:04:24.851089', 'node', '192.168.65.1', NULL),
	('0b849222-0486-42b0-b78f-19f8f28d0462', 'bae9af94-3ee7-47dd-9389-181cd5906814', '2024-03-26 13:26:01.84171+00', '2024-03-26 19:29:25.891851+00', NULL, 'aal1', NULL, '2024-03-26 19:29:25.891756', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', '192.168.65.1', NULL),
	('989db7c9-0d5f-4c66-a6c6-c350d0b62d93', 'a23376db-215d-49c4-9d9d-791c26579543', '2024-03-19 18:42:48.188973+00', '2024-03-20 14:01:58.315995+00', NULL, 'aal1', NULL, '2024-03-20 14:01:58.314276', 'node', '192.168.65.1', NULL),
	('7593c1cd-113e-4afa-8669-6eeef3c817a2', 'a23376db-215d-49c4-9d9d-791c26579543', '2024-09-13 18:55:19.013502+00', '2024-09-18 15:33:07.184195+00', NULL, 'aal1', NULL, '2024-09-18 15:33:07.183903', 'node', '192.168.65.1', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('bbcd024c-ced7-4a5e-a835-585973a170da', '2024-03-05 16:20:21.67379+00', '2024-03-05 16:20:21.67379+00', 'password', 'a0f28147-3610-4695-b4c2-defb7fe28862'),
	('989db7c9-0d5f-4c66-a6c6-c350d0b62d93', '2024-03-19 18:42:48.191624+00', '2024-03-19 18:42:48.191624+00', 'password', '82f16c2a-f041-4adc-999b-151fc389cf7a'),
	('4c03eedf-a936-4315-9497-3daa7549d826', '2024-03-20 15:28:45.010246+00', '2024-03-20 15:28:45.010246+00', 'password', '2b1ef24f-f170-418b-852d-446ea4b3c503'),
	('0b849222-0486-42b0-b78f-19f8f28d0462', '2024-03-26 13:26:01.845716+00', '2024-03-26 13:26:01.845716+00', 'password', '27b95ef5-7f0b-4bda-bd39-9d16ca78132d'),
	('0a2c73ca-752a-45a0-9d65-494dac44c1fa', '2024-03-26 13:43:25.943737+00', '2024-03-26 13:43:25.943737+00', 'password', 'fc97791e-6a3b-49d1-b9cc-71d28e1c73c8'),
	('6a8baafa-3de0-45e5-bf3b-b3e6f162b202', '2024-03-27 15:17:02.816835+00', '2024-03-27 15:17:02.816835+00', 'password', 'a99e3c1b-a3f7-4acc-936f-baa5a7d0bd79'),
	('2971c683-db98-4085-91da-1faf2ddb71e4', '2024-03-27 15:58:08.76447+00', '2024-03-27 15:58:08.76447+00', 'password', 'f6def15b-193d-40ee-b9c7-f737b38f1e7d'),
	('d90cdfff-94c8-4a3e-9c28-80d064839cda', '2024-03-27 16:09:26.193147+00', '2024-03-27 16:09:26.193147+00', 'password', 'fc3cca4a-d1cc-432a-b7b8-05c932061cf2'),
	('b7eed9b9-6a5a-4caf-a9cc-d909c86e8ce4', '2024-03-27 16:12:36.482194+00', '2024-03-27 16:12:36.482194+00', 'password', 'e0727084-36dd-48cf-9b66-ed0e4ee03c42'),
	('b9b588e8-7f7f-4f13-816c-68aab85cfef2', '2024-03-27 16:18:49.047205+00', '2024-03-27 16:18:49.047205+00', 'password', '6b4f835c-6e52-41d7-90fd-761fcecc2fed'),
	('7593c1cd-113e-4afa-8669-6eeef3c817a2', '2024-09-13 18:55:19.023931+00', '2024-09-13 18:55:19.023931+00', 'password', 'e1338990-51f8-41a6-bf3e-815588dc8e06');


--
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."favorites" ("list_number", "created_date", "list_name", "customer_id", "default_list") VALUES
	('ab7953f0-9d18-4931-9d9b-d0da8a34be2e', '2024-07-29 19:34:17.839591+00', 'Default', 'f885208b-ef4a-4f75-8543-a808db576a13', true),
	('63c4ca8c-9756-4d14-b2dd-80f4ecfea132', '2024-07-29 19:34:24.502515+00', 'Default', '2ae7eb64-750a-42b9-8d8d-c8b9bf780092', true),
	('def968c2-e00e-4757-a1c4-e58c2fc62e62', '2024-07-29 19:34:55.724177+00', 'Default', 'b00f3d62-4eb1-40ba-b73e-e3dc78eff08a', true),
	('f37eff1f-c87c-49b0-ae22-9d811e3877d8', '2024-07-29 19:35:04.163172+00', 'Default', 'ec946adf-7315-4721-a238-ed600dd153d7', true),
	('379b68a1-0f1a-4e9b-b436-97ab63386bf5', '2024-07-29 19:35:16.533882+00', 'Default', 'b78eab21-c34e-41ef-9a72-64ee49f4cbc0', true),
	('28ac5cf5-1696-460c-a910-e9ba043595d6', '2024-07-29 19:35:26.607824+00', 'Default', '111d3bed-1c92-4cf5-a66f-2ecaf3e717c3', true),
	('d51eee6e-1ac9-496a-8fde-46b59268b0a3', '2024-07-29 19:35:37.595003+00', 'Default', 'df188225-8970-42a4-a54f-97b303c2b2ed', true),
	('db6dc253-5a4c-447a-ba88-45f974e4762a', '2024-07-29 19:35:46.96794+00', 'Default', 'df10c4ca-2f2a-4ff1-b2c6-68a51ca94cf9', true),
	('7510b8cb-2afe-4860-a02d-b72522633673', '2024-07-29 19:35:58.749509+00', 'Default', 'a23376db-215d-49c4-9d9d-791c26579543', true),
	('f8de78a4-ef7c-42af-9d21-bac9487a0aa2', '2024-07-29 19:36:09.154761+00', 'Default', 'bae9af94-3ee7-47dd-9389-181cd5906814', true),
	('e099fef6-46e1-4526-8e6c-b57abd498565', '2024-07-29 19:36:20.79681+00', 'Default', '1caa66a7-d9a2-462f-93c4-e65946d61c02', true),
	('a69287ac-cd46-4832-9f37-ac5d45d138c4', '2024-07-29 19:36:29.498511+00', 'Default', '84a298b6-9caf-4305-9bfe-3ea325df9188', true);


--
-- Data for Name: seller_post; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."seller_post" ("id", "created_at", "title", "content", "user_id", "image_urls", "stripe_price_id", "stripe_product_id", "resource_urls", "listing_status", "secular", "resource_links", "draft_status", "price_value") VALUES
	(1, '2024-03-05 15:38:02.509065+00', 'Test Post 1', '<p>This post is for testing provider images in the cart and also longer post content so here is some more content to see if the cards properly cut off after three lines like we expect? Is this working? Test Test Test TESt testing Test</p>', '84a298b6-9caf-4305-9bfe-3ea325df9188', NULL, 'price_1OtG6cBRZLMDvS4Ri22IpzGq', 'prod_PihVI0liGFkala', NULL, true, true, NULL, false, 20.00),
	(5, '2024-03-05 21:53:47.560102+00', 'Geography course', '<p>test</p>', '84a298b6-9caf-4305-9bfe-3ea325df9188', NULL, 'price_1OtFqrBRZLMDvS4RK5Ajf7na', 'prod_PihF0aDvvT4PeU', NULL, true, false, NULL, false, 20),
	(3, '2024-03-05 21:52:06.919336+00', 'Math course', '<p>test</p>', '84a298b6-9caf-4305-9bfe-3ea325df9188', NULL, 'price_1OtFmkBRZLMDvS4RJ8TNXGrH', 'prod_PihB8lq2HWY15J', NULL, true, true, NULL, false, 20),
	(2, '2024-03-05 15:40:05.243892+00', 'Test Post 2', '<p>test</p>', '84a298b6-9caf-4305-9bfe-3ea325df9188', NULL, 'price_1OtFjpBRZLMDvS4RPoOg78AS', 'prod_Pih8Qrjfpr0Zmo', NULL, true, false, NULL, false, 20),
	(6, '2024-03-05 21:54:44.695358+00', 'programming course ', '<p>test learn programming</p>', 'a23376db-215d-49c4-9d9d-791c26579543', NULL, 'price_1OtFmFBRZLMDvS4RsYXD3Q3C', 'prod_PihAqPK24WxqZp', NULL, true, false, NULL, false, 20),
	(7, '2024-03-27 14:25:37.137856+00', 'Test', '<p>This post is for testing provider images in the cart and also longer post content so here is some more content to see if the cards properly cut off after three lines like we expect? Is this working? Test Test Test TESt testing Test</p>', 'b78eab21-c34e-41ef-9a72-64ee49f4cbc0', NULL, 'price_1OyxQ5BRZLMDvS4RJ1oWeAIj', 'prod_PoabbRuN1tqxj0', NULL, true, false, NULL, false, 20),
	(10, '2024-03-27 15:49:08.243995+00', 'Testing testing', '<p>test</p>', 'b00f3d62-4eb1-40ba-b73e-e3dc78eff08a', NULL, 'price_1OyyiuBRZLMDvS4Rpb0hhUK3', 'prod_PobwysGlI4L0OK', NULL, true, true, NULL, false, 20),
	(11, '2024-03-27 15:50:36.102267+00', 'New Test', '<p>Test</p>', 'b00f3d62-4eb1-40ba-b73e-e3dc78eff08a', NULL, 'price_1OyykKBRZLMDvS4RC4SRSDLb', 'prod_PobyNSYyDLZArR', NULL, true, true, NULL, false, 20),
	(12, '2024-03-27 15:53:32.292584+00', 'Another test', '<p>test</p>', 'b00f3d62-4eb1-40ba-b73e-e3dc78eff08a', NULL, 'price_1OyynABRZLMDvS4RMi5Z83UK', 'prod_Poc1Kl6ObNXQ89', NULL, true, true, NULL, false, 20),
	(13, '2024-05-17 16:10:12.692569+00', 'Free Post Test', '<p>Test free post</p>', 'a23376db-215d-49c4-9d9d-791c26579543', NULL, 'price_1PMZvBBRZLMDvS4RcPyxuTRL', 'prod_QCzvzVmGr9GP84', NULL, true, true, NULL, false, 0),
	(20, '2024-09-13 19:04:07.751644+00', 'test', '<p>etest</p>', 'a23376db-215d-49c4-9d9d-791c26579543', NULL, 'price_1PzmJ0BRZLMDvS4RZXrUWXBE', 'prod_QqLT7NqggoKdOi', 'b37341b5-ecd9-4349-9bba-dc4542ce6530', true, false, '{}', false, 0),
	(22, '2024-09-16 22:13:52.087191+00', 'More subtopics', '<p>test</p>', 'a23376db-215d-49c4-9d9d-791c26579543', NULL, 'price_1PznGHBRZLMDvS4RNAKvrtAv', 'prod_QrWDzqiNcIe5dO', '4c7b13a1-338f-4583-86e7-842e627cbc2e', true, false, '{}', false, 0),
	(21, '2024-09-16 21:19:13.958564+00', 'test subtopics', '<p>test</p>', 'a23376db-215d-49c4-9d9d-791c26579543', NULL, 'price_1PznKqBRZLMDvS4RyP4tve7n', 'prod_QrVKviVznbhXaE', '95757a2c-e4f8-4c32-a402-a5286388edab', true, false, '{}', false, 0);



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


-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

--INSERT INTO "public"."orders" ("order_number", "order_date", "customer_id", "order_status") VALUES
--	('51d1f510-f3e7-48c3-913d-05a1b499cc41', '2024-09-10 14:50:12.592153+00', 'a23376db-215d-49c4-9d9d-791c26579543', true);


--
-- Data for Name: order_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

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
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

--
-- Data for Name: seller_post_grade; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."seller_post_grade" ("post_id", "grade_id") VALUES
	(1, 1),
	(1, 2),
	(1, 3),
	(5, 1),
	(3, 1),
	(2, 1),
	(6, 1),
	(6, 4),
	(6, 6),
	(7, 1),
	(10, 1),
	(11, 1),
	(12, 1),
	(13, 3),
	(20, 8),
	(20, 5),
	(22, 7),
	(21, 1),
	(21, 6);


--
-- Data for Name: seller_post_image; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."seller_post_image" ("id", "post_id", "image_uuid") VALUES
	(10, 20, '55440f1d-d12d-440f-9709-86d951090028'),
	(11, 20, '5c5688b8-01f4-4e44-9092-3bbb96f41dcb'),
	(12, 20, 'bce0f36d-e7bb-4bd0-8f31-d1b77f77939f'),
	(16, 22, '403c8f20-935a-465c-ab27-018cd016f614'),
	(18, 21, '7fb3ca96-4d6a-4387-b2dd-28ff2cd7449a');


--
-- Data for Name: seller_post_resource_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."seller_post_resource_types" ("post_id", "resource_type_id") VALUES
	(1, 1),
	(1, 2),
	(1, 3),
	(5, 4),
	(3, 5),
	(2, 3),
	(2, 5),
	(2, 9),
	(2, 12),
	(6, 1),
	(6, 2),
	(6, 3),
	(7, 1),
	(7, 2),
	(7, 3),
	(10, 7),
	(10, 9),
	(10, 12),
	(11, 1),
	(11, 2),
	(11, 3),
	(12, 1),
	(12, 2),
	(12, 3),
	(13, 10),
	(13, 11),
	(13, 12),
	(20, 7),
	(22, 10),
	(21, 7),
	(21, 12);


--
-- Data for Name: seller_post_subject; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."seller_post_subject" ("post_id", "subject_id") VALUES
	(1, 3),
	(5, 6),
	(5, 7),
	(3, 3),
	(6, 3),
	(6, 4),
	(6, 5),
	(7, 7),
	(10, 5),
	(11, 6),
	(12, 4),
	(13, 3),
	(20, 3),
	(20, 5),
	(20, 6),
	(20, 9),
	(22, 3),
	(22, 4),
	(22, 9),
	(21, 4),
	(21, 3);


--
-- Data for Name: seller_post_subtopic; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."seller_post_subtopic" ("post_id", "subtopic_id") VALUES
	(1, 38),
	(1, 39),
	(5, 39),
	(2, 38),
	(20, 53),
	(20, 54),
	(20, 55),
	(20, 72),
	(20, 73),
	(20, 17),
	(20, 19),
	(21, 2),
	(21, 3),
	(21, 6),
	(21, 7);


--
-- Data for Name: sellers; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."sellers" ("created_at", "seller_name", "user_id", "image_url", "seller_id", "language_spoken", "stripe_connected_account_id", "seller_about", "contribution") VALUES
	('2024-03-05 15:42:34.225911+00', 'German', '84a298b6-9caf-4305-9bfe-3ea325df9188', NULL, 3, NULL, 'acct_1Otw7FPdu3Mnre1j', NULL, 0),
	('2024-03-26 13:43:48.52652+00', 'Test2 Test', 'ec946adf-7315-4721-a238-ed600dd153d7', NULL, 5, NULL, 'acct_1OyaI4B1rj93e0iW', NULL, 0),
	('2024-03-26 21:49:40.736227+00', 'Test test', 'df188225-8970-42a4-a54f-97b303c2b2ed', NULL, 6, NULL, 'acct_1OyhsGBGXYM1FOiH', NULL, 0),
	('2024-03-27 14:23:47.653382+00', 'Test test', 'b78eab21-c34e-41ef-9a72-64ee49f4cbc0', NULL, 7, NULL, 'acct_1OyxOKB0i6JTeUGm', NULL, 0),
	('2024-03-27 15:18:06.611913+00', 'TEST test', 'b00f3d62-4eb1-40ba-b73e-e3dc78eff08a', NULL, 8, NULL, 'acct_1OyyEsBI0fpQ1wEW', NULL, 0),
	('2024-03-19 19:37:25.638743+00', 'test test', 'a23376db-215d-49c4-9d9d-791c26579543', '44020db9-59e1-4028-9661-639748329eca', 4, NULL, 'acct_1Ow8TSB0tPFjRwUY', '', 0);


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
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."orders" ("order_number", "order_date", "customer_id", "order_status") VALUES
	('51d1f510-f3e7-48c3-913d-05a1b499cc41', '2024-09-10 14:50:12.592153+00', 'a23376db-215d-49c4-9d9d-791c26579543', true);


--
-- Data for Name: order_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."order_details" ("order_number", "product_id", "quantity") VALUES
	('51d1f510-f3e7-48c3-913d-05a1b499cc41', 12, 2),
	('51d1f510-f3e7-48c3-913d-05a1b499cc41', 10, 2),
	('51d1f510-f3e7-48c3-913d-05a1b499cc41', 5, 1);


-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."reviews" ("id", "created_at", "resource_id", "reviewer_id", "review_title", "review_text", "overall_rating") VALUES
	(3, '2024-09-10 14:48:24.267324+00', 12, 'a23376db-215d-49c4-9d9d-791c26579543', 'test title', 'test review text', 4);

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 27, true);


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

SELECT pg_catalog.setval('"public"."post_subject_id_seq"', 9, true);


--
-- Name: post_subtopic_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."post_subtopic_id_seq"', 1, false);


--
-- Name: resource_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."resource_types_id_seq"', 12, true);


--
-- Name: seller_post_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."seller_post_id_seq"', 22, true);


--
-- Name: seller_post_image_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."seller_post_image_id_seq"', 18, true);


--
-- Name: sellers_seller_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."sellers_seller_id_seq"', 8, true);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, true);

--

SELECT pg_catalog.setval('"public"."reviews_id_seq"', 4, true);

--
-- PostgreSQL database dump complete
--

RESET ALL;
