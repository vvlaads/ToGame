import './styles/AuthPage.css';
import GamePad from '../assets/icons/gamepad.svg';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext'
import { AUTH_TYPE } from '../constants/enums';

function AuthPage() {
    const [authType, setAuthType] = useState(AUTH_TYPE.SIGN_IN);
    const [userData, setUserData] = useState({
        name: '',
        password: ''
    });
    const { signIn, signUp } = useAuth();

    // Изменение формы авторизации
    function handleTypeChange(newType) {
        return (e) => {
            e.preventDefault();
            setAuthType(newType);
        }
    }

    // Обновляем сохраненные данные
    function handleChange(e) {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    // Отправка запроса
    async function handleSubmit(e) {
        e.preventDefault(); // Не перезагружать страницу
        try {
            let response = { success: false };
            switch (authType) {
                case AUTH_TYPE.SIGN_IN:
                    response = await signIn(userData);
                    break;
                case AUTH_TYPE.SIGN_UP:
                    response = await signUp(userData);
                    break;
            }

            if (!response.success) {
                throw new Error(response.error);
            }
        } catch (error) {
            console.error('Ошибка авторизации:', error);
        }
    }

    return (
        <div className='auth-page__login-container'>
            <div className='auth-page__logo'>
                <img src={GamePad} alt="Логотип" className='auth-page__icon' />
            </div>
            <span className='auth-page__title'>ToGame</span>
            <span className='auth-page__description'>Найдите игроков с общими интересами</span>

            <form className='auth-page__login-form' onSubmit={handleSubmit}>
                <div className='auth-page__change-button-container'>
                    <button
                        type='button'
                        className={`auth-page__change-button ${authType === AUTH_TYPE.SIGN_IN ? 'auth-page__change-button--active' : ''}`}
                        onClick={handleTypeChange(AUTH_TYPE.SIGN_IN)}>
                        Авторизация
                    </button>
                    <button
                        type='button'
                        className={`auth-page__change-button ${authType === AUTH_TYPE.SIGN_UP ? 'auth-page__change-button--active' : ''}`}
                        onClick={handleTypeChange(AUTH_TYPE.SIGN_UP)}>
                        Регистрация
                    </button>
                </div>

                <div className='auth-page__form-group'>
                    <label className='auth-page__label'>Логин</label>
                    <input
                        type='text'
                        name='name'
                        placeholder='Введите логин'
                        value={userData.login}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className='auth-page__form-group'>
                    <label className='auth-page__label'>Пароль</label>
                    <input
                        type='password'
                        name='password'
                        placeholder='Введите пароль'
                        value={userData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type='submit' className='auth-page__login-button'>
                    Войти
                </button>
            </form>
        </div>
    );
}

export default AuthPage;