import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

/**
 * Dashboard layout — wraps all /dashboard/* sub-routes with the
 * authenticated sidebar shell. Auth check happens here so sub-pages
 * don't need to repeat it (but each page still independently validates
 * the session for server actions / API routes).
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const name =
    user.user_metadata?.full_name ?? user.user_metadata?.name ?? null;
  const email = user.email ?? null;
  const avatarUrl =
    user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null;

  return (
    <DashboardShell name={name} email={email} avatarUrl={avatarUrl}>
      {children}
    </DashboardShell>
  );
}
