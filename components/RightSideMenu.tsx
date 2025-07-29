import React from 'react';

const IconButton: React.FC<{ children: React.ReactNode; title: string, badge?: number, onClick?: () => void }> = ({ children, title, badge, onClick }) => (
    <button title={title} onClick={onClick} className="relative w-12 h-12 bg-gradient-to-b from-stone-700/80 to-stone-800/80 hover:from-stone-600/80 border-2 border-stone-500/80 flex items-center justify-center text-white/80 hover:text-white shadow-md transition-all rounded-md group">
        <div className="text-2xl transition-transform group-hover:scale-110">
            {children}
        </div>
        {badge && (
            <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                {badge}
            </div>
        )}
    </button>
);

interface RightSideMenuProps {
    onSearchClick: () => void;
    onDefensePresetsClick: () => void;
    onAttackPresetsClick: () => void;
    onEventsClick: () => void;
    onBoostersClick: () => void;
}


const RightSideMenu: React.FC<RightSideMenuProps> = ({ onDefensePresetsClick, onAttackPresetsClick, onEventsClick, onBoostersClick }) => {
    return (
        <div className="absolute top-1/2 -translate-y-1/2 right-4 flex flex-col space-y-2 pointer-events-auto bg-black/20 p-2 rounded-lg border border-white/10">
            <IconButton title="Search"><i className="fas fa-search"></i></IconButton>
            <IconButton title="Defense Presets" onClick={onDefensePresetsClick}><i className="fas fa-shield-alt"></i></IconButton>
            <IconButton title="Attack Presets" onClick={onAttackPresetsClick}><i className="fas fa-users"></i></IconButton>
            <IconButton title="Events" badge={7} onClick={onEventsClick}><i className="fas fa-calendar-alt"></i></IconButton>
            <IconButton title="Boosters" onClick={onBoostersClick}><i className="fas fa-stopwatch"></i></IconButton>
        </div>
    );
};

export default RightSideMenu;