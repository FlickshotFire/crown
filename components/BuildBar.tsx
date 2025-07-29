

import React, { useState, useMemo, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { BUILDINGS } from '../constants';
import { Building, BuildingCategory, ResourceType, Resources } from '../types';
import { ICONS } from '../assets';
import BuildingInfoTooltip from './BuildingInfoTooltip';


// Helper component to render resource icons for costs
const ResourceCostIcon: React.FC<{ type: ResourceType }> = ({ type }) => {
    const iconClass = 'w-full h-full';
    switch (type) {
        case ResourceType.Wood: return ICONS.Wood({ className: iconClass });
        case ResourceType.Stone: return ICONS.Stone({ className: iconClass });
        case ResourceType.Rubies: return ICONS.Rubies({ className: iconClass });
        case ResourceType.Coins: return ICONS.Coins({ className: iconClass });
        default: return null;
    }
};

const CategoryButton: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-1.5 text-base rounded-t-lg transition-colors duration-200 ${
            isActive
                ? 'bg-stone-700/90 text-amber-200 font-bold border-t-2 border-x-2 border-stone-600'
                : 'bg-stone-900/70 text-stone-300 hover:bg-stone-800/80'
        }`}
        title={label}
    >
        <div className="w-5 h-5">{icon}</div>
        <span>{label}</span>
    </button>
);

const BuildingCard: React.FC<{
    building: Building;
    onCardClick: (e: React.MouseEvent) => void;
    onInfoClick: (e: React.MouseEvent) => void;
    canAfford: boolean;
}> = ({ building, onCardClick, onInfoClick, canAfford }) => {
    const cost = building.levels[0].cost;

    const CostDisplay = () => {
        const costEntries = Object.entries(cost).filter(([, value]) => value > 0);
        if (costEntries.length === 0) return <div className="h-[28px]"></div>; // Placeholder for consistent height

        return (
            <div className="w-full bg-[#d3cbb7] border-t-2 border-[#a68a64] text-[#4a2c0c] rounded-b-lg px-2 py-0.5">
                {costEntries.length > 1 ? (
                    // For multiple resources (e.g., Blacksmith)
                    <div className="flex flex-col">
                        {costEntries.map(([type, value]) => (
                            <div key={type} className="flex items-center justify-between text-xs">
                                <div className="w-4 h-4 flex-shrink-0"><ResourceCostIcon type={type as ResourceType} /></div>
                                <span className={`font-bold ${type === ResourceType.Rubies ? 'text-red-600' : ''}`}>{value?.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    // For a single resource
                    costEntries.map(([type, value]) => (
                        <div key={type} className="flex items-center gap-2 text-sm justify-start">
                            <div className="w-5 h-5 flex-shrink-0"><ResourceCostIcon type={type as ResourceType} /></div>
                            <span className={`font-bold ${type === ResourceType.Rubies ? 'text-red-600' : ''}`}>{value?.toLocaleString()}</span>
                        </div>
                    ))
                )}
            </div>
        );
    };

    return (
        <div
            className={`relative flex-shrink-0 w-36 h-full rounded-lg flex flex-col items-center justify-start transition-all duration-200 group bg-[#e4d3b6] border-2 border-[#a68a64] shadow-md`}
        >
             <button
                onClick={onCardClick}
                disabled={!canAfford}
                className="w-full h-full flex flex-col items-center justify-between cursor-pointer disabled:grayscale disabled:cursor-not-allowed"
            >
                <div className="flex-grow flex flex-col items-center justify-center p-1">
                    <div className="w-24 h-20 flex items-center justify-center">{building.icon}</div>
                    <p className="text-[#4a2c0c] font-bold text-sm truncate mt-1">{building.name}</p>
                </div>
                 
                <CostDisplay />
            </button>

            <button
                onClick={onInfoClick}
                className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center bg-[#46788f] text-white rounded-full text-sm font-black border-2 border-[#a1bcd6] z-10 cursor-pointer"
            >
                i
            </button>
        </div>
    );
};


const BuildBar: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { gameState, initiateBuild, canAfford, toggleBlueprintMode, showResourceDenialTooltip } = useGame();
    const { isBlueprintMode } = gameState;
    const [activeCategory, setActiveCategory] = useState<BuildingCategory>(BuildingCategory.Economy);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [infoTooltip, setInfoTooltip] = useState<{ building: Building; position: { top: number; left: number } } | null>(null);


    const buildingCounts = useMemo(() => {
        const counts = new Map<string, number>();
        gameState.buildings.forEach((b: any) => {
            counts.set(b.type, (counts.get(b.type) || 0) + 1);
        });
        return counts;
    }, [gameState.buildings]);

    const filteredBuildings = useMemo(
        () => BUILDINGS.filter(b => b.category === activeCategory && b.id !== 'keep'),
        [activeCategory]
    );

    const handleCardClick = (e: React.MouseEvent, building: Building) => {
        const cost = building.levels[0].cost;
        if (canAfford(cost)) {
            initiateBuild(building.id);
        } else {
            const rect = e.currentTarget.getBoundingClientRect();
            showResourceDenialTooltip(cost, {
                top: rect.top,
                left: rect.left + rect.width / 2,
            });
        }
    };

    const handleInfoClick = (e: React.MouseEvent, building: Building) => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        setInfoTooltip({
            building,
            position: { top: rect.top, left: rect.left + rect.width / 2 }
        });
    };
    
    const handleScroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = direction === 'left' ? -300 : 300;
            scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const categories: { key: BuildingCategory; label: string; icon: React.ReactNode }[] = [
        { key: BuildingCategory.Economy, label: 'Economy', icon: ICONS.BuildCategories.Economy({}) },
        { key: BuildingCategory.Military, label: 'Military', icon: ICONS.BuildCategories.Military({}) },
        { key: BuildingCategory.Civil, label: 'Civil', icon: ICONS.BuildCategories.Civil({}) },
        { key: BuildingCategory.Decoration, label: 'Decorations', icon: ICONS.BuildCategories.Decorations({}) },
    ];

    return (
        <>
            <div
                className="absolute left-1/2 -translate-x-1/2 w-4/5 max-w-[800px] h-48 bg-[#312a22] pointer-events-auto border-t-2 border-[#5a4a35] shadow-2xl flex flex-col rounded-t-lg z-10"
                style={{
                    bottom: '74px',
                    backgroundImage: "url('https://www.transparenttextures.com/patterns/dark-denim-3.png')",
                }}
            >
                <div className="flex justify-between items-center px-4 pt-1">
                    <div className="flex items-end gap-1">
                        {categories.map(cat => (
                            <CategoryButton
                                key={cat.key}
                                label={cat.label}
                                icon={cat.icon}
                                isActive={activeCategory === cat.key}
                                onClick={() => setActiveCategory(cat.key)}
                            />
                        ))}
                    </div>
                     <button onClick={onClose} className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-red-800/80 border-2 border-red-900/90 rounded-md text-white/90 hover:text-white hover:bg-red-700 transition-colors"
                        aria-label="Close Build Menu" title="Close"
                     >
                       <i className="fas fa-times text-xl"></i>
                    </button>
                </div>
                <div className="flex-grow flex items-center p-2 pt-1 gap-2 overflow-hidden">
                     <button onClick={() => handleScroll('left')} className="h-full w-12 bg-stone-900/50 hover:bg-stone-800/70 rounded-lg text-white text-2xl transition-colors">
                        &#9664;
                     </button>
                     <div ref={scrollContainerRef} className="flex-grow h-full flex items-center gap-3 overflow-x-auto scrollbar-hide">
                        {filteredBuildings.map(b => (
                            <BuildingCard
                                key={b.id}
                                building={b}
                                onCardClick={(e) => handleCardClick(e, b)}
                                onInfoClick={(e) => handleInfoClick(e, b)}
                                canAfford={canAfford(b.levels[0].cost)}
                            />
                        ))}
                     </div>
                     <button onClick={() => handleScroll('right')} className="h-full w-12 bg-stone-900/50 hover:bg-stone-800/70 rounded-lg text-white text-2xl transition-colors">
                        &#9654;
                     </button>
                    <div className="h-full flex flex-col justify-around items-center w-12 bg-stone-900/50 rounded-lg p-1">
                        <button title="Building Information" className="w-10 h-10 flex items-center justify-center text-white/70 rounded bg-stone-700/50 hover:bg-stone-600/50">
                            <i className="fas fa-info-circle text-xl"></i>
                        </button>
                        <button 
                            title={isBlueprintMode ? "Normal View" : "Blueprint View"} 
                            onClick={toggleBlueprintMode}
                            className={`w-10 h-10 flex items-center justify-center text-white rounded transition-colors ${isBlueprintMode ? 'bg-blue-600' : 'bg-stone-700/50 hover:bg-stone-600/50'}`}
                        >
                            <i className="fas fa-home text-xl"></i>
                        </button>
                        <button title="Move View Up" className="w-10 h-10 flex items-center justify-center text-white/70 rounded bg-stone-700/50 hover:bg-stone-600/50">
                            <i className="fas fa-arrow-up text-xl"></i>
                        </button>
                    </div>
                </div>
                 <style>{`
                    .scrollbar-hide::-webkit-scrollbar {
                        display: none;
                    }
                    .scrollbar-hide {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                `}</style>
            </div>
            {infoTooltip && (
                <BuildingInfoTooltip
                    building={infoTooltip.building}
                    position={infoTooltip.position}
                    onClose={() => setInfoTooltip(null)}
                />
            )}
        </>
    );
};

export default BuildBar;