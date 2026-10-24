import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/visit")({
  head: () => ({
    meta: [
      { title: "Find Degchi — Gulberg, Lahore" },
      {
        name: "description",
        content:
          "Visit Degchi on Mall Road, Gulberg III, Lahore. A Lahore table with a little Shanghai in every sizzle.",
      },
    ],
  }),
  component: VisitPage,
});

function VisitPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const today = new Date();
  const earliestDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  async function reserve(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    try {
      const { error: insertError } = await supabase.from("reservations").insert({
        customer_name: String(form.get("name")),
        phone: String(form.get("phone")),
        visit_date: String(form.get("date")),
        visit_time: String(form.get("time")),
        party_size: Number(form.get("party")),
        notes: String(form.get("notes") ?? "").trim(),
      });
      if (insertError) throw insertError;
      setSubmitted(true);
      formElement.reset();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "We could not save your request. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="public-page">
      <SiteHeader />
      <main className="public-page-main">
        <header className="page-intro">
          <p className="eyebrow">
            <span>欢迎</span> Pull up a chair
          </p>
          <h1>
            Come for the sizzle.
            <br />
            <em>Stay for the company.</em>
          </h1>
          <p>
            Find your table in the heart of Gulberg. The wok is hot, the tea is on, and there's
            always room for one more.
          </p>
        </header>
        <div className="visit-grid">
          <section className="visit-detail">
            <span>Find us · 地址</span>
            <strong>Mall Road, Gulberg III</strong>
            <p>Lahore, Pakistan</p>
          </section>
          <section className="visit-detail">
            <span>Opening hours · 营业时间</span>
            <strong>Tuesday – Sunday</strong>
            <p>12pm – 11pm · Closed Mondays</p>
          </section>
          <section className="visit-detail">
            <span>Reservations · 预订</span>
            <strong>Save your place</strong>
            <p>Send a request below and our team will confirm your table.</p>
          </section>
        </div>
        <section className="reservation-section" id="reserve">
          <div>
            <p className="eyebrow">
              <span>预订餐桌</span> Reservations
            </p>
            <h2>
              Let us set <em>your place.</em>
            </h2>
            <p>Come as you are, bring the whole family, and order one more dish for the middle.</p>
          </div>
          {submitted ? (
            <div className="reservation-success" role="status">
              <strong>Request received · 已收到</strong>
              <p>Thank you. The Degchi team will be in touch to confirm your table.</p>
              <button
                className="button button-gold"
                onClick={() => setSubmitted(false)}
                type="button"
              >
                Make another request
              </button>
            </div>
          ) : (
            <form className="site-form reservation-form" onSubmit={reserve}>
              <label>
                Your name
                <input autoComplete="name" name="name" required maxLength={100} />
              </label>
              <label>
                Phone number
                <input
                  autoComplete="tel"
                  name="phone"
                  type="tel"
                  required
                  maxLength={30}
                  placeholder="+92 …"
                />
              </label>
              <label>
                Date
                <input name="date" type="date" required min={earliestDate} />
              </label>
              <label>
                Time
                <input name="time" type="time" required min="12:00" max="22:30" />
              </label>
              <label>
                Guests
                <select name="party" defaultValue="2">
                  {Array.from({ length: 12 }, (_, index) => (
                    <option key={index + 1} value={index + 1}>
                      {index + 1} {index === 0 ? "guest" : "guests"}
                    </option>
                  ))}
                </select>
              </label>
              <label className="form-wide">
                Anything we should know?
                <textarea
                  name="notes"
                  rows={3}
                  maxLength={500}
                  placeholder="A celebration, dietary needs, or a favourite table…"
                />
              </label>
              {error && (
                <p className="form-error form-wide" role="alert">
                  We couldn’t submit that request: {error}
                </p>
              )}
              <button
                className="button button-gold form-wide"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? "Sending request…" : "Request a table"}
                <span aria-hidden>↗</span>
              </button>
              <p className="form-footnote form-wide">
                Your request is pending until our team confirms it.
              </p>
            </form>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
