import { VALID_GUESSES } from '../constants/validGuesses';
import { WORDS } from '../constants/wordList';
import { getGuessStatuses } from './words';

const ALL_WORDS = [...new Set([...VALID_GUESSES, ...WORDS])];

// Letter frequency
const LETTER_FREQUENCY = {
  'A': 0.084, 'B': 0.021, 'C': 0.045, 'D': 0.034, 'E': 0.111, 
  'F': 0.018, 'G': 0.024, 'H': 0.030, 'I': 0.075, 'J': 0.002, 
  'K': 0.011, 'L': 0.056, 'M': 0.030, 'N': 0.066, 'O': 0.071, 
  'P': 0.031, 'Q': 0.002, 'R': 0.075, 'S': 0.057, 'T': 0.069, 
  'U': 0.036, 'V': 0.010, 'W': 0.015, 'X': 0.003, 'Y': 0.020, 'Z': 0.002
};

// Positional letter frequency for 5 letters words
const POSITIONAL_FREQUENCY = {
  0: { 
    'A': 0.060, 'B': 0.076, 'C': 0.078, 'D': 0.056, 'E': 0.037, 
    'F': 0.042, 'G': 0.045, 'H': 0.035, 'I': 0.018, 'J': 0.010, 
    'K': 0.015, 'L': 0.045, 'M': 0.051, 'N': 0.022, 'O': 0.020, 
    'P': 0.073, 'Q': 0.005, 'R': 0.060, 'S': 0.120, 'T': 0.070, 
    'U': 0.010, 'V': 0.015, 'W': 0.035, 'X': 0.001, 'Y': 0.010, 'Z': 0.003
  },
  1: {
    'A': 0.120, 'B': 0.005, 'C': 0.010, 'D': 0.005, 'E': 0.100, 
    'F': 0.005, 'G': 0.005, 'H': 0.030, 'I': 0.090, 'J': 0.001, 
    'K': 0.005, 'L': 0.040, 'M': 0.010, 'N': 0.020, 'O': 0.110, 
    'P': 0.015, 'Q': 0.001, 'R': 0.080, 'S': 0.005, 'T': 0.020, 
    'U': 0.050, 'V': 0.001, 'W': 0.010, 'X': 0.001, 'Y': 0.005, 'Z': 0.001
  },
  2: { 
    'A': 0.100, 'B': 0.020, 'C': 0.025, 'D': 0.030, 'E': 0.070, 
    'F': 0.015, 'G': 0.020, 'H': 0.010, 'I': 0.090, 'J': 0.001, 
    'K': 0.010, 'L': 0.040, 'M': 0.025, 'N': 0.060, 'O': 0.080, 
    'P': 0.020, 'Q': 0.001, 'R': 0.060, 'S': 0.040, 'T': 0.040, 
    'U': 0.040, 'V': 0.020, 'W': 0.010, 'X': 0.005, 'Y': 0.010, 'Z': 0.005
  },
  3: { 
    'A': 0.060, 'B': 0.010, 'C': 0.030, 'D': 0.020, 'E': 0.110, 
    'F': 0.010, 'G': 0.020, 'H': 0.010, 'I': 0.060, 'J': 0.001, 
    'K': 0.020, 'L': 0.060, 'M': 0.020, 'N': 0.080, 'O': 0.040, 
    'P': 0.020, 'Q': 0.001, 'R': 0.050, 'S': 0.070, 'T': 0.050, 
    'U': 0.030, 'V': 0.010, 'W': 0.010, 'X': 0.001, 'Y': 0.010, 'Z': 0.005
  },
  4: {
    'A': 0.030, 'B': 0.010, 'C': 0.010, 'D': 0.040, 'E': 0.180, 
    'F': 0.010, 'G': 0.020, 'H': 0.030, 'I': 0.010, 'J': 0.001, 
    'K': 0.030, 'L': 0.060, 'M': 0.020, 'N': 0.050, 'O': 0.030, 
    'P': 0.020, 'Q': 0.001, 'R': 0.060, 'S': 0.040, 'T': 0.070, 
    'U': 0.010, 'V': 0.001, 'W': 0.010, 'X': 0.001, 'Y': 0.100, 'Z': 0.010
  }
};

// Initial guess options 
const INITIAL_GUESSES = ['STARE', 'ARISE', 'RAISE', 'TEARS', 'RATES'];

export const getAIGuess = (aiGuesses, solution, playerGuesses = []) => {
  if (aiGuesses.length === 0) {
    if (playerGuesses.length > 0) {
      const statuses = getGuessStatuses(playerGuesses[0], solution);
      const correctLetters = [];
      const presentLetters = [];
      
      playerGuesses[0].toUpperCase().split('').forEach((letter, index) => {
        if (statuses[index] === 'correct') {
          correctLetters.push({ letter, index });
        } else if (statuses[index] === 'present') {
          presentLetters.push(letter);
        }
      });
      
      if (correctLetters.length > 0 || presentLetters.length > 0) {
        const smartGuess = findSmartFirstGuess(correctLetters, presentLetters);
        if (smartGuess) return smartGuess.toUpperCase();
      }
    }
    
    return INITIAL_GUESSES[Math.floor(Math.random() * INITIAL_GUESSES.length)];
  }

  const allGuesses = [...aiGuesses, ...playerGuesses];
  let possibleWords = [...ALL_WORDS];
  
  const allGuessesUpperCase = allGuesses.map(guess => guess.toUpperCase());
  possibleWords = possibleWords.filter(word => 
    !allGuessesUpperCase.includes(word.toUpperCase())
  );
  
  // Rule-based filtering
  allGuesses.forEach(guess => {
    const statuses = getGuessStatuses(guess, solution);
    const correctPositions = {};
    const presentLetters = new Set();
    const absentLetters = new Set();
    
    guess.toUpperCase().split('').forEach((letter, index) => {
      const status = statuses[index];
      if (status === 'correct') {
        correctPositions[index] = letter;
        presentLetters.add(letter);
      } else if (status === 'present') {
        presentLetters.add(letter);
      } else if (status === 'absent') {
        if (!presentLetters.has(letter)) {
          absentLetters.add(letter);
        }
      }
    });
    
    // Filter words based on the rules
    possibleWords = possibleWords.filter(word => {
      const upperWord = word.toUpperCase();
      
      for (const [index, letter] of Object.entries(correctPositions)) {
        if (upperWord[index] !== letter) return false;
      }
      
      for (const letter of presentLetters) {
        if (!upperWord.includes(letter)) return false;
        
        guess.toUpperCase().split('').forEach((guessLetter, index) => {
          if (guessLetter === letter && statuses[index] === 'present' && upperWord[index] === letter) {
            return false;
          }
        });
      }
      
      for (const letter of absentLetters) {
        if (upperWord.includes(letter)) return false;
      }
      
      return true;
    });
  });
  
  if (possibleWords.length > 0) {
    // Sscoring with heuristics
    const scoredWords = possibleWords.map(word => {
      const upperWord = word.toUpperCase();
      const letters = upperWord.split('');
      const uniqueLetters = [...new Set(letters)];
      
      // Base score from letter frequency
      const frequencyScore = uniqueLetters.reduce((sum, letter) => 
        sum + LETTER_FREQUENCY[letter], 0);
      
      // Positional frequency score
      const positionScore = letters.reduce((sum, letter, index) => {
        const posFreq = POSITIONAL_FREQUENCY[index][letter] || 0.001;
        return sum + posFreq;
      }, 0);
      

      const commonalityScore = WORDS.includes(word.toLowerCase()) ? 0.5 : 0;
      
      const repetitionPenalty = letters.length - uniqueLetters.length;
      
      const gameStage = aiGuesses.length;
      let stageMultiplier = 1;
      
      if (gameStage <= 2) {
        stageMultiplier = 1.5; 
      } 
      else if (gameStage <= 4) {
        stageMultiplier = 1.0; 
      } 
      else {
        stageMultiplier = 0.5; 
      }
      
      const totalScore = 
        (frequencyScore * 2 * stageMultiplier) + 
        (positionScore * 3) + 
        (commonalityScore * gameStage) - 
        (repetitionPenalty * (0.2 - gameStage * 0.03)); 
      
      return { word, score: totalScore };
    });
    
    scoredWords.sort((a, b) => b.score - a.score);
    
    return scoredWords[0].word.toUpperCase();
  }
  
  const remainingWords = ALL_WORDS.filter(word => 
    !allGuessesUpperCase.includes(word.toUpperCase())
  );
  
  if (remainingWords.length > 0) {
    return remainingWords[Math.floor(Math.random() * remainingWords.length)].toUpperCase();
  }
  
  return ALL_WORDS[Math.floor(Math.random() * ALL_WORDS.length)].toUpperCase();
};

const findSmartFirstGuess = (correctLetters, presentLetters) => {
  let candidates = ALL_WORDS.filter(word => {
    const upperWord = word.toUpperCase();
    
    for (const {letter, index} of correctLetters) {
      if (upperWord[index] !== letter) return false;
    }
    
    for (const letter of presentLetters) {
      if (!upperWord.includes(letter)) return false;
    }
    
    return true;
  });
  
  if (candidates.length > 0) {
    const scoredCandidates = candidates.map(word => {
      const upperWord = word.toUpperCase();
      const letters = upperWord.split('');
      const uniqueLetters = [...new Set(letters)];
      
      const frequencyScore = uniqueLetters.reduce((sum, letter) => 
        sum + LETTER_FREQUENCY[letter], 0);
      
      const positionScore = letters.reduce((sum, letter, index) => {
        const posFreq = POSITIONAL_FREQUENCY[index][letter] || 0.001;
        return sum + posFreq;
      }, 0);
      
      return { 
        word, 
        score: (frequencyScore * 2) + (positionScore * 3)
      };
    });
    
    scoredCandidates.sort((a, b) => b.score - a.score);
    return scoredCandidates[0].word;
  }
  
  return null;
};
