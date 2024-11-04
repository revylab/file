import { motion } from 'framer-motion';

export default function Breadcrumb({ path, onNavigate }) {
  const handleClick = (index) => {
    onNavigate(path.slice(0, index + 1));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center space-x-2 text-gray-400"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="hover:text-white transition-colors duration-200"
        onClick={() => onNavigate([])}
      >
        Home
      </motion.button>
      {path.map((folder, index) => (
        <div key={index} className="flex items-center space-x-2">
          <span>/</span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hover:text-white transition-colors duration-200"
            onClick={() => handleClick(index)}
          >
            {folder}
          </motion.button>
        </div>
      ))}
    </motion.div>
  );
}
