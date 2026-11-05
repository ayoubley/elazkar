"use client";

import { useState } from "react";
import { loginOwnerAction } from "./actions";
import { BookOpen, Lock, Mail, Eye, EyeOff, ShieldCheck, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    try {
      const result = await loginOwnerAction(formData);
      if (result && !result.success && result.error) {
        setErrorMessage(result.error);
        setIsSubmitting(false);
      }
    } catch (err: any) {
      // In Next.js, redirect() throws an internal error that Next.js catches to perform the redirect.
      // We re-throw if it's NEXT_REDIRECT
      if (err?.message?.includes("NEXT_REDIRECT")) {
        throw err;
      }
      setErrorMessage("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-site">
      <div className="w-full max-w-md bg-card border border-border-subtle rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-site border border-border-subtle text-accent mb-2 hover:border-accent/40 transition-colors"
          >
            <BookOpen className="w-6 h-6 text-accent" />
          </Link>
          <h1 className="text-2xl font-bold text-primary font-arabic">
            منصـة الأذكــار
          </h1>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-site border border-border-subtle text-xs text-secondary">
            <ShieldCheck className="w-3.5 h-3.5 text-accent" />
            <span>بوابة الإدارة الخاصة بمالك الموقع</span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-primary block">
              البريد الإلكتروني للمالك
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-secondary absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="owner@domain.com"
                className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-site border border-border-subtle text-primary placeholder:text-secondary/60 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-primary block">
              كلمة المرور
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-secondary absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                autoComplete="current-password"
                placeholder="••••••••••••"
                className="w-full pr-10 pl-10 py-2.5 rounded-xl bg-site border border-border-subtle text-primary placeholder:text-secondary/60 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary p-1 cursor-pointer"
                title={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-btn text-btn-text hover:bg-btn-hover font-semibold text-sm transition-all duration-150 cursor-pointer shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>
                {isSubmitting ? "جاري التحقق من الهوية..." : "تسجيل دخول المالك"}
              </span>
            </button>
          </div>
        </form>

        {/* Security Notice */}
        <div className="pt-4 border-t border-border-subtle text-center text-[11px] text-secondary space-y-1">
          <p>
            هذه المنطقة مخصصة حصراً لمالك المنصة، والتسجيل العام معطّل بالكامل.
          </p>
          <Link
            href="/"
            className="inline-block text-accent hover:underline font-medium mt-1"
          >
            ← العودة إلى الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
