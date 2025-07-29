
import React from 'react';
import { LoginPage } from './components/LoginPage';
import { GameProvider, useGame } from './context/GameContext';
import UIContainer from './components/UIContainer';
import CastleView from './components/CastleView';
import WorldMap from './components/WorldMap';
import AttackView from './components/AttackView';

const GameView = () => {
    const { gameState, selectPOI } = useGame();

    return (
        <div className="w-screen h-screen bg-black select-none overflow-hidden">
            {gameState.attackTarget ? (
                <AttackView />
            ) : (
                <>
                    {/* Game world is now inside its own absolute container to isolate it */}
                    <div className="absolute inset-0">
                        {gameState.currentView === 'castle' ? (
                            <CastleView />
                        ) : (
                            <WorldMap selectedPOI={gameState.selectedPOI} onSelectPOI={selectPOI} />
                        )}
                    </div>
                    {/* UIContainer is a sibling, and will be fixed to the viewport */}
                    <UIContainer />
                </>
            )}
             {/* Vignette Overlay is now fixed to avoid moving with any potential scroll/transform on parents */}
            <div
                className="fixed inset-0 pointer-events-none z-[999]"
                style={{
                    boxShadow: 'inset 0 0 150px 25px rgba(0,0,0,0.6)',
                }}
            ></div>
        </div>
    );
};

const AppContent = () => {
    const { gameState } = useGame();
    if (!gameState.currentUser) {
        return <LoginPage />;
    }
    return <GameView />;
};

const App = () => {
    return (
        <GameProvider>
            <AppContent />
        </GameProvider>
    );
};

export default App;
