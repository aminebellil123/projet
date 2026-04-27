import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ShoppingBag, ArrowLeft, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/panier")({
  head: () => ({
    meta: [
      { title: "Mon panier — Diary" },
      { name: "description", content: "Votre panier de plats faits maison sur Diary." },
    ],
  }),
  component: PanierPage,
});

function PanierPage() {
  const { items, total, setQty, remove } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <Link to="/plats" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Continuer mes achats
          </Link>
          <div className="mt-10 rounded-3xl border border-border bg-card p-12 text-center shadow-soft">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <h1 className="mt-6 font-display text-3xl font-bold">Votre panier est vide</h1>
            <p className="mt-3 text-muted-foreground">Découvrez nos plats faits maison.</p>
            <Link to="/plats" className="mt-8 inline-flex h-12 items-center rounded-full bg-gradient-warm px-7 font-semibold text-primary-foreground shadow-warm">
              Découvrir les plats
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Link to="/plats" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Continuer mes achats
        </Link>
        <h1 className="mt-6 font-display text-4xl font-bold">Mon panier</h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {items.map((it) => (
              <div key={it.dishId} className="flex gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft">
                <img src={it.image} alt={it.nom} className="h-24 w-24 rounded-xl object-cover" />
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-display text-lg font-semibold">{it.nom}</h3>
                      <p className="text-xs text-muted-foreground">par {it.cuisinier} • {it.ville}</p>
                    </div>
                    <button onClick={() => remove(it.dishId)} className="text-muted-foreground hover:text-destructive" aria-label="Supprimer">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center gap-2 rounded-full border border-border bg-background">
                      <button onClick={() => setQty(it.dishId, it.qty - 1)} className="flex h-8 w-8 items-center justify-center rounded-l-full hover:bg-muted">
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-[24px] text-center text-sm font-semibold">{it.qty}</span>
                      <button onClick={() => setQty(it.dishId, it.qty + 1)} className="flex h-8 w-8 items-center justify-center rounded-r-full hover:bg-muted">
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <span className="font-display text-lg font-bold text-primary">{(it.prix * it.qty).toFixed(2)} DT</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="font-display text-xl font-semibold">Récapitulatif</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Sous-total</span><span className="font-medium">{total.toFixed(2)} DT</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Frais de service</span><span className="font-medium">Gratuit</span></div>
            </div>
            <div className="my-4 h-px bg-border" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">{total.toFixed(2)} DT</span>
            </div>
            <button
              onClick={() => navigate({ to: user ? "/checkout" : "/login" })}
              className="mt-6 h-12 w-full rounded-full bg-gradient-warm font-semibold text-primary-foreground shadow-warm transition-smooth hover:opacity-90"
            >
              {user ? "Passer au paiement" : "Connexion pour commander"}
            </button>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}
