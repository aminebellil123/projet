import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { CreditCard, Banknote, ArrowLeft, CheckCircle2, Lock, Smartphone } from "lucide-react";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Paiement — Diary" }] }),
  component: CheckoutPage,
});

type Mode = "carte" | "livraison" | "d17";

function CheckoutPage() {
  const { user } = useAuth();
  const { items, total, placeOrder } = useCart();
  const navigate = useNavigate();

  const [paiement, setPaiement] = useState<Mode>("livraison");
  const [tel, setTel] = useState("");
  const [adresse, setAdresse] = useState("");
  // Carte
  const [cardNum, setCardNum] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  // D17
  const [d17Num, setD17Num] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState<{ id: string; total: number } | null>(null);

  if (!user) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="mx-auto max-w-md px-4 py-20 text-center">
          <h1 className="font-display text-2xl font-bold">Connexion requise</h1>
          <Link to="/login" className="mt-4 inline-flex h-11 items-center rounded-full bg-gradient-warm px-6 font-semibold text-primary-foreground shadow-warm">Se connecter</Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (confirmed) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="mx-auto max-w-md px-4 py-20 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          </div>
          <h1 className="mt-6 font-display text-3xl font-bold">Commande confirmée !</h1>
          <p className="mt-3 text-muted-foreground">Votre commande <span className="font-mono font-semibold text-foreground">#{confirmed.id.slice(-8)}</span> a été envoyée au cuisinier.</p>
          <p className="mt-1 text-2xl font-display font-bold text-primary">{confirmed.total.toFixed(2)} DT</p>
          <p className="mt-4 text-sm text-muted-foreground">Le cuisinier va l'accepter ou la refuser. Vous serez contacté par téléphone.</p>
          <Link to="/plats" className="mt-8 inline-flex h-12 items-center rounded-full bg-gradient-warm px-7 font-semibold text-primary-foreground shadow-warm">
            Continuer mes achats
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="mx-auto max-w-md px-4 py-20 text-center">
          <h1 className="font-display text-2xl font-bold">Panier vide</h1>
          <Link to="/plats" className="mt-4 inline-flex h-11 items-center rounded-full bg-gradient-warm px-6 font-semibold text-primary-foreground shadow-warm">Voir les plats</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!tel.trim() || !adresse.trim()) {
      setError("Veuillez renseigner votre téléphone et adresse.");
      return;
    }
    let info = "";
    if (paiement === "carte") {
      const num = cardNum.replace(/\s/g, "");
      if (num.length < 12 || !cardExp || cardCvc.length < 3) {
        setError("Veuillez compléter les informations de carte (numéro, expiration MM/AA, CVC).");
        return;
      }
      info = `Carte •••• ${num.slice(-4)}`;
    } else if (paiement === "d17") {
      const d17 = d17Num.replace(/\s/g, "");
      if (d17.length < 8) {
        setError("Veuillez saisir un numéro D17 valide (8 chiffres minimum).");
        return;
      }
      info = `D17 ${d17.replace(/.(?=.{2})/g, "•")}`;
    } else {
      info = "Paiement à la livraison (espèces)";
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    const order = placeOrder({
      clientId: user.id,
      clientNom: user.nom,
      clientTel: tel,
      clientAdresse: adresse,
      paiement,
      paiementInfo: info,
    });
    setConfirmed({ id: order.id, total: order.total });
    setLoading(false);
  };

  const formatCard = (v: string) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExp = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    if (d.length < 3) return d;
    return `${d.slice(0, 2)}/${d.slice(2)}`;
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Link to="/panier" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Retour au panier
        </Link>
        <h1 className="mt-6 font-display text-4xl font-bold">Paiement</h1>

        <form onSubmit={handlePay} className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h2 className="font-display text-xl font-semibold">Informations de livraison</h2>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="text-sm font-medium">Téléphone *</label>
                  <input value={tel} onChange={(e) => setTel(e.target.value)} type="tel" placeholder="+216 ..." required className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="text-sm font-medium">Adresse de livraison *</label>
                  <textarea value={adresse} onChange={(e) => setAdresse(e.target.value)} required placeholder="Rue, immeuble, ville..." className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h2 className="font-display text-xl font-semibold">Mode de paiement</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => setPaiement("livraison")}
                  className={`flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-smooth ${
                    paiement === "livraison" ? "border-primary bg-primary/5 shadow-soft" : "border-border hover:border-primary/40"
                  }`}
                >
                  <Banknote className={`h-6 w-6 ${paiement === "livraison" ? "text-primary" : "text-muted-foreground"}`} />
                  <div>
                    <p className="font-semibold text-sm">À la livraison</p>
                    <p className="text-xs text-muted-foreground">Espèces</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setPaiement("d17")}
                  className={`flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-smooth ${
                    paiement === "d17" ? "border-primary bg-primary/5 shadow-soft" : "border-border hover:border-primary/40"
                  }`}
                >
                  <Smartphone className={`h-6 w-6 ${paiement === "d17" ? "text-primary" : "text-muted-foreground"}`} />
                  <div>
                    <p className="font-semibold text-sm">D17</p>
                    <p className="text-xs text-muted-foreground">Mobile La Poste</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setPaiement("carte")}
                  className={`flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-smooth ${
                    paiement === "carte" ? "border-primary bg-primary/5 shadow-soft" : "border-border hover:border-primary/40"
                  }`}
                >
                  <CreditCard className={`h-6 w-6 ${paiement === "carte" ? "text-primary" : "text-muted-foreground"}`} />
                  <div>
                    <p className="font-semibold text-sm">Carte bancaire</p>
                    <p className="text-xs text-muted-foreground">Visa / Master</p>
                  </div>
                </button>
              </div>

              {paiement === "carte" && (
                <div className="mt-6 space-y-4 rounded-xl border border-border bg-background/60 p-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Lock className="h-3 w-3" /> Paiement sécurisé (simulation)
                  </div>
                  <div>
                    <label className="text-sm font-medium">Numéro de carte</label>
                    <input
                      value={cardNum}
                      onChange={(e) => setCardNum(formatCard(e.target.value))}
                      placeholder="4242 4242 4242 4242"
                      maxLength={19}
                      inputMode="numeric"
                      className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium">Expiration</label>
                      <input value={cardExp} onChange={(e) => setCardExp(formatExp(e.target.value))} placeholder="MM/AA" maxLength={5} inputMode="numeric" className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">CVC</label>
                      <input value={cardCvc} onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="123" maxLength={4} inputMode="numeric" className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
                    </div>
                  </div>
                </div>
              )}

              {paiement === "d17" && (
                <div className="mt-6 space-y-4 rounded-xl border border-border bg-background/60 p-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Smartphone className="h-3 w-3" /> Paiement via D17 (simulation)
                  </div>
                  <div>
                    <label className="text-sm font-medium">Numéro D17 (compte mobile)</label>
                    <input
                      value={d17Num}
                      onChange={(e) => setD17Num(e.target.value.replace(/\D/g, "").slice(0, 12))}
                      placeholder="ex: 22123456"
                      inputMode="numeric"
                      className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    💡 Vous recevrez une notification sur votre application D17 pour valider le paiement.
                  </p>
                </div>
              )}

              {paiement === "livraison" && (
                <div className="mt-6 rounded-xl border border-dashed border-border bg-background/60 p-4 text-sm text-muted-foreground">
                  Vous payerez en espèces directement au cuisinier ou au livreur lors de la réception.
                </div>
              )}
            </section>

            {error && (
              <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">{error}</p>
            )}
          </div>

          <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="font-display text-xl font-semibold">Récapitulatif</h2>
            <div className="mt-4 space-y-2 text-sm">
              {items.map((i) => (
                <div key={i.dishId} className="flex justify-between">
                  <span className="text-muted-foreground">{i.qty}× {i.nom}</span>
                  <span className="font-medium">{(i.prix * i.qty).toFixed(2)} DT</span>
                </div>
              ))}
            </div>
            <div className="my-4 h-px bg-border" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">{total.toFixed(2)} DT</span>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-6 h-12 w-full rounded-full bg-gradient-warm font-semibold text-primary-foreground shadow-warm transition-smooth hover:opacity-90 disabled:opacity-60"
            >
              {loading
                ? "Traitement..."
                : paiement === "livraison"
                ? `Confirmer la commande`
                : `Payer ${total.toFixed(2)} DT`}
            </button>
            <p className="mt-3 text-center text-[10px] text-muted-foreground">
              💡 Mode démo — aucun paiement réel n'est effectué.
            </p>
          </aside>
        </form>
      </div>
      <Footer />
    </div>
  );
}
