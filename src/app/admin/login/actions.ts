"use server";

import { createClient } from "@/lib/supabase/server";
import { verifySiteOwner, logAdminAction } from "@/lib/auth/owner";
import { redirect } from "next/navigation";

export interface LoginActionResult {
  success: boolean;
  error?: string;
}

export async function loginOwnerAction(
  formData: FormData
): Promise<LoginActionResult> {
  const email = (formData.get("email") as string)?.trim();
  const password = (formData.get("password") as string)?.trim();

  if (!email || !password) {
    return {
      success: false,
      error: "يرجى إدخال البريد الإلكتروني وكلمة المرور.",
    };
  }

  const supabase = await createClient();

  // Attempt login with Supabase Auth
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    // Return generic error message to prevent account enumeration
    return {
      success: false,
      error: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
    };
  }

  // CRITICAL SECURITY CHECK: Verify if this user is the registered Site Owner
  const { isOwner } = await verifySiteOwner();

  if (!isOwner) {
    // Immediately terminate session if not the sole registered owner
    await supabase.auth.signOut();
    return {
      success: false,
      error: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
    };
  }

  // Log successful login to audit logs
  await logAdminAction({
    action: "LOGIN",
    entityType: "auth",
    entityId: data.user.id,
    details: { email: data.user.email },
  });

  redirect("/admin");
}

export async function logoutOwnerAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
