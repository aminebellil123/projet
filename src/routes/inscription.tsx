import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChefHat, User } from "lucide-react";
import { useAuth, type Role } from "@/context/AuthContext";
import { regions } from "@/data/regions";

export const Route = createFileRoute("/inscription")({
  head: () => ({
    meta: [
      { title: "Inscription — Diary" },
      { name: "description", content: "Créez votre compte Diary, client ou cuisinier." },
    ],
  }),
  component: InscriptionPage,
});

function InscriptionPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("client");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [password, setPassword] = useState("");
  const [ville, setVille] = useState<string>(regions[0]);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!nom || !email || !password) {
      setError("Tous les champs sont obligatoires.");
      return;
    }
    void tel;
    const res = register({ nom, email, password, role, ville: role === "cuisinier" ? ville : undefined });
    if (!res.ok) {
      setError(res.error ?? "Erreur");
      return;
    }
    if (role === "cuisinier") navigate({ to: "/dashboard/cuisinier" });
    else navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-card">
          <h1 className="font-display text-3xl font-bold">Rejoindre Diary</h1>
          <p className="mt-2 text-sm text-muted-foreground">Créez votre compte en 1 minute.</p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {([
              { id: "client" as const, label: "Client", icon: User, desc: "Je commande" },
              { id: "cuisinier" as const, label: "Cuisinier", icon: ChefHat, desc: "Je vends" },
            ]).map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`flex flex-col items-start gap-1 rounded-2xl border p-4 text-left transition-smooth ${
                  role === r.id ? "border-primary bg-primary/5 shadow-soft" : "border-border hover:border-primary/40"
                }`}
              >
                <r.icon className={`h-5 w-5 ${role === r.id ? "text-primary" : "text-muted-foreground"}`} />
                <span className="font-display text-base font-semibold">{r.label}</span>
                <span className="text-xs text-muted-foreground">{r.desc}</span>
              </button>
            ))}
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-medium">Nom complet</label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Sami Ben Ali"
                className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@email.com"
                className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Téléphone</label>
              <input
                type="tel"
                value={tel}
                onChange={(e) => setTel(e.target.value)}
                placeholder="+216 ..."
                className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </div>
            {role === "cuisinier" && (
              <div>
                <label className="text-sm font-medium">Ville (région)</label>
                <select
                  value={ville}
                  onChange={(e) => setVille(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                >
                  {regions.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="text-sm font-medium">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                required
              />
            </div>
            {error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
            <button
              type="submit"
              className="h-12 w-full rounded-full bg-gradient-warm font-semibold text-primary-foreground shadow-warm transition-smooth hover:opacity-90"
            >
              Créer mon compte {role === "cuisinier" && "cuisinier"}
            </button>
            {role === "cuisinier" && (
              <p className="text-center text-xs text-muted-foreground">
                Vos plats seront vérifiés par un administrateur avant publication.
              </p>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Déjà inscrit ?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">Connectez-vous</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
