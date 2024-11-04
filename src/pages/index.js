import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderOpen, FileText, Download, Search, Grid, List, ChevronRight, ArrowLeft } from 'lucide-react';

export default function Home() {
  const [files, setFiles] = useState(null);
  const [currentPath, setCurrentPath] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [filteredContent, setFilteredContent] = useState({});

  useEffect(() => {
    // Simulating dynamic data fetching
    const fetchFiles = async () => {
      try {
        const res = await fetch('/data/files.json');
        const data = await res.json();
        setFiles(data);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFiles();
  }, []);

  useEffect(() => {
    if (!files) return;
    
    const searchFiles = (obj, query) => {
      const results = {};
      Object.entries(obj).forEach(([key, value]) => {
        if (key.toLowerCase().includes(query.toLowerCase())) {
          results[key] = value;
        }
        if (value.type === 'folder' && value.content) {
          const childResults = searchFiles(value.content, query);
          if (Object.keys(childResults).length > 0) {
            results[key] = { ...value, content: childResults };
          }
        }
      });
      return results;
    };

    const current = getCurrentContent();
    setFilteredContent(
      searchQuery ? searchFiles(current, searchQuery) : current
    );
  }, [searchQuery, currentPath, files]);

  const getCurrentContent = () => {
    if (!files) return {};
    let current = files;
    for (const folder of currentPath) {
      current = current[folder]?.content;
    }
    return current || {};
  };

  const handleBack = () => {
    setCurrentPath(prev => prev.slice(0, -1));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-10 bg-black/30 backdrop-blur-xl border-b border-white/10"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <motion.h1 
              className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-pink-400 to-orange-400"
              whileHover={{ scale: 1.02 }}
            >
              Cloud Drive
            </motion.h1>
            
            {/* Search Bar */}
            <div className="relative flex-1 max-w-2xl">
              <motion.div 
                className={`absolute inset-0 bg-white/5 rounded-xl transition-all duration-300 ${
                  isSearchFocused ? 'ring-2 ring-violet-500' : ''
                }`}
                layoutId="searchBackground"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search files and folders..."
                className="w-full pl-10 pr-4 py-2.5 bg-transparent rounded-xl text-white placeholder-gray-400 relative z-10 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
            </div>

            {/* View Toggle */}
            <div className="flex bg-white/5 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-violet-500 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'list' 
                    ? 'bg-violet-500 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-gray-400 mb-8">
          {currentPath.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBack}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
          )}
          <button
            onClick={() => setCurrentPath([])}
            className="flex items-center space-x-1 hover:text-white transition-colors"
          >
            <FolderOpen className="w-5 h-5 text-violet-400" />
            <span>Home</span>
          </button>
          {currentPath.map((folder, index) => (
            <div key={index} className="flex items-center space-x-2">
              <ChevronRight className="w-4 h-4" />
              <button
                onClick={() => setCurrentPath(currentPath.slice(0, index + 1))}
                className="hover:text-white transition-colors"
              >
                {folder}
              </button>
            </div>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {files ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={viewMode === 'grid' ? 
                "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" :
                "space-y-4"
              }
            >
              {Object.entries(filteredContent).map(([name, data]) => (
                <motion.div
                  key={name}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`group cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-white/5 hover:bg-white/10 rounded-xl p-6 backdrop-blur-lg border border-white/10 transition-all duration-300'
                      : 'bg-white/5 hover:bg-white/10 rounded-lg p-4 backdrop-blur-lg border border-white/10 transition-all duration-300'
                  }`}
                  onClick={() => data.type === 'folder' ? setCurrentPath([...currentPath, name]) : window.open(data.url, '_blank')}
                >
                  <div className={viewMode === 'grid' ? 'space-y-4' : 'flex items-center justify-between'}>
                    <div className={viewMode === 'grid' ? 'text-center' : 'flex items-center flex-1'}>
                      {data.type === 'folder' ? (
                        <motion.div
                          whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          <FolderOpen className="w-16 h-16 text-violet-400 group-hover:text-violet-300 transition-colors" />
                        </motion.div>
                      ) : (
                        <FileText className="w-16 h-16 text-pink-400 group-hover:text-pink-300 transition-colors" />
                      )}
                      
                      <div className={`${viewMode === 'grid' ? 'mt-4' : 'ml-4'}`}>
                        <h3 className="text-lg font-semibold text-white group-hover:text-violet-400 transition-colors">
                          {name}
                        </h3>
                        {data.type !== 'folder' && (
                          <p className="text-sm text-gray-400">
                            {data.size} • {data.uploadDate}
                          </p>
                        )}
                      </div>
                    </div>

                    {data.type !== 'folder' && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`${
                          viewMode === 'grid' 
                            ? 'mt-4 w-full' 
                            : 'ml-4'
                        } py-2 px-4 rounded-lg bg-violet-500 hover:bg-violet-600 transition-colors flex items-center justify-center space-x-2 text-white`}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle download
                        }}
                      >
                        <Download className="w-5 h-5" />
                        {viewMode === 'grid' && <span>Download</span>}
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center h-64"
            >
              <div className="relative w-20 h-20">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-violet-500 rounded-full animate-spin border-t-transparent"></div>
                <div className="absolute top-2 left-2 w-16 h-16 border-4 border-pink-500 rounded-full animate-spin border-t-transparent animation-delay-150"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {files && Object.keys(filteredContent).length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-64 text-gray-400"
          >
            <Search className="w-16 h-16 mb-4" />
            <p className="text-lg">No files or folders found</p>
            <p className="text-sm">Try adjusting your search</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
