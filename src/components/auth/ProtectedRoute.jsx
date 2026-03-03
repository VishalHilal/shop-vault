import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, session, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 font-mono text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
