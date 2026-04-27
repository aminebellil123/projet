import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Review = {
  id: string;
  dishId: string;
  userId: string;
  userName: string;
  rating: number; // 1..5
  comment: string;
  createdAt: number;
};

type ReviewsContextType = {
  reviews: Review[];
  getReviewsForDish: (dishId: string) => Review[];
  getStatsForDish: (dishId: string, baseNote: number, baseAvis: number) => { note: number; avis: number };
  addReview: (data: Omit<Review, "id" | "createdAt">) => void;
};

const ReviewsContext = createContext<ReviewsContextType | null>(null);
const KEY = "diary_reviews_v1";

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(KEY);
      if (raw) setReviews(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem(KEY, JSON.stringify(reviews));
  }, [reviews]);

  const getReviewsForDish = (dishId: string) =>
    reviews.filter((r) => r.dishId === dishId).sort((a, b) => b.createdAt - a.createdAt);

  const getStatsForDish = (dishId: string, baseNote: number, baseAvis: number) => {
    const list = reviews.filter((r) => r.dishId === dishId);
    if (list.length === 0) return { note: baseNote, avis: baseAvis };
    const sumUser = list.reduce((s, r) => s + r.rating, 0);
    const totalSum = baseNote * baseAvis + sumUser;
    const totalCount = baseAvis + list.length;
    return { note: Math.round((totalSum / totalCount) * 10) / 10, avis: totalCount };
  };

  const addReview: ReviewsContextType["addReview"] = (data) => {
    const r: Review = { ...data, id: `rev-${Date.now()}`, createdAt: Date.now() };
    setReviews((prev) => [r, ...prev]);
  };

  return (
    <ReviewsContext.Provider value={{ reviews, getReviewsForDish, getStatsForDish, addReview }}>
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews() {
  const ctx = useContext(ReviewsContext);
  if (!ctx) throw new Error("useReviews must be used within ReviewsProvider");
  return ctx;
}
