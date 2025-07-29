

import React from 'react';
import { ICONS } from '../assets';
import { useGame } from '../context/GameContext';

const IconButton = ({ icon, notification, hasExclamation, onClick }: { icon: React.ReactNode, notification?: number | string, hasExclamation?: boolean, onClick: () => void }) => (
    <button className="relative w-14 h-14" onClick={onClick}>
        <div className="w-full h-full bg-gradient-to-b from-stone-600 to-stone-800 rounded-lg border-2 border-stone-500 shadow-lg flex items-center justify-center text-amber-200 hover:from-stone-500 hover:text-white transition-all">
            <div className="w-10 h-10">{icon}</div>
        </div>
        {notification && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                {notification}
            </div>
        )}
        {hasExclamation && (
             <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-red-600 text-xl font-black border-2 border-white">
                !
            </div>
        )}
    </button>
);

const BottomRightUI = ({ onMailClick, onSpecialOfferClick, onEventsClick, onChatClick, onZeroButtonClick, onDailyRewardClick }) => {
    const { gameState } = useGame();
    const { currentView, mail, hasClaimedToday } = gameState;
    const unreadMailCount = mail.filter(m => !m.isRead).length;

    const CastleViewUI = () => (
         <div className="flex flex-col items-end space-y-2">
            <button className="relative w-16 h-16" onClick={onDailyRewardClick} title="Daily Reward">
                <div className="w-full h-full text-amber-300 text-5xl flex items-center justify-center">
                    <i className="fas fa-calendar-check"></i>
                </div>
                 {!hasClaimedToday && (
                    <div className="absolute top-0 right-0 w-7 h-7 bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold border-2 border-white animate-pulse">
                        !
                    </div>
                 )}
            </button>
            <div className="flex items-center space-x-2 p-1 px-3 bg-stone-900/50 rounded-full">
                <div className="bg-gradient-to-b from-[#e4d3b6] to-[#c1b29a] rounded-full p-1 px-4 text-sm text-[#4a2c0c] font-bold shadow-md">
                    Zero
                </div>
                <div className="text-sm text-white/80">09:00</div>
            </div>
        </div>
    );

    const WorldMapUI = () => (
        <>
            <div className="flex items-center space-x-2">
                <IconButton icon={<i className="fas fa-comments text-3xl"></i>} onClick={onChatClick} />
                <IconButton icon={ICONS.Mail()} notification={unreadMailCount > 0 ? unreadMailCount : undefined} onClick={onMailClick} />
                <IconButton icon={<i className="fas fa-gift text-3xl"></i>} hasExclamation onClick={onSpecialOfferClick} />
                <IconButton icon={<i className="fas fa-trophy text-3xl"></i>} onClick={onEventsClick} />
            </div>

            <div className="flex items-center space-x-2 p-1 bg-stone-900/50 rounded-full">
                <button
                    onClick={onZeroButtonClick}
                    title="Go to your castle" 
                    className="bg-gradient-to-b from-[#e4d3b6] to-[#c1b29a] rounded-full p-1 px-4 text-sm text-[#4a2c0c] font-bold shadow-md hover:brightness-110 transition-all"
                >
                    Zero
                </button>
                <div className="text-sm text-white/80">17:27</div>
                <button className="relative w-12 h-12" onClick={onSpecialOfferClick}>
                    <img src="https://empires.goodgamestudios.com/wp-content/uploads/2018_SpecialOffer_Icon.png" alt="Special Offer" className="w-full h-full object-contain" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold border-2 border-white">
                        20
                    </div>
                </button>
            </div>
        </>
    );


    return (
        <div className="absolute bottom-4 right-4 flex flex-col items-end space-y-2 pointer-events-auto">
             {currentView === 'castle' ? <CastleViewUI /> : <WorldMapUI />}
        </div>
    );
};

export default BottomRightUI;