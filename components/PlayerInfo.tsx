
import React from 'react';
import ProgressBar from './ProgressBar';
import { ICONS } from '../assets';
import { useGame } from '../context/GameContext';
import { ResourceType } from '../types';

const PlayerInfo = ({ onSpecialOfferClick }) => {
    const { gameState } = useGame();
    const { level, xp, resources, xpForNextLevel, honor, honorMax, playerName, allianceName, currentView } = gameState;

    const formatNumber = (num) => {
        if (num >= 1e15) return `${(num / 1e15).toFixed(2)}Q`;
        if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
        if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
        if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    const formatXp = (num) => {
        return num.toLocaleString();
    };
    
    const CastleViewInfo = () => (
         <div className="absolute top-2 left-2 w-72 space-y-1 text-white text-shadow-sm pointer-events-auto">
            {/* Main Player Info */}
            <div className="bg-gradient-to-b from-stone-800/80 to-stone-900/80 border-2 border-stone-600 rounded-md p-1 flex items-center space-x-2">
                <div className="relative flex-shrink-0 w-16 h-16">
                     <div className="absolute inset-0 bg-gradient-to-b from-red-600 to-yellow-500 rounded-full border-2 border-yellow-300"></div>
                     <div className="absolute inset-0 flex items-center justify-center">
                        <i className="fas fa-dragon text-4xl text-black/50"></i>
                     </div>
                    <div className="absolute inset-0 flex items-center justify-center text-3xl font-black text-white text-shadow-md">{level}</div>
                </div>
                <div className="flex-grow space-y-1">
                    <span className="font-bold text-lg text-amber-300">{playerName}</span>
                    <ProgressBar 
                        value={xp} 
                        max={xpForNextLevel}
                        height="h-3.5"
                        barClassName="bg-gradient-to-b from-green-400 to-green-600"
                        bgClassName="bg-green-900/70"
                    >
                         <span className="text-xs font-bold text-white text-shadow-sm">{formatXp(xp)} / {formatXp(xpForNextLevel)}</span>
                    </ProgressBar>
                </div>
            </div>

            {/* Honor Bar */}
             <div className="bg-stone-800/80 border border-stone-600 rounded-sm p-0.5">
                <ProgressBar
                    value={honor}
                    max={honorMax}
                    height="h-5"
                    barClassName="bg-gradient-to-b from-purple-500 to-purple-700"
                    bgClassName="bg-purple-900/70"
                >
                    <div className="absolute inset-0 flex items-center justify-between px-2 text-xs font-bold text-white text-shadow-sm">
                        <span>{allianceName}</span>
                        <span>{formatNumber(honor)} / {formatNumber(honorMax)}</span>
                    </div>
                </ProgressBar>
             </div>
             
             <div className="flex items-center space-x-2">
                {/* Castle view resources */}
                <div className="grid grid-cols-2 gap-1 flex-grow">
                    <div className="bg-stone-800/80 border border-stone-600 rounded-sm p-1 flex items-center space-x-2 text-sm">
                        <div className="w-5 h-5">{ICONS.Meat({})}</div>
                        <span className="font-bold">{resources.Meat?.toLocaleString()}</span>
                    </div>
                    <div className="bg-stone-800/80 border border-stone-600 rounded-sm p-1 flex items-center space-x-2 text-sm">
                        <div className="w-5 h-5">{ICONS.Coins({})}</div>
                        <span className="font-bold">{formatNumber(resources.Coins)}</span>
                    </div>
                </div>
                {/* Hex Timer */}
                 <div className="bg-stone-800/80 border border-stone-600 rounded-sm p-1 flex items-center space-x-2 text-sm">
                    <i className="fas fa-hourglass-half text-amber-400"></i>
                    <span className="font-bold text-amber-300">33:48:36</span>
                 </div>
             </div>


            {/* Sale Banner */}
            <button onClick={onSpecialOfferClick} className="relative h-12 mt-1 flex items-center group w-full text-left">
                <div className="absolute -left-1 top-2 w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white text-lg font-bold border-2 border-white z-10">
                    38
                </div>
                <div className="relative bg-red-600 text-white font-bold text-lg py-1 pl-12 pr-4 rounded-r-full shadow-lg transform -skew-x-12">
                    Sale!
                </div>
                <div className="absolute left-24 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-red-700 border-2 border-white">
                    <i className="fas fa-crown"></i>
                </div>
                <div className="absolute left-32 top-1 text-red-700 group-hover:animate-ping">
                    <i className="fas fa-arrow-right text-2xl"></i>
                </div>
            </button>
        </div>
    );
    
    // WorldViewInfo can be styled similarly if needed, for now focusing on the castle view from screenshot
    const WorldViewInfo = () => (
         <div className="absolute top-2 left-2 w-72 space-y-1 text-white text-shadow-sm pointer-events-auto">
            {/* (Same as CastleViewInfo for consistency) */}
            <CastleViewInfo />
         </div>
    );

    return <CastleViewInfo />;
};

export default PlayerInfo;
