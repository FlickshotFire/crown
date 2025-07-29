


import React, { useState } from 'react';
import Modal from './Modal';
import { useGame } from '../context/GameContext';
import { MailMessage, CombatReport, SpyReport, Army, ResourceType } from '../types';
import { ICONS } from '../assets';
import { TROOPS } from '../constants';

const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((new Date().getTime() - timestamp) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
};

const CombatReportView: React.FC<{ report: CombatReport }> = ({ report }) => {
    const { isVictory, reportText, attackerLosses, defenderLosses, loot } = report;

    const ArmyTable: React.FC<{ title: string; losses: Army }> = ({ title, losses }) => (
        <div className="bg-black/20 p-4 rounded-lg">
            <h3 className="text-xl text-center text-amber-300 mb-4 border-b border-amber-800 pb-2">{title}</h3>
            {Object.keys(losses).length > 0 ? (
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-gray-400">
                            <th className="p-1">Unit</th>
                            <th className="p-1 text-right">Lost</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(losses).map(([type, count]) => {
                             const troopInfo = TROOPS.find(t => t.id === type);
                             return (
                                <tr key={type} className="border-t border-white/10">
                                    <td className="p-1 flex items-center gap-2">
                                        <div className="w-6 h-6">{troopInfo?.icon}</div>
                                        {troopInfo?.name || type}
                                    </td>
                                    <td className="p-1 text-right font-bold text-red-400">{count}</td>
                                </tr>
                             );
                        })}
                    </tbody>
                </table>
            ) : (
                <p className="text-center text-gray-500 italic">No losses.</p>
            )}
        </div>
    );

    return (
         <div className="space-y-6">
            <div className={`text-center p-4 rounded-lg ${isVictory ? 'bg-green-800/50' : 'bg-red-800/50'}`}>
                <h2 className={`text-4xl font-black ${isVictory ? 'text-green-300' : 'text-red-300'}`}>{isVictory ? 'VICTORY' : 'DEFEAT'}</h2>
            </div>
            <div className="bg-stone-900/50 p-4 rounded-lg border border-white/10">
                <p className="text-gray-300 italic text-center leading-relaxed">"{reportText}"</p>
            </div>
            <div className="grid grid-cols-2 gap-6">
                <ArmyTable title="Your Losses" losses={attackerLosses} />
                <ArmyTable title="Enemy Losses" losses={defenderLosses} />
            </div>
            {Object.keys(loot).length > 0 && (
                <div className="bg-yellow-800/20 p-4 rounded-lg">
                     <h3 className="text-xl text-yellow-300 mb-2">Loot Plundered</h3>
                     <div className="flex items-center gap-6">
                        {Object.entries(loot).map(([type, count]) => (
                            <div key={type} className="flex items-center gap-2 text-lg font-bold">
                                {type === ResourceType.Coins && <div className="w-6 h-6">{ICONS.Coins({})}</div>}
                                {type === ResourceType.Food && <div className="w-6 h-6">{ICONS.Food({})}</div>}
                                {type === ResourceType.Wood && <div className="w-6 h-6">{ICONS.Wood({})}</div>}
                                {type === ResourceType.Stone && <div className="w-6 h-6">{ICONS.Stone({})}</div>}
                                <span>+{Math.floor(count)}</span>
                            </div>
                        ))}
                     </div>
                </div>
            )}
            {report.eventGains && (
                <div className="bg-purple-800/20 p-4 rounded-lg">
                    <h3 className="text-xl text-purple-300 mb-2">Event Gains</h3>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-lg font-bold">
                            <i className="fas fa-trophy text-purple-400"></i>
                            <span className="text-white">+{report.eventGains.points} Points</span>
                        </div>
                        <div className="flex items-center gap-2 text-lg font-bold">
                            <div className="w-6 h-6">{ICONS.NomadHorns({})}</div>
                            <span className="text-white">+{report.eventGains.horns} Horns</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const SpyReportView: React.FC<{ report: SpyReport }> = ({ report }) => {
    const { wasSuccessful, narrative, estimatedResources, estimatedArmy, revealedDefenses } = report;

    return (
        <div className="space-y-6">
            <div className={`text-center p-4 rounded-lg ${wasSuccessful ? 'bg-blue-800/50' : 'bg-red-800/50'}`}>
                <h2 className={`text-4xl font-black ${wasSuccessful ? 'text-blue-300' : 'text-red-300'}`}>{wasSuccessful ? 'SPY REPORT' : 'SPY DETECTED'}</h2>
            </div>
            <div className="bg-stone-900/50 p-4 rounded-lg border border-white/10">
                <p className="text-gray-300 italic text-center leading-relaxed">"{narrative}"</p>
            </div>
            {wasSuccessful && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-lg text-amber-300 mb-2">Estimated Army</h3>
                        <div className="bg-black/20 p-2 rounded-md mt-1 space-y-1">
                            {estimatedArmy && Object.keys(estimatedArmy).length > 0 ? Object.entries(estimatedArmy).map(([type, count]) => {
                                const troopInfo = TROOPS.find(t => t.id === type);
                                return (
                                     <div key={type} className="text-gray-300 flex items-center justify-between p-1">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6">{troopInfo?.icon}</div>
                                            <span>{troopInfo?.name}</span>
                                        </div>
                                        <span className="font-bold">~{count}</span>
                                    </div>
                                )
                            }) : <p className="text-gray-500 italic text-center p-2">No forces detected.</p>}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg text-amber-300 mb-2">Defenses</h3>
                         <div className="bg-black/20 p-2 rounded-md mt-1 space-y-1 text-sm">
                            <div className="flex justify-between"><span>Wall Bonus:</span> <span>{revealedDefenses?.wall.toFixed(1)}%</span></div>
                            <div className="flex justify-between"><span>Gate Bonus:</span> <span>{revealedDefenses?.gate.toFixed(1)}%</span></div>
                            <div className="flex justify-between"><span>Moat Bonus:</span> <span>{revealedDefenses?.moat.toFixed(1)}%</span></div>
                         </div>
                    </div>
                 </div>
            )}
        </div>
    );
}

const MailModal: React.FC = () => {
    const { gameState, closeMailModal, markMessageAsRead } = useGame();
    const { mail } = gameState;
    const [selectedMessageId, setSelectedMessageId] = useState<string | null>(mail.find(m => !m.isRead)?.id || mail[0]?.id || null);

    const sortedMail = [...mail].sort((a, b) => b.timestamp - a.timestamp);
    const selectedMessage = sortedMail.find(m => m.id === selectedMessageId);

    const handleSelectMessage = (messageId: string) => {
        setSelectedMessageId(messageId);
        markMessageAsRead(messageId);
    };

    const renderContent = () => {
        if (!selectedMessage) {
            return <div className="flex items-center justify-center h-full"><p className="text-gray-400">Select a message to read.</p></div>;
        }
        switch(selectedMessage.type) {
            case 'combat_report':
                return <CombatReportView report={selectedMessage.content as CombatReport} />;
            case 'spy_report':
                return <SpyReportView report={selectedMessage.content as SpyReport} />;
            case 'system_message':
                 return <p>{(selectedMessage.content as {text: string}).text}</p>;
            default:
                return <p>Invalid message format.</p>;
        }
    }

    return (
        <Modal title="Your Mail" onClose={closeMailModal}>
            <div className="flex h-[70vh] gap-4">
                {/* Mail List */}
                <div className="w-1/3 bg-black/20 rounded-lg p-2 overflow-y-auto">
                    {sortedMail.length > 0 ? (
                        <ul className="space-y-1">
                            {sortedMail.map(message => (
                                <li key={message.id}>
                                    <button 
                                        onClick={() => handleSelectMessage(message.id)}
                                        className={`w-full text-left p-2 rounded-md transition-colors ${selectedMessageId === message.id ? 'bg-amber-800/40' : 'hover:bg-white/10'}`}
                                    >
                                        <h4 className={`font-bold ${!message.isRead ? 'text-amber-300' : 'text-gray-300'}`}>{message.subject}</h4>
                                        <p className="text-xs text-gray-400">{formatTimeAgo(message.timestamp)}</p>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500 italic">Your inbox is empty.</p>
                        </div>
                    )}
                </div>

                {/* Content View */}
                <div className="w-2/3 bg-stone-900/50 p-4 rounded-lg overflow-y-auto">
                   {renderContent()}
                </div>
            </div>
        </Modal>
    );
};

export default MailModal;