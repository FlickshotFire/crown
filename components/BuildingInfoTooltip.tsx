
import React from 'react';
import { Building } from '../types';

interface BuildingInfoTooltipProps {
    building: Building;
    position: { top: number; left: number };
    onClose: () => void;
}

const BuildingInfoTooltip: React.FC<BuildingInfoTooltipProps> = ({ building, position, onClose }) => {
    const tooltipRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000); // Auto-close after 5 seconds

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

    return (
        <div
            ref={tooltipRef}
            className="absolute z-[9999] p-3 bg-[#f1e5c7] border-2 border-[#a68a64] rounded-md shadow-lg text-[#4a2c0c] w-64 animate-fade-in-fast"
            style={{ top: position.top, left: position.left, transform: 'translate(-50%, -110%)' }}
        >
            <div className="absolute left-1/2 -bottom-3 transform -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-[#a68a64]"></div>
            <div className="absolute left-1/2 -bottom-2.5 transform -translate-x-1/2 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[7px] border-t-[#f1e5c7]"></div>

            <h3 className="text-md font-bold border-b border-[#c8b79a] pb-1 mb-2">{building.name}</h3>
            <p className="text-sm">{building.description}</p>
             <style>{`
                @keyframes fade-in-fast {
                    from { opacity: 0; transform: translate(-50%, -100%); }
                    to { opacity: 1; transform: translate(-50%, -110%); }
                }
                .animate-fade-in-fast {
                    animation: fade-in-fast 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default BuildingInfoTooltip;
