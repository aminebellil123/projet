import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Connexion — Diary" },
      { name: "description", content: "Connectez-vous à votre compte Diary." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (user) {
    if (user.role === "admin") navigate({ to: "/dashboard/admin" });
    else if (user.role === "cuisinier") navigate({ to: "/dashboard/cuisinier" });
    else navigate({ to: "/" });
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = login(email, password);
    if (!res.ok) {
      setError(res.error ?? "Erreur");
      return;
    }
    // Redirection selon rôle (lit la session fraîchement persistée)
    setTimeout(() => {
      const raw = localStorage.getItem("diary_session_v1");
      if (!raw) return;
      const u = JSON.parse(raw);
      if (u.role === "admin") navigate({ to: "/dashboard/admin" });
      else if (u.role === "cuisinier") navigate({ to: "/dashboard/cuisinier" });
      else navigate({ to: "/" });
    }, 0);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-card">
          <h1 className="font-display text-3xl font-bold">Bon retour !</h1>
          <p className="mt-2 text-sm text-muted-foreground">Connectez-vous pour commander.</p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@email.com"
                className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-smooth focus:border-primary"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-smooth focus:border-primary"
                required
              />
            </div>
            {error && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
            )}
            <button
              type="submit"
              className="h-12 w-full rounded-full bg-gradient-warm font-semibold text-primary-foreground shadow-warm transition-smooth hover:opacity-90"
            >
              Se connecter
            </button>
          </form>

          <div className="mt-4 rounded-xl bg-muted/60 p-3 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">💡 Compte de démonstration admin</p>
            <p>Email : <code className="font-mono">admin@admin</code></p>
            <p>Mot de passe : <code className="font-mono">123321</code></p>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Pas encore de compte ?{" "}
            <Link to="/inscription" className="font-semibold text-primary hover:underline">
              Inscrivez-vous
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
