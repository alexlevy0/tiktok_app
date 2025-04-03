import React, { useState, useEffect } from 'react';

interface Gift {
  id: string;
  userId: string;
  uniqueId: string;
  nickname: string;
  giftId: number;
  repeatCount: number;
  giftName: string;
  diamondCount: number;
  timestamp: number;
}

interface RPSGiftEffectsProps {
  username: string;
  isConnected: boolean;
  onSpecialEffect: (effectType: SpecialEffect, nickname?: string, diamondCount?: number) => void;
}

export type SpecialEffect = 
  | 'double_points'
  | 'reveal_bot'
  | 'cancel_loss'
  | 'slow_timer'
  | null;

const RPSGiftEffects: React.FC<RPSGiftEffectsProps> = ({
  username,
  isConnected,
  onSpecialEffect
}) => {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [totalDiamonds, setTotalDiamonds] = useState<number>(0);
  const [activeEffect, setActiveEffect] = useState<SpecialEffect>(null);
  const [showAnimation, setShowAnimation] = useState<boolean>(false);
  const [lastGiftId, setLastGiftId] = useState<string | null>(null);
  
  // Simuler les seuils de cadeaux pour les effets spéciaux
  const GIFT_THRESHOLDS = {
    slow_timer: 50,
    reveal_bot: 100,
    cancel_loss: 200,
    double_points: 500
  };
  
  // Récupérer les cadeaux du serveur
  const fetchGifts = async () => {
    if (!isConnected || !username) return;
    
    try {
      // Note: Cette route n'existe pas encore sur le serveur - il faudra l'implémenter plus tard
      const response = await fetch(`http://localhost:3001/gifts?username=${username}`);
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.gifts && Array.isArray(data.gifts)) {
          // Filtrer pour ne traiter que les nouveaux cadeaux
          const newGifts = data.gifts.filter(
            (gift: Gift) => !lastGiftId || gift.id > lastGiftId
          );
          
          if (newGifts.length > 0) {
            // Mise à jour du dernier ID de cadeau traité
            const latestGiftId = newGifts[newGifts.length - 1].id;
            setLastGiftId(latestGiftId);
            
            // Ajouter les nouveaux cadeaux
            setGifts(prev => [...prev, ...newGifts].slice(-5)); // Garder seulement les 5 derniers
            
            // Calculer les diamants totaux
            const additionalDiamonds = newGifts.reduce(
              (sum: number, gift: Gift) => sum + gift.diamondCount, 0
            );
            
            setTotalDiamonds(prev => {
              const newTotal = prev + additionalDiamonds;
              
              // Vérifier si un seuil a été atteint
              if (prev < GIFT_THRESHOLDS.slow_timer && newTotal >= GIFT_THRESHOLDS.slow_timer) {
                triggerSpecialEffect('slow_timer', newGifts[0]);
              } else if (prev < GIFT_THRESHOLDS.reveal_bot && newTotal >= GIFT_THRESHOLDS.reveal_bot) {
                triggerSpecialEffect('reveal_bot', newGifts[0]);
              } else if (prev < GIFT_THRESHOLDS.cancel_loss && newTotal >= GIFT_THRESHOLDS.cancel_loss) {
                triggerSpecialEffect('cancel_loss', newGifts[0]);
              } else if (prev < GIFT_THRESHOLDS.double_points && newTotal >= GIFT_THRESHOLDS.double_points) {
                triggerSpecialEffect('double_points', newGifts[0]);
              }
              
              return newTotal;
            });
            
            // Afficher une animation pour les gros cadeaux
            if (newGifts.some((gift: Gift) => gift.diamondCount >= 10)) {
              playGiftAnimation();
            }
          }
        }
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des cadeaux:', err);
    }
  };
  
  // Déclencher un effet spécial
  const triggerSpecialEffect = (effectType: SpecialEffect, gift?: Gift) => {
    setActiveEffect(effectType);
    setShowAnimation(true);
    
    // Envoyer l'effet au composant parent
    if (gift) {
      onSpecialEffect(effectType, gift.nickname, gift.diamondCount);
    } else {
      onSpecialEffect(effectType);
    }
    
    // Masquer l'animation après 5 secondes
    setTimeout(() => {
      setShowAnimation(false);
      // L'effet reste actif même après la disparition de l'animation
    }, 5000);
  };
  
  // Afficher une animation pour un cadeau
  const playGiftAnimation = () => {
    setShowAnimation(true);
    
    // Masquer l'animation après 3 secondes
    setTimeout(() => {
      setShowAnimation(false);
    }, 3000);
  };
  
  // Récupérer périodiquement les cadeaux
  useEffect(() => {
    if (!isConnected || !username) return;
    
    fetchGifts(); // Première exécution
    
    const interval = setInterval(fetchGifts, 2000); // Toutes les 2 secondes
    
    return () => clearInterval(interval);
  }, [isConnected, username]);
  
  // Contenu de l'effet spécial
  const renderSpecialEffectContent = () => {
    switch (activeEffect) {
      case 'double_points':
        return (
          <div className="text-yellow-300 font-bold text-center">
            <div className="text-2xl mb-2">⭐⭐ POINTS DOUBLÉS ⭐⭐</div>
          </div>
        );
      case 'reveal_bot':
        return (
          <div className="text-blue-300 font-bold text-center">
            <div className="text-2xl mb-2">👁️ VISION 👁️</div>
          </div>
        );
      case 'cancel_loss':
        return (
          <div className="text-green-300 font-bold text-center">
            <div className="text-2xl mb-2">🛡️ PROTECTION 🛡️</div>
          </div>
        );
      case 'slow_timer':
        return (
          <div className="text-purple-300 font-bold text-center">
            <div className="text-2xl mb-2">⏱️ RALENTI ⏱️</div>
          </div>
        );
      default:
        return (
          <div className="text-pink-300 font-bold text-center">
            <div className="text-2xl mb-2">🎁 MERCI POUR LE CADEAU! 🎁</div>
          </div>
        );
    }
  };
  
  return (
    <div className="relative">
      {/* Barre de progression des cadeaux */}
      <div className="mb-2">
        <div className="flex justify-between text-xs text-gray-300 mb-1">
          <span>Objectif de cadeaux</span>
          <span>{totalDiamonds} / {GIFT_THRESHOLDS.double_points} 💎</span>
        </div>
        <div className="w-full bg-gray-700 h-3 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 h-full transition-all duration-300"
            style={{ width: `${Math.min(100, (totalDiamonds / GIFT_THRESHOLDS.double_points) * 100)}%` }}
          />
        </div>
      </div>
      
      {/* Liste des donateurs récents */}
      {gifts.length > 0 && (
        <div className="mb-2">
          <div className="text-xs text-gray-300 mb-1">Derniers cadeaux:</div>
          <div className="flex flex-wrap gap-1">
            {gifts.map((gift) => (
              <div 
                key={gift.id}
                className="text-xs bg-gray-800 rounded-full px-2 py-1 flex items-center"
              >
                <span className="font-bold text-pink-400 mr-1">{gift.nickname}</span>
                <span>
                  {gift.giftName} ({gift.diamondCount}💎)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Animation d'effet spécial */}
      {showAnimation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 animate-fade-in">
          <div className="p-8 max-w-md animate-bounce-in">
            {renderSpecialEffectContent()}
          </div>
        </div>
      )}
      
      {/* Indicateurs d'effets actifs */}
      {activeEffect && (
        <div className="absolute top-0 right-0 bg-gray-800 bg-opacity-80 p-2 rounded-lg animate-pulse">
          {activeEffect === 'double_points' && <span className="text-yellow-300">⭐</span>}
          {activeEffect === 'reveal_bot' && <span className="text-blue-300">👁️</span>}
          {activeEffect === 'cancel_loss' && <span className="text-green-300">🛡️</span>}
          {activeEffect === 'slow_timer' && <span className="text-purple-300">⏱️</span>}
        </div>
      )}
    </div>
  );
};

export default RPSGiftEffects; 