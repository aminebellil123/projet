import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChefHat, DollarSign, Calendar, Users, ArrowRight, Check } from "lucide-react";

export const Route = createFileRoute("/cuisinier")({
  head: () => ({
    meta: [
      { title: "Devenir cuisinier — Diary" },
      { name: "description", content: "Vendez vos plats faits maison sur Diary. Liberté, revenus, passion." },
      { property: "og:title", content: "Devenir cuisinier — Diary" },
      { property: "og:description", content: "Partagez votre cuisine avec votre quartier." },
    ],
  }),
  component: CuisinierPage,
});

function CuisinierPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
            <ChefHat className="h-3.5 w-3.5" /> Pour les cuisiniers passionnés
          </span>
          <h1 className="mt-6 font-display text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
            Transformez votre <span className="text-gradient-warm">passion</span> en revenu
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Vendez vos plats faits maison à votre rythme. Vous fixez les prix,
            vous choisissez les jours. Diary vous met en relation avec les clients.
          </p>
          <Link
            to="/inscription"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-gradient-warm px-8 font-semibold text-primary-foreground shadow-warm transition-smooth hover:scale-[1.02]"
          >
            Commencer maintenant <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: DollarSign, title: "Revenus", desc: "Gardez 90% de vos ventes" },
            { icon: Calendar, title: "Flexible", desc: "Cuisinez quand vous voulez" },
            { icon: Users, title: "Clients", desc: "Une communauté locale" },
            { icon: ChefHat, title: "Liberté", desc: "Vos plats, votre carte" },
          ].map((b) => (
            <div key={b.title} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <b.icon className="h-8 w-8 text-primary" />
              <h3 className="mt-4 font-display text-xl font-semibold">{b.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{b.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Comment commencer</p>
            <h2 className="mt-2 font-display text-4xl font-bold tracking-tight">
              4 étapes simples vers votre première vente
            </h2>
            <ul className="mt-8 space-y-4">
              {[
                "Créez votre compte cuisinier en 2 minutes",
                "Soumettez vos documents pour validation",
                "Ajoutez vos premiers plats avec photos",
                "Recevez vos premières commandes !",
              ].map((s, i) => (
                <li key={i} className="flex gap-4">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-warm text-xs font-bold text-primary-foreground shadow-warm">
                    {i + 1}
                  </div>
                  <span className="pt-0.5 text-base">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-gradient-warm p-10 shadow-warm">
            <h3 className="font-display text-3xl font-bold text-primary-foreground">
              Vos avantages
            </h3>
            <ul className="mt-6 space-y-3">
              {[
                "Aucun frais d'inscription",
                "Paiement sous 48h",
                "Outils de gestion intégrés",
                "Support 7j/7",
                "Visibilité dans votre ville",
              ].map((a) => (
                <li key={a} className="flex items-center gap-3 text-primary-foreground">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-background/20">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  {a}
                </li>
              ))}
            </ul>
            <Link
              to="/inscription"
              className="mt-8 inline-flex h-12 items-center rounded-full bg-background px-7 font-semibold text-primary shadow-card transition-smooth hover:scale-[1.02]"
            >
              Rejoindre Diary
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
