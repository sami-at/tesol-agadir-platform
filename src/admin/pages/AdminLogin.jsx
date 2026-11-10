import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ErrorState from "../../components/common/ErrorState";
import LoadingState from "../../components/common/LoadingState";
import Button from "../../components/common/Button";

export default function AdminLogin() {
  const { isAuthenticated, loading, login, error, isSubmitting } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sand">
        <LoadingState message="Checking session..." />
      </div>
    );
  }

  if (isAuthenticated) {
    const redirectTo = location.state?.from?.pathname || "/admin";
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const success = await login(username, password);
    if (success) navigate("/admin", { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-sand px-4">
      <div className="w-full max-w-sm border border-slate/10 bg-white p-8">
        <p className="font-heading text-xl font-semibold text-oceanic">TESOL Admin</p>
        <p className="mt-1 text-sm text-slate/60">Sign in to manage site content.</p>

        <div
          role="note"
          className="mt-5 rounded border border-slate/15 bg-sand/60 px-3 py-2 text-xs text-slate/70"
        >
          Access is restricted to authorized academy administrators.
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4" aria-busy={isSubmitting}>
          <div>
            <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-slate">
              Username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded border border-slate/20 bg-white px-3 py-2 text-sm focus:border-oceanic focus:outline-none focus:ring-2 focus:ring-oceanic/25"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-slate/20 bg-white px-3 py-2 text-sm focus:border-oceanic focus:outline-none focus:ring-2 focus:ring-oceanic/25"
            />
          </div>

          {error && <ErrorState message={error} />}
          {isSubmitting && <LoadingState message="Signing in..." />}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
