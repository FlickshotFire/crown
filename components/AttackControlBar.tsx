import React from 'react';
import { useGame } from '../context/GameContext';
import WaveNavigator from './WaveNavigator';
import PresetSelector from './PresetSelector';
import AssignableSelector from './AssignableSelector';

const AttackControlBar = ({ selectedAssignable, onSelectAssignable }) => {
    const { autofillAttack, launchAttack, cancelAttack } = useGame();
    
    const handleLaunchAttack = () => {
        launchAttack();
    };

    return (
        <div className="h-40 w-full bg-stone-800/70 border-t-2 border-amber-900/50 p-2 flex items-center justify-between shadow-inner">
            <div className="flex items-end gap-2 p-2 bg-stone-900/40 rounded-lg border border-black/20 self-stretch">
                <div className="flex flex-col justify-between h-full">
                    <PresetSelector />
                    <button onClick={cancelAttack} className="text-sm text-gray-400 hover:text-white hover:bg-red-800/50 rounded p-1 transition-colors">Back to Map</button>
                </div>
                <div className="self-center">
                    <WaveNavigator />
                </div>
            </div>

            <AssignableSelector onSelectAssignable={onSelectAssignable} selectedAssignable={selectedAssignable} />

            <div className="flex items-center gap-2">
                <button
                    onClick={autofillAttack}
                    className="px-6 py-2 bg-gradient-to-b from-blue-600 to-blue-800 border-2 border-blue-400 rounded-md text-lg font-bold text-white hover:from-blue-500 transition-colors shadow-lg"
                >
                    Autofill
                </button>
                <button 
                    onClick={handleLaunchAttack}
                    className="px-10 py-3 bg-gradient-to-b from-green-600 to-green-800 border-2 border-green-400 rounded-md text-2xl font-bold text-white hover:from-green-500 transition-colors shadow-lg"
                >
                    Attack
                </button>
            </div>
        </div>
    );
};

export default AttackControlBar;