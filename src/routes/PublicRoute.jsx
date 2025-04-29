import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../config/routes';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div className="text-center mt-10">Carregando...</div>;

  return isAuthenticated ? <Navigate to={ROUTES.HOME} /> : children;
};

export default PublicRoute;
