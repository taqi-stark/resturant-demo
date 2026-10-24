import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/reservations")({
  component: ReservationInbox,
});

function ReservationInbox() {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const reservations = useQuery({
    queryKey: ["reservations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reservations")
        .select("*")
        .order("visit_date", { ascending: true })
        .order("visit_time", { ascending: true });
      if (error) throw error;
      return data;
    },
    retry: false,
  });
  const reservationList = reservations.data ?? [];

  async function updateStatus(id: string, status: "confirmed" | "declined") {
    setMessage("");
    const { error } = await supabase.from("reservations").update({ status }).eq("id", id);
    if (error) {
      setMessage(`Could not update this request: ${error.message}`);
      return;
    }
    setMessage(`Reservation ${status}.`);
    await queryClient.invalidateQueries({ queryKey: ["reservations"] });
  }

  return (
    <section className="space-y-5">
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-secondary">
          预订 · Guest requests
        </p>
        <h1 className="mt-2 font-display text-4xl text-foreground">Reservations</h1>
        <p className="mt-2 text-sm text-foreground/60">
          Review table requests and update their status.
        </p>
      </header>
      {message && (
        <p
          className="rounded-xl border border-secondary/15 bg-primary/10 p-3 text-sm"
          role="status"
        >
          {message}
        </p>
      )}
      {reservations.isLoading ? (
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-foreground/50">
          Loading reservations…
        </p>
      ) : reservations.isError ? (
        <div className="rounded-2xl border border-secondary/15 bg-charcoal-2 p-5">
          <p className="text-sm text-foreground/70">
            Could not load reservations: {reservations.error.message}
          </p>
          <button
            className="mt-4 rounded-full bg-secondary px-4 py-2 text-sm text-charcoal"
            onClick={() => void reservations.refetch()}
            type="button"
          >
            Try again
          </button>
        </div>
      ) : reservationList.length === 0 ? (
        <p className="rounded-2xl border border-secondary/15 bg-charcoal-2 p-5 text-sm text-foreground/60">
          No table requests yet.
        </p>
      ) : (
        <div className="grid gap-3">
          {reservationList.map((reservation) => (
            <article
              className="grid gap-4 rounded-2xl border border-secondary/15 bg-charcoal-2 p-5 md:grid-cols-[1fr_auto] md:items-center"
              key={reservation.id}
            >
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-display text-2xl">{reservation.customer_name}</h2>
                  <span className="rounded-full bg-primary/20 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-secondary">
                    {reservation.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-foreground/70">
                  {reservation.visit_date} · {reservation.visit_time.slice(0, 5)} ·{" "}
                  {reservation.party_size} guests · {reservation.phone}
                </p>
                {reservation.notes && (
                  <p className="mt-2 text-sm text-foreground/50">{reservation.notes}</p>
                )}
              </div>
              {reservation.status === "pending" && (
                <div className="flex gap-2">
                  <button
                    className="rounded-full bg-secondary px-4 py-2 text-xs font-medium text-charcoal"
                    onClick={() => void updateStatus(reservation.id, "confirmed")}
                    type="button"
                  >
                    Confirm
                  </button>
                  <button
                    className="rounded-full border border-secondary/25 px-4 py-2 text-xs text-foreground/70 hover:bg-primary/10"
                    onClick={() => void updateStatus(reservation.id, "declined")}
                    type="button"
                  >
                    Decline
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
