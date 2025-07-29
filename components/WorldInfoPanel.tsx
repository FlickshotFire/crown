import React, { useState, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { WorldMapPOI, POIType } from '../types';

const WorldInfoPanel: React.FC = () => {
    const { gameState, toggleWorldInfoPanel, centerMapOnCoordinates } = useGame();
    const { worldMapPOIs } = gameState;
    const [activeTab, setActiveTab] = useState<POIType>(POIType.PlayerCastle);

    const poiTabs = [
        { type: POIType.PlayerCastle, label: "Castles" },
        { type: POIType.CultistTower, label: "Cultists" },
        { type: POIType.ResourceStone, label: "Resources" },
    ];

    const filteredPOIs = useMemo(() => {
        return worldMapPOIs
            .filter(poi => poi.type === activeTab)
            .sort((a, b) => a.ownerName.localeCompare(b.ownerName));
    }, [worldMapPOIs, activeTab]);

    return (
        <div className="absolute bottom-4 left-4 w-[450px] h-[400px] bg-stone-800/90 backdrop-blur-sm border-2 border-amber-900 rounded-lg flex flex-col pointer-events-auto shadow-2xl z-[600] animate-fade-in">
            <header className="p-2 bg-stone-900/50 border-b-2 border-amber-800 flex justify-between items-center">
                <h2 className="text-xl text-amber-300">World Intel</h2>
                <button
                    onClick={toggleWorldInfoPanel}
                    className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-black/20 border-2 border-amber-900/60 rounded-md text-amber-300/70 hover:text-white hover:bg-red-800/60 transition-colors"
                    aria-label="Close panel"
                    title="Close"
                >
                    <i className="fas fa-times text-xl"></i>
                </button>
            </header>
            <div className="flex border-b-2 border-amber-800">
                {poiTabs.map(tab => (
                    <button
                        key={tab.type}
                        onClick={() => setActiveTab(tab.type)}
                        className={`flex-1 py-2 text-lg transition-colors duration-200 ${
                            activeTab === tab.type
                                ? 'bg-amber-800/40 text-amber-200 font-bold'
                                : 'text-gray-400 hover:bg-white/10'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <main className="flex-grow p-2 overflow-y-auto">
                <table className="w-full text-left text-sm text-gray-300">
                    <thead className="sticky top-0 bg-stone-800">
                        <tr className="text-amber-300">
                            <th className="p-2">Name</th>
                            <th className="p-2">Level</th>
                            <th className="p-2">Coords</th>
                            <th className="p-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPOIs.map(poi => (
                            <tr key={poi.id} className="border-t border-white/10 hover:bg-white/5">
                                <td className="p-2">{poi.ownerName}</td>
                                <td className="p-2 text-center">{poi.level}</td>
                                <td className="p-2 font-mono">{`${Math.round(poi.position.x)}:${Math.round(poi.position.y)}`}</td>
                                <td className="p-2 text-right">
                                    <button 
                                        onClick={() => centerMapOnCoordinates(poi.position)}
                                        className="px-2 py-1 text-xs bg-blue-700 hover:bg-blue-600 text-white rounded"
                                        title="Center map"
                                    >
                                        Go To
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
             <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: scale(0.95) translateY(10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default WorldInfoPanel;
