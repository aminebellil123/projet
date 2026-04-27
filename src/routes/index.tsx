import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DishCard } from "@/components/DishCard";
import { dishes, categories } from "@/data/dishes";
import { regions } from "@/data/regions";
import { Search, ChefHat, Truck, Heart, ArrowRight, Star, MapPin } from "lucide-react";
import heroImg from "@/assets/hero-food.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Diary — Cuisine maison près de chez vous" },
      { name: "description", content: "Découvrez et commandez des plats faits maison par des cuisiniers passionnés. Livraison directe, sans intermédiaire." },
      { property: "og:title", content: "Diary — Cuisine maison près de chez vous" },
      { property: "og:description", content: "Plats faits maison par des cuisiniers passionnés près de chez vous." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const popular = dishes.slice(0, 6);
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [region, setRegion] = useState("all");

  return (
    <div className="min-h-screen">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="Plats faits maison"
            width={1600}
            height={1200}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-hero-overlay" />
          <div className="absolute inset-0 bg-background/30" />
        </div>

        <div className="relative mx-auto flex min-h-[640px] max-w-7xl flex-col items-start justify-center px-4 py-20 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background/80 px-4 py-1.5 text-xs font-semibold text-primary backdrop-blur">
            <Heart className="h-3.5 w-3.5 fill-primary" />
            Cuisine 100% faite maison
          </span>

          <h1 className="mt-6 max-w-3xl font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Le goût du <span className="text-gradient-warm">fait maison</span>,
            <br />
            livré près de chez vous
          </h1>

          <p className="mt-6 max-w-xl text-lg text-foreground/80">
            Des plats préparés avec passion par des cuisiniers de votre quartier.
            Commandez, contactez, savourez.
          </p>

          {/* Search */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigate({
                to: "/plats",
                search: {
                  q: q || undefined,
                  region: region !== "all" ? region : undefined,
                },
              });
            }}
            className="mt-8 flex w-full max-w-2xl flex-col gap-2 rounded-3xl border border-border bg-card p-2 shadow-card sm:flex-row sm:items-center sm:rounded-full"
          >
            <div className="flex flex-1 items-center gap-3 px-4">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Plat ou nom du cuisinier..."
                className="flex-1 bg-transparent py-2 text-base outline-none placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex items-center gap-2 border-border px-3 sm:border-l">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="bg-transparent py-2 text-sm font-medium outline-none"
                aria-label="Région"
              >
                <option value="all">Toute la Tunisie</option>
                {regions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="flex h-12 items-center justify-center rounded-full bg-gradient-warm px-6 text-sm font-semibold text-primary-foreground shadow-warm transition-smooth hover:opacity-90"
            >
              Rechercher
            </button>
          </form>

          <div className="mt-10 flex flex-wrap items-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-gradient-warm" />
                ))}
              </div>
              <span className="font-medium">+200 cuisiniers vérifiés</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <span className="font-medium">4.8/5 sur +1500 avis</span>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {categories.map((c) => (
            <Link
              key={c.id}
              to="/plats"
              className="flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium shadow-soft transition-smooth hover:border-primary hover:bg-primary hover:text-primary-foreground"
            >
              <span className="text-base">{c.icon}</span>
              {c.label}
            </Link>
          ))}
        </div>
      </section>

      {/* POPULAR DISHES */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Populaires</p>
            <h2 className="mt-1 font-display text-4xl font-bold tracking-tight">Les plats du moment</h2>
          </div>
          <Link
            to="/plats"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-smooth hover:gap-2"
          >
            Voir tous les plats <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((d) => (
            <DishCard key={d.id} dish={d} />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-card/60 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Comment ça marche</p>
            <h2 className="mt-2 font-display text-4xl font-bold tracking-tight">Simple, direct, savoureux</h2>
            <p className="mt-4 text-muted-foreground">
              Une plateforme pensée pour mettre en relation directe cuisiniers et gourmands.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {[
              { icon: Search, title: "Choisissez", desc: "Parcourez les plats faits maison par des cuisiniers près de chez vous." },
              { icon: ChefHat, title: "Commandez", desc: "Le cuisinier reçoit votre commande et prépare votre plat avec soin." },
              { icon: Truck, title: "Dégustez", desc: "Récupérez votre commande ou faites-la livrer en direct. Aucun intermédiaire." },
            ].map((s, i) => (
              <div key={s.title} className="relative rounded-3xl border border-border bg-background p-8 shadow-soft">
                <div className="absolute -top-4 left-8 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-warm font-display text-sm font-bold text-primary-foreground shadow-warm">
                  {i + 1}
                </div>
                <s.icon className="h-8 w-8 text-primary" />
                <h3 className="mt-4 font-display text-2xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA CUISINIER */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-warm p-10 shadow-warm sm:p-16">
          <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-primary-glow/30 blur-3xl" />
          <div className="relative grid items-center gap-8 md:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-background/20 px-4 py-1.5 text-xs font-semibold text-primary-foreground backdrop-blur">
                <ChefHat className="h-3.5 w-3.5" />
                Pour les cuisiniers
              </span>
              <h2 className="mt-4 font-display text-4xl font-bold leading-tight text-primary-foreground sm:text-5xl">
                Partagez votre cuisine avec votre quartier
              </h2>
              <p className="mt-4 text-base text-primary-foreground/90">
                Vendez vos plats faits maison, fixez vos prix, gérez vos commandes.
                Diary s'occupe du reste.
              </p>
              <Link
                to="/cuisinier"
                className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-background px-7 text-sm font-semibold text-primary shadow-card transition-smooth hover:scale-[1.02]"
              >
                Devenir cuisinier <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
