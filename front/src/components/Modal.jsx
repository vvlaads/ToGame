import './styles/Modal.css';
import { useEffect } from 'react';

const Modal = ({ isOpen, onClose, children }) => {

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);


    if (!isOpen) return null;

    return (
        <div className="modal__background" onClick={onClose}>
            <div
                className="modal__content"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
};

export default Modal;
