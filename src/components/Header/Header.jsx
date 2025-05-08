import { BsGear, BsInfoCircle } from 'react-icons/bs';
import './Header.css';

const Header = ({
  setIsInfoModalOpen,
  setIsStatsModalOpen,
  setIsSettingsModalOpen,
  setGameOverModalOpen,
}) => {
  return (
    <header>
      <div>
        <button onClick={() => setIsInfoModalOpen(true)}>
          <BsInfoCircle size="1.6rem" color="var(--color-icon)" />
        </button>
      </div>
      <h1>Wordle Rivals</h1>
      <div>
        <button onClick={() => setGameOverModalOpen(true)}>
          <BsGear size="1.6rem" color="var(--color-icon)" />
        </button>
      </div>
    </header>
  );
};

export default Header;