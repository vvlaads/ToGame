import './styles/AuthPage.css';
import GamePad from '../assets/icons/gamepad.svg';
import LeftArrow from '../assets/icons/left arrow.svg';
import RightArrow from '../assets/icons/right arrow.svg';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext'
import { AUTH_TYPE } from '../constants/enums';
import { Toaster, toast } from 'sonner';
import { useGame } from '../context/GameContext';
import GameCard from '../components/GameCard';


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
    const [currentPage, setCurrentPage] = useState(1); // Страница с играми
    const [gamesPerPage] = useState(5); // Сколько игр на одной странице
    const { signIn, register } = useAuth();
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
                    <>
                        <div className='auth-page__games-grid'>
                            {currentGames.map(game => {
                                // Правильно проверяем, выбрана ли игра
                                const isSelected = userData.games.some(selectedGame => {
                                    return selectedGame.name === game.name;
                                });

                                return (
                                    <GameCard
                                        key={game.name}
                                        game={game}
                                        isSelected={isSelected}
                                        onClick={() => handleGameSelect(game)}
                                    />
                                );
                            })}
                        </div>

                        {/* Пагинация */}
                        {totalPages > 1 && (
                            <div className='auth-page__pagination'>
                                <button
                                    onClick={prevPage}
                                    disabled={currentPage === 1}
                                    className='auth-page__pagination-button'
                                >
                                    <img src={LeftArrow} className='auth-page__pagination-button-icon' />
                                </button>

                                <div className='auth-page__page-numbers'>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                                        <button
                                            key={pageNumber}
                                            onClick={() => goToPage(pageNumber)}
                                            className={`auth-page__page-number ${currentPage === pageNumber ? 'auth-page__page-number--active' : ''}`}
                                        >
                                            {pageNumber}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={nextPage}
                                    disabled={currentPage === totalPages}
                                    className='auth-page__pagination-button'
                                >
                                    <img src={RightArrow} className='auth-page__pagination-button-icon' />
                                </button>
                            </div>
                        )}

                        <div className='auth-page__selected-count'>
                            Выбрано игр: {userData.games.length}
                        </div>
                    </>)
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

    // Вычисляем, какие игры показывать на текущей странице
    const indexOfLastGame = currentPage * gamesPerPage;
    const indexOfFirstGame = indexOfLastGame - gamesPerPage;
    const currentGames = availableGames.slice(indexOfFirstGame, indexOfLastGame);

    // Вычисляем общее количество страниц
    const totalPages = Math.ceil(availableGames.length / gamesPerPage);

    // Функции для смены страниц
    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToPage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

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