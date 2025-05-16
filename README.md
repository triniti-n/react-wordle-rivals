# Wordle Rivals

## Project Description
Wordle Rivals is a two-player word guessing game where you race against the AI to guess the secret word. Both you and the AI have six tries to guess a five-letter word. The first to guess the word correctly wins. If neither guesses correctly in six tries, it's a draw.

## Installation
```bash
# Install dependencies
npm install

# Run project
npm start
```

## Layout of the Code

### Project Structure
- `/src`: Contains all source code for the application
  - `/components`: React components that make up the UI
  - `/constants`: Configuration values and word lists
  - `/hooks`: Custom React hooks
  - `/lib`: Utility functions and game logic
- `/public`: Static assets and HTML template

#### Components (`/src/components`)
- `Cell`: Individual letter cells that make up the game grid
- `Grid`: Displays the game board with guessed words
- `Header`: Top navigation bar with game title and buttons
- `Keyboard`: Virtual keyboard for input on desktop and mobile
- `InfoModal`: Instructions modal explaining game rules
- `GameOverModal`: Displays game results and restart option
- `Modal`: Reusable modal component used by other modals
- `PausedModal`: Shown when game is paused

#### Game Logic (`/src/lib`)
- `words.js`: Core word-related functions (validation, status checking)
- `aiPlayer.js`: AI opponent logic for making intelligent guesses

#### Configuration (`/src/constants`)
- `settings.js`: Game settings like word length and max attempts
- `validGuesses.js`: List of valid words that can be guessed
- `wordList.js`: List of potential solution words

#### App Core (`/src`)
- `App.jsx`: Main application component with game state and logic
- `index.js`: Entry point that renders the React app
- `App.css`: Main application styles
- `index.css`: Global styles

#### Custom Hooks (`/src/hooks`)
- `useLocalStorage.js`: Persists game state in browser storage
- `useOnClickOutside.js`: Detects clicks outside components (for modals)
