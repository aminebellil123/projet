import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { dishes as seedDishes, type Dish } from "@/data/dishes";

type DishesContextType = {
  dishes: Dish[];
  approvedDishes: Dish[];
  pendingDishes: Dish[];
  addDish: (dish: Omit<Dish, "id" | "status" | "note" | "avis">) => Dish;
  setStatus: (id: string, status: "approved" | "rejected") => void;
  getDish: (id: string) => Dish | undefined;
  getDishesByCuisinier: (nom: string) => Dish[];
};

const DishesContext = createContext<DishesContextType | null>(null);
const STORAGE_KEY = "diary_dishes_v1";

function loadDishes(): Dish[] {
  if (typeof window === "undefined") return seedDishes;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return seedDishes;
    const stored: Dish[] = JSON.parse(raw);
    // Merge: garde seedDishes (avec leurs images importées) + plats créés par les cuisiniers
    const seedIds = new Set(seedDishes.map((d) => d.id));
    const userDishes = stored.filter((d) => !seedIds.has(d.id));
    return [...seedDishes, ...userDishes];
  } catch {
    return seedDishes;
  }
}

function saveDishes(list: Dish[]) {
  if (typeof window === "undefined") return;
  // On ne stocke que les plats créés par utilisateurs (pas les seed)
  const seedIds = new Set(seedDishes.map((d) => d.id));
  const userDishes = list.filter((d) => !seedIds.has(d.id));
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(userDishes));
}

export function DishesProvider({ children }: { children: ReactNode }) {
  const [list, setList] = useState<Dish[]>(seedDishes);

  useEffect(() => {
    setList(loadDishes());
  }, []);

  const addDish: DishesContextType["addDish"] = (data) => {
    const newDish: Dish = {
      ...data,
      id: `dish-${Date.now()}`,
      note: 0,
      avis: 0,
      status: "pending",
    };
    setList((prev) => {
      const next = [...prev, newDish];
      saveDishes(next);
      return next;
    });
    return newDish;
  };

  const setStatus: DishesContextType["setStatus"] = (id, status) => {
    setList((prev) => {
      const next = prev.map((d) => (d.id === id ? { ...d, status } : d));
      saveDishes(next);
      return next;
    });
  };

  const approvedDishes = list.filter((d) => (d.status ?? "approved") === "approved");
  const pendingDishes = list.filter((d) => d.status === "pending");

  const getDish = (id: string) => list.find((d) => d.id === id);
  const getDishesByCuisinier = (nom: string) => list.filter((d) => d.cuisinier.toLowerCase() === nom.toLowerCase());

  return (
    <DishesContext.Provider value={{ dishes: list, approvedDishes, pendingDishes, addDish, setStatus, getDish, getDishesByCuisinier }}>
      {children}
    </DishesContext.Provider>
  );
}

export function useDishes() {
  const ctx = useContext(DishesContext);
  if (!ctx) throw new Error("useDishes must be used within DishesProvider");
  return ctx;
}
