

import React, { useState, useMemo } from 'react';
import Modal from './Modal';
import ProgressBar from './ProgressBar';
import { useGame } from '../context/GameContext';
import { NOMAD_EVENT_DATA, FAKE_NOMAD_LEADERBOARD } from '../constants';
import { ICONS } from '../assets';
import { ResourceType, Resources, EventShopItem } from '../types';

const ResourceIcon: React.FC<{ type: ResourceType; className?: string }> = ({ type, className = "w-5 h-5" }) => {
    switch (type) {
        case ResourceType.Wood: return <div className={className}>{ICONS.Wood({})}</div>;
        case ResourceType.Stone: return <div className={className}>{ICONS.Stone({})}</div>;
        case ResourceType.Coins: return <div className={className}>{ICONS.Coins({})}</div>;
        case ResourceType.Food: return <div className={className}>{ICONS.Food({})}</div>;
        case ResourceType.Rubies: return <div className={className}>{ICONS.Rubies({})}</div>;
        case ResourceType.Iron: return <div className={className}>{ICONS.Iron({})}</div>;
        case ResourceType.NomadHorns: return <div className={className}>{ICONS.NomadHorns({})}</div>;
        default: return null;
    }
};

const TabButton: React.FC<{ label: string; isActive: boolean; onClick: () => void; }> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex-1 py-3 text-lg transition-colors duration-200 border-b-4 ${
            isActive
                ? 'border-amber-400 text-amber-300 font-bold'
                : 'border-transparent text-gray-400 hover:text-white'
        }`}
    >
        {label}
    </button>
);

const OverviewTab: React.FC = () => {
    const { gameState, claimNomadMilestone } = useGame();
    const { nomadEvent } = gameState;

    const nextMilestone = NOMAD_EVENT_DATA.milestones.find(m => m.points > nomadEvent.points);
    const progressMax = nextMilestone ? nextMilestone.points : NOMAD_EVENT_DATA.milestones[NOMAD_EVENT_DATA.milestones.length - 1].points;
    const progressValue = nomadEvent.points;

    return (
        <div className="space-y-4">
            <p className="text-center text-gray-300 italic">{NOMAD_EVENT_DATA.description}</p>
            <div className="bg-black/20 p-4 rounded-lg">
                <h3 className="text-xl text-amber-300 mb-2">Your Progress</h3>
                <ProgressBar value={progressValue} max={progressMax} height="h-6" barClassName="bg-gradient-to-r from-purple-500 to-indigo-500">
                    <span className="font-bold text-white text-shadow-sm">{progressValue.toLocaleString()} / {progressMax.toLocaleString()} Points</span>
                </ProgressBar>
            </div>
            <div>
                <h3 className="text-xl text-amber-300 mb-2">Milestone Rewards</h3>
                <div className="space-y-2">
                    {NOMAD_EVENT_DATA.milestones.map((milestone, index) => {
                        const isClaimed = nomadEvent.claimedMilestoneIndices.includes(index);
                        const canClaim = nomadEvent.points >= milestone.points && !isClaimed;
                        
                        return (
                            <div key={index} className={`p-3 rounded-lg flex items-center justify-between ${canClaim ? 'bg-green-800/30' : 'bg-black/20'}`}>
                                <div>
                                    <p className="font-bold text-lg text-white">{milestone.points.toLocaleString()} Points</p>
                                    <div className="flex items-center gap-4 mt-1">
                                        {Object.entries(milestone.rewards).map(([type, amount]) => (
                                            <div key={type} className="flex items-center gap-1.5 text-sm text-gray-300">
                                                <ResourceIcon type={type as ResourceType} />
                                                <span>{amount.toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <button 
                                    onClick={() => claimNomadMilestone(index)}
                                    disabled={!canClaim}
                                    className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-500"
                                >
                                    {isClaimed ? 'Claimed' : 'Claim'}
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

const LeaderboardTab: React.FC = () => {
     const { gameState } = useGame();
     const { playerName, allianceName, nomadEvent } = gameState;

     const leaderboardData = useMemo(() => {
        const currentUserData = {
            name: playerName,
            allianceName: allianceName,
            points: nomadEvent.points,
            isCurrentUser: true,
        };
        const allPlayers = [...FAKE_NOMAD_LEADERBOARD, currentUserData];
        return allPlayers.sort((a,b) => b.points - a.points);
     }, [playerName, allianceName, nomadEvent.points]);

    return (
        <div className="pr-2">
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="text-amber-300">
                        <th className="p-2 w-12">Rank</th>
                        <th className="p-2">Player</th>
                        <th className="p-2 text-right">Points</th>
                    </tr>
                </thead>
                <tbody>
                    {leaderboardData.map((player, index) => (
                        <tr
                            key={player.name + index}
                            className={`border-t border-white/10 ${player.isCurrentUser ? 'bg-amber-600/20' : 'hover:bg-white/5'}`}
                        >
                            <td className="p-2 text-center font-bold text-lg">{index + 1}</td>
                            <td className="p-2">
                                <p className={`font-bold ${player.isCurrentUser ? 'text-amber-200' : 'text-white'}`}>{player.name}</p>
                                <p className="text-xs text-gray-400">{player.allianceName}</p>
                            </td>
                            <td className="p-2 text-right font-bold text-lg">
                                {player.points.toLocaleString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const ShopTab: React.FC<{onClose: () => void}> = ({onClose}) => {
    const { canAfford, spendResources, purchaseNomadResourcePack, initiateBuild } = useGame();

    const handleBuy = (item: EventShopItem) => {
        if (canAfford(item.cost)) {
            if (item.reward.buildingId) {
                spendResources(item.cost);
                initiateBuild(item.reward.buildingId);
                onClose();
            } else {
                purchaseNomadResourcePack(item);
            }
        }
    };

    return (
        <div className="space-y-3">
             {NOMAD_EVENT_DATA.shopItems.map(item => (
                <div key={item.id} className="bg-black/20 p-3 rounded-lg flex items-center justify-between gap-4">
                    <div className="w-16 h-16 bg-black/30 rounded-md flex items-center justify-center p-2 flex-shrink-0">{item.icon}</div>
                    <div className="flex-grow">
                        <h4 className="text-lg text-white font-bold">{item.name}</h4>
                        <p className="text-xs text-gray-400 italic">{item.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleBuy(item)}
                            disabled={!canAfford(item.cost)}
                            className="bg-green-700 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-colors"
                        >
                            Buy
                        </button>
                        <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-md">
                            <ResourceIcon type={ResourceType.NomadHorns} />
                            <span className="font-bold text-lg">{item.cost[ResourceType.NomadHorns]}</span>
                        </div>
                    </div>
                </div>
             ))}
        </div>
    );
};

const NomadEventModal: React.FC<{onClose: () => void}> = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <Modal title={NOMAD_EVENT_DATA.title} onClose={onClose}>
            <div className="flex border-b-2 border-amber-900/50 mb-4">
                <TabButton label="Overview" isActive={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                <TabButton label="Leaderboard" isActive={activeTab === 'leaderboard'} onClick={() => setActiveTab('leaderboard')} />
                <TabButton label="Event Shop" isActive={activeTab === 'shop'} onClick={() => setActiveTab('shop')} />
            </div>
            <div className="max-h-[55vh] overflow-y-auto pr-2">
                {activeTab === 'overview' && <OverviewTab />}
                {activeTab === 'leaderboard' && <LeaderboardTab />}
                {activeTab === 'shop' && <ShopTab onClose={onClose} />}
            </div>
        </Modal>
    );
};

export default NomadEventModal;
