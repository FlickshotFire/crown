import React from 'react';
import { useGame } from '../context/GameContext';

const WaveNavigator = () => {
    const { gameState, setCurrentAttackWave } = useGame();
    const { currentAttackWaveIndex } = gameState;

    const handleWaveChange = (direction) => {
        const newIndex = direction === 'prev' ? currentAttackWaveIndex - 1 : currentAttackWaveIndex + 1;
        setCurrentAttackWave(newIndex);
    };

    return (
        <div className="flex items-center bg-stone-800/80 border border-stone-600 rounded-md shadow-inner">
            <button 
                onClick={() => handleWaveChange('prev')} 
                disabled={currentAttackWaveIndex === 0}
                className="px-3 py-1 text-lg text-amber-300 disabled:text-gray-600 hover:bg-stone-700/50 rounded-l-md transition-colors"
            >
                &lt;
            </button>
            <div className="font-bold text-md px-4 py-1 text-amber-300 border-x border-stone-600">
                <span>{currentAttackWaveIndex + 1} / 4</span>
            </div>
            <button 
                onClick={() => handleWaveChange('next')} 
                disabled={currentAttackWaveIndex === 3}
                className="px-3 py-1 text-lg text-amber-300 disabled:text-gray-600 hover:bg-stone-700/50 rounded-r-md transition-colors"
            >
                &gt;
            </button>
        </div>
    );
};

export default WaveNavigator;