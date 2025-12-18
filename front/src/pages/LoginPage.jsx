import './styles/LoginPage.css';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext'
import GamePad from '../assets/icons/gamepad.svg';

function LoginPage() {
    const [loginData, setLoginData] = useState({
        login: '',
        password: ''
    });

    const [isAuth, setAuth] = useState(true);

    const { login, register } = useAuth();

    // Обновляем сохраненные данные
    function handleChange(e) {
        const { name, value } = e.target;
        setLoginData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    // Отправка запроса
    async function handleSubmit(e) {
        e.preventDefault(); // Не перезагружать страницу
        try {
            if (isAuth) {
                await login(loginData);
            }
            await register(loginData);
        } catch (error) {
            console.error('Ошибка входа:', error);
        }
    }

    function changeType(status) {
        setAuth(status);
    }

    return (
        <div className='login-page__login-container'>
            <div className='login-page__logo'>
                <img src={GamePad} alt="Логотип" className='login-page__icon' />
            </div>
            <span className='login-page__title'>ToGame</span>
            <span className='login-page__description'>Найдите игроков с общими интересами</span>

            <form className='login-page__login-form' onSubmit={handleSubmit}>
                <div className='login-page__change-button-container'>
                    <button
                        className={`login-page__change-button ${isAuth ? 'login-page__change-button--active' : ''}`}
                        onClick={() => changeType(true)}>
                        Авторизация
                    </button>
                    <button
                        className={`login-page__change-button ${!isAuth ? 'login-page__change-button--active' : ''}`}
                        onClick={() => changeType(false)}>
                        Регистрация
                    </button>
                </div>

                <div className='login-page__form-group'>
                    <label className='login-page__label'>Логин</label>
                    <input
                        type='text'
                        name='login'
                        placeholder='Введите логин'
                        value={loginData.login}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className='login-page__form-group'>
                    <label className='login-page__label'>Пароль</label>
                    <input
                        type='password'
                        name='password'
                        placeholder='Введите пароль'
                        value={loginData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type='submit' className='login-page__login-button'>
                    Войти
                </button>
            </form>
        </div>
    );
}

export default LoginPage;