import { useRef } from 'react';
import useOnClickOutside from '../../hooks/useOnClickOutside';
import './Modal.css';

const Modal = ({ isOpen, onClose, title, children }) => {
  const ref = useRef();

  useOnClickOutside(ref, onClose);

  if (!isOpen) return null;

  return (
    <div className= 'modalContainer'>
      <div className='modal' ref={ref}>
        <h2 className='title'>{title}</h2>
        {children}
      </div>
    </div>
  );
};

export default Modal;
