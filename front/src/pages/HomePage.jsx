import './styles/HomePage.css'

import { useAuth } from '../context/AuthContext';
import LayoutWithNav from '../components/LayoutWithNav';

function HomePage() {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <LayoutWithNav>
            <div className='container'>
                <h1>Добро пожаловать, {user?.username}!</h1>

                <div className='info-card'>
                    <h3>Информация о пользователе:</h3>
                    <p><strong>Логин:</strong> {user?.username}</p>
                    <p><strong>Пароль:</strong> {user?.password}</p>
                </div>

                <button onClick={handleLogout} className='logout-button'>
                    Выйти
                </button>
            </div>
        </LayoutWithNav>
    );
}

export default HomePage;