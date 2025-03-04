import React, { useState } from 'react';

interface TikTokConnectFormProps {
  onConnect: (username: string) => void;
  onDisconnect: () => void;
  isConnected: boolean;
  isLoading: boolean;
  currentUsername?: string;
}

const TikTokConnectForm: React.FC<TikTokConnectFormProps> = ({
  onConnect,
  onDisconnect,
  isConnected,
  isLoading,
  currentUsername,
}) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onConnect(username.trim());
    }
  };

  // Quelques exemples de streamers populaires pour les tests
  const suggestedStreamers = [
    { name: 'tiktok', label: 'TikTok Official' },
    { name: 'live_damai', label: 'Live Damai' },
    { name: 'tiktoklivestreaming', label: 'TikTok Streaming' }
  ];

  const tryExampleStreamer = (streamerName: string) => {
    setUsername(streamerName);
    onConnect(streamerName);
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-4">
      <h2 className="text-xl font-bold text-white mb-4">TikTok Live Chat</h2>
      
      {isConnected && currentUsername ? (
        <div className="flex flex-col gap-3">
          <div className="text-green-400 mb-2">
            Connecté au chat de <span className="font-bold">@{currentUsername}</span>
          </div>
          <button
            onClick={onDisconnect}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
            disabled={isLoading}
          >
            {isLoading ? 'Déconnexion...' : 'Se déconnecter'}
          </button>
        </div>
      ) : (
        <div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                Nom d&apos;utilisateur TikTok
              </label>
              <input
                type="text"
                id="username"
                placeholder="Entrez le nom d&apos;utilisateur (@username)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                disabled={isLoading}
                required
              />
              <p className="mt-1 text-xs text-gray-400">
                Entrez le nom d&apos;utilisateur d&apos;un compte actuellement en live sur TikTok
              </p>
            </div>
            
            <button
              type="submit"
              className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
              disabled={isLoading || !username.trim()}
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
          
          <div className="mt-4">
            <p className="text-sm text-gray-300 mb-2">Essayez ces comptes populaires (s&apos;ils sont en live) :</p>
            <div className="flex flex-wrap gap-2">
              {suggestedStreamers.map((streamer) => (
                <button
                  key={streamer.name}
                  onClick={() => tryExampleStreamer(streamer.name)}
                  className="bg-gray-700 hover:bg-gray-600 text-white text-xs py-1 px-2 rounded"
                  disabled={isLoading}
                >
                  @{streamer.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TikTokConnectForm; 