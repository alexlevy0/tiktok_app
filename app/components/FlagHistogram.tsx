import React from 'react';
import { getCountryName } from '../utils/countryData';

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
  // Calculer le total des drapeaux pour les pourcentages
  const totalFlags = Object.values(flagCounts).reduce((sum, count) => sum + count, 0);
  
  // Constantes pour le dimensionnement des drapeaux
  const MIN_FONT_SIZE = 1.2; // en rem
  const MAX_FONT_SIZE = 2.8; // en rem

  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-white text-base font-semibold">Origine des spectateurs</h3>
        <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded-full">
          Total: {totalFlags} drapeaux
        </span>
      </div>
      
      <div className="space-y-4">
        {sortedFlags.map(([flag, count]) => {
          // Calculer la taille relative du drapeau
          const relativeSize = (count / maxCount);
          const fontSize = MIN_FONT_SIZE + (MAX_FONT_SIZE - MIN_FONT_SIZE) * relativeSize;
          // Calculer le pourcentage
          const percentage = Math.round((count / totalFlags) * 100);
          // Obtenir le nom du pays
          const countryName = getCountryName(flag);
          
          return (
            <div key={flag} className="flex flex-col">
              <div className="flex items-center mb-1">
                <div 
                  className="flex items-center justify-center"
                  style={{ 
                    width: '50px',
                    minWidth: '50px',
                  }}
                >
                  <span 
                    style={{ 
                      fontSize: `${fontSize}rem`,
                      lineHeight: 1,
                    }}
                  >
                    {flag}
                  </span>
                </div>
                <div className="ml-2">
                  <span className="text-white text-sm">{countryName}</span>
                </div>
              </div>
              
              <div className="flex-1 pl-[50px]">
                <div className="w-full h-7 bg-gray-700 rounded-md overflow-hidden relative">
                  <div 
                    className="h-full rounded-sm bg-gradient-to-r from-pink-600 to-purple-600" 
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  />
                  <div className="absolute inset-0 flex items-center px-3 justify-between">
                    <span className="text-white text-xs font-medium">{count}</span>
                    <span className="text-white text-xs font-medium">{percentage}%</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FlagHistogram; 