import React, { useEffect, useState } from 'react';
import './App.css';
import Header from './components/Header/Header';
import InfoModal from './components/InfoModal/InfoModal';
import Keyboard from './components/Keyboard/Keyboard';
import Grid from './components/Grid/Grid';
import useLocalStorage from './hooks/useLocalStorage';
import { MAX_WORD_LENGTH, MAX_CHALLENGES } from './constants/settings';
import { isWordValid, getWordOfDay } from './lib/words';

function App() {
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
  
  // Show welcome modal
  useEffect(() => {
    // Show info modal after 1 second when app loads
    setTimeout(() => setIsInfoModalOpen(true), 1000);
    console.log("App mounted, solution:", solution);
    // eslint-disable-next-line
  }, []);
  
  const handleKeyDown = letter => {
    if (currentGuess.length < MAX_WORD_LENGTH && !isGameWon) {
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

    // Add guess to the list
    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);
    setCurrentGuess('');
    
    // Check if game is won
    if (currentGuess === solution) {
      setIsGameWon(true);
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

  return (
    <div className="App">
      <Header
        setIsInfoModalOpen={setIsInfoModalOpen}
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
      
      <div className="keyboard-container">
        <Keyboard 
          onEnter={handleEnter}
          onDelete={handleDelete}
          onKeyDown={handleKeyDown}
          guesses={guesses}
          solution={solution}
        />
      </div>

      <InfoModal 
        isOpen={isInfoModalOpen} 
        onClose={() => setIsInfoModalOpen(false)} 
      />
    </div>
  );
}

export default App;
