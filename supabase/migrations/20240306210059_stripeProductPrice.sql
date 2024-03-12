alter table "public"."seller_post" add column "stripe_price_id" text;

alter table "public"."seller_post" add column "stripe_product_id" text;

CREATE UNIQUE INDEX seller_post_stripe_price_id_key ON public.seller_post USING btree (stripe_price_id);

CREATE UNIQUE INDEX seller_post_stripe_product_id_key ON public.seller_post USING btree (stripe_product_id);

alter table "public"."seller_post" add constraint "seller_post_stripe_price_id_key" UNIQUE using index "seller_post_stripe_price_id_key";

alter table "public"."seller_post" add constraint "seller_post_stripe_product_id_key" UNIQUE using index "seller_post_stripe_product_id_key";

create policy "Enable update for users based on user_id"
on "public"."seller_post"
as permissive
for update
to authenticated
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));

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

