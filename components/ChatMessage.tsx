
import React from 'react';
import { Message, AIModel } from '../types';
import { MODEL_DISPLAY_NAMES, AVATAR_URLS } from '../constants';
import { CopyIcon } from './Icons';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
  };

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[90%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-2 group`}>
        <img 
          src={isUser ? AVATAR_URLS.USER : AVATAR_URLS.ZENITH} 
          alt={message.role} 
          className="w-8 h-8 rounded-full border border-gray-200 flex-shrink-0"
        />
        
        <div className="flex flex-col">
          {!isUser && message.model && (
            <span className="text-[10px] font-bold text-indigo-500 mb-1 ml-1 uppercase tracking-wider">
              {MODEL_DISPLAY_NAMES[message.model]}
            </span>
          )}
          
          <div className={`relative px-4 py-3 rounded-2xl shadow-sm border ${
            isUser 
              ? 'bg-indigo-600 text-white border-indigo-500 rounded-tr-none' 
              : 'bg-white text-slate-800 border-gray-100 rounded-tl-none'
          }`}>
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {message.content}
            </p>
            
            <button 
              onClick={copyToClipboard}
              className={`absolute -bottom-2 ${isUser ? '-left-2' : '-right-2'} p-1 bg-white border border-gray-100 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-500 hover:text-indigo-600`}
              title="Copy to clipboard"
            >
              <CopyIcon />
            </button>
          </div>
          
          <span className={`text-[10px] mt-1 text-gray-400 font-medium ${isUser ? 'text-right mr-1' : 'text-left ml-1'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
