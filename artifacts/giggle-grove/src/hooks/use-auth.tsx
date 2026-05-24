import React, { createContext, useContext, useState, useEffect } from "react";

type UserSession = {
  email: string;
  name: string;
  freePreviewsUsed: number;
};

type AdminSession = {
  token: string;
  username: string;
};

type AuthContextType = {
  user: UserSession | null;
  admin: AdminSession | null;
  loginUser: (email: string, name?: string) => void;
  logoutUser: () => void;
  loginAdmin: (token: string, username: string) => void;
  logoutAdmin: () => void;
  incrementPreview: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [admin, setAdmin] = useState<AdminSession | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("gg_user");
    const storedAdmin = localStorage.getItem("gg_admin");
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedAdmin) setAdmin(JSON.parse(storedAdmin));
  }, []);

  const loginUser = (email: string, name: string = "Parent") => {
    const session = { email, name, freePreviewsUsed: user?.freePreviewsUsed || 0 };
    setUser(session);
    localStorage.setItem("gg_user", JSON.stringify(session));
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("gg_user");
  };

  const loginAdmin = (token: string, username: string) => {
    const session = { token, username };
    setAdmin(session);
    localStorage.setItem("gg_admin", JSON.stringify(session));
  };

  const logoutAdmin = () => {
    setAdmin(null);
    localStorage.removeItem("gg_admin");
  };

  const incrementPreview = () => {
    if (user) {
      const updated = { ...user, freePreviewsUsed: (user.freePreviewsUsed || 0) + 1 };
      setUser(updated);
      localStorage.setItem("gg_user", JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{ user, admin, loginUser, logoutUser, loginAdmin, logoutAdmin, incrementPreview }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
