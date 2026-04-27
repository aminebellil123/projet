import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useDishes } from "@/context/DishesContext";
import { useCart } from "@/context/CartContext";
import { categories } from "@/data/dishes";
import { regions } from "@/data/regions";
import { Plus, Check, X, Clock, ChefHat, Package, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/dashboard/cuisinier")({
  head: () => ({
    meta: [{ title: "Espace cuisinier — Diary" }],
  }),
  component: DashboardCuisinier,
});

function DashboardCuisinier() {
  const { user } = useAuth();
  const { getDishesByCuisinier, addDish } = useDishes();
  const { ordersForCuisinier, updateOrderStatus } = useCart();
  

  const [tab, setTab] = useState<"plats" | "commandes" | "ajouter">("plats");

  if (!user) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="mx-auto max-w-md px-4 py-20 text-center">
          <h1 className="font-display text-2xl font-bold">Accès réservé</h1>
          <p className="mt-2 text-muted-foreground">Connectez-vous en tant que cuisinier.</p>
          <Link to="/login" className="mt-6 inline-flex h-11 items-center rounded-full bg-gradient-warm px-6 font-semibold text-primary-foreground shadow-warm">
            Se connecter
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (user.role !== "cuisinier") {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="mx-auto max-w-md px-4 py-20 text-center">
          <h1 className="font-display text-2xl font-bold">Espace cuisinier</h1>
          <p className="mt-2 text-muted-foreground">Cet espace est réservé aux cuisiniers.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const myDishes = getDishesByCuisinier(user.nom);
  const myOrders = ordersForCuisinier(user.nom);

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      approved: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
      pending: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
      rejected: "bg-destructive/15 text-destructive",
    };
    const labels: Record<string, string> = { approved: "Validé", pending: "En attente", rejected: "Refusé" };
    return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${map[status]}`}>{labels[status]}</span>;
  };

  const orderStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      en_attente: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
      acceptee: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
      refusee: "bg-destructive/15 text-destructive",
      en_livraison: "bg-purple-500/15 text-purple-700 dark:text-purple-400",
      livree: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    };
    const labels: Record<string, string> = { en_attente: "En attente", acceptee: "Acceptée", refusee: "Refusée", en_livraison: "En livraison", livree: "Livrée" };
    return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${map[status]}`}>{labels[status]}</span>;
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-warm shadow-warm">
            <ChefHat className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold">Espace cuisinier</h1>
            <p className="text-sm text-muted-foreground">Bienvenue {user.nom}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <StatCard label="Mes plats" value={myDishes.length} icon={Package} />
          <StatCard label="Commandes" value={myOrders.length} icon={Clock} />
          <StatCard label="En attente" value={myOrders.filter((o) => o.status === "en_attente").length} icon={AlertCircle} />
        </div>

        <div className="mt-8 flex flex-wrap gap-2 border-b border-border">
          {[
            { id: "plats" as const, label: "Mes plats" },
            { id: "commandes" as const, label: "Commandes" },
            { id: "ajouter" as const, label: "Ajouter un plat" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative px-4 py-3 text-sm font-medium transition-smooth ${
                tab === t.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
              {tab === t.id && <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-primary" />}
            </button>
          ))}
        </div>

        {tab === "plats" && (
          <div className="mt-8 space-y-3">
            {myDishes.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
                <p className="text-muted-foreground">Vous n'avez pas encore de plat.</p>
                <button onClick={() => setTab("ajouter")} className="mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-gradient-warm px-5 font-semibold text-primary-foreground shadow-warm">
                  <Plus className="h-4 w-4" /> Ajouter mon premier plat
                </button>
              </div>
            ) : (
              myDishes.map((d) => (
                <div key={d.id} className="flex gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft">
                  <img src={d.image} alt={d.nom} className="h-20 w-20 rounded-xl object-cover" />
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-lg font-semibold">{d.nom}</h3>
                      {statusBadge(d.status ?? "approved")}
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{d.description}</p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="font-bold text-primary">{d.prix} DT</span>
                      <span>•</span>
                      <span>{d.ville}</span>
                      <span>•</span>
                      <span>{d.temps}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "commandes" && (
          <div className="mt-8 space-y-3">
            {myOrders.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
                <p className="text-muted-foreground">Aucune commande pour l'instant.</p>
              </div>
            ) : (
              myOrders.map((o) => {
                const myItems = o.items.filter((i) => i.cuisinier.toLowerCase() === user.nom.toLowerCase());
                const myTotal = myItems.reduce((s, i) => s + i.prix * i.qty, 0);
                return (
                  <div key={o.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-mono text-xs text-muted-foreground">#{o.id.slice(-8)}</p>
                        <h3 className="font-display text-lg font-semibold">{o.clientNom}</h3>
                        <p className="text-sm text-muted-foreground">📞 {o.clientTel}</p>
                        <p className="text-sm text-muted-foreground">📍 {o.clientAdresse}</p>
                        <p className="mt-1 text-xs text-muted-foreground">Paiement : {o.paiement === "carte" ? "💳 Carte bancaire" : o.paiement === "d17" ? "📱 D17" : "💵 À la livraison"}{o.paiementInfo ? ` — ${o.paiementInfo}` : ""}</p>
                      </div>
                      {orderStatusBadge(o.status)}
                    </div>
                    <div className="mt-4 space-y-1 rounded-xl bg-muted/40 p-3 text-sm">
                      {myItems.map((i) => (
                        <div key={i.dishId} className="flex justify-between">
                          <span>{i.qty}× {i.nom}</span>
                          <span className="font-medium">{(i.prix * i.qty).toFixed(2)} DT</span>
                        </div>
                      ))}
                      <div className="mt-2 flex justify-between border-t border-border pt-2 font-semibold">
                        <span>Total</span>
                        <span className="text-primary">{myTotal.toFixed(2)} DT</span>
                      </div>
                    </div>
                    {o.status === "en_attente" && (
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => updateOrderStatus(o.id, "acceptee")}
                          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-smooth hover:bg-emerald-700"
                        >
                          <Check className="h-4 w-4" /> Accepter
                        </button>
                        <button
                          onClick={() => updateOrderStatus(o.id, "refusee")}
                          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-destructive px-4 py-2.5 text-sm font-semibold text-destructive-foreground transition-smooth hover:opacity-90"
                        >
                          <X className="h-4 w-4" /> Refuser
                        </button>
                      </div>
                    )}
                    {o.status === "acceptee" && (
                      <button
                        onClick={() => updateOrderStatus(o.id, "en_livraison")}
                        className="mt-4 w-full rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-smooth hover:opacity-90"
                      >
                        <Package className="mr-2 inline h-4 w-4" /> Prendre en livraison
                      </button>
                    )}
                    {o.status === "en_livraison" && (
                      <button
                        onClick={() => updateOrderStatus(o.id, "livree")}
                        className="mt-4 w-full rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-smooth hover:bg-emerald-700"
                      >
                        <Check className="mr-2 inline h-4 w-4" /> Marquer comme livrée
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {tab === "ajouter" && (
          <AjouterPlatForm
            defaultVille={user.ville ?? regions[0]}
            cuisinier={user.nom}
            onSubmit={(data) => {
              addDish(data);
              setTab("plats");
            }}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <p className="mt-2 font-display text-3xl font-bold">{value}</p>
    </div>
  );
}

function AjouterPlatForm({
  defaultVille,
  cuisinier,
  onSubmit,
}: {
  defaultVille: string;
  cuisinier: string;
  onSubmit: (d: {
    nom: string; prix: number; description: string; image: string; categorie: string;
    cuisinier: string; cuisinierBio: string; ville: string; temps: string;
    ingredients: string[]; allergenes: string[];
  }) => void;
}) {
  const [nom, setNom] = useState("");
  const [prix, setPrix] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [categorie, setCategorie] = useState("plat");
  const [ville, setVille] = useState(defaultVille);
  const [temps, setTemps] = useState("30 min");
  const [ingredients, setIngredients] = useState("");
  const [allergenes, setAllergenes] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!nom || !prix || !description) {
      setError("Nom, prix et description sont obligatoires.");
      return;
    }
    const prixNum = parseFloat(prix);
    if (isNaN(prixNum) || prixNum <= 0) {
      setError("Prix invalide.");
      return;
    }
    onSubmit({
      nom,
      prix: prixNum,
      description,
      image: image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
      categorie,
      cuisinier,
      cuisinierBio: bio,
      ville,
      temps,
      ingredients: ingredients.split(",").map((s) => s.trim()).filter(Boolean),
      allergenes: allergenes.split(",").map((s) => s.trim()).filter(Boolean),
    });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    setNom(""); setPrix(""); setDescription(""); setImage(""); setIngredients(""); setAllergenes(""); setBio("");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft sm:grid-cols-2">
      <div className="sm:col-span-2">
        <h2 className="font-display text-xl font-semibold">Nouveau plat</h2>
        <p className="text-sm text-muted-foreground">Le plat sera publié après validation par un administrateur.</p>
      </div>

      <Field label="Nom du plat *">
        <input value={nom} onChange={(e) => setNom(e.target.value)} className={inputCls} placeholder="Ex : Couscous au poisson" required />
      </Field>
      <Field label="Prix (DT) *">
        <input type="number" step="0.5" value={prix} onChange={(e) => setPrix(e.target.value)} className={inputCls} placeholder="12.5" required />
      </Field>

      <Field label="Catégorie">
        <select value={categorie} onChange={(e) => setCategorie(e.target.value)} className={inputCls}>
          {categories.filter((c) => c.id !== "all").map((c) => (
            <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
          ))}
        </select>
      </Field>
      <Field label="Ville">
        <select value={ville} onChange={(e) => setVille(e.target.value)} className={inputCls}>
          {regions.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </Field>

      <Field label="Temps de préparation">
        <input value={temps} onChange={(e) => setTemps(e.target.value)} className={inputCls} placeholder="30 min" />
      </Field>
      <Field label="URL d'image (optionnel)">
        <input value={image} onChange={(e) => setImage(e.target.value)} className={inputCls} placeholder="https://..." />
      </Field>

      <Field label="Description *" full>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className={`${inputCls} min-h-[80px]`} placeholder="Décrivez votre plat..." required />
      </Field>

      <Field label="Ingrédients (séparés par virgule)" full>
        <input value={ingredients} onChange={(e) => setIngredients(e.target.value)} className={inputCls} placeholder="Semoule, Agneau, Carottes..." />
      </Field>

      <Field label="Allergènes (séparés par virgule)" full>
        <input value={allergenes} onChange={(e) => setAllergenes(e.target.value)} className={inputCls} placeholder="Gluten, Œufs..." />
      </Field>

      <Field label="Votre bio (courte)" full>
        <input value={bio} onChange={(e) => setBio(e.target.value)} className={inputCls} placeholder="Cuisinier passionné depuis 10 ans..." />
      </Field>

      {error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive sm:col-span-2">{error}</p>}
      {success && <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-400 sm:col-span-2">✓ Plat soumis ! En attente de validation par un admin.</p>}

      <div className="sm:col-span-2">
        <button type="submit" className="h-12 w-full rounded-full bg-gradient-warm font-semibold text-primary-foreground shadow-warm transition-smooth hover:opacity-90 sm:w-auto sm:px-8">
          Soumettre pour validation
        </button>
      </div>
    </form>
  );
}

const inputCls = "mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary";

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`block text-sm font-medium ${full ? "sm:col-span-2" : ""}`}>
      {label}
      {children}
    </label>
  );
}
