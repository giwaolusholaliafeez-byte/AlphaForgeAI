"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const profileSchema = z.object({ displayName: z.string().trim().min(1).max(80), userType: z.enum(["investor", "trader", "exploring"]) });
export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };
  const parsed = profileSchema.safeParse({ displayName: formData.get("displayName"), userType: formData.get("userType") });
  if (!parsed.success) return { error: "Enter a valid name and preference." };
  const { error } = await supabase.from("profiles").upsert({ user_id: user.id, display_name: parsed.data.displayName, user_type: parsed.data.userType, updated_at: new Date().toISOString() });
  if (error) { console.error("Profile update failed", error); return { error: "Profile could not be saved." }; }
  revalidatePath("/dashboard"); revalidatePath("/dashboard/settings");
  return { success: true };
}
