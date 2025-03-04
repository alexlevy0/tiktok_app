import React, { useState } from 'react';

interface FlagTesterProps {
  username: string;
  isConnected: boolean;
  onTestSent: () => void;
}

const FlagTester: React.FC<FlagTesterProps> = ({ username, isConnected, onTestSent }) => {
  const [testMessage, setTestMessage] = useState("🇫🇷 Bonjour de France!");
  const [isSending, setIsSending] = useState(false);
  
  // Drapeaux populaires pour les tests
  const popularFlags = [
    { emoji: "🇫🇷", name: "France" },
    { emoji: "🇺🇸", name: "USA" },
    { emoji: "🇬🇧", name: "UK" },
    { emoji: "🇩🇪", name: "Allemagne" },
    { emoji: "🇪🇸", name: "Espagne" },
    { emoji: "🇨🇦", name: "Canada" },
    { emoji: "🇮🇹", name: "Italie" },
    { emoji: "🇯🇵", name: "Japon" }
  ];
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected || !username || !testMessage.trim()) {
      return;
    }
    
    setIsSending(true);
    
    try {
      const response = await fetch('http://localhost:3001/test-flag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, message: testMessage })
      });
      
      if (response.ok) {
        console.log("Message de test envoyé avec succès");
        onTestSent();
      } else {
        console.error("Erreur lors de l'envoi du message de test");
      }
    } catch (err) {
      console.error("Erreur de connexion au serveur", err);
    } finally {
      setIsSending(false);
    }
  };
  
  const addFlagToMessage = (flag: string) => {
    setTestMessage(prev => `${prev} ${flag}`);
  };
  
  if (!isConnected) {
    return null;
  }
  
  return (
    <div className="bg-gray-800 p-3 rounded-lg mb-4">
      <h3 className="text-white text-sm mb-2">Testeur de drapeaux</h3>
      <div className="flex flex-wrap gap-2 mb-2">
        {popularFlags.map((flag) => (
          <button
            key={flag.emoji}
            className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-sm"
            onClick={() => addFlagToMessage(flag.emoji)}
          >
            {flag.emoji} {flag.name}
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2">
        <input
          type="text"
          value={testMessage}
          onChange={(e) => setTestMessage(e.target.value)}
          className="flex-1 p-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-1 focus:ring-pink-500"
          placeholder="Message de test avec des drapeaux"
        />
        <button
          type="submit"
          disabled={isSending}
          className="bg-pink-600 hover:bg-pink-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {isSending ? "Envoi..." : "Envoyer"}
        </button>
      </form>
    </div>
  );
};

export default FlagTester; 