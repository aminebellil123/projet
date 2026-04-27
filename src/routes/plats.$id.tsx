import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getDish, dishes } from "@/data/dishes";
import { Star, Clock, MapPin, ChefHat, ArrowLeft, ShoppingBag, ShieldCheck, Plus, Minus, Check } from "lucide-react";
import { DishCard } from "@/components/DishCard";
import { useCart } from "@/context/CartContext";
import { useReviews } from "@/context/ReviewsContext";
import { ReviewsSection } from "@/components/ReviewsSection";

export const Route = createFileRoute("/plats/$id")({
  loader: ({ params }) => {
    const dish = getDish(params.id);
    if (!dish) throw notFound();
    return { dish };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.dish.nom} — Diary` },
          { name: "description", content: loaderData.dish.description },
          { property: "og:title", content: `${loaderData.dish.nom} — Diary` },
          { property: "og:description", content: loaderData.dish.description },
          { property: "og:image", content: loaderData.dish.image },
          { property: "twitter:image", content: loaderData.dish.image },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen">
      <Header />
      <div className="mx-auto max-w-2xl px-4 py-32 text-center">
        <h1 className="font-display text-4xl font-bold">Plat introuvable</h1>
        <p className="mt-4 text-muted-foreground">Ce plat n'existe pas ou n'est plus disponible.</p>
        <Link to="/plats" className="mt-6 inline-flex h-11 items-center rounded-full bg-gradient-warm px-6 font-semibold text-primary-foreground shadow-warm">
          Voir tous les plats
        </Link>
      </div>
      <Footer />
    </div>
  ),
  component: DishDetail,
});

function DishDetail() {
  const { dish } = Route.useLoaderData();
  const similar = dishes.filter((d) => d.id !== dish.id && d.categorie === dish.categorie && (d.status ?? "approved") === "approved").slice(0, 3);
  const { add } = useCart();
  const { getStatsForDish } = useReviews();
  const stats = getStatsForDish(dish.id, dish.note, dish.avis);
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    add({ dishId: dish.id, nom: dish.nom, prix: dish.prix, image: dish.image, cuisinier: dish.cuisinier, ville: dish.ville }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleOrderNow = () => {
    add({ dishId: dish.id, nom: dish.nom, prix: dish.prix, image: dish.image, cuisinier: dish.cuisinier, ville: dish.ville }, qty);
    navigate({ to: "/panier" });
  };

  return (
    <div className="min-h-screen">
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to="/plats"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-smooth hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Retour aux plats
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl shadow-card">
            <img
              src={dish.image}
              alt={dish.nom}
              width={800}
              height={800}
              className="aspect-square w-full object-cover"
            />
          </div>

          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                {dish.categorie}
              </span>
              <span className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <strong>{stats.note}</strong>
                <span className="text-muted-foreground">({stats.avis} avis)</span>
              </span>
            </div>

            <h1 className="mt-3 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              {dish.nom}
            </h1>

            <p className="mt-4 text-lg text-muted-foreground">{dish.description}</p>

            <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> {dish.temps}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" /> {dish.ville}
              </span>
            </div>

            {/* Ingrédients */}
            <div className="mt-8">
              <h2 className="font-display text-lg font-semibold">Ingrédients</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {dish.ingredients.map((ing: string) => (
                  <span key={ing} className="rounded-full bg-secondary px-3 py-1 text-sm">{ing}</span>
                ))}
              </div>
            </div>

            {dish.allergenes.length > 0 && (
              <div className="mt-6">
                <h2 className="font-display text-lg font-semibold">Allergènes</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Contient : {dish.allergenes.join(", ")}
                </p>
              </div>
            )}

            {/* Cuisinier */}
            <div className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-warm shadow-warm">
                  <ChefHat className="h-7 w-7 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-display text-lg font-semibold">{dish.cuisinier}</p>
                    <ShieldCheck className="h-4 w-4 text-success" />
                  </div>
                  <p className="text-sm text-muted-foreground">{dish.cuisinierBio}</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Prix unitaire</p>
                  <p className="font-display text-3xl font-bold text-primary">{dish.prix} DT</p>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-border bg-background">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="flex h-10 w-10 items-center justify-center rounded-l-full hover:bg-muted">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="min-w-[28px] text-center font-semibold">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="flex h-10 w-10 items-center justify-center rounded-r-full hover:bg-muted">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <button
                  onClick={handleAdd}
                  className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-primary bg-background px-5 text-sm font-semibold text-primary transition-smooth hover:bg-primary/5"
                >
                  {added ? (<><Check className="h-4 w-4" /> Ajouté !</>) : (<><Plus className="h-4 w-4" /> Ajouter au panier</>)}
                </button>
                <button
                  onClick={handleOrderNow}
                  className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-gradient-warm px-5 text-sm font-semibold text-primary-foreground shadow-warm transition-smooth hover:opacity-90"
                >
                  <ShoppingBag className="h-4 w-4" /> Commander — {(dish.prix * qty).toFixed(2)} DT
                </button>
              </div>
            </div>
          </div>
        </div>

        <ReviewsSection dishId={dish.id} />

        {similar.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-3xl font-bold tracking-tight">À découvrir aussi</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((d) => (
                <DishCard key={d.id} dish={d} />
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
}
