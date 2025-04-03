import React, { useEffect } from 'react';
import { GameChoice, GamePhase } from './RPSGame';

interface RPSGameAreaProps {
  phase: GamePhase;
  botChoice: GameChoice;
  chatChoice: GameChoice;
  winner: 'bot' | 'chat' | 'tie' | null;
  votes: {
    rock: number;
    paper: number;
    scissors: number;
  };
  revealBot?: boolean; // Montrer le choix du bot en avance
  doublePoints?: boolean; // Indicateur de points doublés
  cancelNextLoss?: boolean; // Indicateur de protection contre défaite
  noVotes?: boolean; // Indique qu'aucun vote n'a été émis
}

const RPSGameArea: React.FC<RPSGameAreaProps> = ({
  phase,
  botChoice,
  chatChoice,
  winner,
  votes,
  revealBot = false,
  doublePoints = false,
  cancelNextLoss = false,
  noVotes = false,
}) => {
  // Map des emojis pour chaque choix
  const choiceEmojis: Record<string, string> = {
    rock: '✊',
    paper: '✋',
    scissors: '✌️',
    null: '❓',
  };
  
  // Calculer le pourcentage de votes pour chaque option
  const totalVotes = votes.rock + votes.paper + votes.scissors;
  const votePercentages = {
    rock: totalVotes > 0 ? Math.round((votes.rock / totalVotes) * 100) : 0,
    paper: totalVotes > 0 ? Math.round((votes.paper / totalVotes) * 100) : 0,
    scissors: totalVotes > 0 ? Math.round((votes.scissors / totalVotes) * 100) : 0,
  };
  
  // Log pour déboguer l'affichage du chat
  useEffect(() => {
    if (phase !== 'voting') {
      console.log('Phase non-voting:', phase);
      console.log('Choix du chat:', chatChoice);
      console.log('Emoji à afficher:', choiceEmojis[chatChoice as string]);
      console.log('Aucun vote émis:', noVotes);
    }
  }, [phase, chatChoice, noVotes]);
  
  // Styles conditionnels basés sur la phase et le gagnant
  const getBotStyles = () => {
    if (phase === 'result') {
      if (winner === 'bot') return 'bg-green-500';
      if (winner === 'chat') return 'bg-red-500';
      if (winner === 'tie') return 'bg-yellow-500';
    }
    return 'bg-gray-700';
  };
  
  const getChatStyles = () => {
    if (phase === 'result') {
      if (winner === 'chat') return 'bg-green-500';
      if (winner === 'bot') return 'bg-red-500';
      if (winner === 'tie') return 'bg-yellow-500';
    }
    return 'bg-gray-700';
  };
  
  // Animation pour la phase de révélation
  const getRevealAnimation = (isBot: boolean) => {
    if (phase === 'reveal') {
      return isBot ? 'animate-bounce' : '';
    }
    return '';
  };
  
  // Détermine le choix majoritaire du chat (pour le cas où chatChoice est null)
  const getChatDisplayChoice = (): GameChoice => {
    if (chatChoice !== null) return chatChoice;
    
    // Fallback si chatChoice est null
    if (totalVotes === 0) return null;
    
    const maxVotes = Math.max(votes.rock, votes.paper, votes.scissors);
    if (votes.rock === maxVotes) return 'rock';
    if (votes.paper === maxVotes) return 'paper';
    return 'scissors';
  };
  
  // Le choix à afficher pour le chat
  const displayChatChoice = getChatDisplayChoice();
  
  return (
    <div className="flex flex-col h-full">
      {/* Indicateurs d'effets actifs */}
      {(doublePoints || cancelNextLoss) && (
        <div className="mb-3 p-2 bg-gray-800 bg-opacity-80 rounded-lg flex justify-center space-x-4">
          {doublePoints && (
            <div className="text-yellow-300 font-bold flex items-center">
              <span className="mr-1">⭐</span>
              <span>Double points</span>
            </div>
          )}
          {cancelNextLoss && (
            <div className="text-green-300 font-bold flex items-center">
              <span className="mr-1">🛡️</span>
              <span>Protection active</span>
            </div>
          )}
        </div>
      )}
      
      {/* Zone de jeu principale - divisée en Bot vs Chat */}
      <div className="flex flex-col md:flex-row gap-4 h-full">
        {/* Zone du Bot */}
        <div className={`flex-1 rounded-lg p-4 flex flex-col items-center justify-center ${getBotStyles()}`}>
          <h3 className="text-lg font-bold mb-4">BOT</h3>
          
          <div className={`text-7xl mb-4 ${getRevealAnimation(true)}`}>
            {phase === 'voting' ? (
              revealBot ? (
                // Si l'effet "révéler le bot" est actif, on montre le choix en avance
                <div className="relative">
                  {choiceEmojis[botChoice || 'null']}
                  {botChoice && (
                    <div className="absolute -top-2 -right-2 bg-blue-500 text-xs p-1 rounded-full animate-pulse">
                      👁️
                    </div>
                  )}
                </div>
              ) : (
                <span className="animate-pulse">❓</span>
              )
            ) : (
              choiceEmojis[botChoice as string]
            )}
          </div>
          
          {phase === 'result' && (
            <div className="text-xl font-bold">
              {winner === 'bot' && '🏆 WINS!'}
              {winner === 'chat' && '😢 LOSES!'}
              {winner === 'tie' && '⚖️ DRAW!'}
            </div>
          )}
        </div>
        
        {/* Zone du Chat */}
        <div className={`flex-1 rounded-lg p-4 flex flex-col items-center justify-center ${getChatStyles()}`}>
          <h3 className="text-lg font-bold mb-4">CHAT</h3>
          
          {phase === 'voting' ? (
            <div className="flex flex-col gap-2 w-full max-w-xs">
              <div className="flex items-center">
                <div className="w-10 text-center">✊</div>
                <div className="flex-1 bg-gray-800 h-6 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-700 to-blue-500 h-full transition-all duration-300 flex items-center justify-end px-2"
                    style={{ width: `${votePercentages.rock}%` }}
                  >
                    {votePercentages.rock > 10 && (
                      <span className="text-xs font-bold">{votePercentages.rock}%</span>
                    )}
                  </div>
                </div>
                <div className="w-10 text-center text-xs">{votes.rock}</div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 text-center">✋</div>
                <div className="flex-1 bg-gray-800 h-6 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-700 to-blue-500 h-full transition-all duration-300 flex items-center justify-end px-2"
                    style={{ width: `${votePercentages.paper}%` }}
                  >
                    {votePercentages.paper > 10 && (
                      <span className="text-xs font-bold">{votePercentages.paper}%</span>
                    )}
                  </div>
                </div>
                <div className="w-10 text-center text-xs">{votes.paper}</div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 text-center">✌️</div>
                <div className="flex-1 bg-gray-800 h-6 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-700 to-blue-500 h-full transition-all duration-300 flex items-center justify-end px-2"
                    style={{ width: `${votePercentages.scissors}%` }}
                  >
                    {votePercentages.scissors > 10 && (
                      <span className="text-xs font-bold">{votePercentages.scissors}%</span>
                    )}
                  </div>
                </div>
                <div className="w-10 text-center text-xs">{votes.scissors}</div>
              </div>
              
              <div className="text-center text-sm mt-2">
                {totalVotes === 0 ? (
                  <span>No votes</span>
                ) : (
                  <span>Total: {totalVotes} votes</span>
                )}
              </div>
            </div>
          ) : (
            <>
              {noVotes ? (
                <div className="flex flex-col items-center">
                  <div className="text-5xl mb-4 opacity-50">🤔</div>
                  <div className="text-lg text-gray-400">No votes</div>
                  {phase === 'result' && (
                    <div className="mt-2 text-sm text-gray-500">Draw by default</div>
                  )}
                </div>
              ) : (
                <div className={`text-7xl mb-4 ${getRevealAnimation(false)}`}>
                  {displayChatChoice ? choiceEmojis[displayChatChoice] : '❓'}
                </div>
              )}
              
              {phase === 'result' && !noVotes && (
                <div className="text-xl font-bold">
                  {winner === 'chat' && '🏆 WINS!'}
                  {winner === 'bot' && '😢 LOSES!'}
                  {winner === 'tie' && '⚖️ DRAW!'}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Éventuellement, un message de résultat plus visible */}
      {phase === 'result' && (
        <div className="mt-4 text-center">
          {noVotes ? (
            <div className="text-xl font-bold text-yellow-400">
              Draw - No votes from chat
            </div>
          ) : winner === 'bot' ? (
            <div className="text-xl font-bold text-red-400">
              {cancelNextLoss ? '🛡️ Loss cancelled thanks to protection!' : 'Bot wins this round!'}
            </div>
          ) : winner === 'chat' ? (
            <div className="text-xl font-bold text-green-400">
              Chat wins this round! {doublePoints && '⭐ Double points!'}
            </div>
          ) : (
            <div className="text-xl font-bold text-yellow-400">Draw!</div>
          )}
        </div>
      )}
    </div>
  );
};

export default RPSGameArea; 