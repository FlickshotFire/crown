import React from 'react';
import { ICONS } from '../assets';
import { useGame } from '../context/GameContext';

const QuestGiver: React.FC = () => {
    const { gameState } = useGame();
    const { currentQuest } = gameState;

    if (currentQuest) {
         return (
            <div className="absolute top-1/4 right-5 flex items-start space-x-2">
                <div 
                    className="bg-[#e4d3b6] border-2 border-[#a68a64] rounded-lg p-4 shadow-lg"
                    style={{
                        clipPath: 'polygon(0% 0%, 100% 0%, 100% 75%, 80% 75%, 80% 100%, 70% 75%, 0% 75%)'
                    }}
                >
                    <p className="text-gray-800 font-bold text-md">A quest is in progress!</p>
                </div>
                <div className="w-24 h-24 bg-gradient-to-b from-orange-300 to-yellow-500 rounded-full border-4 border-white/50 shadow-2xl flex items-center justify-center overflow-hidden">
                    <div className="w-20 h-20">
                    {ICONS.QuestGiver()}
                    </div>
                </div>
            </div>
        );
    }
    
    // Return null or a different state if no quest is active, or if all quests are done
    return null;
};

export default QuestGiver;