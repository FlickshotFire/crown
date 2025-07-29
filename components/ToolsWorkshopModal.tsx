

import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { TOOLS } from '../constants';
import { ResourceType, ToolType } from '../types';
import { ICONS } from '../assets';

const ResourceIcon = ({type}) => {
    const iconClassName = "w-4 h-4 flex-shrink-0";
    switch(type) {
        case ResourceType.Wood: return ICONS.Wood({className: iconClassName});
        case ResourceType.Stone: return ICONS.Stone({className: iconClassName});
        case ResourceType.Coins: return ICONS.Coins({className: iconClassName});
        case ResourceType.Food: return ICONS.Food({className: iconClassName});
        default: return null;
    }
}

const ToolsWorkshopModal = ({ buildingId }) => {
    const { gameState, canAfford, constructTools } = useGame();
    const [selections, setSelections] = useState({});

    const handleQuantityChange = (toolId, value) => {
        const quantity = parseInt(value, 10);
        setSelections(prev => ({
            ...prev,
            [toolId]: isNaN(quantity) || quantity < 0 ? 0 : quantity
        }));
    };

    const handleConstructClick = (toolId) => {
        const quantity = selections[toolId] || 0;
        if (quantity > 0) {
            constructTools(toolId, quantity);
            setSelections(prev => ({ ...prev, [toolId]: 0 }));
        }
    }

    const totalCost = (toolId) => {
        const quantity = selections[toolId] || 0;
        const toolInfo = TOOLS.find(t => t.id === toolId);
        const cost = {};
        for (const key in toolInfo.cost) {
            cost[key] = (toolInfo.cost[key] || 0) * quantity;
        }
        return cost;
    };

    const totalTime = (toolId) => {
        const quantity = selections[toolId] || 0;
        const toolInfo = TOOLS.find(t => t.id === toolId);
        return toolInfo.constructionTime * quantity;
    }

    const formatTime = (seconds) => {
        if (seconds < 60) return `${Math.ceil(seconds)}s`;
        const minutes = Math.floor(seconds / 60);
        const secs = Math.ceil(seconds % 60);
        return `${minutes}m ${secs}s`;
    }

    return (
        <div className="space-y-4">
            {TOOLS.map(tool => {
                const currentCost = totalCost(tool.id);
                const hasSufficientResources = canAfford(currentCost);
                const currentConstructionTime = totalTime(tool.id);

                return (
                    <div key={tool.id} className="bg-stone-900/50 p-4 rounded-lg border border-white/10 flex flex-col gap-4">
                        {/* Tool Info */}
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 text-4xl text-gray-300 flex-shrink-0 bg-black/20 rounded-md flex items-center justify-center p-2">{tool.icon}</div>
                            <div className="flex-grow">
                                <h3 className="text-xl text-amber-400">{tool.name}</h3>
                                <p className="text-sm text-gray-300 italic">{tool.description}</p>
                            </div>
                        </div>

                        {/* Construction Controls */}
                        <div className="bg-black/20 p-3 rounded-md flex items-center justify-between gap-4">
                            <div className="flex-grow">
                                <div className="flex items-center gap-4">
                                     {Object.entries(tool.cost).map(([type, value]) => (
                                        <div key={type} className="flex items-center gap-1.5 text-sm">
                                            <ResourceIcon type={type as ResourceType} />
                                            <span>{value}</span>
                                        </div>
                                    ))}
                                </div>
                                <input
                                    type="number"
                                    min="0"
                                    value={selections[tool.id] || ''}
                                    onChange={(e) => handleQuantityChange(tool.id, e.target.value)}
                                    className="mt-2 w-full bg-stone-800 border border-stone-600 rounded-md p-2 text-white text-lg"
                                    placeholder="Enter quantity..."
                                />
                                <div className="flex justify-between items-center mt-2 text-xs text-gray-400 px-1">
                                    <div className="flex gap-4">
                                        {Object.entries(currentCost).map(([type, value]) => (
                                            <span key={type} className={(gameState.resources[type as ResourceType] ?? 0) < (value as number) ? 'text-red-500' : ''}>{value as number}</span>
                                        ))}
                                    </div>
                                    <span>Time: {formatTime(currentConstructionTime)}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => handleConstructClick(tool.id)}
                                disabled={!hasSufficientResources || (selections[tool.id] || 0) <= 0}
                                className="bg-blue-700 h-full hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-md"
                            >
                                Construct
                            </button>
                        </div>
                    </div>
                );
            })}
             <div className="text-center mt-4">
                <h4 className="text-lg text-amber-300">Workshop Queue</h4>
                {gameState.workshopQueue.length > 0 ? (
                     <ul className="bg-black/20 p-2 rounded-md mt-2 text-left">
                        {gameState.workshopQueue.map((item, index) => (
                            <li key={index} className="text-gray-300 text-sm p-1">
                                {item.quantity} x {TOOLS.find(t=>t.id === item.toolId)?.name} - completes in {formatTime(Math.ceil((item.completesAt - Date.now())/1000))}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 italic mt-2">No tools in production.</p>
                )}
            </div>
        </div>
    );
};

export default ToolsWorkshopModal;
