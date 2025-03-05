import React, { useEffect, useRef, useState } from 'react';
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
  // Référence au conteneur de messages pour l'autoscroll
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  
  // Fonction pour faire défiler vers le bas
  const scrollToBottom = () => {
    if (shouldScrollToBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Gestion du défilement manuel
  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const isScrolledToBottom = scrollHeight - scrollTop - clientHeight < 50; // 50px de marge
    
    setShouldScrollToBottom(isScrolledToBottom);
  };
  
  // Défilement automatique vers le bas lorsque de nouveaux messages arrivent
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  return (
    <div className="flex flex-col h-full relative">
      <div className="bg-gray-900 text-white p-2 rounded-t-lg flex justify-between items-center">
        <h2 className="text-lg font-semibold">Chat en direct</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm">{isConnected ? 'Connecté' : 'Déconnecté'}</span>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-gray-600 text-white">
            {messages.length} message{messages.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
      
      {lastError && !isConnected && (
        <div className="bg-red-900 text-white p-2 text-sm">
          Erreur: {lastError}
        </div>
      )}
      
      <div className="relative flex-1">
        <div 
          ref={messagesContainerRef}
          className="overflow-y-auto bg-gray-900 p-3 max-h-[500px] w-full h-full"
          onScroll={handleScroll}
        >
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              {isConnected 
                ? 'En attente des messages...' 
                : 'Connectez-vous à un live TikTok pour voir les messages'}
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <ChatMessage
                  key={message.id + index}
                  id={message.id}
                  uniqueId={message.uniqueId}
                  nickname={message.nickname}
                  comment={message.comment}
                  profilePictureUrl={message.profilePictureUrl}
                  timestamp={message.timestamp}
                />
              ))}
              {/* Élément invisible pour l'autoscroll */}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
        
        {/* Bouton pour revenir en bas, positionné par-dessus le conteneur de défilement */}
        {!shouldScrollToBottom && messages.length > 0 && (
          <button 
            className="absolute bottom-4 right-4 bg-pink-600 rounded-full p-2 text-white shadow-lg hover:bg-pink-700 focus:outline-none z-10"
            onClick={() => {
              setShouldScrollToBottom(true);
              scrollToBottom();
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatList; 