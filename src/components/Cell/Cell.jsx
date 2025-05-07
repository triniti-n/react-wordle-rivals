import './Cell.css';

const Cell = ({ value, status, position, isCompleted }) => {
  let cellClass = "cell";
  
  if (status === 'absent') cellClass += " absent";
  if (status === 'present') cellClass += " present";
  if (status === 'correct') cellClass += " correct";
  if (value) cellClass += " filled";
  if (isCompleted) cellClass += " reveal";

  const animationDelay = position ? `${position * 0.35}s` : '0s';

  return (
    <div className={cellClass} style={{ animationDelay }}>
      <span className="letter" style={{ animationDelay }}>
        {value}
      </span>
    </div>
  );
};

export default Cell;
