import './styles/AuthPage.css';
import GamePad from '../assets/icons/gamepad.svg';
import GamesListWithPagination from '../components/GamesListWithPagination';
import { useEffect, useState } from 'react';
import { AUTH_TYPE } from '../constants/enums';
import { Toaster, toast } from 'sonner';
import { useGame } from '../context/GameContext';
import { useUser } from '../context/UserContext';


function AuthPage() {
    const [authType, setAuthType] = useState(AUTH_TYPE.SIGN_IN);
    const [userData, setUserData] = useState({
        name: '',
        password: '',
        rePassword: '',
        games: []
    });
    const [step, setStep] = useState(1); // 1 - форма, 2 - выбор игр
    const [availableGames, setAvailableGames] = useState([]); // Новое состояние для игр
    const [loadingGames, setLoadingGames] = useState(false); // Состояние загрузки
    const { signIn, register } = useUser();
    const { getAllGames } = useGame();

    // Изменение формы авторизации
    function handleTypeChange(newType) {
        return (e) => {
            e.preventDefault();
            setAuthType(newType);
            setStep(1);
        }
    }

    // Обновляем данные формы
    function handleChange(e) {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    // Переход к выбору игр
    function handleNextStep(e) {
        e.preventDefault();

        // Валидация паролей при регистрации
        if (authType === AUTH_TYPE.REGISTER) {
            if (userData.password !== userData.rePassword) {
                toast.error('Пароли не совпадают');
                return;
            }
            setStep(2);
        } else {
            handleSubmit(e)
        }

    }

    // Назад к форме
    function handleBackStep() {
        setStep(1);
    }

    // Отправка формы
    async function handleSubmit(e) {
        e.preventDefault(); // Не перезагружать страницу

        try {
            let response;
            switch (authType) {
                case AUTH_TYPE.SIGN_IN:
                    response = await signIn({
                        name: userData.name,
                        password: userData.password
                    });
                    break;
                case AUTH_TYPE.REGISTER:
                    response = await register({
                        name: userData.name,
                        password: userData.password,
                        games: userData.games.map(game => ({
                            name: game.name
                        }))
                    });
                    break;
            }

            if (!response) {
                throw new Error('Ошибка');
            }

        } catch (error) {
            console.error('Ошибка:', error);
            toast.error(authType === AUTH_TYPE.REGISTER ? 'Ошибка регистрации' : 'Ошибка входа');
        }
    }

    // Обработчик выбора игр
    function handleGameSelect(game) {
        setUserData(prev => {
            const gameId = game.id || game.name;
            const gameName = game.name || game;

            // Проверяем, выбрана ли уже эта игра
            const isSelected = prev.games.some(g => {
                return g.id === gameId || g.name === gameName;
            });

            // Если выбрана - удаляем, если нет - добавляем
            const newGames = isSelected
                ? prev.games.filter(g => {
                    return g.id !== gameId && g.name !== gameName;
                })
                : [...prev.games, game]; // Сохраняем весь объект игры

            return { ...prev, games: newGames };
        });
    }

    // Рендерим шаг 1 - форму
    function renderFormStep() {
        return (
            <form className='auth-page__login-form' onSubmit={handleNextStep}>
                <div className='auth-page__change-button-container'>
                    <button
                        type='button'
                        className={`auth-page__change-button ${authType === AUTH_TYPE.SIGN_IN ? 'auth-page__change-button--active' : ''}`}
                        onClick={handleTypeChange(AUTH_TYPE.SIGN_IN)}>
                        Авторизация
                    </button>
                    <button
                        type='button'
                        className={`auth-page__change-button ${authType === AUTH_TYPE.REGISTER ? 'auth-page__change-button--active' : ''}`}
                        onClick={handleTypeChange(AUTH_TYPE.REGISTER)}>
                        Регистрация
                    </button>
                </div>

                <div className='auth-page__form-group'>
                    <label className='auth-page__label'>Логин</label>
                    <input
                        type='text'
                        name='name'
                        placeholder='Введите логин'
                        value={userData.name}
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

                {authType === AUTH_TYPE.REGISTER && (
                    <div className='auth-page__form-group'>
                        <label className='auth-page__label'>Повтор пароля</label>
                        <input
                            type='password'
                            name='rePassword'
                            placeholder='Повторите пароль'
                            value={userData.rePassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                )}

                <button type='submit' className='auth-page__login-button'>
                    {authType === AUTH_TYPE.REGISTER ? 'Далее' : 'Войти'}
                </button>
            </form>
        );
    }

    // Рендерим шаг 2 - выбор игр
    function renderGamesStep() {
        return (
            <div className='auth-page__games-step'>
                <div className='auth-page__games-step-header'>
                    Выберите игры, которые вам нравятся:
                </div>

                {loadingGames ? (
                    <div className='auth-page__loading'>
                        Загрузка игр...
                    </div>
                ) : (
                    <GamesListWithPagination
                        games={availableGames}
                        selectedGames={userData.games}
                        onGameSelect={handleGameSelect}
                    />)
                }

                <div className='auth-page__step-2-buttons'>
                    <button
                        onClick={handleSubmit}
                        className='auth-page__step-2-button'
                        id='auth-page__step-2-submit'>
                        Завершить регистрацию
                    </button>

                    <button
                        onClick={handleBackStep}
                        className='auth-page__step-2-button'
                        id='auth-page__step-2-cancel'>
                        Отмена
                    </button>
                </div>

            </div >
        );
    }

    // Загружаем игры при переходе на шаг 2
    useEffect(() => {
        if (step === 2 && authType === AUTH_TYPE.REGISTER && availableGames.length === 0) {
            loadGames();
        }
    }, [step, authType]);

    // Загрузка списка игр
    async function loadGames() {
        setLoadingGames(true);
        try {
            const games = await getAllGames();
            setAvailableGames(games || []);
        } catch (error) {
            console.error('Ошибка загрузки игр:', error);
            toast.error('Не удалось загрузить список игр');
            setAvailableGames([]); // Пустой массив при ошибке
        } finally {
            setLoadingGames(false);
        }
    }

    return (
        <div className='auth-page__login-container'>
            <Toaster position="top-right" />
            <div className='auth-page__logo'>
                <img src={GamePad} alt="Логотип" className='auth-page__icon' />
            </div>
            <span className='auth-page__title'>ToGame</span>
            <span className='auth-page__description'>Найдите игроков с общих интересами</span>

            {step === 1 ? renderFormStep() : renderGamesStep()}
        </div>
    );
}

export default AuthPage;