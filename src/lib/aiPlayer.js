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

// Positional letter frequency (based on analysis of 5-letter English words)
// Position is 0-indexed (0-4 for a 5-letter word)
const POSITIONAL_FREQUENCY = {
  0: { // First position (index 0)
    'A': 0.060, 'B': 0.076, 'C': 0.078, 'D': 0.056, 'E': 0.037, 
    'F': 0.042, 'G': 0.045, 'H': 0.035, 'I': 0.018, 'J': 0.010, 
    'K': 0.015, 'L': 0.045, 'M': 0.051, 'N': 0.022, 'O': 0.020, 
    'P': 0.073, 'Q': 0.005, 'R': 0.060, 'S': 0.120, 'T': 0.070, 
    'U': 0.010, 'V': 0.015, 'W': 0.035, 'X': 0.001, 'Y': 0.010, 'Z': 0.003
  },
  1: { // Second position (index 1)
    'A': 0.120, 'B': 0.005, 'C': 0.010, 'D': 0.005, 'E': 0.100, 
    'F': 0.005, 'G': 0.005, 'H': 0.030, 'I': 0.090, 'J': 0.001, 
    'K': 0.005, 'L': 0.040, 'M': 0.010, 'N': 0.020, 'O': 0.110, 
    'P': 0.015, 'Q': 0.001, 'R': 0.080, 'S': 0.005, 'T': 0.020, 
    'U': 0.050, 'V': 0.001, 'W': 0.010, 'X': 0.001, 'Y': 0.005, 'Z': 0.001
  },
  2: { // Third position (index 2)
    'A': 0.100, 'B': 0.020, 'C': 0.025, 'D': 0.030, 'E': 0.070, 
    'F': 0.015, 'G': 0.020, 'H': 0.010, 'I': 0.090, 'J': 0.001, 
    'K': 0.010, 'L': 0.040, 'M': 0.025, 'N': 0.060, 'O': 0.080, 
    'P': 0.020, 'Q': 0.001, 'R': 0.060, 'S': 0.040, 'T': 0.040, 
    'U': 0.040, 'V': 0.020, 'W': 0.010, 'X': 0.005, 'Y': 0.010, 'Z': 0.005
  },
  3: { // Fourth position (index 3)
    'A': 0.060, 'B': 0.010, 'C': 0.030, 'D': 0.020, 'E': 0.110, 
    'F': 0.010, 'G': 0.020, 'H': 0.010, 'I': 0.060, 'J': 0.001, 
    'K': 0.020, 'L': 0.060, 'M': 0.020, 'N': 0.080, 'O': 0.040, 
    'P': 0.020, 'Q': 0.001, 'R': 0.050, 'S': 0.070, 'T': 0.050, 
    'U': 0.030, 'V': 0.010, 'W': 0.010, 'X': 0.001, 'Y': 0.010, 'Z': 0.005
  },
  4: { // Fifth position (index 4)
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
    // For first guess, check if player has already guessed
    if (playerGuesses.length > 0) {
      // Learn from player's first guess
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
      
      // If player found some correct positions, use that information
      if (correctLetters.length > 0 || presentLetters.length > 0) {
        // Find a word that uses this information
        const smartGuess = findSmartFirstGuess(correctLetters, presentLetters);
        if (smartGuess) return smartGuess.toUpperCase();
      }
    }
    
    // Default to optimal starting words if no player guess or couldn't find smart guess
    return INITIAL_GUESSES[Math.floor(Math.random() * INITIAL_GUESSES.length)];
  }

  // Combine AI and player guesses for filtering
  const allGuesses = [...aiGuesses, ...playerGuesses];
  let possibleWords = [...ALL_WORDS];
  
  // Filter out words that have already been guessed by either player
  const allGuessesUpperCase = allGuesses.map(guess => guess.toUpperCase());
  possibleWords = possibleWords.filter(word => 
    !allGuessesUpperCase.includes(word.toUpperCase())
  );
  
  // Rule-based filtering based on all previous guesses
  allGuesses.forEach(guess => {
    const statuses = getGuessStatuses(guess, solution);
    const correctPositions = {};
    const presentLetters = new Set();
    const absentLetters = new Set();
    
    // First pass: identify correct, present, and absent letters
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
    // Enhanced scoring with multiple heuristics
    const scoredWords = possibleWords.map(word => {
      const upperWord = word.toUpperCase();
      const letters = upperWord.split('');
      const uniqueLetters = [...new Set(letters)];
      
      // 1. Base score from letter frequency
      const frequencyScore = uniqueLetters.reduce((sum, letter) => 
        sum + LETTER_FREQUENCY[letter], 0);
      
      // 2. Positional frequency score
      const positionScore = letters.reduce((sum, letter, index) => {
        // Get the frequency for this letter at this position, default to 0.001 if not found
        const posFreq = POSITIONAL_FREQUENCY[index][letter] || 0.001;
        return sum + posFreq;
      }, 0);
      
      // 3. Word commonality score (prefer common words in later guesses)
      // Words in the solution list get a bonus
      const commonalityScore = WORDS.includes(word.toLowerCase()) ? 0.5 : 0;
      
      // 4. Penalize repeated letters
      const repetitionPenalty = letters.length - uniqueLetters.length;
      
      // 5. Adjust strategy based on game stage
      const gameStage = aiGuesses.length;
      let stageMultiplier = 1;
      
      // Early game: prioritize information gathering
      if (gameStage <= 2) {
        stageMultiplier = 1.5; // Boost unique letter score
      } 
      // Mid game: balance information and solution finding
      else if (gameStage <= 4) {
        stageMultiplier = 1.0; // Neutral
      } 
      // Late game: focus on finding the solution
      else {
        stageMultiplier = 0.5; // Reduce unique letter importance
      }
      
      // Combined score with weights
      const totalScore = 
        (frequencyScore * 2 * stageMultiplier) + 
        (positionScore * 3) + 
        (commonalityScore * gameStage) - 
        (repetitionPenalty * (0.2 - gameStage * 0.03)); // Repetition matters less in later stages
      
      return { word, score: totalScore };
    });
    
    // Sort by score (highest first)
    scoredWords.sort((a, b) => b.score - a.score);
    
    // Return the highest scoring word
    return scoredWords[0].word.toUpperCase();
  }
  
  // If no words match the criteria, find a random word that hasn't been guessed
  const remainingWords = ALL_WORDS.filter(word => 
    !allGuessesUpperCase.includes(word.toUpperCase())
  );
  
  if (remainingWords.length > 0) {
    return remainingWords[Math.floor(Math.random() * remainingWords.length)].toUpperCase();
  }
  
  // Extreme fallback (should never happen in a normal game)
  return ALL_WORDS[Math.floor(Math.random() * ALL_WORDS.length)].toUpperCase();
};

// Helper function to find a smart first guess based on player's guess
const findSmartFirstGuess = (correctLetters, presentLetters) => {
  // Filter words that use the correct letters in the right positions
  // and include the present letters
  let candidates = ALL_WORDS.filter(word => {
    const upperWord = word.toUpperCase();
    
    // Check correct positions
    for (const {letter, index} of correctLetters) {
      if (upperWord[index] !== letter) return false;
    }
    
    // Check present letters
    for (const letter of presentLetters) {
      if (!upperWord.includes(letter)) return false;
    }
    
    return true;
  });
  
  // If we have candidates, score them and return the best one
  if (candidates.length > 0) {
    const scoredCandidates = candidates.map(word => {
      const upperWord = word.toUpperCase();
      const letters = upperWord.split('');
      const uniqueLetters = [...new Set(letters)];
      
      // Score based on letter frequency and unique letters
      const frequencyScore = uniqueLetters.reduce((sum, letter) => 
        sum + LETTER_FREQUENCY[letter], 0);
      
      // Positional score
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
