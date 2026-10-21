import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "site_settings_vision_messages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar NOT NULL,
  	"tag" varchar,
  	"author" varchar
  );
  
  CREATE TABLE "kvkk_settings_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"num" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"content" varchar
  );
  
  CREATE TABLE "kvkk_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_tag" varchar DEFAULT 'HUKUKİ BİLGİLENDİRME // 6698 SAYILI KANUN' NOT NULL,
  	"hero_title" varchar DEFAULT 'Kişisel Verilerin Korunması ve' NOT NULL,
  	"hero_highlight_text" varchar DEFAULT 'Aydınlatma Metni' NOT NULL,
  	"hero_description" varchar DEFAULT 'Localhost Uşak Teknoloji ve Yazılım Topluluğu üyelerinin, etkinlik katılımcılarının ve web sitesi ziyaretçilerimizin kişisel verilerinin korunması, işlenmesi ve etkinlik muvafakatnamesi.' NOT NULL,
  	"document_meta_badge_text" varchar DEFAULT '6698 SAYILI KVKK UYUMLU',
  	"document_meta_last_updated" varchar DEFAULT '2026',
  	"document_meta_version" varchar DEFAULT 'Sürüm 1.1',
  	"document_meta_contact_email" varchar DEFAULT 'localhostusak@gmail.com' NOT NULL,
  	"lead_text" varchar DEFAULT 'Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca veri sorumlusu sıfatıyla Localhost Uşak Bağımsız Teknoloji ve Yazılım Topluluğu (“Localhost Uşak” veya “Topluluk”) tarafından; web sitemizi (localhostusak.com) ziyaret edenlerin, topluluk üyelerimizin, fiziki etkinlik ve coworking buluşmalarına katılan yazılımcı ve öğrencilerin, projelerini sergileyen ve kariyer panosunu kullanan paydaşlarımızın aydınlatılması amacıyla hazırlanmıştır.' NOT NULL,
  	"callouts_photo_video_title" varchar DEFAULT 'Önemli Bilgilendirme: Etkinlik Fotoğraf ve Video Çekimleri',
  	"callouts_photo_video_text" varchar DEFAULT 'Localhost Uşak etkinlikleri, Uşak yerelindeki teknoloji ekosistemini görünür kılmak ve açık topluluk ruhunu teşvik etmek amacıyla fotoğraflanmakta ve kayda alınmaktadır. Bu görsel/işitsel materyaller; ticari olmayan amaçlarla, topluluğu tanıtmak, yapılan atölyeleri arşivlemek ve katılımcıların başarılarını paylaşmak üzere resmi web sitemizde (localhostusak.com), sosyal medya kanallarımızda (Instagram, X, LinkedIn, YouTube, GitHub) ve topluluk bültenlerinde süresiz olarak yayınlanabilir.',
  	"callouts_intellectual_property_title" varchar DEFAULT 'Fikri Mülkiyet Teminatı: Kodlar ve Projeler Geliştiriciye Aittir',
  	"callouts_intellectual_property_text" varchar DEFAULT 'Projelerin tüm fikri ve sınai mülkiyet hakları, münhasıran projeyi üreten geliştiriciye, ekibe veya ilgili açık kaynak lisansına aittir. Localhost Uşak; paylaşılan projeleri topluluk vitrininde, web sitesinde, haber bültenlerinde ve sosyal medyada sahibini açıkça belirterek bedelsiz olarak tanıtma, sergileme ve yayınlama hakkına sahiptir.',
  	"consent_badge" varchar DEFAULT 'ETKİNLİK VE TOPLULUK MUVAFAKATNAMESİ',
  	"consent_declaration_text" varchar DEFAULT 'Localhost Uşak Kişisel Verilerin Korunması Aydınlatma Metni ve Etkinlik Muvafakatnamesi''ni okuduğumu, etkinliklerde çekilen fotoğraf/video kayıtlarımın topluluk tanıtımı kapsamında dijital mecralarda yayınlanmasına ve kişisel verilerimin bu metinde belirtilen amaç ve ilkeler doğrultusunda işlenmesine özgür irademle açık rıza veriyorum.' NOT NULL,
  	"consent_date_note" varchar DEFAULT 'Etkinlik / Grup Katılım Anı',
  	"consent_data_controller_name" varchar DEFAULT 'Localhost Uşak',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "general_settings" ALTER COLUMN "meta_site_title" SET DEFAULT 'Uşak Teknoloji ve Yazılım Topluluğu | localhostusak';
  ALTER TABLE "general_settings" ALTER COLUMN "meta_default_description" SET DEFAULT 'Uşak''ta yazılımcılar, mühendisler ve teknoloji meraklıları için açık topluluk. Coworking buluşmaları, açık kaynak projeleri ve kariyer paylaşımları.';
  ALTER TABLE "general_settings" ALTER COLUMN "footer_tagline" SET DEFAULT 'Uşak''ın yerel teknoloji ve yazılım ekosistemini büyüten açık ve bağımsız topluluk.';
  ALTER TABLE "general_settings" ALTER COLUMN "footer_copyright_text" SET DEFAULT '© 2026 localhostusak • Uşak''ta geliştirildi';
  ALTER TABLE "site_settings" ALTER COLUMN "hero_title" SET DEFAULT 'Uşak''ta Teknoloji';
  ALTER TABLE "site_settings" ALTER COLUMN "hero_title_highlight" SET DEFAULT 'Etrafında Buluş';
  ALTER TABLE "site_settings" ALTER COLUMN "hero_subtitle" SET DEFAULT 'CONNECT • BUILD • COLLABORATE • GROW';
  ALTER TABLE "site_settings" ALTER COLUMN "hero_description" SET DEFAULT 'Teknolojiye ilgi duyan, üreten ve gelişmek isteyen insanları bir araya getiren lokal topluluk. Kahveni al, laptopunu getir, masada yerini al.';
  DO $$ BEGIN
    ALTER TABLE "site_settings_vision_messages" ADD CONSTRAINT "site_settings_vision_messages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
  ALTER TABLE "kvkk_settings_sections" ADD CONSTRAINT "kvkk_settings_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."kvkk_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX IF NOT EXISTS "site_settings_vision_messages_order_idx" ON "site_settings_vision_messages" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "site_settings_vision_messages_parent_id_idx" ON "site_settings_vision_messages" USING btree ("_parent_id");
  CREATE INDEX "kvkk_settings_sections_order_idx" ON "kvkk_settings_sections" USING btree ("_order");
  CREATE INDEX "kvkk_settings_sections_parent_id_idx" ON "kvkk_settings_sections" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   -- site_settings_vision_messages canlıda bu migration'dan önce de vardı
  -- (0c3a759 ile oluşturuldu, migration dosyası sonradan silindi) — bu yüzden
  -- down() onu silmiyor.
  ALTER TABLE "kvkk_settings_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "kvkk_settings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "kvkk_settings_sections" CASCADE;
  DROP TABLE "kvkk_settings" CASCADE;
  ALTER TABLE "general_settings" ALTER COLUMN "meta_site_title" SET DEFAULT 'localhostusak — Uşak''ın Teknoloji ve Tasarım Topluluğu';
  ALTER TABLE "general_settings" ALTER COLUMN "meta_default_description" SET DEFAULT 'Uşak''taki yazılımcılar, tasarımcılar, remote çalışanlar ve öğrenciler için açık, samimi ve üretken teknoloji topluluğu. Kahveni al, laptopunu getir!';
  ALTER TABLE "general_settings" ALTER COLUMN "footer_tagline" SET DEFAULT 'Uşak''ın yerel teknoloji, yazılım ve tasarım ekosistemini büyüten açık ve bağımsız topluluk.';
  ALTER TABLE "general_settings" ALTER COLUMN "footer_copyright_text" SET DEFAULT '© 2026 localhostusak • Uşak''ta sevgiyle kodlandı 🧡';
  ALTER TABLE "site_settings" ALTER COLUMN "hero_title" SET DEFAULT 'Uşak''ın Teknoloji ve';
  ALTER TABLE "site_settings" ALTER COLUMN "hero_title_highlight" SET DEFAULT 'Tasarım Topluluğu';
  ALTER TABLE "site_settings" ALTER COLUMN "hero_subtitle" SET DEFAULT 'connect • build • collaborate • grow';
  ALTER TABLE "site_settings" ALTER COLUMN "hero_description" SET DEFAULT 'Kahveni al, laptopunu getir, aramıza katıl. Deneyimli olmak şart değil; merakın ve öğrenme isteğin varsa masada sana da yer var.';`)
}
