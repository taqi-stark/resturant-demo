import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { menuQuery } from "@/lib/menu-queries";
import { rupees } from "@/lib/format";
import karahiHero from "@/assets/karahi-hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Degchi — Lahore's Pakistani Chinese Kitchen" },
      {
        name: "description",
        content:
          "Lahore wok-fired favorites, Chinese technique and Pakistani spice. Find Degchi on Mall Road, Gulberg.",
      },
      { property: "og:title", content: "Degchi — Lahore × Shanghai" },
      {
        property: "og:description",
        content: "A Lahore table, a red-hot wok, and flavors made to be shared.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { data } = useQuery(menuQuery);
  const tonight = (data?.items ?? []).filter((item) => item.is_available).slice(0, 3);

  return (
    <div className="home-shell">
      <SiteHeader />
      <main>
        <section className="home-panel home-hero">
          <div className="home-hero-copy">
            <p className="eyebrow">
              <span>中餐</span> Lahore · since 1987
            </p>
            <h1>
              Lahore heat.
              <br />
              <em>Shanghai soul.</em>
            </h1>
            <p className="hero-description">
              Chinese wok craft meets the warmth of a Pakistani table. Flame-kissed, generously
              spiced, always made for sharing.
            </p>
            <div className="hero-actions">
              <Link to="/visit" className="button button-gold">
                Reserve your table <span aria-hidden>↗</span>
              </Link>
              <Link to="/menu" className="button button-outline">
                Explore the menu
              </Link>
            </div>
            <div className="hero-note">
              <span className="live-dot" /> Mall Road, Gulberg III{" "}
              <span className="note-divider">·</span> Open till 11
            </div>
            <div className="hero-seal" aria-hidden="true">
              味
            </div>
          </div>
          <div className="hero-film-frame">
            <video
              className="hero-film"
              src="/lahore-wok-reel.mp4"
              poster={karahiHero}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="A close-up reel of freshly prepared food"
            />
            <div className="film-shade" />
            <div className="film-caption">
              <span className="film-chinese">火候 · 味道</span>
              <span>Made over fire, served with heart</span>
            </div>
            <div className="film-index">
              <span>01</span> / 04 · THE DEGCHI TABLE
            </div>
          </div>
          <a href="#the-table" className="scroll-cue">
            <span /> Scroll to savour
          </a>
        </section>

        <section className="home-panel table-panel" id="the-table">
          <div className="table-heading">
            <p className="eyebrow">
              <span>香</span> From our kitchen
            </p>
            <h2>
              Wok-fired.
              <br />
              <em>Lahore-loved.</em>
            </h2>
            <p className="section-copy">
              A little Shanghai in the sizzle. A lot of Lahore in the seasoning. Pull up a chair and
              pass the plates.
            </p>
            <Link to="/menu" className="text-link">
              Discover our menu <span aria-hidden>↗</span>
            </Link>
          </div>
          <div className="signature-card">
            <img src={karahiHero} alt="A richly spiced dish served in a hammered copper pot" />
            <div className="signature-label">
              <span>HOUSE FAVORITE · 招牌菜</span>
              <strong>Fire, spice &amp; everything shared.</strong>
            </div>
          </div>
          <div className="tonight-card">
            <div className="tonight-title">
              <span>On the table tonight</span>
              <span>今夜</span>
            </div>
            {tonight.length ? (
              tonight.map((item, index) => (
                <div key={item.id} className="tonight-item">
                  <span className="tonight-number">0{index + 1}</span>
                  <span className="tonight-name">{item.name}</span>
                  <span className="tonight-price">{rupees(item.price)}</span>
                </div>
              ))
            ) : (
              <p className="menu-loading">Fresh from the kitchen menu.</p>
            )}
            <Link to="/menu" className="text-link">
              See everything <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="section-stamp" aria-hidden="true">
            鼎
          </div>
        </section>

        <section className="home-panel lahore-panel">
          <div className="lahore-pattern" aria-hidden="true" />
          <div className="lahore-copy">
            <p className="eyebrow">
              <span>家</span> A Lahore story
            </p>
            <h2>
              Two cultures.
              <br />
              <em>One table.</em>
            </h2>
            <p className="section-copy">
              Born in Lahore and inspired by the Chinese kitchens that found a home here, Degchi
              brings wok technique, local warmth and a generous pinch of Punjabi spirit together.
              Since 1987, the best seat has always been the one shared.
            </p>
            <Link to="/story" className="button button-dark">
              Our story <span aria-hidden>↗</span>
            </Link>
          </div>
          <div
            className="lahore-art"
            role="img"
            aria-label="A Lahore-inspired decorative medallion"
          >
            <div className="art-ring art-ring-outer" />
            <div className="art-ring art-ring-inner" />
            <span className="art-kanji">福</span>
            <span className="art-caption">Lahore · لاہور</span>
          </div>
          <div className="story-footnote">
            <span>慢火细作</span> Slow fire, generous spirit
          </div>
        </section>

        <section className="home-panel visit-panel">
          <div className="visit-topline">
            <span>THE DEGCHI TABLE · LAHORE</span>
            <span>04 — 04</span>
          </div>
          <div className="visit-content">
            <p className="eyebrow">
              <span>欢迎</span> Your seat is waiting
            </p>
            <h2>
              Come hungry.
              <br />
              <em>Leave together.</em>
            </h2>
            <p className="section-copy">Mall Road, Gulberg III · Lahore, Pakistan</p>
            <div className="visit-hours">
              <span>Tue – Sun</span>
              <span>12pm – 11pm</span>
              <span>Closed Mondays</span>
            </div>
            <Link to="/visit" className="button button-gold">
              Plan your visit <span aria-hidden>↗</span>
            </Link>
          </div>
          <SiteFooter />
          <span className="visit-monogram" aria-hidden="true">
            德
          </span>
        </section>
      </main>
    </div>
  );
}
