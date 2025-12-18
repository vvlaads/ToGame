import './styles/LayoutWithNav.css'

import NavBar from './NavBar';

function LayoutWithNav({ children }) {
    return (
        <div className='container'>
            <NavBar />
            <main className='main'>
                {children}
            </main>
        </div>
    );
}

export default LayoutWithNav;