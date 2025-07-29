import React, { useState } from 'react';
import { useGame } from '../context/GameContext';

const PresetSelector: React.FC = () => {
    const { gameState, saveAttackPreset, loadAttackPreset } = useGame();
    const { attackPresets } = gameState;
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [presetName, setPresetName] = useState('');

    const handleSaveClick = () => {
        if (presetName.trim()) {
            saveAttackPreset(presetName.trim());
            setPresetName('');
            setIsSaving(false);
        }
    };

    const handleLoadPreset = (id: string) => {
        loadAttackPreset(id);
        setDropdownOpen(false);
    }
    
    return (
        <div className="relative flex flex-col gap-1 w-48">
            <button 
                onClick={() => setDropdownOpen(!isDropdownOpen)}
                className="px-4 py-1 text-sm bg-stone-700/80 border border-stone-500 rounded text-amber-300 hover:bg-stone-600 w-full text-left"
            >
                Load Preset &#9662;
            </button>
            {isDropdownOpen && (
                <div className="absolute bottom-full mb-1 w-full bg-stone-800 border border-stone-600 rounded-md shadow-lg z-10">
                    {attackPresets.map(preset => (
                        <button 
                            key={preset.id}
                            onClick={() => handleLoadPreset(preset.id)}
                            className="w-full text-left px-3 py-2 text-sm text-gray-200 hover:bg-stone-700"
                        >
                            {preset.name}
                        </button>
                    ))}
                </div>
            )}

            {isSaving ? (
                <div className="flex items-center gap-1">
                    <input 
                        type="text"
                        value={presetName}
                        onChange={(e) => setPresetName(e.target.value)}
                        placeholder="Preset Name..."
                        className="flex-grow px-2 py-1 text-sm bg-stone-900 border border-stone-500 rounded text-white"
                    />
                    <button onClick={handleSaveClick} className="px-2 py-1 text-xs bg-green-700 rounded text-white">Save</button>
                </div>
            ) : (
                <button 
                    onClick={() => setIsSaving(true)}
                    className="px-4 py-1 text-sm bg-stone-700/80 border border-stone-500 rounded text-amber-300 hover:bg-stone-600 w-full"
                >
                    Save Current
                </button>
            )}
        </div>
    );
};

export default PresetSelector;