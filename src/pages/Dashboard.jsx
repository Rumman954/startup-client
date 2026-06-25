import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner fullScreen />;

  if (!user) return <Navigate to="/login" />;

  const routes = {
    founder: '/founder/dashboard',
    collaborator: '/collaborator/dashboard',
    admin: '/admin/dashboard',
  };

  return <Navigate to={routes[user.role] || '/'} replace />;
};

export default Dashboard;
