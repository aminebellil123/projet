import { Link } from "@tanstack/react-router";
import { Star, Clock, MapPin, ShoppingBag, Check } from "lucide-react";
import type { Dish } from "@/data/dishes";
import { useReviews } from "@/context/ReviewsContext";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { useState } from "react";

export function DishCard({ dish }: { dish: Dish }) {
  const { getStatsForDish } = useReviews();
  const stats = getStatsForDish(dish.id, dish.note, dish.avis);
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    add({ 
      dishId: dish.id, 
      nom: dish.nom, 
      prix: dish.prix, 
      image: dish.image, 
      cuisinier: dish.cuisinier, 
      ville: dish.ville 
    }, 1);
    
    setAdded(true);
    toast.success(`${dish.nom} ajouté au panier`, {
      description: "Retrouvez-le dans votre panier.",
      icon: "🛒"
    });
    
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Link
      to="/plats/$id"
      params={{ id: dish.id }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-soft transition-smooth hover:-translate-y-1 hover:border-primary/40 hover:shadow-card"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={dish.image}
          alt={dish.nom}
          loading="lazy"
          width={800}
          height={600}
          className="h-full w-full object-cover transition-smooth duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-background/95 px-2.5 py-1 text-xs font-semibold shadow-soft backdrop-blur">
          <Star className="h-3 w-3 fill-primary text-primary" />
          {stats.note}
          <span className="text-muted-foreground">({stats.avis})</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-semibold leading-tight">{dish.nom}</h3>
          <span className="shrink-0 font-display text-lg font-bold text-primary">{dish.prix} DT</span>
        </div>
        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{dish.description}</p>

        <div className="mt-auto pt-4 flex flex-col gap-4">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="font-medium text-foreground/80">{dish.cuisinier}</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {dish.temps}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {dish.ville}
            </span>
          </div>
          
          <button 
            onClick={handleAddToCart}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-smooth ${
              added 
                ? "bg-primary/10 text-primary" 
                : "bg-primary text-primary-foreground shadow-sm hover:opacity-90"
            }`}
          >
            {added ? (
              <>
                <Check className="h-4 w-4" /> Ajouté
              </>
            ) : (
              <>
                <ShoppingBag className="h-4 w-4" /> Ajouter
              </>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}
