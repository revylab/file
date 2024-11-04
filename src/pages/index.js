import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import FolderView from '../components/FolderView';
import Breadcrumb from '../components/Breadcrumb';

export default function Home() {
  const [files, setFiles] = useState(null);
  const [currentPath, setCurrentPath] = useState([]);

  useEffect(() => {
    fetch('/data/files.json')
      .then(res => res.json())
      .then(data => setFiles(data));
  }, []);

  const getCurrentContent = () => {
    let current = files;
    for (const folder of currentPath) {
      current = current[folder]?.content;
    }
    return current || {};
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-8"
      >
        <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          File Drive
        </h1>
        
        <Breadcrumb path={currentPath} onNavigate={setCurrentPath} />
        
        {files ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
          >
            <FolderView 
              content={getCurrentContent()} 
              currentPath={currentPath}
              onNavigate={setCurrentPath}
            />
          </motion.div>
        ) : (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
      </motion.div>
    </div>
  );
          }
