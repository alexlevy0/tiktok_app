import React, { useState } from 'react';
import { GameChoice } from './RPSGame';

interface RPSVoteTesterProps {
  isConnected: boolean;
  phase: string;
  onTestVote: (choice: GameChoice) => void;
}

const RPSVoteTester: React.FC<RPSVoteTesterProps> = ({ 
  isConnected, 
  phase,
  onTestVote 
}) => {
  const [testMessage, setTestMessage] = useState<string>('');
  
  // Preset messages for easy testing
  const presetMessages = [
    { label: 'Rock', emoji: '✊' },
    { label: 'Paper', emoji: '✋' },
    { label: 'Scissors', emoji: '✌️' },
    { label: 'Fist', emoji: '👊' },
    { label: 'Thumbs up', emoji: '👍' },
    { label: 'Hand', emoji: '🖐' }
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testMessage || !isConnected || phase !== 'voting') return;
    
    // Déterminer le vote
    let vote: GameChoice = null;
    
    // Simple analyse similaire à celle du jeu principal
    const msg = testMessage.toLowerCase();
    
    if (testMessage.includes('✊') || testMessage.includes('👊') || testMessage.includes('👍') || 
        msg.includes('rock') || msg.includes('pierre') || msg === '1' || msg === 'p') {
      vote = 'rock';
    } else if (testMessage.includes('✋') || testMessage.includes('🖐') || testMessage.includes('👋') || 
              msg.includes('paper') || msg.includes('papier') || msg === '2') {
      vote = 'paper';
    } else if (testMessage.includes('✌️') || testMessage.includes('✌') || testMessage.includes('✂️') || 
              msg.includes('scissors') || msg.includes('ciseaux') || msg === '3') {
      vote = 'scissors';
    }
    
    if (vote) {
      onTestVote(vote);
      // Option: Effacer l'entrée après soumission
      // setTestMessage('');
    }
  };
  
  const handlePresetClick = (emoji: string) => {
    setTestMessage(emoji);
    
    // Soumettre automatiquement après sélection d'un préréglage
    if (isConnected && phase === 'voting') {
      let vote: GameChoice = null;
      
      if (emoji === '✊' || emoji === '👊' || emoji === '👍') {
        vote = 'rock';
      } else if (emoji === '✋' || emoji === '🖐') {
        vote = 'paper';
      } else if (emoji === '✌️') {
        vote = 'scissors';
      }
      
      if (vote) {
        onTestVote(vote);
      }
    }
  };
  
  if (!isConnected) {
    return null;
  }
  
  return (
    <div className="bg-[#0a1030] p-2 rounded-lg mb-2 border border-[#2a2a4a]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-[#36e8e8]">Vote Tester</h3>
        <div className={`text-xs px-2 py-0.5 rounded ${
          phase === 'voting' 
            ? 'bg-[#00aa66] text-black' 
            : 'bg-[#333344]'
        }`}>
          {phase === 'voting' ? 'Voting open' : 'Voting closed'}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-1 mb-2">
        {presetMessages.map((preset) => (
          <button
            key={preset.emoji}
            onClick={() => handlePresetClick(preset.emoji)}
            className="bg-[#0a1b40] hover:bg-[#0a2b50] rounded px-2 py-1 text-xs border border-[#1e3a6a] transition-colors"
            disabled={phase !== 'voting'}
          >
            {preset.emoji} {preset.label}
          </button>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={testMessage}
          onChange={(e) => setTestMessage(e.target.value)}
          placeholder="Type your message with emoji..."
          className="flex-1 bg-[#0a1020] text-white text-sm rounded p-1 border border-[#1e3a6a] focus:border-[#36e8e8] focus:outline-none"
          disabled={phase !== 'voting'}
        />
        <button
          type="submit"
          className="bg-[#0a2b30] hover:bg-[#0a3b40] text-[#00ffbb] text-xs rounded px-3 border border-[#1e5a6a]"
          disabled={phase !== 'voting'}
        >
          Test
        </button>
      </form>
    </div>
  );
};

export default RPSVoteTester; 