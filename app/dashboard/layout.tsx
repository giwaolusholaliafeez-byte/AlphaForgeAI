import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { TooltipProvider } from "@/components/ui/tooltip";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/sign-in");
  }

  // Keep existing deployments usable if the additive profiles migration has not run yet.
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!profileError && !profile?.user_type) redirect("/onboarding");

  const fullName = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";

  return (
    <TooltipProvider delayDuration={150}>
      <div className="min-h-screen bg-[#0B0F1A]">
        <DashboardSidebar />
        <div className="md:pl-56">
          <DashboardHeader user={{ email: user.email!, fullName }} />
          <main className="p-4 md:p-6 max-w-[1600px] mx-auto">
            {children}
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
