--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at") VALUES
	('00000000-0000-0000-0000-000000000000', '84a298b6-9caf-4305-9bfe-3ea325df9188', 'authenticated', 'authenticated', 'germanzarkovich@gmail.com', '$2a$10$zDwI4WhdTYEEClfJm1VxVuhbXO.D8//bpMVwgV.dlYG.VujvRpi3q', '2024-03-05 15:35:23.695951+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2024-03-05 15:35:23.693491+00', '2024-03-05 15:35:23.696028+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL),
	('00000000-0000-0000-0000-000000000000', '1caa66a7-d9a2-462f-93c4-e65946d61c02', 'authenticated', 'authenticated', 'someone@email.com', '$2a$10$qQA4UXgQC42VEL7Jj0BMI.lSolPCyHTQA0dy0209AT9/DTDoQ8./O', '2024-03-05 16:20:21.660728+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-03-05 16:20:21.673034+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2024-03-05 16:20:21.658888+00', '2024-03-05 16:20:21.673672+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL),
	('00000000-0000-0000-0000-000000000000', 'bae9af94-3ee7-47dd-9389-181cd5906814', 'authenticated', 'authenticated', 'test@test.com', '$2a$10$v1Rtv0uewR20qe0sxcmdGuhbIzqqIeRA0RU1UFXnakRTPONEt8Vjq', '2024-03-26 13:26:01.837792+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-03-26 13:26:01.841642+00', '{"provider": "email", "providers": ["email"]}', '{"last_name": "Test", "first_name": "Test"}', NULL, '2024-03-26 13:26:01.826478+00', '2024-03-26 19:29:25.886671+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL),
	('00000000-0000-0000-0000-000000000000', 'a23376db-215d-49c4-9d9d-791c26579543', 'authenticated', 'authenticated', 'test4@test.com', '$2a$10$kb28zFsgV7Ff2KLr19LZ/.W3iEM.GssnZ5hPZf2I8YoQ1303cHOAm', '2024-03-19 18:42:48.187063+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-03-19 18:42:48.188942+00', '{"provider": "email", "providers": ["email"]}', '{"last_name": "test", "first_name": "test"}', NULL, '2024-03-19 18:42:48.175446+00', '2024-03-20 14:01:58.310551+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL),
	('00000000-0000-0000-0000-000000000000', 'df10c4ca-2f2a-4ff1-b2c6-68a51ca94cf9', 'authenticated', 'authenticated', 'test10@test.com', '$2a$10$57DpbJB6eJ0TwKwpV7xR3.pB2CO2rzh2U4U7gLbelm3Pu9F7FlbsO', '2024-03-27 16:09:26.189581+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-03-27 16:09:26.190696+00', '{"provider": "email", "providers": ["email"]}', '{"last_name": "test", "first_name": "test"}', NULL, '2024-03-27 16:09:26.186335+00', '2024-03-27 16:09:26.192962+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL),
	('00000000-0000-0000-0000-000000000000', 'df188225-8970-42a4-a54f-97b303c2b2ed', 'authenticated', 'authenticated', 'test5@test.com', '$2a$10$0y/mcUrcfjUWWy/.jwc3HOoNYFJdydypaDykaLCzxYrPXOrGF65Hi', '2024-03-20 15:28:45.002582+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-03-20 15:28:45.005413+00', '{"provider": "email", "providers": ["email"]}', '{"last_name": "test", "first_name": "Test"}', NULL, '2024-03-20 15:28:44.990631+00', '2024-03-27 13:14:30.947697+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL),
	('00000000-0000-0000-0000-000000000000', '111d3bed-1c92-4cf5-a66f-2ecaf3e717c3', 'authenticated', 'authenticated', 'test13@test.com', '$2a$10$HC.RmWBBeeD1Ay4YwGJnQ.O8qkBVqgfffmzc8JQgMRV9eV.M2eCTS', '2024-03-27 16:18:49.041032+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-03-27 16:18:49.044415+00', '{"provider": "email", "providers": ["email"]}', '{"last_name": "Test", "first_name": "Test"}', NULL, '2024-03-27 16:18:49.035351+00', '2024-03-27 18:53:13.107192+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL),
	('00000000-0000-0000-0000-000000000000', 'b78eab21-c34e-41ef-9a72-64ee49f4cbc0', 'authenticated', 'authenticated', 'test6@test.com', '$2a$10$upU6bJwUd0aXUifcbc.dauT/ak2wLw1dPHva/l7HmYZKhlRnz7a7S', '2024-03-27 14:23:24.235522+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-03-27 14:23:24.23826+00', '{"provider": "email", "providers": ["email"]}', '{"last_name": "test", "first_name": "Test"}', NULL, '2024-03-27 14:23:24.226145+00', '2024-03-27 14:23:24.241546+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL),
	('00000000-0000-0000-0000-000000000000', 'ec946adf-7315-4721-a238-ed600dd153d7', 'authenticated', 'authenticated', 'test2@test.com', '$2a$10$Bg3uVVpxeilQRtTim1/OCuWYqGhu1fhl2B5uSgLIo.K/t4F/XugQS', '2024-03-26 13:43:25.939314+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-03-26 13:43:25.940954+00', '{"provider": "email", "providers": ["email"]}', '{"last_name": "Test", "first_name": "Test2"}', NULL, '2024-03-26 13:43:25.93158+00', '2024-03-26 16:38:24.704182+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL),
	('00000000-0000-0000-0000-000000000000', 'b00f3d62-4eb1-40ba-b73e-e3dc78eff08a', 'authenticated', 'authenticated', 'test8@test.com', '$2a$10$/Cs2ysAPlBv5DOa9eNUo7uJAtC7rp57Lz5XTJ1eXmWJ6P9hbzWdN.', '2024-03-27 15:17:02.810911+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-03-27 15:17:02.813624+00', '{"provider": "email", "providers": ["email"]}', '{"last_name": "test", "first_name": "TEST"}', NULL, '2024-03-27 15:17:02.803115+00', '2024-03-27 19:04:24.849828+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL),
	('00000000-0000-0000-0000-000000000000', '2ae7eb64-750a-42b9-8d8d-c8b9bf780092', 'authenticated', 'authenticated', 'test11@test.com', '$2a$10$MPDSSQJyE4mIKl1kUvgrx.xdlM0qaO9PmLOE3/mKwqTbg/Tr6AsIm', '2024-03-27 16:12:36.47631+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-03-27 16:12:36.479218+00', '{"provider": "email", "providers": ["email"]}', '{"last_name": "test", "first_name": "test"}', NULL, '2024-03-27 16:12:36.471934+00', '2024-03-27 16:12:36.481996+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL),
	('00000000-0000-0000-0000-000000000000', 'f885208b-ef4a-4f75-8543-a808db576a13', 'authenticated', 'authenticated', 'test7@test.com', '$2a$10$Xb00Z4wZuelapLp85KCfBOWExlPs8fzFwYhQ2vOKyZglHg6IQ5q3i', '2024-03-27 15:58:08.759078+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-03-27 15:58:08.76109+00', '{"provider": "email", "providers": ["email"]}', '{"last_name": "tes", "first_name": "test"}', NULL, '2024-03-27 15:58:08.75323+00', '2024-03-27 15:58:08.764263+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL);


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
	('989db7c9-0d5f-4c66-a6c6-c350d0b62d93', 'a23376db-215d-49c4-9d9d-791c26579543', '2024-03-19 18:42:48.188973+00', '2024-03-20 14:01:58.315995+00', NULL, 'aal1', NULL, '2024-03-20 14:01:58.314276', 'node', '192.168.65.1', NULL);


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
	('b9b588e8-7f7f-4f13-816c-68aab85cfef2', '2024-03-27 16:18:49.047205+00', '2024-03-27 16:18:49.047205+00', 'password', '6b4f835c-6e52-41d7-90fd-761fcecc2fed');



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
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."users" ("user_id", "created_at", "display_name", "image_url") VALUES
	('a23376db-215d-49c4-9d9d-791c26579543', '2024-03-05 15:37:01.129356+00',  NULL, NULL),
	('df188225-8970-42a4-a54f-97b303c2b2ed', '2024-03-05 15:37:01.129356+00',  NULL, NULL),
	('bae9af94-3ee7-47dd-9389-181cd5906814', '2024-03-05 15:37:01.129356+00',  NULL, NULL),
	('ec946adf-7315-4721-a238-ed600dd153d7', '2024-03-05 15:37:01.129356+00',  NULL, NULL),
	('b78eab21-c34e-41ef-9a72-64ee49f4cbc0', '2024-03-05 15:37:01.129356+00',  NULL, NULL),
	('b00f3d62-4eb1-40ba-b73e-e3dc78eff08a', '2024-03-05 15:37:01.129356+00',  NULL, NULL),
	('f885208b-ef4a-4f75-8543-a808db576a13', '2024-03-05 15:37:01.129356+00',  NULL, NULL),
	('df10c4ca-2f2a-4ff1-b2c6-68a51ca94cf9', '2024-03-05 15:37:01.129356+00',  NULL, NULL),
	('2ae7eb64-750a-42b9-8d8d-c8b9bf780092', '2024-03-05 15:37:01.129356+00',  NULL, NULL),
	('111d3bed-1c92-4cf5-a66f-2ecaf3e717c3', '2024-03-05 15:37:01.129356+00',  NULL, NULL);



INSERT INTO "public"."profiles" ("created_at", "first_name", "last_name", "user_id", "email") VALUES
	('2024-03-19 18:42:48.238071+00', 'test', 'test', 'a23376db-215d-49c4-9d9d-791c26579543', 'test4@test.com'),
	('2024-03-20 15:28:45.055463+00', 'Test', 'test', 'df188225-8970-42a4-a54f-97b303c2b2ed', 'test5@test.com'),
	('2024-03-26 13:26:01.908789+00', 'Test', 'Test', 'bae9af94-3ee7-47dd-9389-181cd5906814', 'test@test.com'),
	('2024-03-26 13:43:25.957113+00', 'Test2', 'Test', 'ec946adf-7315-4721-a238-ed600dd153d7', 'test2@test.com'),
	('2024-03-27 14:23:24.262505+00', 'Test', 'test', 'b78eab21-c34e-41ef-9a72-64ee49f4cbc0', 'test6@test.com'),
	('2024-03-27 15:17:02.840813+00', 'TEST', 'test', 'b00f3d62-4eb1-40ba-b73e-e3dc78eff08a', 'test8@test.com'),
	('2024-03-27 15:58:08.787305+00', 'test', 'tes', 'f885208b-ef4a-4f75-8543-a808db576a13', 'test7@test.com'),
	('2024-03-27 16:09:26.205269+00', 'test', 'test', 'df10c4ca-2f2a-4ff1-b2c6-68a51ca94cf9', 'test10@test.com'),
	('2024-03-27 16:12:36.501596+00', 'test', 'test', '2ae7eb64-750a-42b9-8d8d-c8b9bf780092', 'test11@test.com'),
	('2024-03-27 16:18:49.069242+00', 'Test', 'Test', '111d3bed-1c92-4cf5-a66f-2ecaf3e717c3', 'test13@test.com');


--
-- Data for Name: seller_post; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."seller_post" ("id", "created_at", "title", "content", "user_id", "image_urls", "stripe_price_id", "stripe_product_id", "product_subject", "post_grade", "resource_urls", "resource_types") VALUES
	(1, '2024-03-05 15:38:02.509065+00', 'Test Post 1', '<p>This post is for testing provider images in the cart and also longer post content so here is some more content to see if the cards properly cut off after three lines like we expect? Is this working? Test Test Test TESt testing Test</p>', '84a298b6-9caf-4305-9bfe-3ea325df9188', NULL, 'price_1OtG6cBRZLMDvS4Ri22IpzGq', 'prod_PihVI0liGFkala', '{1,2,3}', '{1,2,3}', NULL, '{1,2,3}'),
	(5, '2024-03-05 21:53:47.560102+00', 'Geography course', '<p>test</p>', '84a298b6-9caf-4305-9bfe-3ea325df9188', NULL, 'price_1OtFqrBRZLMDvS4RK5Ajf7na', 'prod_PihF0aDvvT4PeU', '{2,6,7}', '{1}', NULL, '{1,2,3}'),
	(3, '2024-03-05 21:52:06.919336+00', 'Math course', '<p>test</p>', '84a298b6-9caf-4305-9bfe-3ea325df9188', NULL, 'price_1OtFmkBRZLMDvS4RJ8TNXGrH', 'prod_PihB8lq2HWY15J', '{3}', '{1}', NULL, '{1,2,3}'),
	(2, '2024-03-05 15:40:05.243892+00', 'Test Post 2', '<p>test</p>', '84a298b6-9caf-4305-9bfe-3ea325df9188', NULL, 'price_1OtFjpBRZLMDvS4RPoOg78AS', 'prod_Pih8Qrjfpr0Zmo', '{1}', '{1}', NULL, '{1,2,3}'),
	(6, '2024-03-05 21:54:44.695358+00', 'programming course ', '<p>test learn programming</p>', 'a23376db-215d-49c4-9d9d-791c26579543', NULL, 'price_1OtFmFBRZLMDvS4RsYXD3Q3C', 'prod_PihAqPK24WxqZp', '{3,4,5}', '{1,4,6}', NULL, '{1,2,3}'),
	(7, '2024-03-27 14:25:37.137856+00', 'Test', '<p>This post is for testing provider images in the cart and also longer post content so here is some more content to see if the cards properly cut off after three lines like we expect? Is this working? Test Test Test TESt testing Test</p>', 'b78eab21-c34e-41ef-9a72-64ee49f4cbc0', NULL, 'price_1OyxQ5BRZLMDvS4RJ1oWeAIj', 'prod_PoabbRuN1tqxj0', '{7}', '{1}', NULL, '{1,2,3}'),
	(10, '2024-03-27 15:49:08.243995+00', 'Testing testing', '<p>test</p>', 'b00f3d62-4eb1-40ba-b73e-e3dc78eff08a', NULL, 'price_1OyyiuBRZLMDvS4Rpb0hhUK3', 'prod_PobwysGlI4L0OK', '{5}', '{1}', NULL,'{1,2,3}'),
	(11, '2024-03-27 15:50:36.102267+00', 'New Test', '<p>Test</p>', 'b00f3d62-4eb1-40ba-b73e-e3dc78eff08a', NULL, 'price_1OyykKBRZLMDvS4RC4SRSDLb', 'prod_PobyNSYyDLZArR', '{6}', '{1}', NULL, '{1,2,3}'),
	(12, '2024-03-27 15:53:32.292584+00', 'Another test', '<p>test</p>', 'b00f3d62-4eb1-40ba-b73e-e3dc78eff08a', NULL, 'price_1OyynABRZLMDvS4RMi5Z83UK', 'prod_Poc1Kl6ObNXQ89', '{4}', '{1}', NULL, '{1,2,3}'),
	(13, '2024-05-17 16:10:12.692569+00', 'Free Post Test', '<p>Test free post</p>', 'a23376db-215d-49c4-9d9d-791c26579543', NULL, 'price_1PMZvBBRZLMDvS4RcPyxuTRL', 'prod_QCzvzVmGr9GP84', '{3}', '{3}', NULL, '{1,2,3}');


--
-- Data for Name: sellers; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."sellers" ("created_at", "seller_name", "user_id", "image_url", "seller_id", "language_spoken", "stripe_connected_account_id") VALUES
	('2024-03-05 15:42:34.225911+00', 'German', '84a298b6-9caf-4305-9bfe-3ea325df9188', NULL, 3, NULL, 'acct_1Otw7FPdu3Mnre1j'),
	('2024-03-19 19:37:25.638743+00', 'test test', 'a23376db-215d-49c4-9d9d-791c26579543', NULL, 4, NULL, 'acct_1Ow8TSB0tPFjRwUY'),
	('2024-03-26 13:43:48.52652+00', 'Test2 Test', 'ec946adf-7315-4721-a238-ed600dd153d7', NULL, 5, NULL, 'acct_1OyaI4B1rj93e0iW'),
	('2024-03-26 21:49:40.736227+00', 'Test test', 'df188225-8970-42a4-a54f-97b303c2b2ed', NULL, 6, NULL, 'acct_1OyhsGBGXYM1FOiH'),
	('2024-03-27 14:23:47.653382+00', 'Test test', 'b78eab21-c34e-41ef-9a72-64ee49f4cbc0', NULL, 7, NULL, 'acct_1OyxOKB0i6JTeUGm'),
	('2024-03-27 15:18:06.611913+00', 'TEST test', 'b00f3d62-4eb1-40ba-b73e-e3dc78eff08a', NULL, 8, NULL, 'acct_1OyyEsBI0fpQ1wEW');



-- 1	PDF
-- 2	Word
-- 3	ZIP File
-- 4	Whiteboard
-- 5	Image
-- 6	Google Apps
-- \.
--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 4, true);


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
-- Name: seller_post_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."seller_post_id_seq"', 13, true);


--
-- Name: sellers_seller_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."sellers_seller_id_seq"', 8, true);


--
-- Name: resource_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."resource_types_id_seq"', 11, true);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, true);


SELECT pg_catalog.setval('"public"."sellers_seller_id_seq"', 8, true);
--
-- PostgreSQL database dump complete
--

RESET ALL;
