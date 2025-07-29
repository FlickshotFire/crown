import React from 'react';
import { useGame } from '../context/GameContext';

const IconButton = ({ children, title, isRound = true, iconClass = 'text-xl', onClick }) => (
  <button title={title} onClick={onClick} className={`w-10 h-10 ${isRound ? 'rounded-full' : 'rounded-md'} bg-gradient-to-b from-stone-700 to-stone-800 hover:from-stone-600 border-2 border-stone-500 flex items-center justify-center text-white/80 hover:text-white shadow-md transition-all`}>
    <div className={`w-6 h-6 flex items-center justify-center ${iconClass}`}>
        {children}
    </div>
  </button>
);

const TopRightMenu = ({ onBookmarksClick, onHelpClick }) => {
  const { setZoom, deselectAll, logout } = useGame();

  const handleZoomIn = () => setZoom(prev => prev + 0.1);
  const handleZoomOut = () => setZoom(prev => prev - 0.1);
  const handleOpenDiscord = () => window.open('https://discord.com', '_blank');


  return (
    <div className="absolute top-3 right-4 flex items-center space-x-2 pointer-events-auto p-1 bg-black/20 rounded-full">
        <IconButton title="Zoom In" onClick={handleZoomIn}><i className="fas fa-search-plus"></i></IconButton>
        <IconButton title="Zoom Out" onClick={handleZoomOut}><i className="fas fa-search-minus"></i></IconButton>
        <IconButton title="Bookmarks" onClick={onBookmarksClick}><i className="fas fa-bookmark"></i></IconButton>
        <IconButton title="Discord" onClick={handleOpenDiscord}><i className="fab fa-discord"></i></IconButton>
        <IconButton title="Help" onClick={onHelpClick}><i className="fas fa-question-circle"></i></IconButton>
        <IconButton title="Logout" onClick={logout}><i className="fas fa-sign-out-alt"></i></IconButton>
        <IconButton title="Close" onClick={deselectAll}><i className="fas fa-times"></i></IconButton>
    </div>
  );
};

export default TopRightMenu;
