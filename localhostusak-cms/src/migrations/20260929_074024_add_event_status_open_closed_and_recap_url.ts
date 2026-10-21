import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_events_status" ADD VALUE 'open' BEFORE 'completed';
  ALTER TYPE "public"."enum_events_status" ADD VALUE 'closed' BEFORE 'completed';
  ALTER TABLE "events" ADD COLUMN "recap_url" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   -- DİKKAT (veri kaybı): Geri alma sırasında 'open' ve 'closed' statülü etkinlikler 'upcoming'e çevrilir; alt statü bilgisi kaybolur, etkinlikler silinmez. Bu adım olmadan eski enum'a dönüşüm hata verir.
  UPDATE "events" SET "status" = 'upcoming' WHERE "status"::text IN ('open', 'closed');
  ALTER TABLE "events" ALTER COLUMN "status" SET DATA TYPE text;
  ALTER TABLE "events" ALTER COLUMN "status" SET DEFAULT 'upcoming'::text;
  DROP TYPE "public"."enum_events_status";
  CREATE TYPE "public"."enum_events_status" AS ENUM('upcoming', 'completed', 'cancelled');
  ALTER TABLE "events" ALTER COLUMN "status" SET DEFAULT 'upcoming'::"public"."enum_events_status";
  ALTER TABLE "events" ALTER COLUMN "status" SET DATA TYPE "public"."enum_events_status" USING "status"::"public"."enum_events_status";
  ALTER TABLE "events" DROP COLUMN "recap_url";`)
}
