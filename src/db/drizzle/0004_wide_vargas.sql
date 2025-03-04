ALTER TABLE "users_to_departments" DROP CONSTRAINT "users_to_departments_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "users_to_departments" DROP CONSTRAINT "users_to_departments_department_id_departments_id_fk";
--> statement-breakpoint
ALTER TABLE "users_to_departments" ADD CONSTRAINT "users_to_departments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_to_departments" ADD CONSTRAINT "users_to_departments_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;