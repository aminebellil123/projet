import { Link, useNavigate } from "@tanstack/react-router";
import { ShoppingBag, Search, User, ChefHat, Shield, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

export function Header() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-warm shadow-warm">
            <span className="font-display text-lg font-bold text-primary-foreground">D</span>
          </div>
          <span className="font-display text-2xl font-bold tracking-tight">Diary</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/" className="text-sm font-medium text-foreground/80 transition-smooth hover:text-primary" activeOptions={{ exact: true }} activeProps={{ className: "text-primary" }}>
            Accueil
          </Link>
          <Link to="/plats" className="text-sm font-medium text-foreground/80 transition-smooth hover:text-primary" activeProps={{ className: "text-primary" }}>
            Plats
          </Link>
          {user?.role === "cuisinier" && (
            <Link to="/dashboard/cuisinier" className="flex items-center gap-1.5 text-sm font-medium text-foreground/80 transition-smooth hover:text-primary" activeProps={{ className: "text-primary" }}>
              <ChefHat className="h-4 w-4" /> Mon espace
            </Link>
          )}
          {user?.role === "admin" && (
            <Link to="/dashboard/admin" className="flex items-center gap-1.5 text-sm font-medium text-foreground/80 transition-smooth hover:text-primary" activeProps={{ className: "text-primary" }}>
              <Shield className="h-4 w-4" /> Admin
            </Link>
          )}
          {!user && (
            <Link to="/cuisinier" className="text-sm font-medium text-foreground/80 transition-smooth hover:text-primary" activeProps={{ className: "text-primary" }}>
              Devenir cuisinier
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/plats" className="hidden h-10 w-10 items-center justify-center rounded-full text-foreground/70 transition-smooth hover:bg-muted hover:text-primary sm:flex" aria-label="Rechercher">
            <Search className="h-5 w-5" />
          </Link>
          <Link to="/panier" className="relative flex h-10 w-10 items-center justify-center rounded-full text-foreground/70 transition-smooth hover:bg-muted hover:text-primary" aria-label="Panier">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setOpen((o) => !o)}
                className="flex h-10 items-center gap-2 rounded-full border border-border bg-card px-3 text-sm font-medium transition-smooth hover:border-primary"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-warm text-xs font-bold text-primary-foreground">
                  {user.nom.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline">{user.nom.split(" ")[0]}</span>
              </button>
              {open && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
                  <div className="absolute right-0 top-12 z-40 w-56 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
                    <div className="border-b border-border px-4 py-3">
                      <p className="text-sm font-semibold">{user.nom}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                      <span className="mt-1.5 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-primary">
                        {user.role}
                      </span>
                    </div>
                    {user.role === "cuisinier" && (
                      <Link to="/dashboard/cuisinier" onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-muted">
                        <ChefHat className="h-4 w-4" /> Mon espace
                      </Link>
                    )}
                    {user.role === "admin" && (
                      <Link to="/dashboard/admin" onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-muted">
                        <Shield className="h-4 w-4" /> Admin
                      </Link>
                    )}
                    <button onClick={handleLogout} className="flex w-full items-center gap-2 border-t border-border px-4 py-3 text-left text-sm text-destructive hover:bg-muted">
                      <LogOut className="h-4 w-4" /> Déconnexion
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="hidden h-10 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-medium transition-smooth hover:border-primary hover:text-primary sm:flex">
                <User className="h-4 w-4" /> Connexion
              </Link>
              <Link to="/inscription" className="hidden h-10 items-center rounded-full bg-gradient-warm px-5 text-sm font-semibold text-primary-foreground shadow-warm transition-smooth hover:opacity-90 md:flex">
                S'inscrire
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
