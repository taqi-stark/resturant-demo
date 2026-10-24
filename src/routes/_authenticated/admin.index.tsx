import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { menuQuery } from "@/lib/menu-queries";
import { rupees, timeOfDay } from "@/lib/format";
import { useStaff } from "@/hooks/use-staff";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: RegisterPage,
});

type TicketLine = { id: string; name: string; price: number; qty: number };

const TAX_RATE = 0.05;

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function RegisterPage() {
  const { data: menu } = useQuery(menuQuery);
  const { data: staff } = useStaff();
  const queryClient = useQueryClient();
  const [tableLabel, setTableLabel] = useState("Table 1");
  const [search, setSearch] = useState("");
  const [lines, setLines] = useState<TicketLine[]>([]);

  const todayQuery = useQuery({
    queryKey: ["today-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, total, status, table_label, created_at")
        .gte("created_at", startOfToday());
      if (error) throw error;
      return data ?? [];
    },
  });

  const stats = useMemo(() => {
    const orders = todayQuery.data ?? [];
    const sales = orders.reduce((sum, o) => sum + Number(o.total), 0);
    const open = orders.filter((o) => o.status === "open").length;
    return {
      sales,
      count: orders.length,
      average: orders.length ? sales / orders.length : 0,
      open,
    };
  }, [todayQuery.data]);

  const items = (menu?.items ?? []).filter(
    (i) => i.is_available && i.name.toLowerCase().includes(search.toLowerCase()),
  );

  const subtotal = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  function addLine(item: { id: string; name: string; price: number }) {
    setLines((prev) => {
      const existing = prev.find((l) => l.id === item.id);
      if (existing) {
        return prev.map((l) => (l.id === item.id ? { ...l, qty: l.qty + 1 } : l));
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, qty: 1 }];
    });
  }

  function changeQty(id: string, delta: number) {
    setLines((prev) =>
      prev.map((l) => (l.id === id ? { ...l, qty: l.qty + delta } : l)).filter((l) => l.qty > 0),
    );
  }

  const sendOrder = useMutation({
    mutationFn: async () => {
      if (!staff?.userId) throw new Error("Not signed in");
      if (lines.length === 0) throw new Error("Ticket is empty");
      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          table_label: tableLabel,
          status: "open",
          subtotal,
          tax,
          total,
          created_by: staff.userId,
        })
        .select("id, ticket_no")
        .single();
      if (error) throw error;

      const { error: lineError } = await supabase.from("order_items").insert(
        lines.map((l) => ({
          order_id: order.id,
          item_name: l.name,
          unit_price: l.price,
          quantity: l.qty,
        })),
      );
      if (lineError) throw lineError;
      return order;
    },
    onSuccess: (order) => {
      toast.success(`Ticket #${order.ticket_no} sent to the kitchen`);
      setLines([]);
      queryClient.invalidateQueries({ queryKey: ["today-orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Today" value={rupees(stats.sales)} />
        <StatCard label="Orders" value={String(stats.count)} />
        <StatCard label="Avg ticket" value={rupees(stats.average)} />
        <StatCard label="Open tickets" value={String(stats.open)} />
      </div>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_340px]">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h3 className="font-display text-2xl">New order ·</h3>
              <input
                value={tableLabel}
                onChange={(e) => setTableLabel(e.target.value)}
                className="w-32 rounded-lg bg-charcoal-2 px-3 py-1.5 font-display text-xl outline-none ring-1 ring-secondary/15 focus:ring-copper"
              />
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search to add…"
              className="rounded-lg bg-charcoal-2 px-3 py-1.5 font-mono text-xs text-foreground/80 outline-none ring-1 ring-secondary/15 placeholder:text-foreground/40 focus:ring-copper"
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {items.map((item) => {
              const inTicket = lines.some((l) => l.id === item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => addLine(item)}
                  className={`rounded-xl bg-charcoal-2 p-3 text-left ring-1 transition ${
                    inTicket ? "ring-copper" : "ring-secondary/10 hover:ring-copper/40"
                  }`}
                >
                  <p className="font-display text-lg leading-tight">{item.name}</p>
                  <p
                    className={`mt-1 font-mono text-xs ${inTicket ? "text-secondary" : "text-foreground/50"}`}
                  >
                    {rupees(item.price)}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="sticky top-4 rounded-2xl bg-charcoal-2 p-5">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-secondary">
              Current ticket
            </p>
            <span className="font-mono text-xs text-foreground/40">
              {timeOfDay(new Date().toISOString())}
            </span>
          </div>
          <div className="mt-4 divide-y divide-secondary/15 text-sm">
            {lines.length === 0 && (
              <p className="py-4 text-foreground/40">Tap a dish to start the ticket.</p>
            )}
            {lines.map((line) => (
              <div key={line.id} className="flex items-center justify-between gap-2 py-2">
                <span className="min-w-0 flex-1 truncate">{line.name}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => changeQty(line.id, -1)}
                    className="size-6 rounded-md bg-primary/20 text-xs hover:bg-primary/30"
                  >
                    −
                  </button>
                  <span className="w-6 text-center font-mono text-xs">{line.qty}</span>
                  <button
                    onClick={() => changeQty(line.id, 1)}
                    className="size-6 rounded-md bg-primary/20 text-xs hover:bg-primary/30"
                  >
                    +
                  </button>
                </div>
                <span className="w-20 text-right font-mono">{rupees(line.price * line.qty)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-1 border-t border-secondary/15 pt-3 font-mono text-xs text-foreground/60">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{rupees(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST 5%</span>
              <span>{rupees(tax)}</span>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-secondary/15 pt-3 font-display text-2xl">
            <span>Total</span>
            <span>{rupees(total)}</span>
          </div>
          <button
            onClick={() => sendOrder.mutate()}
            disabled={sendOrder.isPending || lines.length === 0}
            className="mt-4 w-full rounded-xl bg-secondary py-3 font-semibold text-charcoal transition-opacity disabled:opacity-40"
          >
            {sendOrder.isPending ? "Sending…" : "Send to kitchen"}
          </button>
        </div>
      </div>
    </>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-charcoal-2 p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-foreground/40">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl">{value}</p>
    </div>
  );
}
