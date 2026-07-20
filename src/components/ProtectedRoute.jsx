import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Wraps routes that require login. Redirects to /login if not authenticated.
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // wait until we've checked localStorage before deciding
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
