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
    <div className="flex items-start space-x-2 p-2 mb-2 bg-gray-800 rounded-lg">
      <div className="flex-shrink-0">
        {profilePictureUrl && !imageError ? (
          <div className="relative h-8 w-8 rounded-full overflow-hidden">
            <Image
              src={profilePictureUrl}
              alt={`${nickname}'s avatar`}
              fill
              sizes="32px"
              className="object-cover"
              onError={() => setImageError(true)}
            />
          </div>
        ) : (
          <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
            <span className="text-xs text-white">{nickname.charAt(0).toUpperCase()}</span>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <p className="text-sm font-semibold text-pink-400 truncate">{nickname}</p>
          <span className="text-xs text-gray-400">{formattedTime}</span>
        </div>
        <p className="text-sm text-white break-words">{comment}</p>
      </div>
    </div>
  );
};

export default ChatMessage; 