import React from 'react';
import Modal from '../Modal/Modal';
import './GameOverModal.css';

const GameOverModal = ({ isOpen, onClose, isWinner, isAIWinner, solution, onReset }) => {
  // Game is completed if someone won or if we reached max attempts (solution exists but no winner)
  const isGameCompleted = isWinner || isAIWinner || (solution && !isWinner && !isAIWinner);
  
  const getTitle = () => {
    if (!isGameCompleted) return 'Game Paused';
    if (isWinner) return 'You Won!';
    if (isAIWinner) return 'AI Won!';
    return 'Game Over';
  };

  const getMessage = () => {
    if (!isGameCompleted) return 'Game is currently paused. Would you like to continue or start a new game?';
    if (isWinner) return 'Congratulations! You guessed the word correctly.';
    if (isAIWinner) return 'The AI guessed the word first.';
    // Only show the solution word when the game is completed
    return `The word was: ${solution}`;
  };

  return (
    <Modal title={getTitle()} isOpen={isOpen} onClose={onClose}>
      <div className="game-over-content">
        <p>{getMessage()}</p>
        {!isGameCompleted && (
          <button className="continue-button" onClick={onClose}>
            Continue Game
          </button>
        )}
        <button className="reset-button" onClick={onReset}>
          {isGameCompleted ? 'Play Again' : 'New Game'}
        </button>
      </div>
    </Modal>
  );
};

export default GameOverModal;
