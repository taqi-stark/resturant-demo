import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { menuQuery } from "@/lib/menu-queries";
import { fallbackMenu } from "@/lib/menu-fallback";
import { rupees } from "@/lib/format";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "The Menu — Degchi Lahore" },
      {
        name: "description",
        content:
          "Explore the Degchi table: Lahore favorites, wok-fired classics and dishes made to share.",
      },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  const { data, isFetching, isError, refetch } = useQuery({ ...menuQuery, retry: false });
  const liveMenu = data && data.categories.length > 0 && data.items.length > 0 ? data : undefined;
  const liveMenuIsReady = Boolean(liveMenu);
  const categories = liveMenu ? liveMenu.categories : fallbackMenu.categories;
  const items = liveMenu ? liveMenu.items : fallbackMenu.items;
  const hasFusionCategory = categories.some((category) => category.name === "Pak-Chinese Wok");
  const displayCategories =
    liveMenuIsReady && !hasFusionCategory
      ? [...categories, { id: "local-fusion", name: "Pak-Chinese Wok", sort_order: 6 }]
      : categories;
  const displayItems =
    liveMenuIsReady && !hasFusionCategory
      ? [...items, ...fallbackMenu.items.filter((item) => item.category_id === "local-fusion")]
      : items;

  return (
    <div className="public-page">
      <SiteHeader />
      <main className="public-page-main">
        <header className="page-intro">
          <p className="eyebrow">
            <span>菜单</span> The Degchi table
          </p>
          <h1>
            Good food brings <em>us together.</em>
          </h1>
          <p>
            Pakistani favorites, Chinese kitchen craft, and plates made for the middle of the table.
            Prices in Pakistani rupees.
          </p>
        </header>

        <>
          {(!liveMenuIsReady || isError) && (
            <div className="menu-status" role="status">
              <span>{isFetching ? "House menu · updating" : "House menu"}</span>
              <span>
                {isFetching
                  ? "Showing our dishes while we check for live menu updates."
                  : "Showing our house menu while the live menu is unavailable."}
              </span>
              <button disabled={isFetching} onClick={() => void refetch()} type="button">
                {isFetching ? "Checking…" : "Retry live menu"}
              </button>
            </div>
          )}
          <div className="menu-grid">
            {displayCategories.map((category) => (
              <section className="menu-category" key={category.id}>
                <h2>{category.name}</h2>
                {displayItems
                  .filter((item) => item.category_id === category.id)
                  .map((item) => (
                    <div key={item.id} className="menu-row">
                      <div>
                        <p className="menu-name">
                          {item.name}
                          {!item.is_available && (
                            <span className="ml-2 font-mono text-[9px] uppercase tracking-[0.12em] text-ink-muted">
                              Off tonight
                            </span>
                          )}
                        </p>
                        {item.description && <p className="menu-description">{item.description}</p>}
                      </div>
                      <span className="menu-price">{rupees(item.price)}</span>
                    </div>
                  ))}
              </section>
            ))}
          </div>
        </>
      </main>
      <SiteFooter />
    </div>
  );
}
