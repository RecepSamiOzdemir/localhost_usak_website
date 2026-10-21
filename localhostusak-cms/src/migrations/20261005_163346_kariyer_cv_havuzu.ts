import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Elle düzeltildi: üretici, çok satırlı application_form_privacy_notice varsayılanının devam
  // satırlarına 2 boşluk girinti ekliyordu. Metin koddaki varsayılanla birebir aynı olmalı; girintilemeyin.
  await db.execute(sql`
   CREATE TYPE "public"."enum_job_applications_fields_of_interest" AS ENUM('frontend', 'backend', 'mobile', 'devops', 'uiux', 'other');
  CREATE TYPE "public"."enum_job_applications_experience_level" AS ENUM('intern', 'junior', 'mid', 'senior');
  CREATE TYPE "public"."enum_job_applications_status" AS ENUM('new', 'reviewed', 'contacted', 'archived');
  CREATE TABLE "job_applications_fields_of_interest" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_job_applications_fields_of_interest",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "job_applications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"candidate_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"linkedin_url" varchar,
  	"github_url" varchar,
  	"experience_level" "enum_job_applications_experience_level" NOT NULL,
  	"status" "enum_job_applications_status" DEFAULT 'new' NOT NULL,
  	"notes" varchar,
  	"consent_given" boolean DEFAULT false NOT NULL,
  	"consent_at" timestamp(3) with time zone NOT NULL,
  	"consent_text_version" varchar NOT NULL,
  	"scan_engines" varchar,
  	"ip_hash" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "job_applications_id" integer;
  ALTER TABLE "careers_page_settings" ADD COLUMN "application_form_enabled" boolean DEFAULT false;
  ALTER TABLE "careers_page_settings" ADD COLUMN "application_form_title" varchar DEFAULT 'CV Havuzuna Katıl';
  ALTER TABLE "careers_page_settings" ADD COLUMN "application_form_intro" varchar DEFAULT 'CV’nizi topluluğun yetenek havuzuna ekleyin; uygun iş, staj, freelance veya mentorluk fırsatı olduğunda sizinle iletişime geçelim. Yalnızca PDF, en fazla 5 MB.';
  ALTER TABLE "careers_page_settings" ADD COLUMN "application_form_privacy_notice" varchar DEFAULT 'Veri sorumlusu: Localhost Uşak Bağımsız Teknoloji ve Yazılım Topluluğu (“Localhost Uşak”).

İşlenen veriler: Ad soyad, e-posta, (isteğe bağlı) telefon, LinkedIn ve GitHub bağlantıları, deneyim seviyesi, ilgi alanları, yüklediğiniz CV dosyası ve içeriği, açık rıza tarihi ve rıza metni sürümü. Kötüye kullanımı önlemek için IP adresinizin geri döndürülemez özeti tutulur; ham IP adresi saklanmaz.

Amaç: CV’nizi topluluğun yetenek havuzunda tutmak ve uygun iş, staj, freelance veya mentorluk fırsatlarında sizinle iletişime geçmek.

Toplama yöntemi ve hukuki sebep: Verileriniz bu form aracılığıyla elektronik ortamda toplanır ve KVKK m. 5/1 uyarınca açık rızanıza dayanılarak işlenir. Rıza vermemeniz yalnızca CV havuzuna katılamamanız sonucunu doğurur.

Kimler görebilir: CV’niz Localhost Uşak yönetim ekibi tarafından görüntülenir. Veriler teknik altyapı (barındırma) hizmeti alınan sağlayıcının sunucularında saklanır; sağlayıcı verilere kendi amacıyla erişmez.

Verilerin aktarılması: CV’niz ve başvuru bilgileriniz (ad soyad, e-posta, varsa telefon, LinkedIn/GitHub bağlantıları, deneyim seviyesi, ilgi alanları ve CV dosyanız); yetkinlikleriniz doğrultusunda Uşak’taki sponsor ve iş birliği yaptığımız uygun firmalarla (teknoloji, yazılım ve ilgili sektörlerde faaliyet gösteren işverenler) eşleştirilmek ve size iş, staj, freelance veya mentorluk fırsatı iletmek amacıyla bu firmalara aktarılabilir. Aktarım yalnızca sizinle ilgili bir fırsat olduğunda ve yönetim ekibi aracılığıyla yapılır; firmalar bu verileri kendi işe alım değerlendirmeleri için işler ve ayrıca veri sorumlusu olurlar. IP adresi özetiniz ve rıza kayıtlarınız firmalara aktarılmaz. Verileriniz satılmaz; yasal zorunluluk hâlinde yetkili kamu kurumlarıyla paylaşılabilir.

Yurt dışına aktarım: Verileriniz Türkiye’de bulunan bir sunucuda saklanır ve yurt dışına aktarılmaz. Aktarım yapılacak firmalar Türkiye’de yerleşik firmalardır.

Saklama süresi: Verileriniz rıza tarihinden itibaren en fazla {{retentionYears}} yıl saklanır ve süre dolduğunda yönetim ekibi tarafından silinir. Rızanızı daha önce geri alır veya silinmesini talep ederseniz bu süre beklenmeden silinir.

Uyarı: CV’nizde özel nitelikli kişisel veri (sağlık, din, mezhep, etnik köken, siyasi görüş, dernek/sendika üyeliği, ceza mahkûmiyeti, biyometrik veri vb.), T.C. kimlik numarası veya fotoğraf bulundurmayın.

Yaş ve başvuru sahibi: Bu forma yalnızca 18 yaşını doldurmuş kişiler başvurabilir ve başvuru yalnızca kişinin kendi adına yapılabilir; başkası adına başvuru yapılamaz.

Haklarınız: KVKK m. 11 kapsamında verilerinizin işlenip işlenmediğini öğrenme, bilgi talep etme, düzeltme, silme/yok etme, aktarıldığı kişileri öğrenme ve itiraz etme haklarına sahipsiniz; rızanızı dilediğiniz zaman geri alabilirsiniz (geri alma, daha önce yapılan işlemleri hukuka aykırı hâle getirmez). Talebinizi, /kvkk sayfasındaki KVKK Aydınlatma Metni’nde belirtilen iletişim adresine iletebilirsiniz; başvurular en geç 30 gün içinde yanıtlanır.';
  ALTER TABLE "careers_page_settings" ADD COLUMN "application_form_consent_text" varchar DEFAULT 'CV Havuzu Aydınlatma Metni’ni okudum ve anladım. Kimlik, iletişim ve mesleki bilgilerimle CV’mdeki kişisel verilerimin, Localhost Uşak yetenek havuzunda tutulması, uygun fırsatlarda benimle iletişime geçilmesi ve yetkinliklerime göre Uşak’taki sponsor ve uygun firmalarla eşleştirilip bu firmalara aktarılması amacıyla, rıza tarihinden itibaren en fazla {{retentionYears}} yıl süreyle işlenmesine özgür irademle açık rıza veriyorum. 18 yaşını doldurduğumu, bu başvuruyu kendi adıma yaptığımı ve başkası adına başvuru yapmadığımı, paylaştığım bilgilerin bana ait ve doğru olduğunu beyan ederim. Rızamı dilediğim zaman geri alabileceğimi biliyorum.';
  ALTER TABLE "careers_page_settings" ADD COLUMN "application_form_consent_version" varchar DEFAULT 'cv-v1';
  ALTER TABLE "careers_page_settings" ADD COLUMN "application_form_retention_years" numeric DEFAULT 2;
  ALTER TABLE "careers_page_settings" ADD COLUMN "application_form_success_message" varchar DEFAULT 'Başvurunuz alındı. CV’niz yetenek havuzumuza eklendi; uygun bir fırsat olduğunda sizinle iletişime geçeceğiz.';
  ALTER TABLE "job_applications_fields_of_interest" ADD CONSTRAINT "job_applications_fields_of_interest_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."job_applications"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "job_applications_fields_of_interest_order_idx" ON "job_applications_fields_of_interest" USING btree ("order");
  CREATE INDEX "job_applications_fields_of_interest_parent_idx" ON "job_applications_fields_of_interest" USING btree ("parent_id");
  CREATE INDEX "job_applications_ip_hash_idx" ON "job_applications" USING btree ("ip_hash");
  CREATE INDEX "job_applications_updated_at_idx" ON "job_applications" USING btree ("updated_at");
  CREATE INDEX "job_applications_created_at_idx" ON "job_applications" USING btree ("created_at");
  CREATE UNIQUE INDEX "job_applications_filename_idx" ON "job_applications" USING btree ("filename");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_job_applications_fk" FOREIGN KEY ("job_applications_id") REFERENCES "public"."job_applications"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_job_applications_id_idx" ON "payload_locked_documents_rels" USING btree ("job_applications_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Elle sıralandı: üretilen sırada "DROP TABLE job_applications CASCADE" FK'yı zaten düşürüyor,
  // ardından gelen DROP CONSTRAINT hata veriyordu (bkz. 20260928_200754_add_team_members).
  await db.execute(sql`
   DROP INDEX "payload_locked_documents_rels_job_applications_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_job_applications_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "job_applications_id";
  ALTER TABLE "job_applications_fields_of_interest" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "job_applications" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "job_applications_fields_of_interest" CASCADE;
  DROP TABLE "job_applications" CASCADE;
  ALTER TABLE "careers_page_settings" DROP COLUMN "application_form_enabled";
  ALTER TABLE "careers_page_settings" DROP COLUMN "application_form_title";
  ALTER TABLE "careers_page_settings" DROP COLUMN "application_form_intro";
  ALTER TABLE "careers_page_settings" DROP COLUMN "application_form_privacy_notice";
  ALTER TABLE "careers_page_settings" DROP COLUMN "application_form_consent_text";
  ALTER TABLE "careers_page_settings" DROP COLUMN "application_form_consent_version";
  ALTER TABLE "careers_page_settings" DROP COLUMN "application_form_retention_years";
  ALTER TABLE "careers_page_settings" DROP COLUMN "application_form_success_message";
  DROP TYPE "public"."enum_job_applications_fields_of_interest";
  DROP TYPE "public"."enum_job_applications_experience_level";
  DROP TYPE "public"."enum_job_applications_status";`)
}
