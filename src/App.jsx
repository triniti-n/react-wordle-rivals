import React, { useEffect, useState } from 'react';
import './App.css';
import Header from './components/Header/Header';
import InfoModal from './components/InfoModal/InfoModal';
import GameOverModal from './components/GameOverModal/GameOverModal';
import Keyboard from './components/Keyboard/Keyboard';
import Grid from './components/Grid/Grid';
import useLocalStorage from './hooks/useLocalStorage';
import { MAX_WORD_LENGTH, MAX_CHALLENGES } from './constants/settings';
import { isWordValid, getRandomWord } from './lib/words';
import { getAIGuess } from './lib/aiPlayer';

function App() {
  const [isGameOverModalOpen, setIsGameOverModalOpen] = useState(false);
  // Remove unused variable
  // const [isModalFromSettings, setIsModalFromSettings] = useState(false);
  
  // Generate a random solution when the app first loads
  const [currentSolution, setCurrentSolution] = useState(() => {
    return getRandomWord();
  });
  
  // Use the current solution state
  const { solution, solutionIndex } = currentSolution;
  
  const [boardState, setBoardState] = useLocalStorage('boardState', {
    guesses: [],
    solutionIndex: '',
  });

  const [boardState2, setBoardState2] = useLocalStorage('boardState2', {
    guesses: [],
    solutionIndex: '',
  });
  
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState(() => {
    if (boardState.solutionIndex !== solutionIndex) return [];
    return boardState.guesses;
  });
  
  const [currentGuess2, setCurrentGuess2] = useState('');
  const [guesses2, setGuesses2] = useState(() => {
    if (boardState2.solutionIndex !== solutionIndex) return [];
    return boardState2.guesses;
  });

  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isJiggling, setIsJiggling] = useState(false);
  const [isJiggling2, setIsJiggling2] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const [isGameLost, setIsGameLost] = useState(false);
  const [isGameWon2, setIsGameWon2] = useState(false);
  const [isGameLost2, setIsGameLost2] = useState(false);
  const [isAIThinking, setIsAIThinking] = useState(false);
  
  useEffect(() => {
    setTimeout(() => setIsInfoModalOpen(true), 1000);
    console.log("App mounted, solution:", solution);
  }, [solution]); // Add solution to dependency array
  
  useEffect(() => {
    if (guesses.length > 0 && guesses.length > guesses2.length && !isGameWon2 && !isGameLost2) {
      setIsAIThinking(true);
      
      setTimeout(() => {
        const aiGuess = getAIGuess(guesses2, solution);
        
        const newGuesses = [...guesses2, aiGuess];
        setGuesses2(newGuesses);
        
        if (aiGuess.toLowerCase() === solution.toLowerCase()) {
          setIsGameWon2(true);
          setTimeout(() => setIsGameOverModalOpen(true), 1000);
        }
        
        if (newGuesses.length >= MAX_CHALLENGES && !isGameWon2) {
          setIsGameLost2(true);
        }
        
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
    
    const lowerCaseGuess = currentGuess.toLowerCase();
    const isDuplicate = guesses.some(guess => guess.toLowerCase() === lowerCaseGuess);
    
    if (isDuplicate) {
      setIsJiggling(true);
      console.log('Word already used');
      return;
    }

    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);
    setCurrentGuess('');
    
    if (currentGuess.toLowerCase() === solution.toLowerCase()) {
      setIsGameWon(true);
      console.log("Player won! Setting isGameWon to true");
      setIsGameOverModalOpen(true);
    }
    
    if (newGuesses.length >= MAX_CHALLENGES && !isGameWon) {
      setIsGameLost(true);
    }
    
    setBoardState({
      guesses: newGuesses,
      solutionIndex: solutionIndex,
    });
  };

  const resetGame = () => {
    const { solution: newSolution, solutionIndex: newSolutionIndex } = getRandomWord();
    
    setCurrentSolution({
      solution: newSolution,
      solutionIndex: newSolutionIndex
    });
    
    setGuesses([]);
    setGuesses2([]);
    setCurrentGuess('');
    setCurrentGuess2('');
    setIsGameWon(false);
    setIsGameLost(false);
    setIsGameWon2(false);
    setIsGameLost2(false);
    
    setBoardState({
      guesses: [],
      solutionIndex: newSolutionIndex,
    });
    setBoardState2({
      guesses: [],
      solutionIndex: newSolutionIndex,
    });
    
    setIsGameOverModalOpen(false);
  };
  
  useEffect(() => {
    if (isGameWon) {
      // setIsModalFromSettings(false);
      setIsGameOverModalOpen(true);
    } else if (isGameLost || isGameWon2 || isGameLost2) {
      // setIsModalFromSettings(false);
      setTimeout(() => setIsGameOverModalOpen(true), 1500);
    }
  }, [isGameWon, isGameLost, isGameWon2, isGameLost2]);

  return (
    <div className="App">
      <Header
        setIsInfoModalOpen={setIsInfoModalOpen}
        setGameOverModalOpen={() => {
          // setIsModalFromSettings(true);
          setIsGameOverModalOpen(true);
        }}
      />
      <InfoModal 
        isOpen={isInfoModalOpen} 
        onClose={() => setIsInfoModalOpen(false)} 
      />
      <GameOverModal
        isOpen={isGameOverModalOpen}
        onClose={() => {
          setIsGameOverModalOpen(false);
          // setIsModalFromSettings(false);
        }}
        isWinner={isGameWon}
        isAIWinner={isGameWon2}
        solution={isGameWon || isGameLost || isGameWon2 || isGameLost2 ? solution : null}
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
