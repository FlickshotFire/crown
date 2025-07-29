
import React, { useState, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { TROOPS } from '../constants';
import { ResourceType, TroopType } from '../types';
import { ICONS } from '../assets';

const ResourceIcon = ({type}: {type: ResourceType}) => {
    const iconClassName = "w-4 h-4 flex-shrink-0";
    switch(type) {
        case ResourceType.Wood: return ICONS.Wood({className: iconClassName});
        case ResourceType.Stone: return ICONS.Stone({className: iconClassName});
        case ResourceType.Coins: return ICONS.Coins({className: iconClassName});
        case ResourceType.Food: return ICONS.Food({className: iconClassName});
        default: return null;
    }
}

const BarracksModal = ({ buildingId }) => {
    const { gameState, canAfford, trainTroops, closeBarracksModal } = useGame();
    const [selections, setSelections] = useState({});

    const handleQuantityChange = (troopId, value) => {
        const quantity = parseInt(value, 10);
        setSelections(prev => ({
            ...prev,
            [troopId]: isNaN(quantity) || quantity < 0 ? 0 : quantity
        }));
    };
    
    const handleTrainClick = (troopId) => {
        const quantity = selections[troopId] || 0;
        if (quantity > 0) {
            trainTroops(troopId, quantity);
            setSelections(prev => ({ ...prev, [troopId]: 0 }));
        }
    }

    const totalCost = (troopId) => {
        const quantity = selections[troopId] || 0;
        const troopInfo = TROOPS.find(t => t.id === troopId);
        const cost = {};
        for (const key in troopInfo.cost) {
            cost[key] = (troopInfo.cost[key] || 0) * quantity;
        }
        return cost;
    };
    
    const totalTime = (troopId) => {
        const quantity = selections[troopId] || 0;
        const troopInfo = TROOPS.find(t => t.id === troopId);
        return troopInfo.trainingTime * quantity;
    }
    
    const formatTime = (seconds) => {
        if (seconds < 60) return `${seconds}s`;
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}m ${secs}s`;
    }

    return (
        <div className="space-y-4">
            {TROOPS.map(troop => {
                const currentCost = totalCost(troop.id);
                const hasSufficientResources = canAfford(currentCost);
                const currentTrainingTime = totalTime(troop.id);

                return (
                    <div key={troop.id} className="bg-stone-900/50 p-4 rounded-lg border border-white/10 flex flex-col gap-4">
                        {/* Troop Info */}
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 text-4xl text-gray-300 flex-shrink-0 bg-black/20 rounded-md flex items-center justify-center p-2">{troop.icon}</div>
                            <div className="flex-grow">
                                <h3 className="text-xl text-amber-400">{troop.name}</h3>
                                <p className="text-sm text-gray-300 italic">{troop.description}</p>
                                <div className="flex items-center gap-6 mt-2 text-xs">
                                    <div className="flex items-center gap-1" title="Attack">⚔️ <span className="text-red-400">{troop.stats.attack}</span></div>
                                    <div className="flex items-center gap-1" title="Defense">🛡️ <span className="text-blue-400">{troop.stats.defense}</span></div>
                                    <div className="flex items-center gap-1" title="Food Upkeep">🌾 <span className="text-yellow-400">{troop.foodUpkeep}/s</span></div>
                                </div>
                            </div>
                        </div>

                        {/* Training Controls */}
                        <div className="bg-black/20 p-3 rounded-md flex items-center justify-between gap-4">
                            <div className="flex-grow">
                                <div className="flex items-center gap-4">
                                     {Object.entries(troop.cost).map(([type, value]) => (
                                        <div key={type} className="flex items-center gap-1.5 text-sm">
                                            <ResourceIcon type={type as ResourceType} />
                                            <span>{value}</span>
                                        </div>
                                    ))}
                                </div>
                                <input
                                    type="number"
                                    min="0"
                                    value={selections[troop.id] || ''}
                                    onChange={(e) => handleQuantityChange(troop.id, e.target.value)}
                                    className="mt-2 w-full bg-stone-800 border border-stone-600 rounded-md p-2 text-white text-lg"
                                    placeholder="Enter quantity..."
                                />
                                <div className="flex justify-between items-center mt-2 text-xs text-gray-400 px-1">
                                    <div className="flex gap-4">
                                        {Object.entries(currentCost).map(([type, value]) => (
                                            <span key={type} className={(gameState.resources[type as ResourceType] ?? 0) < (value as number) ? 'text-red-500' : ''}>{value as number}</span>
                                        ))}
                                    </div>
                                    <span>Time: {formatTime(currentTrainingTime)}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => handleTrainClick(troop.id)}
                                disabled={!hasSufficientResources || (selections[troop.id] || 0) <= 0}
                                className="bg-green-700 h-full hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-md"
                            >
                                Train
                            </button>
                        </div>
                    </div>
                );
            })}
             <div className="text-center mt-4">
                <h4 className="text-lg text-amber-300">Training Queue</h4>
                {gameState.trainingQueue.length > 0 ? (
                     <ul className="bg-black/20 p-2 rounded-md mt-2 text-left">
                        {gameState.trainingQueue.map((item: any, index: number) => (
                            <li key={index} className="text-gray-300 text-sm p-1">
                                {item.quantity} x {TROOPS.find(t=>t.id === item.troopId)?.name} - completes in {formatTime(Math.ceil((item.completesAt - Date.now())/1000))}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 italic mt-2">No troops in training.</p>
                )}
            </div>
        </div>
    );
};

export default BarracksModal;
