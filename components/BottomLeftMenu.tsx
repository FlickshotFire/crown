import React from 'react';
import { useGame } from '../context/GameContext';

const MenuButton: React.FC<{ title: string; children: React.ReactNode; badge?: string | number; onClick?: () => void; }> = ({ title, children, badge, onClick }) => {
    return (
        <button
            title={title}
            onClick={onClick}
            className="relative w-14 h-14 bg-gradient-to-b from-stone-600 to-stone-800 rounded-lg border-2 border-stone-500 shadow-lg flex items-center justify-center text-amber-200 hover:from-stone-500 hover:text-white transition-all group"
        >
            <div className="text-3xl transition-transform group-hover:scale-110">
                {children}
            </div>
            {badge && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                    {badge}
                </div>
            )}
        </button>
    );
};

interface BottomLeftMenuProps {
    onChatClick: () => void;
    onPlayerProfileClick: () => void;
    onAllianceClick: () => void;
    onInventoryClick: () => void;
    onLeaderboardClick: () => void;
}

const BottomLeftMenu: React.FC<BottomLeftMenuProps> = ({ onChatClick, onPlayerProfileClick, onAllianceClick, onInventoryClick, onLeaderboardClick }) => {
    const { gameState } = useGame();
    const unreadMessages = 1; // Example value

    return (
        <div className="absolute bottom-4 left-4 flex flex-col space-y-2 pointer-events-auto">
            <MenuButton title="Rankings" onClick={onLeaderboardClick}>
                <i className="fas fa-trophy"></i>
            </MenuButton>
            <MenuButton title="Player Profile" onClick={onPlayerProfileClick}>
                <i className="fas fa-user-circle"></i>
            </MenuButton>
            <MenuButton title="Chat" onClick={onChatClick} badge={unreadMessages}>
                <i className="fas fa-comments"></i>
            </MenuButton>
            <MenuButton title="Alliance" onClick={onAllianceClick}>
                <i className="fas fa-flag"></i>
            </MenuButton>
            <MenuButton title="Inventory" onClick={onInventoryClick} badge="1">
                <i className="fas fa-briefcase"></i>
            </MenuButton>
        </div>
    );
};

export default BottomLeftMenu;