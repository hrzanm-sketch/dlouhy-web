CREATE TABLE "downloads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(300) NOT NULL,
	"description" text,
	"category" varchar(50) NOT NULL,
	"manufacturer" varchar(50) NOT NULL,
	"file_url" varchar(500) NOT NULL,
	"file_size" integer,
	"language" varchar(5) DEFAULT 'cs',
	"is_public" boolean DEFAULT true,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "portal_notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" varchar(50) NOT NULL,
	"title" varchar(300) NOT NULL,
	"body" text,
	"link_url" varchar(500),
	"is_read" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portal_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255),
	"first_name" varchar(200) NOT NULL,
	"last_name" varchar(200) NOT NULL,
	"phone" varchar(50),
	"job_title" varchar(200),
	"company_id" uuid NOT NULL,
	"role" varchar(30) DEFAULT 'portal_user',
	"is_active" boolean DEFAULT false,
	"email_notifications" jsonb DEFAULT '{}'::jsonb,
	"last_login_at" timestamp with time zone,
	"invited_by" uuid,
	"invite_token" varchar(255),
	"invite_expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "portal_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "portal_notifications" ADD CONSTRAINT "portal_notifications_user_id_portal_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."portal_users"("id") ON DELETE no action ON UPDATE no action;