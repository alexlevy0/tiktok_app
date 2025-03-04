import React from 'react';

interface FlagHistogramProps {
  flagCounts: Record<string, number>;
}

const FlagHistogram: React.FC<FlagHistogramProps> = ({ flagCounts }) => {
  // Trier les drapeaux par nombre d'occurrences (du plus au moins fréquent)
  const sortedFlags = Object.entries(flagCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 15); // Limiter à 15 drapeaux pour éviter l'encombrement

  // Si aucun drapeau n'a été détecté
  if (sortedFlags.length === 0) {
    return (
      <div className="bg-gray-800 p-3 rounded-lg mb-4">
        <h3 className="text-white text-sm mb-2">Statistiques des drapeaux</h3>
        <p className="text-gray-400 text-xs">
          Aucun drapeau détecté dans le chat pour le moment. 
          Essayez d&apos;envoyer un drapeau comme 🇫🇷 dans le chat.
        </p>
        <p className="text-gray-500 text-xs mt-1">
          (Les drapeaux sont des emojis comme 🇫🇷, 🇺🇸, 🇬🇧, etc.)
        </p>
      </div>
    );
  }

  // Trouver la valeur maximale pour dimensionner l'histogramme
  const maxCount = Math.max(...Object.values(flagCounts));

  return (
    <div className="bg-gray-800 p-3 rounded-lg mb-4">
      <h3 className="text-white text-sm mb-2">Statistiques des drapeaux</h3>
      <div className="space-y-2">
        {sortedFlags.map(([flag, count]) => (
          <div key={flag} className="flex items-center">
            <div className="w-8 text-center text-xl">{flag}</div>
            <div className="flex-1 ml-2">
              <div className="flex items-center">
                <div 
                  className="bg-pink-500 h-5 rounded-sm" 
                  style={{ width: `${(count / maxCount) * 100}%` }}
                ></div>
                <span className="ml-2 text-white text-xs">{count}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlagHistogram; 