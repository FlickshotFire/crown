import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { TROOPS, TOOLS } from '../constants';

const AssignableSelector = ({ onSelectAssignable, selectedAssignable }) => {
    const { getAvailableTroopsForAttack, getAvailableToolsForAttack } = useGame();
    const [activeTab, setActiveTab] = useState('troops');

    const availableTroops = getAvailableTroopsForAttack();
    const availableTools = getAvailableToolsForAttack();

    const TabButton = ({ tab, children }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1 text-sm rounded-t-md font-bold transition-colors ${
                activeTab === tab 
                ? 'bg-stone-700/80 text-amber-300' 
                : 'bg-stone-900/60 text-gray-400 hover:bg-stone-800/60'
            }`}
        >
            {children}
        </button>
    );

    const handleSelect = (assignable) => {
        if (selectedAssignable?.type === assignable.type && selectedAssignable?.id === assignable.id) {
            onSelectAssignable(null);
        } else {
            onSelectAssignable(assignable);
        }
    }

    return (
        <div className="flex flex-col">
            <div className="flex items-center gap-1">
                <TabButton tab="troops">Troops</TabButton>
                <TabButton tab="tools">Tools</TabButton>
            </div>
            <div className="flex items-center gap-2 p-2 bg-stone-700/80 rounded-b-md rounded-tr-md">
                {activeTab === 'troops' && TROOPS.map(troop => {
                    const count = availableTroops[troop.id] || 0;
                    if (count === 0) return null;
                    const isSelected = selectedAssignable?.type === 'troop' && selectedAssignable.id === troop.id;
                    return (
                        <div 
                            key={troop.id}
                            onClick={() => handleSelect({ type: 'troop', id: troop.id })}
                            className={`w-24 h-24 p-1 rounded-md flex flex-col items-center justify-center transition-all cursor-pointer relative ${isSelected ? 'bg-amber-500/30 scale-105' : 'bg-black/20 hover:bg-black/30'}`}
                        >
                            <div className="w-16 h-16 text-5xl text-gray-200 flex items-center justify-center p-1">{troop.icon}</div>
                            <p className="font-bold text-lg text-white text-shadow-sm">{count.toLocaleString()}</p>
                             {isSelected && <div className="absolute -bottom-2 w-4 h-4 bg-amber-400 border-2 border-stone-800 transform rotate-45"></div>}
                        </div>
                    );
                })}
                 {activeTab === 'tools' && TOOLS.map(tool => {
                    const count = availableTools[tool.id] || 0;
                    if (count === 0) return null;
                    const isSelected = selectedAssignable?.type === 'tool' && selectedAssignable.id === tool.id;
                    return (
                        <div 
                            key={tool.id}
                            onClick={() => handleSelect({ type: 'tool', id: tool.id })}
                            className={`w-24 h-24 p-1 rounded-md flex flex-col items-center justify-center transition-all cursor-pointer relative ${isSelected ? 'bg-amber-500/30 scale-105' : 'bg-black/20 hover:bg-black/30'}`}
                        >
                            <div className="w-16 h-16 text-5xl text-gray-200 flex items-center justify-center p-2">{tool.icon}</div>
                            <p className="font-bold text-lg text-white text-shadow-sm">{count.toLocaleString()}</p>
                             {isSelected && <div className="absolute -bottom-2 w-4 h-4 bg-amber-400 border-2 border-stone-800 transform rotate-45"></div>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AssignableSelector;