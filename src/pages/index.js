import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FolderOpen, FileText, Download, Search } from 'lucide-react';

export default function Home() {
  const [files, setFiles] = useState(null);
  const [currentPath, setCurrentPath] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
            >
              File Drive
            </motion.h1>
            
            {/* Search Bar */}
            <div className="relative max-w-xl w-full mx-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search files..."
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* View Toggle */}
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:bg-white/10'}`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:bg-white/10'}`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 text-gray-400 mb-8"
        >
          <button
            onClick={() => setCurrentPath([])}
            className="flex items-center space-x-1 hover:text-white transition-colors"
          >
            <FolderOpen className="w-5 h-5" />
            <span>Home</span>
          </button>
          {currentPath.map((folder, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span>/</span>
              <button
                onClick={() => setCurrentPath(currentPath.slice(0, index + 1))}
                className="hover:text-white transition-colors"
              >
                {folder}
              </button>
            </div>
          ))}
        </motion.div>

        {/* Content */}
        {files ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={viewMode === 'grid' ? 
              "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" :
              "space-y-4"
            }
          >
            {Object.entries(getCurrentContent()).map(([name, data]) => (
              <motion.div
                key={name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`group cursor-pointer ${
                  viewMode === 'grid' ?
                  'bg-white/5 hover:bg-white/10 rounded-xl p-6 backdrop-blur-lg border border-white/10 transition-all duration-300' :
                  'bg-white/5 hover:bg-white/10 rounded-lg p-4 backdrop-blur-lg border border-white/10 transition-all duration-300'
                }`}
                onClick={() => data.type === 'folder' ? setCurrentPath([...currentPath, name]) : window.open(data.url, '_blank')}
              >
                <div className={viewMode === 'grid' ? 'space-y-4' : 'flex items-center justify-between'}>
                  {/* Icon */}
                  <div className={`${viewMode === 'grid' ? 'text-center' : ''}`}>
                    {data.type === 'folder' ? (
                      <FolderOpen className="w-16 h-16 mx-auto text-yellow-400 group-hover:text-yellow-300 transition-colors" />
                    ) : (
                      <FileText className="w-16 h-16 mx-auto text-blue-400 group-hover:text-blue-300 transition-colors" />
                    )}
                  </div>

                  {/* Info */}
                  <div className={`${viewMode === 'grid' ? 'text-center' : 'flex-1 ml-4'}`}>
                    <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {name}
                    </h3>
                    {data.type !== 'folder' && (
                      <p className="text-sm text-gray-400">
                        {data.size} • {data.uploadDate}
                      </p>
                    )}
                  </div>

                  {/* Download Button (for files) */}
                  {data.type !== 'folder' && viewMode === 'list' && (
                    <button className="ml-4 p-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors">
                      <Download className="w-5 h-5 text-white" />
                    </button>
                  )}
                </div>

                {/* Download Button (for grid view) */}
                {data.type !== 'folder' && viewMode === 'grid' && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 w-full py-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2 text-white"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download</span>
                  </motion.button>
                )}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="flex justify-center items-center h-64">
            <div className="relative w-20 h-20">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
              <div className="absolute top-2 left-2 w-16 h-16 border-4 border-purple-500 rounded-full animate-spin border-t-transparent"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
