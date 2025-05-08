import React from 'react';
import Modal from '../Modal/Modal';
import './PausedModal.css';

const PausedModal = ({ isOpen, onClose, onReset }) => {
  if (!isOpen) return null;

  return (
    <Modal title="Game Paused" isOpen={isOpen} onClose={onClose}>
      <div className="paused-content">
        <p>Game is currently paused. Would you like to continue or start a new game?</p>
        <button className="continue-button" onClick={onClose}>
          Continue Game
        </button>
        <button className="reset-button" onClick={onReset}>
          New Game
        </button>
      </div>
    </Modal>
  );
};

export default PausedModal;
