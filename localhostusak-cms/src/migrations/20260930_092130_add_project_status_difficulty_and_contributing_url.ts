import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_projects_project_status" AS ENUM('idea', 'development', 'active');
  CREATE TYPE "public"."enum_projects_difficulty_level" AS ENUM('beginner', 'intermediate', 'advanced');
  ALTER TABLE "projects" ADD COLUMN "contributing_guide_url" varchar;
  ALTER TABLE "projects" ADD COLUMN "project_status" "enum_projects_project_status";
  ALTER TABLE "projects" ADD COLUMN "difficulty_level" "enum_projects_difficulty_level";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects" DROP COLUMN "contributing_guide_url";
  ALTER TABLE "projects" DROP COLUMN "project_status";
  ALTER TABLE "projects" DROP COLUMN "difficulty_level";
  DROP TYPE "public"."enum_projects_project_status";
  DROP TYPE "public"."enum_projects_difficulty_level";`)
}
