
import React, { useState, useEffect } from 'react';
import MainBrowserView from './components/MainBrowserView';
import SidebarUI from './components/SidebarUI';
import { SidebarIcon } from './components/Icons';

const App: React.FC = () => {
  const [sidebarWidth, setSidebarWidth] = useState(400);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [pageContext, setPageContext] = useState('');

  // Simulate "Context Scraper" on mount and when content changes
  useEffect(() => {
    const extractContext = () => {
      const coreElement = document.getElementById('semantic-core');
      if (coreElement) {
        setPageContext(coreElement.innerText);
      }
    };
    
    // Tiny delay to ensure DOM is ready
    const timer = setTimeout(extractContext, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      {/* Main Browser Area */}
      <div className="flex-1 relative flex flex-col h-full min-w-0">
        <MainBrowserView />
        
        {/* Float toggle if sidebar is closed */}
        {!isSidebarOpen && (
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="absolute right-6 bottom-6 w-14 h-14 bg-indigo-600 text-white rounded-2xl shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 border-4 border-white"
          >
            <SidebarIcon className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Sidebar Area */}
      {isSidebarOpen && (
        <div 
          style={{ width: `${sidebarWidth}px` }}
          className="relative h-full flex-shrink-0"
        >
          {/* Resize Handle (Simplified) */}
          <div 
            className="absolute left-0 top-0 w-1 h-full cursor-col-resize hover:bg-indigo-400 transition-colors z-20"
            title="Resize Sidebar"
          ></div>
          
          {/* Close button inside sidebar */}
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="absolute -left-10 top-1/2 -translate-y-1/2 w-8 h-20 bg-white border border-gray-200 rounded-l-xl flex items-center justify-center text-gray-400 hover:text-indigo-600 shadow-sm z-30"
          >
            <span className="transform rotate-90 font-bold text-[10px] tracking-widest uppercase">CLOSE</span>
          </button>

          <SidebarUI pageContext={pageContext} />
        </div>
      )}
    </div>
  );
};

export default App;
