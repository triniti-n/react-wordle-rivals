import Modal from '../Modal/Modal';

const InfoModal = ({ isOpen, onClose }) => {
  return (
    <Modal title={'How to play'} isOpen={isOpen} onClose={onClose}>
      <h3>
        Guess the WORDLE in six tries. Each guess must be a valid five-letter
        word. Hit the enter button to submit. After each guess, the color of the
        tiles will change to show how close your guess was to the word.
      </h3>
      <div className="examples">
        <p>
          <strong>Green</strong> means the letter is in the correct spot.
        </p>
        <p>
          <strong>Yellow</strong> means the letter is in the word but in the wrong spot.
        </p>
        <p>
          <strong>Gray</strong> means the letter is not in the word.
        </p>
      </div>
      <h3>Player vs AI Mode</h3>
      <p>
        You and the AI are competing to guess the same word. After you make a guess, 
        the AI will take its turn.
      </p>
      <p>
        First to guess the word in 6 or fewer tries wins!
      </p>
    </Modal>
  );
};

export default InfoModal;
