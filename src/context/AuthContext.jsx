import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

// hardcoded mock credentials - would be a real API in production
const MOCK_EMAIL = "admin@company.com";
const MOCK_PASSWORD = "admin123";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // check localStorage on first load so refresh keeps you logged in
  useEffect(() => {
    const savedUser = localStorage.getItem("auth_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  function login(email, password) {
    // simulate a small delay like a real request
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === MOCK_EMAIL && password === MOCK_PASSWORD) {
          const loggedInUser = {
            name: "Rameshwar Singh",
            email: email,
            role: "Administrator",
          };
          setUser(loggedInUser);
          localStorage.setItem("auth_user", JSON.stringify(loggedInUser));
          resolve(loggedInUser);
        } else {
          reject(new Error("Invalid email or password"));
        }
      }, 500);
    });
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("auth_user");
  }

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// custom hook so components can grab auth easily
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
