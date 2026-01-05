import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

// Защищенный маршрут - только для авторизованных
function ProtectedRoute({ children }) {
    const { user, loading } = useUser();

    if (loading) {
        return null;
    }

    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    return children;
};

// Публичный маршрут - только для неавторизованных
function PublicRoute({ children }) {
    const { user } = useUser();

    if (user) {
        // Если уже авторизован, перенаправляем на главную
        return <Navigate to="/" replace />;
    }

    return children;
};

export { ProtectedRoute, PublicRoute };