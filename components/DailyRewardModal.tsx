import React from 'react';
import { useGame } from '../context/GameContext';
import { DAILY_REWARDS } from '../constants';
import { ResourceType, Resources } from '../types';
import { ICONS } from '../assets';

const ResourceIcon: React.FC<{ type: ResourceType; className?: string }> = ({ type, className = "w-6 h-6" }) => {
    switch (type) {
        case ResourceType.Wood: return <div className={className}>{ICONS.Wood({})}</div>;
        case ResourceType.Stone: return <div className={className}>{ICONS.Stone({})}</div>;
        case ResourceType.Coins: return <div className={className}>{ICONS.Coins({})}</div>;
        case ResourceType.Food: return <div className={className}>{ICONS.Food({})}</div>;
        case ResourceType.Rubies: return <div className={className}>{ICONS.Rubies({})}</div>;
        case ResourceType.Iron: return <div className={className}>{ICONS.Iron({})}</div>;
        default: return null;
    }
};

const formatNumber = (num) => {
    if (num >= 1000) return `${(num / 1000).toFixed(0)}k`;
    return num.toString();
};

const DailyRewardModal: React.FC = () => {
    const { gameState, claimDailyReward } = useGame();
    const { consecutiveLogins, hasClaimedToday } = gameState;

    return (
        <div className="text-center">
            <h3 className="text-2xl text-amber-300 mb-2">Come back each day for greater rewards!</h3>
            <p className="text-gray-400 mb-6">Your current login streak: <span className="font-bold text-white">{consecutiveLogins} Day{consecutiveLogins > 1 ? 's' : ''}</span></p>

            <div className="grid grid-cols-4 md:grid-cols-7 gap-4">
                {DAILY_REWARDS.map(reward => {
                    const day = reward.day;
                    const isClaimed = day < consecutiveLogins;
                    const isToday = day === consecutiveLogins;
                    const canClaim = isToday && !hasClaimedToday;
                    const isFuture = day > consecutiveLogins;

                    let cardClass = "bg-black/20 border-stone-700";
                    if (isClaimed) cardClass = "bg-green-900/50 border-green-700 opacity-60";
                    if (isToday) cardClass = "bg-amber-900/50 border-amber-500 scale-105 shadow-lg";
                    if (canClaim) cardClass += " animate-pulse";
                    
                    const resources = Object.entries(reward.reward);

                    return (
                        <div key={day} className={`p-4 rounded-lg border-2 transition-all duration-300 flex flex-col justify-between ${cardClass}`}>
                            <div className="flex-grow">
                                <p className="font-bold text-lg text-amber-200 mb-2">Day {day}</p>
                                <div className="flex flex-col items-center justify-center space-y-2">
                                    {resources.map(([type, amount]) => (
                                        <div key={type} className="flex items-center gap-2">
                                            <ResourceIcon type={type as ResourceType} />
                                            <span className="text-white font-semibold">{formatNumber(amount)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="h-10 mt-4 flex items-center justify-center">
                                {isClaimed && <div className="text-green-400 font-bold text-2xl"><i className="fas fa-check-circle"></i></div>}
                                {canClaim && (
                                    <button 
                                        onClick={claimDailyReward}
                                        className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                                    >
                                        Claim
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DailyRewardModal;