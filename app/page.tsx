'use client';

import React, { useEffect, useState, useCallback } from 'react';
import TikTokConnectForm from './components/TikTokConnectForm';
import ChatList from './components/ChatList';
import FlagHistogram from './components/FlagHistogram';
import FlagTester from './components/FlagTester';
import RPSGame from './components/RPSGame';
import { updateFlagCounts } from './utils/flagUtils';

interface ChatMessage {
  id: string;
  uniqueId: string;
  nickname: string;
  comment: string;
  profilePictureUrl: string;
  timestamp: number;
}

type ServerStatus = 'loading' | 'online' | 'offline';
type ActiveView = 'chat' | 'flags' | 'game';

// Composant de particules flottantes
const FloatingParticles = () => {
  useEffect(() => {
    const container = document.querySelector('.floating-particles');
    if (!container) return;

    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDuration = `${15 + Math.random() * 10}s`;
      particle.style.opacity = '0';
      container.appendChild(particle);

      setTimeout(() => particle.remove(), 20000);
    };

    const interval = setInterval(() => {
      if (container.childNodes.length < 50) {
        createParticle();
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return <div className="floating-particles" />;
};

export default function Home() {
  const [username, setUsername] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [serverStatus, setServerStatus] = useState<ServerStatus>('loading');
  const [lastError, setLastError] = useState<string>('');
  const [flagCounts, setFlagCounts] = useState<Record<string, number>>({});
  const [activeView, setActiveView] = useState<ActiveView>('chat');
  const [showConnectForm, setShowConnectForm] = useState<boolean>(true);

  // Vérifier si le serveur Express est disponible
  const checkServerStatus = async () => {
    try {
      const response = await fetch('http://localhost:3001/status', { 
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        setServerStatus('online');
      } else {
        setServerStatus('offline');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du serveur:', error);
      setServerStatus('offline');
    }
  };
  
  // Vérifier le statut du serveur au chargement
  useEffect(() => {
    checkServerStatus();
  }, []);

  // Se connecter à un live TikTok
  const handleConnect = async (inputUsername: string) => {
    if (!inputUsername.trim()) return;
    
    setIsLoading(true);
    setLastError('');
    
    try {
      const response = await fetch('http://localhost:3001/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: inputUsername })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setUsername(inputUsername);
        setIsConnected(true);
        setFlagCounts({}); // Réinitialiser les compteurs de drapeaux
        console.log(`Connecté au live de ${inputUsername}`);
      } else {
        setLastError(data.error || 'Erreur lors de la connexion au live');
        console.error('Erreur:', data.error);
      }
    } catch (err) {
      setLastError('Erreur serveur. Assurez-vous que le serveur Express est en cours d\'exécution.');
      console.error('Erreur lors de la connexion:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Se déconnecter d'un live TikTok
  const handleDisconnect = async () => {
    if (!username) return;
    
    try {
      await fetch('http://localhost:3001/disconnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });
      
      setIsConnected(false);
      setMessages([]);
      console.log(`Déconnecté du live de ${username}`);
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err);
    }
  };
  
  // Récupérer les messages du serveur
  const fetchMessages = useCallback(async () => {
    if (!username) return;
    
    try {
      const response = await fetch(`http://localhost:3001/messages?username=${username}`);
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.messages && Array.isArray(data.messages)) {
          setMessages(prevMessages => {
            // Filtre pour n'ajouter que les nouveaux messages
            const newMessages = data.messages.filter(
              (newMsg: ChatMessage) => !prevMessages.some(existingMsg => existingMsg.id === newMsg.id)
            );
            
            // Mettre à jour les compteurs de drapeaux avec les nouveaux messages
            let updatedFlagCounts = { ...flagCounts };
            newMessages.forEach((msg: ChatMessage) => {
              updatedFlagCounts = updateFlagCounts(updatedFlagCounts, msg.comment);
            });
            
            if (newMessages.length > 0) {
              setFlagCounts(updatedFlagCounts);
            }
            
            // Combiner les anciens et nouveaux messages, et limiter à 100 messages
            return [...prevMessages, ...newMessages].slice(-100);
          });
        }
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des messages:', err);
    }
  }, [username, isConnected, flagCounts]);

  // Récupérer les messages toutes les secondes
  useEffect(() => {
    if (!isConnected || !username) return;
    
    fetchMessages();
    
    const interval = setInterval(fetchMessages, 1000);
    
    return () => clearInterval(interval);
  }, [isConnected, username, fetchMessages]);

  // Effet de débogage pour surveiller flagCounts
  useEffect(() => {
    if (Object.keys(flagCounts).length > 0) {
      console.log("État actuel de flagCounts:", flagCounts);
    }
  }, [flagCounts]);

  // Gestionnaire pour le rafraîchissement des messages après l'envoi d'un message de test
  const handleTestMessageSent = () => {
    fetchMessages();
  };

  // Rendre le composant correspondant à la vue active
  const renderActiveView = () => {
    switch (activeView) {
      case 'game':
        return (
          <RPSGame 
            username={username}
            isConnected={isConnected}
            onToggleConnectForm={toggleConnectForm}
          />
        );
      case 'flags':
        return (
          <>
            <FlagTester 
              username={username}
              isConnected={isConnected}
              onTestSent={handleTestMessageSent}
            />
            <FlagHistogram flagCounts={flagCounts} />
          </>
        );
      case 'chat':
      default:
        return (
          <ChatList 
            messages={messages}
            isConnected={isConnected}
            lastError={lastError}
          />
        );
    }
  };

  // Fonction pour basculer l'affichage du formulaire de connexion
  const toggleConnectForm = () => {
    setShowConnectForm(prev => !prev);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 relative">
      {/* Effet de fond animé est déjà appliqué via CSS global */}
      
      {/* Particules flottantes */}
      <FloatingParticles />
      
      {/* Grille cyber en arrière-plan */}
      <div className="fixed inset-0 cyber-grid opacity-20" />
      
      {/* Effet de scan */}
      <div className="fixed inset-0 scanline pointer-events-none" />
      
      <div className="max-w-4xl w-full relative">
        {/* <h1 className="text-3xl font-bold text-white mb-8 text-center">TikTok Live Chat Viewer</h1> */}
        
        {serverStatus === 'offline' && (
          <div className="glass-effect text-white p-3 rounded-lg mb-4 animated-border">
            <p>⚠️ Le serveur Express n&apos;est pas accessible. Veuillez suivre ces étapes :</p>
            <ol className="list-decimal ml-5 mt-2">
              <li>Ouvrez un terminal</li>
              <li>Exécutez <code className="bg-[#0a1b30] px-1 rounded">npm run server</code></li>
              <li>Attendez que le serveur démarre sur le port 3001</li>
              <li>Rafraîchissez cette page</li>
            </ol>
          </div>
        )}

        {serverStatus === 'online' && showConnectForm && (
          <div className="glass-effect text-white p-3 rounded-lg mb-4 animated-border">
            <p className="neon-text">✅ Serveur Express connecté. Vous pouvez maintenant vous connecter aux chats TikTok en direct.</p>
          </div>
        )}
        
        <div className="flex justify-end mb-2">
          <button
            onClick={toggleConnectForm}
            className="glass-effect hover:bg-gray-600 text-white text-sm py-1 px-2 rounded animated-border"
          >
            {showConnectForm ? "Masquer TikTok Connect" : "Afficher TikTok Connect"}
          </button>
        </div>
        
        {showConnectForm && (
          <div className="glass-effect animated-border">
            <TikTokConnectForm 
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
              isConnected={isConnected}
              isLoading={isLoading}
              currentUsername={username}
            />
          </div>
        )}
        
        {isConnected && (
          <>
            <div className="mb-4">
              <div className="glass-effect p-2 rounded-lg flex gap-2 animated-border">
                <button 
                  className={`flex-1 py-2 px-4 rounded-md transition-colors ${activeView === 'chat' ? 'bg-pink-600 neon-text' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
                  onClick={() => setActiveView('chat')}
                >
                  Chat
                </button>
                <button 
                  className={`flex-1 py-2 px-4 rounded-md transition-colors ${activeView === 'flags' ? 'bg-pink-600 neon-text' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
                  onClick={() => setActiveView('flags')}
                >
                  Drapeaux
                </button>
                <button 
                  className={`flex-1 py-2 px-4 rounded-md transition-colors ${activeView === 'game' ? 'bg-pink-600 neon-text' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
                  onClick={() => setActiveView('game')}
                >
                  Jeu PPC
                </button>
              </div>
            </div>
          </>
        )}
        
        <div className="glass-effect rounded-lg animated-border">
          {renderActiveView()}
        </div>
      </div>
    </main>
  );
}
