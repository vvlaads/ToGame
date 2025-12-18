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
            <div className="profile-page__container">
                <div className="profile-page__content">
                    <div className='profile-page__header'>
                        <div className='profile-page__image'>
                            {/* Фоновая картинка профиля */}
                        </div>
                        <div className='profile-page__user-info'>
                            <div className='profile-page__avatar'>
                                {user?.username?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div className='profile-page__info'>
                                <div className='profile-page__username'>{user?.username}</div>
                                <div className='profile-page__id'>#{user?.id?.toString().padStart(5, '0') || '00001'}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='profile-page__exit-button-container'>
                    <button className='profile-page__exit-button' onClick={handleLogout}>
                        Выйти
                    </button>
                </div>
            </div>
        </LayoutWithNav>
    );
}

export default ProfilePage;