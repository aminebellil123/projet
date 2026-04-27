import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type CartItem = {
  dishId: string;
  nom: string;
  prix: number;
  image: string;
  cuisinier: string;
  ville: string;
  qty: number;
};

export type Order = {
  id: string;
  clientId: string;
  clientNom: string;
  clientTel: string;
  clientAdresse: string;
  items: CartItem[];
  total: number;
  paiement: "carte" | "livraison" | "d17";
  paiementInfo?: string; // ex: numéro D17 masqué ou last4 carte
  status: "en_attente" | "acceptee" | "refusee" | "en_livraison" | "livree";
  createdAt: number;
};

type CartContextType = {
  items: CartItem[];
  orders: Order[];
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (dishId: string) => void;
  setQty: (dishId: string, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
  placeOrder: (info: { clientId: string; clientNom: string; clientTel: string; clientAdresse: string; paiement: "carte" | "livraison" | "d17"; paiementInfo?: string }) => Order;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
  ordersForCuisinier: (nom: string) => Order[];
};

const CartContext = createContext<CartContextType | null>(null);
const CART_KEY = "diary_cart_v1";
const ORDERS_KEY = "diary_orders_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    try {
      const c = sessionStorage.getItem(CART_KEY);
      if (c) setItems(JSON.parse(c));
      const o = sessionStorage.getItem(ORDERS_KEY);
      if (o) setOrders(JSON.parse(o));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    sessionStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }, [orders]);

  const add: CartContextType["add"] = (item, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((i) => i.dishId === item.dishId);
      if (found) return prev.map((i) => (i.dishId === item.dishId ? { ...i, qty: i.qty + qty } : i));
      return [...prev, { ...item, qty }];
    });
  };
  const remove: CartContextType["remove"] = (dishId) => setItems((prev) => prev.filter((i) => i.dishId !== dishId));
  const setQty: CartContextType["setQty"] = (dishId, qty) => {
    if (qty <= 0) return remove(dishId);
    setItems((prev) => prev.map((i) => (i.dishId === dishId ? { ...i, qty } : i)));
  };
  const clear = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.prix * i.qty, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  const placeOrder: CartContextType["placeOrder"] = (info) => {
    const order: Order = {
      id: `cmd-${Date.now()}`,
      ...info,
      items: [...items],
      total,
      status: "en_attente",
      createdAt: Date.now(),
    };
    setOrders((prev) => [order, ...prev]);
    setItems([]);
    return order;
  };

  const updateOrderStatus: CartContextType["updateOrderStatus"] = (id, status) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const ordersForCuisinier = (nom: string) =>
    orders.filter((o) => o.items.some((i) => i.cuisinier.toLowerCase() === nom.toLowerCase()));

  return (
    <CartContext.Provider value={{ items, orders, add, remove, setQty, clear, total, count, placeOrder, updateOrderStatus, ordersForCuisinier }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
