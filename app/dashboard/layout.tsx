import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getProfile } from "@/lib/db/profile.service";

/**
 * Dashboard layout — wraps all /dashboard/* sub-routes with the
 * authenticated sidebar shell. Auth check happens here so sub-pages
 * don't need to repeat it.
 *
 * Also fetches user profile (credits/plan) and passes to DashboardShell
 * so the credit widgets and upgrade modal work correctly.
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

  // Fetch Supabase profile (creates it if first login)
  const profile = await getProfile();

  return (
    <DashboardShell
      name={name}
      email={email}
      avatarUrl={avatarUrl}
      credits={profile?.credits ?? 100}
      plan={profile?.plan ?? "free"}
    >
      {children}
    </DashboardShell>
  );
}
