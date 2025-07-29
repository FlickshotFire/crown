

import React, { useState, useRef, useMemo, useEffect } from 'react';
import { ICONS } from '../assets';
import { useGame } from '../context/GameContext';
import { BuildingCategory } from '../types';
import { BUILDINGS, GRID_COLS, GRID_ROWS, WALL_EXPANSION_COST } from '../constants';
import InteractionRing from './InteractionRing';
import PlacementControls from './PlacementControls';


const SPRITESHEET_URL = 'https://i.ibb.co/231z3q8H/terrainsprites.webp';
const TILE_WIDTH = 64; 
const TILE_HEIGHT = 32;
const SPRITE_SIZE = 128; // The size of one sprite on the sheet

// Coordinates of sprites on the sheet
const TERRAIN_SPRITES = {
    grass: [
        { x: 0, y: 0 },   // plain
        { x: 128, y: 0 }, // light patches
        { x: 0, y: 128 },  // dark patches
        { x: 128, y: 128}, // rocks
    ],
    decoration: [
        { x: 256, y: 0 },  // flowers 1
        { x: 384, y: 0 },  // clover
        { x: 256, y: 128 }, // flowers 2
        { x: 384, y: 128 }, // dirt patch
    ]
};


const WALL_IMAGE_URL = 'https://i.ibb.co/1Y5zWqm7/Screenshot-5-removebg-preview.png';
const WALL_IMAGE_WIDTH = 133;
const WALL_IMAGE_HEIGHT = 167;

const ALT_WALL_IMAGE_URL = 'https://i.ibb.co/VpgFzpBp/Screenshot-3-removebg-preview-1.png';
const ALT_WALL_IMAGE_WIDTH = 136;
const ALT_WALL_IMAGE_HEIGHT = 113;

const TOWER_IMAGE_URL = 'https://i.ibb.co/21TVTTkH/castlewall.png';
const TOWER_IMAGE_WIDTH = 167;
const TOWER_IMAGE_HEIGHT = 167;


export const IsometricGrid = () => {
    const { 
        gameState, 
        placeBuilding, 
        cancelBuildMode, 
        selectBuilding, 
        setZoom, 
        openArmorerModal, 
        openNomadEventModal, 
        openBlacksmithModal, 
        openEquipmentTraderModal, 
        openWheelOfAffluenceModal,
        expandWalls,
        showResourceDenialTooltip,
        canAfford,
        setHoveredExpansionDirection,
    } = useGame();
    const { buildings, buildMode, wallBounds, wallExpansionCount, wallConstructions, selectedBuildingId, movingBuildingId, zoom, isBlueprintMode, hoveredExpansionDirection } = gameState;
    
    const [viewOffset, setViewOffset] = useState({ x: -200, y: -900 });
    const [mouseGridPos, setMouseGridPos] = useState({ x: -1, y: -1 });

    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const dragState = useRef({ isDragging: false, startX: 0, startY: 0, initialViewOffsetX: 0, initialViewOffsetY: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        // Make canvas large enough for the whole grid plus a buffer
        const canvasWidth = (GRID_COLS + GRID_ROWS) * TILE_WIDTH / 2 + SPRITE_SIZE * 2;
        const canvasHeight = (GRID_COLS + GRID_ROWS) * TILE_HEIGHT / 2 + SPRITE_SIZE * 2;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        
        const terrainImage = new Image();
        terrainImage.src = SPRITESHEET_URL;

        terrainImage.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Translate context to handle negative isometric coordinates and center the drawing
            const xOffset = (GRID_ROWS) * TILE_WIDTH / 2 + SPRITE_SIZE;
            const yOffset = SPRITE_SIZE; // A bit of top padding for sprites
            ctx.translate(xOffset, yOffset);

            for (let row = 0; row < GRID_ROWS; row++) {
                for (let col = 0; col < GRID_COLS; col++) {
                    const isoX = (col - row) * (TILE_WIDTH / 2);
                    const isoY = (col + row) * (TILE_HEIGHT / 2);
                    
                    const hash = Math.abs((col * 13) ^ (row * 31));
                    
                    // Base grass tile
                    const baseSpriteIndex = hash % TERRAIN_SPRITES.grass.length;
                    const baseSprite = TERRAIN_SPRITES.grass[baseSpriteIndex];
                    ctx.drawImage(
                        terrainImage,
                        baseSprite.x, baseSprite.y, SPRITE_SIZE, SPRITE_SIZE, // Source rect
                        isoX - SPRITE_SIZE / 2, isoY - SPRITE_SIZE * 0.75, SPRITE_SIZE, SPRITE_SIZE // Destination rect, accounting for sprite anchor point
                    );

                    // 15% chance for a decoration tile
                    if ((hash % 100) < 15) {
                        const decorationIndex = Math.abs((col * 7) ^ (row * 19)) % TERRAIN_SPRITES.decoration.length;
                        const decorationSprite = TERRAIN_SPRITES.decoration[decorationIndex];
                        ctx.drawImage(
                            terrainImage,
                            decorationSprite.x, decorationSprite.y, SPRITE_SIZE, SPRITE_SIZE,
                            isoX - SPRITE_SIZE / 2, isoY - SPRITE_SIZE * 0.75, SPRITE_SIZE, SPRITE_SIZE
                        );
                    }
                }
            }
        };

        terrainImage.onerror = () => {
            console.error("Failed to load terrain spritesheet.");
        }
    }, []); // Run only once on mount

    const occupiedCells = useMemo(() => {
        const occupied = new Set();
        buildings.forEach(b => {
            // Don't count the building being moved as occupied
            if (movingBuildingId === b.instanceId) return;
            for (let r = 0; r < b.height; r++) {
                for (let c = 0; c < b.width; c++) {
                    occupied.add(`${b.y + r}-${b.x + c}`);
                }
            }
        });
        return occupied;
    }, [buildings, movingBuildingId]);

    const checkPlacementValidity = (gridX, gridY, buildingType) => {
        if (!buildingType) return false;
        const buildingInfo = BUILDINGS.find(b => b.id === buildingType);
        if (!buildingInfo) return false;

        const buildingWidth = buildingInfo.width;
        const buildingHeight = buildingInfo.height;
        
        // The valid buildable area is *inside* the walls.
        const buildableX1 = wallBounds.x1 + 1;
        const buildableY1 = wallBounds.y1 + 1;
        const buildableX2 = wallBounds.x2 - 1;
        const buildableY2 = wallBounds.y2 - 1;

        for (let r = 0; r < buildingHeight; r++) {
            for (let c = 0; c < buildingWidth; c++) {
                const checkX = gridX + c;
                const checkY = gridY + r;
                 
                 // Check if the cell is occupied or outside the buildable area
                 if (occupiedCells.has(`${checkY}-${checkX}`) || 
                     checkY < buildableY1 || 
                     checkY >= buildableY2 || 
                     checkX < buildableX1 || 
                     checkX >= buildableX2) {
                    return false;
                }
            }
        }
        return true;
    }


    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.target instanceof Element && (e.target.closest('[data-interactive="true"]') || buildMode.isActive)) {
            return;
        }
        e.preventDefault();
        dragState.current = {
            isDragging: true,
            startX: e.clientX,
            startY: e.clientY,
            initialViewOffsetX: viewOffset.x,
            initialViewOffsetY: viewOffset.y
        };
        if (containerRef.current) {
            containerRef.current.style.cursor = 'grabbing';
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (dragState.current.isDragging) {
            const dx = e.clientX - dragState.current.startX;
            const dy = e.clientY - dragState.current.startY;
            setViewOffset({
                x: dragState.current.initialViewOffsetX + dx / zoom,
                y: dragState.current.initialViewOffsetY + dy / zoom,
            });
        }

         if (buildMode.isActive && containerRef.current) {
            const buildingInfo = BUILDINGS.find(b => b.id === buildMode.buildingType);

            const rect = containerRef.current.getBoundingClientRect();
            // Convert screen mouse coordinates to world coordinates
            const mouseX = (e.clientX - rect.left - rect.width / 2) / zoom - viewOffset.x;
            const mouseY = (e.clientY - rect.top - rect.height / 2) / zoom - viewOffset.y;
            
            // Convert world coordinates to isometric grid coordinates
            let col = Math.round((mouseX / (TILE_WIDTH / 2) + mouseY / (TILE_HEIGHT / 2)) / 2);
            let row = Math.round((mouseY / (TILE_HEIGHT / 2) - mouseX / (TILE_WIDTH / 2)) / 2);

            setMouseGridPos({ x: col, y: row });
        }
    };
    
    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const zoomSpeed = 0.1;
        
        if (e.deltaY < 0) { // zoom in
            setZoom(prev => prev + zoomSpeed);
        } else { // zoom out
            setZoom(prev => prev - zoomSpeed);
        }
    }


    const stopDragging = () => {
        if (dragState.current.isDragging) {
            dragState.current.isDragging = false;
            if (containerRef.current) {
                containerRef.current.style.cursor = buildMode.isActive ? 'copy' : 'grab';
            }
        }
    };

    const handleClick = () => {
        if (buildMode.isActive && buildMode.buildingType) {
            const isPlacementValid = checkPlacementValidity(mouseGridPos.x, mouseGridPos.y, buildMode.buildingType);

            if(isPlacementValid) {
                placeBuilding(buildMode.buildingType, mouseGridPos.x, mouseGridPos.y);
            } else {
                cancelBuildMode();
            }
        } else if (selectedBuildingId) {
            selectBuilding(null); // Deselect if clicking on empty ground
        }
    }

    const elements: React.ReactNode[] = [];

    // Render construction sites first so they are under everything else
    wallConstructions.forEach(construction => {
        const { direction } = construction;
        let startX, startY, endX, endY;
        
        switch (direction) {
            case 'top': startX = wallBounds.x1; endX = wallBounds.x2; startY = wallBounds.y1 - 2; endY = wallBounds.y1; break;
            case 'bottom': startX = wallBounds.x1; endX = wallBounds.x2; startY = wallBounds.y2; endY = wallBounds.y2 + 2; break;
            case 'left': startX = wallBounds.x1 - 2; endX = wallBounds.x1; startY = wallBounds.y1; endY = wallBounds.y2; break;
            case 'right': startX = wallBounds.x2; endX = wallBounds.x2 + 2; startY = wallBounds.y1; endY = wallBounds.y2; break;
        }

        for (let r = startY; r < endY; r++) {
            for (let c = startX; c < endX; c++) {
                const isoX = (c - r) * (TILE_WIDTH / 2);
                const isoY = (c + r) * (TILE_HEIGHT / 2);
                elements.push(
                    <div
                        key={`ground-${direction}-${r}-${c}`}
                        className="absolute bg-gray-500/20"
                        style={{
                            transform: `translate(${isoX - TILE_WIDTH / 2}px, ${isoY}px)`,
                            width: `${TILE_WIDTH}px`,
                            height: `${TILE_HEIGHT}px`,
                            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                            zIndex: 0,
                        }}
                    />
                );
            }
        }
    });
    
    // Render Shops
    const centerCol = Math.floor((wallBounds.x1 + wallBounds.x2) / 2);
    const buildingsRow = wallBounds.y2 + 4;
    const buildingGap = 4.5;

    const shops = [
        { key: 'armorer', icon: ICONS.Shops.Armorer({}), title: 'Armorer', onClick: openArmorerModal, colOffset: -buildingGap * 2, size: 150 },
        { key: 'blacksmith', icon: ICONS.Shops.Blacksmith({}), title: 'Master Blacksmith', onClick: openBlacksmithModal, colOffset: -buildingGap, size: 150 },
        { key: 'affluence', icon: ICONS.Shops.WheelOfAffluence({}), title: 'Wheel of Unimaginable Affluence', onClick: openWheelOfAffluenceModal, colOffset: 0, size: 180 },
        { key: 'nomad', icon: ICONS.Shops.NomadCamp({}), title: 'Herald of Nomad Camps', onClick: openNomadEventModal, colOffset: buildingGap, size: 150 },
        { key: 'trader', icon: ICONS.Shops.EquipmentTrader({}), title: 'Equipment Trader', onClick: openEquipmentTraderModal, colOffset: buildingGap * 2, size: 150 },
    ];

    if (!isBlueprintMode) {
        shops.forEach(shop => {
            const shopCol = centerCol + shop.colOffset;
            const shopRow = buildingsRow;
            const isoX = (shopCol - shopRow) * (TILE_WIDTH / 2);
            const isoY = (shopCol + shopRow) * (TILE_HEIGHT / 2);
            const zIndex = shopRow + Math.floor(shopCol);

            const shopStyle: React.CSSProperties = {
                position: 'absolute',
                left: `${isoX}px`,
                top: `${isoY}px`,
                width: `${shop.size}px`,
                height: `${shop.size}px`,
                zIndex: zIndex,
                transform: 'translateX(-50%) translateY(-70%)',
            };

            elements.push(
                <div 
                    key={`${shop.key}-shop`} 
                    style={shopStyle}
                    className="group cursor-pointer"
                    onClick={shop.onClick}
                    data-interactive="true"
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-max text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <h3 className="text-3xl font-black text-white" style={{ textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' }}>
                            {shop.title}
                        </h3>
                        <p className="text-xl font-bold text-white" style={{ textShadow: '1px 1px 2px #000' }}>
                            Click to talk
                        </p>
                    </div>
                    <div className="w-full h-full transition-transform duration-200 group-hover:scale-110">
                        {shop.icon}
                    </div>
                </div>
            );
        });
    }

    // Render Corner Towers
    const cornerPositions = [
        { col: wallBounds.x1, row: wallBounds.y1 }, // Top-Left
        { col: wallBounds.x2 - 1, row: wallBounds.y1 }, // Top-Right
        { col: wallBounds.x1, row: wallBounds.y2 - 1 }, // Bottom-Left
        { col: wallBounds.x2 - 1, row: wallBounds.y2 - 1 }, // Bottom-Right
    ];
    
    if (!isBlueprintMode) {
        cornerPositions.forEach(pos => {
            const { col, row } = pos;
            const isoX = (col - row) * (TILE_WIDTH / 2);
            const isoY = (col + row) * (TILE_HEIGHT / 2);
            const zIndex = row + col + 5; // To be on top of ground/walls at that z-index

            const towerContainerStyle: React.CSSProperties = {
                position: 'absolute',
                transform: `translate(${isoX - TOWER_IMAGE_WIDTH / 2}px, ${isoY + TILE_HEIGHT / 2 - (TOWER_IMAGE_HEIGHT - 14)}px)`,
                width: `${TOWER_IMAGE_WIDTH}px`,
                height: `${TOWER_IMAGE_HEIGHT}px`,
                zIndex: zIndex,
                pointerEvents: 'none',
            };
            
            const isSideCorner = (col === wallBounds.x1 && row === wallBounds.y2 - 1) || (col === wallBounds.x2 - 1 && row === wallBounds.y1);
            
            const imageStyle: React.CSSProperties = {
                imageRendering: 'crisp-edges',
                transform: isSideCorner ? 'scaleX(-1)' : 'none',
            };


            elements.push(
                <div key={`tower-${row}-${col}`} style={towerContainerStyle}>
                    <img src={TOWER_IMAGE_URL} alt="Castle Tower" className="w-full h-full object-contain" style={imageStyle} />
                </div>
            );
        });
    }

    // Render Walls and Build Grid
    for (let row = 0; row < GRID_ROWS; row++) {
        for (let col = 0; col < GRID_COLS; col++) {
            const isoX = (col - row) * (TILE_WIDTH / 2);
            const isoY = (col + row) * (TILE_HEIGHT / 2);
            const zIndex = row + col;

            const isInside = row >= wallBounds.y1 && row < wallBounds.y2 && col >= wallBounds.x1 && col < wallBounds.x2;
            if (!isInside) continue;
            
            const isCorner = cornerPositions.some(p => p.col === col && p.row === row);

            if (occupiedCells.has(`${row}-${col}`) || isCorner) {
                 if(buildMode.isActive && !isCorner) { // Render grid over occupied tiles too
                     elements.push(
                        <div
                            key={`grid-${row}-${col}`}
                            className="absolute border border-black/10"
                            style={{
                                transform: `translate(${isoX - TILE_WIDTH / 2}px, ${isoY}px)`,
                                width: `${TILE_WIDTH}px`,
                                height: `${TILE_HEIGHT}px`,
                                clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                                zIndex: 5000,
                            }}
                        />
                    );
                }
                continue;
            }

            const isTopWall = row === wallBounds.y1 && col > wallBounds.x1 + 2 && col < wallBounds.x2 - 3;
            const isBottomWall = row === wallBounds.y2 - 1 && col > wallBounds.x1 + 2 && col < wallBounds.x2 - 3;
            const isLeftWall = col === wallBounds.x1 && row > wallBounds.y1 + 2 && row < wallBounds.y2 - 3;
            const isRightWall = col === wallBounds.x2 - 1 && row > wallBounds.y1 + 2 && row < wallBounds.y2 - 3;
            
            const isWallBoundary = row === wallBounds.y1 || row === wallBounds.y2 - 1 || col === wallBounds.x1 || col === wallBounds.x2 - 1;
            const isWall = isTopWall || isBottomWall || isLeftWall || isRightWall;
            
            const midY = Math.floor((wallBounds.y1 + wallBounds.y2) / 2);
            const midX = Math.floor((wallBounds.x1 + wallBounds.x2) / 2);

            let expansionDirection = null;
            
            const isOriginalTopWall = row === wallBounds.y1 && col === midX;
            const isOriginalBottomWall = row === wallBounds.y2 - 1 && col === midX;
            const isOriginalLeftWall = col === wallBounds.x1 && row === midY;
            const isOriginalRightWall = col === wallBounds.x2 - 1 && row === midY;

            if (isOriginalLeftWall) expansionDirection = 'left';
            else if (isOriginalRightWall) expansionDirection = 'right';
            else if (isOriginalTopWall) expansionDirection = 'top';
            else if (isOriginalBottomWall) expansionDirection = 'bottom';
            
            const isJoint = expansionDirection !== null && wallExpansionCount[expansionDirection] < 4 && !wallConstructions.some(c => c.direction === expansionDirection);

            if (isWallBoundary) {
                if (isBlueprintMode) {
                    const skeletonWallStyle: React.CSSProperties = {
                        position: 'absolute',
                        transform: `translate(${isoX - TILE_WIDTH / 2}px, ${isoY}px)`,
                        width: `${TILE_WIDTH}px`,
                        height: `${TILE_HEIGHT}px`,
                        clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                        backgroundImage: `repeating-linear-gradient(45deg, rgba(255,255,255,0.7), rgba(255,255,255,0.7) 1px, transparent 1px, transparent 5px)`,
                        zIndex,
                    };
                    elements.push(<div key={`skeleton-wall-${row}-${col}`} style={skeletonWallStyle}></div>);
                } else if (isWall) {
                    const useAltImage = isTopWall || isLeftWall;
                    const imageUrl = useAltImage ? ALT_WALL_IMAGE_URL : WALL_IMAGE_URL;
                    const imageWidth = useAltImage ? ALT_WALL_IMAGE_WIDTH : WALL_IMAGE_WIDTH;
                    const imageHeight = useAltImage ? ALT_WALL_IMAGE_HEIGHT : WALL_IMAGE_HEIGHT;
                    const isVerticalSegment = col === wallBounds.x1 || col === wallBounds.x2 - 1;
                    
                    const wallContainerStyle: React.CSSProperties = {
                        position: 'absolute',
                        transform: `translate(${isoX - imageWidth / 2}px, ${isoY + TILE_HEIGHT / 2 - (imageHeight - 14)}px)`,
                        width: `${imageWidth}px`,
                        height: `${imageHeight}px`,
                        zIndex: zIndex,
                        pointerEvents: 'none',
                    };
                    
                    elements.push(
                        <div key={`wall-${row}-${col}`} className="absolute group" style={wallContainerStyle}>
                            <img src={imageUrl} alt="Wall" className="w-full h-full object-contain" style={{ transform: isVerticalSegment ? 'scaleX(-1)' : '' }} />
                        </div>
                    );
                }
            } else { 
                 if (buildMode.isActive || isBlueprintMode) {
                    elements.push(
                        <div
                            key={`grid-${row}-${col}`}
                            className="absolute border border-black/20"
                            style={{
                                transform: `translate(${isoX - TILE_WIDTH / 2}px, ${isoY}px)`,
                                width: `${TILE_WIDTH}px`,
                                height: `${TILE_HEIGHT}px`,
                                clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                                zIndex: 1, // Keep grid below buildings
                            }}
                        />
                    );
                }
            }

            if (isJoint) {
                const jointContainerStyle: React.CSSProperties = {
                   position: 'absolute',
                   transform: `translate(${isoX - TILE_WIDTH/2}px, ${isoY}px)`,
                   width: `${TILE_WIDTH}px`,
                   height: `${TILE_HEIGHT}px`,
                   zIndex: zIndex + 1,
                   pointerEvents: 'auto',
               };

               let expansionNumber = 0;
               switch(expansionDirection) {
                   case 'top': expansionNumber = 1; break;
                   case 'right': expansionNumber = 2; break;
                   case 'bottom': expansionNumber = 3; break;
                   case 'left': expansionNumber = 4; break;
               }

                elements.push(
                   <div
                       key={`joint-${row}-${col}`}
                       className={`absolute group cursor-pointer flex items-center justify-center`}
                       style={jointContainerStyle}
                       onClick={(e) => { 
                           e.stopPropagation(); 
                           if (canAfford(WALL_EXPANSION_COST)) {
                               expandWalls(expansionDirection as 'top' | 'bottom' | 'left' | 'right');
                           } else {
                               const rect = e.currentTarget.getBoundingClientRect();
                               const position = { top: rect.top, left: rect.left + rect.width / 2 };
                               showResourceDenialTooltip(WALL_EXPANSION_COST, position);
                           }
                       }}
                       onMouseEnter={() => setHoveredExpansionDirection(expansionDirection as 'top' | 'bottom' | 'left' | 'right')}
                       onMouseLeave={() => setHoveredExpansionDirection(null)}
                       data-interactive="true"
                       title={'Expand Wall'}
                   >
                       <div className="w-10 h-10 text-white bg-amber-500/50 group-hover:bg-amber-400/70 transition-colors rounded-full flex items-center justify-center font-bold text-xl">
                           {expansionNumber}
                       </div>
                   </div>
               );
           }
        }
    }
    
    // Render Buildings
    const buildingIcons: {[key: string]: React.ReactNode} = {
        keep: ICONS.BuildingIcons.Keep({}),
        hut: ICONS.BuildingIcons.Hut({}),
        farm: ICONS.BuildingIcons.Farm({}),
        lumber_mill: ICONS.BuildingIcons.LumberMill({}),
        quarry: ICONS.BuildingIcons.Quarry({}),
        gold_mine: ICONS.BuildingIcons.GoldMine({}),
        house: ICONS.BuildingIcons.House({}),
        barracks: ICONS.BuildingIcons.Barracks({}),
        tools_workshop: ICONS.BuildingIcons.ToolsWorkshop({}),
        wall: ICONS.BuildingIcons.Wall({}),
        rookery: ICONS.BuildingIcons.Rookery({}),
        // New buildings
        townhouse: ICONS.BuildingIcons.Townhouse({}),
        master_builder: ICONS.BuildingIcons.MasterBuilder({}),
        forest_lodge: ICONS.BuildingIcons.ForestLodge({}),
        granary: ICONS.BuildingIcons.Granary({}),
        hunting_lodge: ICONS.BuildingIcons.HuntingLodge({}),
        imperial_council_hall: ICONS.BuildingIcons.ImperialCouncilHall({}),
        reinforced_vault: ICONS.BuildingIcons.ReinforcedVault({}),
        iron_mine: ICONS.BuildingIcons.IronMine({}),
        ironworks: ICONS.BuildingIcons.Ironworks({}),
        moo_manor: ICONS.BuildingIcons.MooManor({}),
        relic_woodcutter: ICONS.BuildingIcons.RelicWoodcutter({}),
        stoneworks: ICONS.BuildingIcons.Stoneworks({}),
        deco_fountain: ICONS.BuildingIcons.DecoFountain({}),
        deco_statue: ICONS.BuildingIcons.DecoStatue({}),
        deco_garden: ICONS.BuildingIcons.DecoGarden({}),
        deco_well: ICONS.BuildingIcons.DecoWell({}),
        deco_flag: ICONS.BuildingIcons.DecoFlag({}),
        deco_banner: ICONS.BuildingIcons.DecoBanner({}),
        bakery: ICONS.BuildingIcons.Bakery({}),
        defense_workshop: ICONS.BuildingIcons.DefenseWorkshop({}),
        dragon_breath_forge: ICONS.BuildingIcons.DragonBreathForge({}),
        dragon_hoard: ICONS.BuildingIcons.DragonHoard({}),
        encampment: ICONS.BuildingIcons.Encampment({}),
        estate: ICONS.BuildingIcons.Estate({}),
        firestation: ICONS.BuildingIcons.Firestation({}),
        flourmill: ICONS.BuildingIcons.Flourmill({}),
        forge: ICONS.BuildingIcons.Forge({}),
        relic_honey_garden: ICONS.BuildingIcons.RelicHoneyGarden({}),
        marketplace: ICONS.BuildingIcons.Marketplace({}),
        military_academy: ICONS.BuildingIcons.MilitaryAcademy({}),
        military_hospital: ICONS.BuildingIcons.MilitaryHospital({}),
        refinery: ICONS.BuildingIcons.Refinery({}),
        relic_barrel_workshop: ICONS.BuildingIcons.RelicBarrelWorkshop({}),
        relic_brewery: ICONS.BuildingIcons.RelicBrewery({}),
        relic_conservatory: ICONS.BuildingIcons.RelicConservatory({}),
        relic_greenhouse: ICONS.BuildingIcons.RelicGreenhouse({}),
        relic_mead_distillery: ICONS.BuildingIcons.RelicMeadDistillery({}),
        siege_workshop: ICONS.BuildingIcons.SiegeWorkshop({}),
        stables: ICONS.BuildingIcons.Stables({}),
        storehouse: ICONS.BuildingIcons.Storehouse({}),
        tavern: ICONS.BuildingIcons.Tavern({}),
        university: ICONS.BuildingIcons.University({}),
        willow_of_experience: ICONS.BuildingIcons.WillowOfExperience({}),
        watchtower: ICONS.BuildingIcons.Watchtower({}),
    };
    
    let selectedBuildingElement = null;

    buildings.forEach(b => {
        if (movingBuildingId === b.instanceId) {
            return; // Don't render the building being moved (it's a ghost now)
        }

        const buildingInfo = BUILDINGS.find(info => info.id === b.type);

        const centerX = b.x + b.width / 2;
        const centerY = b.y + b.height / 2;
        
        const isoX = (centerX - centerY) * (TILE_WIDTH / 2);
        const isoY = (centerX + centerY) * (TILE_HEIGHT / 2);
        
        const zIndex = Math.floor(b.y + b.height) * GRID_COLS + Math.floor(b.x + b.width);
        const isSelected = selectedBuildingId === b.instanceId;
        
        let buildingRenderElement;

        if (isBlueprintMode) {
             const categoryColor = 
                buildingInfo?.category === BuildingCategory.Economy ? 'rgba(255, 215, 0, 0.5)' :
                buildingInfo?.category === BuildingCategory.Military ? 'rgba(220, 20, 60, 0.5)' :
                buildingInfo?.category === BuildingCategory.Civil ? 'rgba(135, 206, 235, 0.5)' :
                'rgba(128, 128, 128, 0.5)';
            
            const blueprintFootprint: React.ReactNode[] = [];
            for (let r = 0; r < b.height; r++) {
                for (let c = 0; c < b.width; c++) {
                    const tileX = b.x + c;
                    const tileY = b.y + r;
                    const tileIsoX = (tileX - tileY) * (TILE_WIDTH / 2);
                    const tileIsoY = (tileX + tileY) * (TILE_HEIGHT / 2);
                    
                    const blueprintTileStyle: React.CSSProperties = {
                        transform: `translate(${tileIsoX - TILE_WIDTH / 2}px, ${tileIsoY}px)`,
                        width: `${TILE_WIDTH}px`,
                        height: `${TILE_HEIGHT}px`,
                        clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                        backgroundColor: categoryColor,
                        border: `1px solid ${categoryColor.replace('0.5', '0.9')}`,
                        zIndex: tileY + tileX,
                    };

                    blueprintFootprint.push(<div key={`blueprint-${b.instanceId}-${r}-${c}`} className="absolute" style={blueprintTileStyle}></div>);
                }
            }
            buildingRenderElement = <React.Fragment key={b.instanceId}>{blueprintFootprint}</React.Fragment>;
        } else if (b.type === 'wall') {
            const wallStyle: React.CSSProperties = {
                position: 'absolute',
                transform: `translate(${isoX - WALL_IMAGE_WIDTH / 2}px, ${isoY + TILE_HEIGHT / 2 - (WALL_IMAGE_HEIGHT - 14)}px)`,
                width: `${WALL_IMAGE_WIDTH}px`,
                height: `${WALL_IMAGE_HEIGHT}px`,
                zIndex: zIndex,
                pointerEvents: 'none',
            };

            buildingRenderElement = (
                 <div key={b.instanceId} style={wallStyle} className={isSelected ? 'brightness-110' : ''}>
                    <img 
                        src={WALL_IMAGE_URL} 
                        alt="Wall" 
                        className="w-full h-full object-contain"
                        style={{ transform: b.isFlipped ? 'scaleX(-1)' : '' }}
                    />
                     <div 
                        data-interactive="true"
                        className="absolute inset-0 cursor-pointer"
                        style={{pointerEvents: 'auto'} as React.CSSProperties}
                        onClick={(e) => {
                            e.stopPropagation();
                            selectBuilding(b.instanceId);
                        }}
                    />
                </div>
            );
             if (isSelected) {
                const ringX = isoX;
                const ringY = isoY;
                selectedBuildingElement = (
                    <React.Fragment key={`selected-${b.instanceId}`}>
                        {buildingRenderElement}
                        <div style={{ position: 'absolute', left: ringX, top: ringY, zIndex: 9998 }}>
                           <InteractionRing buildingInstanceId={selectedBuildingId} onClose={() => selectBuilding(null)} />
                        </div>
                    </React.Fragment>
                );
            }

        } else {
            const vizWidth = buildingInfo?.visualWidth ?? (b.width + b.height) * 20;
            const vizHeight = buildingInfo?.visualHeight ?? (b.width + b.height) * 20;

            const buildingStyle: React.CSSProperties = {
                position: 'absolute',
                left: `${isoX}px`,
                top: `${isoY}px`,
                width: `${vizWidth}px`,
                height: `${vizHeight}px`,
                zIndex: zIndex,
                transform: `translateX(-50%) translateY(-${vizHeight * 0.75}px) ${b.isFlipped ? 'scaleX(-1)' : ''}`,
                pointerEvents: 'none',
            };

            const icon = buildingIcons[b.type];
            if (icon) {
                buildingRenderElement = (
                     <div key={b.instanceId} style={buildingStyle} className={isSelected ? 'filter brightness-110' : ''}>
                        <div className="relative w-full h-full">
                            {icon}
                             <div 
                                data-interactive="true"
                                className="absolute inset-0 cursor-pointer"
                                style={{pointerEvents: 'auto', transform: b.isFlipped ? 'scaleX(-1)' : ''} as React.CSSProperties}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    selectBuilding(b.instanceId);
                                }}
                            />
                        </div>
                    </div>
                );
                
                if (isSelected) {
                    const ringX = isoX;
                    const ringY = isoY - vizHeight / 2.5;
                    selectedBuildingElement = (
                        <React.Fragment key={`selected-${b.instanceId}`}>
                            {buildingRenderElement}
                            <div style={{ position: 'absolute', left: ringX, top: ringY, zIndex: 9998 }}>
                               <InteractionRing buildingInstanceId={selectedBuildingId} onClose={() => selectBuilding(null)} />
                            </div>
                        </React.Fragment>
                    );
                }
            }
        }

        if (!isSelected && buildingRenderElement) {
            elements.push(buildingRenderElement);
        }
    });

    // Render selected building last to ensure ring is on top
    if(selectedBuildingElement) elements.push(selectedBuildingElement);


    // Render build mode ghost and validity highlights
    if (buildMode.isActive && buildMode.buildingType) {
        const b = BUILDINGS.find(b => b.id === buildMode.buildingType);
        if (b) {
            const centerX = mouseGridPos.x + b.width / 2;
            const centerY = mouseGridPos.y + b.height / 2;
            
            const isoX = (centerX - centerY) * (TILE_WIDTH / 2);
            const isoY = (centerX + centerY) * (TILE_HEIGHT / 2);
            
            if (b.id === 'wall' && !isBlueprintMode) {
                 const wallGhostStyle: React.CSSProperties = {
                    position: 'absolute',
                    transform: `translate(${isoX - WALL_IMAGE_WIDTH / 2}px, ${isoY + TILE_HEIGHT / 2 - (WALL_IMAGE_HEIGHT - 14)}px)`,
                    width: `${WALL_IMAGE_WIDTH}px`,
                    height: `${WALL_IMAGE_HEIGHT}px`,
                    zIndex: 9999,
                    opacity: 0.7,
                    pointerEvents: 'none',
                };
                elements.push(
                    <div key="ghost" style={wallGhostStyle}>
                        <img 
                            src={WALL_IMAGE_URL} 
                            alt="Wall Ghost" 
                            className="w-full h-full object-contain"
                            style={{ transform: buildMode.isGhostFlipped ? 'scaleX(-1)' : '' }}
                        />
                    </div>
                );
            } else if (!isBlueprintMode) {
                const vizWidth = b?.visualWidth ?? (b.width + b.height) * 20;
                const vizHeight = b?.visualHeight ?? (b.width + b.height) * 20;

                const buildingStyle: React.CSSProperties = {
                    position: 'absolute',
                    left: `${isoX}px`,
                    top: `${isoY}px`,
                    width: `${vizWidth}px`,
                    height: `${vizHeight}px`,
                    zIndex: 9999,
                    transform: `translateX(-50%) translateY(-${vizHeight * 0.75}px) ${buildMode.isGhostFlipped ? 'scaleX(-1)' : ''}`,
                    opacity: 0.7,
                    pointerEvents: 'none',
                };
                elements.push(<div key="ghost" style={buildingStyle}>{buildingIcons[b.id]}</div>);
            }
            
            // Placement validity tiles
            const isPlacementValid = checkPlacementValidity(mouseGridPos.x, mouseGridPos.y, b.id);
            for (let r = 0; r < b.height; r++) {
                for (let c = 0; c < b.width; c++) {
                    const tileX = mouseGridPos.x + c;
                    const tileY = mouseGridPos.y + r;
                    const tileIsoX = (tileX - tileY) * (TILE_WIDTH / 2);
                    const tileIsoY = (tileX + tileY) * (TILE_HEIGHT / 2);
                    elements.push(
                        <div
                            key={`highlight-${r}-${c}`}
                            className={`absolute ${isPlacementValid ? 'bg-green-500/40' : 'bg-red-500/40'}`}
                            style={{
                                transform: `translate(${tileIsoX - TILE_WIDTH / 2}px, ${isoY}px)`,
                                width: `${TILE_WIDTH}px`,
                                height: `${TILE_HEIGHT}px`,
                                clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                                zIndex: 1000,
                            }}
                        />
                    );
                }
            }
        }
    }

    // Render Wall Expansion Hover Preview
    if (hoveredExpansionDirection && !isBlueprintMode) {
        const dir = hoveredExpansionDirection;
        
        // HoloExpansionSide1 is rectangular (for top/left walls).
        // HoloExpansionSide2 is diagonal (for bottom/right walls).
        const holoImage1 = ICONS.HoloExpansionSide1({ className: "w-full h-full object-contain opacity-60" });
        const holoImage2 = ICONS.HoloExpansionSide2({ className: "w-full h-full object-contain opacity-60" });
        const arrowImage1 = ICONS.ExpansionArrow1({ className: "w-full h-full object-contain" });
        const arrowImage2 = ICONS.ExpansionArrow2({ className: "w-full h-full object-contain" });
        
        const HOLO_WIDTH = 258;
        const HOLO_HEIGHT = 134;
        const ARROW_SIZE = 80;

        const midY = Math.floor((wallBounds.y1 + wallBounds.y2) / 2);
        const midX = Math.floor((wallBounds.x1 + wallBounds.x2) / 2);
        
        const baseStyle: React.CSSProperties = {
            position: 'absolute',
            pointerEvents: 'none',
        };

        const addElement = (key: string, c: number, r: number, width: number, height: number, transform: string, content: React.ReactNode, zIndex: number) => {
            const isoX = (c - r) * (TILE_WIDTH / 2);
            const isoY = (c + r) * (TILE_HEIGHT / 2);
            elements.push(
                 <div key={key} style={{
                    ...baseStyle,
                    left: `${isoX}px`, top: `${isoY}px`,
                    width: `${width}px`, height: `${height}px`,
                    transform: transform,
                    zIndex: zIndex || (r + c),
                } as React.CSSProperties}>{content}</div>
            );
        };

        switch (dir) {
            case 'top': {
                const holo_r = wallBounds.y1 - 1;
                const holo_c = midX;
                const arrow_r = wallBounds.y1;
                const arrow_c = midX;
                addElement('holo-top', holo_c, holo_r, HOLO_WIDTH, HOLO_HEIGHT, 'translate(-50%, -100%)', holoImage1, 9980);
                addElement('arrow-top', arrow_c, arrow_r, ARROW_SIZE, ARROW_SIZE, 'translate(-50%, -50%)', arrowImage2, 9990);
                break;
            }
            case 'bottom': {
                const holo_r = wallBounds.y2;
                const holo_c = midX;
                const arrow_r = wallBounds.y2 - 1;
                const arrow_c = midX;
                addElement('holo-bottom', holo_c, holo_r, HOLO_WIDTH, HOLO_HEIGHT, 'translate(-50%, 0%)', holoImage2, 9980);
                addElement('arrow-bottom', arrow_c, arrow_r, ARROW_SIZE, ARROW_SIZE, 'translate(-50%, -50%) scale(-1, -1)', arrowImage2, 9990);
                break;
            }
            case 'left': {
                const holo_c = wallBounds.x1 - 1;
                const holo_r = midY;
                const arrow_c = wallBounds.x1;
                const arrow_r = midY;
                addElement('holo-left', holo_c, holo_r, HOLO_WIDTH, HOLO_HEIGHT, 'translate(-50%, -50%) scaleX(-1)', holoImage1, 9980);
                addElement('arrow-left', arrow_c, arrow_r, ARROW_SIZE, ARROW_SIZE, 'translate(-50%, -50%) scale(-1, -1)', arrowImage1, 9990);
                break;
            }
            case 'right': {
                const holo_c = wallBounds.x2;
                const holo_r = midY;
                const arrow_c = wallBounds.x2 - 1;
                const arrow_r = midY;
                addElement('holo-right', holo_c, holo_r, HOLO_WIDTH, HOLO_HEIGHT, 'translate(-50%, -50%) scaleX(-1)', holoImage2, 9980);
                addElement('arrow-right', arrow_c, arrow_r, ARROW_SIZE, ARROW_SIZE, 'translate(-50%, -50%)', arrowImage1, 9990);
                break;
            }
        }
    }


    return (
        <div 
            ref={containerRef}
            className="absolute inset-0 flex items-center justify-center pointer-events-auto"
            style={{ cursor: buildMode.isActive ? 'copy' : 'grab', background: 'transparent' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={stopDragging}
            onMouseLeave={stopDragging}
            onClick={handleClick}
            onContextMenu={(e) => { e.preventDefault(); cancelBuildMode(); }}
            onWheel={handleWheel}
         >
            <div 
                className="relative" 
                style={{ 
                    transform: `scale(${zoom}) translate(${viewOffset.x}px, ${viewOffset.y}px)`,
                    transition: 'transform 0.1s ease-out'
                }}
            >
                <canvas
                    ref={canvasRef}
                    style={{
                        position: 'absolute',
                        left: `-${(GRID_ROWS) * TILE_WIDTH / 2 + SPRITE_SIZE}px`,
                        top: `-${SPRITE_SIZE}px`,
                        zIndex: -10,
                        pointerEvents: 'none',
                    }}
                />
                {elements}
            </div>
            {buildMode.isActive && buildMode.buildingType && (
                <div
                    className="absolute left-1/2 -translate-x-1/2"
                    style={{
                        bottom: '90px',
                        zIndex: 10000,
                    }}
                >
                    <PlacementControls />
                </div>
            )}
         </div>
    );
};
