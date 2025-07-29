
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { ResourceType, TroopType, POIType, ToolType, BuildingLevel, ChatMessage, NomadEventState, EventShopItem } from '../types';
import { BUILDINGS, QUESTS, WALL_EXPANSION_COST, GRID_ROWS, GRID_COLS, MERCHANT_INVENTORY, TROOPS, generateInitialWorldMapPOIs, TOOLS, COMMANDERS, FLANK_CAPACITY, FRONT_CAPACITY, INITIAL_ATTACK_PRESETS, ARMORER_INVENTORY, DAILY_REWARDS, NOMAD_EVENT_DATA } from '../constants';
import { generateCombatReport, generateSpyReport, generateChatResponse } from '../services/geminiService';
import { resolveBattle } from '../services/combatService';
import { findPath } from '../services/pathfinding';

const createEmptyAttackPlan = () => {
    const emptyFlank = () => ({ melee: {}, ranged: {} });
    const emptyWave = () => ({ 
        left: emptyFlank(), 
        front: emptyFlank(), 
        right: emptyFlank(), 
        tools: {},
        commanders: {},
    });
    return Array(4).fill(null).map(() => emptyWave());
};

const defaultInitialState = {
    resources: {
        [ResourceType.Wood]: 293000,
        [ResourceType.Stone]: 291000,
        [ResourceType.Coins]: 585980000,
        [ResourceType.Population]: 10,
        [ResourceType.Rubies]: 13000000,
        [ResourceType.Food]: 131000,
        [ResourceType.Meat]: 22051,
        [ResourceType.Iron]: 108000,
        [ResourceType.Gems]: 0,
        [ResourceType.Copper]: 737000,
        [ResourceType.Silver]: 0,
        [ResourceType.NomadHorns]: 0,
    },
    buildings: [
        { instanceId: 'b1', type: 'keep', x: 37, y: 37, width: 6, height: 6, level: 1, isFlipped: false },
    ],
    xp: 10483311,
    level: 70,
    xpForNextLevel: 16934907,
    honor: 62600000,
    honorMax: 70670000,
    wallBounds: { x1: 30, y1: 30, x2: 50, y2: 50 },
    wallExpansionCount: { top: 0, bottom: 0, left: 0, right: 0 },
    wallConstructions: [],
    currentQuest: null,
    buildMode: {
        isActive: false,
        buildingType: null,
        isGhostFlipped: false,
    },
    movingBuildingId: null,
    selectedBuildingId: null,
    upgradeModalBuildingId: null,
    isMerchantShopOpen: false,
    merchant: {
        x: 28,
        y: 40,
        width: 2,
        height: 2,
        isFlipped: false
    },
    troops: { [TroopType.Swordsman]: Number.MAX_SAFE_INTEGER, [TroopType.Archer]: Number.MAX_SAFE_INTEGER },
    trainingQueue: [],
    isBarracksModalOpen: false,
    barracksModalBuildingId: null,
    worldMapPOIs: generateInitialWorldMapPOIs(),
    selectedPOI: null,
    zoom: 0.8,
    mapCenterTarget: null,
    currentView: 'castle',
    attackTarget: null,
    attackPlan: createEmptyAttackPlan(),
    currentAttackWaveIndex: 0,
    attackPresets: INITIAL_ATTACK_PRESETS,
    marches: [],
    tools: { [ToolType.BatteringRam]: Number.MAX_SAFE_INTEGER, [ToolType.Mantlet]: Number.MAX_SAFE_INTEGER, [ToolType.ShieldWall]: Number.MAX_SAFE_INTEGER },
    workshopQueue: [],
    isWorkshopModalOpen: false,
    workshopModalBuildingId: null,
    playerName: 'Aηοη',
    allianceName: 'the Undaunted',
    mail: [],
    spyMissions: [],
    isMailModalOpen: false,
    chatHistory: [],
    isArmorerModalOpen: false,
    equipment: [],
    isNomadEventModalOpen: false,
    isBlacksmithModalOpen: false,
    isEquipmentTraderModalOpen: false,
    isWheelOfAffluenceModalOpen: false,
    isBlueprintMode: false,
    isWorldInfoPanelOpen: false,
    bookmarks: [],
    resourceDenialTooltip: null,
    hoveredExpansionDirection: null,
    notifications: [],
    lastLoginDate: null,
    consecutiveLogins: 0,
    hasClaimedToday: false,
    currentUser: null, // Auth state
    nomadEvent: {
        points: 0,
        claimedMilestoneIndices: [],
    },
};

const GameContext = createContext<any>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
    const [gameState, setGameState] = useState(() => {
        const loggedInUser = sessionStorage.getItem('currentUser');
        if (loggedInUser) {
            try {
                const savedStateJSON = localStorage.getItem(`gameState_${loggedInUser}`);
                if (savedStateJSON) {
                    const savedState = JSON.parse(savedStateJSON);
                    const mergedState = {
                        ...defaultInitialState,
                        ...savedState,
                        currentUser: loggedInUser,
                        buildMode: { isActive: false, buildingType: null, isGhostFlipped: false },
                        selectedBuildingId: null,
                        movingBuildingId: null,
                        upgradeModalBuildingId: null,
                        attackTarget: null,
                        selectedPOI: null,
                        resourceDenialTooltip: null,
                    };
                    return mergedState;
                }
            } catch (e) {
                console.error("Failed to parse saved game state, resetting.", e);
                localStorage.removeItem(`gameState_${loggedInUser}`);
            }
        }
        return { ...defaultInitialState, currentUser: null };
    });

    // --- Start of Auth Logic ---
    
    const login = async (username, password) => {
        const testUser = { username: 'tester', password: 'betatester@123' };
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        const userToTest = users[username];

        let valid = false;
        if (username === testUser.username && password === testUser.password) {
            valid = true;
        } else if (userToTest && userToTest.password === password) { // In a real app, use bcrypt.compare
            valid = true;
        }

        if (!valid) {
            throw new Error("Invalid username or password.");
        }

        sessionStorage.setItem('currentUser', username);
        const savedStateJSON = localStorage.getItem(`gameState_${username}`);
        
        const loadedState = savedStateJSON ? JSON.parse(savedStateJSON) : { ...defaultInitialState };
        
        setGameState({
            ...defaultInitialState,
            ...loadedState,
            currentUser: username,
        });
    };

    const signup = async (username, password) => {
        const testUser = { username: 'tester', password: 'betatester@123' };
        if (!username || !password) throw new Error("Username and password cannot be empty.");
        if (username.length < 3) throw new Error("Username must be at least 3 characters.");
        if (password.length < 6) throw new Error("Password must be at least 6 characters.");

        const users = JSON.parse(localStorage.getItem('users') || '{}');
        if (users[username] || username === testUser.username) {
            throw new Error("Username already exists.");
        }

        users[username] = { password };
        localStorage.setItem('users', JSON.stringify(users));
        
        const newUserState = { ...defaultInitialState, playerName: username, allianceName: 'New Blood' };
        localStorage.setItem(`gameState_${username}`, JSON.stringify(newUserState));

        await login(username, password);
    };

    const logout = () => {
        if (gameState.currentUser) {
            // Create a savable state, excluding transient properties
            const stateToSave = { ...gameState };
            delete stateToSave.buildMode;
            delete stateToSave.selectedBuildingId;
            delete stateToSave.attackTarget;
            // ... any other transient state
            localStorage.setItem(`gameState_${gameState.currentUser}`, JSON.stringify(stateToSave));
        }
        sessionStorage.removeItem('currentUser');
        setGameState({ ...defaultInitialState, currentUser: null });
    };

    // --- End of Auth Logic ---

    // --- Start of New Feature Logic ---

    const addNotification = (type: 'success' | 'info' | 'error' | 'warning', title: string, message: string) => {
        const id = Date.now();
        setGameState(prev => ({
            ...prev,
            notifications: [...prev.notifications, { id, type, title, message }]
        }));
    };

    const removeNotification = (id: number) => {
        setGameState(prev => ({
            ...prev,
            notifications: prev.notifications.filter(n => n.id !== id)
        }));
    };

    const claimDailyReward = () => {
        setGameState(prev => {
            if (prev.hasClaimedToday) return prev;
            
            const rewardIndex = (prev.consecutiveLogins - 1) % DAILY_REWARDS.length;
            const reward = DAILY_REWARDS[rewardIndex];
            if (!reward) return prev;
            
            const newResources = { ...prev.resources };
            for (const res in reward.reward) {
                newResources[res as ResourceType] = (newResources[res as ResourceType] || 0) + reward.reward[res as ResourceType];
            }
            
            addNotification('success', 'Reward Claimed!', `You received ${Object.entries(reward.reward).map(([k, v]) => `${v} ${k}`).join(', ')}.`);

            return {
                ...prev,
                resources: newResources,
                hasClaimedToday: true
            };
        });
    };

    useEffect(() => {
        if (!gameState.currentUser) return; // Only run this logic if a user is logged in

        try {
            const savedLoginData = JSON.parse(localStorage.getItem(`dailyRewardData_${gameState.currentUser}`) || '{}');
            const today = new Date().toDateString();
            
            let lastLoginDate = null;
            if (savedLoginData && savedLoginData.lastLoginDate) {
                 lastLoginDate = new Date(savedLoginData.lastLoginDate);
            }
    
            if (lastLoginDate && lastLoginDate.toDateString() === today) {
                // Already logged in today
                setGameState(prev => ({ ...prev, ...savedLoginData, lastLoginDate: lastLoginDate }));
            } else {
                // First login of the day
                const yesterday = new Date();
                yesterday.setDate(new Date().getDate() - 1);
                const newConsecutiveLogins = (lastLoginDate && lastLoginDate.toDateString() === yesterday.toDateString()) ? (savedLoginData.consecutiveLogins % 7) + 1 : 1;
                setGameState(prev => ({ ...prev, lastLoginDate: new Date(), consecutiveLogins: newConsecutiveLogins, hasClaimedToday: false }));
            }
        } catch (error) {
            console.error("Could not parse daily reward data from localStorage", error);
            setGameState(prev => ({ ...prev, lastLoginDate: new Date(), consecutiveLogins: 1, hasClaimedToday: false }));
        }
    }, [gameState.currentUser]);

    useEffect(() => {
        if (gameState.currentUser && gameState.lastLoginDate) {
            const dataToSave = {
                lastLoginDate: gameState.lastLoginDate.toString(),
                consecutiveLogins: gameState.consecutiveLogins,
                hasClaimedToday: gameState.hasClaimedToday,
            };
            localStorage.setItem(`dailyRewardData_${gameState.currentUser}`, JSON.stringify(dataToSave));
        }
    }, [gameState.lastLoginDate, gameState.consecutiveLogins, gameState.hasClaimedToday, gameState.currentUser]);


    // --- End of New Feature Logic ---

    const addResources = (amounts: { [key in ResourceType]?: number }) => {
        setGameState(prev => {
            const newResources = { ...prev.resources };
            for (const key in amounts) {
                const resourceType = key as ResourceType;
                newResources[resourceType] = (newResources[resourceType] || 0) + (amounts[resourceType] || 0);
            }
            return { ...prev, resources: newResources };
        });
    };

    const spendResources = (costs: { [key in ResourceType]?: number }) => {
        if (!canAfford(costs)) return false;
        setGameState(prev => {
            const newResources = { ...prev.resources };
            for (const key in costs) {
                const resourceType = key as ResourceType;
                newResources[resourceType] -= costs[resourceType] || 0;
            }
            return { ...prev, resources: newResources };
        });
        return true;
    };

    const canAfford = (cost: { [key in ResourceType]?: number }) => {
        for (const key in cost) {
            const resourceType = key as ResourceType;
            if ((gameState.resources[resourceType] || 0) < (cost[resourceType] || 0)) {
                return false;
            }
        }
        return true;
    };
    
    const addXp = (amount: number) => {
        setGameState(prev => {
            let newXp = prev.xp + amount;
            let newLevel = prev.level;
            let newXpForNextLevel = prev.xpForNextLevel;
            while (newXp >= newXpForNextLevel) {
                newXp -= newXpForNextLevel;
                newLevel++;
                newXpForNextLevel = Math.floor(newXpForNextLevel * 1.5);
            }
            return { ...prev, xp: newXp, level: newLevel, xpForNextLevel: newXpForNextLevel };
        });
    };

    const initiateBuild = (buildingType: string) => {
        setGameState(prev => ({ ...prev, buildMode: { isActive: true, buildingType, isGhostFlipped: false }, selectedBuildingId: null }));
    };

    const placeBuilding = (buildingType: string, x: number, y: number) => {
        setGameState(prev => {
            if (!prev.buildMode.isActive || !prev.buildMode.buildingType) return prev;
            
            const buildingInfo = BUILDINGS.find(b => b.id === prev.buildMode.buildingType);
            if (!buildingInfo) return prev;
            
            if (!canAfford(buildingInfo.levels[0].cost)) return prev;

            const newResources = { ...prev.resources };
            for (const key in buildingInfo.levels[0].cost) {
                const resourceType = key as ResourceType;
                newResources[resourceType] -= buildingInfo.levels[0].cost[resourceType] || 0;
            }

            const newBuilding = {
                instanceId: `b${Date.now()}`,
                type: prev.buildMode.buildingType,
                x, y,
                width: buildingInfo.width,
                height: buildingInfo.height,
                level: 1,
                isFlipped: prev.buildMode.isGhostFlipped
            };

            const updatedBuildings = [...prev.buildings, newBuilding];
            
            let updatedQuest = prev.currentQuest;
            if (updatedQuest && updatedQuest.type === 'build' && updatedQuest.target === newBuilding.type) {
                updatedQuest = { ...updatedQuest, isCompleted: true };
            }

            if (prev.movingBuildingId) {
                const oldBuildingIndex = updatedBuildings.findIndex(b => b.instanceId === prev.movingBuildingId);
                if (oldBuildingIndex > -1) {
                    const oldBuilding = updatedBuildings[oldBuildingIndex];
                    newBuilding.level = oldBuilding.level;
                    updatedBuildings.splice(oldBuildingIndex, 1);
                }
            }

            return { 
                ...prev, 
                resources: newResources,
                buildings: updatedBuildings, 
                currentQuest: updatedQuest,
                buildMode: { isActive: false, buildingType: null, isGhostFlipped: false },
                movingBuildingId: null,
            };
        });
    };

    const cancelBuildMode = () => {
        setGameState(prev => {
            if (prev.movingBuildingId) {
                return { ...prev, movingBuildingId: null, buildMode: { isActive: false, buildingType: null, isGhostFlipped: false } };
            }
            return { ...prev, buildMode: { isActive: false, buildingType: null, isGhostFlipped: false }, movingBuildingId: null };
        });
    };
    
    const flipBuildGhost = () => {
        setGameState(prev => ({...prev, buildMode: {...prev.buildMode, isGhostFlipped: !prev.buildMode.isGhostFlipped }}));
    };
    
    const selectBuilding = (instanceId: string | null) => {
        setGameState(prev => ({...prev, selectedBuildingId: instanceId, buildMode: { isActive: false, buildingType: null, isGhostFlipped: false }}));
    };
    
    const deselectAll = () => {
      setGameState(prev => ({
          ...prev,
          selectedBuildingId: null,
          selectedPOI: null,
          buildMode: { isActive: false, buildingType: null, isGhostFlipped: false },
          movingBuildingId: null,
        }));
    };
    
    const openUpgradeModal = (instanceId: string) => {
        setGameState(prev => ({ ...prev, upgradeModalBuildingId: instanceId, selectedBuildingId: null }));
    };
    
    const closeUpgradeModal = () => {
        setGameState(prev => ({ ...prev, upgradeModalBuildingId: null }));
    };
    
    const upgradeBuilding = (instanceId: string) => {
        setGameState(prev => {
            const building = prev.buildings.find(b => b.instanceId === instanceId);
            if (!building) return prev;
            const buildingInfo = BUILDINGS.find(b => b.id === building.type);
            if (!buildingInfo) return prev;
            const nextLevel = building.level + 1;
            const nextLevelInfo = buildingInfo.levels[nextLevel - 1];
            
            if (!nextLevelInfo || !canAfford(nextLevelInfo.cost)) return prev;

            const newResources = { ...prev.resources };
            for (const key in nextLevelInfo.cost) {
                const resourceType = key as ResourceType;
                newResources[resourceType] -= nextLevelInfo.cost[resourceType] || 0;
            }

            const updatedBuildings = prev.buildings.map(b => 
                b.instanceId === instanceId ? { ...b, level: nextLevel } : b
            );
            
            addXp(50 * nextLevel);

            return { ...prev, buildings: updatedBuildings, resources: newResources };
        });
    };
    
    const rotateBuilding = (instanceId: string) => {
         setGameState(prev => {
            const updatedBuildings = prev.buildings.map(b => 
                b.instanceId === instanceId ? { ...b, isFlipped: !b.isFlipped } : b
            );
            return { ...prev, buildings: updatedBuildings, selectedBuildingId: null };
        });
    };

    const initiateMove = (instanceId: string) => {
         setGameState(prev => {
            const buildingToMove = prev.buildings.find(b => b.instanceId === instanceId);
            if (!buildingToMove) return prev;
            return {
                ...prev,
                movingBuildingId: instanceId,
                selectedBuildingId: null,
                buildMode: {
                    isActive: true,
                    buildingType: buildingToMove.type,
                    isGhostFlipped: buildingToMove.isFlipped,
                }
            };
        });
    };
    
    const assignNewQuest = () => {
        const availableQuests = QUESTS.filter(q => !gameState.buildings.some(b => b.type === q.target));
        if (availableQuests.length > 0) {
            setGameState(prev => ({...prev, currentQuest: availableQuests[Math.floor(Math.random() * availableQuests.length)]}));
        } else {
            setGameState(prev => ({...prev, currentQuest: null}));
        }
    };
    
    const claimQuestReward = () => {
        setGameState(prev => {
            if (prev.currentQuest && prev.currentQuest.isCompleted) {
                const newResources = { ...prev.resources };
                for (const key in prev.currentQuest.reward) {
                    const resourceType = key as ResourceType;
                    newResources[resourceType] = (newResources[resourceType] || 0) + (prev.currentQuest.reward[resourceType] || 0);
                }
                addXp(100);
                addNotification('success', 'Quest Complete!', `You received your reward for "${prev.currentQuest.title}".`);
                return { ...prev, currentQuest: null, resources: newResources };
            }
            return prev;
        });
    };
    
    const showResourceDenialTooltip = (cost: { [key in ResourceType]?: number }, position: { top: number, left: number }) => {
        setGameState(prev => ({...prev, resourceDenialTooltip: {cost, position}}));
    };

    const hideResourceDenialTooltip = () => {
        setGameState(prev => ({...prev, resourceDenialTooltip: null}));
    };

    const setHoveredExpansionDirection = (direction: 'top' | 'bottom' | 'left' | 'right' | null) => {
        setGameState(prev => ({...prev, hoveredExpansionDirection: direction}));
    };

    const expandWalls = (dir: 'top' | 'bottom' | 'left' | 'right') => {
        setGameState(prev => {
            if (!canAfford(WALL_EXPANSION_COST)) return prev;
            if (prev.wallConstructions.some(c => c.direction === dir)) return prev;
    
            const newResources = { ...prev.resources };
            for (const key in WALL_EXPANSION_COST) {
                const resourceType = key as ResourceType;
                newResources[resourceType] -= WALL_EXPANSION_COST[resourceType];
            }
    
            const constructionTime = 36 * 1000;
            const newConstruction = {
                direction: dir,
                completesAt: Date.now() + constructionTime,
            };
    
            return {
                ...prev,
                resources: newResources,
                wallConstructions: [...prev.wallConstructions, newConstruction],
            };
        });
    };
    
    const openMerchantShop = () => setGameState(prev => ({...prev, isMerchantShopOpen: true}));
    const closeMerchantShop = () => setGameState(prev => ({...prev, isMerchantShopOpen: false}));
    const purchaseFromMerchant = (item: any) => {
        if (spendResources(item.cost)) {
            addResources(item.reward);
        }
    };

    const openBarracksModal = (buildingId: string) => setGameState(prev => ({...prev, isBarracksModalOpen: true, barracksModalBuildingId: buildingId, selectedBuildingId: null}));
    const closeBarracksModal = () => setGameState(prev => ({...prev, isBarracksModalOpen: false, barracksModalBuildingId: null}));
    const trainTroops = (troopId: TroopType, quantity: number) => {
        const troopInfo = TROOPS.find(t => t.id === troopId);
        if (!troopInfo) return;

        const totalCost: { [key: string]: number } = {};
        for(const res in troopInfo.cost){
            totalCost[res] = (troopInfo.cost[res as ResourceType] || 0) * quantity;
        }

        if (spendResources(totalCost)) {
            const totalTime = troopInfo.trainingTime * quantity * 1000;
            const completesAt = Date.now() + totalTime;
            const queueItem = { troopId, quantity, totalTime, completesAt };
            setGameState(prev => ({ ...prev, trainingQueue: [...prev.trainingQueue, queueItem] }));
        }
    };
    
    const openWorldMap = () => setGameState(prev => ({ ...prev, currentView: 'world' }));
    const openCastleView = () => setGameState(prev => ({ ...prev, currentView: 'castle', selectedPOI: null }));
    const selectPOI = (poi: any) => setGameState(prev => ({ ...prev, selectedPOI: poi }));
    const setZoom = (newZoom: number | ((prev: number) => number)) => {
        setGameState(prev => ({...prev, zoom: Math.max(0.3, Math.min(2.0, typeof newZoom === 'function' ? newZoom(prev.zoom) : newZoom))}));
    };
    
    const prepareAttack = (target: any) => {
        setGameState(prev => ({
            ...prev,
            attackTarget: target,
            currentView: 'castle',
            attackPlan: createEmptyAttackPlan(),
            currentAttackWaveIndex: 0,
        }));
    };
    const cancelAttack = () => setGameState(prev => ({ ...prev, attackTarget: null, currentView: 'world' }));

    const worldGrid = useMemo(() => {
        const grid = Array(100).fill(null).map(() => Array(100).fill(0));
        gameState.worldMapPOIs.forEach((poi: any) => {
            const centerX = Math.round(poi.position.x);
            const centerY = Math.round(poi.position.y);
            const radius = 1;
            for (let r = -radius; r <= radius; r++) {
                for (let c = -radius; c <= radius; c++) {
                    const gridY = centerY + r;
                    const gridX = centerX + c;
                    if (gridY >= 0 && gridY < 100 && gridX >= 0 && gridX < 100) {
                        grid[gridY][gridX] = 1;
                    }
                }
            }
        });
        return grid;
    }, [gameState.worldMapPOIs]);

    const launchAttack = () => {
        setGameState(prev => {
            if (!prev.attackTarget) return prev;

            const playerCastle = prev.worldMapPOIs.find(p => p.isPlayer);
            if (!playerCastle) {
                console.error("Player castle not found, cannot launch attack.");
                return prev;
            }

            const startPosition = playerCastle.position;
            const endPosition = prev.attackTarget.position;

            const startNode = { x: Math.round(startPosition.x), y: Math.round(startPosition.y) };
            const endNode = { x: Math.round(endPosition.x), y: Math.round(endPosition.y) };

            const gridForPathfinding = JSON.parse(JSON.stringify(worldGrid));
            gridForPathfinding[startNode.y][startNode.x] = 0;
            gridForPathfinding[endNode.y][endNode.x] = 0;

            const path = findPath(gridForPathfinding, startNode, endNode);
            
            let durationInSeconds;
            if (path && path.length > 0) {
                const marchSpeed = 2; // seconds per grid unit
                durationInSeconds = path.length * marchSpeed;
            } else {
                console.warn("A* path not found, falling back to straight-line distance.");
                const dx = endPosition.x - startPosition.x;
                const dy = endPosition.y - startPosition.y;
                const distance = Math.sqrt(dx*dx + dy*dy);
                durationInSeconds = Math.max(120, distance * 2);
            }

            const startTime = Date.now();
            const arrivalTime = startTime + durationInSeconds * 1000;

            const newMarch = {
                id: `march-${startTime}`,
                type: 'attack',
                startPosition,
                endPosition,
                startTime,
                arrivalTime,
                attackPlan: prev.attackPlan,
                targetId: prev.attackTarget.id,
                path: path || undefined,
            };

            return {
                ...prev,
                attackTarget: null,
                currentView: 'world',
                marches: [...prev.marches, newMarch],
            };
        });
    };

    const setCurrentAttackWave = (index: number) => {
        if (index >= 0 && index < 4) {
            setGameState(prev => ({ ...prev, currentAttackWaveIndex: index }));
        }
    };
    
    const assignCommander = (waveIndex: number, flank: 'left' | 'front' | 'right', commanderId: string) => {
        setGameState(prev => {
            const newAttackPlan = [...prev.attackPlan];
            const wave = { ...newAttackPlan[waveIndex] };
            wave.commanders[flank] = commanderId;
            newAttackPlan[waveIndex] = wave;
            return { ...prev, attackPlan: newAttackPlan };
        });
    };

    const getAvailableTroopsForAttack = () => {
        const assignedTroops: { [key: string]: number } = {};
        gameState.attackPlan.forEach((wave: any) => {
            ['left', 'front', 'right'].forEach(flank => {
                ['melee', 'ranged'].forEach(slot => {
                    const armyInSlot = wave[flank][slot];
                    for (const troopId in armyInSlot) {
                        const type = troopId as TroopType;
                        assignedTroops[type] = (assignedTroops[type] || 0) + (armyInSlot[type] || 0);
                    }
                });
            });
        });

        const available: { [key: string]: number } = {};
        for (const troopId in gameState.troops) {
            const type = troopId as TroopType;
            available[type] = (gameState.troops[type] || 0) - (assignedTroops[type] || 0);
        }
        return available;
    };

    const addTroopsToAttackWave = (flank: 'left' | 'front' | 'right', slot: 'melee' | 'ranged', troopId: TroopType, quantity: number) => {
        setGameState(prev => {
            const newAttackPlan = [...prev.attackPlan];
            const wave = { ...newAttackPlan[prev.currentAttackWaveIndex] };
            const flankData = { ...wave[flank] };
            const slotData = { ...flankData[slot] };
            slotData[troopId] = (slotData[troopId] || 0) + quantity;
            flankData[slot] = slotData;
            wave[flank] = flankData;
            newAttackPlan[prev.currentAttackWaveIndex] = wave;
            return { ...prev, attackPlan: newAttackPlan };
        });
    };
    
    const autofillAttack = () => {
      const available = getAvailableTroopsForAttack();
      const newPlan = createEmptyAttackPlan();
      const wave = newPlan[0];
      
      for(const type in available) {
        const troopId = type as TroopType;
        const troopInfo = TROOPS.find(t => t.id === troopId);
        if (troopInfo) {
            wave.front[troopInfo.slot as 'melee' | 'ranged'][troopId] = available[troopId];
        }
      }
      setGameState(prev => ({ ...prev, attackPlan: newPlan }));
    };

    const saveAttackPreset = (name: string) => {
        const newPreset = { id: `preset-${Date.now()}`, name, plan: gameState.attackPlan };
        setGameState(prev => ({ ...prev, attackPresets: [...prev.attackPresets, newPreset] }));
    };

    const loadAttackPreset = (id: string) => {
        const preset = gameState.attackPresets.find(p => p.id === id);
        if (preset) {
            setGameState(prev => ({ ...prev, attackPlan: preset.plan }));
        }
    };
    
    const openWorkshopModal = (buildingId: string) => setGameState(prev => ({...prev, isWorkshopModalOpen: true, workshopModalBuildingId: buildingId, selectedBuildingId: null}));
    const closeWorkshopModal = () => setGameState(prev => ({...prev, isWorkshopModalOpen: false, workshopModalBuildingId: null}));
    
    const constructTools = (toolId: ToolType, quantity: number) => {
        const toolInfo = TOOLS.find(t => t.id === toolId);
        if (!toolInfo) return;

        const totalCost: { [key: string]: number } = {};
        for(const res in toolInfo.cost){
            totalCost[res] = (toolInfo.cost[res as ResourceType] || 0) * quantity;
        }

        if (spendResources(totalCost)) {
            const totalTime = toolInfo.constructionTime * quantity * 1000;
            const completesAt = Date.now() + totalTime;
            const queueItem = { toolId, quantity, totalTime, completesAt };
            setGameState(prev => ({ ...prev, workshopQueue: [...prev.workshopQueue, queueItem] }));
        }
    };

    const getAvailableToolsForAttack = () => {
        const assignedTools: { [key: string]: number } = {};
        gameState.attackPlan.forEach((wave: any) => {
           for (const toolId in wave.tools) {
                const type = toolId as ToolType;
                assignedTools[type] = (assignedTools[type] || 0) + (wave.tools[type] || 0);
            }
        });

        const available: { [key: string]: number } = {};
        for (const toolId in gameState.tools) {
            const type = toolId as ToolType;
            available[type] = (gameState.tools[type] || 0) - (assignedTools[type] || 0);
        }
        return available;
    };

     const addToolsToAttackWave = (toolId: ToolType, quantity: number) => {
        setGameState(prev => {
            const newAttackPlan = [...prev.attackPlan];
            const wave = { ...newAttackPlan[prev.currentAttackWaveIndex] };
            const tools = { ...wave.tools };
            tools[toolId] = (tools[toolId] || 0) + quantity;
            wave.tools = tools;
            newAttackPlan[prev.currentAttackWaveIndex] = wave;
            return { ...prev, attackPlan: newAttackPlan };
        });
    };
    
    const openMailModal = () => setGameState(prev => ({...prev, isMailModalOpen: true}));
    const closeMailModal = () => setGameState(prev => ({...prev, isMailModalOpen: false}));
    const markMessageAsRead = (messageId: string) => {
        setGameState(prev => ({
            ...prev,
            mail: prev.mail.map(m => m.id === messageId ? {...m, isRead: true} : m),
        }));
    };

    const initiateSpyMission = (targetId: string) => {
        const spyCost = { [ResourceType.Coins]: 100 };
        if (!spendResources(spyCost)) return;
        const mission = { targetId, completesAt: Date.now() + 30000 };
        setGameState(prev => ({...prev, spyMissions: [...prev.spyMissions, mission]}));
    };
    
    const sendChatMessage = async (message: string) => {
        const userMessage = { sender: 'user', text: message, timestamp: Date.now() };
        setGameState(prev => ({...prev, chatHistory: [...prev.chatHistory, userMessage]}));
        
        const aiResponseText = await generateChatResponse(gameState.chatHistory, message);
        
        const aiMessage = { sender: 'ai', text: aiResponseText, timestamp: Date.now() };
        setGameState(prev => ({...prev, chatHistory: [...prev.chatHistory, aiMessage]}));
    };

    const purchaseFromArmorer = (item: any) => {
      if (spendResources(item.cost)) {
        setGameState(prev => ({...prev, equipment: [...prev.equipment, item]}));
      }
    };
    const openArmorerModal = () => setGameState(prev => ({...prev, isArmorerModalOpen: true}));
    const closeArmorerModal = () => setGameState(prev => ({...prev, isArmorerModalOpen: false}));
    const openNomadEventModal = () => setGameState(prev => ({...prev, isNomadEventModalOpen: true}));
    const closeNomadEventModal = () => setGameState(prev => ({...prev, isNomadEventModalOpen: false}));
    const openBlacksmithModal = () => setGameState(prev => ({...prev, isBlacksmithModalOpen: true}));
    const closeBlacksmithModal = () => setGameState(prev => ({...prev, isBlacksmithModalOpen: false}));
    const openEquipmentTraderModal = () => setGameState(prev => ({...prev, isEquipmentTraderModalOpen: true}));
    const closeEquipmentTraderModal = () => setGameState(prev => ({...prev, isEquipmentTraderModalOpen: false}));
    const openWheelOfAffluenceModal = () => setGameState(prev => ({...prev, isWheelOfAffluenceModalOpen: true}));
    const closeWheelOfAffluenceModal = () => setGameState(prev => ({...prev, isWheelOfAffluenceModalOpen: false}));
    
    const toggleBlueprintMode = () => setGameState(prev => ({...prev, isBlueprintMode: !prev.isBlueprintMode}));

    const centerMapOnPlayerCastle = () => {
        const playerCastle = gameState.worldMapPOIs.find((poi: any) => poi.isPlayer);
        if(playerCastle) {
            setGameState(prev => ({...prev, mapCenterTarget: playerCastle.position }));
        }
    };

    const resetMapCenterTarget = () => {
        setGameState(prev => ({...prev, mapCenterTarget: null}));
    };

    const toggleWorldInfoPanel = () => setGameState(prev => ({...prev, isWorldInfoPanelOpen: !prev.isWorldInfoPanelOpen}));
    
    const centerMapOnCoordinates = (position: { x: number, y: number }) => {
        setGameState(prev => ({...prev, mapCenterTarget: position }));
    };

    const addBookmark = (poi: any) => {
        setGameState(prev => {
            if (prev.bookmarks.some((b: any) => b.id === poi.id)) return prev;
            const newBookmark = {
                id: poi.id,
                name: poi.ownerName,
                position: poi.position
            };
            return { ...prev, bookmarks: [...prev.bookmarks, newBookmark] };
        });
    };

    const removeBookmark = (poiId: string) => {
        setGameState(prev => ({
            ...prev,
            bookmarks: prev.bookmarks.filter((b: any) => b.id !== poiId)
        }));
    };

    const claimNomadMilestone = (milestoneIndex: number) => {
        setGameState(prev => {
            const milestone = NOMAD_EVENT_DATA.milestones[milestoneIndex];
            if (!milestone || prev.nomadEvent.claimedMilestoneIndices.includes(milestoneIndex) || prev.nomadEvent.points < milestone.points) {
                return prev;
            }
            addResources(milestone.rewards);
            addNotification('success', 'Milestone Reward Claimed!', `You received your reward for reaching ${milestone.points} points.`);
            return {
                ...prev,
                nomadEvent: {
                    ...prev.nomadEvent,
                    claimedMilestoneIndices: [...prev.nomadEvent.claimedMilestoneIndices, milestoneIndex]
                }
            };
        });
    };

    const purchaseNomadResourcePack = (item: EventShopItem) => {
        if (spendResources(item.cost)) {
            addResources(item.reward);
            addNotification('success', 'Item Purchased!', `You purchased ${item.name} from the event shop.`);
        }
    };


    useEffect(() => {
        const gameTick = setInterval(() => {
            setGameState(prev => {
                if (!prev.currentUser) return prev; 
                const now = Date.now();
                let hasChanges = false;
                let newState = { ...prev };

                const newResources = { ...newState.resources };
                newState.buildings.forEach(b => {
                    const bInfo = BUILDINGS.find(bi => bi.id === b.type);
                    if (bInfo) {
                        const levelInfo = bInfo.levels[b.level - 1];
                        if (levelInfo && 'production' in levelInfo && levelInfo.production && 'productionInterval' in levelInfo && levelInfo.productionInterval && levelInfo.productionInterval > 0) {
                            for (const res in levelInfo.production) {
                                const resType = res as ResourceType;
                                const amount = (levelInfo.production[resType] || 0) / levelInfo.productionInterval;
                                newResources[resType] = (newResources[resType] || 0) + amount;
                            }
                        }
                    }
                });
                newState.resources = newResources;

                const finishedTroops = newState.trainingQueue.filter(item => item.completesAt <= now);
                if (finishedTroops.length > 0) {
                    hasChanges = true;
                    const ongoingTroops = newState.trainingQueue.filter(item => item.completesAt > now);
                    const newTroops = { ...newState.troops };
                    finishedTroops.forEach(item => {
                        newTroops[item.troopId] = (newTroops[item.troopId] || 0) + item.quantity;
                        addNotification('success', 'Troops Ready', `${item.quantity} ${TROOPS.find(t => t.id === item.troopId)?.name} have completed training.`);
                    });
                    newState.trainingQueue = ongoingTroops;
                    newState.troops = newTroops;
                }

                const finishedTools = newState.workshopQueue.filter(item => item.completesAt <= now);
                if (finishedTools.length > 0) {
                    hasChanges = true;
                    const ongoingTools = newState.workshopQueue.filter(item => item.completesAt > now);
                    const newTools = { ...newState.tools };
                    finishedTools.forEach(item => {
                        newTools[item.toolId] = (newTools[item.toolId] || 0) + item.quantity;
                        addNotification('info', 'Tools Constructed', `${item.quantity} ${TOOLS.find(t => t.id === item.toolId)?.name} are ready for use.`);
                    });
                    newState.workshopQueue = ongoingTools;
                    newState.tools = newTools;
                }

                const finishedMissions = newState.spyMissions.filter(m => m.completesAt <= now);
                if (finishedMissions.length > 0) {
                    hasChanges = true;
                    const ongoingMissions = newState.spyMissions.filter(m => m.completesAt > now);
                    finishedMissions.forEach(async mission => {
                        const target = newState.worldMapPOIs.find(p => p.id === mission.targetId);
                        if (!target) return;
                        
                        const wasSuccessful = Math.random() > 0.3;
                        const spyReportData = {
                            targetId: target.id,
                            targetName: target.ownerName,
                            wasSuccessful: wasSuccessful,
                            estimatedArmy: wasSuccessful ? target.army : undefined,
                            revealedDefenses: wasSuccessful ? target.defenseBonuses : undefined,
                        };
                        const narrative = await generateSpyReport(spyReportData);
                        const mail = {
                            id: `mail-${now}-${mission.targetId}`, type: 'spy_report',
                            subject: `Spy Report from ${target.ownerName}`, timestamp: now, isRead: false,
                            content: { ...spyReportData, narrative, reportId: `spy-${now}` },
                        };
                        setGameState(current => ({...current, mail: [...current.mail, mail]}));
                    });
                    newState.spyMissions = ongoingMissions;
                }

                const respawnedPOIs = newState.worldMapPOIs.map(poi => {
                    if (poi.isBurnt && poi.respawnsAt && now >= poi.respawnsAt) {
                        hasChanges = true;
                        const level = poi.level;
                        const newPoi = { ...poi, isBurnt: false, army: { [TroopType.Swordsman]: 50 + level * 5, [TroopType.Archer]: 30 + level * 4 } };
                        delete newPoi.respawnsAt;
                        return newPoi;
                    }
                    return poi;
                });
                newState.worldMapPOIs = respawnedPOIs;
                
                const completedConstructions = newState.wallConstructions.filter(c => c.completesAt <= now);
                if (completedConstructions.length > 0) {
                    hasChanges = true;
                    const ongoingConstructions = newState.wallConstructions.filter(c => c.completesAt > now);
                    let newBounds = { ...newState.wallBounds };
                    let newCounts = { ...newState.wallExpansionCount };
                    completedConstructions.forEach(construction => {
                        const dir = construction.direction;
                        if (dir === 'top') newBounds.y1 -= 2;
                        if (dir === 'bottom') newBounds.y2 += 2;
                        if (dir === 'left') newBounds.x1 -= 2;
                        if (dir === 'right') newBounds.x2 += 2;
                        newCounts[dir]++;
                    });
                    newState.wallBounds = newBounds;
                    newState.wallExpansionCount = newCounts;
                    newState.wallConstructions = ongoingConstructions;
                }

                return hasChanges ? newState : prev;
            });
        }, 1000);

        const marchCheck = setInterval(() => {
            setGameState(prev => {
                if (!prev.currentUser) return prev;
                const now = Date.now();
                const completedMarches = prev.marches.filter(m => now >= m.arrivalTime);
                if (completedMarches.length === 0) return prev;
    
                let cumulativeState = { ...prev };
    
                completedMarches.forEach(async march => {
                    const targetPOI = cumulativeState.worldMapPOIs.find(p => p.id === march.targetId);
                    if (!targetPOI) return;
    
                    const battleResult = await resolveBattle(march.attackPlan, targetPOI, cumulativeState.troops, cumulativeState.tools);
                    const { finalAttackerArmy, finalAttackerTools, finalDefenderPOI, report } = battleResult;
    
                    const reportText = await generateCombatReport(
                        march.attackPlan.reduce((acc: any, wave: any) => {
                            const waveArmy = combineArmies(combineArmies(wave.left.melee, wave.left.ranged), combineArmies(combineArmies(wave.front.melee, wave.front.ranged), combineArmies(wave.right.melee, wave.right.ranged)));
                            return combineArmies(acc, waveArmy);
                        }, {}),
                        targetPOI.army,
                        report.isVictory ? 'Victory' : 'Defeat',
                        report.loot
                    );
    
                    const combatMail = {
                        id: `mail-${now}-${march.id}`, type: 'combat_report',
                        subject: `Battle: ${report.isVictory ? 'Victory' : 'Defeat'} at ${targetPOI.ownerName}`,
                        timestamp: now, isRead: false,
                        content: { ...report, reportText },
                    };

                    let newNomadEventState = { ...cumulativeState.nomadEvent };
                    const newResources = { ...cumulativeState.resources };
    
                    if (report.eventGains) {
                        const { points, horns } = report.eventGains;
                        newNomadEventState.points += points;
                        newResources[ResourceType.NomadHorns] = (newResources[ResourceType.NomadHorns] || 0) + horns;
                    }

                    for (const res in report.loot) {
                        newResources[res as ResourceType] = (newResources[res as ResourceType] || 0) + report.loot[res as ResourceType];
                    }

                    const updatedPOIs = cumulativeState.worldMapPOIs.map(p => p.id === finalDefenderPOI.id ? finalDefenderPOI : p);
    
                    cumulativeState = {
                        ...cumulativeState,
                        troops: finalAttackerArmy,
                        tools: finalAttackerTools,
                        worldMapPOIs: updatedPOIs,
                        resources: newResources,
                        nomadEvent: newNomadEventState,
                        mail: [...cumulativeState.mail, combatMail],
                        marches: cumulativeState.marches.filter(m => m.id !== march.id)
                    };
                });
                return cumulativeState;
            });
        }, 1000);

        return () => {
            clearInterval(gameTick);
            clearInterval(marchCheck);
        };
    }, [gameState.currentUser]);

    const value = {
        gameState,
        login,
        signup,
        logout,
        addResources,
        spendResources,
        canAfford,
        addXp,
        initiateBuild,
        initiateMove,
        placeBuilding,
        cancelBuildMode,
        assignNewQuest,
        claimQuestReward,
        expandWalls,
        selectBuilding,
        deselectAll,
        upgradeBuilding,
        rotateBuilding,
        openUpgradeModal,
        closeUpgradeModal,
        openMerchantShop,
        closeMerchantShop,
        purchaseFromMerchant,
        flipBuildGhost,
        trainTroops,
        openBarracksModal,
        closeBarracksModal,
        openWorldMap,
        openCastleView,
        selectPOI,
        setZoom,
        setCurrentAttackWave,
        addTroopsToAttackWave,
        getAvailableTroopsForAttack,
        autofillAttack,
        prepareAttack,
        launchAttack,
        cancelAttack,
        assignCommander,
        addToolsToAttackWave,
        getAvailableToolsForAttack,
        constructTools,
        openWorkshopModal,
        closeWorkshopModal,
        saveAttackPreset,
        loadAttackPreset,
        initiateSpyMission,
        openMailModal,
        closeMailModal,
        markMessageAsRead,
        sendChatMessage,
        purchaseFromArmorer,
        openArmorerModal,
        closeArmorerModal,
        openNomadEventModal,
        closeNomadEventModal,
        openBlacksmithModal,
        closeBlacksmithModal,
        openEquipmentTraderModal,
        closeEquipmentTraderModal,
        openWheelOfAffluenceModal,
        closeWheelOfAffluenceModal,
        toggleBlueprintMode,
        centerMapOnPlayerCastle,
        resetMapCenterTarget,
        toggleWorldInfoPanel,
        centerMapOnCoordinates,
        addBookmark,
        removeBookmark,
        showResourceDenialTooltip,
        hideResourceDenialTooltip,
        setHoveredExpansionDirection,
        addNotification,
        removeNotification,
        claimDailyReward,
        claimNomadMilestone,
        purchaseNomadResourcePack,
    };

    return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};

function combineArmies(army1: { [key: string]: number }, army2: { [key: string]: number }) {
    const combined = { ...army1 };
    for (const troopType in army2) {
        const type = troopType as TroopType;
        combined[type] = (combined[type] || 0) + (army2[type] || 0);
    }
    return combined;
};