import { Link } from "@tanstack/react-router";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand-lockup" aria-label="Degchi home">
          <span className="brand-seal">鼎</span>
          <span className="brand-copy">
            <span className="brand-name">Degchi</span>
            <span className="brand-caption">Lahore · Pakistani Chinese</span>
          </span>
        </Link>
        <nav className="site-nav" aria-label="Main navigation">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "is-active" }}>
            Home
          </Link>
          <Link to="/menu" activeProps={{ className: "is-active" }}>
            Menu
          </Link>
          <Link to="/story" activeProps={{ className: "is-active" }}>
            Our story
          </Link>
          <Link to="/visit" activeProps={{ className: "is-active" }}>
            Find us
          </Link>
        </nav>
        <div className="header-actions">
          <Link to="/auth" className="staff-link">
            Staff sign in
          </Link>
          <Link to="/visit" hash="reserve" className="header-booking">
            Book a table <span aria-hidden>↗</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
