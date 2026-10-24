import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <span>德吉 · DE GHI</span>
      <span>© 2026 · Lahore, Pakistan</span>
      <span>好好吃饭 · Eat well, together</span>
      <Link to="/auth">Staff sign in</Link>
    </footer>
  );
}
