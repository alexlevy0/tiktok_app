import React from 'react';
import { GamePhase } from './RPSGame';

interface RPSControlPanelProps {
  phase: GamePhase;
  timeLeft: number;
  doublePoints?: boolean;
  revealBot?: boolean;
  cancelNextLoss?: boolean;
  slowTimer?: boolean;
}

const RPSControlPanel: React.FC<RPSControlPanelProps> = ({
  phase,
  timeLeft,
  doublePoints = false,
  revealBot = false,
  cancelNextLoss = false,
  slowTimer = false
}) => {
  const getPhaseMessage = () => {
    switch (phase) {
      case 'voting':
        return {
          title: 'Votez maintenant!',
          message: 'Tapez ✊, ✋, ou ✌️ dans le chat pour voter',
          details: 'Vous pouvez aussi taper "pierre", "papier", ou "ciseaux"'
        };
      case 'reveal':
        return {
          title: 'Révélation!',
          message: 'Découvrez le choix du bot et du chat...',
          details: ''
        };
      case 'result':
        return {
          title: 'Résultat!',
          message: 'Et le gagnant est...',
          details: 'Préparez-vous pour le prochain tour!'
        };
      default:
        return {
          title: '',
          message: '',
          details: ''
        };
    }
  };
  
  const phaseInfo = getPhaseMessage();
  
  // Animation du timer
  const getTimerColor = () => {
    if (timeLeft <= 2) return 'text-red-500';
    if (timeLeft <= 4) return 'text-yellow-500';
    return 'text-[#00ffbb]';
  };
  
  // Modifie les instructions en fonction des effets actifs
  const getActiveEffectsMessage = () => {
    const effects = [];
    
    if (doublePoints) effects.push('⭐');
    if (revealBot) effects.push('👁️');
    if (cancelNextLoss) effects.push('🛡️');
    if (slowTimer) effects.push('⏱️');
    
    if (effects.length === 0) return '';
    
    return `${effects.join(' ')}`;
  };
  
  const activeEffectsMessage = getActiveEffectsMessage();
  
  return (
    <div className="flex flex-col items-center">
      <div className="w-full text-center mb-2">
        <h3 className="text-2xl font-bold mb-1 text-[#36e8e8]">{phaseInfo.title}</h3>
        <p className="text-md text-white">{phaseInfo.message}</p>
        {phaseInfo.details && (
          <p className="text-sm text-gray-300">{phaseInfo.details}</p>
        )}
        
        {/* Afficher les effets actifs s'il y en a */}
        {activeEffectsMessage && (
          <p className="text-sm text-[#ff9de3] mt-1 font-semibold">{activeEffectsMessage}</p>
        )}
      </div>
      
      {phase === 'voting' && (
        <div className="flex flex-col items-center justify-center">
          <div className={`text-3xl font-bold ${getTimerColor()}`}>
            {timeLeft}
          </div>
          <div className="w-full max-w-xs bg-[#0a1020] h-2 rounded-full mt-2 overflow-hidden">
            <div 
              className={`${slowTimer ? 'bg-gradient-to-r from-purple-500 to-purple-300' : 'bg-gradient-to-r from-[#00aabb] to-[#00ffbb]'} h-full transition-all duration-300`}
              style={{ width: `${(timeLeft / (slowTimer ? 10 : 7)) * 100}%` }}
            />
          </div>
        </div>
      )}
      
      {phase === 'voting' && (
        <div className="mt-4 flex justify-center gap-6">
          <div className="flex flex-col items-center">
            <span className="text-4xl">✊</span>
            <span className="text-xs text-[#00aabb]">Pierre</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl">✋</span>
            <span className="text-xs text-[#00aabb]">Papier</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl">✌️</span>
            <span className="text-xs text-[#00aabb]">Ciseaux</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RPSControlPanel; 