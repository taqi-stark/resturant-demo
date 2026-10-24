import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type StaffRole = "admin" | "cashier";

export function useStaff() {
  return useQuery({
    queryKey: ["staff-session"],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) return null;

      const [{ data: roles }, { data: profile }] = await Promise.all([
        supabase.from("user_roles").select("role").eq("user_id", user.id),
        supabase.from("staff_profiles").select("full_name").eq("user_id", user.id).maybeSingle(),
      ]);

      const roleList = (roles ?? []).map((r) => r.role as StaffRole);
      return {
        userId: user.id,
        email: user.email ?? "",
        fullName: profile?.full_name || (user.email ?? "").split("@")[0],
        roles: roleList,
        isAdmin: roleList.includes("admin"),
        isStaff: roleList.length > 0,
      };
    },
  });
}
