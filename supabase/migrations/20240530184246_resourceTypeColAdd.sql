create sequence "_analytics"."billing_accounts_id_seq";

create sequence "_analytics"."billing_counts_id_seq";

create sequence "_analytics"."endpoint_queries_id_seq";

create sequence "_analytics"."oauth_access_grants_id_seq";

create sequence "_analytics"."oauth_access_tokens_id_seq";

create sequence "_analytics"."oauth_applications_id_seq";

create sequence "_analytics"."partner_users_id_seq";

create sequence "_analytics"."partners_id_seq";

create sequence "_analytics"."payment_methods_id_seq";

create sequence "_analytics"."plans_id_seq";

create sequence "_analytics"."rules_id_seq";

create sequence "_analytics"."saved_search_counters_id_seq";

create sequence "_analytics"."saved_searches_id_seq";

create sequence "_analytics"."source_backends_id_seq";

create sequence "_analytics"."source_schemas_id_seq";

create sequence "_analytics"."sources_id_seq";

create sequence "_analytics"."system_metrics_id_seq";

create sequence "_analytics"."team_users_id_seq";

create sequence "_analytics"."teams_id_seq";

create sequence "_analytics"."users_id_seq";

create sequence "_analytics"."vercel_auths_id_seq";

create table "_analytics"."billing_accounts" (
    "id" bigint not null default nextval('_analytics.billing_accounts_id_seq'::regclass),
    "latest_successful_stripe_session" jsonb,
    "stripe_customer" character varying(255),
    "user_id" bigint,
    "inserted_at" timestamp(0) without time zone not null,
    "updated_at" timestamp(0) without time zone not null,
    "stripe_subscriptions" jsonb,
    "stripe_invoices" jsonb,
    "lifetime_plan?" boolean default false,
    "lifetime_plan_invoice" character varying(255),
    "default_payment_method" character varying(255),
    "custom_invoice_fields" jsonb[] default ARRAY[]::jsonb[],
    "lifetime_plan" boolean not null default false
);


create table "_analytics"."billing_counts" (
    "id" bigint not null default nextval('_analytics.billing_counts_id_seq'::regclass),
    "node" character varying(255),
    "count" integer,
    "user_id" bigint,
    "source_id" bigint,
    "inserted_at" timestamp(0) without time zone not null,
    "updated_at" timestamp(0) without time zone not null
);


create table "_analytics"."endpoint_queries" (
    "id" bigint not null default nextval('_analytics.endpoint_queries_id_seq'::regclass),
    "name" character varying(255),
    "token" uuid,
    "query" text,
    "user_id" bigint,
    "inserted_at" timestamp(0) without time zone not null,
    "updated_at" timestamp(0) without time zone not null,
    "source_mapping" jsonb not null default '{}'::jsonb,
    "sandboxable" boolean default false,
    "cache_duration_seconds" integer default 3600,
    "proactive_requerying_seconds" integer default 1800,
    "max_limit" integer default 1000,
    "enable_auth" boolean default false,
    "sandbox_query_id" bigint,
    "language" character varying(255) not null
);


create table "_analytics"."log_events_070e7ae1_e555_46b3_ad58_2ba3487f1a4e" (
    "id" character varying(255) not null,
    "body" jsonb,
    "event_message" text,
    "timestamp" timestamp without time zone
);


create table "_analytics"."log_events_0a30fd05_aa3c_4d6b_b873_5bbcaa540b63" (
    "id" character varying(255) not null,
    "body" jsonb,
    "event_message" text,
    "timestamp" timestamp without time zone
);


create table "_analytics"."log_events_18fdd634_e8ed_42cd_b005_b3fd10be3288" (
    "id" character varying(255) not null,
    "body" jsonb,
    "event_message" text,
    "timestamp" timestamp without time zone
);


create table "_analytics"."log_events_453c3626_492a_41cd_adc8_7edeb2636bab" (
    "id" character varying(255) not null,
    "body" jsonb,
    "event_message" text,
    "timestamp" timestamp without time zone
);


create table "_analytics"."log_events_666997ef_6ac2_416e_93c9_1ea9f575a0c3" (
    "id" character varying(255) not null,
    "body" jsonb,
    "event_message" text,
    "timestamp" timestamp without time zone
);


create table "_analytics"."log_events_71ac8e2c_c408_4211_a7cb_2c9b5dd55b15" (
    "id" character varying(255) not null,
    "body" jsonb,
    "event_message" text,
    "timestamp" timestamp without time zone
);


create table "_analytics"."log_events_7be64ef4_1bf1_4553_b9cf_bfe157cb18ff" (
    "id" character varying(255) not null,
    "body" jsonb,
    "event_message" text,
    "timestamp" timestamp without time zone
);


create table "_analytics"."log_events_8ff8ba32_a21d_4096_bd55_437b9a10eb59" (
    "id" character varying(255) not null,
    "body" jsonb,
    "event_message" text,
    "timestamp" timestamp without time zone
);


create table "_analytics"."log_events_e24508da_df22_4276_bb62_4b184985ca5c" (
    "id" character varying(255) not null,
    "body" jsonb,
    "event_message" text,
    "timestamp" timestamp without time zone
);


create table "_analytics"."oauth_access_grants" (
    "id" bigint not null default nextval('_analytics.oauth_access_grants_id_seq'::regclass),
    "resource_owner_id" integer not null,
    "application_id" bigint,
    "token" character varying(255) not null,
    "expires_in" integer not null,
    "redirect_uri" text not null,
    "revoked_at" timestamp(0) without time zone,
    "scopes" character varying(255),
    "inserted_at" timestamp(0) without time zone not null
);


create table "_analytics"."oauth_access_tokens" (
    "id" bigint not null default nextval('_analytics.oauth_access_tokens_id_seq'::regclass),
    "application_id" bigint,
    "resource_owner_id" integer,
    "token" character varying(255) not null,
    "refresh_token" character varying(255),
    "expires_in" integer,
    "revoked_at" timestamp(0) without time zone,
    "scopes" character varying(255),
    "previous_refresh_token" character varying(255) not null default ''::character varying,
    "inserted_at" timestamp(0) without time zone not null,
    "updated_at" timestamp(0) without time zone not null,
    "description" text
);


create table "_analytics"."oauth_applications" (
    "id" bigint not null default nextval('_analytics.oauth_applications_id_seq'::regclass),
    "owner_id" integer not null,
    "name" character varying(255) not null,
    "uid" character varying(255) not null,
    "secret" character varying(255) not null default ''::character varying,
    "redirect_uri" character varying(255) not null,
    "scopes" character varying(255) not null default ''::character varying,
    "inserted_at" timestamp(0) without time zone not null,
    "updated_at" timestamp(0) without time zone not null
);


create table "_analytics"."partner_users" (
    "id" bigint not null default nextval('_analytics.partner_users_id_seq'::regclass),
    "partner_id" bigint,
    "user_id" bigint
);


create table "_analytics"."partners" (
    "id" bigint not null default nextval('_analytics.partners_id_seq'::regclass),
    "name" bytea,
    "token" bytea
);


create table "_analytics"."payment_methods" (
    "id" bigint not null default nextval('_analytics.payment_methods_id_seq'::regclass),
    "stripe_id" character varying(255),
    "price_id" character varying(255),
    "last_four" character varying(255),
    "brand" character varying(255),
    "exp_year" integer,
    "exp_month" integer,
    "customer_id" character varying(255),
    "inserted_at" timestamp(0) without time zone not null,
    "updated_at" timestamp(0) without time zone not null
);


create table "_analytics"."plans" (
    "id" bigint not null default nextval('_analytics.plans_id_seq'::regclass),
    "name" character varying(255),
    "stripe_id" character varying(255),
    "inserted_at" timestamp(0) without time zone not null,
    "updated_at" timestamp(0) without time zone not null,
    "period" character varying(255),
    "price" integer,
    "limit_sources" integer,
    "limit_rate_limit" integer,
    "limit_alert_freq" integer,
    "limit_source_rate_limit" integer,
    "limit_saved_search_limit" integer,
    "limit_team_users_limit" integer,
    "limit_source_fields_limit" integer,
    "limit_source_ttl" bigint default 259200000,
    "type" character varying(255) default 'standard'::character varying
);


create table "_analytics"."rules" (
    "id" bigint not null default nextval('_analytics.rules_id_seq'::regclass),
    "regex" character varying(255),
    "sink" uuid not null,
    "source_id" bigint not null,
    "inserted_at" timestamp(0) without time zone not null,
    "updated_at" timestamp(0) without time zone not null,
    "regex_struct" bytea,
    "lql_string" text not null default ''::text,
    "lql_filters" bytea not null default '\x836a'::bytea
);


create table "_analytics"."saved_search_counters" (
    "id" bigint not null default nextval('_analytics.saved_search_counters_id_seq'::regclass),
    "timestamp" timestamp without time zone not null,
    "saved_search_id" bigint not null,
    "granularity" text not null default 'day'::text,
    "non_tailing_count" integer,
    "tailing_count" integer
);


create table "_analytics"."saved_searches" (
    "id" bigint not null default nextval('_analytics.saved_searches_id_seq'::regclass),
    "querystring" text,
    "source_id" bigint,
    "inserted_at" timestamp(0) without time zone not null,
    "updated_at" timestamp(0) without time zone not null,
    "saved_by_user" boolean,
    "lql_filters" jsonb,
    "lql_charts" jsonb,
    "tailing?" boolean not null default true,
    "tailing" boolean not null default true
);


create table "_analytics"."schema_migrations" (
    "version" bigint not null,
    "inserted_at" timestamp(0) without time zone
);


create table "_analytics"."schema_migrations_070e7ae1_e555_46b3_ad58_2ba3487f1a4e" (
    "version" bigint not null,
    "inserted_at" timestamp(0) without time zone
);


create table "_analytics"."schema_migrations_0a30fd05_aa3c_4d6b_b873_5bbcaa540b63" (
    "version" bigint not null,
    "inserted_at" timestamp(0) without time zone
);


create table "_analytics"."schema_migrations_18fdd634_e8ed_42cd_b005_b3fd10be3288" (
    "version" bigint not null,
    "inserted_at" timestamp(0) without time zone
);


create table "_analytics"."schema_migrations_453c3626_492a_41cd_adc8_7edeb2636bab" (
    "version" bigint not null,
    "inserted_at" timestamp(0) without time zone
);


create table "_analytics"."schema_migrations_666997ef_6ac2_416e_93c9_1ea9f575a0c3" (
    "version" bigint not null,
    "inserted_at" timestamp(0) without time zone
);


create table "_analytics"."schema_migrations_71ac8e2c_c408_4211_a7cb_2c9b5dd55b15" (
    "version" bigint not null,
    "inserted_at" timestamp(0) without time zone
);


create table "_analytics"."schema_migrations_7be64ef4_1bf1_4553_b9cf_bfe157cb18ff" (
    "version" bigint not null,
    "inserted_at" timestamp(0) without time zone
);


create table "_analytics"."schema_migrations_8ff8ba32_a21d_4096_bd55_437b9a10eb59" (
    "version" bigint not null,
    "inserted_at" timestamp(0) without time zone
);


create table "_analytics"."schema_migrations_e24508da_df22_4276_bb62_4b184985ca5c" (
    "version" bigint not null,
    "inserted_at" timestamp(0) without time zone
);


create table "_analytics"."source_backends" (
    "id" bigint not null default nextval('_analytics.source_backends_id_seq'::regclass),
    "source_id" bigint,
    "type" character varying(255),
    "config" jsonb,
    "inserted_at" timestamp(0) without time zone not null,
    "updated_at" timestamp(0) without time zone not null
);


create table "_analytics"."source_schemas" (
    "id" bigint not null default nextval('_analytics.source_schemas_id_seq'::regclass),
    "bigquery_schema" bytea,
    "source_id" bigint,
    "inserted_at" timestamp(0) without time zone not null,
    "updated_at" timestamp(0) without time zone not null,
    "schema_flat_map" bytea
);


create table "_analytics"."sources" (
    "id" bigint not null default nextval('_analytics.sources_id_seq'::regclass),
    "name" character varying(255),
    "token" uuid not null,
    "inserted_at" timestamp(0) without time zone not null,
    "updated_at" timestamp(0) without time zone not null,
    "user_id" integer not null,
    "public_token" character varying(255),
    "favorite" boolean not null default false,
    "bigquery_table_ttl" integer,
    "api_quota" integer not null default 5,
    "webhook_notification_url" character varying(255),
    "slack_hook_url" character varying(255),
    "notifications" jsonb not null default '{"team_user_ids_for_sms": [], "team_user_ids_for_email": [], "user_text_notifications": false, "user_email_notifications": false, "other_email_notifications": null, "team_user_ids_for_schema_updates": [], "user_schema_update_notifications": true}'::jsonb,
    "custom_event_message_keys" character varying(255),
    "log_events_updated_at" timestamp(0) without time zone,
    "bigquery_schema" bytea,
    "notifications_every" integer default 14400000,
    "bq_table_partition_type" text,
    "lock_schema" boolean default false,
    "validate_schema" boolean default true,
    "drop_lql_filters" bytea not null default '\x836a'::bytea,
    "drop_lql_string" character varying(255),
    "v2_pipeline" boolean default false,
    "suggested_keys" character varying(255) default ''::character varying
);


create table "_analytics"."system_metrics" (
    "id" bigint not null default nextval('_analytics.system_metrics_id_seq'::regclass),
    "all_logs_logged" bigint,
    "node" character varying(255),
    "inserted_at" timestamp(0) without time zone not null,
    "updated_at" timestamp(0) without time zone not null
);


create table "_analytics"."team_users" (
    "id" bigint not null default nextval('_analytics.team_users_id_seq'::regclass),
    "email" character varying(255),
    "token" character varying(255),
    "provider" character varying(255),
    "email_preferred" character varying(255),
    "name" character varying(255),
    "image" character varying(255),
    "email_me_product" boolean not null default false,
    "phone" character varying(255),
    "valid_google_account" boolean not null default false,
    "provider_uid" character varying(255),
    "team_id" bigint,
    "inserted_at" timestamp(0) without time zone not null,
    "updated_at" timestamp(0) without time zone not null,
    "preferences" jsonb
);


create table "_analytics"."teams" (
    "id" bigint not null default nextval('_analytics.teams_id_seq'::regclass),
    "name" character varying(255),
    "user_id" bigint,
    "inserted_at" timestamp(0) without time zone not null,
    "updated_at" timestamp(0) without time zone not null,
    "token" character varying(255) default gen_random_uuid()
);


create table "_analytics"."users" (
    "id" bigint not null default nextval('_analytics.users_id_seq'::regclass),
    "email" character varying(255) not null,
    "provider" character varying(255) not null,
    "token" character varying(255) not null,
    "inserted_at" timestamp(0) without time zone not null,
    "updated_at" timestamp(0) without time zone not null,
    "api_key" character varying(255) not null,
    "old_api_key" character varying(255),
    "email_preferred" character varying(255),
    "name" character varying(255),
    "image" character varying(255),
    "email_me_product" boolean not null default true,
    "admin" boolean not null default false,
    "phone" character varying(255),
    "bigquery_project_id" character varying(255),
    "api_quota" integer not null default 125,
    "bigquery_dataset_location" character varying(255),
    "bigquery_dataset_id" character varying(255),
    "valid_google_account" boolean,
    "provider_uid" character varying(255),
    "company" character varying(255),
    "bigquery_udfs_hash" character varying(255) not null default ''::character varying,
    "bigquery_processed_bytes_limit" bigint not null default '10000000000'::bigint,
    "billing_enabled?" boolean not null default false,
    "preferences" jsonb,
    "billing_enabled" boolean not null default false,
    "endpoints_beta" boolean default false
);


create table "_analytics"."vercel_auths" (
    "id" bigint not null default nextval('_analytics.vercel_auths_id_seq'::regclass),
    "access_token" character varying(255),
    "installation_id" character varying(255),
    "team_id" character varying(255),
    "token_type" character varying(255),
    "vercel_user_id" character varying(255),
    "user_id" bigint,
    "inserted_at" timestamp(0) without time zone not null,
    "updated_at" timestamp(0) without time zone not null
);


alter sequence "_analytics"."billing_accounts_id_seq" owned by "_analytics"."billing_accounts"."id";

alter sequence "_analytics"."billing_counts_id_seq" owned by "_analytics"."billing_counts"."id";

alter sequence "_analytics"."endpoint_queries_id_seq" owned by "_analytics"."endpoint_queries"."id";

alter sequence "_analytics"."oauth_access_grants_id_seq" owned by "_analytics"."oauth_access_grants"."id";

alter sequence "_analytics"."oauth_access_tokens_id_seq" owned by "_analytics"."oauth_access_tokens"."id";

alter sequence "_analytics"."oauth_applications_id_seq" owned by "_analytics"."oauth_applications"."id";

alter sequence "_analytics"."partner_users_id_seq" owned by "_analytics"."partner_users"."id";

alter sequence "_analytics"."partners_id_seq" owned by "_analytics"."partners"."id";

alter sequence "_analytics"."payment_methods_id_seq" owned by "_analytics"."payment_methods"."id";

alter sequence "_analytics"."plans_id_seq" owned by "_analytics"."plans"."id";

alter sequence "_analytics"."rules_id_seq" owned by "_analytics"."rules"."id";

alter sequence "_analytics"."saved_search_counters_id_seq" owned by "_analytics"."saved_search_counters"."id";

alter sequence "_analytics"."saved_searches_id_seq" owned by "_analytics"."saved_searches"."id";

alter sequence "_analytics"."source_backends_id_seq" owned by "_analytics"."source_backends"."id";

alter sequence "_analytics"."source_schemas_id_seq" owned by "_analytics"."source_schemas"."id";

alter sequence "_analytics"."sources_id_seq" owned by "_analytics"."sources"."id";

alter sequence "_analytics"."system_metrics_id_seq" owned by "_analytics"."system_metrics"."id";

alter sequence "_analytics"."team_users_id_seq" owned by "_analytics"."team_users"."id";

alter sequence "_analytics"."teams_id_seq" owned by "_analytics"."teams"."id";

alter sequence "_analytics"."users_id_seq" owned by "_analytics"."users"."id";

alter sequence "_analytics"."vercel_auths_id_seq" owned by "_analytics"."vercel_auths"."id";

CREATE UNIQUE INDEX billing_accounts_pkey ON _analytics.billing_accounts USING btree (id);

CREATE UNIQUE INDEX billing_accounts_stripe_customer_index ON _analytics.billing_accounts USING btree (stripe_customer);

CREATE UNIQUE INDEX billing_accounts_user_id_index ON _analytics.billing_accounts USING btree (user_id);

CREATE INDEX billing_counts_inserted_at_index ON _analytics.billing_counts USING btree (inserted_at);

CREATE UNIQUE INDEX billing_counts_pkey ON _analytics.billing_counts USING btree (id);

CREATE INDEX billing_counts_source_id_index ON _analytics.billing_counts USING btree (source_id);

CREATE INDEX billing_counts_user_id_index ON _analytics.billing_counts USING btree (user_id);

CREATE UNIQUE INDEX endpoint_queries_pkey ON _analytics.endpoint_queries USING btree (id);

CREATE UNIQUE INDEX endpoint_queries_token_index ON _analytics.endpoint_queries USING btree (token);

CREATE INDEX endpoint_queries_user_id_index ON _analytics.endpoint_queries USING btree (user_id);

CREATE UNIQUE INDEX log_events_070e7ae1_e555_46b3_ad58_2ba3487f1a4e_pkey ON _analytics.log_events_070e7ae1_e555_46b3_ad58_2ba3487f1a4e USING btree (id);

CREATE UNIQUE INDEX log_events_0a30fd05_aa3c_4d6b_b873_5bbcaa540b63_pkey ON _analytics.log_events_0a30fd05_aa3c_4d6b_b873_5bbcaa540b63 USING btree (id);

CREATE UNIQUE INDEX log_events_18fdd634_e8ed_42cd_b005_b3fd10be3288_pkey ON _analytics.log_events_18fdd634_e8ed_42cd_b005_b3fd10be3288 USING btree (id);

CREATE UNIQUE INDEX log_events_453c3626_492a_41cd_adc8_7edeb2636bab_pkey ON _analytics.log_events_453c3626_492a_41cd_adc8_7edeb2636bab USING btree (id);

CREATE UNIQUE INDEX log_events_666997ef_6ac2_416e_93c9_1ea9f575a0c3_pkey ON _analytics.log_events_666997ef_6ac2_416e_93c9_1ea9f575a0c3 USING btree (id);

CREATE UNIQUE INDEX log_events_71ac8e2c_c408_4211_a7cb_2c9b5dd55b15_pkey ON _analytics.log_events_71ac8e2c_c408_4211_a7cb_2c9b5dd55b15 USING btree (id);

CREATE UNIQUE INDEX log_events_7be64ef4_1bf1_4553_b9cf_bfe157cb18ff_pkey ON _analytics.log_events_7be64ef4_1bf1_4553_b9cf_bfe157cb18ff USING btree (id);

CREATE UNIQUE INDEX log_events_8ff8ba32_a21d_4096_bd55_437b9a10eb59_pkey ON _analytics.log_events_8ff8ba32_a21d_4096_bd55_437b9a10eb59 USING btree (id);

CREATE UNIQUE INDEX log_events_e24508da_df22_4276_bb62_4b184985ca5c_pkey ON _analytics.log_events_e24508da_df22_4276_bb62_4b184985ca5c USING btree (id);

CREATE UNIQUE INDEX oauth_access_grants_pkey ON _analytics.oauth_access_grants USING btree (id);

CREATE UNIQUE INDEX oauth_access_grants_token_index ON _analytics.oauth_access_grants USING btree (token);

CREATE UNIQUE INDEX oauth_access_tokens_pkey ON _analytics.oauth_access_tokens USING btree (id);

CREATE UNIQUE INDEX oauth_access_tokens_refresh_token_index ON _analytics.oauth_access_tokens USING btree (refresh_token);

CREATE INDEX oauth_access_tokens_resource_owner_id_index ON _analytics.oauth_access_tokens USING btree (resource_owner_id);

CREATE UNIQUE INDEX oauth_access_tokens_token_index ON _analytics.oauth_access_tokens USING btree (token);

CREATE INDEX oauth_applications_owner_id_index ON _analytics.oauth_applications USING btree (owner_id);

CREATE UNIQUE INDEX oauth_applications_pkey ON _analytics.oauth_applications USING btree (id);

CREATE UNIQUE INDEX oauth_applications_uid_index ON _analytics.oauth_applications USING btree (uid);

CREATE UNIQUE INDEX partner_users_partner_id_user_id_index ON _analytics.partner_users USING btree (partner_id, user_id);

CREATE UNIQUE INDEX partner_users_pkey ON _analytics.partner_users USING btree (id);

CREATE UNIQUE INDEX partners_pkey ON _analytics.partners USING btree (id);

CREATE INDEX payment_methods_customer_id_index ON _analytics.payment_methods USING btree (customer_id);

CREATE UNIQUE INDEX payment_methods_pkey ON _analytics.payment_methods USING btree (id);

CREATE UNIQUE INDEX payment_methods_stripe_id_index ON _analytics.payment_methods USING btree (stripe_id);

CREATE UNIQUE INDEX plans_pkey ON _analytics.plans USING btree (id);

CREATE UNIQUE INDEX rules_pkey ON _analytics.rules USING btree (id);

CREATE INDEX rules_source_id_index ON _analytics.rules USING btree (source_id);

CREATE UNIQUE INDEX saved_search_counters_pkey ON _analytics.saved_search_counters USING btree (id);

CREATE UNIQUE INDEX saved_search_counters_timestamp_saved_search_id_granularity_ind ON _analytics.saved_search_counters USING btree ("timestamp", saved_search_id, granularity);

CREATE UNIQUE INDEX saved_searches_pkey ON _analytics.saved_searches USING btree (id);

CREATE UNIQUE INDEX saved_searches_querystring_source_id_index ON _analytics.saved_searches USING btree (querystring, source_id);

CREATE UNIQUE INDEX schema_migrations_070e7ae1_e555_46b3_ad58_2ba3487f1a4e_pkey ON _analytics.schema_migrations_070e7ae1_e555_46b3_ad58_2ba3487f1a4e USING btree (version);

CREATE UNIQUE INDEX schema_migrations_0a30fd05_aa3c_4d6b_b873_5bbcaa540b63_pkey ON _analytics.schema_migrations_0a30fd05_aa3c_4d6b_b873_5bbcaa540b63 USING btree (version);

CREATE UNIQUE INDEX schema_migrations_18fdd634_e8ed_42cd_b005_b3fd10be3288_pkey ON _analytics.schema_migrations_18fdd634_e8ed_42cd_b005_b3fd10be3288 USING btree (version);

CREATE UNIQUE INDEX schema_migrations_453c3626_492a_41cd_adc8_7edeb2636bab_pkey ON _analytics.schema_migrations_453c3626_492a_41cd_adc8_7edeb2636bab USING btree (version);

CREATE UNIQUE INDEX schema_migrations_666997ef_6ac2_416e_93c9_1ea9f575a0c3_pkey ON _analytics.schema_migrations_666997ef_6ac2_416e_93c9_1ea9f575a0c3 USING btree (version);

CREATE UNIQUE INDEX schema_migrations_71ac8e2c_c408_4211_a7cb_2c9b5dd55b15_pkey ON _analytics.schema_migrations_71ac8e2c_c408_4211_a7cb_2c9b5dd55b15 USING btree (version);

CREATE UNIQUE INDEX schema_migrations_7be64ef4_1bf1_4553_b9cf_bfe157cb18ff_pkey ON _analytics.schema_migrations_7be64ef4_1bf1_4553_b9cf_bfe157cb18ff USING btree (version);

CREATE UNIQUE INDEX schema_migrations_8ff8ba32_a21d_4096_bd55_437b9a10eb59_pkey ON _analytics.schema_migrations_8ff8ba32_a21d_4096_bd55_437b9a10eb59 USING btree (version);

CREATE UNIQUE INDEX schema_migrations_e24508da_df22_4276_bb62_4b184985ca5c_pkey ON _analytics.schema_migrations_e24508da_df22_4276_bb62_4b184985ca5c USING btree (version);

CREATE UNIQUE INDEX schema_migrations_pkey ON _analytics.schema_migrations USING btree (version);

CREATE UNIQUE INDEX source_backends_pkey ON _analytics.source_backends USING btree (id);

CREATE UNIQUE INDEX source_schemas_pkey ON _analytics.source_schemas USING btree (id);

CREATE UNIQUE INDEX source_schemas_source_id_index ON _analytics.source_schemas USING btree (source_id);

CREATE UNIQUE INDEX sources_name_index ON _analytics.sources USING btree (id, name);

CREATE UNIQUE INDEX sources_pkey ON _analytics.sources USING btree (id);

CREATE UNIQUE INDEX sources_public_token_index ON _analytics.sources USING btree (public_token);

CREATE UNIQUE INDEX sources_token_index ON _analytics.sources USING btree (token);

CREATE INDEX sources_user_id_index ON _analytics.sources USING btree (user_id);

CREATE INDEX system_metrics_node_index ON _analytics.system_metrics USING btree (node);

CREATE UNIQUE INDEX system_metrics_pkey ON _analytics.system_metrics USING btree (id);

CREATE UNIQUE INDEX team_users_pkey ON _analytics.team_users USING btree (id);

CREATE UNIQUE INDEX team_users_provider_uid_team_id_index ON _analytics.team_users USING btree (provider_uid, team_id);

CREATE INDEX team_users_team_id_index ON _analytics.team_users USING btree (team_id);

CREATE UNIQUE INDEX teams_pkey ON _analytics.teams USING btree (id);

CREATE UNIQUE INDEX teams_token_index ON _analytics.teams USING btree (token);

CREATE UNIQUE INDEX teams_user_id_index ON _analytics.teams USING btree (user_id);

CREATE INDEX users_api_key_index ON _analytics.users USING btree (api_key);

CREATE UNIQUE INDEX users_lower_email_index ON _analytics.users USING btree (lower((email)::text));

CREATE UNIQUE INDEX users_pkey ON _analytics.users USING btree (id);

CREATE UNIQUE INDEX vercel_auths_pkey ON _analytics.vercel_auths USING btree (id);

alter table "_analytics"."billing_accounts" add constraint "billing_accounts_pkey" PRIMARY KEY using index "billing_accounts_pkey";

alter table "_analytics"."billing_counts" add constraint "billing_counts_pkey" PRIMARY KEY using index "billing_counts_pkey";

alter table "_analytics"."endpoint_queries" add constraint "endpoint_queries_pkey" PRIMARY KEY using index "endpoint_queries_pkey";

alter table "_analytics"."log_events_070e7ae1_e555_46b3_ad58_2ba3487f1a4e" add constraint "log_events_070e7ae1_e555_46b3_ad58_2ba3487f1a4e_pkey" PRIMARY KEY using index "log_events_070e7ae1_e555_46b3_ad58_2ba3487f1a4e_pkey";

alter table "_analytics"."log_events_0a30fd05_aa3c_4d6b_b873_5bbcaa540b63" add constraint "log_events_0a30fd05_aa3c_4d6b_b873_5bbcaa540b63_pkey" PRIMARY KEY using index "log_events_0a30fd05_aa3c_4d6b_b873_5bbcaa540b63_pkey";

alter table "_analytics"."log_events_18fdd634_e8ed_42cd_b005_b3fd10be3288" add constraint "log_events_18fdd634_e8ed_42cd_b005_b3fd10be3288_pkey" PRIMARY KEY using index "log_events_18fdd634_e8ed_42cd_b005_b3fd10be3288_pkey";

alter table "_analytics"."log_events_453c3626_492a_41cd_adc8_7edeb2636bab" add constraint "log_events_453c3626_492a_41cd_adc8_7edeb2636bab_pkey" PRIMARY KEY using index "log_events_453c3626_492a_41cd_adc8_7edeb2636bab_pkey";

alter table "_analytics"."log_events_666997ef_6ac2_416e_93c9_1ea9f575a0c3" add constraint "log_events_666997ef_6ac2_416e_93c9_1ea9f575a0c3_pkey" PRIMARY KEY using index "log_events_666997ef_6ac2_416e_93c9_1ea9f575a0c3_pkey";

alter table "_analytics"."log_events_71ac8e2c_c408_4211_a7cb_2c9b5dd55b15" add constraint "log_events_71ac8e2c_c408_4211_a7cb_2c9b5dd55b15_pkey" PRIMARY KEY using index "log_events_71ac8e2c_c408_4211_a7cb_2c9b5dd55b15_pkey";

alter table "_analytics"."log_events_7be64ef4_1bf1_4553_b9cf_bfe157cb18ff" add constraint "log_events_7be64ef4_1bf1_4553_b9cf_bfe157cb18ff_pkey" PRIMARY KEY using index "log_events_7be64ef4_1bf1_4553_b9cf_bfe157cb18ff_pkey";

alter table "_analytics"."log_events_8ff8ba32_a21d_4096_bd55_437b9a10eb59" add constraint "log_events_8ff8ba32_a21d_4096_bd55_437b9a10eb59_pkey" PRIMARY KEY using index "log_events_8ff8ba32_a21d_4096_bd55_437b9a10eb59_pkey";

alter table "_analytics"."log_events_e24508da_df22_4276_bb62_4b184985ca5c" add constraint "log_events_e24508da_df22_4276_bb62_4b184985ca5c_pkey" PRIMARY KEY using index "log_events_e24508da_df22_4276_bb62_4b184985ca5c_pkey";

alter table "_analytics"."oauth_access_grants" add constraint "oauth_access_grants_pkey" PRIMARY KEY using index "oauth_access_grants_pkey";

alter table "_analytics"."oauth_access_tokens" add constraint "oauth_access_tokens_pkey" PRIMARY KEY using index "oauth_access_tokens_pkey";

alter table "_analytics"."oauth_applications" add constraint "oauth_applications_pkey" PRIMARY KEY using index "oauth_applications_pkey";

alter table "_analytics"."partner_users" add constraint "partner_users_pkey" PRIMARY KEY using index "partner_users_pkey";

alter table "_analytics"."partners" add constraint "partners_pkey" PRIMARY KEY using index "partners_pkey";

alter table "_analytics"."payment_methods" add constraint "payment_methods_pkey" PRIMARY KEY using index "payment_methods_pkey";

alter table "_analytics"."plans" add constraint "plans_pkey" PRIMARY KEY using index "plans_pkey";

alter table "_analytics"."rules" add constraint "rules_pkey" PRIMARY KEY using index "rules_pkey";

alter table "_analytics"."saved_search_counters" add constraint "saved_search_counters_pkey" PRIMARY KEY using index "saved_search_counters_pkey";

alter table "_analytics"."saved_searches" add constraint "saved_searches_pkey" PRIMARY KEY using index "saved_searches_pkey";

alter table "_analytics"."schema_migrations" add constraint "schema_migrations_pkey" PRIMARY KEY using index "schema_migrations_pkey";

alter table "_analytics"."schema_migrations_070e7ae1_e555_46b3_ad58_2ba3487f1a4e" add constraint "schema_migrations_070e7ae1_e555_46b3_ad58_2ba3487f1a4e_pkey" PRIMARY KEY using index "schema_migrations_070e7ae1_e555_46b3_ad58_2ba3487f1a4e_pkey";

alter table "_analytics"."schema_migrations_0a30fd05_aa3c_4d6b_b873_5bbcaa540b63" add constraint "schema_migrations_0a30fd05_aa3c_4d6b_b873_5bbcaa540b63_pkey" PRIMARY KEY using index "schema_migrations_0a30fd05_aa3c_4d6b_b873_5bbcaa540b63_pkey";

alter table "_analytics"."schema_migrations_18fdd634_e8ed_42cd_b005_b3fd10be3288" add constraint "schema_migrations_18fdd634_e8ed_42cd_b005_b3fd10be3288_pkey" PRIMARY KEY using index "schema_migrations_18fdd634_e8ed_42cd_b005_b3fd10be3288_pkey";

alter table "_analytics"."schema_migrations_453c3626_492a_41cd_adc8_7edeb2636bab" add constraint "schema_migrations_453c3626_492a_41cd_adc8_7edeb2636bab_pkey" PRIMARY KEY using index "schema_migrations_453c3626_492a_41cd_adc8_7edeb2636bab_pkey";

alter table "_analytics"."schema_migrations_666997ef_6ac2_416e_93c9_1ea9f575a0c3" add constraint "schema_migrations_666997ef_6ac2_416e_93c9_1ea9f575a0c3_pkey" PRIMARY KEY using index "schema_migrations_666997ef_6ac2_416e_93c9_1ea9f575a0c3_pkey";

alter table "_analytics"."schema_migrations_71ac8e2c_c408_4211_a7cb_2c9b5dd55b15" add constraint "schema_migrations_71ac8e2c_c408_4211_a7cb_2c9b5dd55b15_pkey" PRIMARY KEY using index "schema_migrations_71ac8e2c_c408_4211_a7cb_2c9b5dd55b15_pkey";

alter table "_analytics"."schema_migrations_7be64ef4_1bf1_4553_b9cf_bfe157cb18ff" add constraint "schema_migrations_7be64ef4_1bf1_4553_b9cf_bfe157cb18ff_pkey" PRIMARY KEY using index "schema_migrations_7be64ef4_1bf1_4553_b9cf_bfe157cb18ff_pkey";

alter table "_analytics"."schema_migrations_8ff8ba32_a21d_4096_bd55_437b9a10eb59" add constraint "schema_migrations_8ff8ba32_a21d_4096_bd55_437b9a10eb59_pkey" PRIMARY KEY using index "schema_migrations_8ff8ba32_a21d_4096_bd55_437b9a10eb59_pkey";

alter table "_analytics"."schema_migrations_e24508da_df22_4276_bb62_4b184985ca5c" add constraint "schema_migrations_e24508da_df22_4276_bb62_4b184985ca5c_pkey" PRIMARY KEY using index "schema_migrations_e24508da_df22_4276_bb62_4b184985ca5c_pkey";

alter table "_analytics"."source_backends" add constraint "source_backends_pkey" PRIMARY KEY using index "source_backends_pkey";

alter table "_analytics"."source_schemas" add constraint "source_schemas_pkey" PRIMARY KEY using index "source_schemas_pkey";

alter table "_analytics"."sources" add constraint "sources_pkey" PRIMARY KEY using index "sources_pkey";

alter table "_analytics"."system_metrics" add constraint "system_metrics_pkey" PRIMARY KEY using index "system_metrics_pkey";

alter table "_analytics"."team_users" add constraint "team_users_pkey" PRIMARY KEY using index "team_users_pkey";

alter table "_analytics"."teams" add constraint "teams_pkey" PRIMARY KEY using index "teams_pkey";

alter table "_analytics"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "_analytics"."vercel_auths" add constraint "vercel_auths_pkey" PRIMARY KEY using index "vercel_auths_pkey";

alter table "_analytics"."billing_accounts" add constraint "billing_accounts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES _analytics.users(id) ON DELETE CASCADE not valid;

alter table "_analytics"."billing_accounts" validate constraint "billing_accounts_user_id_fkey";

alter table "_analytics"."billing_counts" add constraint "billing_counts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES _analytics.users(id) ON DELETE CASCADE not valid;

alter table "_analytics"."billing_counts" validate constraint "billing_counts_user_id_fkey";

alter table "_analytics"."endpoint_queries" add constraint "endpoint_queries_sandbox_query_id_fkey" FOREIGN KEY (sandbox_query_id) REFERENCES _analytics.endpoint_queries(id) not valid;

alter table "_analytics"."endpoint_queries" validate constraint "endpoint_queries_sandbox_query_id_fkey";

alter table "_analytics"."endpoint_queries" add constraint "endpoint_queries_user_id_fkey" FOREIGN KEY (user_id) REFERENCES _analytics.users(id) not valid;

alter table "_analytics"."endpoint_queries" validate constraint "endpoint_queries_user_id_fkey";

alter table "_analytics"."oauth_access_grants" add constraint "oauth_access_grants_application_id_fkey" FOREIGN KEY (application_id) REFERENCES _analytics.oauth_applications(id) not valid;

alter table "_analytics"."oauth_access_grants" validate constraint "oauth_access_grants_application_id_fkey";

alter table "_analytics"."oauth_access_tokens" add constraint "oauth_access_tokens_application_id_fkey" FOREIGN KEY (application_id) REFERENCES _analytics.oauth_applications(id) not valid;

alter table "_analytics"."oauth_access_tokens" validate constraint "oauth_access_tokens_application_id_fkey";

alter table "_analytics"."partner_users" add constraint "partner_users_partner_id_fkey" FOREIGN KEY (partner_id) REFERENCES _analytics.partners(id) not valid;

alter table "_analytics"."partner_users" validate constraint "partner_users_partner_id_fkey";

alter table "_analytics"."partner_users" add constraint "partner_users_user_id_fkey" FOREIGN KEY (user_id) REFERENCES _analytics.users(id) not valid;

alter table "_analytics"."partner_users" validate constraint "partner_users_user_id_fkey";

alter table "_analytics"."payment_methods" add constraint "payment_methods_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES _analytics.billing_accounts(stripe_customer) ON DELETE CASCADE not valid;

alter table "_analytics"."payment_methods" validate constraint "payment_methods_customer_id_fkey";

alter table "_analytics"."rules" add constraint "rules_sink_fkey" FOREIGN KEY (sink) REFERENCES _analytics.sources(token) ON DELETE CASCADE not valid;

alter table "_analytics"."rules" validate constraint "rules_sink_fkey";

alter table "_analytics"."rules" add constraint "rules_source_id_fkey" FOREIGN KEY (source_id) REFERENCES _analytics.sources(id) ON DELETE CASCADE not valid;

alter table "_analytics"."rules" validate constraint "rules_source_id_fkey";

alter table "_analytics"."saved_search_counters" add constraint "saved_search_counters_saved_search_id_fkey" FOREIGN KEY (saved_search_id) REFERENCES _analytics.saved_searches(id) ON DELETE CASCADE not valid;

alter table "_analytics"."saved_search_counters" validate constraint "saved_search_counters_saved_search_id_fkey";

alter table "_analytics"."saved_searches" add constraint "saved_searches_source_id_fkey" FOREIGN KEY (source_id) REFERENCES _analytics.sources(id) ON DELETE CASCADE not valid;

alter table "_analytics"."saved_searches" validate constraint "saved_searches_source_id_fkey";

alter table "_analytics"."source_backends" add constraint "source_backends_source_id_fkey" FOREIGN KEY (source_id) REFERENCES _analytics.sources(id) not valid;

alter table "_analytics"."source_backends" validate constraint "source_backends_source_id_fkey";

alter table "_analytics"."source_schemas" add constraint "source_schemas_source_id_fkey" FOREIGN KEY (source_id) REFERENCES _analytics.sources(id) ON DELETE CASCADE not valid;

alter table "_analytics"."source_schemas" validate constraint "source_schemas_source_id_fkey";

alter table "_analytics"."sources" add constraint "sources_user_id_fkey" FOREIGN KEY (user_id) REFERENCES _analytics.users(id) ON DELETE CASCADE not valid;

alter table "_analytics"."sources" validate constraint "sources_user_id_fkey";

alter table "_analytics"."team_users" add constraint "team_users_team_id_fkey" FOREIGN KEY (team_id) REFERENCES _analytics.teams(id) ON DELETE CASCADE not valid;

alter table "_analytics"."team_users" validate constraint "team_users_team_id_fkey";

alter table "_analytics"."teams" add constraint "teams_user_id_fkey" FOREIGN KEY (user_id) REFERENCES _analytics.users(id) ON DELETE CASCADE not valid;

alter table "_analytics"."teams" validate constraint "teams_user_id_fkey";

alter table "_analytics"."vercel_auths" add constraint "vercel_auths_user_id_fkey" FOREIGN KEY (user_id) REFERENCES _analytics.users(id) ON DELETE CASCADE not valid;

alter table "_analytics"."vercel_auths" validate constraint "vercel_auths_user_id_fkey";


create table "public"."resource_types" (
    "id" bigint generated by default as identity not null,
    "type" text not null
);


alter table "public"."resource_types" enable row level security;

alter table "public"."seller_post" add column "resource_types" bigint[];

CREATE UNIQUE INDEX "resourceTypes_pkey" ON public.resource_types USING btree (id);

alter table "public"."resource_types" add constraint "resourceTypes_pkey" PRIMARY KEY using index "resourceTypes_pkey";

grant delete on table "public"."resource_types" to "anon";

grant insert on table "public"."resource_types" to "anon";

grant references on table "public"."resource_types" to "anon";

grant select on table "public"."resource_types" to "anon";

grant trigger on table "public"."resource_types" to "anon";

grant truncate on table "public"."resource_types" to "anon";

grant update on table "public"."resource_types" to "anon";

grant delete on table "public"."resource_types" to "authenticated";

grant insert on table "public"."resource_types" to "authenticated";

grant references on table "public"."resource_types" to "authenticated";

grant select on table "public"."resource_types" to "authenticated";

grant trigger on table "public"."resource_types" to "authenticated";

grant truncate on table "public"."resource_types" to "authenticated";

grant update on table "public"."resource_types" to "authenticated";

grant delete on table "public"."resource_types" to "service_role";

grant insert on table "public"."resource_types" to "service_role";

grant references on table "public"."resource_types" to "service_role";

grant select on table "public"."resource_types" to "service_role";

grant trigger on table "public"."resource_types" to "service_role";

grant truncate on table "public"."resource_types" to "service_role";

grant update on table "public"."resource_types" to "service_role";

create policy "Enable read access for all users"
on "public"."resource_types"
as permissive
for select
to authenticated
using (true);



