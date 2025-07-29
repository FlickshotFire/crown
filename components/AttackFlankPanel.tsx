


import React from 'react';
import { useGame } from '../context/GameContext';
import { TROOPS, FLANK_CAPACITY, FRONT_CAPACITY, TOOLS, COMMANDERS } from '../constants';
import { ICONS } from '../assets';
import { Commander, TroopType } from '../types';

const FlankPanelBackground = ({ flank }: { flank: 'left' | 'front' | 'right' }) => {
    const isFront = flank === 'front';
    const sidePoints = "20,0 120,0 140,20 160,0 260,0 280,20 280,220 260,240 20,240 0,220 0,20";
    const frontPoints = "20,0 205,0 225,25 245,0 430,0 450,20 450,280 430,300 20,300 0,280 0,20";

    const points = isFront ? frontPoints : sidePoints;
    const viewBox = `0 0 ${isFront ? 450 : 280} ${isFront ? 300 : 240}`;
    const svgWidth = isFront ? "450px" : "280px";
    const svgHeight = isFront ? "300px" : "240px";

    const flankTitles = {
        left: 'Left Flank',
        front: 'Front',
        right: 'Right Flank',
    };

    return (
        <div className="absolute inset-0" style={{ width: svgWidth, height: svgHeight, filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.2))' }}>
            <svg width="100%" height="100%" viewBox={viewBox} preserveAspectRatio="none">
                <defs>
                    <filter id="text-shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="1" dy="1" stdDeviation="1" floodColor="#333" />
                    </filter>
                </defs>
                <polygon
                    points={points}
                    fill="#e8d7b4"
                    stroke="#a1937f"
                    strokeWidth="5"
                    strokeLinejoin="round"
                />
                <text
                    x="50%"
                    y={isFront ? "35" : "28"}
                    textAnchor="middle"
                    fill="#4a2c0c"
                    fontSize={isFront ? "24" : "20"}
                    fontWeight="bold"
                    fontFamily="Lato, sans-serif"
                    style={{ filter: "url(#text-shadow)" }}
                >
                    {flankTitles[flank]}
                </text>
            </svg>
        </div>
    );
};


const AddSlot = ({onClick}: {onClick: () => void}) => (
    <button onClick={onClick} className="w-12 h-12 bg-[#c8bda8]/50 border-2 border-stone-500/50 rounded-md flex items-center justify-center hover:bg-[#c8bda8] transition-colors group">
        <span className="text-stone-600 group-hover:text-stone-800 text-3xl font-light">{ICONS.Plus({})}</span>
    </button>
);

const ToolSlot = ({icon, count, onClick}: {icon: React.ReactNode, count: number, onClick: () => void}) => (
    <div className="flex flex-col items-center">
        <button onClick={onClick} className="w-10 h-10 rounded-full bg-stone-700/50 border border-stone-500 flex items-center justify-center p-1.5 hover:bg-stone-700/80 transition-colors">
            {icon}
        </button>
        <p className="text-xs font-bold text-stone-700">{count}</p>
    </div>
);

const TroopRow = ({ icon, slotType, numSlots, count, capacity, onAdd }: { icon: React.ReactNode, slotType: 'melee' | 'ranged', numSlots: number, count: number, capacity: number, onAdd: (slot: 'melee' | 'ranged') => void }) => (
    <div className="w-full">
        <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 text-stone-700">{icon}</div>
            <span className="font-bold text-stone-800 text-sm">{count} / {capacity}</span>
        </div>
        <div className="flex items-center gap-2">
            {Array.from({ length: numSlots }).map((_, i) => (
                <AddSlot key={i} onClick={() => onAdd(slotType)} />
            ))}
        </div>
    </div>
);

const CommanderSlot = ({commander, onClick}: {commander?: Commander, onClick: () => void}) => {
    return (
        <button 
            onClick={onClick}
            title={commander ? `Commander: ${commander.name}` : "Assign Commander"}
            className="absolute top-0 right-0 m-2 w-14 h-14 bg-[#c8bda8] border-2 border-stone-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md"
        >
            {commander ? (
                <div className="w-12 h-12 p-1">{commander.icon}</div>
            ) : (
                <span className="text-stone-600 text-4xl font-light">{ICONS.Plus({})}</span>
            )}
        </button>
    );
};


const AttackFlankPanel = ({ flank, selectedAssignable, onOpenCommanderModal }: { flank: 'left' | 'front' | 'right', selectedAssignable: any, onOpenCommanderModal: (flank: 'left' | 'front' | 'right') => void }) => {
    const { gameState, addTroopsToAttackWave, getAvailableTroopsForAttack, addToolsToAttackWave, getAvailableToolsForAttack } = useGame();
    const { attackPlan, currentAttackWaveIndex, attackTarget } = gameState;

    if (!attackTarget) return null;

    const waveData = attackPlan[currentAttackWaveIndex];
    const flankData = waveData[flank];
    const commanderId = waveData.commanders[flank];
    const commander = COMMANDERS.find(c => c.id === commanderId);

    const capacity = flank === 'front' ? FRONT_CAPACITY(attackTarget.level) : FLANK_CAPACITY(attackTarget.level);
    const availableTroops = getAvailableTroopsForAttack();
    const availableTools = getAvailableToolsForAttack();
    
    const getTroopCount = (army: { [key in TroopType]?: number }): number => {
        if (!army) return 0;
        return Object.values(army).reduce((sum, count) => sum + (count || 0), 0);
    };

    const handleTroopSlotClick = (slot: 'melee' | 'ranged') => {
        if (!selectedAssignable || selectedAssignable.type !== 'troop') return;
        
        const troopId = selectedAssignable.id;
        const troopInfo = TROOPS.find(t => t.id === troopId);
        
        if (!troopInfo || slot !== troopInfo.slot) return;

        const availableCount = availableTroops[troopId] || 0;
        if (availableCount <= 0) return;
        
        const currentSlotCount = getTroopCount(flankData[slot]);
        const canAddCount = Math.min(availableCount, capacity[slot] - currentSlotCount, 10); // Add 10 at a time

        if(canAddCount > 0) {
            addTroopsToAttackWave(flank, slot, troopId, canAddCount);
        }
    };

    const handleToolSlotClick = () => {
        if (flank !== 'front' || !selectedAssignable || selectedAssignable.type !== 'tool') return;
        const toolId = selectedAssignable.id;
        
        const availableCount = availableTools[toolId] || 0;
        if (availableCount <= 0) return;

        addToolsToAttackWave(toolId, 1);
    }

    const meleeTroopCount = getTroopCount(flankData.melee);
    const rangedTroopCount = getTroopCount(flankData.ranged);

    const isFront = flank === 'front';
    const width = isFront ? 'w-[450px]' : 'w-[280px]';
    const height = isFront ? 'h-[300px]' : 'h-[240px]';
    const numRangedSlots = isFront ? 3 : 2;
    const numMeleeSlots = isFront ? 5 : 2;
    const frontWaveTools = attackPlan[currentAttackWaveIndex].tools;

    return (
        <div className={`relative ${width} ${height}`}>
            <FlankPanelBackground flank={flank} />
            <CommanderSlot commander={commander} onClick={() => onOpenCommanderModal(flank)} />

             <div className="absolute inset-0 p-8 pt-12 flex flex-col justify-between">
                <div className="flex flex-col gap-3">
                    <TroopRow icon={ICONS.Ladder({})} slotType="ranged" numSlots={numRangedSlots} count={rangedTroopCount} capacity={capacity.ranged} onAdd={handleTroopSlotClick} />
                    <TroopRow icon={ICONS.CrossedSwords({})} slotType="melee" numSlots={numMeleeSlots} count={meleeTroopCount} capacity={capacity.melee} onAdd={handleTroopSlotClick} />
                </div>
                
                <div className="flex justify-around items-center pt-3 border-t-2 border-stone-500/30">
                     {isFront ? (
                        <>
                           <ToolSlot icon={ICONS.ToolIcons.ShieldWall({})} count={frontWaveTools.shield_wall || 0} onClick={handleToolSlotClick} />
                           <ToolSlot icon={ICONS.ToolIcons.Mantlet({})} count={frontWaveTools.mantlet || 0} onClick={handleToolSlotClick} />
                           <ToolSlot icon={ICONS.ToolIcons.BatteringRam({})} count={frontWaveTools.battering_ram || 0} onClick={handleToolSlotClick} />
                        </>
                    ) : (
                         <>
                           <ToolSlot icon={ICONS.Sword({className: 'opacity-20'})} count={0} onClick={() => {}} />
                           <ToolSlot icon={ICONS.Sword({className: 'opacity-20'})} count={0} onClick={() => {}} />
                         </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AttackFlankPanel;
