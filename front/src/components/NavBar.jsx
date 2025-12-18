import './styles/NavBar.css';
import { NavLink } from 'react-router-dom';
import MenuIcon from '../assets/icons/menu.svg';
import HomeIcon from '../assets/icons/home.svg';
import SearchIcon from '../assets/icons/compass.svg';
import ChatIcon from '../assets/icons/chat.svg';
import UserIcon from '../assets/icons/user.svg';
import GamePad from '../assets/icons/gamepad.svg';
import { useNav } from '../context/NavContext';

function NavBar() {
    const { isNavHidden, toggleNav, navWidth } = useNav();

    return (
        <nav
            className={`nav-bar__navbar ${isNavHidden ? 'nav-bar__navbar--hidden' : ''}`}
            style={{ width: `${navWidth}px` }}
        >
            <div className='nav-bar__logo'>
                <img src={GamePad} alt="Логотип" className='nav-bar__logo_icon' />
            </div>

            <ul className='nav-bar__menu'>
                <li className='nav-bar__item'>
                    <div className='nav-bar__link' onClick={toggleNav}>
                        <img src={MenuIcon} alt='Меню' className='nav-bar__icon' />
                        {isNavHidden ? '' : 'Свернуть'}
                    </div>
                </li>
                <li className='nav-bar__item'>
                    <NavLink
                        to='/'
                        className={({ isActive }) =>
                            `nav-bar__link ${isActive ? 'nav-bar__link--active' : ''}`
                        }
                    >
                        <img src={HomeIcon} alt='Главная' className='nav-bar__icon' />
                        {isNavHidden ? '' : 'Главная'}
                    </NavLink>
                </li>
                <li className='nav-bar__item'>
                    <NavLink
                        to='/search'
                        className={({ isActive }) =>
                            `nav-bar__link ${isActive ? 'nav-bar__link--active' : ''}`
                        }
                    >
                        <img src={SearchIcon} alt='Поиск игроков' className='nav-bar__icon' />
                        {isNavHidden ? '' : 'Поиск игроков'}
                    </NavLink>
                </li>
                <li className='nav-bar__item'>
                    <NavLink
                        to='/chats'
                        className={({ isActive }) =>
                            `nav-bar__link ${isActive ? 'nav-bar__link--active' : ''}`
                        }
                    >
                        <img src={ChatIcon} alt='Чаты' className='nav-bar__icon' />
                        {isNavHidden ? '' : 'Чаты'}
                    </NavLink>
                </li>
                <li className='nav-bar__item'>
                    <NavLink
                        to='/profile'
                        className={({ isActive }) =>
                            `nav-bar__link ${isActive ? 'nav-bar__link--active' : ''}`
                        }
                    >
                        <img src={UserIcon} alt='Профиль' className='nav-bar__icon' />
                        {isNavHidden ? '' : 'Профиль'}
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}

export default NavBar;