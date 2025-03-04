import React from 'react';
import ChatMessage from './ChatMessage';

interface ChatMessage {
  id: string;
  uniqueId: string;
  nickname: string;
  comment: string;
  profilePictureUrl: string;
  timestamp: number;
}

interface ChatListProps {
  messages: ChatMessage[];
  isConnected: boolean;
  lastError?: string;
}

const ChatList: React.FC<ChatListProps> = ({ messages, isConnected, lastError }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="bg-gray-900 text-white p-2 rounded-t-lg flex justify-between items-center">
        <h2 className="text-lg font-semibold">Chat en direct</h2>
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm">{isConnected ? 'Connecté' : 'Déconnecté'}</span>
        </div>
      </div>
      
      {lastError && !isConnected && (
        <div className="bg-red-900 text-white p-2 text-sm">
          Erreur: {lastError}
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto bg-gray-900 p-3 max-h-[500px]">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            {isConnected 
              ? 'En attente des messages...' 
              : 'Connectez-vous à un live TikTok pour voir les messages'}
          </div>
        ) : (
          messages.map((message, index) => (
            <ChatMessage
              key={message.id + index}
              id={message.id}
              uniqueId={message.uniqueId}
              nickname={message.nickname}
              comment={message.comment}
              profilePictureUrl={message.profilePictureUrl}
              timestamp={message.timestamp}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList; 