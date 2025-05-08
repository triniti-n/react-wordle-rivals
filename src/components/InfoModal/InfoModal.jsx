import Modal from '../Modal/Modal';
import Cell from '../Cell/Cell';
import './InfoModal.css';
import { RiCloseLine } from 'react-icons/ri';

const InfoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="info-container">
        <button className="exit-button" onClick={onClose}>
          <RiCloseLine />
        </button>
        <h2 className="info-title">How To Play</h2>
        <h3>
          Race against the AI to guess the secret word! Both you and the AI have six tries to guess a five-letter word.
        </h3>
        
        <ul className="rules-list">
          <li>Each guess must be a valid five-letter word</li>
          <li>The color of the tiles will change to show how close your guess was</li>
          <li>The first to guess the word correctly wins</li>
          <li>If neither guesses correctly in six tries, it's a draw</li>
        </ul>
        
        <div className="row">
          <Cell value="W" status="correct" isCompleted />
          <Cell value="E" />
          <Cell value="A" />
          <Cell value="R" />
          <Cell value="Y" />
        </div>
        <h3>The letter W is in the word and in the correct spot.</h3>
        
        <div className="row">
          <Cell value="P" />
          <Cell value="I" status="present" isCompleted />
          <Cell value="L" />
          <Cell value="L" />
          <Cell value="S" />
        </div>
        <h3>The letter I is in the word but in the wrong spot.</h3>
        
        <div className="row">
          <Cell value="V" />
          <Cell value="A" />
          <Cell value="G" />
          <Cell value="U" status="absent" isCompleted />
          <Cell value="E" />
        </div>
        <h3>The letter U is not in the word in any spot.</h3>
      </div>
    </Modal>
  );
};

export default InfoModal;

