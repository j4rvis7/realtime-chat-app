import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'md', text = '' }) => {
  return (
    <div className="loading-overlay">
      <div className={`spinner spinner-${size}`} role="status" aria-label="Loading" />
      {text && <p className="text-muted text-sm">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
