import React from 'react';
import { PlayerScore } from './RPSGame';

interface RPSTopPlayersProps {
  players: PlayerScore[];
  maxToShow?: number;
  progressPercent?: number;
}

const RPSTopPlayers: React.FC<RPSTopPlayersProps> = ({ 
  players, 
  maxToShow = 5,
  progressPercent = 25
}) => {
  // Trier les joueurs par nombre de victoires (décroissant)
  const sortedPlayers = [...players].sort((a, b) => b.wins - a.wins).slice(0, maxToShow);
  
  return (
    <div className="bg-[#0a1030] rounded-lg p-3 border border-[#2a2a4a]">
      <h3 className="text-xl text-[#ff9de3] mb-2 font-semibold">Top Joueurs ✨</h3>
      
      {sortedPlayers.length === 0 ? (
        <p className="text-gray-400 text-sm">Aucun gagnant pour l&apos;instant</p>
      ) : (
        <ul className="space-y-1">
          {sortedPlayers.map((player, index) => (
            <li key={player.nickname} className="flex items-center">
              <span className="text-lg mr-2">{index + 1}</span>
              <span className="flex-1">{player.nickname}</span>
              <span className="text-gray-400">({player.wins} ✓)</span>
            </li>
          ))}
        </ul>
      )}
      
      <div className="mt-3">
        <p className="text-sm">Objectif Cadeaux:</p>
        <div className="w-full bg-[#0a0a30] h-2 rounded-full mt-1">
          <div 
            className="bg-blue-500 h-full rounded-full" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default RPSTopPlayers; 