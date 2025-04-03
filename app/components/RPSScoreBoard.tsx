import React from 'react';

interface RPSScoreBoardProps {
  scores: {
    bot: number;
    chat: number;
  };
  streak: {
    player: string;
    count: number;
  };
}

const RPSScoreBoard: React.FC<RPSScoreBoardProps> = ({ scores, streak }) => {
  return (
    <div className="flex justify-center items-center">
      <div className="grid grid-cols-3 w-full text-center">
        {/* Score de l'AI */}
        <div className="bg-[#0a1b40] p-3 rounded-l-lg border-l border-y border-[#1e3a6a] shadow-[0_0_10px_rgba(0,150,255,0.3)]">
          <h3 className="text-xs uppercase font-bold text-[#36e8e8]">AI</h3>
          <p className="text-2xl font-bold">{scores.bot}</p>
        </div>
        
        {/* Affichage de la série */}
        <div className="bg-[#0a1b30] p-3 border-y border-[#1e3a6a]">
          {streak.count > 0 ? (
            <div className="flex flex-col items-center">
              <p className="text-xs uppercase font-bold text-[#ff9de3]">Série</p>
              <div className="flex items-center">
                <span className="text-xl font-bold">{streak.count}</span>
                <span className="ml-1 text-sm">
                  {streak.player === 'bot' ? '🤖' : '👥'}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <p className="text-xs uppercase font-bold text-[#ff9de3]">Égalité</p>
              <p className="text-lg">⚖️</p>
            </div>
          )}
        </div>
        
        {/* Score du chat */}
        <div className="bg-[#0a2b40] p-3 rounded-r-lg border-r border-y border-[#1e5a6a] shadow-[0_0_10px_rgba(0,255,200,0.3)]">
          <h3 className="text-xs uppercase font-bold text-[#36e8e8]">Chat</h3>
          <p className="text-2xl font-bold text-[#36e8e8]">{scores.chat}</p>
        </div>
      </div>
    </div>
  );
};

export default RPSScoreBoard; 