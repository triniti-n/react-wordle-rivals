import { useEffect } from 'react';
import classNames from 'classnames';
import Cell from '../Cell/Cell';
import { getGuessStatuses } from '../../lib/words';
import { MAX_CHALLENGES, MAX_WORD_LENGTH } from '../../constants/settings';
import './Grid.css';

const Grid = ({ currentGuess, guesses, isJiggling, setIsJiggling, solution }) => {
  console.log('Grid rendering:', { guesses, currentGuess, solution });
  
  const empties =
    MAX_CHALLENGES > guesses.length
      ? Array(MAX_CHALLENGES - guesses.length - 1).fill()
      : [];

  useEffect(() => {
    if (isJiggling) {
      const timer = setTimeout(() => {
        setIsJiggling(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isJiggling, setIsJiggling]);

  return (
    <div className="grid">
      {guesses.map((guess, i) => (
        <CompletedRow key={i} guess={guess} solution={solution} />
      ))}
      {guesses.length < MAX_CHALLENGES && (
        <CurrentRow guess={currentGuess} isJiggling={isJiggling} />
      )}
      {empties.map((_, i) => (
        <EmptyRow key={i} />
      ))}
    </div>
  );
};

const CurrentRow = ({ guess, isJiggling }) => {
  const emptyCells = Array(MAX_WORD_LENGTH - guess.length).fill('');
  const cells = [...guess, ...emptyCells];

  const classes = classNames({
    row: true,
    jiggle: isJiggling,
  });

  return (
    <div className={classes}>
      {cells.map((letter, index) => (
        <Cell key={index} value={letter} />
      ))}
    </div>
  );
};

const CompletedRow = ({ guess, solution }) => {
  const cells = guess.split('');
  const statuses = getGuessStatuses(guess, solution);

  return (
    <div className="row">
      {cells.map((letter, index) => (
        <Cell
          key={index}
          position={index}
          value={letter}
          isCompleted
          status={statuses[index]}
        />
      ))}
    </div>
  );
};

const EmptyRow = () => {
  const cells = Array(MAX_WORD_LENGTH).fill();

  return (
    <div className="row">
      {cells.map((_, index) => (
        <Cell key={index} />
      ))}
    </div>
  );
};

export default Grid;
