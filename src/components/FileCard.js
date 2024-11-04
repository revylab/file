import { motion } from 'framer-motion';

export default function FileCard({ file }) {
  const handleDownload = () => {
    window.open(file.url, '_blank');
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-gray-800 rounded-lg p-6 cursor-pointer hover:bg-gray-700 transition-colors duration-200"
      onClick={handleDownload}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <svg 
            className="w-8 h-8 text-blue-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" 
            />
          </svg>
          <div>
            <h3 className="text-lg font-medium">{file.filename}</h3>
            <p className="text-sm text-gray-400">{file.size}</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          Download
        </motion.button>
      </div>
      <div className="mt-4 text-sm text-gray-400">
        Upload Date: {file.uploadDate}
      </div>
    </motion.div>
  );
}
