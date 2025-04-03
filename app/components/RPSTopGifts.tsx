import React from 'react';

export type GiftDonor = {
  nickname: string;
  diamonds: number;
};

interface RPSTopGiftsProps {
  donors: GiftDonor[];
  maxToShow?: number;
  progressPercent?: number;
}

const RPSTopGifts: React.FC<RPSTopGiftsProps> = ({ 
  donors, 
  maxToShow = 5,
  progressPercent = 25
}) => {
  // Trier les donateurs par nombre de diamants (décroissant)
  const sortedDonors = [...donors].sort((a, b) => b.diamonds - a.diamonds).slice(0, maxToShow);
  
  return (
    <div className="bg-[#0a1030] rounded-lg p-3 border border-[#2a2a4a]">
      <h3 className="text-xl text-[#36e8e8] mb-2 font-semibold">Top Cadeaux 🎁</h3>
      
      {sortedDonors.length === 0 ? (
        <p className="text-gray-400 text-sm">Aucun cadeau pour l&apos;instant</p>
      ) : (
        <ul className="space-y-1">
          {sortedDonors.map((donor, index) => (
            <li key={donor.nickname} className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-lg mr-2">{index + 1}</span>
                <span className="flex-1">{donor.nickname}</span>
              </div>
              <span className="text-pink-400">{donor.diamonds} 💎</span>
            </li>
          ))}
        </ul>
      )}
      
      <div className="mt-3">
        <p className="text-sm">Objectif Cadeaux</p>
        <div className="w-full bg-[#0a0a30] h-2 rounded-full mt-1">
          <div 
            className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 h-full rounded-full" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <p className="text-xs mt-1 text-gray-400">Prochain palier: {progressPercent}%</p>
      </div>
    </div>
  );
};

export default RPSTopGifts; 