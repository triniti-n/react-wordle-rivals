// show the end result of game eg. you win or you lose
import Modal from '../Modal/Modal';
//import styles from './InfoModal.css';

const InfoModal = ({ isOpen, onClose }) => {
  return (
    <Modal title={'How to play'} isOpen={isOpen} onClose={onClose}>
      <h3>
        Guess the WORDLE in six tries. Each guess must be a valid five-letter
        word. Hit the enter button to submit. After each guess, the color of the
        tiles will change to show how close your guess was to the word.
      </h3>
      <h3>The letter U is not in the word in any spot.</h3>
    </Modal>
  );
};

export default InfoModal;