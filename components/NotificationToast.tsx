import React, { useEffect, useState } from 'react';
import { Notification } from '../types';

interface NotificationToastProps {
    notification: Notification;
    onDismiss: () => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onDismiss }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Animate in
        setIsVisible(true);

        // Set timers for auto-dismiss and animation out
        const dismissTimer = setTimeout(() => {
            setIsVisible(false);
        }, 4500); // Start fade out before removal

        const removeTimer = setTimeout(() => {
            onDismiss();
        }, 5000); // Remove from DOM after fade out

        return () => {
            clearTimeout(dismissTimer);
            clearTimeout(removeTimer);
        };
    }, [onDismiss]);

    const getIcon = () => {
        switch (notification.type) {
            case 'success':
                return <i className="fas fa-check-circle text-green-400"></i>;
            case 'info':
                return <i className="fas fa-info-circle text-blue-400"></i>;
            case 'warning':
                return <i className="fas fa-exclamation-triangle text-yellow-400"></i>;
            case 'error':
                return <i className="fas fa-times-circle text-red-400"></i>;
            default:
                return null;
        }
    };

    return (
        <div
            className={`flex items-start p-3 bg-stone-800/90 border-l-4 rounded-md shadow-lg transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
            }`}
            style={{ borderColor: notification.type === 'success' ? '#4ade80' : notification.type === 'info' ? '#60a5fa' : '#f87171' }}
        >
            <div className="text-2xl mr-3">{getIcon()}</div>
            <div className="flex-grow">
                <h4 className="font-bold text-white">{notification.title}</h4>
                <p className="text-sm text-gray-300">{notification.message}</p>
            </div>
            <button onClick={onDismiss} className="ml-2 text-gray-500 hover:text-white">&times;</button>
        </div>
    );
};

export default NotificationToast;
