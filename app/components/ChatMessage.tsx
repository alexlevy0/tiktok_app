import React, { useState } from 'react';
import Image from 'next/image';

interface ChatMessageProps {
  id: string;
  uniqueId: string;
  nickname: string;
  comment: string;
  profilePictureUrl: string;
  timestamp: number;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  nickname,
  comment,
  profilePictureUrl,
  timestamp
}) => {
  const [imageError, setImageError] = useState(false);
  const formattedTime = new Date(timestamp).toLocaleTimeString();
  
  return (
    <div className="group flex items-start space-x-2 p-2 mb-2 glass-effect rounded-lg transition-all duration-300 hover:scale-[1.02] animated-border">
      <div className="flex-shrink-0 relative">
        {profilePictureUrl && !imageError ? (
          <div className="relative h-8 w-8 rounded-full overflow-hidden ring-2 ring-[#36e8e8]/30 group-hover:ring-[#36e8e8]">
            <Image
              src={profilePictureUrl}
              alt={`${nickname}'s avatar`}
              fill
              sizes="32px"
              className="object-cover"
              onError={() => setImageError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#36e8e8]/20 to-transparent" />
          </div>
        ) : (
          <div className="h-8 w-8 rounded-full bg-[#0a1b40] flex items-center justify-center ring-2 ring-[#36e8e8]/30 group-hover:ring-[#36e8e8]">
            <span className="text-xs text-[#36e8e8]">{nickname.charAt(0).toUpperCase()}</span>
          </div>
        )}
        
        {/* Effet de particule sur l'avatar */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#36e8e8] to-[#ff69b4] rounded-full opacity-0 group-hover:opacity-20 blur transition-opacity" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <p className="text-sm font-semibold text-[#36e8e8] truncate group-hover:text-[#ff69b4] transition-colors">
            {nickname}
          </p>
          <span className="text-xs text-gray-400 group-hover:text-[#36e8e8]/70 transition-colors">
            {formattedTime}
          </span>
        </div>
        <p className="text-sm text-white break-words relative">
          {/* Effet de scanline sur le texte */}
          <span className="relative z-10">{comment}</span>
          <div className="absolute inset-0 scanline opacity-0 group-hover:opacity-30" />
        </p>
      </div>
      
      {/* Effet de bordure animée au survol */}
      <div className="absolute -inset-[1px] bg-gradient-to-r from-[#36e8e8] via-[#ff69b4] to-[#36e8e8] rounded-lg opacity-0 group-hover:opacity-30 transition-opacity -z-10" />
    </div>
  );
};

export default ChatMessage; 