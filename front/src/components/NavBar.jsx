import './styles/NavBar.css';

import { Link } from "react-router-dom";
import HomeIcon from '../assets/icons/home.svg';
import ChatIcon from '../assets/icons/chat.svg';
import UserIcon from '../assets/icons/user.svg';

function NavBar() {
    return (
        <nav className='navbar'>
            <div className='nav-header'>
                <h3 className='title'>Меню</h3>
            </div>

            <ul className='menu'>
                <li className='item'>
                    <Link to="/" className='link'>
                        <img src={HomeIcon} alt="Главная" className='icon' />
                        Главная
                    </Link>
                </li>
                <li className='item'>
                    <Link to="/chats" className='link'>
                        <img src={ChatIcon} alt="Чаты" className='icon' />
                        Чаты
                    </Link>
                </li>
                <li className='item'>
                    <Link to="/profile" className='link'>
                        <img src={UserIcon} alt="Профиль" className='icon' />
                        Профиль
                    </Link>
                </li>
            </ul>
        </nav>
    );
}

export default NavBar;