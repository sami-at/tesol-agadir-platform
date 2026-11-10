import { createContext, useCallback, useContext, useEffect, useState } from "react";
import * as authService from "../services/authService";

const AuthContext = createContext(null);

/** Provides real, server-verified admin authentication state to the /admin section. */
export function AuthProvider({ children }) {
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    authService
      .fetchSession()
      .then((name) => {
        if (!cancelled) setUsername(name);
      })
      .catch(() => {
        if (!cancelled) setUsername(null);
      })
      .finally(() => {
        // oxlint-disable-next-line react/set-state-in-effect -- verifies the session cookie against the server on mount
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (usernameInput, password) => {
    setIsSubmitting(true);
    setError("");
    try {
      const name = await authService.login(usernameInput, password);
      setUsername(name);
      return true;
    } catch (err) {
      setError(err.message || "Unable to sign in.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUsername(null);
    }
  }, []);

  const isAuthenticated = Boolean(username);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, username, loading, login, logout, error, isSubmitting }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// oxlint-disable-next-line react/only-export-components -- hook is intentionally co-located with its provider
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
