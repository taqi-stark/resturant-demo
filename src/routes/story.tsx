import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/story")({
  head: () => ({
    meta: [
      { title: "Our Story — Degchi Lahore" },
      {
        name: "description",
        content: "A Lahore-born table where Chinese kitchen craft meets Pakistani warmth.",
      },
    ],
  }),
  component: StoryPage,
});

function StoryPage() {
  return (
    <div className="public-page">
      <SiteHeader />
      <main className="public-page-main">
        <header className="page-intro">
          <p className="eyebrow">
            <span>故事</span> Lahore · since 1987
          </p>
          <h1>
            Two traditions.
            <br />
            <em>A place of our own.</em>
          </h1>
          <p>
            Pakistani Chinese food is part of Lahore's story. We cook with both hands in that
            tradition: one reaching for the wok, the other for home.
          </p>
        </header>
        <div className="story-layout">
          <div className="story-prose">
            <p>
              Our table belongs to Lahore: its long evenings, its open doors, and its belief that a
              meal should always stretch far enough for one more guest.
            </p>
            <p>
              In our kitchen, a fierce wok flame meets the flavors we grew up with. Ginger and
              garlic hit hot oil; green chilli brings a little Lahore warmth; every dish arrives
              ready for the center of the table.
            </p>
            <p>
              We borrow no borders at dinner. We take the care of Chinese cooking and the generosity
              of Pakistani hospitality, then let the two find their own balance.
            </p>
            <Link to="/menu" className="text-link">
              Explore the menu <span aria-hidden>↗</span>
            </Link>
          </div>
          <aside className="story-method">
            <h2>Our way · 我们的做法</h2>
            <div className="method-item">
              <strong>Fire, fast and fierce</strong>
              <span>High heat keeps every bite bright and lively.</span>
            </div>
            <div className="method-item">
              <strong>Spice, with a Lahore hand</strong>
              <span>A fragrant warmth that feels like home.</span>
            </div>
            <div className="method-item">
              <strong>Always another place setting</strong>
              <span>Good food is better when it travels around.</span>
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
