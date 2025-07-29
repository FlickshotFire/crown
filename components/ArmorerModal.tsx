
import React from 'react';
import { useGame } from '../context/GameContext';
import { ARMORER_INVENTORY } from '../constants';
import { ICONS } from '../assets';
import { ResourceType } from '../types';

const ResourceIcon: React.FC<{ type: ResourceType }> = ({ type }) => {
    const iconStyle = { width: '20px', height: '20px' };
    switch (type) {
        case ResourceType.Rubies: return <div style={iconStyle}>{ICONS.Rubies({})}</div>;
        default: return null;
    }
};

const ArmorerModal: React.FC = () => {
    const { gameState, canAfford, purchaseFromArmorer } = useGame();

    return (
        <div className="space-y-4">
            {ARMORER_INVENTORY.map(item => {
                const cost = item.cost;
                const bonusType = item.bonus.type.replace('_', ' ');
                const bonusValue = item.bonus.value;

                return (
                    <div key={item.id} className="bg-stone-900/50 p-4 rounded-lg border border-white/10 flex items-center justify-between gap-6">
                        <div className="w-24 h-24 flex-shrink-0 bg-black/20 rounded-md flex items-center justify-center p-2">
                           {item.icon}
                        </div>
                        <div className="flex-grow">
                            <h3 className="text-xl text-amber-400">{item.name}</h3>
                            <p className="text-sm text-gray-300 italic mb-3">{item.description}</p>
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col items-start">
                                    <span className="text-xs text-gray-400 mb-1">Bonus:</span>
                                    <div className="flex items-center gap-2 text-md text-green-400 font-bold bg-black/20 px-3 py-1 rounded-md capitalize">
                                        <span>{bonusType} +{bonusValue}%</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-xs text-gray-400 mb-1">Cost:</span>
                                    <div className="flex items-center gap-2 text-md bg-black/20 px-3 py-1 rounded-md">
                                        <ResourceIcon type={ResourceType.Rubies} />
                                        <span className={!canAfford(cost) ? 'text-red-500 font-bold' : 'text-gray-200'}>{cost.Rubies}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => purchaseFromArmorer(item)}
                            disabled={!canAfford(cost)}
                            className="bg-green-700 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-colors shadow-md transform hover:scale-105 disabled:transform-none flex-shrink-0"
                        >
                            Buy
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default ArmorerModal;