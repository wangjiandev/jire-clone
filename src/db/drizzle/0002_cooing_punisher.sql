CREATE TABLE "users_to_departments" (
	"user_id" integer NOT NULL,
	"department_id" integer NOT NULL,
	CONSTRAINT "users_to_departments_user_id_department_id_pk" PRIMARY KEY("user_id","department_id")
);
--> statement-breakpoint
ALTER TABLE "users_to_departments" ADD CONSTRAINT "users_to_departments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_to_departments" ADD CONSTRAINT "users_to_departments_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE no action ON UPDATE no action;