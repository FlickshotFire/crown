import React from 'react';
import { useGame } from '../context/GameContext';
import { ICONS } from '../assets';

const AttackHeader = () => {
    const { gameState } = useGame();
    const { attackTarget } = gameState;

    if (!attackTarget) return null;

    return (
        <header className="w-full h-24 bg-stone-900/70 p-2 flex items-center justify-between shadow-lg border-b-2 border-amber-900/50">
            {/* Attacker Info */}
            <div className="flex items-center gap-4">
                <div className="relative w-20 h-20">
                    {ICONS.AttackerBanner({className: "w-full h-full"})}
                    <div className="absolute inset-0 flex items-center justify-center">
                        {ICONS.PlayerCrest({className: "w-12 h-12"})}
                    </div>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-amber-300">Your Forces</h2>
                    <p className="text-sm text-gray-300">Preparing to assault {attackTarget.ownerName}</p>
                </div>
            </div>

            <div className="text-4xl font-black text-red-500 animate-pulse">
                VS
            </div>

            {/* Defender Info */}
            <div className="flex items-center gap-4">
                 <div>
                    <h2 className="text-xl font-bold text-amber-300 text-right">{attackTarget.ownerName}</h2>
                    <p className="text-sm text-gray-300 text-right">Level {attackTarget.level} {attackTarget.type.replace(/_/g, ' ')}</p>
                </div>
                <div className="relative w-20 h-20">
                    {ICONS.DefenderBanner({className: "w-full h-full"})}
                    <div className="absolute inset-0 flex items-center justify-center">
                         <div className="w-12 h-12 p-1">{attackTarget.icon}</div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AttackHeader;