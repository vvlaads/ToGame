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
                <h1>С возвращением, {user?.username}!</h1>
            </div>
        </LayoutWithNav>
    );
}

export default HomePage;