import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import AttackFlankPanel from './AttackFlankPanel';
import AttackControlBar from './AttackControlBar';
import AttackHeader from './AttackHeader';
import CommanderSelectionModal from './CommanderSelectionModal';

const AttackView = () => {
    const { gameState, assignCommander } = useGame();
    const { attackTarget, currentAttackWaveIndex } = gameState;
    const [selectedAssignable, setSelectedAssignable] = useState(null);

    const [isCommanderModalOpen, setCommanderModalOpen] = useState(false);
    const [commanderModalTarget, setCommanderModalTarget] = useState(null);


    if (!attackTarget) return null;

    const backgroundStyle = {
        backgroundColor: '#c8bda8',
        backgroundImage: 'radial-gradient(circle at center, #a39985 1px, transparent 1px), radial-gradient(circle at center, #a39985 1px, transparent 1px)',
        backgroundSize: '10px 10px',
        backgroundPosition: '0 0, 5px 5px',
    };

    const handleOpenCommanderModal = (flank) => {
        setCommanderModalTarget(flank);
        setCommanderModalOpen(true);
    };

    const handleSelectCommander = (commanderId) => {
        if (commanderModalTarget) {
            assignCommander(currentAttackWaveIndex, commanderModalTarget, commanderId);
        }
        setCommanderModalOpen(false);
        setCommanderModalTarget(null);
    };

    const handleCloseCommanderModal = () => {
        setCommanderModalOpen(false);
        setCommanderModalTarget(null);
    }

    return (
        <div 
            className="w-full h-full text-white overflow-hidden flex flex-col"
            style={backgroundStyle}
        >
            <AttackHeader />
            <main className="flex-grow flex flex-col justify-between items-center gap-2 overflow-hidden p-4">
                {/* Flank panels */}
                <div className="flex-grow flex items-center justify-center gap-4 relative w-full">
                    
                    {/* Left Flank */}
                    <div className="z-10">
                        <AttackFlankPanel flank="left" selectedAssignable={selectedAssignable} onOpenCommanderModal={handleOpenCommanderModal} />
                    </div>

                    {/* Center - Front Flank */}
                     <div className="flex flex-col items-center z-10">
                        <AttackFlankPanel flank="front" selectedAssignable={selectedAssignable} onOpenCommanderModal={handleOpenCommanderModal} />
                    </div>

                    {/* Right Flank */}
                    <div className="z-10">
                        <AttackFlankPanel flank="right" selectedAssignable={selectedAssignable} onOpenCommanderModal={handleOpenCommanderModal} />
                    </div>
                </div>

                {/* Bottom part - Unit selection and controls */}
                 <AttackControlBar selectedAssignable={selectedAssignable} onSelectAssignable={setSelectedAssignable} />
            </main>

            {isCommanderModalOpen && (
                <CommanderSelectionModal 
                    onClose={handleCloseCommanderModal}
                    onSelect={handleSelectCommander}
                    waveIndex={currentAttackWaveIndex}
                />
            )}
        </div>
    );
};

export default AttackView;