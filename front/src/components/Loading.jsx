import './styles/Loading.css';
import LayoutWithNav from "./LayoutWithNav";

function Loading() {
    return (
        <LayoutWithNav>
            <div className='loading__container'>
                <div className="loading__loading">
                    <div className="loading__spinner">
                    </div>
                </div>
            </div>
        </LayoutWithNav>
    );
}

export default Loading;