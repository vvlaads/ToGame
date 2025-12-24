import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Защищенный маршрут - только для авторизованных
function ProtectedRoute({ children }) {
    const { user } = useAuth();

    if (!user) {
        // Если не авторизован, перенаправляем на логин
        return <Navigate to="/auth" replace />;
    }

    return children;
};

// Публичный маршрут - только для неавторизованных
function PublicRoute({ children }) {
    const { user } = useAuth();

    if (user) {
        // Если уже авторизован, перенаправляем на главную
        return <Navigate to="/" replace />;
    }

    return children;
};

export { ProtectedRoute, PublicRoute };