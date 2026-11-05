# دليل إعداد قاعدة بيانات Supabase وحماية المالك الوحيد
## منصة الأذكــار (Al-Adhkar)

---

### الخطوة الأولى: إنشاء مشروع Supabase
1. اذهب إلى [https://database.new](https://database.new) وأنشئ مشروعاً جديداً باسم **elazkar**.
2. اختر أقرب منطقة خادم جغرافية (مثل Frankfurt / eu-central-1).
3. احفظ كلمة مرور قاعدة البيانات بأمان.

---

### الخطوة الثانية: تطبيق ملف الـ Migration والـ Schema
1. افتح **SQL Editor** من القائمة الجانبية في Supabase Dashboard.
2. انقر على **New Query**.
3. افتح الملف:
   `supabase/migrations/20261105000001_initial_schema.sql`
4. انسخ محتواه بالكامل والصقه في SQL Editor واضغط **Run**.
5. سيتم إنشاء:
   - Schema خاصة غير مكشوفة للعامة باسم `private`.
   - جدول المالك الوحيد `private.site_owner`.
   - دالة الفحص الأمني `public.is_site_owner()`.
   - كافة الجداول: `categories`, `adhkar`, `sources`, `dua_categories`, `duas`, `surahs`, `ayahs`, `site_settings`, `pages`, `content_revisions`, `admin_audit_logs`.
   - سياسات حماية البيانات الدقيقة (RLS) على جميع الجداول.

---

### الخطوة الثالثة: زراعة البيانات الأولية (Seed Data)
1. في SQL Editor، أنشئ استعلاماً جديداً والصق محتوى الملف:
   `supabase/seed.sql`
2. اضغط **Run**.
3. سيتم إدراج:
   - أقسام الأذكار (الصباح، المساء، النوم).
   - الأذكار المعتمدة بتخريجها وفضلها.
   - أقسام الأدعية والأدعية الجامعة.
   - فهرس سور القرآن الـ 114 كاملة وموثقة.
   - المصادر والكتب الحديثية المعتمدة.

---

### الخطوة الرابعة: تعطيل التسجيل العام (منع إنشاء أي حسابات أخرى)
1. من القائمة الجانبية، اذهب إلى **Authentication** ثم **Providers** أو **Sign In / Up**.
2. ابحث عن خيار **Allow new users to sign up** وقم **بإلغاء تفعيله (Disable / Toggle OFF)**.
3. هذا يضمن برمجياً وعلى مستوى محرك المصادقة أنه لن يستطيع أي شخص في العالم إنشاء حساب في الموقع.

---

### الخطوة الخامسة: إنشاء حساب المالك الوحيد يدوياً
1. اذهب إلى **Authentication** -> **Users**.
2. انقر على **Add user** -> **Create user**.
3. أدخل بريدك الإلكتروني الشخصي وكلمة مرور قوية خاصة بك.
4. فعّل خيار **Auto Confirm User?** ثم اضغط **Create user**.
5. بعد إنشاء المستخدم، ستجد عمود **User UID** (عبارة عن نص طويل مثل: `a93b41d2-xxxx-xxxx-xxxx-xxxxxxxxxxxx`).
6. انسخ هذا المعرّف (User UID).

---

### الخطوة السادسة: تسجيل معرّف المالك في السجل المحمي
1. ارجع إلى **SQL Editor** ونفّذ الأمر التالي مع استبدال المعرف:
   ```sql
   INSERT INTO private.site_owner (owner_user_id)
   VALUES ('الصق_معرف_المالك_الذي_نسخته_هنا');
   ```
2. اضغط **Run**.
3. الآن، أصبحت أنت المالك الوحيد المسجل في النظام، ولن يمتلك أي حساب آخر صلاحية القراءة أو التعديل على محتوى الإدارة أو جداول التدقيق.

---

### الخطوة السابعة: ربط المفاتيح في ملف `.env.local`
1. اذهب إلى **Project Settings** -> **API**.
2. انسخ:
   - `Project URL`
   - `Project API Keys` -> `anon / public`
   - `Project API Keys` -> `service_role` (احتفظ به سراً ولا تشاركه أبداً)
3. أنشئ ملف `.env.local` في مجلد المشروع وضع القيم:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsIn...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsIn...
   SITE_OWNER_USER_ID=معرف_المالك_UID
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```
