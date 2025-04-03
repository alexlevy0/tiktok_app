import React, { useState, useEffect, useCallback } from 'react';
import RPSVoteTester from './RPSVoteTester';
import RPSGiftTester from './RPSGiftTester';
import RPSGiftEffects, { SpecialEffect } from './RPSGiftEffects';
import RPSTopPlayers from './RPSTopPlayers';
import RPSTopGifts, { GiftDonor } from './RPSTopGifts';

export type GameChoice = 'rock' | 'paper' | 'scissors' | null;
export type GamePhase = 'voting' | 'reveal' | 'result';

// Définition du type VoteCount pour les votes
export type VoteCount = {
  rock: number;
  paper: number;
  scissors: number;
};

// Interface pour représenter un joueur dans le classement
export type PlayerScore = {
  nickname: string;
  wins: number;
};

interface RPSGameProps {
  username: string;
  isConnected: boolean;
  onToggleConnectForm?: () => void;
}

const RPSGame: React.FC<RPSGameProps> = ({ username, isConnected, onToggleConnectForm }) => {
  // États du jeu
  const [phase, setPhase] = useState<GamePhase>('voting');
  const [timeLeft, setTimeLeft] = useState<number>(30); // Durée du vote en secondes
  const [votingDuration, setVotingDuration] = useState<number>(30); // Durée standard
  const [botChoice, setBotChoice] = useState<GameChoice>(null);
  const [chatChoice, setChatChoice] = useState<GameChoice>(null);
  const [scores, setScores] = useState({ bot: 0, chat: 0 });
  const [streak, setStreak] = useState({ player: 'none', count: 0 });
  const [votes, setVotes] = useState<VoteCount>({ rock: 0, paper: 0, scissors: 0 });
  const [winner, setWinner] = useState<'bot' | 'chat' | 'tie' | null>(null);
  const [lastMessageId, setLastMessageId] = useState<string | null>(null);
  const [processedMessageIds, setProcessedMessageIds] = useState<Set<string>>(new Set());
  const [showGiftTester, setShowGiftTester] = useState<boolean>(false);
  const [showVoteTester, setShowVoteTester] = useState<boolean>(true);
  const [noVotes, setNoVotes] = useState<boolean>(false);
  const [totalDiamonds, setTotalDiamonds] = useState<number>(0);
  
  // État pour les animations
  const [phaseChanged, setPhaseChanged] = useState<boolean>(false);
  
  // État pour le classement des joueurs
  const [topPlayers, setTopPlayers] = useState<PlayerScore[]>([]);
  const [lastWinner, setLastWinner] = useState<string | null>(null);
  
  // État pour les donateurs de cadeaux
  const [topDonors, setTopDonors] = useState<GiftDonor[]>([]);
  
  // État pour contrôler l'affichage de l'en-tête
  const [showHeader, setShowHeader] = useState<boolean>(true);
  
  // États des effets spéciaux
  const [doublePoints, setDoublePoints] = useState<boolean>(false);
  const [revealBot, setRevealBot] = useState<boolean>(false);
  const [cancelNextLoss, setCancelNextLoss] = useState<boolean>(false);
  const [slowTimer, setSlowTimer] = useState<boolean>(false);
  
  // Timestamp de début de la partie actuelle pour filtrer les messages
  const [currentGameStartTime, setCurrentGameStartTime] = useState<number>(Date.now());
  
  // Map des emojis pour chaque choix
  const choiceEmojis: Record<string, string> = {
    rock: '✊',
    paper: '✋',
    scissors: '✌️',
    null: '❓',
  };
  
  // Threshold constants
  const GIFT_THRESHOLDS = {
    slow_timer: 50,
    reveal_bot: 100,
    cancel_loss: 200,
    double_points: 500
  };
  
  // Réinitialiser le jeu pour un nouveau tour
  const resetGame = useCallback(() => {
    console.log("Réinitialisation du jeu pour un nouveau tour");
    setBotChoice(null);
    setChatChoice(null);
    setWinner(null);
    setVotes({ rock: 0, paper: 0, scissors: 0 });
    setTimeLeft(votingDuration);
    setPhase('voting');
    setNoVotes(false);
    setProcessedMessageIds(new Set());
    setLastMessageId(null);
    
    // Définir le timestamp de début de la nouvelle partie
    const newGameStartTime = Date.now();
    setCurrentGameStartTime(newGameStartTime);
    console.log(`Nouvelle partie démarrée à ${new Date(newGameStartTime).toISOString()}`);
    
    if (revealBot) {
      setRevealBot(false);
    }
  }, [votingDuration, revealBot]);
  
  // Détermine un choix aléatoire pour le bot
  const generateBotChoice = (): GameChoice => {
    const choices: GameChoice[] = ['rock', 'paper', 'scissors'];
    return choices[Math.floor(Math.random() * choices.length)];
  };
  
  // Détermine le gagnant entre le bot et le chat
  const determineWinner = (bot: GameChoice, chat: GameChoice): 'bot' | 'chat' | 'tie' | null => {
    // Si chat n'a pas de choix (aucun vote), alors c'est une égalité/match nul
    if (!chat) return 'tie';
    if (!bot) return null;
    
    if (bot === chat) return 'tie';
    
    if (
      (bot === 'rock' && chat === 'scissors') ||
      (bot === 'paper' && chat === 'rock') ||
      (bot === 'scissors' && chat === 'paper')
    ) {
      return 'bot';
    } else {
      return 'chat';
    }
  };
  
  // Détermine le choix majoritaire du chat
  const determineChatsChoice = (): GameChoice => {
    const hasNoVotes = votes.rock === 0 && votes.paper === 0 && votes.scissors === 0;
    
    if (hasNoVotes) {
      // Aucun vote, on retourne null et on marque l'absence de votes
      setNoVotes(true);
      return null;
    }
    
    // Il y a des votes, on réinitialise l'indicateur
    setNoVotes(false);
    
    const maxVotes = Math.max(votes.rock, votes.paper, votes.scissors);
    
    // En cas d'égalité, on choisit de manière déterministe
    if (votes.rock === maxVotes) return 'rock';
    if (votes.paper === maxVotes) return 'paper';
    return 'scissors';
  };
  
  // Mise à jour des scores et des séries
  const updateScores = (result: 'bot' | 'chat' | 'tie' | null) => {
    if (!result || result === 'tie') {
      setStreak({ player: 'none', count: 0 });
      return;
    }
    
    // Gestion de l'annulation d'une défaite
    if (result === 'bot' && cancelNextLoss) {
      setCancelNextLoss(false);
      setStreak({ player: 'none', count: 0 });
      return; // On ne met pas à jour les scores
    }
    
    // Points à attribuer (potentiellement doublés)
    const pointsToAdd = doublePoints ? 2 : 1;
    
    setScores(prev => ({
      ...prev,
      [result]: prev[result] + pointsToAdd
    }));
    
    if (streak.player === result) {
      setStreak(prev => ({ player: result, count: prev.count + 1 }));
    } else {
      setStreak({ player: result, count: 1 });
    }
    
    // Réinitialiser l'effet de points doublés
    if (doublePoints) {
      setDoublePoints(false);
    }
    
    // Mettre à jour le classement des joueurs si c'est le chat qui gagne
    if (result === 'chat' && lastWinner) {
      updateTopPlayers(lastWinner);
    }
  };
  
  // Mise à jour du classement des joueurs
  const updateTopPlayers = (playerName: string) => {
    setTopPlayers(prevPlayers => {
      // Vérifier si le joueur existe déjà dans le classement
      const existingPlayerIndex = prevPlayers.findIndex(
        player => player.nickname === playerName
      );
      
      if (existingPlayerIndex !== -1) {
        // Mettre à jour le nombre de victoires du joueur existant
        const updatedPlayers = [...prevPlayers];
        updatedPlayers[existingPlayerIndex] = {
          ...updatedPlayers[existingPlayerIndex],
          wins: updatedPlayers[existingPlayerIndex].wins + 1
        };
        
        // Trier le classement par nombre de victoires décroissant
        return updatedPlayers
          .sort((a, b) => b.wins - a.wins);
      } else {
        // Ajouter un nouveau joueur au classement
        const newPlayer: PlayerScore = {
          nickname: playerName,
          wins: 1
        };
        
        // Ajouter et trier le classement
        return [...prevPlayers, newPlayer]
          .sort((a, b) => b.wins - a.wins);
      }
    });
  };
  
  // Gestion des effets spéciaux
  const handleSpecialEffect = useCallback((effect: SpecialEffect, nickname?: string, diamondCount?: number) => {
    switch (effect) {
      case 'double_points':
        setDoublePoints(true);
        break;
      case 'reveal_bot':
        setRevealBot(true);
        break;
      case 'cancel_loss':
        setCancelNextLoss(true);
        break;
      case 'slow_timer':
        setSlowTimer(true);
        // Augmenter la durée de vote pour les prochains tours
        setVotingDuration(10); // 10 secondes au lieu de 7
        break;
    }
    
    // Si on a des informations sur le donateur, mettre à jour le classement
    if (nickname && diamondCount) {
      setTotalDiamonds(prev => prev + diamondCount);
      updateTopDonors(nickname, diamondCount);
    }
  }, []);
  
  // Mise à jour du classement des donateurs
  const updateTopDonors = (nickname: string, diamondCount: number) => {
    setTopDonors(prevDonors => {
      // Vérifier si le donateur existe déjà
      const existingDonorIndex = prevDonors.findIndex(donor => donor.nickname === nickname);
      
      if (existingDonorIndex !== -1) {
        // Mettre à jour le nombre de diamants du donateur existant
        const updatedDonors = [...prevDonors];
        updatedDonors[existingDonorIndex] = {
          ...updatedDonors[existingDonorIndex],
          diamonds: updatedDonors[existingDonorIndex].diamonds + diamondCount
        };
        
        // Trier le classement par nombre de diamants décroissant
        return updatedDonors.sort((a, b) => b.diamonds - a.diamonds);
      } else {
        // Ajouter un nouveau donateur
        const newDonor: GiftDonor = {
          nickname,
          diamonds: diamondCount
        };
        
        // Ajouter et trier le classement
        return [...prevDonors, newDonor].sort((a, b) => b.diamonds - a.diamonds);
      }
    });
  };
  
  // Gestion du cycle de jeu
  useEffect(() => {
    if (!isConnected) return;
    
    let timer: NodeJS.Timeout;
    
    if (phase === 'voting') {
      // Phase de vote
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            
            // Préparer la phase de révélation
            const newBotChoice = generateBotChoice();
            // Déterminer le choix majoritaire du chat de manière fiable
            const newChatChoice = determineChatsChoice();
            
            // Logs de débogage
            console.log("Fin de phase 'voting'");
            console.log("Votes: rock:", votes.rock, "paper:", votes.paper, "scissors:", votes.scissors);
            console.log("Bot choisit:", newBotChoice);
            console.log("Chat choisit:", newChatChoice);
            console.log("Aucun vote:", noVotes);
            
            // Ne pas forcer un choix par défaut si aucun vote n'a été fait
            setChatChoice(newChatChoice); // Peut être null si aucun vote
            setBotChoice(newBotChoice);
            setPhase('reveal');
            
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (phase === 'reveal') {
      // Phase de révélation (2 secondes)
      timer = setTimeout(() => {
        // On ne force pas de choix par défaut, on utilise simplement la valeur chatChoice (null si pas de vote)
        const result = determineWinner(botChoice, chatChoice);
        setWinner(result);
        setPhase('result');
      }, 2000);
    } else if (phase === 'result') {
      // Phase de résultat (3 secondes)
      updateScores(winner);
      
      timer = setTimeout(() => {
        // Utiliser la fonction de réinitialisation
        resetGame();
      }, 3000);
    }
    
    return () => {
      clearTimeout(timer);
    };
  }, [phase, isConnected, botChoice, chatChoice, winner, votes, noVotes, resetGame]);
  
  // Traiter les votes du chat
  const handleNewVote = useCallback((choice: GameChoice) => {
    if (phase !== 'voting' || !choice) return;
    
    console.log(`Vote enregistré: ${choice}`);
    
    setVotes(prev => ({
      ...prev,
      [choice]: prev[choice] + 1
    }));
  }, [phase]);
  
  // Analyse un message pour en extraire un vote
  const parseMessageForVote = useCallback((message: string, nickname: string): GameChoice => {
    if (!message) return null;
    
    // Log du message reçu pour déboguer
    console.log(`Analyse du message: "${message}"`);
    
    const lowerMessage = message.toLowerCase();
    
    // Stocker le nom du dernier votant pour l'ajouter au tableau des scores s'il gagne
    let vote: GameChoice = null;
    
    // Détecter les émojis avec différentes représentations possibles
    // Poing (rock)
    if (message.includes('✊') || 
        message.includes('👊') || 
        message.includes('🤛') || 
        message.includes('🤜') || 
        message.includes('👍')) {
      console.log('Emoji pierre détecté');
      vote = 'rock';
    }
    
    // Main ouverte (paper)
    else if (message.includes('✋') || 
        message.includes('🖐️') || 
        message.includes('🖐') ||  // version sans variante emoji
        message.includes('🤚') || 
        message.includes('👋')) {
      console.log('Emoji papier détecté');
      vote = 'paper';
    }
    
    // Ciseaux
    else if (message.includes('✌️') || 
        message.includes('✌') ||   // version sans variante emoji
        message.includes('✂️') || 
        message.includes('✂')) {   // version sans variante emoji
      console.log('Emoji ciseaux détecté');
      vote = 'scissors';
    }
    
    // Détecter les mots en français
    else if (
      lowerMessage.includes('pierre') || 
      lowerMessage.includes('rock') || 
      lowerMessage.includes('piedra') || 
      lowerMessage.includes('stein') ||
      lowerMessage.includes('камень') || // russe
      lowerMessage.includes('pietra') // italien
    ) {
      vote = 'rock';
    }
    
    else if (
      lowerMessage.includes('papier') || 
      lowerMessage.includes('paper') || 
      lowerMessage.includes('papel') || 
      lowerMessage.includes('papier') ||
      lowerMessage.includes('бумага') || // russe
      lowerMessage.includes('carta') // italien
    ) {
      vote = 'paper';
    }
    
    else if (
      lowerMessage.includes('ciseaux') || 
      lowerMessage.includes('scissors') || 
      lowerMessage.includes('tijeras') || 
      lowerMessage.includes('schere') ||
      lowerMessage.includes('ножницы') || // russe
      lowerMessage.includes('forbici') // italien
    ) {
      vote = 'scissors';
    }
    
    // Détecter les chiffres ou des raccourcis communs
    else if (lowerMessage === '1' || lowerMessage === 'p' || lowerMessage === 'r') {
      vote = 'rock';
    }
    
    else if (lowerMessage === '2' || lowerMessage === 'pa' || lowerMessage === 'pp') {
      vote = 'paper';
    }
    
    else if (lowerMessage === '3' || lowerMessage === 's' || lowerMessage === 'c') {
      vote = 'scissors';
    }
    
    // Si un vote valide a été détecté, enregistrer le nom du votant
    if (vote) {
      setLastWinner(nickname);
    }
    
    return vote;
  }, []);
  
  // Récupérer et traiter les messages du chat TikTok
  const fetchAndProcessMessages = useCallback(async () => {
    if (!isConnected || !username || phase !== 'voting') return;
    
    try {
      // Ajouter un paramètre timestamp pour ne récupérer que les messages récents
      const queryParams = new URLSearchParams({
        username: username,
        min_timestamp: currentGameStartTime.toString(), // Ajouter le timestamp de début de partie
        ...(lastMessageId ? { after_id: lastMessageId } : {})
      });
      
      const response = await fetch(`http://localhost:3001/messages?${queryParams}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Réponse du serveur de messages:", data);
        
        if (data.messages && Array.isArray(data.messages)) {
          console.log(`${data.messages.length} messages trouvés`);
          
          // Traiter uniquement les nouveaux messages
          let newVotesProcessed = false;
          
          for (const message of data.messages) {
            // Ignorer les messages plus anciens que le début de la partie actuelle
            if (message.timestamp < currentGameStartTime) {
              console.log(`Message ignoré car antérieur au début de la partie: ${message.comment}`);
              continue;
            }
            
            // Utiliser un Set pour garder une trace des messages déjà traités
            // Cela évite les doublons même si les IDs sont différents
            if (processedMessageIds.has(message.id)) {
              continue;
            }
            
            console.log("Nouveau message:", message.nickname, "-", message.comment, "timestamp:", new Date(message.timestamp).toISOString());
            
            // Ajouter l'ID à l'ensemble des messages traités
            processedMessageIds.add(message.id);
            setProcessedMessageIds(prev => new Set([...prev, message.id]));
            
            // Tenter d'extraire un vote du message avec le nom du joueur
            const vote = parseMessageForVote(message.comment, message.nickname);
            if (vote) {
              handleNewVote(vote);
              newVotesProcessed = true;
            }
            
            // Mise à jour de l'ID du dernier message
            if (!lastMessageId || message.id > lastMessageId) {
              setLastMessageId(message.id);
            }
          }
          
          if (newVotesProcessed) {
            console.log("Votes mis à jour:", votes);
          }
        }
      } else {
        console.warn("Erreur lors de la récupération des messages:", response.status);
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des messages:', err);
    }
  }, [isConnected, username, phase, lastMessageId, processedMessageIds, parseMessageForVote, handleNewVote, votes, currentGameStartTime]);
  
  // Récupérer périodiquement les messages du chat (tous les 500ms)
  useEffect(() => {
    if (!isConnected || !username) return;
    
    console.log("Démarrage de la récupération des messages pour:", username);
    
    // Première exécution immédiate
    fetchAndProcessMessages();
    
    // Puis toutes les 500ms
    const interval = setInterval(fetchAndProcessMessages, 500);
    
    return () => {
      console.log("Arrêt de la récupération des messages");
      clearInterval(interval);
    };
  }, [isConnected, username, fetchAndProcessMessages]);
  
  // Fonction pour basculer l'affichage du testeur de cadeaux
  const toggleGiftTester = () => {
    setShowGiftTester(prev => !prev);
  };
  
  // Fonction pour basculer l'affichage du testeur de votes
  const toggleVoteTester = () => {
    setShowVoteTester(prev => !prev);
  };
  
  // Fonction pour basculer l'affichage de l'en-tête
  const toggleHeader = () => {
    setShowHeader(prev => !prev);
  };
  
  // Fonction pour gérer les votes de test
  const handleTestVote = (choice: GameChoice) => {
    handleNewVote(choice);
    
    // En mode test, on simule un gagnant aléatoire
    if (phase === 'voting' && Math.random() > 0.7) {
      // Générer un nom de testeur aléatoire si c'est vide
      if (!lastWinner) {
        const testNames = ['TestUser', 'Tester', 'Player1', 'FanTikTok', 'ChatGPT'];
        setLastWinner(testNames[Math.floor(Math.random() * testNames.length)]);
      }
    }
  };
  
  // Simuler l'envoi d'un cadeau pour les tests
  const handleTestGift = (nickname: string, diamondCount: number) => {
    // Mettre à jour le total de diamants
    setTotalDiamonds(prev => prev + diamondCount);
    
    // Mettre à jour la liste des donateurs
    updateTopDonors(nickname, diamondCount);
    
    // Déclencher l'effet spécial approprié en fonction du montant
    let effect: SpecialEffect = null;
    if (diamondCount >= GIFT_THRESHOLDS.double_points) {
      effect = 'double_points';
    } else if (diamondCount >= GIFT_THRESHOLDS.cancel_loss) {
      effect = 'cancel_loss';
    } else if (diamondCount >= GIFT_THRESHOLDS.reveal_bot) {
      effect = 'reveal_bot';
    } else if (diamondCount >= GIFT_THRESHOLDS.slow_timer) {
      effect = 'slow_timer';
    }
    
    if (effect) {
      handleSpecialEffect(effect, nickname, diamondCount);
    }
  };
  
  // Effet pour l'animation de changement de phase
  useEffect(() => {
    // Déclencher l'animation à chaque changement de phase
    setPhaseChanged(true);
    const timer = setTimeout(() => {
      setPhaseChanged(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [phase]);
  
  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900 text-white p-4 rounded-lg">
        <p>Connectez-vous à un live TikTok pour jouer à Pierre-Papier-Ciseaux</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full bg-[#0a0a20] text-white rounded-lg overflow-hidden border border-[#2a9bb5] shadow-[0_0_15px_rgba(0,255,255,0.3)]">
      {/* Top section - Title and scores - conditionnelle selon showHeader */}
      {showHeader && (
        <div className="p-4 bg-gradient-to-r from-[#1a103a] to-[#0e2b4a] backdrop-blur-sm backdrop-filter">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-[#36e8e8] tracking-wider mb-6 text-shadow">
              PPC BOT BATTLE <span className="text-xl">🤖</span>
            </h2>
          </div>
          
          {/* Score display with neon styling */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-[#0a1b40]/80 text-white p-4 rounded-lg border border-[#1e3a6a] shadow-[0_0_10px_rgba(0,150,255,0.3)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,150,255,0.4)] hover:scale-[1.02]">
              <div className="flex items-center mb-2">
                <span className="text-xl mr-2">🤖</span>
                <span className="text-[#36e8e8] text-2xl font-bold">BOT</span>
                <span className="ml-auto text-xl">{scores.bot}</span>
              </div>
              <div className="text-center">
                <span className="text-6xl font-bold text-white">{scores.bot}</span>
              </div>
            </div>
            <div className="bg-[#0a2b40]/80 text-white p-4 rounded-lg border border-[#1e5a6a] shadow-[0_0_10px_rgba(0,255,200,0.3)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,200,0.4)] hover:scale-[1.02]">
              <div className="flex items-center mb-2">
                <span className="text-[#36e8e8] text-2xl font-bold">CHAT</span>
                <span className="ml-auto text-xl">{scores.chat}</span>
                {streak.player === 'chat' && streak.count > 0 && <span className="ml-1">⭐</span>}
              </div>
              <div className="text-center">
                <span className="text-6xl font-bold text-[#36e8e8]">{scores.chat}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Phase Indicator */}
      <div className={`p-2 text-center transform transition-all duration-700 ${phaseChanged ? 'scale-110' : ''}`}>
        {phase === 'voting' && (
          <div className="bg-gradient-to-r from-[#0066aa] to-[#00aabb] p-2 rounded-lg animate-pulse shadow-lg flex items-center justify-center">
            <span className="text-xl font-bold text-white">VOTING OPEN</span>
            <div className="ml-4 bg-[#0a1b30] px-3 py-1 rounded-full text-center min-w-[40px] shadow-inner">
              <span className="text-xl font-bold text-[#00ffbb] animate-pulse">{timeLeft}</span>
            </div>
          </div>
        )}
        
        {phase === 'reveal' && (
          <div className="bg-gradient-to-r from-[#aa6600] to-[#bb9900] p-2 rounded-lg animate-reveal shadow-lg">
            <span className="text-xl font-bold text-white">REVEAL</span>
          </div>
        )}
        
        {phase === 'result' && (
          <div className="bg-gradient-to-r from-[#00aa66] to-[#00bb99] p-2 rounded-lg animate-slide-up shadow-lg">
            <span className="text-xl font-bold text-white">RESULT</span>
          </div>
        )}
      </div>
      
      {/* Testeur de votes (optionnel, caché par défaut) - conditionnel selon showHeader */}
      {showHeader && showVoteTester && (
        <RPSVoteTester 
          isConnected={isConnected}
          phase={phase}
          onTestVote={handleTestVote}
        />
      )}
      
      {/* Testeur de cadeaux (optionnel, caché par défaut) - conditionnel selon showHeader */}
      {showHeader && showGiftTester && (
        <RPSGiftTester 
          username={username}
          isConnected={isConnected}
          onTestGift={handleTestGift}
        />
      )}
      
      {/* Mode compact - afficher un titre minimaliste quand showHeader est false */}
      {!showHeader && (
        <div className="p-2 bg-[#0a0a25]/90 backdrop-blur-sm text-center">
          <div className="flex justify-between items-center">
            <div className="text-xs text-[#36e8e8]">Bot: {scores.bot}</div>
            <h3 className="text-sm font-bold text-white">PPC BOT BATTLE</h3>
            <div className="text-xs text-[#36e8e8]">Chat: {scores.chat}</div>
          </div>
        </div>
      )}
      
      {/* Game area */}
      <div className="flex-1 p-4 relative">
        <div className="grid grid-cols-2 gap-8 h-full">
          <div className={`bg-gradient-to-br from-[#3a0a30]/80 to-[#280a20]/80 backdrop-blur-sm p-6 rounded-lg flex flex-col items-center justify-center transition-all duration-500 ${phase === 'result' ? 'transform hover:scale-105' : ''} ${winner === 'bot' ? 'border-2 border-red-500 shadow-[0_0_15px_rgba(255,0,0,0.5)]' : 'border border-[#502a44]'}`}>
            <div className="text-3xl mb-4">BOT</div>
            <div className={`text-7xl mb-4 transition-all duration-700 ${phase === 'reveal' ? 'animate-spin-slow' : ''}`}>
              {phase === 'voting' ? (
                revealBot ? choiceEmojis[botChoice || 'null'] : '❓'
              ) : (
                <span>
                  {choiceEmojis[botChoice as string]}
                </span>
              )}
            </div>
          </div>
          
          <div className={`bg-gradient-to-br from-[#0a2b30]/80 to-[#0a1b20]/80 backdrop-blur-sm p-6 rounded-lg flex flex-col items-center justify-center transition-all duration-500 ${phase === 'result' ? 'transform hover:scale-105' : ''} ${winner === 'chat' ? 'border-2 border-[#00ff9d] shadow-[0_0_15px_rgba(0,255,150,0.5)]' : 'border border-[#1e4a44]'}`}>
            {phase === 'voting' ? (
              <div className="flex flex-col w-full">
                <div className="text-3xl mb-4 text-center">CHAT</div>
                <div className="space-y-3 w-full">
                  <div className="flex items-center">
                    <div className="w-10 text-center">✊</div>
                    <div className="flex-1 bg-[#0a1020] h-6 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-[#0066aa] to-[#00aabb] h-full transition-all duration-300 flex items-center justify-end px-2"
                        style={{ width: `${(votes.rock / Math.max(1, votes.rock + votes.paper + votes.scissors)) * 100}%` }}
                      >
                        <span className="text-xs font-bold">{votes.rock}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 text-center">✋</div>
                    <div className="flex-1 bg-[#0a1020] h-6 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-[#0066aa] to-[#00aabb] h-full transition-all duration-300 flex items-center justify-end px-2"
                        style={{ width: `${(votes.paper / Math.max(1, votes.rock + votes.paper + votes.scissors)) * 100}%` }}
                      >
                        <span className="text-xs font-bold">{votes.paper}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 text-center">✌️</div>
                    <div className="flex-1 bg-[#0a1020] h-6 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-[#0066aa] to-[#00aabb] h-full transition-all duration-300 flex items-center justify-end px-2"
                        style={{ width: `${(votes.scissors / Math.max(1, votes.rock + votes.paper + votes.scissors)) * 100}%` }}
                      >
                        <span className="text-xs font-bold">{votes.scissors}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="text-3xl mb-4">
                  CHAT
                  <div className="text-sm mt-1 text-[#00ffbb]">MAJORITAIRE</div>
                </div>
                <div className={`text-7xl mb-4 transition-all duration-700 ${phase === 'reveal' ? 'animate-flip' : ''}`}>
                  {noVotes ? '❓' : (chatChoice ? choiceEmojis[chatChoice] : '❓')}
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* VS indicator */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-5xl text-purple-400 font-bold opacity-80 animate-pulse">
          VS
        </div>
        
        {/* Result message */}
        {phase === 'result' && (
          <div className="mt-6 bg-[#0a2b30]/70 backdrop-blur-md border border-[#00bb99] rounded-lg p-3 shadow-[0_0_10px_rgba(0,200,150,0.3)] text-center animate-slide-up">
            <div className="text-xl font-bold text-[#00ffbb]">
              {winner === 'chat' ? (
                <span className="animate-flicker">🏆 CHAT WINS THIS ROUND!</span>
              ) : winner === 'bot' ? (
                <span className="animate-flicker">BOT WINS THIS ROUND!</span>
              ) : (
                <span className="animate-flicker">DRAW!</span>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Gift effects */}
      <div className="px-4 pb-2 hidden">
        <RPSGiftEffects 
          username={username}
          isConnected={isConnected}
          onSpecialEffect={handleSpecialEffect}
        />
      </div>
      
      {/* Player leaderboard - conditionnel selon showHeader */}
      {showHeader && (
        <div className="grid grid-cols-2 gap-4 p-4 bg-[#0a0f20]/80 backdrop-blur-sm">
          <RPSTopPlayers 
            players={topPlayers} 
            progressPercent={Math.round((totalDiamonds / GIFT_THRESHOLDS.double_points) * 100)}
          />
          
          <RPSTopGifts 
            donors={topDonors} 
            progressPercent={Math.round((totalDiamonds / GIFT_THRESHOLDS.double_points) * 100)}
          />
        </div>
      )}
      
      {/* Voting instructions - conditionnel selon showHeader */}
      {showHeader && (
        <div className="p-3 bg-[#0a0a25]/70 backdrop-blur-sm text-center text-gray-300">
          <p className="text-lg">Vote with ✊ ✋ ✌️ in chat!</p>
        </div>
      )}
      
      {/* Controls and buttons */}
      <div className="flex justify-between bg-black/70 backdrop-blur-sm text-xs p-1">
        <div className="flex gap-2">
          <button 
            className="bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded text-xs transition-all duration-200 hover:scale-105"
            onClick={toggleVoteTester}
          >
            {showVoteTester ? "Hide votes" : "Test votes"}
          </button>
          <button 
            className="bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded text-xs transition-all duration-200 hover:scale-105"
            onClick={toggleGiftTester}
          >
            {showGiftTester ? "Hide gifts" : "Test gifts"}
          </button>
          <button 
            className="bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded text-xs transition-all duration-200 hover:scale-105"
            onClick={toggleHeader}
          >
            {showHeader ? "Compact mode" : "Full mode"}
          </button>
          {onToggleConnectForm && (
            <button 
              className="bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded text-xs transition-all duration-200 hover:scale-105"
              onClick={onToggleConnectForm}
            >
              TikTok Connect
            </button>
          )}
        </div>
        <div className="text-gray-500">
          Phase: {phase} | User: {username}
        </div>
      </div>
    </div>
  );
};

export default RPSGame; 