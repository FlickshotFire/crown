


import React, { useState, useRef, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { POIType, ResourceType, WorldMapPOI } from '../types';
import { ICONS } from '../assets';
import MarchComponent from './MarchComponent';

const MAP_DIMENSIONS = { width: 5000, height: 5000 };

const WorldMapInteractionRing = ({ poi, onClose }: { poi: WorldMapPOI, onClose: () => void }) => {
    const { gameState, prepareAttack, initiateSpyMission, addBookmark, removeBookmark, canAfford } = useGame();
    
    const isBookmarked = gameState.bookmarks.some((b: any) => b.id === poi.id);
    const hasRookery = gameState.buildings.some((b: any) => b.type === 'rookery');
    const spyCost = { [ResourceType.Coins]: 100 };
    const canSpy = hasRookery && canAfford(spyCost) && (poi.type === POIType.PlayerCastle || poi.type === POIType.CultistTower) && !poi.isPlayer && !poi.isBurnt;
    const canAttack = !poi.isPlayer && poi.type !== POIType.ResourceStone && !poi.isBurnt;

    const InteractionButton = ({ icon, position, title, onClick, disabled = false }: { icon: React.ReactNode, position: any, title: string, onClick: (e: React.MouseEvent) => void, disabled?: boolean }) => (
        <div
            className="absolute w-16 h-16 flex items-center justify-center transition-transform duration-200 ease-in-out hover:scale-110"
            style={position}
        >
            <button
                title={title}
                onClick={onClick}
                data-interactive="true"
                disabled={disabled}
                className="w-full h-full rounded-full bg-gradient-to-b from-slate-700 to-slate-900 border-2 border-slate-500 shadow-lg flex items-center justify-center text-white text-2xl disabled:grayscale disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
                {icon}
            </button>
        </div>
    );
    
    const handleAttack = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!canAttack) return;
        prepareAttack(poi);
        onClose();
    };

    const handleSpy = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!canSpy) return;
        initiateSpyMission(poi.id);
        onClose();
    };

    const handleBookmark = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isBookmarked) {
            removeBookmark(poi.id);
        } else {
            addBookmark(poi);
        }
    };

    const buttonPositions = {
        bookmark: { x: 0, y: -85 },   // Top
        attack: { x: 80, y: 60 },     // Bottom-right
        spy: { x: -80, y: 60 },      // Bottom-left
    };

    const buttonDefinitions = [
        // Top: Bookmark
        { key: 'bookmark', icon: <i className={`fas fa-bookmark ${isBookmarked ? 'text-yellow-400' : ''}`}></i>, onClick: handleBookmark, pos: buttonPositions.bookmark, title: isBookmarked ? 'Remove Bookmark' : 'Add Bookmark' },
        
        // Bottom-right: Attack
        canAttack && { key: 'attack', icon: <i className="fas fa-crosshairs"></i>, onClick: handleAttack, pos: buttonPositions.attack, title: 'Attack' },

        // Bottom-left: Spy
        { key: 'spy', icon: <i className="fas fa-paper-plane text-gray-400"></i>, onClick: handleSpy, pos: buttonPositions.spy, title: 'Spy', disabled: !canSpy },
    ];
    
    const buttons = buttonDefinitions.filter(Boolean);

    return (
        <div className="absolute w-0 h-0 flex items-center justify-center pointer-events-auto animate-fade-in-fast" data-interactive="true">
            {buttons.map((btn) => {
                return (
                    <InteractionButton
                        key={btn.key}
                        icon={btn.icon}
                        position={{ left: `${btn.pos.x}px`, top: `${btn.pos.y}px`, transform: 'translate(-50%, -50%)' }}
                        title={btn.title}
                        onClick={btn.onClick}
                        disabled={btn.disabled}
                    />
                );
            })}
             <style>{`
                @keyframes fade-in-fast {
                    from { opacity: 0; transform: scale(0.8); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in-fast {
                    animation: fade-in-fast 0.2s ease-out forwards;
                }
             `}</style>
        </div>
    );
};

interface POIComponentProps {
    poi: WorldMapPOI;
    isSelected: boolean;
    onClick: () => void;
}

const POIComponent = React.memo<POIComponentProps>(({ poi, isSelected, onClick }) => {
    const nameplateColor = poi.isPlayerName ? 'bg-[#f0e6c8] border-[#a1937f]' : 'bg-[#d8c8a8] border-[#8a7b66]';
    
    const poiWrapperStyle: React.CSSProperties = {
        position: 'absolute',
        transform: 'translate(-50%, -100%)',
        left: `${(poi.position.x / 100) * MAP_DIMENSIONS.width}px`,
        top: `${(poi.position.y / 100) * MAP_DIMENSIONS.height}px`,
        zIndex: Math.floor(poi.position.y),
        cursor: 'pointer',
    };

    if (poi.isPlayer) {
        poiWrapperStyle.filter = 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.9))';
    }

    return (
        <div
            data-interactive-poi="true"
            className="group"
            style={poiWrapperStyle}
            onClick={onClick}
        >
            <div className={`relative w-32 h-32 transition-transform duration-200 flex items-center justify-center group-hover:scale-110 ${isSelected ? 'scale-125' : ''}`}>
                <div className={`absolute -top-4 left-1/2 -translate-x-1/2 w-max max-w-xs p-1 px-3 rounded-md text-center text-[#5a4c3a] text-sm font-bold ${nameplateColor} border-2 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                    {poi.ownerName}
                </div>
                <div className="w-28 h-28">{poi.isBurnt ? ICONS.WorldMapIcons.BurntCultistTower({}) : poi.icon}</div>
                {poi.flagColor && !poi.isBurnt && (
                    <div className="absolute top-2 right-4 w-8 h-8 flex items-center justify-center">
                        {poi.flagColor === 'red' ? ICONS.FlagRed({}) : ICONS.FlagBlack({})}
                    </div>
                )}
                {poi.hasBirds && (
                    <div className="absolute -top-2 -left-2 text-black/70 text-lg animate-pulse">
                       <div className="absolute top-0 left-0 transform -rotate-12">{ICONS.Bird({})}</div>
                       <div className="absolute top-2 -right-4 transform scale-x-[-1] rotate-12">{ICONS.Bird({})}</div>
                    </div>
                )}
            </div>
        </div>
    );
});


const WorldMap = ({ selectedPOI, onSelectPOI }: { selectedPOI: WorldMapPOI | null, onSelectPOI: (poi: WorldMapPOI | null) => void }) => {
    const { gameState, setZoom, resetMapCenterTarget } = useGame();
    const { worldMapPOIs, zoom, mapCenterTarget } = gameState;

    const [viewOffset, setViewOffset] = useState({ x: 0, y: 0 });
    const [isTransitioning, setIsTransitioning] = useState(false);

    const dragState = useRef({ isDragging: false, startX: 0, startY: 0, initialViewOffsetX: 0, initialViewOffsetY: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    // Function to clamp offset within boundaries
    const clampOffset = (offset: {x: number, y: number}, currentZoom: number) => {
        const container = containerRef.current;
        if (!container) return offset;

        const mapWidthInView = MAP_DIMENSIONS.width * currentZoom;
        const mapHeightInView = MAP_DIMENSIONS.height * currentZoom;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        let minX = containerWidth - mapWidthInView;
        let maxX = 0;
        if (mapWidthInView < containerWidth) {
            minX = (containerWidth - mapWidthInView) / 2;
            maxX = minX;
        }

        let minY = containerHeight - mapHeightInView;
        let maxY = 0;
        if (mapHeightInView < containerHeight) {
            minY = (containerHeight - mapHeightInView) / 2;
            maxY = minY;
        }

        return {
            x: Math.max(minX, Math.min(maxX, offset.x)),
            y: Math.max(minY, Math.min(maxY, offset.y)),
        };
    };

    // Center map on initial load
    useEffect(() => {
        const container = containerRef.current;
        const playerCastle = worldMapPOIs.find((p: any) => p.isPlayer);
        if (container && playerCastle) {
            const initialTarget = playerCastle.position;
             const targetXOnMap = (initialTarget.x / 100) * MAP_DIMENSIONS.width;
            const targetYOnMap = (initialTarget.y / 100) * MAP_DIMENSIONS.height;

            const newViewOffsetX = (container.clientWidth / 2) - (targetXOnMap * zoom);
            const newViewOffsetY = (container.clientHeight / 2) - (targetYOnMap * zoom);
            
            setViewOffset(clampOffset({ x: newViewOffsetX, y: newViewOffsetY }, zoom));
        }
    }, []); // Empty dependency array means this runs once on mount

    useEffect(() => {
        if (mapCenterTarget) {
            const container = containerRef.current;
            if (!container) return;
            
            const { x, y } = mapCenterTarget;

            const targetXOnMap = (x / 100) * MAP_DIMENSIONS.width;
            const targetYOnMap = (y / 100) * MAP_DIMENSIONS.height;

            const newViewOffsetX = (container.clientWidth / 2) - (targetXOnMap * zoom);
            const newViewOffsetY = (container.clientHeight / 2) - (targetYOnMap * zoom);
            
            setIsTransitioning(true);
            setViewOffset(clampOffset({ x: newViewOffsetX, y: newViewOffsetY }, zoom));
            
            const timer = setTimeout(() => {
                setIsTransitioning(false);
                resetMapCenterTarget();
            }, 500); // Must match transition duration

            return () => clearTimeout(timer);
        }
    }, [mapCenterTarget, resetMapCenterTarget, zoom]);


    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.target instanceof Element && (e.target.closest('[data-interactive-poi="true"]') || e.target.closest('.pointer-events-auto'))) return;
        dragState.current = { isDragging: true, startX: e.clientX, startY: e.clientY, initialViewOffsetX: viewOffset.x, initialViewOffsetY: viewOffset.y };
        if (containerRef.current) containerRef.current.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!dragState.current.isDragging) return;
        const dx = e.clientX - dragState.current.startX;
        const dy = e.clientY - dragState.current.startY;
        
        const nextOffset = {
            x: dragState.current.initialViewOffsetX + dx,
            y: dragState.current.initialViewOffsetY + dy
        };
        
        setViewOffset(clampOffset(nextOffset, zoom));
    };
    
     const handleMouseUp = (e: React.MouseEvent) => {
        if (dragState.current.isDragging) {
            const dx = e.clientX - dragState.current.startX;
            const dy = e.clientY - dragState.current.startY;
            // If it was a short movement, treat as a click for deselection
            if (Math.abs(dx) < 5 && Math.abs(dy) < 5) {
                if (e.target instanceof Element && !e.target.closest('[data-interactive-poi="true"]')) {
                    onSelectPOI(null);
                }
            }
        }
        stopDragging();
    };

    const stopDragging = () => {
        dragState.current.isDragging = false;
        if (containerRef.current) containerRef.current.style.cursor = 'grab';
    };

    const handleWheel = (e: React.WheelEvent) => {
        if (e.target instanceof Element && e.target.closest('.pointer-events-auto')) return;
        e.preventDefault();

        const container = containerRef.current;
        if (!container) return;

        const zoomSpeed = 0.05;
        const oldZoom = zoom;
        const newZoom = e.deltaY < 0 ? oldZoom + zoomSpeed : oldZoom - zoomSpeed;

        const clampedNewZoom = Math.max(0.3, Math.min(2.0, newZoom));
        
        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Calculate new offset to zoom towards the mouse pointer
        const newOffsetX = mouseX - (mouseX - viewOffset.x) * (clampedNewZoom / oldZoom);
        const newOffsetY = mouseY - (mouseY - viewOffset.y) * (clampedNewZoom / oldZoom);

        setViewOffset(clampOffset({x: newOffsetX, y: newOffsetY}, clampedNewZoom));
        setZoom(clampedNewZoom);
    };

    const handlePOIClick = (poi: WorldMapPOI) => {
        if (selectedPOI?.id === poi.id) {
            onSelectPOI(null); // Toggle off if clicking the same POI
        } else {
            onSelectPOI(poi);
        }
    };

    const terrainStyle: React.CSSProperties = {
        backgroundImage: `url('https://i.ibb.co/7dDG0mpP/download.png')`,
        width: MAP_DIMENSIONS.width,
        height: MAP_DIMENSIONS.height,
        position: 'relative'
    };

    return (
        <div 
            ref={containerRef}
            className="w-full h-full bg-[#556041] overflow-hidden cursor-grab"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={stopDragging}
            onWheel={handleWheel}
        >
            <div
                className="absolute"
                style={{
                    width: MAP_DIMENSIONS.width,
                    height: MAP_DIMENSIONS.height,
                    transform: `translate(${viewOffset.x}px, ${viewOffset.y}px) scale(${zoom})`,
                    transformOrigin: 'top left',
                    transition: isTransitioning ? 'transform 0.5s ease-out' : 'none',
                }}
            >
               <div style={terrainStyle}>
                    {worldMapPOIs.map((poi: WorldMapPOI) => (
                        <POIComponent
                            key={poi.id}
                            poi={poi}
                            isSelected={selectedPOI?.id === poi.id}
                            onClick={() => handlePOIClick(poi)}
                        />
                    ))}
                    {gameState.marches.map((march: any) => (
                        <MarchComponent key={march.id} march={march} />
                    ))}
                    {selectedPOI && (
                        <div style={{
                            position: 'absolute',
                            left: `${(selectedPOI.position.x / 100) * MAP_DIMENSIONS.width}px`,
                            // The POI component's container is 128px high and anchored at its bottom-center (transformY(-100%)).
                            // To center the ring on the POI, we offset it upwards by half the container's height (64px).
                            // This corrects the previous hardcoded values that were misaligned.
                            top: `${(selectedPOI.position.y / 100) * MAP_DIMENSIONS.height - 64}px`,
                            zIndex: 10000,
                        }}>
                             <WorldMapInteractionRing poi={selectedPOI} onClose={() => onSelectPOI(null)} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WorldMap;