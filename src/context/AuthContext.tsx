import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Role = "client" | "cuisinier" | "admin";

export type AuthUser = {
  id: string;
  nom: string;
  email: string;
  role: Role;
  ville?: string;
};

type AuthContextType = {
  user: AuthUser | null;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  register: (data: { nom: string; email: string; password: string; role: Role; ville?: string }) => { ok: boolean; error?: string };
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const USERS_KEY = "diary_users_v1";
const SESSION_KEY = "diary_session_v1";

type StoredUser = AuthUser & { password: string };

const ADMIN_USER: StoredUser = {
  id: "admin-root",
  nom: "Administrateur",
  email: "admin@admin",
  password: "123321",
  role: "admin",
};

function readUsers(): StoredUser[] {
  if (typeof window === "undefined") return [ADMIN_USER];
  try {
    const raw = sessionStorage.getItem(USERS_KEY);
    const arr: StoredUser[] = raw ? JSON.parse(raw) : [];
    if (!arr.some((u) => u.email === ADMIN_USER.email)) arr.unshift(ADMIN_USER);
    return arr;
  } catch {
    return [ADMIN_USER];
  }
}

function writeUsers(users: StoredUser[]) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    // ensure admin exists
    writeUsers(readUsers());
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  const login: AuthContextType["login"] = (email, password) => {
    const users = readUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!found) return { ok: false, error: "Email ou mot de passe incorrect." };
    const session: AuthUser = { id: found.id, nom: found.nom, email: found.email, role: found.role, ville: found.ville };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
    return { ok: true };
  };

  const register: AuthContextType["register"] = ({ nom, email, password, role, ville }) => {
    if (!nom || !email || !password) return { ok: false, error: "Tous les champs sont obligatoires." };
    const users = readUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: "Un compte avec cet email existe déjà." };
    }
    const newUser: StoredUser = {
      id: `${role}-${Date.now()}`,
      nom,
      email,
      password,
      role,
      ville,
    };
    users.push(newUser);
    writeUsers(users);
    const session: AuthUser = { id: newUser.id, nom, email, role, ville };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
    return { ok: true };
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
