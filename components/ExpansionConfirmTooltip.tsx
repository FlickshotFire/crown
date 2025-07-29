
import React, { useState } from 'react';
import { Resources, ResourceType } from '../types';
import { ICONS } from '../assets';


// --- Start of Sprite Logic (Duplicated for modularity without new files) ---
const SPRITESHEET_URL = ICONS.CastleExpansionSprite as string;

const SPRITE_CONFIG = {
    tooltipBg: { x: 0, y: 0, width: 178, height: 130 },
    pointer: { x: 180, y: 0, width: 34, height: 20 },
    titleCost: { x: 0, y: 156, width: 44, height: 16 },
    iconSupplies: { x: 216, y: 0, width: 38, height: 38 },
    iconTools: { x: 256, y: 0, width: 38, height: 38 },
    buttonConfirm: { x: 296, y: 0, width: 90, height: 42 },
    buttonConfirmHover: { x: 296, y: 44, width: 90, height: 42 },
    buttonCancel: { x: 388, y: 0, width: 90, height: 42 },
    buttonCancelHover: { x: 388, y: 44, width: 90, height: 42 },
    digitBlack: [
        { x: 0, y: 198, width: 14 }, { x: 15, y: 198, width: 10 }, { x: 26, y: 198, width: 14 }, { x: 41, y: 198, width: 14 }, { x: 56, y: 198, width: 14 },
        { x: 71, y: 198, width: 14 }, { x: 86, y: 198, width: 14 }, { x: 101, y: 198, width: 14 }, { x: 116, y: 198, width: 14 }, { x: 131, y: 198, width: 14 },
    ],
    digitHeight: 20,
    digitRed: [
        { x: 0, y: 220, width: 14 }, { x: 15, y: 220, width: 10 }, { x: 26, y: 220, width: 14 }, { x: 41, y: 220, width: 14 }, { x: 56, y: 220, width: 14 },
        { x: 71, y: 220, width: 14 }, { x: 86, y: 220, width: 14 }, { x: 101, y: 220, width: 14 }, { x: 116, y: 220, width: 14 }, { x: 131, y: 220, width: 14 },
    ]
};
type SpriteName = keyof Omit<typeof SPRITE_CONFIG, 'digitBlack' | 'digitRed' | 'digitHeight'>;

const Sprite: React.FC<{ name: SpriteName; style?: React.CSSProperties; onClick?: (e: React.MouseEvent) => void; onMouseEnter?: () => void; onMouseLeave?: () => void; }> = ({ name, style = {}, onClick, onMouseEnter, onMouseLeave }) => {
    const config = SPRITE_CONFIG[name];
    if (!config) return null;
    return <div onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} style={{ backgroundImage: `url(${SPRITESHEET_URL})`, backgroundPosition: `-${config.x}px -${config.y}px`, width: `${config.width}px`, height: `${config.height}px`, cursor: onClick ? 'pointer': 'default', ...style }} />;
};

const SpriteNumber: React.FC<{ value: number; isRed: boolean; }> = ({ value, isRed }) => {
    const digits = String(value).split('').map(Number);
    const digitConfig = isRed ? SPRITE_CONFIG.digitRed : SPRITE_CONFIG.digitBlack;
    return (
        <div className="flex items-center">
            {digits.map((digit, index) => {
                const config = digitConfig[digit];
                if (!config) return null;
                return <div key={index} style={{ backgroundImage: `url(${SPRITESHEET_URL})`, backgroundPosition: `-${config.x}px -${config.y}px`, width: `${config.width}px`, height: `${SPRITE_CONFIG.digitHeight}px` }} />;
            })}
        </div>
    );
};
// --- End of Sprite Logic ---


interface ExpansionConfirmTooltipProps {
    cost: Resources;
    position: { top: number; left: number };
    onConfirm: () => void;
    onCancel: () => void;
}

const ExpansionConfirmTooltip: React.FC<ExpansionConfirmTooltipProps> = ({ cost, position, onConfirm, onCancel }) => {
    const tooltipRef = React.useRef<HTMLDivElement>(null);
    const [isConfirmHovered, setConfirmHovered] = useState(false);
    const [isCancelHovered, setCancelHovered] = useState(false);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
                onCancel();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onCancel]);

    const resourceMapping: { [key in ResourceType]?: { icon: 'iconSupplies' | 'iconTools' } } = {
        [ResourceType.Wood]: { icon: 'iconSupplies' },
        [ResourceType.Stone]: { icon: 'iconTools' },
    };

    const containerStyle: React.CSSProperties = {
        position: 'absolute',
        top: position.top,
        left: position.left,
        width: `${SPRITE_CONFIG.tooltipBg.width}px`,
        height: `${SPRITE_CONFIG.tooltipBg.height}px`,
        transform: 'translate(-50%, -115%)',
        zIndex: 9999
    };
    
    return (
        <div
            ref={tooltipRef}
            style={containerStyle}
            data-interactive="true"
            className="animate-fade-in-fast"
        >
            <Sprite name="tooltipBg" style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)' }} />
            <Sprite name="pointer" style={{ position: 'absolute', bottom: -SPRITE_CONFIG.pointer.height + 2, left: '50%', transform: 'translateX(-50%)' }} />

            <div className="absolute inset-0 p-2 flex flex-col items-center">
                <Sprite name="titleCost" style={{ marginTop: '5px' }} />
                
                <div className="mt-1 w-full px-4 space-y-1">
                    {Object.entries(cost).filter(([, value]) => value && value > 0).map(([type, value]) => {
                        const mapping = resourceMapping[type as ResourceType];
                        if (!mapping) return null;
                        return (
                            <div key={type} className="flex items-center justify-between">
                                <Sprite name={mapping.icon} />
                                <SpriteNumber value={value!} isRed={false} />
                            </div>
                        );
                    })}
                </div>

                <div className="absolute bottom-1 w-full flex justify-center gap-1">
                    <Sprite 
                        name={isCancelHovered ? 'buttonCancelHover' : 'buttonCancel'} 
                        onClick={onCancel} 
                        onMouseEnter={() => setCancelHovered(true)} 
                        onMouseLeave={() => setCancelHovered(false)}
                    />
                    <Sprite 
                        name={isConfirmHovered ? 'buttonConfirmHover' : 'buttonConfirm'} 
                        onClick={onConfirm} 
                        onMouseEnter={() => setConfirmHovered(true)} 
                        onMouseLeave={() => setConfirmHovered(false)}
                    />
                </div>
            </div>
             <style>{`
                @keyframes fade-in-fast {
                    from { opacity: 0; transform: translate(-50%, -105%); }
                    to { opacity: 1; transform: translate(-50%, -115%); }
                }
                .animate-fade-in-fast {
                    animation: fade-in-fast 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default ExpansionConfirmTooltip;