import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-warm shadow-warm">
                <span className="font-display text-lg font-bold text-primary-foreground">D</span>
              </div>
              <span className="font-display text-2xl font-bold">Diary</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              La cuisine maison, faite par des passionnés près de chez vous.
            </p>
          </div>

          <div>
            <h3 className="font-display text-base font-semibold">Découvrir</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/plats" className="hover:text-primary">Tous les plats</Link></li>
              <li><Link to="/plats" className="hover:text-primary">Cuisiniers</Link></li>
              <li><Link to="/" className="hover:text-primary">Comment ça marche</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-base font-semibold">Cuisiniers</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/cuisinier" className="hover:text-primary">Rejoindre Diary</Link></li>
              <li><Link to="/inscription" className="hover:text-primary">Créer un compte</Link></li>
              <li><Link to="/login" className="hover:text-primary">Espace pro</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-base font-semibold">Suivez-nous</h3>
            <div className="mt-4 flex gap-3">
              <a href="#" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-full bg-muted transition-smooth hover:bg-primary hover:text-primary-foreground">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Facebook" className="flex h-10 w-10 items-center justify-center rounded-full bg-muted transition-smooth hover:bg-primary hover:text-primary-foreground">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="mailto:hello@diary.app" aria-label="Email" className="flex h-10 w-10 items-center justify-center rounded-full bg-muted transition-smooth hover:bg-primary hover:text-primary-foreground">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Diary. Tous droits réservés.</p>
          <p>Fait avec ❤️ pour la cuisine maison</p>
        </div>
      </div>
    </footer>
  );
}
