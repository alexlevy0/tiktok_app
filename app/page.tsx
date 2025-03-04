'use client';

import React, { useState, useEffect, useCallback } from 'react';
import TikTokConnectForm from './components/TikTokConnectForm';
import ChatList from './components/ChatList';

interface ChatMessage {
  id: string;
  uniqueId: string;
  nickname: string;
  comment: string;
  profilePictureUrl: string;
  timestamp: number;
}

// URL de base de l'API
const API_BASE_URL = 'http://localhost:3001/api/tiktok';

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [lastError, setLastError] = useState<string | undefined>(undefined);
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  // Vérifier si le serveur est en ligne
  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL.split('/api/tiktok')[0]}/`, { 
          method: 'GET',
          headers: { 'Cache-Control': 'no-cache' } 
        });
        setServerStatus(response.ok ? 'online' : 'offline');
      } catch {
        setServerStatus('offline');
      }
    };

    checkServerStatus();
    const interval = setInterval(checkServerStatus, 10000); // Vérifier toutes les 10 secondes
    
    return () => clearInterval(interval);
  }, []);

  // Fonction pour se connecter à un live TikTok
  const handleConnect = async (inputUsername: string) => {
    if (serverStatus === 'offline') {
      setError('Le serveur Express n\'est pas accessible. Veuillez lancer le serveur avec "npm run server".');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: inputUsername }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsConnected(true);
        setUsername(data.username);
      } else {
        setError(data.message || 'Erreur lors de la connexion');
        setIsConnected(false);
      }
    } catch {
      setError('Erreur de connexion au serveur. Assurez-vous que le serveur est en cours d\'exécution avec "npm run server".');
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour se déconnecter d'un live TikTok
  const handleDisconnect = async () => {
    if (!username) return;
    
    setIsLoading(true);
    
    try {
      await fetch(`${API_BASE_URL}/disconnect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });
      
      setIsConnected(false);
      setUsername(null);
      setMessages([]);
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour récupérer les messages
  const fetchMessages = useCallback(async () => {
    if (!username || !isConnected) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/messages?username=${encodeURIComponent(username)}`);
      const data = await response.json();
      
      if (data.success) {
        setIsConnected(data.isConnected);
        setMessages(data.messages);
        setLastError(data.lastError);
        
        // Si le statut de connexion a changé à déconnecté
        if (!data.isConnected && isConnected) {
          setError(data.lastError || 'Déconnecté du live TikTok');
        }
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des messages:', err);
    }
  }, [username, isConnected]);

  // Récupérer les messages toutes les secondes
  useEffect(() => {
    if (!isConnected || !username) return;
    
    fetchMessages();
    
    const interval = setInterval(fetchMessages, 1000);
    
    return () => clearInterval(interval);
  }, [isConnected, username, fetchMessages]);

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 bg-gray-950">
      <div className="max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">TikTok Live Chat Viewer</h1>
        
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
        
        {error && (
          <div className="bg-red-800 text-white p-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        
        <TikTokConnectForm
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
          isConnected={isConnected}
          isLoading={isLoading}
          currentUsername={username || undefined}
        />
        
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <ChatList 
            messages={messages} 
            isConnected={isConnected}
            lastError={lastError}
          />
        </div>
      </div>
    </main>
  );
}
