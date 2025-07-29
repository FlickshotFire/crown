import React from 'react';
import { useGame } from '../context/GameContext';

const PlacementControls: React.FC = () => {
    const { flipBuildGhost, cancelBuildMode } = useGame();

    const handleRotate = (e: React.MouseEvent) => {
        e.stopPropagation();
        flipBuildGhost();
    };

    const handleCancel = (e: React.MouseEvent) => {
        e.stopPropagation();
        cancelBuildMode();
    };

    return (
        <div 
            className="flex items-center gap-2 p-2 bg-stone-800/60 rounded-full pointer-events-auto border-2 border-stone-600 shadow-xl"
            data-interactive="true"
        >
            {/* Cancel Button */}
            <button
                title="Cancel"
                onClick={handleCancel}
                data-interactive="true"
                className="w-16 h-16 rounded-full bg-red-600 border-2 border-red-400 shadow-lg flex items-center justify-center text-white transition-transform duration-200 ease-in-out hover:scale-110"
            >
                <i className="fas fa-times text-4xl"></i>
            </button>

            {/* Decorative Separator */}
            <div className="w-12 h-12 rounded-full bg-stone-700 border-2 border-stone-500 flex items-center justify-center">
                 <div className="w-8 h-8 rounded-full border-2 border-stone-400/50"></div>
            </div>

            {/* Rotate Button */}
            <button
                title="Rotate"
                onClick={handleRotate}
                data-interactive="true"
                className="w-16 h-16 rounded-full bg-stone-600 border-2 border-stone-400 shadow-lg flex items-center justify-center text-white transition-transform duration-200 ease-in-out hover:scale-110"
            >
                <i className="fas fa-sync-alt text-3xl"></i>
            </button>
        </div>
    );
};

export default PlacementControls;
