ALTER TABLE ONLY "public"."reviews"
     ADD CONSTRAINT "reviews_resource_id_reviewer_id_key" UNIQUE ("resource_id", "reviewer_id")