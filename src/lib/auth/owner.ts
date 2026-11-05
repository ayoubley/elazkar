import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export interface OwnerCheckResult {
  isOwner: boolean;
  userId: string | null;
  email: string | null;
}

/**
 * Verifies server-side whether the currently logged-in user
 * is the single registered site owner.
 */
export async function verifySiteOwner(): Promise<OwnerCheckResult> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { isOwner: false, userId: null, email: null };
  }

  // Query security definer function is_site_owner()
  const { data: isOwner, error: rpcError } = await supabase.rpc("is_site_owner");

  if (rpcError || !isOwner) {
    // If the database function check fails or returns false,
    // also check backup environment variable SITE_OWNER_USER_ID if configured
    const configuredOwnerId = process.env.SITE_OWNER_USER_ID;
    if (configuredOwnerId && configuredOwnerId === user.id) {
      return { isOwner: true, userId: user.id, email: user.email || null };
    }

    return { isOwner: false, userId: user.id, email: user.email || null };
  }

  return { isOwner: true, userId: user.id, email: user.email || null };
}

/**
 * Strict route protection: ensures caller is the sole owner,
 * otherwise redirects immediately to /admin/login.
 */
export async function requireSiteOwner() {
  const { isOwner } = await verifySiteOwner();

  if (!isOwner) {
    redirect("/admin/login");
  }
}

/**
 * Records an immutable administrative audit log entry.
 */
export async function logAdminAction({
  action,
  entityType,
  entityId,
  details,
}: {
  action: "CREATE" | "UPDATE" | "DELETE" | "PUBLISH" | "UNPUBLISH" | "LOGIN";
  entityType: string;
  entityId?: string;
  details?: Record<string, any>;
}) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from("admin_audit_logs").insert({
      owner_id: user.id,
      action,
      entity_type: entityType,
      entity_id: entityId || null,
      details: details || {},
    });
  } catch (error) {
    console.error("Failed to log admin action:", error);
  }
}
