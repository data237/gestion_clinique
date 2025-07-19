// components/RoleBasedRoute.js
import { Navigate, Outlet } from 'react-router-dom';

const RoleBasedRoute = ({ allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) return <Navigate to="/" replace />;

  return allowedRoles.includes(user) ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace />
  );
};

export default RoleBasedRoute;
