
import React, { ReactNode } from 'react';
import { ICONS } from '../assets';
import { useGame } from '../context/GameContext';

const ActionButton = ({ icon, title, onClick, isVisible = true, badge, iconClass = 'text-3xl' }: { icon: React.ReactNode, title: string, onClick: () => void, isVisible?: boolean, badge?: number | string, iconClass?: string }) => {
    if (!isVisible) return <div className="w-16 h-16 flex-shrink-0" />; // Placeholder to keep spacing
    return (
        <button 
            onClick={onClick} 
            title={title} 
            className="relative w-16 h-16 flex items-center justify-center text-amber-200/80 hover:text-white transition-all transform hover:-translate-y-1 group"
        >
            <div className={`transition-colors duration-200 group-hover:text-amber-300 ${iconClass}`}>{icon}</div>
            {badge && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-stone-800 shadow-md">
                    {badge}
                </div>
            )}
        </button>
    );
}

const ActionBar = ({ onBuildClick, onQuestBookClick, onMailClick, onAllianceClick, onMilitaryClick, onMarketplaceClick, onInventoryClick }) => {
    const { gameState, openWorldMap, openCastleView } = useGame();
    const { currentView, mail } = gameState;
    const unreadMailCount = mail.filter(m => !m.isRead).length;
    
    const CastleBar = () => (
        <>
            <ActionButton title="Build" onClick={onBuildClick} isVisible={currentView === 'castle'} icon={<i className="fas fa-hammer"></i>} badge={undefined} />
            <ActionButton title="World Map" onClick={openWorldMap} icon={<i className="fas fa-globe-americas"></i>} badge={undefined} />
            <ActionButton title="Alliance" onClick={onAllianceClick} icon={<i className="fas fa-users"></i>} badge={undefined} />
            <div className="w-px h-12 bg-black/30 mx-2"></div>
            <ActionButton title="Military" onClick={onMilitaryClick} badge={3} icon={<i className="fas fa-shield-alt"></i>} />
            <ActionButton title="Marketplace" onClick={onMarketplaceClick} icon={<i className="fas fa-store"></i>} badge={undefined} />
            <ActionButton title="Storage" onClick={onInventoryClick} isVisible={currentView === 'castle'} icon={<i className="fas fa-box"></i>} badge={undefined} />
            <div className="w-px h-12 bg-black/30 mx-2"></div>
            <ActionButton title="Quests" badge={8} onClick={onQuestBookClick} icon={<i className="fas fa-book-open"></i>}/>
            <ActionButton title="Mail" badge={unreadMailCount > 0 ? unreadMailCount : undefined} onClick={onMailClick} icon={<i className="fas fa-envelope"></i>} />
            <ActionButton title="Special Bag" onClick={onInventoryClick} icon={<i className="fas fa-shopping-bag"></i>} badge={undefined} />
        </>
    );

    const WorldBar = () => (
         <>
            <ActionButton title="Build" onClick={onBuildClick} isVisible={false} icon={<i className="fas fa-hammer"></i>} badge={undefined} />
            <ActionButton title="Castle View" onClick={openCastleView} icon={<i className="fas fa-fort-awesome"></i>} badge={undefined} />
            <ActionButton title="Alliance" onClick={onAllianceClick} icon={<i className="fas fa-users"></i>} badge={undefined} />
            <div className="w-px h-12 bg-black/30 mx-2"></div>
            <ActionButton title="Military" onClick={onMilitaryClick} badge={11} icon={<i className="fas fa-shield-alt"></i>} />
            <ActionButton title="Marketplace" onClick={onMarketplaceClick} icon={<i className="fas fa-store"></i>} badge={undefined} />
            <ActionButton title="Storage" isVisible={false} icon={<i className="fas fa-box"></i>} onClick={() => {}} badge={undefined} />
            <div className="w-px h-12 bg-black/30 mx-2"></div>
            <ActionButton title="Quests" badge={10} onClick={onQuestBookClick} icon={<i className="fas fa-book-open"></i>}/>
            <ActionButton title="Mail" badge={unreadMailCount > 0 ? unreadMailCount : undefined} onClick={onMailClick} icon={<i className="fas fa-envelope"></i>} />
            <ActionButton title="Special Bag" onClick={onInventoryClick} icon={<i className="fas fa-shopping-bag"></i>} badge={undefined} />
         </>
    );

    return (
        <div 
            className="absolute left-1/2 -translate-x-1/2 w-auto h-20 bg-stone-900/70 pointer-events-auto border-t-2 border-stone-600/50 shadow-2xl flex items-center justify-center px-4"
            style={{
                bottom: 0,
                backdropFilter: 'blur(5px)',
                clipPath: 'polygon(0 15%, 5% 0, 95% 0, 100% 15%, 100% 100%, 0% 100%)',
            }}
        >
            <div className="flex items-center">
                {currentView === 'castle' ? <CastleBar /> : <WorldBar />}
            </div>
        </div>
    );
};

export default ActionBar;
