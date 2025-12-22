import './styles/Modal.css'

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal__background" onClick={onClose}>
            <div className="modal__content" onClick={(e) => { e.stopPropagation(); }}>
                {children}
            </div>
        </div>
    );
};

export default Modal;