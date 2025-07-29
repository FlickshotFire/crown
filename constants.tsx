




import React from 'react';
import { ResourceType, TroopType, POIType, ToolType, BuildingCategory, LeaderboardPlayer, NomadEventData } from './types';
import { ICONS } from './assets';

export const GRID_COLS = 80;
export const GRID_ROWS = 80;

export const WALL_EXPANSION_COST = { [ResourceType.Wood]: 2500, [ResourceType.Stone]: 500 };

// New capacity constants for the attack view
export const FLANK_CAPACITY = (level) => ({
    melee: 20 + level * 2,
    ranged: 10 + level,
});
export const FRONT_CAPACITY = (level) => ({
    melee: 40 + level * 5,
    ranged: 20 + level * 2,
});

export const COMMANDERS = [
    {
        id: 'cmdr_1',
        name: 'The Berserker',
        description: 'A furious warrior who inspires melee troops to fight with savage intensity.',
        icon: ICONS.CommanderIcons.Berserker(),
        bonus: { type: 'attack_melee', value: 10 }, // 10% melee attack bonus
    },
    {
        id: 'cmdr_2',
        name: 'The Hawkeye',
        description: 'A master marksman whose presence sharpens the aim of all ranged units.',
        icon: ICONS.CommanderIcons.Hawkeye(),
        bonus: { type: 'attack_ranged', value: 15 }, // 15% ranged attack bonus
    },
    {
        id: 'cmdr_3',
        name: 'The Bulwark',
        description: 'A defensive titan, enabling melee troops to withstand devastating blows.',
        icon: ICONS.CommanderIcons.Bulwark(),
        bonus: { type: 'defense_melee', value: 20 }, // 20% melee defense bonus
    }
];

export const INITIAL_ATTACK_PRESETS = [
    {
        id: 'preset_default',
        name: 'Default Preset',
        plan: [], // Empty plan, to be filled by player
    }
];


export const BUILDINGS = [
  {
    id: 'farm',
    name: 'Farmhouse',
    description: 'A quaint farmhouse that produces Food for your growing empire.',
    icon: ICONS.BuildingIcons.Farm(),
    width: 4,
    height: 4,
    visualWidth: 160,
    visualHeight: 140,
    category: BuildingCategory.Economy,
    levels: [
        { cost: { [ResourceType.Wood]: 75, [ResourceType.Stone]: 30 }, production: {[ResourceType.Food]: 10}, productionInterval: 10 },
        { cost: { [ResourceType.Wood]: 200, [ResourceType.Stone]: 120 }, production: {[ResourceType.Food]: 22}, productionInterval: 10 },
        { cost: { [ResourceType.Wood]: 500, [ResourceType.Stone]: 350 }, production: {[ResourceType.Food]: 40}, productionInterval: 10 },
    ],
  },
  {
    id: 'lumber_mill',
    name: 'Sawmill',
    description: 'Increases the productivity of all woodcutters and forest lodges in the castle',
    icon: ICONS.BuildingIcons.LumberMill(),
    width: 4,
    height: 3,
    visualWidth: 180,
    visualHeight: 160,
    category: BuildingCategory.Economy,
    levels: [
        { cost: { [ResourceType.Wood]: 30, [ResourceType.Coins]: 100 }, production: {[ResourceType.Wood]: 5}, productionInterval: 10 },
        { cost: { [ResourceType.Wood]: 100, [ResourceType.Coins]: 250 }, production: {[ResourceType.Wood]: 12}, productionInterval: 10 },
    ]
  },
  {
    id: 'quarry',
    name: 'Stone Quarry',
    description: 'This specialized quarry extracts high-quality stone.',
    icon: ICONS.BuildingIcons.Quarry(),
    width: 4,
    height: 4,
    visualWidth: 170,
    visualHeight: 150,
    category: BuildingCategory.Economy,
    levels: [
        { cost: { [ResourceType.Wood]: 80, [ResourceType.Coins]: 150 }, production: {[ResourceType.Stone]: 3}, productionInterval: 10 },
        { cost: { [ResourceType.Wood]: 250, [ResourceType.Coins]: 400 }, production: {[ResourceType.Stone]: 8}, productionInterval: 10 },
    ]
  },
   {
    id: 'gold_mine',
    name: 'Gold Mine',
    description: 'Generates coins for your treasury.',
    icon: ICONS.BuildingIcons.GoldMine(),
    width: 4,
    height: 4,
    visualWidth: 160,
    visualHeight: 160,
    category: BuildingCategory.Economy,
    levels: [
        { cost: { [ResourceType.Wood]: 250, [ResourceType.Stone]: 300 }, production: {[ResourceType.Coins]: 2}, productionInterval: 5 },
        { cost: { [ResourceType.Wood]: 600, [ResourceType.Stone]: 700 }, production: {[ResourceType.Coins]: 5}, productionInterval: 5 },
    ]
  },
   {
    id: 'house',
    name: 'Dwelling',
    description: 'Increases population and tax revenue, decreases public order',
    icon: ICONS.BuildingIcons.House(),
    width: 3,
    height: 3,
    visualWidth: 150,
    visualHeight: 150,
    category: BuildingCategory.Civil,
    levels: [
        { cost: { [ResourceType.Wood]: 80, [ResourceType.Stone]: 60 }, populationIncrease: 15 },
        { cost: { [ResourceType.Wood]: 240, [ResourceType.Stone]: 180 }, populationIncrease: 25 },
    ]
  },
  {
    id: 'wall',
    name: 'Stone Wall',
    description: 'A sturdy section of wall to fortify your castle.',
    icon: ICONS.BuildingIcons.Wall(),
    width: 1,
    height: 1,
    category: BuildingCategory.Military,
    levels: [
        { cost: { [ResourceType.Stone]: 25 } },
    ]
  },
  {
    id: 'barracks',
    name: 'Barracks',
    description: 'This is where soldiers are recruited.',
    icon: ICONS.BuildingIcons.Barracks(),
    width: 5,
    height: 5,
    visualWidth: 220,
    visualHeight: 200,
    category: BuildingCategory.Military,
    levels: [
        { cost: { [ResourceType.Wood]: 200, [ResourceType.Stone]: 150, [ResourceType.Coins]: 500 } },
        { cost: { [ResourceType.Wood]: 500, [ResourceType.Stone]: 400, [ResourceType.Coins]: 1000 } },
    ]
  },
  {
    id: 'bakery',
    name: 'Bakery',
    description: 'Reduces food consumption of all soldiers stationed here.',
    icon: ICONS.BuildingIcons.Bakery(),
    width: 3,
    height: 3,
    visualWidth: 160,
    visualHeight: 140,
    category: BuildingCategory.Economy,
    levels: [
      { cost: { [ResourceType.Wood]: 450, [ResourceType.Stone]: 300 } },
    ],
  },
  {
    id: 'tavern',
    name: 'Tavern',
    description: 'Increases the number of agents you can deploy.',
    icon: ICONS.BuildingIcons.Tavern(),
    width: 4,
    height: 4,
    visualWidth: 170,
    visualHeight: 170,
    category: BuildingCategory.Civil,
    levels: [
      { cost: { [ResourceType.Wood]: 600, [ResourceType.Stone]: 200 }, populationIncrease: 30, production: { [ResourceType.Coins]: 5 }, productionInterval: 60 },
    ],
  },
   {
    id: 'keep',
    name: 'Keep',
    description: 'The heart of your castle.',
    icon: ICONS.BuildingIcons.Keep(),
    width: 6,
    height: 6,
    visualWidth: 250,
    visualHeight: 250,
    category: BuildingCategory.Civil, // Does not appear in menu, but for completeness
    levels: [
        { cost: {} },
    ]
  },
   {
    id: 'hut',
    name: 'Hut',
    description: 'A simple dwelling.',
    icon: ICONS.BuildingIcons.Hut(),
    width: 3,
    height: 3,
    visualWidth: 120,
    visualHeight: 100,
    category: BuildingCategory.Civil,
    levels: [
        { cost: { [ResourceType.Wood]: 10 } },
    ]
  },
  {
    id: 'tools_workshop',
    name: 'Siege workshop',
    description: 'Siege tools are produced here.',
    icon: ICONS.BuildingIcons.ToolsWorkshop(),
    width: 4,
    height: 4,
    visualWidth: 160,
    visualHeight: 150,
    category: BuildingCategory.Military,
    levels: [
        { cost: { [ResourceType.Wood]: 300, [ResourceType.Stone]: 250 } },
        { cost: { [ResourceType.Wood]: 700, [ResourceType.Stone]: 600 } },
    ],
  },
  {
    id: 'rookery',
    name: 'Rookery',
    description: 'Houses messenger ravens, allowing you to recruit and manage more spies.',
    icon: ICONS.BuildingIcons.Rookery(),
    width: 3,
    height: 3,
    visualWidth: 140,
    visualHeight: 160,
    category: BuildingCategory.Military,
    levels: [
        { cost: { [ResourceType.Wood]: 400, [ResourceType.Stone]: 400, [ResourceType.Coins]: 1000 } }, // Level 1
        { cost: { [ResourceType.Wood]: 800, [ResourceType.Stone]: 800, [ResourceType.Coins]: 2500 } }, // Level 2
    ],
  },
  {
    id: 'townhouse',
    name: 'Townhouse',
    description: 'An upscale residence that significantly boosts your population capacity.',
    icon: ICONS.BuildingIcons.Townhouse(),
    width: 3,
    height: 3,
    visualWidth: 150,
    visualHeight: 150,
    category: BuildingCategory.Civil,
    levels: [
      { cost: { [ResourceType.Wood]: 500, [ResourceType.Stone]: 700 }, populationIncrease: 50 },
      { cost: { [ResourceType.Wood]: 1200, [ResourceType.Stone]: 1500 }, populationIncrease: 80 },
    ],
  },
  {
    id: 'master_builder',
    name: 'Master Builder',
    description: "The workshop of the Master Builder, who oversees all construction. (Decorative)",
    icon: ICONS.BuildingIcons.MasterBuilder(),
    width: 4,
    height: 4,
    visualWidth: 160,
    visualHeight: 150,
    category: BuildingCategory.Civil,
    levels: [
      { cost: { [ResourceType.Coins]: 5000, [ResourceType.Rubies]: 20 } },
    ],
  },
  {
    id: 'forest_lodge',
    name: 'Forest Lodge',
    description: 'A rustic lodge that provides a steady, if small, supply of wood.',
    icon: ICONS.BuildingIcons.ForestLodge(),
    width: 3,
    height: 3,
    visualWidth: 150,
    visualHeight: 160,
    category: BuildingCategory.Economy,
    levels: [
      { cost: { [ResourceType.Wood]: 400, [ResourceType.Stone]: 100 }, production: { [ResourceType.Wood]: 15 }, productionInterval: 10 },
    ],
  },
  {
    id: 'granary',
    name: 'Granary',
    description: 'A large storehouse that passively increases food production across your farms.',
    icon: ICONS.BuildingIcons.Granary(),
    width: 4,
    height: 4,
    visualWidth: 180,
    visualHeight: 160,
    category: BuildingCategory.Economy,
    levels: [
      { cost: { [ResourceType.Wood]: 1000, [ResourceType.Stone]: 800 }, production: { [ResourceType.Food]: 50 }, productionInterval: 60 },
    ],
  },
  {
    id: 'hunting_lodge',
    name: 'Hunting Lodge',
    description: 'Hunters from this lodge bring back meat to feed your army.',
    icon: ICONS.BuildingIcons.HuntingLodge(),
    width: 3,
    height: 3,
    visualWidth: 160,
    visualHeight: 140,
    category: BuildingCategory.Economy,
    levels: [
      { cost: { [ResourceType.Wood]: 600, [ResourceType.Stone]: 200 }, production: { [ResourceType.Meat]: 5 }, productionInterval: 20 },
    ],
  },
  {
    id: 'imperial_council_hall',
    name: 'Imperial Council Hall',
    description: 'A grand hall for your advisors. Increases gold income.',
    icon: ICONS.BuildingIcons.ImperialCouncilHall(),
    width: 5,
    height: 5,
    visualWidth: 230,
    visualHeight: 210,
    category: BuildingCategory.Civil,
    levels: [
      { cost: { [ResourceType.Wood]: 2000, [ResourceType.Stone]: 2000, [ResourceType.Coins]: 10000 }, production: { [ResourceType.Coins]: 20 }, productionInterval: 60 },
    ],
  },
  {
    id: 'reinforced_vault',
    name: 'Reinforced Vault',
    description: 'A secure vault to protect a portion of your resources from plunder. (Decorative)',
    icon: ICONS.BuildingIcons.ReinforcedVault(),
    width: 4,
    height: 4,
    visualWidth: 170,
    visualHeight: 150,
    category: BuildingCategory.Economy,
    levels: [
      { cost: { [ResourceType.Stone]: 3000, [ResourceType.Coins]: 5000 } },
    ],
  },
  {
    id: 'iron_mine',
    name: 'Iron Mine',
    description: 'Establishes a mine to extract raw iron ore.',
    icon: ICONS.BuildingIcons.IronMine(),
    width: 4,
    height: 4,
    visualWidth: 160,
    visualHeight: 140,
    category: BuildingCategory.Economy,
    levels: [
      { cost: { [ResourceType.Wood]: 800, [ResourceType.Stone]: 1200 }, production: { [ResourceType.Iron]: 4 }, productionInterval: 15 },
    ],
  },
  {
    id: 'ironworks',
    name: 'Ironworks',
    description: 'Refines iron ore into usable ingots.',
    icon: ICONS.BuildingIcons.Ironworks(),
    width: 3,
    height: 4,
    visualWidth: 170,
    visualHeight: 160,
    category: BuildingCategory.Economy,
    levels: [
      { cost: { [ResourceType.Wood]: 1000, [ResourceType.Stone]: 1500 }, production: { [ResourceType.Iron]: 10 }, productionInterval: 20 },
    ],
  },
  {
    id: 'moo_manor',
    name: 'Moo Manor',
    description: 'This delightful manor is surprisingly efficient at producing meat.',
    icon: ICONS.BuildingIcons.MooManor(),
    width: 4,
    height: 4,
    visualWidth: 180,
    visualHeight: 170,
    category: BuildingCategory.Economy,
    levels: [
      { cost: { [ResourceType.Coins]: 2500, [ResourceType.Food]: 1000 }, production: { [ResourceType.Meat]: 10 }, productionInterval: 15 },
    ],
  },
  {
    id: 'relic_woodcutter',
    name: 'Relic Woodcutter',
    description: 'An ancient, efficient woodcutting facility.',
    icon: ICONS.BuildingIcons.RelicWoodcutter(),
    width: 3,
    height: 3,
    visualWidth: 150,
    visualHeight: 150,
    category: BuildingCategory.Economy,
    levels: [
      { cost: { [ResourceType.Coins]: 12000 }, production: { [ResourceType.Wood]: 40 }, productionInterval: 10 },
    ],
  },
  {
    id: 'stoneworks',
    name: 'Stoneworks',
    description: 'Advanced masons who are experts at dressing stone for construction.',
    icon: ICONS.BuildingIcons.Stoneworks(),
    width: 4,
    height: 3,
    visualWidth: 180,
    visualHeight: 160,
    category: BuildingCategory.Economy,
    levels: [
      { cost: { [ResourceType.Wood]: 1200, [ResourceType.Stone]: 800 }, production: { [ResourceType.Stone]: 25 }, productionInterval: 15 },
    ],
  },
  {
    id: 'defense_workshop',
    name: 'Defense Workshop',
    description: 'Constructs defensive tools to protect your castle walls.',
    icon: ICONS.BuildingIcons.DefenseWorkshop(),
    width: 4,
    height: 4,
    visualWidth: 170,
    visualHeight: 160,
    category: BuildingCategory.Military,
    levels: [
      { cost: { [ResourceType.Wood]: 400, [ResourceType.Stone]: 600 } },
    ],
  },
  {
    id: 'dragon_breath_forge',
    name: 'Dragon Breath Forge',
    description: 'A legendary forge that channels dragon fire to craft superior weapons. (Decorative)',
    icon: ICONS.BuildingIcons.DragonBreathForge(),
    width: 4,
    height: 5,
    visualWidth: 200,
    visualHeight: 220,
    category: BuildingCategory.Military,
    levels: [
      { cost: { [ResourceType.Rubies]: 200 } },
    ],
  },
  {
    id: 'dragon_hoard',
    name: 'Dragon Hoard',
    description: 'A massive pile of treasure that generates significant coins. (Decorative)',
    icon: ICONS.BuildingIcons.DragonHoard(),
    width: 5,
    height: 5,
    visualWidth: 240,
    visualHeight: 180,
    category: BuildingCategory.Economy,
    levels: [
      { cost: { [ResourceType.Rubies]: 150 }, production: { [ResourceType.Coins]: 50 }, productionInterval: 60 },
    ],
  },
  {
    id: 'encampment',
    name: 'Encampment',
    description: 'A temporary camp that slightly increases population.',
    icon: ICONS.BuildingIcons.Encampment(),
    width: 5,
    height: 4,
    visualWidth: 190,
    visualHeight: 150,
    category: BuildingCategory.Civil,
    levels: [
      { cost: { [ResourceType.Wood]: 150 }, populationIncrease: 10 },
    ],
  },
  {
    id: 'estate',
    name: 'Estate',
    description: 'A luxurious estate that provides a large boost to population.',
    icon: ICONS.BuildingIcons.Estate(),
    width: 5,
    height: 5,
    visualWidth: 220,
    visualHeight: 200,
    category: BuildingCategory.Civil,
    levels: [
      { cost: { [ResourceType.Wood]: 1500, [ResourceType.Stone]: 2000 }, populationIncrease: 120 },
    ],
  },
  {
    id: 'firestation',
    name: 'Firestation',
    description: 'A station for firefighters. Reduces damage from certain attacks. (Decorative)',
    icon: ICONS.BuildingIcons.Firestation(),
    width: 4,
    height: 4,
    visualWidth: 170,
    visualHeight: 180,
    category: BuildingCategory.Civil,
    levels: [
      { cost: { [ResourceType.Wood]: 500, [ResourceType.Stone]: 500 } },
    ],
  },
  {
    id: 'flourmill',
    name: 'Flourmill',
    description: 'Grinds grain into flour, a prerequisite for bakeries.',
    icon: ICONS.BuildingIcons.Flourmill(),
    width: 4,
    height: 4,
    visualWidth: 160,
    visualHeight: 170,
    category: BuildingCategory.Economy,
    levels: [
      { cost: { [ResourceType.Wood]: 400, [ResourceType.Stone]: 300 } },
    ],
  },
  {
    id: 'forge',
    name: 'Forge',
    description: 'A standard forge for crafting weapons and armor.',
    icon: ICONS.BuildingIcons.Forge(),
    width: 4,
    height: 4,
    visualWidth: 180,
    visualHeight: 170,
    category: BuildingCategory.Military,
    levels: [
      { cost: { [ResourceType.Stone]: 800, [ResourceType.Iron]: 200 } },
    ],
  },
  {
    id: 'relic_honey_garden',
    name: 'Relic Honey Garden',
    description: 'An ancient garden that produces a bounty of food and a trickle of precious rubies.',
    icon: ICONS.BuildingIcons.RelicHoneyGarden(),
    width: 4,
    height: 4,
    visualWidth: 180,
    visualHeight: 180,
    category: BuildingCategory.Economy,
    levels: [
      { cost: { [ResourceType.Coins]: 25000, [ResourceType.Rubies]: 50 }, production: { [ResourceType.Food]: 100, [ResourceType.Rubies]: 1 }, productionInterval: 60 },
    ],
  },
  {
    id: 'marketplace',
    name: 'Marketplace',
    description: 'A bustling market that generates coins through trade.',
    icon: ICONS.BuildingIcons.Marketplace(),
    width: 5,
    height: 5,
    visualWidth: 230,
    visualHeight: 180,
    category: BuildingCategory.Economy,
    levels: [
      { cost: { [ResourceType.Wood]: 1000, [ResourceType.Stone]: 500 }, production: { [ResourceType.Coins]: 15 }, productionInterval: 30 },
    ],
  },
  {
    id: 'military_academy',
    name: 'Military Academy',
    description: 'An advanced facility for training elite troops. (Decorative)',
    icon: ICONS.BuildingIcons.MilitaryAcademy(),
    width: 5,
    height: 5,
    visualWidth: 220,
    visualHeight: 220,
    category: BuildingCategory.Military,
    levels: [
      { cost: { [ResourceType.Coins]: 15000, [ResourceType.Rubies]: 50 } },
    ],
  },
  {
    id: 'military_hospital',
    name: 'Military Hospital',
    description: 'Heals a portion of troops lost in defensive battles.',
    icon: ICONS.BuildingIcons.MilitaryHospital(),
    width: 4,
    height: 5,
    visualWidth: 180,
    visualHeight: 170,
    category: BuildingCategory.Military,
    levels: [
      { cost: { [ResourceType.Wood]: 2000, [ResourceType.Stone]: 1500 } },
    ],
  },
  {
    id: 'refinery',
    name: 'Refinery',
    description: 'Refines raw resources into more valuable materials.',
    icon: ICONS.BuildingIcons.Refinery(),
    width: 4,
    height: 4,
    visualWidth: 170,
    visualHeight: 190,
    category: BuildingCategory.Economy,
    levels: [
      { cost: { [ResourceType.Stone]: 2500, [ResourceType.Iron]: 1000 } },
    ],
  },
  {
    id: 'relic_barrel_workshop',
    name: 'Relic Barrel Workshop',
    description: 'A highly efficient workshop producing wood.',
    icon: ICONS.BuildingIcons.RelicBarrelWorkshop(),
    width: 3,
    height: 3,
    visualWidth: 160,
    visualHeight: 150,
    category: BuildingCategory.Economy,
    levels: [
      { cost: { [ResourceType.Coins]: 12000 }, production: { [ResourceType.Wood]: 40 }, productionInterval: 10 },
    ],
  },
  {
    id: 'relic_brewery',
    name: 'Relic Brewery',
    description: 'This ancient brewery produces food at an astonishing rate.',
    icon: ICONS.BuildingIcons.RelicBrewery(),
    width: 4,
    height: 4,
    visualWidth: 180,
    visualHeight: 180,
    category: BuildingCategory.Economy,
    levels: [
      { cost: { [ResourceType.Coins]: 15000 }, production: { [ResourceType.Food]: 80 }, productionInterval: 20 },
    ],
  },
  {
    id: 'relic_conservatory',
    name: 'Relic Conservatory',
    description: 'A beautiful and efficient food production building.',
    icon: ICONS.BuildingIcons.RelicConservatory(),
    width: 4,
    height: 4,
    visualWidth: 180,
    visualHeight: 160,
    category: BuildingCategory.Economy,
    levels: [
      { cost: { [ResourceType.Rubies]: 40 }, production: { [ResourceType.Food]: 120 }, productionInterval: 30 },
    ],
  },
  {
    id: 'relic_greenhouse',
    name: 'Relic Greenhouse',
    description: 'An enchanted greenhouse yielding a constant supply of food.',
    icon: ICONS.BuildingIcons.RelicGreenhouse(),
    width: 4,
    height: 4,
    visualWidth: 180,
    visualHeight: 160,
    category: BuildingCategory.Economy,
    levels: [
      { cost: { [ResourceType.Rubies]: 45 }, production: { [ResourceType.Food]: 150 }, productionInterval: 30 },
    ],
  },
  {
    id: 'relic_mead_distillery',
    name: 'Relic Mead Distillery',
    description: 'A legendary distillery producing vast quantities of food.',
    icon: ICONS.BuildingIcons.RelicMeadDistillery(),
    width: 4,
    height: 4,
    visualWidth: 170,
    visualHeight: 180,
    category: BuildingCategory.Economy,
    levels: [
      { cost: { [ResourceType.Coins]: 20000 }, production: { [ResourceType.Food]: 100 }, productionInterval: 20 },
    ],
  },
  {
    id: 'siege_workshop',
    name: 'Siege Workshop',
    description: 'Constructs powerful siege engines for attacking castles.',
    icon: ICONS.BuildingIcons.SiegeWorkshop(),
    width: 5,
    height: 5,
    visualWidth: 220,
    visualHeight: 200,
    category: BuildingCategory.Military,
    levels: [
      { cost: { [ResourceType.Wood]: 2500, [ResourceType.Iron]: 500 } },
    ],
  },
  {
    id: 'stables',
    name: 'Stables',
    description: 'Houses horses and allows for the training of cavalry units.',
    icon: ICONS.BuildingIcons.Stables(),
    width: 5,
    height: 4,
    visualWidth: 200,
    visualHeight: 160,
    category: BuildingCategory.Military,
    levels: [
      { cost: { [ResourceType.Wood]: 1800, [ResourceType.Food]: 500 } },
    ],
  },
  {
    id: 'storehouse',
    name: 'Storehouse',
    description: 'Increases the storage capacity for all resources.',
    icon: ICONS.BuildingIcons.Storehouse(),
    width: 4,
    height: 4,
    visualWidth: 180,
    visualHeight: 160,
    category: BuildingCategory.Economy,
    levels: [
      { cost: { [ResourceType.Wood]: 1000, [ResourceType.Stone]: 1000 } },
    ],
  },
  {
    id: 'university',
    name: 'University',
    description: 'Unlocks advanced research and technologies. (Decorative)',
    icon: ICONS.BuildingIcons.University(),
    width: 5,
    height: 5,
    visualWidth: 230,
    visualHeight: 240,
    category: BuildingCategory.Civil,
    levels: [
      { cost: { [ResourceType.Coins]: 20000, [ResourceType.Rubies]: 75 } },
    ],
  },
  {
    id: 'willow_of_experience',
    name: 'Willow of Experience',
    description: 'A mystical tree that provides a steady stream of experience. (Decorative)',
    icon: ICONS.BuildingIcons.WillowOfExperience(),
    width: 3,
    height: 3,
    visualWidth: 150,
    visualHeight: 160,
    category: BuildingCategory.Decoration,
    levels: [
      { cost: { [ResourceType.Rubies]: 100 } },
    ],
  },
  {
    id: 'watchtower',
    name: 'Watchtower',
    description: 'Provides early warnings of incoming attacks and improves defense.',
    icon: ICONS.BuildingIcons.Watchtower(),
    width: 2,
    height: 2,
    visualWidth: 100,
    visualHeight: 140,
    category: BuildingCategory.Military,
    levels: [
      { cost: { [ResourceType.Wood]: 300, [ResourceType.Stone]: 500 } },
    ],
  },
  { id: 'deco_fountain', name: 'Fountain', description: 'A lovely fountain.', icon: ICONS.BuildingIcons.DecoFountain(), width: 2, height: 2, visualWidth: 100, visualHeight: 100, category: BuildingCategory.Decoration, levels: [{ cost: { [ResourceType.Stone]: 500 } }] },
  { id: 'deco_statue', name: 'Statue', description: 'A heroic statue.', icon: ICONS.BuildingIcons.DecoStatue(), width: 2, height: 2, visualWidth: 100, visualHeight: 120, category: BuildingCategory.Decoration, levels: [{ cost: { [ResourceType.Stone]: 1000, [ResourceType.Coins]: 500 } }] },
  { id: 'deco_garden', name: 'Garden', description: 'A peaceful garden.', icon: ICONS.BuildingIcons.DecoGarden(), width: 3, height: 3, visualWidth: 130, visualHeight: 100, category: BuildingCategory.Decoration, levels: [{ cost: { [ResourceType.Wood]: 300 } }] },
  { id: 'deco_well', name: 'Well', description: 'A rustic well.', icon: ICONS.BuildingIcons.DecoWell(), width: 2, height: 2, visualWidth: 100, visualHeight: 100, category: BuildingCategory.Decoration, levels: [{ cost: { [ResourceType.Stone]: 400 } }] },
  { id: 'deco_flag', name: 'Flag', description: 'A proud flag.', icon: ICONS.BuildingIcons.DecoFlag(), width: 1, height: 1, visualWidth: 80, visualHeight: 100, category: BuildingCategory.Decoration, levels: [{ cost: { [ResourceType.Wood]: 100, [ResourceType.Coins]: 100 } }] },
  { id: 'deco_banner', name: 'Banner', description: 'A decorative banner.', icon: ICONS.BuildingIcons.DecoBanner(), width: 1, height: 2, visualWidth: 90, visualHeight: 110, category: BuildingCategory.Decoration, levels: [{ cost: { [ResourceType.Wood]: 150, [ResourceType.Coins]: 150 } }] },
  { id: 'nomad_tent', name: 'Nomad Tent', description: 'A decorative tent from the Nomad event.', icon: ICONS.BuildingIcons.NomadTent(), width: 3, height: 3, visualWidth: 140, visualHeight: 120, category: BuildingCategory.Decoration, levels: [{ cost: {} }] },
];

export const TROOPS = [
    {
        id: TroopType.Spearman,
        name: 'Spearman',
        description: 'A good value melee soldier.',
        stats: { attack: 8, defense: 12 },
        cost: { [ResourceType.Coins]: 40, [ResourceType.Food]: 8 },
        trainingTime: 4,
        foodUpkeep: 0.15,
        icon: ICONS.TroopIcons.Melee(),
        slot: 'melee',
    },
    {
        id: TroopType.Swordsman,
        name: 'Two-handed swordsman',
        description: 'A powerful melee soldier.',
        stats: { attack: 18, defense: 9 },
        cost: { [ResourceType.Coins]: 80, [ResourceType.Food]: 15 },
        trainingTime: 8,
        foodUpkeep: 0.3,
        icon: ICONS.TroopIcons.Melee(),
        slot: 'melee',
    },
    {
        id: TroopType.Archer,
        name: 'Archer',
        description: 'A versatile ranged defender.',
        stats: { attack: 10, defense: 18 },
        cost: { [ResourceType.Coins]: 65, [ResourceType.Wood]: 8 },
        trainingTime: 6,
        foodUpkeep: 0.2,
        icon: ICONS.TroopIcons.Ranged(),
        slot: 'ranged',
    },
    {
        id: TroopType.Crossbowman,
        name: 'Crossbowman',
        description: 'A powerful ranged soldier.',
        stats: { attack: 20, defense: 10 },
        cost: { [ResourceType.Coins]: 90, [ResourceType.Wood]: 12 },
        trainingTime: 10,
        foodUpkeep: 0.35,
        icon: ICONS.TroopIcons.Ranged(),
        slot: 'ranged',
    }
];

export const TOOLS = [
    {
        id: ToolType.ShieldWall,
        name: 'Shield wall',
        description: 'Large mobile barriers that reduce the effectiveness of enemy wall defenses.',
        cost: { [ResourceType.Wood]: 100, [ResourceType.Stone]: 20 },
        constructionTime: 20,
        icon: ICONS.ToolIcons.ShieldWall(),
        effect: { reduces: 'wall', byPercent: 5 },
    },
    {
        id: ToolType.Mantlet,
        name: 'Mantlet',
        description: 'Portable cover that helps your troops bypass gate defenses.',
        cost: { [ResourceType.Wood]: 80, [ResourceType.Stone]: 40 },
        constructionTime: 15,
        icon: ICONS.ToolIcons.Mantlet(),
        effect: { reduces: 'gate', byPercent: 5 },
    },
    {
        id: ToolType.BatteringRam,
        name: 'Battering ram',
        description: 'A heavy ram designed to smash through fortifications and overcome moat obstacles.',
        cost: { [ResourceType.Wood]: 150, [ResourceType.Stone]: 150 },
        constructionTime: 30,
        icon: ICONS.ToolIcons.BatteringRam(),
        effect: { reduces: 'moat', byPercent: 5 },
    },
];


const generateRandomPOIs = () => {
    const pois = [];

    // Player's main castle, from screenshot
    pois.push({
        type: POIType.PlayerCastle,
        title: "Ruler of the Battle Anor the Undaunted",
        ownerName: "Zero",
        allianceName: "Elysium",
        level: 70,
        position: { x: 48, y: 52 },
        army: { [TroopType.Swordsman]: 5500, [TroopType.Archer]: 4500 },
        icon: ICONS.WorldMapIcons.PlayerCastle1(),
        isPlayer: true,
        isPlayerName: true,
        defenseBonuses: { wall: 75, gate: 75, moat: 50 },
    });

    // Add ImperionX from screenshot
    pois.push({
        type: POIType.PlayerCastle,
        ownerName: "ImperionX",
        level: 65,
        position: { x: 45, y: 45 },
        army: { [TroopType.Swordsman]: 3000, [TroopType.Archer]: 2000 },
        icon: ICONS.WorldMapIcons.DarkCastle(),
        defenseBonuses: { wall: 60, gate: 60, moat: 30 },
        flagColor: 'black',
        isPlayerName: true,
    });

    // Generate Cultist Towers
    for (let i = 0; i < 50; i++) {
        const level = 10 + Math.floor(Math.random() * 41); // Level 10-50
        pois.push({
            type: POIType.CultistTower,
            ownerName: "Cultists",
            level: level,
            position: { x: Math.random() * 100, y: Math.random() * 100 },
            army: {
                [TroopType.Swordsman]: 50 + level * 5 + Math.floor(Math.random() * 20),
                [TroopType.Archer]: 30 + level * 4 + Math.floor(Math.random() * 20),
            },
            icon: ICONS.WorldMapIcons.CultistTower(),
            defenseBonuses: { wall: 10 + level * 0.5, gate: 5 + level * 0.5, moat: 2 + level * 0.2 },
            flagColor: 'black'
        });
    }

    // Generate random player castles
    for (let i = 0; i < 100; i++) {
        const level = 1 + Math.floor(Math.random() * 69); // Level 1-70
        const hasAlliance = Math.random() > 0.5;
        const castleType = Math.random() > 0.2 ? ICONS.WorldMapIcons.PlayerCastle1 : (Math.random() > 0.5 ? ICONS.WorldMapIcons.DarkCastle : ICONS.WorldMapIcons.PlayerCastle2);
        pois.push({
            type: POIType.PlayerCastle,
            ownerName: `Player${Math.floor(Math.random() * 90000) + 10000}`,
            allianceName: hasAlliance ? `Alliance${Math.floor(Math.random() * 100)}` : undefined,
            level: level,
            position: { x: Math.random() * 100, y: Math.random() * 100 },
            army: {
                [TroopType.Swordsman]: 20 * level + Math.floor(Math.random() * 50),
                [TroopType.Archer]: 15 * level + Math.floor(Math.random() * 50),
            },
            icon: castleType(),
            defenseBonuses: { wall: level, gate: level, moat: level * 0.5 },
            flagColor: Math.random() > 0.3 ? 'red' : 'black',
            hasBirds: Math.random() > 0.7
        });
    }

    // Resource nodes
    for (let i = 0; i < 50; i++) {
        pois.push({
            type: POIType.ResourceStone,
            ownerName: "Rock Deposit",
            level: 1,
            position: { x: Math.random() * 100, y: Math.random() * 100 },
            army: {},
            icon: ICONS.WorldMapIcons.StoneNode(),
            defenseBonuses: { wall: 0, gate: 0, moat: 0 },
        });
    }
    
    return pois;
};


export const generateInitialWorldMapPOIs = () => {
    return generateRandomPOIs().map((poi, index) => ({
        ...poi,
        id: `poi-${index}`,
    }));
};


export const QUESTS = [
    {
        id: 'quest_build_barracks',
        title: "Build barracks!",
        description: "We need barracks to be able to train soldiers.",
        type: 'build',
        target: 'barracks',
        reward: { [ResourceType.Coins]: 500, [ResourceType.Rubies]: 15 },
        isCompleted: false,
    },
    {
        id: 'quest_build_rookery',
        title: "Eyes in the Sky",
        description: "Knowledge is power. Construct a Rookery to recruit spies and uncover your enemies' secrets before you strike.",
        type: 'build',
        target: 'rookery',
        reward: { [ResourceType.Coins]: 500, [ResourceType.Rubies]: 15 },
        isCompleted: false,
    },
    {
        id: 'quest_build_quarry',
        title: "Stone for the People",
        description: "Our masons require more stone to strengthen our defenses. Construct a Stone Quarry to begin extraction.",
        type: 'build',
        target: 'quarry',
        reward: { [ResourceType.Coins]: 150, [ResourceType.Rubies]: 5 },
        isCompleted: false,
    },
];

export const MERCHANT_INVENTORY = [
    {
        id: 'wood_small',
        name: 'Crate of Wood',
        description: 'A bundle of sturdy lumber, ready for construction.',
        cost: { [ResourceType.Rubies]: 10 },
        reward: { [ResourceType.Wood]: 500 },
    },
    {
        id: 'stone_small',
        name: 'Cart of Stone',
        description: 'Quality stone blocks, perfect for reinforcing your castle.',
        cost: { [ResourceType.Rubies]: 10 },
        reward: { [ResourceType.Stone]: 500 },
    },
    {
        id: 'food_large',
        name: 'Bountiful Harvest',
        description: 'Enough food to keep your citizens and soldiers satisfied.',
        cost: { [ResourceType.Rubies]: 15 },
        reward: { [ResourceType.Food]: 1000 },
    },
];

export const ARMORER_INVENTORY = [
    {
        id: 'iron_helmet',
        name: 'Iron Helmet',
        description: 'A basic helmet providing a small boost to ranged defense.',
        cost: { [ResourceType.Rubies]: 50 },
        icon: ICONS.EquipmentIcons.IronHelmet(),
        bonus: { type: 'defense_ranged', value: 5 },
    },
    {
        id: 'steel_chestplate',
        name: 'Steel Chestplate',
        description: 'Solid armor that excels at stopping melee attacks.',
        cost: { [ResourceType.Rubies]: 150 },
        icon: ICONS.EquipmentIcons.SteelArmor(),
        bonus: { type: 'defense_melee', value: 10 },
    },
    {
        id: 'tower_shield',
        name: 'Tower Shield',
        description: 'An enormous shield offering significant protection against both melee and ranged threats.',
        cost: { [ResourceType.Rubies]: 300 },
        icon: ICONS.EquipmentIcons.TowerShield(),
        bonus: { type: 'defense_melee', value: 15 },
    }
];

export const FAKE_LEADERBOARD_PLAYERS: LeaderboardPlayer[] = [
    { id: 'p1', name: 'Lord Farquaad', allianceName: 'Duloc Knights', level: 68, honor: 65000000, power: 715000 },
    { id: 'p2', name: 'King Arthur', allianceName: 'Camelot', level: 72, honor: 80000000, power: 880000 },
    { id: 'p3', name: 'Ragnar Lothbrok', allianceName: 'Vikings', level: 65, honor: 58000000, power: 638000 },
    { id: 'p4', name: 'Joan of Arc', allianceName: 'The Holy Host', level: 60, honor: 45000000, power: 495000 },
    { id: 'p5', name: 'William Wallace', allianceName: 'Scottish Clans', level: 62, honor: 52000000, power: 572000 },
    { id: 'p6', name: 'Genghis Khan', allianceName: 'Golden Horde', level: 75, honor: 95000000, power: 1045000 },
    { id: 'p7', name: 'Cleopatra', allianceName: 'Nile Empire', level: 58, honor: 40000000, power: 440000 },
    { id: 'p8', name: 'Attila the Hun', allianceName: 'The Scourge', level: 71, honor: 75000000, power: 825000 },
    { id: 'p9', name: 'Black Knight', allianceName: 'Tis But a Scratch', level: 50, honor: 30000000, power: 330000 },
    { id: 'p10', name: 'Robin Hood', allianceName: 'Merry Men', level: 55, honor: 35000000, power: 385000 },
];

export const DAILY_REWARDS = [
    { day: 1, reward: { [ResourceType.Coins]: 1000, [ResourceType.Wood]: 500 } },
    { day: 2, reward: { [ResourceType.Coins]: 1500, [ResourceType.Stone]: 500 } },
    { day: 3, reward: { [ResourceType.Food]: 2000 } },
    { day: 4, reward: { [ResourceType.Coins]: 2500, [ResourceType.Rubies]: 5 } },
    { day: 5, reward: { [ResourceType.Wood]: 1000, [ResourceType.Stone]: 1000 } },
    { day: 6, reward: { [ResourceType.Coins]: 5000, [ResourceType.Rubies]: 10 } },
    { day: 7, reward: { [ResourceType.Rubies]: 50, [ResourceType.Iron]: 500 } },
];

export const NOMAD_EVENT_DATA: NomadEventData = {
    title: "Nomad Invasion",
    description: "The fierce nomads are on the move! Defeat their camps (disguised as Cultist Towers) to earn event points and collect Nomad Horns. Spend your horns in the event shop for exclusive rewards!",
    milestones: [
        { points: 100, rewards: { [ResourceType.Wood]: 500, [ResourceType.Stone]: 500 } },
        { points: 500, rewards: { [ResourceType.Coins]: 2000 } },
        { points: 1000, rewards: { [ResourceType.Food]: 2500 } },
        { points: 2500, rewards: { [ResourceType.Rubies]: 50 } },
        { points: 5000, rewards: { [ResourceType.Wood]: 5000, [ResourceType.Stone]: 5000 } },
        { points: 10000, rewards: { [ResourceType.Iron]: 1000 } },
        { points: 20000, rewards: { [ResourceType.Rubies]: 200 } },
        { points: 50000, rewards: { [ResourceType.NomadHorns]: 500 } },
    ],
    shopItems: [
        {
            id: 'nomad_wood_pack',
            name: 'Nomad Wood Pack',
            description: 'A large bundle of wood gathered by the nomads.',
            cost: { [ResourceType.NomadHorns]: 50 },
            reward: { [ResourceType.Wood]: 2000 },
            icon: ICONS.Wood({})
        },
        {
            id: 'nomad_stone_pack',
            name: 'Nomad Stone Pack',
            description: 'A hefty bag of stones from the nomad quarries.',
            cost: { [ResourceType.NomadHorns]: 50 },
            reward: { [ResourceType.Stone]: 2000 },
            icon: ICONS.Stone({})
        },
        {
            id: 'nomad_food_pack',
            name: 'Nomad Food Stash',
            description: 'Preserved foods that will last for a long journey.',
            cost: { [ResourceType.NomadHorns]: 80 },
            reward: { [ResourceType.Food]: 5000 },
            icon: ICONS.Food({})
        },
        {
            id: 'nomad_tent_deco',
            name: 'Nomad Tent',
            description: 'A decorative tent, a memento of your victory over the nomads.',
            cost: { [ResourceType.NomadHorns]: 250 },
            reward: { buildingId: 'nomad_tent' },
            icon: ICONS.BuildingIcons.NomadTent({})
        }
    ]
};

export const FAKE_NOMAD_LEADERBOARD: { name: string, allianceName: string, points: number, isCurrentUser?: boolean }[] = [
    { name: "Nomad Slayer", allianceName: "The Horde", points: 150230 },
    { name: "Desert Fox", allianceName: "Mirage", points: 125800 },
    { name: "Sandstorm", allianceName: "Dune", points: 98540 },
    { name: "Khan's Wrath", allianceName: "Steppe Riders", points: 76320 },
    { name: "Wasteland Wanderer", allianceName: "Oasis", points: 65110 },
    { name: "Dune Ripper", allianceName: "Sand Vipers", points: 52400 },
];
