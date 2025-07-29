import React from 'react';
import Modal from './Modal';
import { useGame } from '../context/GameContext';
import { COMMANDERS } from '../constants';
import { Commander } from '../types';

interface CommanderSelectionModalProps {
    onClose: () => void;
    onSelect: (commanderId: Commander['id']) => void;
    waveIndex: number;
}

const CommanderSelectionModal: React.FC<CommanderSelectionModalProps> = ({ onClose, onSelect, waveIndex }) => {
    const { gameState } = useGame();
    const commandersInUse = Object.values(gameState.attackPlan[waveIndex].commanders);

    const getBonusText = (commander: Commander) => {
        const { type, value } = commander.bonus;
        const typeText = type.replace(/_/g, ' ');
        return `${typeText.charAt(0).toUpperCase() + typeText.slice(1)} +${value}%`;
    }

    return (
        <Modal title="Select a Commander" onClose={onClose}>
            <div className="space-y-4">
                {COMMANDERS.map(commander => {
                    const isUsed = commandersInUse.includes(commander.id);
                    return (
                        <button
                            key={commander.id}
                            disabled={isUsed}
                            onClick={() => onSelect(commander.id)}
                            className={`w-full bg-stone-900/50 p-4 rounded-lg border border-white/10 flex items-center gap-4 transition-colors ${
                                isUsed 
                                ? 'opacity-50 cursor-not-allowed' 
                                : 'hover:bg-stone-900/80 hover:border-amber-400/50'
                            }`}
                        >
                            <div className="w-16 h-16 flex-shrink-0 bg-black/20 rounded-full flex items-center justify-center p-2">
                                {commander.icon}
                            </div>
                            <div className="flex-grow text-left">
                                <h3 className="text-xl text-amber-400">{commander.name}</h3>
                                <p className="text-sm text-gray-300 italic">{commander.description}</p>
                            </div>
                            <div className="text-center flex-shrink-0 w-32">
                                <p className="text-lg font-bold text-green-400">{getBonusText(commander)}</p>
                                {isUsed && <p className="text-xs text-red-400">(In Use)</p>}
                            </div>
                        </button>
                    )
                })}
            </div>
        </Modal>
    );
};

export default CommanderSelectionModal;