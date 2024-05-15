create table "public"."order_details" (
    "order_number" uuid not null,
    "product_id" bigint not null,
    "quantity" bigint
);


alter table "public"."order_details" enable row level security;

create table "public"."orders" (
    "order_number" uuid not null default gen_random_uuid(),
    "order_date" timestamp with time zone not null default now(),
    "customer_id" uuid not null default auth.uid(),
    "order_status" boolean not null default FALSE
);


alter table "public"."orders" enable row level security;

CREATE UNIQUE INDEX "order_details_pkey" ON public."order_details" USING btree ("order_number", "product_id");

CREATE UNIQUE INDEX "orders_pkey" ON public."orders" USING btree ("order_number");

alter table "public"."order_details" add constraint "order_details_pkey" PRIMARY KEY using index "order_details_pkey";

alter table "public"."orders" add constraint "orders_pkey" PRIMARY KEY using index "orders_pkey";

alter table "public"."order_details" add constraint "public_order_details_order_number_fkey" FOREIGN KEY ("order_number") REFERENCES "orders"("order_number");

alter table "public"."order_details" validate constraint "public_order_details_order_number_fkey";

alter table "public"."order_details" add constraint "public_order_details_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES seller_post(id);

alter table "public"."order_details" validate constraint "public_order_details_product_id_fkey";

alter table "public"."orders" add constraint "public_orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES auth.users(id);

alter table "public"."orders" validate constraint "public_orders_customer_id_fkey";

grant delete on table "public"."order_details" to "anon";

grant insert on table "public"."order_details" to "anon";

grant references on table "public"."order_details" to "anon";

grant select on table "public"."order_details" to "anon";

grant trigger on table "public"."order_details" to "anon";

grant truncate on table "public"."order_details" to "anon";

grant update on table "public"."order_details" to "anon";

grant delete on table "public"."order_details" to "authenticated";

grant insert on table "public"."order_details" to "authenticated";

grant references on table "public"."order_details" to "authenticated";

grant select on table "public"."order_details" to "authenticated";

grant trigger on table "public"."order_details" to "authenticated";

grant truncate on table "public"."order_details" to "authenticated";

grant update on table "public"."order_details" to "authenticated";

grant delete on table "public"."order_details" to "service_role";

grant insert on table "public"."order_details" to "service_role";

grant references on table "public"."order_details" to "service_role";

grant select on table "public"."order_details" to "service_role";

grant trigger on table "public"."order_details" to "service_role";

grant truncate on table "public"."order_details" to "service_role";

grant update on table "public"."order_details" to "service_role";

grant delete on table "public"."orders" to "anon";

grant insert on table "public"."orders" to "anon";

grant references on table "public"."orders" to "anon";

grant select on table "public"."orders" to "anon";

grant trigger on table "public"."orders" to "anon";

grant truncate on table "public"."orders" to "anon";

grant update on table "public"."orders" to "anon";

grant delete on table "public"."orders" to "authenticated";

grant insert on table "public"."orders" to "authenticated";

grant references on table "public"."orders" to "authenticated";

grant select on table "public"."orders" to "authenticated";

grant trigger on table "public"."orders" to "authenticated";

grant truncate on table "public"."orders" to "authenticated";

grant update on table "public"."orders" to "authenticated";

grant delete on table "public"."orders" to "service_role";

grant insert on table "public"."orders" to "service_role";

grant references on table "public"."orders" to "service_role";

grant select on table "public"."orders" to "service_role";

grant trigger on table "public"."orders" to "service_role";

grant truncate on table "public"."orders" to "service_role";

grant update on table "public"."orders" to "service_role";

create extension if not exists wrappers with schema "extensions";

create foreign data wrapper stripe_wrapper
  handler stripe_fdw_handler
  validator stripe_fdw_validator;

CREATE OR REPLACE FUNCTION public.create_order(customerid UUID, product_details JSONB)
 RETURNS uuid as $$
DECLARE
  new_order_number UUID;  -- Variable to store the generated order number
BEGIN
    -- Insert a new order and return the generated order number
    INSERT INTO orders (customer_id, order_date) 
    VALUES (customerid, NOW())  -- Use the current date for orderDate
    RETURNING order_number INTO new_order_number;  -- Get the generated order number

    -- Insert the order details for each Product ID
    INSERT INTO order_details (order_number, product_id, quantity)
  SELECT new_order_number, (product_detail->>'product_id')::int, (product_detail->>'quantity')::int
  FROM jsonb_array_elements(product_details) AS product_detail;
    -- If everything is successful, return the new order number
    RETURN new_order_number;

  -- Handle exceptions (rollback if there's an error)
EXCEPTION
  WHEN OTHERS THEN
    RAISE;     -- Re-raise the exception
END;
$$ LANGUAGE plpgsql;


create policy "Enable insert for authenticated users only"
on "public"."order_details"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable insert for authenticated users only"
on "public"."orders"
as permissive
for insert
to authenticated
with check (true);

create policy "Allow select for owners"
on "public"."order_details"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = ( SELECT orders.customer_id
   FROM orders
  WHERE (orders.order_number = order_details.order_number))));


create policy "Enable select based on customer_id"
on "public"."orders"
as permissive
for select
to authenticated
using ((auth.uid() = customer_id));

drop view if exists "public"."clientview";

alter table "public"."clients" drop constraint "clients_location_fkey";

alter table "public"."clients" drop column "location"; 

CREATE OR REPLACE VIEW "public"."clientview" WITH ("security_invoker"='on') AS
 SELECT "clients"."user_id",
    "clients"."created_at",
    "clients"."display_name",
    "clients"."client_phone",
    "clients"."image_url",
    "profiles"."first_name",
    "profiles"."last_name",
    "profiles"."email"
   FROM (("public"."clients"
     LEFT JOIN "public"."profiles" ON (("clients"."user_id" = "profiles"."user_id"))));

drop policy "Enable insert for authenticated users only" on "public"."clients";

create policy "Enable insert for anon and authenticated users"
on "public"."clients"
as permissive
for insert
to authenticated, anon
with check (true);