import { VALID_GUESSES } from '../constants/validGuesses';
import { WORDS } from '../constants/wordList';
import { getGuessStatuses } from './words';

// Combine valid guesses and solution words for the AI to choose from
const ALL_WORDS = [...new Set([...VALID_GUESSES, ...WORDS])];

// Letter frequency in English 5-letter words (approximate)
const LETTER_FREQUENCY = {
  'A': 0.084, 'B': 0.021, 'C': 0.045, 'D': 0.034, 'E': 0.111, 
  'F': 0.018, 'G': 0.024, 'H': 0.030, 'I': 0.075, 'J': 0.002, 
  'K': 0.011, 'L': 0.056, 'M': 0.030, 'N': 0.066, 'O': 0.071, 
  'P': 0.031, 'Q': 0.002, 'R': 0.075, 'S': 0.057, 'T': 0.069, 
  'U': 0.036, 'V': 0.010, 'W': 0.015, 'X': 0.003, 'Y': 0.020, 'Z': 0.002
};

// Initial guess options (common words with high-frequency letters)
const INITIAL_GUESSES = ['STARE', 'ARISE', 'RAISE', 'TEARS', 'RATES'];

export const getAIGuess = (previousGuesses, solution) => {
  // If this is the first guess, choose from initial guesses
  if (previousGuesses.length === 0) {
    return INITIAL_GUESSES[Math.floor(Math.random() * INITIAL_GUESSES.length)];
  }

  // Filter words based on previous guesses and their feedback
  let possibleWords = [...ALL_WORDS];
  
  // Apply rule-based filtering based on previous guesses
  previousGuesses.forEach(guess => {
    const statuses = getGuessStatuses(guess, solution);
    
    // Create a map of letter positions that are correct
    const correctPositions = {};
    // Track letters that must be present somewhere
    const presentLetters = new Set();
    // Track letters that are absent
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
        // Only add to absent if not already marked as present
        if (!presentLetters.has(letter)) {
          absentLetters.add(letter);
        }
      }
    });
    
    // Filter words based on the rules
    possibleWords = possibleWords.filter(word => {
      const upperWord = word.toUpperCase();
      
      // Check correct positions
      for (const [index, letter] of Object.entries(correctPositions)) {
        if (upperWord[index] !== letter) return false;
      }
      
      // Check present letters
      for (const letter of presentLetters) {
        if (!upperWord.includes(letter)) return false;
        
        // For present letters, also check they're not in wrong positions
        guess.toUpperCase().split('').forEach((guessLetter, index) => {
          if (guessLetter === letter && statuses[index] === 'present' && upperWord[index] === letter) {
            return false;
          }
        });
      }
      
      // Check absent letters
      for (const letter of absentLetters) {
        if (upperWord.includes(letter)) return false;
      }
      
      return true;
    });
  });
  
  // If we have possible words, rank them by letter frequency
  if (possibleWords.length > 0) {
    const scoredWords = possibleWords.map(word => {
      // Calculate word score based on unique letters and their frequencies
      const uniqueLetters = [...new Set(word.toUpperCase().split(''))];
      const score = uniqueLetters.reduce((sum, letter) => sum + LETTER_FREQUENCY[letter], 0);
      return { word, score };
    });
    
    // Sort by score (highest first)
    scoredWords.sort((a, b) => b.score - a.score);
    
    // Return the highest scoring word
    return scoredWords[0].word.toUpperCase();
  }
  
  // Fallback: if no words match our criteria, choose a random word
  return ALL_WORDS[Math.floor(Math.random() * ALL_WORDS.length)].toUpperCase();
};