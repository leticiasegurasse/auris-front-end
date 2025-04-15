import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div className="text-center mt-10">Carregando...</div>;

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
