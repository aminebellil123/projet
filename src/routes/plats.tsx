import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DishCard } from "@/components/DishCard";
import { categories } from "@/data/dishes";
import { useDishes } from "@/context/DishesContext";
import { regions } from "@/data/regions";
import { Search, SlidersHorizontal, MapPin, X } from "lucide-react";

type PlatsSearch = { q?: string; region?: string; cat?: string };

export const Route = createFileRoute("/plats")({
  validateSearch: (search: Record<string, unknown>): PlatsSearch => ({
    q: typeof search.q === "string" && search.q ? search.q : undefined,
    region: typeof search.region === "string" && search.region !== "all" ? search.region : undefined,
    cat: typeof search.cat === "string" && search.cat !== "all" ? search.cat : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Tous les plats — Diary" },
      { name: "description", content: "Parcourez tous les plats faits maison disponibles près de chez vous sur Diary." },
      { property: "og:title", content: "Tous les plats — Diary" },
      { property: "og:description", content: "Découvrez la cuisine maison de votre quartier." },
    ],
  }),
  component: PlatsPage,
});

function PlatsPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/plats" });
  const { approvedDishes } = useDishes();

  const [query, setQuery] = useState(search.q ?? "");
  const [cat, setCat] = useState(search.cat ?? "all");
  const [region, setRegion] = useState(search.region ?? "all");
  const [sort, setSort] = useState<"note" | "prix-asc" | "prix-desc">("note");

  // Sync URL → state when search params change (e.g., navigation from header)
  useEffect(() => {
    setQuery(search.q ?? "");
    setCat(search.cat ?? "all");
    setRegion(search.region ?? "all");
  }, [search.q, search.cat, search.region]);

  // Persist filter changes to URL
  useEffect(() => {
    navigate({
      search: {
        q: query || undefined,
        cat: cat !== "all" ? cat : undefined,
        region: region !== "all" ? region : undefined,
      },
      replace: true,
    });
  }, [query, cat, region, navigate]);

  const q = query.trim().toLowerCase();
  let filtered = approvedDishes.filter((d) => {
    if (cat !== "all" && d.categorie !== cat) return false;
    if (region !== "all" && d.ville !== region) return false;
    if (q) {
      const matchNom = d.nom.toLowerCase().includes(q);
      const matchChef = d.cuisinier.toLowerCase().includes(q);
      const matchDesc = d.description.toLowerCase().includes(q);
      if (!matchNom && !matchChef && !matchDesc) return false;
    }
    return true;
  });
  filtered = [...filtered].sort((a, b) => {
    if (sort === "note") return b.note - a.note;
    if (sort === "prix-asc") return a.prix - b.prix;
    return b.prix - a.prix;
  });

  return (
    <div className="min-h-screen">
      <Header />

      <section className="border-b border-border/60 bg-card/40">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Découvrez la cuisine du quartier
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            {filtered.length} plat{filtered.length > 1 ? "s" : ""} fait{filtered.length > 1 ? "s" : ""} maison disponible{filtered.length > 1 ? "s" : ""}
          </p>

          <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="flex flex-1 items-center gap-3 rounded-full border border-border bg-card px-5 py-2 shadow-soft">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un plat ou un cuisinier..."
                className="flex-1 bg-transparent py-2 outline-none placeholder:text-muted-foreground"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="rounded-full p-1 text-muted-foreground transition-smooth hover:bg-muted hover:text-foreground"
                  aria-label="Effacer la recherche"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 shadow-soft">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="bg-transparent py-1.5 text-sm font-medium outline-none"
                aria-label="Filtrer par région"
              >
                <option value="all">Toute la Tunisie</option>
                {regions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 shadow-soft">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="bg-transparent py-1.5 text-sm font-medium outline-none"
                aria-label="Trier"
              >
                <option value="note">Mieux notés</option>
                <option value="prix-asc">Prix croissant</option>
                <option value="prix-desc">Prix décroissant</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setCat(c.id)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-smooth ${
                  cat === c.id
                    ? "border-primary bg-primary text-primary-foreground shadow-warm"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                <span>{c.icon}</span>
                {c.label}
              </button>
            ))}
          </div>

          {(query || region !== "all" || cat !== "all") && (
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-muted-foreground">Filtres actifs :</span>
              {query && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-primary">
                  « {query} »
                </span>
              )}
              {region !== "all" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-primary">
                  <MapPin className="h-3 w-3" />
                  {region}
                </span>
              )}
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setRegion("all");
                  setCat("all");
                }}
                className="ml-2 text-xs font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
              >
                Réinitialiser
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-lg text-muted-foreground">Aucun plat ne correspond à votre recherche.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((d) => (
              <DishCard key={d.id} dish={d} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
