
import React from 'react';
import { Message, AIModel } from '../types';
import { MODEL_DISPLAY_NAMES, AVATAR_URLS, COLORS } from '../constants';
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
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className={`flex max-w-[92%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end gap-3 group`}>
        <div className="flex-shrink-0 mb-1">
          <img 
            src={isUser ? AVATAR_URLS.USER : AVATAR_URLS.ZENITH} 
            alt={message.role} 
            className={`w-7 h-7 rounded-xl border object-cover shadow-sm ${
              isUser ? 'border-indigo-200' : 'border-red-200'
            }`}
          />
        </div>
        
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          {!isUser && message.model && (
            <span className="text-[8px] font-black text-maasai mb-1 ml-1 uppercase tracking-widest opacity-80">
              {MODEL_DISPLAY_NAMES[message.model]}
            </span>
          )}
          
          <div className={`relative px-4 py-3 rounded-2xl shadow-sm border transition-all ${
            isUser 
              ? 'bg-indigo-600 text-white border-indigo-500 rounded-br-sm' 
              : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-gray-100 dark:border-slate-700 rounded-bl-sm'
          }`}>
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words font-medium">
              {message.content}
            </p>
            
            <button 
              onClick={copyToClipboard}
              className={`absolute -bottom-2 ${isUser ? '-left-2' : '-right-2'} p-1.5 bg-white dark:bg-slate-700 border border-gray-100 dark:border-slate-600 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-500 dark:text-slate-400 hover:text-indigo-600`}
            >
              <CopyIcon />
            </button>
          </div>
          
          <span className={`text-[8px] mt-1 font-black uppercase tracking-tighter text-gray-400 ${isUser ? 'mr-1' : 'ml-1'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
