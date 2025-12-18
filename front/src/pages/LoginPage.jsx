import './styles/LoginPage.css';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext'

function LoginPage() {
    const [loginData, setLoginData] = useState({
        login: '',
        password: ''
    });

    const { login } = useAuth();

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
            await login(loginData);
        } catch (error) {
            console.error('Ошибка входа:', error);
        }
    }

    return (
        <div className='login-container'>
            <form className='login-form' onSubmit={handleSubmit}>
                <div className='form-group'>
                    <input
                        type="text"
                        name="login"
                        placeholder='Введите логин'
                        value={loginData.login}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <input
                        type="password"
                        name="password"
                        placeholder="Введите пароль"
                        value={loginData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="login-button">
                    Войти
                </button>
            </form>
        </div>
    );
}

export default LoginPage;