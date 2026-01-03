import { useEffect } from 'react';
import './styles/Modal.css'

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    // Обработчик нажатия клавиши Esc
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    return (
        <div className="modal__background" onClick={onClose}>
            <div className="modal__content" onClick={(e) => { e.stopPropagation(); }}>
                {children}
            </div>
        </div>
    );
};

export default Modal;