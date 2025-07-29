import React from 'react';
import { useGame } from '../context/GameContext';
import NotificationToast from './NotificationToast';

const NotificationContainer: React.FC = () => {
    const { gameState, removeNotification } = useGame();
    const { notifications } = gameState;

    return (
        <div className="fixed top-24 right-4 z-[9999] w-80 space-y-2 pointer-events-auto">
            {notifications.map((notification: any) => (
                <NotificationToast
                    key={notification.id}
                    notification={notification}
                    onDismiss={() => removeNotification(notification.id)}
                />
            ))}
        </div>
    );
};

export default NotificationContainer;
