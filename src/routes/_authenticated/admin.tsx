import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useStaff } from "@/hooks/use-staff";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

const navItems = [
  { to: "/admin", label: "Register", exact: true },
  { to: "/admin/reservations", label: "Reservations", exact: false },
] as const;

function AdminLayout() {
  const { data: staff, isLoading } = useStaff();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-charcoal font-body text-foreground/90">
      <div className="flex h-14 items-center justify-between border-b border-secondary/15 px-6">
        <div className="flex items-center gap-3">
          <div className="grid size-7 place-items-center rounded-full bg-secondary">
            <span className="font-display text-sm leading-none text-charcoal">鼎</span>
          </div>
          <span className="font-display text-lg">Degchi</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-secondary">
            Staff · POS
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-[11px] text-foreground/50">
            {isLoading
              ? "…"
              : `${staff?.fullName ?? "Staff"} · ${staff?.roles.join(", ") || "no role"}`}
          </span>
          <button
            onClick={signOut}
            className="rounded-full bg-primary/20 px-3 py-1 text-xs transition-colors hover:bg-primary/30"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="flex">
        <aside className="w-52 shrink-0 space-y-1 border-r border-secondary/15 p-3 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.exact }}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-foreground/60 transition-colors hover:bg-primary/10"
              activeProps={{ className: "bg-secondary px-3 py-2.5 font-medium text-charcoal" }}
            >
              {item.label}
            </Link>
          ))}
        </aside>

        <main className="min-w-0 flex-1 p-6">
          {!isLoading && !staff?.isStaff ? (
            <div className="rounded-2xl bg-charcoal-2 p-6">
              <h2 className="font-display text-2xl">No role assigned yet</h2>
              <p className="mt-2 text-sm text-foreground/60">
                Your account is signed in but has not been assigned a staff role yet. Please ask
                your Degchi administrator for access.
              </p>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
}
