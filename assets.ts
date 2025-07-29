

import React from 'react';

type IconFunc = (props?: { className?: string }) => React.ReactNode;

// Helper to create img tags from base64 strings
const createImage = (src: string, alt: string): IconFunc =>
  (props) => React.createElement('img', { src, alt, ...(props || {}), style: {width: '100%', height: '100%', objectFit: 'contain'} });

const placeholderSvg = (color = '#cccccc', text = ''): string => {
    // Use btoa for browser environments.
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" fill="${color}" />
        <text x="50" y="55" font-family="Arial" font-size="40" text-anchor="middle" fill="#555555">${text}</text>
    </svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
};

const woodIcon = "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNjQgNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iI0EwNTIyRCIgZD0iTTEwLDU5IFYyMyBjMCwtNSA1LC01IDEwLC01IGgyNCBjNSwwIDEwLDAgMTAsNSB2MzYgeiIvPjxwYXRoIGZpbGw9IiM4QjVBMkIiIGQ9Ik0xMiw1NyBWMjUgYzAsLTQgNCwtNCA4LC00IGgyNCBjNCwwIDgsMCA4LDQgdjMyIHoiLz48cGF0aCBmaWxsPSIjNjU0MzIxIiBkPSJNMTQsNTUgVjI3IGMwLC0zIDMsLTMgNiwtMyBoMjQgYzMsMCA2LDAgNiwzIHYyOCB6Ii8+PGVsbGlwc2UgZmlsbD0iI0QyQjQ4QyIgY3g9IjMyIiBjeT0iMjIiIHJ4PSIyMCIgcnk9IjgiLz48cGF0aCBmaWxsPSIjOEI1QzJCIiBkPSJNMjAsMjIuNSBhMSwxIDAgMCwwIDI0LDAiLz48cGF0aCBmaWxsPSIjOEI1QzJCIiBkPSJNMjQsMjMgYTExIDAgMCwwIDE2LC0xIi8+PHBhdGggZmlsbD0iIzhCNUMyQiIgZD0iTTI4LDIzIGExLDEgMCAwLDAgOCwtMS41Ii8+PC9zdmc+";
const stoneIcon = "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNjQgNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iI0E5QTlBOSIgZD0iTTEyLDUyIGEyMCwyMCAwIDAsMSA0MCwwIGExNSwxNSAwIDAsMCAtNDAsMCB6Ii8+PHBhdGggZmlsbD0iIzgwODA4MCIgZD0iTTE4LDM4IGExNSwxNSAwIDAsMSAyOCwwIGExMCwxMCAwIDAsMCAtMjgsMCB6Ii8+PHBhdGggZmlsbD0iI0JFQkVCRSIgZD0iTTMwLDI0IGExMCwxMCAwIDAsMSAxNCwwIGE1LDUgMCAwLDAgLTE0LDAgeiIvPjxwYXRoIGZpbGw9IiM2OTY5NjkiIGQ9Ik0yNCw1MCBhMTIsMTIgMCAwLDEgMjAsLTUgYTEwLDEwIDAgMCwwIC0yMiwyIHoiLz48cGF0aCBmaWxsPSIjNjk2OTY5IiBkPSJNNDAsNDAgYTEyLDEyIDAgMCwxIC0yMCw1IGExMCwxMCAwIDAsMCAyMiwtMiB6Ii8+PC9zdmc+";
const foodIcon = "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNjQgNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iI0QyQjQ4QyIgZD0iTTEwLDQ4IEMxMCwzMCAyNSwyMiAzMiwyMiBTNTQsMzAgNTQsNDggYTEwLDEwIDAgMCwxIC00NCwwIHoiLz48cGF0aCBmaWxsPSIjQjg4NjBCIiBkPSJNMTEwLDQ0IEMxMCwyOCAyNSwyMCAzMiwyMCBTNTQsMjggNTQsNDQgYTEyLDEyIDAgMCwxIC00NCwwIHoiLz48cGF0aCBkPSJNMjAsMzggbC00LC0xMCIgc3Ryb2tlPSIjODA0QTAwIiBzdHJva2Utd2lkdGg9IjIiLz48cGF0aCBkPSJNMzIsNDAgbC00LC0xMiIgc3Ryb2tlPSIjODA0QTAwIiBzdHJva2Utd2lkdGg9IjIiLz48cGF0aCBkPSJNNDQsMzggbC00LC0xMCIgc3Ryb2tlPSIjODA0QTAwIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=";
const coinsIcon = "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNjQgNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjQiIGN5PSI0MiIgcj0iMTgiIGZpbGw9IiNGRkQ3MDAiIHN0cm9rZT0iI0RBQTUyMCIgc3Ryb2tlLXdpZHRoPSIyIi8+PGNpcmNsZSBjeD0iNDQiIGN5PSI0NCIgcj0iMTYiIGZpbGw9IiNGRkQ3MDAiIHN0cm9rZT0iI0RBQTUyMCIgc3Ryb2tlLXdpZHRoPSIyIi8+PGNpcmNsZSBjeD0iMzIiIGN5PSIyOCIgcj0iMTUiIGZpbGw9IiNGRkQ3MDAiIHN0cm9rZT0iI0RBQTUyMCIgc3Ryb2tlLXdpZHRoPSIyIi8+PGNpcmNsZSBjeD0iMjQiIGN5PSI0MiIgcj0iMTQiIGZpbGw9IiNGMEU2OEMiLz48Y2lyY2xlIGN4PSI0NCIgY3k9IjQ0IiByPSIxMiIgZmlsbD0iI0YwRTY4QyIvPjxjaXJjbGUgY3g9IjMyIiBjeT0iMjgiIHI9IjExIiBmaWxsPSIjRjBFNjhDIi8+PC9zdmc+";
const rubiesIcon = "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNjQgNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTMyIDUgTDEwIDI1IEMzMiA2MCBMNTQgMjUgWiIgZmlsbD0iI0RDMTQzQyIgc3Ryb2tlPSIjOEIwMDAwIiBzdHJva2Utd2lkdGg9IjIiLz48cGF0aCBkPSJNMzIgNSBMMTAgMjUgTDMyIDI4IFoiIGZpbGw9IiNGRjQ1MDAiLz48cGF0aCBkPSJNMzIgNSBMNTQgMjUgTDMyIDI4IFoiIGZpbGw9IiNGRjYzNDciLz48cGF0aCBkPSJNMTAgMjUgTDMyIDYwIEwzMiAyOCBaIiBmaWxsPSIjQjIyMjIyIi8+PHBhdGggZD0iTTU0IDI1IEwzMiA2MCBMMzIgMjggWiIgZmlsbD0iI0NENUM1QyIvPjwvc3ZnPg==";
const meatIcon = "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNjQgNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iI0E1MkEyQSIgZD0iTTIwLDU1IEMgNSw0MCAyMCwxNSA0NSwyMCA2NSwyNSA2MCw1MCA0NSw1NSAzMCw2MCAzMCw2NSAyMCw1NSBaIi8+PHBhdGggZmlsbD0iI0QyNjkxRSIgZD0iTTIyLDUyIEMgMTAsNDAgMjUsMjAgNDUsMjMgNjAsMjYgNTgsNDggNDUsNTIgMzIsNTYgMzAsNTggMjIsNTIgWiIvPjxyZWN0IHg9IjUiIHk9IjEwIiB3aWR0aD0iMjAiIGhlaWdodD0iMzAiIHJ4PSI4IiB0cmFuc2Zvcm09InJvdGF0ZSgtNDAgMTUgMjUpIiBmaWxsPSIjRjVERUIzIiBzdHJva2U9IiNERSU4ODciIHN0cm9rZS13aWR0aD0iMiIvPjxjaXJjbGUgY3g9IjEwIiBjeT0iMTIiIHI9IjgiIGZpbGw9IiNGNURFQjMiIHN0cm9rZT0iI0RFQjg4NyIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+";
const ironIcon = "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNjQgNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iNDQiIGhlaWdodD0iMTIiIHJ4PSIyIiBmaWxsPSIjNjk2OTY5IiBzdHJva2U9IiM0MDQwNDAiIHN0cm9rZS13aWR0aD0iMS41Ii8+PHJlY3QgeD0iMTAiIHk9IjI2IiB3aWR0aD0iNDQiIGhlaWdodD0iMTIiIHJ4PSIyIiBmaWxsPSIjODA4MDgwIiBzdHJva2U9IiM1MDUwNTAiIHN0cm9rZS13aWR0aD0iMS41Ii8+PHJlY3QgeD0iMTAiIHk9IjQyIiB3aWR0aD0iNDQiIGhlaWdodD0iMTIiIHJ4PSIyIiBmaWxsPSIjQTlBQUE5IiBzdHJva2U9IiM2MDYwNjAiIHN0cm9rZS13aWR0aD0iMS41Ii8+PC9zdmc+";
const gemsIcon = "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNjQgNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTMyIDUgTDEwIDI1IEMzMiA2MCBMNTQgMjUgWiIgZmlsbD0iIzAwQkZGRiIgc3Ryb2tlPSIjMUU5MEZGIiBzdHJva2Utd2lkdGg9IjIiLz48cGF0aCBkPSJNMzIgNSBMMTAgMjUgTDMyIDI4IFoiIGZpbGw9IiM4N0NFRkEiLz48cGF0aCBkPSJNMzIgNSBMNTQgMjUgTDMyIDI4IFoiIGZpbGw9IiNBREQ4RTYiLz48cGF0aCBkPSJNMTAgMjUgTDMyIDYwIEwzMiAyOCBaIiBmaWxsPSIjNDY4MkI0Ii8+PHBhdGggZD0iTTU0IDI1IEwzMiA2MCBMMzIgMjggWiIgZmlsbD0iI0IwQzRERSIvPjxwYXRoIGQ9Ik0xMCAyNSBMNTQgMjUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMS41IiBvcGFjaXR5PSIwLjciLz48cGF0aCBkPSJNMzIgNSBMMzIgNjAiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMS41IiBvcGFjaXR5PSIwLjciLz48L3N2Zz4=";
const copperIcon = "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNjQgNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iNDQiIGhlaWdodD0iMTIiIHJ4PSIyIiBmaWxsPSIjQjg3MzMzIiBzdHJva2U9IiM4QjQ1MTMiIHN0cm9rZS13aWR0aD0iMS41Ii8+PHJlY3QgeD0iMTAiIHk9IjI2IiB3aWR0aD0iNDQiIGhlaWdodD0iMTIiIHJ4PSIyIiBmaWxsPSIjQ0Q4NTNGIiBzdHJva2U9IiNBMDUyMkQiIHN0cm9rZS13aWR0aD0iMS41Ii8+PHJlY3QgeD0iMTAiIHk9IjQyIiB3aWR0aD0iNDQiIGhlaWdodD0iMTIiIHJ4PSIyIiBmaWxsPSIjRDJCNDhDIiBzdHJva2U9IiNCQzhGOEYiIHN0cm9rZS13aWR0aD0iMS41Ii8+PC9zdmc+";
const silverIcon = "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNjQgNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iNDQiIGhlaWdodD0iMTIiIHJ4PSIyIiBmaWxsPSIjQzBDMEMwIiBzdHJva2U9IiNBQUE5QTkiIHN0cm9rZS13aWR0aD0iMS41Ii8+PHJlY3QgeD0iMTAiIHk9IjI2IiB3aWR0aD0iNDQiIGhlaWdodD0iMTIiIHJ4PSIyIiBmaWxsPSIjRDNEM0QzIiBzdHJva2U9IiNCRUJFQkUiIHN0cm9rZS13aWR0aD0iMS41Ii8+PHJlY3QgeD0iMTAiIHk9IjQyIiB3aWR0aD0iNDQiIGhlaWdodD0iMTIiIHJ4PSIyIiBmaWxsPSIjRTBFMEUwIiBzdHJva2U9IiNDMEMwQzAiIHN0cm9rZS13aWR0aD0iMS41Ii8+PC9zdmc+";
const nomadHornsIcon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+PHBhdGggZmlsbD0iI0M4QjI4MiIgZD0iTTUyIDMyIEM1MiAyMiA0MiAxNiAyOCAxNiBDMTggMTYgMTIgMjAgOCAyNiBDNCAzMiA0IDQ0IDEwIDUwIEMxNiA1NiAyNiA1NCAzNiA1MCBDNDYgNDYgNTIgNDIgNTIgMzIgWiIvPjxwYXRoIGZpbGw9IiNFRURDQUMiIGQ9Ik01MCAzMiBDNTAgMjQgNDIgMTggMzAgMTggQzIwIDE4IDE0IDIyIDEwIDI4IEM2IDM0IDYgNDQgMTIgNDggQzE4IDUyIDI4IDUwIDM4IDQ2IEM0OCA0MiA1MCAzNiA1MCAzMiBaIi8+PHBhdGggZmlsbD0iI0EwOEU2RSIgZD0iTTI4IDE2IEwyMCAxMiBMMTYgMjAgTDI4IDE2IFoiLz48cGF0aCBmaWxsPSIjNzM2NzQzIiBkPSJNMTQgMjQgQzIwIDMwIDI4IDM0IDM2IDM0IEM0NCAzNCA0OCAzMCA0OCAyNiBDNDggMjIgNDQgMjAgMzYgMjIgQzI4IDI0IDIwIDI2IDE0IDI0IFoiIG9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==";

const castleExpansionSpriteUrl = 'https://i.ibb.co/kBPbYp8/tooltip-sprites.png';

export const ICONS = {
    // Resource Icons
    Wood: createImage(woodIcon, 'Wood'),
    Stone: createImage(stoneIcon, 'Stone'),
    Coins: createImage(coinsIcon, 'Coins'),
    Food: createImage(foodIcon, 'Food'),
    Meat: createImage(meatIcon, 'Meat'),
    Rubies: createImage(rubiesIcon, 'Rubies'),
    Iron: createImage(ironIcon, 'Iron'),
    Gems: createImage(gemsIcon, 'Gems'),
    Copper: createImage(copperIcon, 'Copper'),
    Silver: createImage(silverIcon, 'Silver'),
    NomadHorns: createImage(nomadHornsIcon, 'Nomad Horns'),
    
    // Building Icons
    BuildingIcons: {
        Farm: createImage('https://i.ibb.co/DPTvmQ9L/farmhouse.webp', 'Farmhouse'),
        LumberMill: createImage('https://i.ibb.co/3Yp9xYpN/sawmill.png', 'Lumber Mill'),
        Quarry: createImage('https://i.ibb.co/39Zb39qc/relic-quarry.webp', 'Stone Quarry'),
        GoldMine: createImage(placeholderSvg('#FFD700', 'G'), 'Gold Mine'),
        House: createImage('https://i.ibb.co/Zzrfk4Ky/dwellings.webp', 'Dwellings'),
        Wall: createImage(placeholderSvg('#A9A9A9', 'W'), 'Wall'),
        Barracks: createImage('https://i.ibb.co/3y3Q1vnv/barracks.png', 'Barracks'),
        Keep: createImage('https://i.ibb.co/HLqsmmGY/keep-removebg-preview.png', 'Keep'),
        Hut: createImage(placeholderSvg('#D2B48C', 'H'), 'Hut'),
        ToolsWorkshop: createImage('https://i.ibb.co/3sWbTqX/workshop.webp', 'Tools Workshop'),
        Rookery: createImage(placeholderSvg('#36454F', 'R'), 'Tavern'),
        
        // New buildings from the prompt
        MasterBuilder: createImage('https://i.ibb.co/HLvGvhGJ/masterbuilder.webp', 'Master Builder'),
        ForestLodge: createImage('https://i.ibb.co/v6Fx8BFW/forest-lodge.webp', 'Forest Lodge'),
        Granary: createImage('https://i.ibb.co/vCBRzhJ8/granary.webp', 'Granary'),
        HuntingLodge: createImage('https://i.ibb.co/chhwfDd5/hunting-lodge.webp', 'Hunting Lodge'),
        ImperialCouncilHall: createImage('https://i.ibb.co/V0bpjY3R/imperial-council.png', 'Imperial Council Hall'),
        ReinforcedVault: createImage('https://i.ibb.co/CG7jM1s/imperial-council-hall.webp', 'Reinforced Vault'),
        IronMine: createImage('https://i.ibb.co/x8Sp26cV/iron-mine.webp', 'Iron Mine'),
        Ironworks: createImage('https://i.ibb.co/svBSLNdC/iron-work.webp', 'Ironworks'),
        MooManor: createImage('https://i.ibb.co/xSVHQXyx/moo-manor-beef-produce.webp', 'Moo Manor'),
        RelicWoodcutter: createImage('https://i.ibb.co/TXSmxM3/relic-woodcutter.webp', 'Relic Woodcutter'),
        Stoneworks: createImage('https://i.ibb.co/hxm8n39D/stone-works.webp', 'Stoneworks'),
        Townhouse: createImage('https://i.ibb.co/bj9y3gDJ/townhouse.png', 'Townhouse'),
        
        Bakery: createImage('https://i.ibb.co/TMV8jwd4/bakery.png', 'Bakery'),
        DefenseWorkshop: createImage('https://i.ibb.co/cKD7YkVb/defense-workshop.webp', 'Defense Workshop'),
        DragonBreathForge: createImage('https://i.ibb.co/h18MGVrJ/dragon-breath-forge.webp', 'Dragon Breath Forge'),
        DragonHoard: createImage('https://i.ibb.co/RGFSr8bC/Dragon-hoard.webp', 'Dragon Hoard'),
        Encampment: createImage('https://i.ibb.co/B2pXV4PY/encapment.png', 'Encampment'),
        Estate: createImage('https://i.ibb.co/Q7Dg8zD4/estate.png', 'Estate'),
        Firestation: createImage('https://i.ibb.co/r2N7zKTc/firestation.webp', 'Firestation'),
        Flourmill: createImage('https://i.ibb.co/jkF43XwX/flourmill.png', 'Flourmill'),
        Forge: createImage('https://i.ibb.co/1grrfy5/forge.webp', 'Forge'),
        RelicHoneyGarden: createImage('https://i.ibb.co/V7n0n0s/honey-garden.webp', 'Relic Honey Garden'),
        Marketplace: createImage('https://i.ibb.co/6RFz2Bxk/marketplace.png', 'Marketplace'),
        MilitaryAcademy: createImage('https://i.ibb.co/r2xqtVPn/military-academy.webp', 'Military Academy'),
        MilitaryHospital: createImage('https://i.ibb.co/9HL6yCdf/military-hospital.webp', 'Military Hospital'),
        Refinery: createImage('https://i.ibb.co/d0PC5mQ0/refinery.webp', 'Refinery'),
        RelicBarrelWorkshop: createImage('https://i.ibb.co/XxmdWQB7/relic-barrelworkshop.webp', 'Relic Barrel Workshop'),
        RelicBrewery: createImage('https://i.ibb.co/k6KJBPZ8/relic-brewery.webp', 'Relic Brewery'),
        RelicConservatory: createImage('https://i.ibb.co/spsWVGYW/relic-conservatory-food-production.webp', 'Relic Conservatory'),
        RelicGreenhouse: createImage('https://i.ibb.co/TxchdQ2Y/relic-greenhouse-food-production.webp', 'Relic Greenhouse'),
        RelicMeadDistillery: createImage('https://i.ibb.co/B2B58wMd/relic-mead-distillery.webp', 'Relic Mead Distillery'),
        SiegeWorkshop: createImage('https://i.ibb.co/hJFLLppT/seige-workshop.webp', 'Siege Workshop'),
        Stables: createImage('https://i.ibb.co/9kW9sXSL/stables.png', 'Stables'),
        Storehouse: createImage('https://i.ibb.co/5XXzx53b/storehouse.png', 'Storehouse'),
        Tavern: createImage('https://i.ibb.co/FkYRMKvw/tavern.png', 'Tavern'),
        University: createImage('https://i.ibb.co/23Tds45k/university.webp', 'University'),
        WillowOfExperience: createImage('https://i.ibb.co/CpG00Ggt/willow-of-experience.webp', 'Willow of Experience'),
        Watchtower: createImage('https://i.ibb.co/RTpKHQnF/watchtower.png', 'Watchtower'),

        // New Decorations
        DecoFountain: createImage('https://i.ibb.co/XrLs2V0H/deco1.webp', 'Fountain'),
        DecoStatue: createImage('https://i.ibb.co/YBKy2ffr/deco2.webp', 'Statue'),
        DecoGarden: createImage('https://i.ibb.co/SDKCQ9QW/deco3.webp', 'Garden'),
        DecoWell: createImage('https://i.ibb.co/b5h9JS7w/deco4.webp', 'Well'),
        DecoFlag: createImage('https://i.ibb.co/qFj4DW2W/deco5.webp', 'Flag'),
        DecoBanner: createImage('https://i.ibb.co/k2NWb82S/deco6.webp', 'Banner'),
        NomadTent: createImage(placeholderSvg('#A0522D', 'T'), 'Nomad Tent'),
    },

    // Troop Icons
    TroopIcons: {
        Melee: createImage(placeholderSvg('#DC143C', 'M'), 'Melee'),
        Ranged: createImage(placeholderSvg('#00CED1', 'R'), 'Ranged'),
    },

    // Tool Icons
    ToolIcons: {
        ShieldWall: createImage(placeholderSvg('#BDB76B', 'SW'), 'Shield Wall'),
        Mantlet: createImage(placeholderSvg('#CD853F', 'M'), 'Mantlet'),
        BatteringRam: createImage(placeholderSvg('#708090', 'BR'), 'Battering Ram'),
    },

    // World Map Icons
    WorldMapIcons: {
        PlayerCastle1: createImage('https://i.ibb.co/k6qmKQHR/keep.png', 'Player Castle'),
        PlayerCastle2: createImage('https://i.ibb.co/k6qmKQHR/keep.png', 'Player Castle 2'),
        DarkCastle: createImage('https://i.ibb.co/k6qmKQHR/keep.png', 'Dark Castle'),
        CultistTower: createImage('https://i.ibb.co/cSFLTSDN/cultist-tower.png', 'Cultist Tower'),
        BurntCultistTower: createImage('https://i.ibb.co/ycz2C1Gb/burnt-tower-removebg-preview-1-1.png', 'Burnt Cultist Tower'),
        StoneNode: createImage('https://i.ibb.co/NgbCXrbr/outpost.png', 'Rock Deposit'),
        MarchingArmy: createImage('https://i.ibb.co/L5Q2N1w/RTS-Siege-Warfare-March.png', 'Marching Army'),
    },

    // Commander Icons
    CommanderIcons: {
        Berserker: createImage(placeholderSvg('#FF4500', 'B'), 'Berserker'),
        Hawkeye: createImage(placeholderSvg('#20B2AA', 'H'), 'Hawkeye'),
        Bulwark: createImage(placeholderSvg('#B0C4DE', 'B'), 'Bulwark'),
    },

    // UI Icons
    Close: createImage(placeholderSvg('#FF6347', 'X'), 'Close'),
    Plus: createImage(placeholderSvg('#3CB371', '+'), 'Plus'),
    PlayerCrest: createImage(placeholderSvg('#FFD700', 'C'), 'Player Crest'),
    RedArrow: createImage(placeholderSvg('#FF0000', '>'), 'Red Arrow'),
    Telescope: createImage(placeholderSvg('#C0C0C0', 'T'), 'Telescope'),
    Compass: createImage(placeholderSvg('#C0C0C0', 'C'), 'Compass'),
    Download: createImage(placeholderSvg('#C0C0C0', 'D'), 'Download'),
    Discord: createImage(placeholderSvg('#7289DA', 'D'), 'Discord'),
    Help: createImage(placeholderSvg('#ADD8E6', '?'), 'Help'),
    QuestGiver: createImage(placeholderSvg('#F0E68C', '!'), 'Quest Giver'),
    Mail: createImage(placeholderSvg('#F5F5DC', 'M'), 'Mail'),
    QuestBook: createImage(placeholderSvg('#D2B48C', 'QB'), 'Quest Book'),
    CoinPouch: createImage(placeholderSvg('#DAA520', 'CP'), 'Coin Pouch'),
    Spyglass: createImage(placeholderSvg('#D4AF37', 'S'), 'Spyglass'),
    CastleExpansionSprite: castleExpansionSpriteUrl,
    HoloExpansionSide1: createImage(placeholderSvg('#00FFFF', 'H1'), 'Holo Expansion Side 1'),
    HoloExpansionSide2: createImage(placeholderSvg('#00FFFF', 'H2'), 'Holo Expansion Side 2'),
    ExpansionArrow1: createImage(placeholderSvg('#FFFF00', '>'), 'Expansion Arrow 1'),
    ExpansionArrow2: createImage(placeholderSvg('#FFFF00', '>'), 'Expansion Arrow 2'),
    FlagRed: createImage(placeholderSvg('#FF0000', 'F'), 'Red Flag'),
    FlagBlack: createImage(placeholderSvg('#000000', 'F'), 'Black Flag'),
    Bird: createImage(placeholderSvg('#FFFFFF', 'B'), 'Bird'),
    
    // Bottom Bar Icons
    BottomBarIcons: {
        Build: createImage(placeholderSvg('#FFA500', 'B'), 'Build'),
        Map: createImage(placeholderSvg('#32CD32', 'M'), 'Map'),
        Alliance: createImage(placeholderSvg('#4169E1', 'A'), 'Alliance'),
        Military: createImage(placeholderSvg('#B22222', 'M'), 'Military'),
        Market: createImage(placeholderSvg('#228B22', 'M'), 'Market'),
        Storage: createImage(placeholderSvg('#A0522D', 'S'), 'Storage'),
        Castle: createImage(placeholderSvg('#87CEEB', 'C'), 'Castle'),
    },
    
    // Ring Icons
    RingIcons: {
        Move: createImage(placeholderSvg('#4682B4', 'M'), 'Move'),
        Upgrade: createImage(placeholderSvg('#FFD700', 'U'), 'Upgrade'),
        Rotate: createImage(placeholderSvg('#8A2BE2', 'R'), 'Rotate'),
        Construct: createImage(placeholderSvg('#696969', 'C'), 'Construct'),
    },

    // Attack View Icons
    AttackerBanner: createImage(placeholderSvg('#0000CD', 'A'), 'Attacker Banner'),
    DefenderBanner: createImage(placeholderSvg('#DC143C', 'D'), 'Defender Banner'),
    Ladder: createImage(placeholderSvg('#D2691E', 'L'), 'Ladder'),
    CrossedSwords: createImage(placeholderSvg('#778899', 'CS'), 'Crossed Swords'),
    Sword: createImage(placeholderSvg('#778899', 'S'), 'Sword'),

    // Right Side Menu Icons
    RightSideMenuIcons: {
        Search: createImage(placeholderSvg('#C0C0C0', 'S'), 'Search'),
        ShieldX: createImage(placeholderSvg('#8B0000', 'SX'), 'ShieldX'),
        Formations: createImage(placeholderSvg('#6A5ACD', 'F'), 'Formations'),
        Timer: createImage(placeholderSvg('#20B2AA', 'T'), 'Timer'),
    },
    
    BuildCategories: {
      Civil: (props) => React.createElement('i', { className: 'fas fa-home', ...(props || {}) }),
      Military: (props) => React.createElement('i', { className: 'fas fa-shield-alt', ...(props || {}) }),
      Economy: (props) => React.createElement('i', { className: 'fas fa-leaf', ...(props || {}) }),
      Decorations: (props) => React.createElement('i', { className: 'fas fa-gem', ...(props || {}) }),
    },
    
    // Shops
    Shops: {
        Armorer: createImage('https://i.ibb.co/GQsvrr9F/armorer.png', 'Armorer'),
        NomadCamp: createImage('https://i.ibb.co/23pwm96K/nomadcamps.webp', 'Herald of Nomad Camps'),
        Blacksmith: createImage('https://i.ibb.co/hRhXHJGw/Master-Blacksmith.webp', 'Master Blacksmith'),
        EquipmentTrader: createImage('https://i.ibb.co/VcNywCRT/Equipment-Trader.webp', 'Equipment Trader'),
        WheelOfAffluence: createImage('https://i.ibb.co/hxScZT7n/wheel-Of-Affluence.webp', 'Wheel of Unimaginable Affluence'),
    },
    
    // Equipment Icons
    EquipmentIcons: {
        IronHelmet: createImage(placeholderSvg('#A9A9A9', 'H'), 'Iron Helmet'),
        SteelArmor: createImage(placeholderSvg('#D3D3D3', 'A'), 'Steel Armor'),
        TowerShield: createImage(placeholderSvg('#8B4513', 'S'), 'Tower Shield'),
    },
};
