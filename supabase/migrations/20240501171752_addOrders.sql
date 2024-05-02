create table "public"."order_details" (
    "OrderNumber" uuid not null,
    "ProductID" bigint not null,
    "Quantity" bigint
);


alter table "public"."order_details" enable row level security;

create table "public"."orders" (
    "OrderNumber" uuid not null default gen_random_uuid(),
    "OrderDate" timestamp with time zone not null default now(),
    "CustomerID" uuid not null default auth.uid(),
    "OrderStatus" text not null default ''::text
);


alter table "public"."orders" enable row level security;

CREATE UNIQUE INDEX "order_details_pkey" ON public."order_details" USING btree ("OrderNumber", "ProductID");

CREATE UNIQUE INDEX "orders_pkey" ON public."orders" USING btree ("OrderNumber");

alter table "public"."order_details" add constraint "order_details_pkey" PRIMARY KEY using index "order_details_pkey";

alter table "public"."orders" add constraint "orders_pkey" PRIMARY KEY using index "orders_pkey";

alter table "public"."order_details" add constraint "public_order_details_OrderNumber_fkey" FOREIGN KEY ("OrderNumber") REFERENCES "orders"("OrderNumber") not valid;

alter table "public"."order_details" validate constraint "public_order_details_OrderNumber_fkey";

alter table "public"."order_details" add constraint "public_order_details_ProductID_fkey" FOREIGN KEY ("ProductID") REFERENCES seller_post(id) not valid;

alter table "public"."order_details" validate constraint "public_order_details_ProductID_fkey";

alter table "public"."orders" add constraint "public_orders_CustomerID_fkey" FOREIGN KEY ("CustomerID") REFERENCES clients(user_id) not valid;

alter table "public"."orders" validate constraint "public_orders_CustomerID_fkey";

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

