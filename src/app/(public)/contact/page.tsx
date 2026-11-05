"use client";

import { useState } from "react";
import { PublicShell } from "@/components/layout/public-shell";
import { Mail, Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    honeypot: "", // anti-spam bot trap
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formState.honeypot) return; // bot detected silently

    if (!formState.name.trim() || !formState.email.trim() || !formState.message.trim()) {
      setStatus("error");
      setErrorMessage("يرجى ملء جميع الحقول المطلوبة.");
      return;
    }

    setStatus("submitting");

    // Simulate sending message safely
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setStatus("success");
      setFormState({ name: "", email: "", subject: "", message: "", honeypot: "" });
    } catch {
      setStatus("error");
      setErrorMessage("حدث خطأ أثناء الإرسال، يرجى المحاولة لاحقاً.");
    }
  };

  return (
    <PublicShell>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="p-6 md:p-8 bg-card border border-border-subtle rounded-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-semibold mb-2">
            <Mail className="w-3.5 h-3.5" />
            <span>تواصل واقتراحات</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary font-arabic mb-2">
            تواصـل معنـا
          </h1>
          <p className="text-secondary text-sm leading-relaxed">
            نرحب بأي تصويب علمي أو اقتراح لتطوير منصة الأذكــار وخدمة مستخدميها.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 md:p-8 bg-card border border-border-subtle rounded-2xl space-y-4 shadow-xs"
        >
          {/* Honeypot field for bots */}
          <input
            type="text"
            name="website_feedback_url"
            value={formState.honeypot}
            onChange={(e) => setFormState({ ...formState, honeypot: e.target.value })}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          {status === "success" && (
            <div className="p-4 rounded-xl bg-accent/15 border border-accent/30 text-accent flex items-center gap-3 text-sm">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>
                تم إرسال رسالتك بنجاح، جزاكم الله خيراً على تواصلكم واهتمامكم.
              </span>
            </div>
          )}

          {status === "error" && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-3 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-primary block">
                الاسم الكريم <span className="text-accent">*</span>
              </label>
              <input
                type="text"
                required
                value={formState.name}
                onChange={(e) =>
                  setFormState({ ...formState, name: e.target.value })
                }
                placeholder="أدخل اسمك"
                className="w-full px-4 py-2.5 rounded-xl bg-site border border-border-subtle text-primary placeholder:text-secondary/70 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-primary block">
                البريد الإلكتروني <span className="text-accent">*</span>
              </label>
              <input
                type="email"
                required
                value={formState.email}
                onChange={(e) =>
                  setFormState({ ...formState, email: e.target.value })
                }
                placeholder="example@domain.com"
                className="w-full px-4 py-2.5 rounded-xl bg-site border border-border-subtle text-primary placeholder:text-secondary/70 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-primary block">
              موضوع الرسالة
            </label>
            <input
              type="text"
              value={formState.subject}
              onChange={(e) =>
                setFormState({ ...formState, subject: e.target.value })
              }
              placeholder="مثال: تصويب في تخريج حديث / اقتراح ميزة"
              className="w-full px-4 py-2.5 rounded-xl bg-site border border-border-subtle text-primary placeholder:text-secondary/70 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-primary block">
              نص الرسالة <span className="text-accent">*</span>
            </label>
            <textarea
              required
              rows={5}
              value={formState.message}
              onChange={(e) =>
                setFormState({ ...formState, message: e.target.value })
              }
              placeholder="اكتب رسالتك أو ملاحظاتك هنا بتفصيل..."
              className="w-full px-4 py-2.5 rounded-xl bg-site border border-border-subtle text-primary placeholder:text-secondary/70 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 resize-y"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-btn text-btn-text hover:bg-btn-hover font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>
                {status === "submitting" ? "جاري الإرسال..." : "إرسال الرسالة"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </PublicShell>
  );
}
