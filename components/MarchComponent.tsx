
import React, { useState, useEffect, useRef } from 'react';
import { March } from '../types';
import { ICONS } from '../assets';

const MAP_DIMENSIONS = { width: 5000, height: 5000 };

interface MarchComponentProps {
    march: March;
}

const MarchComponent: React.FC<MarchComponentProps> = ({ march }) => {
    const [progress, setProgress] = useState(0);
    const pathRef = useRef<SVGPathElement>(null);
    const [pathLength, setPathLength] = useState(0);

    // Animate the progress of the march
    useEffect(() => {
        const updateProgress = () => {
            const p = (Date.now() - march.startTime) / (march.arrivalTime - march.startTime);
            setProgress(Math.min(1, p));
        };

        updateProgress();
        const intervalId = setInterval(updateProgress, 50);

        return () => clearInterval(intervalId);
    }, [march.startTime, march.arrivalTime]);

    // Set path length once the path element is rendered
    useEffect(() => {
        if (pathRef.current) {
            setPathLength(pathRef.current.getTotalLength());
        }
    }, [march.path]);

    // Don't render if progress is zero
    if (progress <= 0) {
        return null;
    }
    
    // --- Fallback to Bezier if no A* path exists ---
    if (!march.path || march.path.length === 0) {
        const startX = (march.startPosition.x / 100) * MAP_DIMENSIONS.width;
        const startY = (march.startPosition.y / 100) * MAP_DIMENSIONS.height;
        const endX = (march.endPosition.x / 100) * MAP_DIMENSIONS.width;
        const endY = (march.endPosition.y / 100) * MAP_DIMENSIONS.height;

        const dx = endX - startX;
        const dy = endY - startY;
        const curveFactor = 0.2;
        const midX = startX + dx / 2;
        const midY = startY + dy / 2;
        const controlX = midX - dy * curveFactor;
        const controlY = midY + dx * curveFactor;

        const t = progress;
        const currentX = Math.pow(1 - t, 2) * startX + 2 * (1 - t) * t * controlX + Math.pow(t, 2) * endX;
        const currentY = Math.pow(1 - t, 2) * startY + 2 * (1 - t) * t * controlY + Math.pow(t, 2) * endY;
        
        const dirX = 2 * (1 - t) * (controlX - startX) + 2 * t * (endX - controlX);
        const dirY = 2 * (1 - t) * (controlY - startY) + 2 * t * (endY - controlY);
        const armyAngleDeg = Math.atan2(dirY, dirX) * (180 / Math.PI);
        
        const trailControlX = (1 - t) * startX + t * controlX;
        const trailControlY = (1 - t) * startY + t * controlY;
        const trailPathData = `M ${startX},${startY} Q ${trailControlX},${trailControlY} ${currentX},${currentY}`;

        return (
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                <svg width="100%" height="100%" style={{ overflow: 'visible', zIndex: 1000 }}>
                    <path d={trailPathData} stroke="rgba(255, 100, 0, 0.7)" strokeWidth="20" strokeLinecap="round" fill="none" />
                </svg>
                <div style={{ position: 'absolute', left: `${currentX}px`, top: `${currentY}px`, width: '80px', height: '80px', transform: `translate(-50%, -50%) rotate(${armyAngleDeg}deg)`, zIndex: 1001 }}>
                    {ICONS.WorldMapIcons.MarchingArmy()}
                </div>
            </div>
        );
    }
    
    // --- A* Path Rendering ---
    const pathData = "M " + march.path
        .map(p => `${(p.x / 100) * MAP_DIMENSIONS.width},${(p.y / 100) * MAP_DIMENSIONS.height}`)
        .join(" L ");

    let armyPos = { x: 0, y: 0 };
    let armyAngleDeg = 0;

    if (pathRef.current && pathLength > 0) {
        const pointOnPath = pathRef.current.getPointAtLength(progress * pathLength);
        armyPos = { x: pointOnPath.x, y: pointOnPath.y };

        // Calculate angle by looking slightly ahead on the path
        const lookAheadPoint = pathRef.current.getPointAtLength(Math.min(pathLength, progress * pathLength + 1));
        const dirX = lookAheadPoint.x - armyPos.x;
        const dirY = lookAheadPoint.y - armyPos.y;
        armyAngleDeg = Math.atan2(dirY, dirX) * (180 / Math.PI);
    }
    
    const trailDashOffset = pathLength * (1 - progress);

    const armyStyle: React.CSSProperties = {
        position: 'absolute',
        left: `${armyPos.x}px`,
        top: `${armyPos.y}px`,
        width: '80px',
        height: '80px',
        transform: `translate(-50%, -50%) rotate(${armyAngleDeg}deg)`,
        zIndex: 1001,
        transition: 'left 0.05s linear, top 0.05s linear', // Smooths out the icon movement
    };
    
    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            <svg width="100%" height="100%" style={{ overflow: 'visible', zIndex: 1000 }}>
                 <defs>
                    <linearGradient id={`trail-grad-a-star-${march.id}`} gradientUnits="userSpaceOnUse" x1={march.startPosition.x} y1={march.startPosition.y} x2={march.endPosition.x} y2={march.endPosition.y}>
                        <stop offset="0%" stopColor="rgba(255, 100, 0, 0.1)" />
                        <stop offset="100%" stopColor="rgba(255, 100, 0, 0.85)" />
                    </linearGradient>
                </defs>
                {/* Invisible path to get measurements */}
                <path ref={pathRef} d={pathData} fill="none" />
                
                {/* Visible path trail */}
                <path 
                    d={pathData} 
                    stroke={`url(#trail-grad-a-star-${march.id})`}
                    strokeWidth="20"
                    strokeLinecap="round"
                    fill="none" 
                    strokeDasharray={pathLength}
                    strokeDashoffset={trailDashOffset}
                    style={{ transition: 'stroke-dashoffset 0.05s linear' }}
                />
            </svg>
            <div style={armyStyle}>
                {ICONS.WorldMapIcons.MarchingArmy()}
            </div>
        </div>
    );
};

export default MarchComponent;
