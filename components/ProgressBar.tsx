import React from 'react';

interface ProgressBarProps {
    value: number;
    max: number;
    barClassName?: string;
    bgClassName?: string;
    height?: string;
    children?: React.ReactNode;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
    value,
    max,
    barClassName = 'bg-green-500',
    bgClassName = 'bg-black/50',
    height = 'h-4',
    children
}) => {
    const percentage = (value / max) * 100;

    return (
        <div className={`w-full ${bgClassName} rounded-full overflow-hidden border border-black/30 ${height} relative`}>
            <div
                className={`h-full transition-all duration-300 ${barClassName}`}
                style={{ width: `${percentage}%` }}
            ></div>
            {children && <div className="absolute inset-0 flex items-center justify-center">{children}</div>}
        </div>
    );
};

export default ProgressBar;