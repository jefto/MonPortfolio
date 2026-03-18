import { Navigate } from 'react-router-dom';

/**
 * Protège une route : redirige vers /admin/login si aucun token n'est présent.
 */
const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('admin_token');
    if (!token) return <Navigate to="/admin/login" replace />;
    return children;
};

export default PrivateRoute;

