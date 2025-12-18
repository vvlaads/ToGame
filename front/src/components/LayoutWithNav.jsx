import './styles/LayoutWithNav.css';
import NavBar from './NavBar';
import { useNav } from '../context/NavContext'; // ← Импорт

function LayoutWithNav({ children }) {
    const { navWidth } = useNav(); // ← Получаем ширину из контекста

    return (
        <div className='container'>
            <NavBar />
            <main
                className='main'
                style={{
                    marginLeft: `${navWidth}px`,
                    width: `calc(100% - ${navWidth}px)`
                }}
            >
                {children}
            </main>
        </div>
    );
}

export default LayoutWithNav;