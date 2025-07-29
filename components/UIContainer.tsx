
import React, { useState, useEffect, useRef } from 'react';
import PlayerInfo from './PlayerInfo';
import TopRightMenu from './TopRightMenu';
import QuestGiver from './QuestGiver';
import BottomRightUI from './BottomRightUI';
import ActionBar from './ActionBar';
import Modal from './Modal';
import BuildBar from './BuildBar';
import QuestLog from './QuestLog';
import MerchantShop from './MerchantShop';
import { UpgradeModal } from './UpgradeModal';
import { useGame } from '../context/GameContext';
import { TROOPS, TOOLS } from '../constants';
import BarracksModal from './BarracksModal';
import ToolsWorkshopModal from './ToolsWorkshopModal';
import ResourceBar from './ResourceBar';
import ChatBox from './ChatBox';
import RightSideMenu from './RightSideMenu';
import MailModal from './MailModal';
import { ICONS } from '../assets';
import BottomLeftMenu from './BottomLeftMenu';
import ProgressBar from './ProgressBar';
import ArmorerModal from './ArmorerModal';
import WorldInfoPanel from './WorldInfoPanel';
import NotEnoughResourcesTooltip from './NotEnoughResourcesTooltip';
import { WALL_EXPANSION_COST } from '../constants';
import NotificationContainer from './NotificationContainer';
import DailyRewardModal from './DailyRewardModal';
import LeaderboardModal from './LeaderboardModal';
import NomadEventModal from './NomadEventModal';

const UIContainer = () => {
    const [isBuildMenuOpen, setIsBuildMenuOpen] = useState(false);
    const [isQuestLogOpen, setIsQuestLogOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [inventoryTab, setInventoryTab] = useState('tools');
    const [now, setNow] = useState(Date.now());

    // States for new modals
    const [isAllianceModalOpen, setAllianceModalOpen] = useState(false);
    const [isMilitaryModalOpen, setMilitaryModalOpen] = useState(false);
    const [isMarketplaceModalOpen, setMarketplaceModalOpen] = useState(false);
    const [isInventoryModalOpen, setInventoryModalOpen] = useState(false);
    const [isPlayerProfileModalOpen, setPlayerProfileModalOpen] = useState(false);
    const [isSpecialOfferModalOpen, setSpecialOfferModalOpen] = useState(false);
    const [isBookmarksModalOpen, setBookmarksModalOpen] = useState(false);
    const [isHelpModalOpen, setHelpModalOpen] = useState(false);
    const [isDefensePresetsModalOpen, setDefensePresetsModalOpen] = useState(false);
    const [isAttackPresetsModalOpen, setAttackPresetsModalOpen] = useState(false);
    const [isBoostersModalOpen, setBoostersModalOpen] = useState(false);
    const [isDailyRewardModalOpen, setDailyRewardModalOpen] = useState(false);
    const [isLeaderboardModalOpen, setLeaderboardModalOpen] = useState(false);

    const { 
        gameState, 
        closeUpgradeModal, 
        closeMerchantShop,
        closeBarracksModal,
        closeWorkshopModal,
        openMailModal,
        closeMailModal,
        cancelBuildMode,
        closeArmorerModal,
        openNomadEventModal,
        closeNomadEventModal,
        closeBlacksmithModal,
        closeEquipmentTraderModal,
        closeWheelOfAffluenceModal,
        centerMapOnPlayerCastle,
        toggleWorldInfoPanel,
        openWorldMap,
        centerMapOnCoordinates,
        removeBookmark,
        hideResourceDenialTooltip
    } = useGame();

    const { 
        currentView,
        upgradeModalBuildingId, 
        isMerchantShopOpen,
        isBarracksModalOpen,
        barracksModalBuildingId,
        isWorkshopModalOpen,
        workshopModalBuildingId,
        isMailModalOpen,
        buildMode,
        isArmorerModalOpen,
        equipment,
        isNomadEventModalOpen,
        isBlacksmithModalOpen,
        isEquipmentTraderModalOpen,
        isWheelOfAffluenceModalOpen,
        isWorldInfoPanelOpen,
        resourceDenialTooltip,
        wallConstructions,
        notifications,
    } = gameState;

    const prevIsBuildModeActive = useRef(buildMode.isActive);

    const [timeRemaining, setTimeRemaining] = useState(0);

    const construction = wallConstructions.length > 0 ? wallConstructions.reduce((oldest, current) => oldest.completesAt < current.completesAt ? oldest : current) : null;

    useEffect(() => {
        if (!construction) return;
        const interval = setInterval(() => {
            const remaining = Math.max(0, construction.completesAt - Date.now());
            setTimeRemaining(remaining);
        }, 1000);
        return () => clearInterval(interval);
    }, [construction]);

    const formatConstructionTime = (ms) => {
        const totalSeconds = Math.ceil(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = (totalSeconds % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    }


    useEffect(() => {
        // If build mode was active and now it's not, close the build menu.
        // This handles finishing a move, or canceling via right-click.
        if (prevIsBuildModeActive.current && !buildMode.isActive) {
            setIsBuildMenuOpen(false);
        }
        prevIsBuildModeActive.current = buildMode.isActive;
    }, [buildMode.isActive]);

    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);


    const handleOpenBuildMenu = () => {
        if (!isBuildMenuOpen) {
            setIsBuildMenuOpen(true);
        }
    };

    const handleCloseBuildMenu = () => {
        cancelBuildMode();
        setIsBuildMenuOpen(false);
    };
    
    const formatTime = (seconds) => {
        if (seconds < 60) return `${Math.ceil(seconds)}s`;
        const minutes = Math.floor(seconds / 60);
        const secs = Math.ceil(seconds % 60);
        return `${minutes}m ${secs}s`;
    }
    
    const InventoryTabButton = ({ label, tabName, currentTab, onClick}) => (
        <button
            onClick={onClick}
            className={`px-4 py-2 text-lg transition-colors duration-200 border-b-4 ${
                currentTab === tabName
                    ? 'border-amber-400 text-amber-300 font-bold'
                    : 'border-transparent text-gray-400 hover:text-white'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="fixed inset-0 pointer-events-none font-sans">
            {construction && (
                <div className="absolute top-2 left-[300px] w-24 p-1 bg-black/50 text-yellow-400 font-bold text-center text-lg rounded border border-yellow-600 z-[1000] pointer-events-auto">
                    {formatConstructionTime(timeRemaining)}
                </div>
            )}
            
            {/* Main UI Elements */}
            <PlayerInfo onSpecialOfferClick={() => setSpecialOfferModalOpen(true)} />
            
            {currentView === 'castle' && <TopRightMenu onBookmarksClick={() => setBookmarksModalOpen(true)} onHelpClick={() => setHelpModalOpen(true)} />}
            {currentView === 'castle' && <ResourceBar />}
            
            <RightSideMenu onEventsClick={openNomadEventModal} onDefensePresetsClick={() => setDefensePresetsModalOpen(true)} onAttackPresetsClick={() => setAttackPresetsModalOpen(true)} onBoostersClick={() => setBoostersModalOpen(true)} onSearchClick={() => {}} />

            <div onClick={() => setIsQuestLogOpen(true)} className="pointer-events-auto">
                <QuestGiver />
            </div>
            <BottomRightUI 
                onMailClick={openMailModal} 
                onSpecialOfferClick={() => setSpecialOfferModalOpen(true)} 
                onEventsClick={openNomadEventModal} 
                onChatClick={() => setIsChatOpen(prev => !prev)}
                onZeroButtonClick={centerMapOnPlayerCastle}
                onDailyRewardClick={() => setDailyRewardModalOpen(true)}
                />
            <ActionBar onBuildClick={handleOpenBuildMenu} onQuestBookClick={() => setIsQuestLogOpen(true)} onMailClick={openMailModal} onAllianceClick={() => setAllianceModalOpen(true)} onMilitaryClick={() => setMilitaryModalOpen(true)} onMarketplaceClick={() => setMarketplaceModalOpen(true)} onInventoryClick={() => setInventoryModalOpen(true)} />

            <BottomLeftMenu onChatClick={() => setIsChatOpen(prev => !prev)} onPlayerProfileClick={() => setPlayerProfileModalOpen(true)} onAllianceClick={() => setAllianceModalOpen(true)} onInventoryClick={() => setInventoryModalOpen(true)} onLeaderboardClick={() => setLeaderboardModalOpen(true)} />
            
            {currentView === 'world' && (
                <div className="absolute bottom-4 left-4 flex flex-col space-y-2 pointer-events-auto">
                    <button
                        title="World Intel"
                        onClick={toggleWorldInfoPanel}
                        className="relative w-14 h-14 bg-gradient-to-b from-stone-600 to-stone-800 rounded-lg border-2 border-stone-500 shadow-lg flex items-center justify-center text-amber-200 hover:from-stone-500 hover:text-white transition-all group"
                    >
                        <div className="text-3xl transition-transform group-hover:scale-110">
                            <i className="fas fa-map-marked-alt"></i>
                        </div>
                    </button>
                </div>
            )}

            {/* Popups & Conditional UI */}
            {currentView === 'castle' && isChatOpen && <ChatBox onClose={() => setIsChatOpen(false)} />}
            <NotificationContainer />
            {resourceDenialTooltip && (
                <NotEnoughResourcesTooltip 
                    cost={resourceDenialTooltip.cost} 
                    position={resourceDenialTooltip.position} 
                    onClose={hideResourceDenialTooltip}
                />
            )}
            {isWorldInfoPanelOpen && <WorldInfoPanel />}
            {isBuildMenuOpen && <BuildBar onClose={handleCloseBuildMenu} />}

            {/* Modals */}
            {isQuestLogOpen && (
                 <Modal title="Quest Log" onClose={() => setIsQuestLogOpen(false)}>
                    <QuestLog />
                </Modal>
            )}
             {isMailModalOpen && (
                <MailModal />
            )}
             {upgradeModalBuildingId && (
                <Modal title="Upgrade Building" onClose={closeUpgradeModal}>
                    <UpgradeModal buildingInstanceId={upgradeModalBuildingId} onClose={closeUpgradeModal} />
                </Modal>
            )}
             {isMerchantShopOpen && (
                <Modal title="Traveling Merchant" onClose={closeMerchantShop}>
                    <MerchantShop />
                </Modal>
            )}
             {isArmorerModalOpen && (
                <Modal title="Armorer's Workshop" onClose={closeArmorerModal}>
                    <ArmorerModal />
                </Modal>
            )}
             {isNomadEventModalOpen && (
                <NomadEventModal onClose={closeNomadEventModal} />
            )}
             {isBlacksmithModalOpen && (
                <Modal title="Master Blacksmith" onClose={closeBlacksmithModal}>
                    <div className="text-center p-4">
                        <div className="w-32 h-32 mx-auto mb-4 p-2 bg-black/20 rounded-lg">{ICONS.Shops.Blacksmith()}</div>
                        <p className="text-lg text-gray-300">The Master Blacksmith can forge powerful, unique items.</p>
                        <p className="text-gray-400 italic mt-2">This feature is coming soon!</p>
                    </div>
                </Modal>
            )}
            {isEquipmentTraderModalOpen && (
                <Modal title="Equipment Trader" onClose={closeEquipmentTraderModal}>
                    <div className="text-center p-4">
                        <div className="w-32 h-32 mx-auto mb-4 p-2 bg-black/20 rounded-lg">{ICONS.Shops.EquipmentTrader()}</div>
                        <p className="text-lg text-gray-300">The Equipment Trader offers rare and valuable gear for your commanders.</p>
                        <p className="text-gray-400 italic mt-2">This feature is coming soon!</p>
                    </div>
                </Modal>
            )}
            {isWheelOfAffluenceModalOpen && (
                <Modal title="Wheel of Unimaginable Affluence" onClose={closeWheelOfAffluenceModal}>
                    <div className="text-center p-4">
                        <div className="w-48 h-48 mx-auto mb-4">{ICONS.Shops.WheelOfAffluence()}</div>
                        <p className="text-lg text-gray-300">Feeling lucky? Spin the wheel for a chance at untold riches!</p>
                        <p className="text-gray-400 italic mt-2">This feature is coming soon!</p>
                    </div>
                </Modal>
            )}
            {isBarracksModalOpen && barracksModalBuildingId && (
                <Modal title="Train Troops" onClose={closeBarracksModal}>
                    <BarracksModal buildingId={barracksModalBuildingId} />
                </Modal>
            )}
            {isWorkshopModalOpen && workshopModalBuildingId && (
                <Modal title="Construct Tools" onClose={closeWorkshopModal}>
                    <ToolsWorkshopModal buildingId={workshopModalBuildingId} />
                </Modal>
            )}
            
            {/* NEWLY ADDED MODALS */}
             {isDailyRewardModalOpen && (
                <Modal title="Daily Login Rewards" onClose={() => setDailyRewardModalOpen(false)}>
                    <DailyRewardModal />
                </Modal>
            )}

            {isLeaderboardModalOpen && (
                <Modal title="Player Rankings" onClose={() => setLeaderboardModalOpen(false)}>
                    <LeaderboardModal />
                </Modal>
            )}
            
            {isPlayerProfileModalOpen && (
                <Modal title="Player Profile" onClose={() => setPlayerProfileModalOpen(false)}>
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl text-amber-300">{gameState.playerName}</h2>
                        <p className="text-lg text-cyan-400">[{gameState.allianceName}]</p>
                        <div className="bg-black/20 p-4 rounded-lg space-y-2">
                            <p>Level: {gameState.level}</p>
                            <ProgressBar value={gameState.xp} max={gameState.xpForNextLevel} barClassName="bg-green-500" height="h-5">
                                <span className="text-xs font-bold text-white text-shadow-sm">{gameState.xp.toLocaleString()} / {gameState.xpForNextLevel.toLocaleString()} XP</span>
                            </ProgressBar>
                            <ProgressBar value={gameState.honor} max={gameState.honorMax} barClassName="bg-purple-500" height="h-5">
                                <span className="text-xs font-bold text-white text-shadow-sm">{gameState.honor.toLocaleString()} / {gameState.honorMax.toLocaleString()} Honor</span>
                            </ProgressBar>
                        </div>
                    </div>
                </Modal>
            )}
            {isAllianceModalOpen && (
                <Modal title="Alliance" onClose={() => setAllianceModalOpen(false)}>
                    <p>Alliance features coming soon!</p>
                </Modal>
            )}
            {isMilitaryModalOpen && (
                <Modal title="Military Overview" onClose={() => setMilitaryModalOpen(false)}>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-xl text-amber-300 mb-2">Your Army</h3>
                            <div className="bg-black/20 p-2 rounded-md space-y-1">
                                {Object.entries(gameState.troops).map(([type, count]) => {
                                    const troopInfo = TROOPS.find(t => t.id === type);
                                    return (
                                        <div key={type} className="flex justify-between items-center p-1">
                                            <span className="flex items-center gap-2"><div className="w-6 h-6">{troopInfo?.icon}</div> {troopInfo?.name}</span>
                                            <span className="font-bold">{count.toLocaleString()}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                         <div>
                            <h3 className="text-xl text-amber-300 mb-2">Training Queue</h3>
                            <div className="bg-black/20 p-2 rounded-md space-y-1">
                               {gameState.trainingQueue.length > 0 ? gameState.trainingQueue.map((item, index) => (
                                    <div key={index}>{item.quantity}x {TROOPS.find(t => t.id === item.troopId)?.name} - ready in {formatTime((item.completesAt - Date.now()) / 1000)}</div>
                                )) : <p className="text-gray-500 italic">Queue is empty.</p>}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl text-amber-300 mb-2">Workshop Queue</h3>
                            <div className="bg-black/20 p-2 rounded-md space-y-1">
                               {gameState.workshopQueue.length > 0 ? gameState.workshopQueue.map((item, index) => (
                                    <div key={index}>{item.quantity}x {TOOLS.find(t => t.id === item.toolId)?.name} - ready in {formatTime((item.completesAt - Date.now()) / 1000)}</div>
                                )) : <p className="text-gray-500 italic">Queue is empty.</p>}
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
            {isMarketplaceModalOpen && (
                <Modal title="Marketplace" onClose={() => setMarketplaceModalOpen(false)}>
                    <p>Trading with other players will be available here soon!</p>
                </Modal>
            )}
            {isInventoryModalOpen && (
                <Modal title="Inventory" onClose={() => setInventoryModalOpen(false)}>
                    <div className="flex border-b-2 border-amber-900/50 mb-4">
                        <InventoryTabButton label="War Tools" tabName="tools" currentTab={inventoryTab} onClick={() => setInventoryTab('tools')} />
                        <InventoryTabButton label="Equipment" tabName="equipment" currentTab={inventoryTab} onClick={() => setInventoryTab('equipment')} />
                        <InventoryTabButton label="Boosters" tabName="boosters" currentTab={inventoryTab} onClick={() => setInventoryTab('boosters')} />
                    </div>

                    {inventoryTab === 'tools' && (
                        <div>
                            <h3 className="text-xl text-amber-300 mb-2">War Tools</h3>
                            <div className="bg-black/20 p-2 rounded-md space-y-1">
                                {Object.entries(gameState.tools).length > 0 ? Object.entries(gameState.tools).map(([type, count]) => {
                                    const toolInfo = TOOLS.find(t => t.id === type);
                                    return (
                                        <div key={type} className="flex justify-between items-center p-1">
                                            <span className="flex items-center gap-2"><div className="w-6 h-6">{toolInfo?.icon}</div> {toolInfo?.name}</span>
                                            <span className="font-bold">{count.toLocaleString()}</span>
                                        </div>
                                    );
                                }) : <p className="text-gray-500 italic p-2 text-center">No tools crafted.</p>}
                            </div>
                        </div>
                    )}
                    {inventoryTab === 'equipment' && (
                         <div>
                            <h3 className="text-xl text-amber-300 mb-2">Commander Equipment</h3>
                            <div className="bg-black/20 p-2 rounded-md space-y-1">
                                {equipment.length > 0 ? equipment.map((item) => {
                                    return (
                                        <div key={item.id} className="flex justify-between items-center p-2 bg-stone-800/50 rounded">
                                            <span className="flex items-center gap-3">
                                                <div className="w-8 h-8 p-1 bg-black/30 rounded">{item.icon}</div> 
                                                <div className="flex flex-col">
                                                    <span className="font-bold">{item.name}</span>
                                                    <span className="text-xs text-gray-400">{item.description}</span>
                                                </div>
                                            </span>
                                            <span className="font-bold text-green-400">{item.bonus.type.replace('_', ' ')} +{item.bonus.value}%</span>
                                        </div>
                                    );
                                }) : <p className="text-gray-500 italic p-2 text-center">No equipment purchased.</p>}
                            </div>
                        </div>
                    )}
                    {inventoryTab === 'boosters' && (
                         <div>
                             <h3 className="text-xl text-amber-300 mb-2">Consumables & Boosters</h3>
                             <p className="text-gray-500 italic p-2 text-center">Special items will appear here.</p>
                        </div>
                    )}
                </Modal>
            )}
             {isSpecialOfferModalOpen && (
                <Modal title="Special Offers" onClose={() => setSpecialOfferModalOpen(false)}>
                    <p>Check back later for special deals!</p>
                </Modal>
            )}
             {isBookmarksModalOpen && (
                <Modal title="Bookmarks" onClose={() => setBookmarksModalOpen(false)}>
                     <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                        {gameState.bookmarks.length > 0 ? gameState.bookmarks.map(bookmark => (
                            <div key={bookmark.id} className="bg-stone-900/50 p-3 rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-lg">{bookmark.name}</p>
                                    <p className="text-sm font-mono text-gray-400">{Math.round(bookmark.position.x)}:{Math.round(bookmark.position.y)}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => {
                                            openWorldMap();
                                            centerMapOnCoordinates(bookmark.position);
                                            setBookmarksModalOpen(false);
                                        }}
                                        className="px-4 py-2 text-sm bg-blue-700 hover:bg-blue-600 text-white rounded transition-colors"
                                    >Go To</button>
                                    <button 
                                        onClick={() => removeBookmark(bookmark.id)}
                                        className="px-3 py-2 bg-red-800 hover:bg-red-700 text-white rounded transition-colors"
                                        title="Remove Bookmark"
                                    ><i className="fas fa-trash"></i></button>
                                </div>
                            </div>
                        )) : (
                            <p className="text-gray-400 italic text-center p-8">You have no saved bookmarks.</p>
                        )}
                    </div>
                </Modal>
            )}
            {isHelpModalOpen && (
                <Modal title="Help" onClose={() => setHelpModalOpen(false)}>
                    <p>A helpful game guide and wiki will be available here soon.</p>
                </Modal>
            )}
            {isDefensePresetsModalOpen && (
                <Modal title="Defense Presets" onClose={() => setDefensePresetsModalOpen(false)}>
                    <p>Save and load defensive troop arrangements. Coming soon!</p>
                </Modal>
            )}
            {isAttackPresetsModalOpen && (
                <Modal title="Attack Presets" onClose={() => setAttackPresetsModalOpen(false)}>
                    <p>Save and load army configurations for attacks. Coming soon!</p>
                </Modal>
            )}
            {isBoostersModalOpen && (
                <Modal title="Boosters" onClose={() => setBoostersModalOpen(false)}>
                    <p>View and activate your temporary production and combat boosters here. Coming soon!</p>
                </Modal>
            )}
        </div>
    );
};

export default UIContainer;