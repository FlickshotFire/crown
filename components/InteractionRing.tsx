import React from 'react';
import { ICONS } from '../assets';
import { useGame } from '../context/GameContext';
import { BUILDINGS } from '../constants';

const InteractionButton = ({ icon, position, title, onClick }) => (
  <div
    className="absolute w-12 h-12 flex items-center justify-center transition-transform duration-200 ease-in-out hover:scale-110"
    style={position}
  >
    <button
      title={title}
      onClick={onClick}
      data-interactive="true"
      className="w-full h-full rounded-full bg-gradient-to-b from-slate-700 to-slate-900 border-2 border-slate-500 shadow-lg flex items-center justify-center"
    >
       <div className="w-10 h-10 rounded-full bg-blue-900/50 flex items-center justify-center text-white">
         {icon}
       </div>
    </button>
  </div>
);

const InteractionRing = ({ buildingInstanceId, onClose }) => {
  const { gameState, initiateMove, rotateBuilding, openUpgradeModal, openBarracksModal, openWorkshopModal } = useGame();

  const building = gameState.buildings.find(b => b.instanceId === buildingInstanceId);
  const buildingInfo = building ? BUILDINGS.find(b => b.id === building.type) : undefined;
  
  const handleMoveClick = (e) => {
    e.stopPropagation();
    initiateMove(buildingInstanceId);
  };

  const handleRotateClick = (e) => {
    e.stopPropagation();
    rotateBuilding(buildingInstanceId);
  };

  const handleUpgradeClick = (e) => {
    e.stopPropagation();
    openUpgradeModal(buildingInstanceId);
  };

  const handleTrainClick = (e) => {
    e.stopPropagation();
    openBarracksModal(buildingInstanceId);
  }
  
  const handleConstructClick = (e) => {
    e.stopPropagation();
    openWorkshopModal(buildingInstanceId);
  }
  
  const handleCloseClick = (e) => {
    e.stopPropagation();
    onClose();
  };


  const radius = 70; 
  let buttonDefinitions = [
    { icon: ICONS.RingIcons.Move({}), onClick: handleMoveClick, angle: -135, title: 'Move' },
    (buildingInfo && buildingInfo.levels.length > 1) && { icon: ICONS.RingIcons.Upgrade({}), onClick: handleUpgradeClick, angle: -45, title: 'Upgrade'},
    { icon: ICONS.RingIcons.Rotate({}), onClick: handleRotateClick, angle: 45, title: 'Rotate' },
    { icon: <div className="w-6 h-6 text-red-400">{ICONS.Close({})}</div>, onClick: handleCloseClick, angle: -90, title: 'Close' },
  ];

  if (building?.type === 'barracks') {
      buttonDefinitions.push({ icon: ICONS.BottomBarIcons.Military({}), onClick: handleTrainClick, angle: 135, title: 'Train Troops' });
  } else if (building?.type === 'tools_workshop') {
      buttonDefinitions.push({ icon: ICONS.RingIcons.Construct({}), onClick: handleConstructClick, angle: 135, title: 'Construct Tools' });
  }

  const buttons = buttonDefinitions.filter(Boolean);


  return (
    <div className="absolute w-0 h-0 flex items-center justify-center pointer-events-auto" data-interactive="true">
      {/* Ring Path */}
      <div className="absolute w-48 h-48 border-4 border-slate-500/70 rounded-full animate-fade-in-fast" style={{transform: 'translate(-50%, -50%)'}} />

      {/* Buttons */}
      {buttons.map((btn) => {
        const angleRad = (btn.angle * Math.PI) / 180;
        const x = radius * Math.cos(angleRad);
        const y = radius * Math.sin(angleRad);
        return (
          <InteractionButton
            key={btn.title}
            icon={btn.icon}
            position={{
              left: `${x}px`,
              top: `${y}px`,
              transform: 'translate(-50%, -50%)',
            }}
            title={btn.title}
            onClick={btn.onClick}
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

export default InteractionRing;