import { motion } from 'framer-motion';
import FileCard from './FileCard';

export default function FolderView({ content, currentPath, onNavigate }) {
  const handleFolderClick = (folderName) => {
    onNavigate([...currentPath, folderName]);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (Array.isArray(content)) {
    return (
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 w-full"
      >
        {content.map((file, index) => (
          <FileCard key={index} file={file} />
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-6 w-full"
    >
      {Object.entries(content).map(([name, data]) => (
        <motion.div
          key={name}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gray-800 rounded-lg p-6 cursor-pointer hover:bg-gray-700 transition-colors duration-200"
          onClick={() => handleFolderClick(name)}
        >
          <div className="flex items-center space-x-4">
            <svg 
              className="w-8 h-8 text-yellow-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" 
              />
            </svg>
            <span className="text-lg font-medium">{name}</span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
