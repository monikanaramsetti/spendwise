import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const BackButton = ({ className = '' }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className={`flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-4 ${className}`}
      aria-label="Go back"
    >
      <FaArrowLeft />
      <span className="font-medium">Back</span>
    </button>
  );
};

export default BackButton;
