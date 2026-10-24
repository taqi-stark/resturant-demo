import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Staff sign in — Degchi Lahore" }] }),
  component: StaffSignInPage,
});

function StaffSignInPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      await navigate({ to: "/admin", replace: true });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Sign in failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="public-page">
      <SiteHeader />
      <main className="public-page-main auth-main">
        <section className="form-panel">
          <p className="eyebrow">
            <span>员工入口</span> Degchi team
          </p>
          <h1>
            Welcome <em>back.</em>
          </h1>
          <p className="form-intro">
            Sign in with the account provided by your Degchi administrator.
          </p>
          <form className="site-form" onSubmit={signIn}>
            <label>
              Email address
              <input
                autoComplete="username"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
            <label>
              Password
              <input
                autoComplete="current-password"
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <button className="button button-gold" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Signing in…" : "Sign in to staff"}
              <span aria-hidden>↗</span>
            </button>
          </form>
          <Link className="form-back-link" to="/">
            ← Back to Degchi
          </Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
