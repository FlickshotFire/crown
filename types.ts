

// --- Enums / String Literal Types ---

export type ResourceType = 'Wood' | 'Stone' | 'Coins' | 'Population' | 'Rubies' | 'Food' | 'Meat' | 'Iron' | 'Gems' | 'Copper' | 'Silver' | 'NomadHorns';
export const ResourceType = {
  Wood: 'Wood' as ResourceType,
  Stone: 'Stone' as ResourceType,
  Coins: 'Coins' as ResourceType,
  Population: 'Population' as ResourceType,
  Rubies: 'Rubies' as ResourceType,
  Food: 'Food' as ResourceType,
  Meat: 'Meat' as ResourceType,
  Iron: 'Iron' as ResourceType,
  Gems: 'Gems' as ResourceType,
  Copper: 'Copper' as ResourceType,
  Silver: 'Silver' as ResourceType,
  NomadHorns: 'NomadHorns' as ResourceType,
};

export type BuildingCategory = 'civil' | 'military' | 'economy' | 'decoration';
export const BuildingCategory = {
  Civil: 'civil' as BuildingCategory,
  Military: 'military' as BuildingCategory,
  Economy: 'economy' as BuildingCategory,
  Decoration: 'decoration' as BuildingCategory,
};

export type TroopType = 'swordsman' | 'archer' | 'spearman' | 'crossbowman';
export const TroopType = {
  Swordsman: 'swordsman' as TroopType,
  Archer: 'archer' as TroopType,
  Spearman: 'spearman' as TroopType,
  Crossbowman: 'crossbowman' as TroopType,
};

export type ToolType = 'shield_wall' | 'mantlet' | 'battering_ram';
export const ToolType = {
    ShieldWall: 'shield_wall' as ToolType,
    Mantlet: 'mantlet' as ToolType,
    BatteringRam: 'battering_ram' as ToolType,
};

export type POIType = 'player_castle' | 'barbarian_camp' | 'resource_stone' | 'cultist_tower';
export const POIType = {
    PlayerCastle: 'player_castle' as POIType,
    BarbarianCamp: 'barbarian_camp' as POIType,
    ResourceStone: 'resource_stone' as POIType,
    CultistTower: 'cultist_tower' as POIType,
};


// --- Interfaces ---

export type Resources = {
    [key in ResourceType]?: number;
};

export interface BuildingLevel {
    cost: Resources;
    production?: { [key in ResourceType]?: number };
    productionInterval?: number;
    populationIncrease?: number;
}

export interface Building {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    width: number;
    height: number;
    category: BuildingCategory;
    levels: BuildingLevel[];
    visualWidth?: number;
    visualHeight?: number;
}

export interface BuildingInstance {
    instanceId: string;
    type: string; // Corresponds to Building['id']
    x: number;
    y: number;
    width: number;
    height: number;
    level: number;
    isFlipped: boolean;
}

export interface Commander {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    bonus: { type: string; value: number };
}

export interface ChatMessage {
    sender: 'user' | 'ai' | 'system';
    text: string;
    timestamp: number;
}

export type Army = { [key in TroopType]?: number };

export interface CombatReport {
    isVictory: boolean;
    reportText: string;
    attackerLosses: Army;
    defenderLosses: Army;
    loot: Resources;
    eventGains?: { points: number, horns: number };
}

export interface SpyReport {
    targetId: string;
    targetName: string;
    wasSuccessful: boolean;
    narrative: string;
    estimatedArmy?: Army;
    estimatedResources?: Resources;
    revealedDefenses?: { wall: number; gate: number; moat: number };
}

export interface MailMessage {
    id: string;
    type: 'combat_report' | 'spy_report' | 'system_message';
    subject: string;
    timestamp: number;
    isRead: boolean;
    content: CombatReport | SpyReport | { text: string };
}

export interface March {
    id: string;
    type: 'attack' | 'scout';
    startPosition: { x: number; y: number };
    endPosition: { x: number; y: number };
    startTime: number;
    arrivalTime: number;
    attackPlan: any; // Simplified for now
    targetId: string;
    path?: Array<{ x: number; y: number }>;
}

export interface WorldMapPOI {
    id: string;
    type: POIType;
    ownerName: string;
    allianceName?: string;
    level: number;
    position: { x: number; y: number };
    army: Army;
    icon: React.ReactNode;
    isPlayer?: boolean;
    isPlayerName?: boolean;
    defenseBonuses: { wall: number; gate: number; moat: number };
    flagColor?: 'red' | 'black';
    hasBirds?: boolean;
    isBurnt?: boolean;
    respawnsAt?: number;
}


// --- New Types for UI Features ---

export interface DailyReward {
    day: number;
    reward: Resources;
}

export interface LeaderboardPlayer {
    id: string;
    name: string;
    allianceName: string;
    level: number;
    honor: number;
    power: number;
    isCurrentUser?: boolean;
}

export interface Notification {
    id: number;
    type: 'success' | 'info' | 'error' | 'warning';
    title: string;
    message: string;
}

// --- New Types for Nomad Event ---
export interface EventMilestone {
  points: number;
  rewards: Resources;
}

export interface EventShopItem {
  id: string;
  name: string;
  description: string;
  cost: Resources;
  reward: Resources & { buildingId?: string };
  icon: React.ReactNode;
}

export interface NomadEventData {
  title: string;
  description: string;
  milestones: EventMilestone[];
  shopItems: EventShopItem[];
}

export interface NomadEventState {
    points: number;
    claimedMilestoneIndices: number[];
}