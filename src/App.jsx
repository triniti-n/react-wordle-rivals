import React, { useEffect, useState } from 'react';
import './App.css';
import Header from './components/Header/Header';
import InfoModal from './components/InfoModal/InfoModal';
//import Row from './components/Row/Row'

function App() {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  
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
      <InfoModal 
      isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} 
      //onClose={() => setIsSettingsModalOpen(false)}
      />
    </div>
  );
}

export default App;
