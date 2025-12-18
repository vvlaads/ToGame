import './styles/ProfilePage.css';

import LayoutWithNav from '../components/LayoutWithNav';
import { useAuth } from '../context/AuthContext';

function ProfilePage() {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <LayoutWithNav>
            <div>
                <h1>{user?.username}</h1>
                <button onClick={handleLogout}>Выйти</button>
            </div>
        </LayoutWithNav>
    );
}

export default ProfilePage;