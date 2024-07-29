create table "public"."favorites_products" (
    "list_number" uuid not null,
    "product_id" bigint not null
);

alter table "public"."favorites_products" enable row level security;

create table "public"."favorites" (
    "list_number" uuid not null default gen_random_uuid(),
    "created_date" timestamp with time zone not null default now(),
    "list_name" text not null default 'Default',
    "customer_id" uuid not null default auth.uid()
);

alter table "public"."favorites" enable row level security;

CREATE UNIQUE INDEX "favorites_products_pkey" ON public."favorites_products" USING btree ("list_number", "product_id");

CREATE UNIQUE INDEX "favorites_pkey" ON public."favorites" USING btree ("list_number");

alter table "public"."favorites_products" add constraint "favorites_products_pkey" PRIMARY KEY using index "favorites_products_pkey";

alter table "public"."favorites" add constraint "favorites_pkey" PRIMARY KEY using index "favorites_pkey";

alter table "public"."favorites_products" add constraint "public_favorites_products_list_number_fkey" FOREIGN KEY ("list_number") REFERENCES "favorites"("list_number");

alter table "public"."favorites_products" validate constraint "public_favorites_products_list_number_fkey";

alter table "public"."favorites_products" add constraint "public_favorites_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES seller_post(id);

alter table "public"."favorites_products" validate constraint "public_favorites_products_product_id_fkey";

alter table "public"."favorites" add constraint "public_favorites_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES auth.users(id);

alter table "public"."favorites" validate constraint "public_favorites_customer_id_fkey";

grant delete on table "public"."favorites_products" to "anon";

grant insert on table "public"."favorites_products" to "anon";

grant references on table "public"."favorites_products" to "anon";

grant select on table "public"."favorites_products" to "anon";

grant trigger on table "public"."favorites_products" to "anon";

grant truncate on table "public"."favorites_products" to "anon";

grant update on table "public"."favorites_products" to "anon";

grant delete on table "public"."favorites_products" to "authenticated";

grant insert on table "public"."favorites_products" to "authenticated";

grant references on table "public"."favorites_products" to "authenticated";

grant select on table "public"."favorites_products" to "authenticated";

grant trigger on table "public"."favorites_products" to "authenticated";

grant truncate on table "public"."favorites_products" to "authenticated";

grant update on table "public"."favorites_products" to "authenticated";

grant delete on table "public"."favorites_products" to "service_role";

grant insert on table "public"."favorites_products" to "service_role";

grant references on table "public"."favorites_products" to "service_role";

grant select on table "public"."favorites_products" to "service_role";

grant trigger on table "public"."favorites_products" to "service_role";

grant truncate on table "public"."favorites_products" to "service_role";

grant update on table "public"."favorites_products" to "service_role";

grant delete on table "public"."favorites" to "anon";

grant insert on table "public"."favorites" to "anon";

grant references on table "public"."favorites" to "anon";

grant select on table "public"."favorites" to "anon";

grant trigger on table "public"."favorites" to "anon";

grant truncate on table "public"."favorites" to "anon";

grant update on table "public"."favorites" to "anon";

grant delete on table "public"."favorites" to "authenticated";

grant insert on table "public"."favorites" to "authenticated";

grant references on table "public"."favorites" to "authenticated";

grant select on table "public"."favorites" to "authenticated";

grant trigger on table "public"."favorites" to "authenticated";

grant truncate on table "public"."favorites" to "authenticated";

grant update on table "public"."favorites" to "authenticated";

grant delete on table "public"."favorites" to "service_role";

grant insert on table "public"."favorites" to "service_role";

grant references on table "public"."favorites" to "service_role";

grant select on table "public"."favorites" to "service_role";

grant trigger on table "public"."favorites" to "service_role";

grant truncate on table "public"."favorites" to "service_role";

grant update on table "public"."favorites" to "service_role";

CREATE OR REPLACE FUNCTION public.create_favorite_list(customerid UUID, product_details JSONB)
 RETURNS uuid as $$
DECLARE
  new_list_number UUID;  -- Variable to store the generated list number
BEGIN
    -- Insert a new list and return the generated list number
    INSERT INTO favorites (customer_id, order_date) 
    VALUES (customerid, NOW())  -- Use the current date for Created Date
    RETURNING list_number INTO new_list_number;  -- Get the generated list number

    -- Insert the favorites details for each Product ID
    INSERT INTO favorites_products (list_number, product_id)
  SELECT new_list_number, (product_detail->>'product_id')::int
  FROM jsonb_array_elements(product_details) AS product_detail;
    -- If everything is successful, return the new list number
    RETURN new_list_number;

  -- Handle exceptions (rollback if there's an error)
EXCEPTION
  WHEN OTHERS THEN
    RAISE;     -- Re-raise the exception
END;
$$ LANGUAGE plpgsql;

create policy "Enable insert for authenticated users only"
on "public"."favorites_products"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable insert for authenticated users only"
on "public"."favorites"
as permissive
for insert
to authenticated
with check (true);

create policy "Allow select for owners"
on "public"."favorites_products"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = ( SELECT favorites.customer_id
   FROM favorites
  WHERE (favorites.list_number = favorites_products.list_number))));


create policy "Enable select based on customer_id"
on "public"."favorites"
as permissive
for select
to authenticated
using ((auth.uid() = customer_id));