import React, { useState, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { FAKE_LEADERBOARD_PLAYERS } from '../constants';
import { LeaderboardPlayer } from '../types';

type LeaderboardCategory = 'honor' | 'level' | 'power';

const LeaderboardModal: React.FC = () => {
    const { gameState } = useGame();
    const [activeTab, setActiveTab] = useState<LeaderboardCategory>('honor');

    const leaderboardData: LeaderboardPlayer[] = useMemo(() => {
        const currentUser: LeaderboardPlayer = {
            id: 'current_user',
            name: gameState.playerName,
            allianceName: gameState.allianceName,
            level: gameState.level,
            honor: gameState.honor,
            power: (gameState.level * 10000) + gameState.honor / 100, // Simple power calculation
            isCurrentUser: true,
        };
        
        const allPlayers = [...FAKE_LEADERBOARD_PLAYERS, currentUser];

        return allPlayers.sort((a, b) => {
            if (b[activeTab] === a[activeTab]) {
                return b.level - a.level; // Secondary sort by level
            }
            return b[activeTab] - a[activeTab];
        });

    }, [activeTab, gameState]);

    const TabButton: React.FC<{ tab: LeaderboardCategory, children: React.ReactNode }> = ({ tab, children }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-lg transition-colors duration-200 ${
                activeTab === tab
                    ? 'bg-amber-800/40 text-amber-200 font-bold'
                    : 'text-gray-400 hover:bg-white/10'
            }`}
        >
            {children}
        </button>
    );

    return (
        <div>
            <div className="flex border-b-2 border-amber-800 mb-4">
                <TabButton tab="honor">Honor</TabButton>
                <TabButton tab="level">Level</TabButton>
                <TabButton tab="power">Power</TabButton>
            </div>

            <div className="max-h-[60vh] overflow-y-auto pr-2">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="text-amber-300">
                            <th className="p-2 w-12">Rank</th>
                            <th className="p-2">Player</th>
                            <th className="p-2 text-right">Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboardData.map((player, index) => (
                            <tr 
                                key={player.id} 
                                className={`border-t border-white/10 ${player.isCurrentUser ? 'bg-amber-600/20' : 'hover:bg-white/5'}`}
                            >
                                <td className="p-2 text-center font-bold text-lg">{index + 1}</td>
                                <td className="p-2">
                                    <p className={`font-bold ${player.isCurrentUser ? 'text-amber-200' : 'text-white'}`}>{player.name}</p>
                                    <p className="text-xs text-gray-400">{player.allianceName}</p>
                                </td>
                                <td className="p-2 text-right font-bold text-lg">
                                    {player[activeTab].toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LeaderboardModal;