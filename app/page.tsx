'use client';

import React, { useEffect, useState, useCallback } from 'react';
import TikTokConnectForm from './components/TikTokConnectForm';
import ChatList from './components/ChatList';
import FlagHistogram from './components/FlagHistogram';
import FlagTester from './components/FlagTester';
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

export default function Home() {
  const [username, setUsername] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [serverStatus, setServerStatus] = useState<ServerStatus>('loading');
  const [lastError, setLastError] = useState<string>('');
  const [flagCounts, setFlagCounts] = useState<Record<string, number>>({});

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

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 bg-gray-950">
      <div className="max-w-4xl w-full">
        {/* <h1 className="text-3xl font-bold text-white mb-8 text-center">TikTok Live Chat Viewer</h1> */}
        
        {serverStatus === 'offline' && (
          <div className="bg-yellow-800 text-white p-3 rounded-lg mb-4">
            <p>⚠️ Le serveur Express n&apos;est pas accessible. Veuillez suivre ces étapes :</p>
            <ol className="list-decimal ml-5 mt-2">
              <li>Ouvrez un terminal</li>
              <li>Exécutez <code className="bg-yellow-900 px-1 rounded">npm run server</code></li>
              <li>Attendez que le serveur démarre sur le port 3001</li>
              <li>Rafraîchissez cette page</li>
            </ol>
          </div>
        )}

        {serverStatus === 'online' && (
          <div className="bg-green-800 text-white p-3 rounded-lg mb-4">
            <p>✅ Serveur Express connecté. Vous pouvez maintenant vous connecter aux chats TikTok en direct.</p>
          </div>
        )}
        
        <TikTokConnectForm 
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
          isConnected={isConnected}
          isLoading={isLoading}
          currentUsername={username}
        />
        
        {isConnected && (
          <>
            <FlagTester 
              username={username}
              isConnected={isConnected}
              onTestSent={handleTestMessageSent}
            />
            <FlagHistogram flagCounts={flagCounts} />
          </>
        )}
        
        <ChatList 
          messages={messages}
          isConnected={isConnected}
          lastError={lastError}
        />
      </div>
    </main>
  );
}
