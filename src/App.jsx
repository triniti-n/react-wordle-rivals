import React, { useEffect, useState } from 'react';
import Header from './components/Header/Header';
import InfoModal from './components/InfoModal/InfoModal';
import Keyboard from './components/Keyboard/Keyboard';
import Grid from './components/Grid/Grid';
import useLocalStorage from './hooks/useLocalStorage';
import './App.css';

function App() {
  const [boardState, setBoardState] = useLocalStorage('boardState', {
    guesses: [],
    solutionIndex: '',
  });

  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isJiggling, setIsJiggling] = useState(false);

  
  useEffect(() => {
    // Show info modal after 1 second when app loads
    setTimeout(() => setIsInfoModalOpen(true), 1000);
    // eslint-disable-next-line
  }, []);

  return (
    <div className="App">
      <Header
        setIsInfoModalOpen={setIsInfoModalOpen}
      />

      <Grid 
        guesses={[]}
        currentGuess={[]}
        isJiggling={false}
        setIsJiggling={setIsJiggling}
      />

      <InfoModal 
        isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} 
        //onClose={() => setIsSettingsModalOpen(false)}
      />
     
      <Keyboard 
        onEnter={() => console.log('enter')}
        onDelete={() => console.log('delete')}
        onKeyDown={key => console.log(key)}
        guesses={[]}
      />

    </div>
  );
}

export default App;
