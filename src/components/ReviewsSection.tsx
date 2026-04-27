import { useState } from "react";
import { Star, MessageSquare, User } from "lucide-react";
import { useReviews } from "@/context/ReviewsContext";
import { useAuth } from "@/context/AuthContext";
import { Link } from "@tanstack/react-router";

export function ReviewsSection({ dishId }: { dishId: string }) {
  const { user } = useAuth();
  const { getReviewsForDish, addReview } = useReviews();
  const reviews = getReviewsForDish(dishId);

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || rating === 0) return;
    addReview({
      dishId,
      userId: user.id,
      userName: user.nom,
      rating,
      comment: comment.trim(),
    });
    setRating(0);
    setComment("");
    setSent(true);
    setTimeout(() => setSent(false), 2500);
  };

  return (
    <section className="mt-16">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h2 className="font-display text-3xl font-bold tracking-tight">Avis des clients</h2>
      </div>

      {/* Form */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h3 className="font-display text-lg font-semibold">Donnez votre avis</h3>
        {!user ? (
          <p className="mt-3 text-sm text-muted-foreground">
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Connectez-vous
            </Link>{" "}
            pour laisser un avis.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-medium">Votre note</label>
              <div className="mt-2 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onMouseEnter={() => setHover(n)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setRating(n)}
                    aria-label={`Noter ${n} étoile${n > 1 ? "s" : ""}`}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-7 w-7 transition-colors ${
                        (hover || rating) >= n
                          ? "fill-primary text-primary"
                          : "text-muted-foreground/40"
                      }`}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="ml-2 text-sm font-semibold text-primary">{rating}/5</span>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Votre commentaire (optionnel)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Partagez votre expérience..."
                rows={3}
                className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </div>
            <button
              type="submit"
              disabled={rating === 0}
              className="h-11 rounded-full bg-gradient-warm px-6 text-sm font-semibold text-primary-foreground shadow-warm transition-smooth hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Publier mon avis
            </button>
            {sent && (
              <p className="text-sm font-medium text-emerald-600">✓ Merci ! Votre avis a été publié.</p>
            )}
          </form>
        )}
      </div>

      {/* Reviews list */}
      <div className="mt-6 space-y-4">
        {reviews.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            Aucun avis pour le moment. Soyez le premier à donner votre avis !
          </p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-warm">
                  <User className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold">{r.userName}</p>
                    <span className="text-xs text-muted-foreground">
                      {new Date(r.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        className={`h-4 w-4 ${n <= r.rating ? "fill-primary text-primary" : "text-muted-foreground/30"}`}
                      />
                    ))}
                  </div>
                  {r.comment && <p className="mt-2 text-sm text-foreground/80">{r.comment}</p>}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
