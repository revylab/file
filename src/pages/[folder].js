import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import FolderView from '../components/FolderView';
import Breadcrumb from '../components/Breadcrumb';

export default function FolderPage() {
  const router = useRouter();
  const { folder } = router.query;
  const [files, setFiles] = useState(null);
  const [currentContent, setCurrentContent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/data/files.json')
      .then(res => res.json())
      .then(data => {
        setFiles(data);
        if (folder) {
          const folderPath = folder.split('/');
          let content = data;
          for (const f of folderPath) {
            if (content[f] && content[f].content) {
              content = content[f].content;
            } else {
              throw new Error('Folder not found');
            }
          }
          setCurrentContent(content);
        }
      })
      .catch(err => setError(err.message));
  }, [folder]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold mb-4">Folder Not Found</h1>
          <p className="text-gray-400 mb-8">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg transition-colors duration-200"
          >
            Return Home
          </button>
        </motion.div>
      </div>
    );
  }

  const currentPath = folder ? folder.split('/') : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-8"
      >
        <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          File Drive
        </h1>

        <Breadcrumb path={currentPath} onNavigate={(path) => {
          if (path.length === 0) {
            router.push('/');
          } else {
            router.push(`/${path.join('/')}`);
          }
        }} />

        {currentContent ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
          >
            <FolderView
              content={currentContent}
              currentPath={currentPath}
              onNavigate={(path) => {
                if (path.length === 0) {
                  router.push('/');
                } else {
                  router.push(`/${path.join('/')}`);
                }
              }}
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
