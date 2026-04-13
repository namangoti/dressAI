import { createContext, useContext, useState, useEffect } from "react";

interface User {
  name: string;
  email: string;
}

interface StoredUser {
  name: string;
  email: string;
  password: string;
}

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => string | null;
  signup: (name: string, email: string, password: string) => string | null;
  socialLogin: (provider: "google" | "apple") => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "dressai-auth";
const USERS_KEY = "dressai-users";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  function getUsers(): StoredUser[] {
    try {
      const raw = localStorage.getItem(USERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveUsers(users: StoredUser[]) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function login(email: string, password: string): string | null {
    const users = getUsers();
    const match = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!match) return "Incorrect email or password.";
    const loggedIn: User = { name: match.name, email: match.email };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedIn));
    setUser(loggedIn);
    return null;
  }

  function signup(name: string, email: string, password: string): string | null {
    const users = getUsers();
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return "An account with this email already exists.";
    }
    const newUser: StoredUser = { name, email, password };
    saveUsers([...users, newUser]);
    const loggedIn: User = { name, email };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedIn));
    setUser(loggedIn);
    return null;
  }

  function socialLogin(provider: "google" | "apple") {
    const providerNames = { google: "Google User", apple: "Apple User" };
    const providerEmails = { google: "user@gmail.com", apple: "user@icloud.com" };
    const loggedIn: User = { name: providerNames[provider], email: providerEmails[provider] };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedIn));
    setUser(loggedIn);
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, socialLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
