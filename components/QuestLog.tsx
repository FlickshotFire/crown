import React from 'react';
import { useGame } from '../context/GameContext';

const QuestLog: React.FC = () => {
    const { gameState, claimQuestReward, assignNewQuest } = useGame();
    const { currentQuest } = gameState;

    return (
        <div className="text-center p-4 bg-stone-900/50 rounded-lg">
            <h3 className="text-xl mb-4 text-amber-400">Current Objective</h3>
            <div className="min-h-[6rem] flex items-center justify-center p-4 bg-black/30 rounded-md mb-6">
                {currentQuest ? (
                    <div>
                        <h4 className="text-lg text-amber-200 font-bold">{currentQuest.title}</h4>
                        <p className="text-gray-300 italic mt-1">{currentQuest.description}</p>
                    </div>
                ) : (
                    <p className="text-lg text-gray-400 italic">
                       You have no active quests. Seek a new one!
                    </p>
                )}
            </div>
            {!currentQuest && (
                 <button
                    onClick={assignNewQuest}
                    className="bg-amber-700 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg transform hover:scale-105"
                >
                    Get New Quest
                </button>
            )}
            {currentQuest && (
                 <button
                    onClick={claimQuestReward}
                    disabled={!currentQuest.isCompleted}
                    className="bg-green-700 hover:bg-green-600 disabled:bg-gray-500 disabled:text-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg transform hover:scale-105 disabled:transform-none"
                >
                    {currentQuest.isCompleted ? 'Claim Reward' : 'In Progress'}
                </button>
            )}
        </div>
    );
};

export default QuestLog;