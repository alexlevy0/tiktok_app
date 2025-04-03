import React, { useState } from 'react';

interface RPSGiftTesterProps {
  username: string;
  isConnected: boolean;
  onTestGift?: (nickname: string, diamondCount: number) => void;
}

const RPSGiftTester: React.FC<RPSGiftTesterProps> = ({ username, isConnected, onTestGift }) => {
  const [isSending, setIsSending] = useState(false);
  const [giftName, setGiftName] = useState('Rose');
  const [diamondCount, setDiamondCount] = useState(1);
  const [nickname, setNickname] = useState('Fan');
  
  // Liste de cadeaux prédéfinis pour simplifier les tests
  const predefinedGifts = [
    { name: 'Rose', diamonds: 1 },
    { name: 'Like', diamonds: 5 },
    { name: 'TikTok', diamonds: 10 },
    { name: 'Love', diamonds: 25 },
    { name: 'Galaxy', diamonds: 50 },
    { name: 'Crown', diamonds: 100 },
    { name: 'Lion', diamonds: 200 },
    { name: 'Universe', diamonds: 500 }
  ];
  
  // Envoyer un cadeau de test
  const handleSendGift = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected || !username) {
      return;
    }
    
    setIsSending(true);
    
    try {
      const response = await fetch('http://localhost:3001/test-gift', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          giftName,
          diamondCount: Number(diamondCount),
          nickname
        })
      });
      
      if (response.ok) {
        console.log(`Cadeau de test envoyé: ${giftName} (${diamondCount} diamants)`);
        
        // Mettre à jour le classement des donateurs
        if (onTestGift) {
          onTestGift(nickname, Number(diamondCount));
        }
      } else {
        console.error("Erreur lors de l'envoi du cadeau de test");
      }
    } catch (err) {
      console.error("Erreur de connexion au serveur", err);
    } finally {
      setIsSending(false);
    }
  };
  
  // Sélectionner un cadeau prédéfini
  const selectPredefinedGift = (name: string, diamonds: number) => {
    setGiftName(name);
    setDiamondCount(diamonds);
  };
  
  if (!isConnected) {
    return null;
  }
  
  return (
    <div className="mb-3 p-3 bg-[#0a1030] rounded-lg border border-[#2a2a4a]">
      <h3 className="text-[#36e8e8] text-sm mb-2 font-semibold">Testeur de cadeaux (effets spéciaux)</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
        {predefinedGifts.map((gift) => (
          <button
            key={gift.name}
            className={`p-1 rounded text-xs ${
              giftName === gift.name && diamondCount === gift.diamonds
                ? 'bg-[#aa3366] text-white border border-[#ff6699]'
                : 'bg-[#0a1b40] hover:bg-[#0a2b50] text-gray-200 border border-[#1e3a6a]'
            }`}
            onClick={() => selectPredefinedGift(gift.name, gift.diamonds)}
          >
            {gift.name} ({gift.diamonds} 💎)
          </button>
        ))}
      </div>
      
      <form onSubmit={handleSendGift} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="flex-1 p-2 bg-[#0a1020] text-white rounded text-xs border border-[#1e3a6a] focus:outline-none focus:border-[#36e8e8]"
          placeholder="Nom du donateur"
        />
        <input
          type="text"
          value={giftName}
          onChange={(e) => setGiftName(e.target.value)}
          className="flex-1 p-2 bg-[#0a1020] text-white rounded text-xs border border-[#1e3a6a] focus:outline-none focus:border-[#36e8e8]"
          placeholder="Nom du cadeau"
        />
        <input
          type="number"
          value={diamondCount}
          onChange={(e) => setDiamondCount(Number(e.target.value))}
          className="w-24 p-2 bg-[#0a1020] text-white rounded text-xs border border-[#1e3a6a] focus:outline-none focus:border-[#36e8e8]"
          placeholder="Diamants"
          min="1"
          max="1000"
        />
        <button
          type="submit"
          disabled={isSending}
          className="bg-[#0a2b30] hover:bg-[#0a3b40] text-[#00ffbb] px-4 py-2 rounded text-xs disabled:opacity-50 border border-[#1e5a6a]"
        >
          {isSending ? "Envoi..." : "Envoyer le cadeau"}
        </button>
      </form>
      
      <div className="mt-3 text-xs text-gray-400">
        <p>Seuils d&apos;effets spéciaux:</p>
        <ul className="list-disc ml-5 mt-1">
          <li>50 💎: ⏱️</li>
          <li>100 💎: 👁️</li>
          <li>200 💎: 🛡️</li>
          <li>500 💎: ⭐</li>
        </ul>
      </div>
    </div>
  );
};

export default RPSGiftTester; 