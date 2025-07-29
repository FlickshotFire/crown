


import React from 'react';
import { useGame } from '../context/GameContext';
import { MERCHANT_INVENTORY } from '../constants';
import { ICONS } from '../assets';
import { ResourceType } from '../types';

const ResourceIcon = ({ type }) => {
    const iconStyle = { width: '20px', height: '20px' };
    switch (type) {
        case ResourceType.Wood: return <div style={iconStyle}>{ICONS.Wood({})}</div>;
        case ResourceType.Stone: return <div style={iconStyle}>{ICONS.Stone({})}</div>;
        case ResourceType.Coins: return <div style={iconStyle}>{ICONS.Coins({})}</div>;
        case ResourceType.Rubies: return <div style={iconStyle}>{ICONS.Rubies({})}</div>;
        case ResourceType.Food: return <div style={iconStyle}>{ICONS.Food({})}</div>;
        default: return null;
    }
};

const MerchantShop = () => {
    const { gameState, canAfford, purchaseFromMerchant } = useGame();

    return (
        <div className="space-y-4">
            {MERCHANT_INVENTORY.map(item => {
                const cost = item.cost;
                const rewardType = Object.keys(item.reward)[0];
                const rewardAmount = Object.values(item.reward)[0];

                return (
                    <div key={item.id} className="bg-stone-900/50 p-4 rounded-lg border border-white/10 flex items-center justify-between gap-6">
                        <div className="flex-grow">
                            <h3 className="text-xl text-amber-400">{item.name}</h3>
                            <p className="text-sm text-gray-300 italic mb-3">{item.description}</p>
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col items-start">
                                    <span className="text-xs text-gray-400 mb-1">You receive:</span>
                                    <div className="flex items-center gap-2 text-md text-green-400 font-bold bg-black/20 px-3 py-1 rounded-md">
                                        <ResourceIcon type={rewardType} />
                                        <span>+{rewardAmount}</span>
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
                            onClick={() => purchaseFromMerchant(item)}
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

export default MerchantShop;
