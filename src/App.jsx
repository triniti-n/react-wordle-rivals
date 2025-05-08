import React, { useEffect, useState } from 'react';
import './App.css';
import Header from './components/Header/Header';
import InfoModal from './components/InfoModal/InfoModal';
import GameOverModal from './components/GameOverModal/GameOverModal';
import Keyboard from './components/Keyboard/Keyboard';
import Grid from './components/Grid/Grid';
import useLocalStorage from './hooks/useLocalStorage';
import { MAX_WORD_LENGTH, MAX_CHALLENGES } from './constants/settings';
import { isWordValid, getWordOfDay } from './lib/words';
import { getAIGuess } from './lib/aiPlayer';

function App() {
  // Add state for game over modal
  const [isGameOverModalOpen, setIsGameOverModalOpen] = useState(false);
  
  // Original state for first player
  const [boardState, setBoardState] = useLocalStorage('boardState', {
    guesses: [],
    solutionIndex: '',
  });

  // New state for second player
  const [boardState2, setBoardState2] = useLocalStorage('boardState2', {
    guesses: [],
    solutionIndex: '',
  });

  const { solution, solutionIndex } = getWordOfDay();
  
  // First player state
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState(() => {
    if (boardState.solutionIndex !== solutionIndex) return [];
    return boardState.guesses;
  });
  
  // Second player state
  const [currentGuess2, setCurrentGuess2] = useState('');
  const [guesses2, setGuesses2] = useState(() => {
    if (boardState2.solutionIndex !== solutionIndex) return [];
    return boardState2.guesses;
  });

  // Shared state
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isJiggling, setIsJiggling] = useState(false);
  const [isJiggling2, setIsJiggling2] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const [isGameLost, setIsGameLost] = useState(false);
  const [isGameWon2, setIsGameWon2] = useState(false);
  const [isGameLost2, setIsGameLost2] = useState(false);
  const [isAIThinking, setIsAIThinking] = useState(false);
  
  // Show welcome modal
  useEffect(() => {
    // Show info modal after 1 second when app loads
    setTimeout(() => setIsInfoModalOpen(true), 1000);
    console.log("App mounted, solution:", solution);
    // eslint-disable-next-line
  }, []);
  
  // AI makes a move after player's turn
  useEffect(() => {
    if (guesses.length > 0 && guesses.length > guesses2.length && !isGameWon2 && !isGameLost2) {
      // Add a small delay to simulate AI thinking
      setIsAIThinking(true);
      
      setTimeout(() => {
        const aiGuess = getAIGuess(guesses2, solution);
        
        // Add AI guess to the list
        const newGuesses = [...guesses2, aiGuess];
        setGuesses2(newGuesses);
        
        // Check if AI won - compare case-insensitive
        if (aiGuess.toLowerCase() === solution.toLowerCase()) {
          setIsGameWon2(true);
          // Show game over modal after AI wins
          setTimeout(() => setIsGameOverModalOpen(true), 1000);
        }
        
        // Check if AI lost
        if (newGuesses.length >= MAX_CHALLENGES && !isGameWon2) {
          setIsGameLost2(true);
        }
        
        // Update AI board state
        setBoardState2({
          guesses: newGuesses,
          solutionIndex: solutionIndex,
        });
        
        setIsAIThinking(false);
      }, 1000); // 1 second delay
    }
  }, [guesses, guesses2, solution, solutionIndex, isGameWon2, isGameLost2, setBoardState2]);
  
  const handleKeyDown = letter => {
    if (currentGuess.length < MAX_WORD_LENGTH && !isGameWon && !isGameLost) {
      setCurrentGuess(currentGuess + letter);
    }
  };

  const handleDelete = () => {
    setCurrentGuess(currentGuess.slice(0, currentGuess.length - 1));
  };

  const handleEnter = () => {
    if (isGameWon || isGameLost) return;

    if (currentGuess.length < MAX_WORD_LENGTH) {
      setIsJiggling(true);
      console.log('Not enough letters');
      return;
    }

    if (!isWordValid(currentGuess)) {
      setIsJiggling(true);
      console.log('Not in word list');
      return;
    }
    
    // Check if the guess has been used before - convert both to lowercase
    const lowerCaseGuess = currentGuess.toLowerCase();
    const isDuplicate = guesses.some(guess => guess.toLowerCase() === lowerCaseGuess);
    
    if (isDuplicate) {
      setIsJiggling(true);
      console.log('Word already used');
      return;
    }

    // Add guess to the list
    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);
    setCurrentGuess('');
    
    // Check if game is won - compare case-insensitive
    if (currentGuess.toLowerCase() === solution.toLowerCase()) {
      setIsGameWon(true);
      console.log("Player won! Setting isGameWon to true");
      // Directly set the modal to open for immediate feedback
      setIsGameOverModalOpen(true);
    }
    
    // Check if game is lost
    if (newGuesses.length >= MAX_CHALLENGES && !isGameWon) {
      setIsGameLost(true);
    }
    
    // Update board state
    setBoardState({
      guesses: newGuesses,
      solutionIndex: solutionIndex,
    });
  };

  // Add reset game function
  const resetGame = () => {
    // Get a new word
    const { solution: newSolution, solutionIndex: newSolutionIndex } = getWordOfDay();
    
    // Reset all game states
    setGuesses([]);
    setGuesses2([]);
    setCurrentGuess('');
    setCurrentGuess2('');
    setIsGameWon(false);
    setIsGameLost(false);
    setIsGameWon2(false);
    setIsGameLost2(false);
    
    // Reset board states in localStorage
    setBoardState({
      guesses: [],
      solutionIndex: newSolutionIndex,
    });
    setBoardState2({
      guesses: [],
      solutionIndex: newSolutionIndex,
    });
    
    // Close the game over modal
    setIsGameOverModalOpen(false);
  };
  
  // Modify existing useEffect to show game over modal immediately when player wins
  useEffect(() => {
    if (isGameWon) {
      // Show game over modal immediately when player wins
      setIsGameOverModalOpen(true);
    } else if (isGameLost || isGameWon2 || isGameLost2) {
      // Show game over modal after a short delay for other game end conditions
      setTimeout(() => setIsGameOverModalOpen(true), 1500);
    }
  }, [isGameWon, isGameLost, isGameWon2, isGameLost2]);

  return (
    <div className="App">
      <Header
        setIsInfoModalOpen={setIsInfoModalOpen}
        setGameOverModalOpen={setIsGameOverModalOpen}
      />
      <InfoModal 
        isOpen={isInfoModalOpen} 
        onClose={() => setIsInfoModalOpen(false)} 
      />
      <GameOverModal
        isOpen={isGameOverModalOpen}
        onClose={() => setIsGameOverModalOpen(false)}
        isWinner={isGameWon}
        isAIWinner={isGameWon2}
        solution={solution}
        onReset={resetGame}
      />
      <div className="game-container">
        <div className="game-area game-area-left">
          <h3>You</h3>
          <Grid 
            guesses={guesses}
            currentGuess={currentGuess}
            isJiggling={isJiggling}
            setIsJiggling={setIsJiggling}
            solution={solution}
          />
        </div>
        
        <div className="game-area game-area-right">
          <h3>AI</h3>
          <Grid 
            guesses={guesses2}
            currentGuess={currentGuess2}
            isJiggling={isJiggling2}
            setIsJiggling={setIsJiggling2}
            solution={solution}
          />
        </div>
      </div>
      {isAIThinking && (
        <div className="ai-thinking">
          AI is thinking...
        </div>
      )}
      
      <div className="keyboard-container">
        <Keyboard 
          onEnter={handleEnter}
          onDelete={handleDelete}
          onKeyDown={handleKeyDown}
          guesses={guesses}
          solution={solution}
        />
      </div>
    </div>
  );
}

export default App;
