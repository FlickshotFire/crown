


import React from 'react';
import { useGame } from '../context/GameContext';
import { BUILDINGS } from '../constants';
import { ResourceType } from '../types';
import { ICONS } from '../assets';

const ResourceIcon = ({type}: {type: ResourceType}) => {
    const iconStyle = {width: '18px', height: '18px'};
    switch(type) {
        case ResourceType.Wood: return ICONS.Wood({className: "w-full h-full"});
        case ResourceType.Stone: return ICONS.Stone({className: "w-full h-full"});
        case ResourceType.Coins: return ICONS.Coins({className: "w-full h-full"});
        default: return null;
    }
}

const StatDisplay = ({ label, value, change }: { label: string; value: string; change?: string }) => (
    <div className="flex justify-between items-baseline text-lg">
        <span className="text-gray-300">{label}:</span>
        <div className="flex items-baseline">
            <span className="font-bold text-white">{value}</span>
            {change && <span className="ml-2 text-green-400 font-semibold">{change}</span>}
        </div>
    </div>
);

export const UpgradeModal = ({ buildingInstanceId, onClose }: { buildingInstanceId: string, onClose: () => void }) => {
    const { gameState, canAfford, upgradeBuilding } = useGame();
    
    const building = gameState.buildings.find((b: any) => b.instanceId === buildingInstanceId);
    const buildingInfo = BUILDINGS.find(b => b.id === building?.type);

    if (!building || !buildingInfo) {
        return null;
    }

    const currentLevel = building.level;
    const currentLevelData = buildingInfo.levels[currentLevel - 1];
    const nextLevelData = buildingInfo.levels[currentLevel];
    const isMaxLevel = !nextLevelData;

    const handleUpgrade = () => {
        upgradeBuilding(buildingInstanceId);
        onClose();
    };
    
    const renderProduction = (levelData: any) => {
        if (!levelData?.production) return "N/A";
        const resType = Object.keys(levelData.production)[0];
        const amount = Object.values(levelData.production)[0] as number;
        return `${amount} / ${levelData.productionInterval}s`;
    }
    
    const renderPopulation = (levelData: any) => {
         if (!levelData?.populationIncrease) return null;
         return `+${levelData.populationIncrease}`;
    }

    return (
        <div>
            <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Current Level */}
                <div className="bg-black/20 p-4 rounded-lg">
                    <h3 className="text-xl text-center text-amber-300 mb-4 border-b border-amber-800 pb-2">Level {currentLevel} (Current)</h3>
                    <div className="space-y-2">
                        {'production' in currentLevelData && currentLevelData.production && <StatDisplay label="Production" value={renderProduction(currentLevelData)} />}
                        {'populationIncrease' in currentLevelData && currentLevelData.populationIncrease && <StatDisplay label="Population" value={renderPopulation(currentLevelData) || ''} />}
                    </div>
                </div>

                {/* Next Level */}
                <div className={`bg-black/20 p-4 rounded-lg ${isMaxLevel ? 'flex items-center justify-center' : ''}`}>
                {isMaxLevel ? (
                    <p className="text-2xl text-green-400 font-bold">Max Level Reached!</p>
                ) : (
                    <>
                        <h3 className="text-xl text-center text-amber-300 mb-4 border-b border-amber-800 pb-2">Level {currentLevel + 1} (Next)</h3>
                        <div className="space-y-2">
                            {'production' in nextLevelData && nextLevelData.production && (
                                <StatDisplay 
                                    label="Production" 
                                    value={renderProduction(currentLevelData)} 
                                    change={`-> ${renderProduction(nextLevelData)}`}
                                />
                            )}
                             {'populationIncrease' in nextLevelData && nextLevelData.populationIncrease && (
                                <StatDisplay 
                                    label="Population" 
                                    value={renderPopulation(currentLevelData) || ''} 
                                    change={`-> ${renderPopulation(nextLevelData)}`}
                                />
                            )}
                        </div>
                    </>
                )}
                </div>
            </div>

            {!isMaxLevel && (
                <div className="bg-stone-900/60 p-4 rounded-lg">
                    <h4 className="text-lg font-bold text-amber-300 mb-3">Upgrade Cost:</h4>
                     <div className="flex items-center gap-6 text-md mb-6">
                        {Object.entries(nextLevelData.cost).map(([type, value]) => (
                            <div key={type} className="flex items-center gap-2">
                                <div className="w-5 h-5">
                                    <ResourceIcon type={type as ResourceType} />
                                </div>
                                <span className={ (gameState.resources[type as ResourceType] ?? 0) < (value as number) ? 'text-red-500 font-bold' : 'text-gray-200'}>{value as number}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            <div className="flex justify-end gap-4 mt-8">
                 <button onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                    Cancel
                </button>
                {!isMaxLevel && (
                    <button 
                        onClick={handleUpgrade}
                        disabled={!canAfford(nextLevelData.cost)}
                        className="bg-green-700 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-lg transform hover:scale-105 disabled:transform-none"
                    >
                        Upgrade
                    </button>
                )}
            </div>
        </div>
    );
};
