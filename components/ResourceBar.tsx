
import React from 'react';
import { useGame } from '../context/GameContext';
import { ResourceType } from '../types';
import { ICONS } from '../assets';
import ProgressBar from './ProgressBar';

const ResourceItem = ({ icon, amount }) => {
    
    const formatNumber = (num) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
        return num.toString();
    };

    return (
        <div className="flex items-center space-x-1">
            <div className="w-5 h-5">{icon}</div>
            <span className="text-sm font-bold text-white text-shadow-sm">{formatNumber(amount)}</span>
        </div>
    );
};

const ResourceBar = () => {
    const { gameState } = useGame();
    const { resources } = gameState;

    // Based on the screenshot's top bar
    const resourcesToShow = [
        { type: ResourceType.Wood, icon: ICONS.Wood({}) },
        { type: ResourceType.Stone, icon: ICONS.Stone({}) },
        { type: ResourceType.Food, icon: ICONS.Food({}) },
        { type: ResourceType.Coins, icon: ICONS.Coins({}) },
        { type: ResourceType.Rubies, icon: ICONS.Rubies({}) },
        { type: ResourceType.Gems, icon: ICONS.Gems({}) },
        { type: ResourceType.Silver, icon: ICONS.Silver({}) },
    ];

    return (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center space-x-2 pointer-events-auto bg-[#1e1e1e]/90 border-t-2 border-b-2 border-x-0 border-y-[#5a5a5a] px-4 py-0.5 shadow-lg">
            <div className="h-1 w-full absolute -top-1.5 left-0 px-1">
                <ProgressBar value={80} max={100} barClassName="bg-red-700" bgClassName="bg-transparent" height="h-1" />
            </div>
            <div className="flex items-center space-x-4">
                {resourcesToShow.map(res => (
                    <ResourceItem key={res.type} icon={res.icon} amount={resources[res.type]} />
                ))}
            </div>
        </div>
    );
};

export default ResourceBar;
