
import React from 'react';
import { useGame } from '../context/GameContext';
import { Resources, ResourceType } from '../types';
import { ICONS } from '../assets';


// --- Start of Sprite Logic ---
const SPRITESHEET_URL = ICONS.CastleExpansionSprite as string;

const SPRITE_CONFIG = {
    tooltipBg: { x: 0, y: 0, width: 178, height: 130 },
    pointer: { x: 180, y: 0, width: 34, height: 20 },
    titleNotEnough: { x: 0, y: 132, width: 162, height: 22 },
    titleCost: { x: 0, y: 156, width: 44, height: 16 },
    iconSupplies: { x: 216, y: 0, width: 38, height: 38 },
    iconTools: { x: 256, y: 0, width: 38, height: 38 },
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

const Sprite: React.FC<{ name: SpriteName; style?: React.CSSProperties; }> = ({ name, style = {} }) => {
    const config = SPRITE_CONFIG[name];
    if (!config) return null;
    return <div style={{ backgroundImage: `url(${SPRITESHEET_URL})`, backgroundPosition: `-${config.x}px -${config.y}px`, width: `${config.width}px`, height: `${config.height}px`, ...style }} />;
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


interface NotEnoughResourcesTooltipProps {
    cost: Resources;
    position: { top: number; left: number };
    onClose: () => void;
}

const NotEnoughResourcesTooltip: React.FC<NotEnoughResourcesTooltipProps> = ({ cost, position, onClose }) => {
    const { gameState } = useGame();
    const tooltipRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        const handleClickOutside = (event: MouseEvent) => {
            if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            clearTimeout(timer);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

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
        <div ref={tooltipRef} style={containerStyle} className="pointer-events-none animate-fade-in-fast">
            <Sprite name="tooltipBg" style={{ position: 'absolute', top: 0, left: 0 }} />
            <Sprite name="pointer" style={{ position: 'absolute', bottom: -SPRITE_CONFIG.pointer.height + 2, left: '50%', transform: 'translateX(-50%)' }} />

            <div className="absolute inset-0 p-2 flex flex-col items-center">
                <Sprite name="titleNotEnough" style={{ marginTop: '5px' }} />
                <Sprite name="titleCost" style={{ marginTop: '8px' }} />
                
                <div className="mt-2 w-full px-4 space-y-2">
                    {Object.entries(cost).filter(([, value]) => value && value > 0).map(([type, value]) => {
                        const userAmount = gameState.resources[type as ResourceType] || 0;
                        const hasEnough = userAmount >= value!;
                        const mapping = resourceMapping[type as ResourceType];
                        if (!mapping) return null;

                        return (
                            <div key={type} className="flex items-center justify-between">
                                <Sprite name={mapping.icon} />
                                <SpriteNumber value={value!} isRed={!hasEnough} />
                            </div>
                        );
                    })}
                </div>
            </div>

            <style>{`
                @keyframes fade-in-fast {
                    from { opacity: 0; transform: translate(-50%, -105%); }
                    to { opacity: 1; transform: translate(-50%, -115%); }
                }
                .animate-fade-in-fast { animation: fade-in-fast 0.2s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default NotEnoughResourcesTooltip;