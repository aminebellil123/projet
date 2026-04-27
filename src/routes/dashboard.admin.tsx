cd import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useDishes } from "@/context/DishesContext";
import { useCart } from "@/context/CartContext";
import { Shield, Check, X, Package, ShoppingBag, Clock, DollarSign } from "lucide-react";

export const Route = createFileRoute("/dashboard/admin")({
  head: () => ({
    meta: [{ title: "Admin — Diary" }],
  }),
  component: DashboardAdmin,
});

function DashboardAdmin() {
  const { user } = useAuth();
  const { dishes, pendingDishes, setStatus } = useDishes();
  const { orders } = useCart();
  const [tab, setTab] = useState<"validation" | "plats" | "commandes">("validation");

  const validOrders = orders.filter((o) => ["acceptee", "en_livraison", "livree"].includes(o.status));
  const commission = validOrders.reduce((sum, o) => sum + o.total * 0.1, 0);

  if (!user) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="mx-auto max-w-md px-4 py-20 text-center">
          <h1 className="font-display text-2xl font-bold">Accès réservé</h1>
          <p className="mt-2 text-muted-foreground">Connectez-vous en tant qu'administrateur.</p>
          <Link to="/login" className="mt-6 inline-flex h-11 items-center rounded-full bg-gradient-warm px-6 font-semibold text-primary-foreground shadow-warm">
            Se connecter
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="mx-auto max-w-md px-4 py-20 text-center">
          <h1 className="font-display text-2xl font-bold">Accès refusé</h1>
          <p className="mt-2 text-muted-foreground">Cet espace est réservé aux administrateurs.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-warm shadow-warm">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold">Administration</h1>
            <p className="text-sm text-muted-foreground">Validation des plats et supervision</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-4">
          <StatCard label="En attente" value={pendingDishes.length} icon={Clock} highlight={pendingDishes.length > 0} />
          <StatCard label="Plats publiés" value={dishes.filter((d) => (d.status ?? "approved") === "approved").length} icon={Package} />
          <StatCard label="Commandes (validées)" value={validOrders.length} icon={ShoppingBag} />
          <StatCard label="Commission (10%)" value={`${commission.toFixed(2)} DT`} icon={DollarSign} highlight />
        </div>

        <div className="mt-8 flex flex-wrap gap-2 border-b border-border">
          {[
            { id: "validation" as const, label: `Validation ${pendingDishes.length > 0 ? `(${pendingDishes.length})` : ""}` },
            { id: "plats" as const, label: "Tous les plats" },
            { id: "commandes" as const, label: "Commandes" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative px-4 py-3 text-sm font-medium transition-smooth ${tab === t.id ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              {t.label}
              {tab === t.id && <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-primary" />}
            </button>
          ))}
        </div>

        {tab === "validation" && (
          <div className="mt-8 space-y-4">
            {pendingDishes.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
                <p className="text-muted-foreground">Aucun plat en attente. Tout est à jour ✨</p>
              </div>
            ) : (
              pendingDishes.map((d) => (
                <div key={d.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <img src={d.image} alt={d.nom} className="h-32 w-full rounded-xl object-cover sm:w-48" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-display text-xl font-semibold">{d.nom}</h3>
                          <p className="text-sm text-muted-foreground">par <span className="font-semibold">{d.cuisinier}</span> • {d.ville}</p>
                        </div>
                        <span className="font-display text-xl font-bold text-primary">{d.prix} DT</span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{d.description}</p>
                      <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
                        <span className="rounded-full bg-muted px-2.5 py-0.5">⏱ {d.temps}</span>
                        <span className="rounded-full bg-muted px-2.5 py-0.5">📂 {d.categorie}</span>
                        {d.allergenes.length > 0 && (
                          <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-amber-700 dark:text-amber-400">
                            ⚠ {d.allergenes.join(", ")}
                          </span>
                        )}
                      </div>
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => setStatus(d.id, "approved")}
                          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-smooth hover:bg-emerald-700"
                        >
                          <Check className="h-4 w-4" /> Valider
                        </button>
                        <button
                          onClick={() => setStatus(d.id, "rejected")}
                          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-destructive px-4 py-2.5 text-sm font-semibold text-destructive-foreground transition-smooth hover:opacity-90"
                        >
                          <X className="h-4 w-4" /> Refuser
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "plats" && (
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {dishes.map((d) => (
              <div key={d.id} className="flex gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft">
                <img src={d.image} alt={d.nom} className="h-16 w-16 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="truncate font-semibold">{d.nom}</h3>
                    <StatusPill status={d.status ?? "approved"} />
                  </div>
                  <p className="text-xs text-muted-foreground">{d.cuisinier} • {d.ville}</p>
                  <p className="text-sm font-bold text-primary">{d.prix} DT</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "commandes" && (
          <div className="mt-8 space-y-3">
            {validOrders.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
                <p className="text-muted-foreground">Aucune commande validée pour le moment.</p>
              </div>
            ) : (
              validOrders.map((o) => (
                <div key={o.id} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-mono text-xs text-muted-foreground">#{o.id.slice(-8)}</p>
                      <p className="font-semibold">{o.clientNom} • {o.clientTel}</p>
                      <p className="text-xs text-muted-foreground">{o.clientAdresse}</p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1.5">
                      <p className="font-display text-lg font-bold text-primary">{o.total.toFixed(2)} DT</p>
                      <p className="text-xs text-muted-foreground">{o.paiement === "carte" ? "💳 Carte" : o.paiement === "d17" ? "📱 D17" : "💵 Livraison"}</p>
                      <OrderStatusPill status={o.status} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

function StatCard({ label, value, icon: Icon, highlight }: { label: string; value: number | string; icon: React.ComponentType<{ className?: string }>; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 shadow-soft ${highlight ? "border-primary bg-primary/5" : "border-border bg-card"}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Icon className={`h-5 w-5 ${highlight ? "text-primary" : "text-muted-foreground"}`} />
      </div>
      <p className="mt-2 font-display text-3xl font-bold">{value}</p>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    approved: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    pending: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
    rejected: "bg-destructive/15 text-destructive",
  };
  const labels: Record<string, string> = { approved: "Validé", pending: "Attente", rejected: "Refusé" };
  return <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${map[status]}`}>{labels[status]}</span>;
}

function OrderStatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    en_attente: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
    acceptee: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
    refusee: "bg-destructive/15 text-destructive",
    en_livraison: "bg-purple-500/15 text-purple-700 dark:text-purple-400",
    livree: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  };
  const labels: Record<string, string> = { en_attente: "En attente", acceptee: "Acceptée", refusee: "Refusée", en_livraison: "En livraison", livree: "Livrée" };
  return <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${map[status]}`}>{labels[status]}</span>;
}
