
import React, { useState, useRef, useEffect } from 'react';
import { AppState, Message, AIModel } from '../types';
import { MODEL_DISPLAY_NAMES, SYSTEM_INSTRUCTIONS, COLORS } from '../constants';
import { geminiService } from '../services/geminiService';
import ChatMessage from './ChatMessage';
import { SendIcon, SparklesIcon, TrashIcon, FlameIcon, MapIcon } from './Icons';

interface SidebarUIProps {
  pageContext: string;
}

const SidebarUI: React.FC<SidebarUIProps> = ({ pageContext }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [activeModel, setActiveModel] = useState<AIModel>(AIModel.GEMINI_FLASH);
  const [isTyping, setIsTyping] = useState(false);
  const [contextEnabled, setContextEnabled] = useState(true);
  const [vibeCheck, setVibeCheck] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (overridePrompt?: string) => {
    const finalInput = overridePrompt || inputValue;
    if (!finalInput.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: finalInput,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    const assistantMsgId = (Date.now() + 1).toString();
    const newAssistantMsg: Message = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      model: activeModel,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, newAssistantMsg]);

    let fullContent = '';
    const systemPrompt = vibeCheck ? SYSTEM_INSTRUCTIONS.SLANG_AWARE : SYSTEM_INSTRUCTIONS.GENERAL;
    const contextToUse = contextEnabled ? pageContext : undefined;

    try {
      const stream = geminiService.generateStream(activeModel, finalInput, contextToUse, systemPrompt);
      for await (const chunk of stream) {
        fullContent += chunk;
        setMessages(prev => 
          prev.map(msg => msg.id === assistantMsgId ? { ...msg, content: fullContent } : msg)
        );
      }
    } catch (error) {
      setMessages(prev => 
        prev.map(msg => msg.id === assistantMsgId ? { ...msg, content: "Error: Generation failed." } : msg)
      );
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={`h-full flex flex-col transition-all duration-300 ${vibeCheck ? 'bg-slate-900 border-l border-slate-800 shadow-maasai' : 'bg-white border-l border-gray-200 shadow-2xl'} overflow-hidden`}>
      <style>{`
        .shadow-maasai { box-shadow: -10px 0 30px rgba(215, 25, 32, 0.15); }
        .text-savannah { color: ${COLORS.SAVANNAH_GOLD}; }
        .bg-maasai { background-color: ${COLORS.MAASAI_RED}; }
        .border-maasai { border-color: ${COLORS.MAASAI_RED}; }
      `}</style>

      {/* Afro-Modern Header */}
      <div className={`p-5 border-b flex items-center justify-between sticky top-0 z-10 ${vibeCheck ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-gray-100'} backdrop-blur-lg`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-2xl transition-all transform ${vibeCheck ? 'bg-maasai rotate-12 scale-110 shadow-lg shadow-red-900/50' : 'bg-indigo-50'}`}>
            <SparklesIcon className={`w-5 h-5 ${vibeCheck ? 'text-white' : 'text-indigo-600'}`} />
          </div>
          <div>
            <h2 className={`font-black text-sm uppercase tracking-tighter ${vibeCheck ? 'text-white' : 'text-slate-800'}`}>
              Zenith <span className={vibeCheck ? 'text-savannah' : 'text-indigo-600'}>Core</span>
            </h2>
            <div className={`text-[9px] font-bold uppercase tracking-widest ${vibeCheck ? 'text-red-500' : 'text-gray-400'}`}>
              {vibeCheck ? 'Kanairo Edition' : 'Standard Node'}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setVibeCheck(!vibeCheck)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-[10px] transition-all transform active:scale-95 ${
              vibeCheck ? 'bg-maasai text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            <FlameIcon className="w-3.5 h-3.5" />
            VIBE CHECK
          </button>
          <button 
            onClick={() => setMessages([])}
            className={`p-2 rounded-xl transition-colors ${vibeCheck ? 'text-slate-500 hover:text-red-400 hover:bg-slate-800' : 'text-gray-400 hover:bg-red-50 hover:text-red-500'}`}
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      {/* Context & Model Selection Area */}
      <div className={`px-4 py-4 space-y-3 ${vibeCheck ? 'bg-slate-900/50' : 'bg-gray-50/50'}`}>
        <div className="flex gap-2">
          {Object.entries(AIModel).map(([key, value]) => (
            <button
              key={value}
              onClick={() => setActiveModel(value as AIModel)}
              className={`flex-1 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider border transition-all ${
                activeModel === value 
                  ? (vibeCheck ? 'bg-white text-slate-900 border-white' : 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-200')
                  : (vibeCheck ? 'border-slate-700 text-slate-500 hover:border-slate-500' : 'bg-white border-gray-200 text-gray-400 hover:border-indigo-200')
              }`}
            >
              {key === 'GEMINI_FLASH' ? 'Flash' : key === 'GEMINI_PRO' ? 'Pro' : 'Think'}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => handleSendMessage(SYSTEM_INSTRUCTIONS.LOCAL_LENS)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-2xl font-bold text-[10px] uppercase transition-all ${
              vibeCheck ? 'bg-slate-800 text-savannah border border-slate-700 hover:bg-slate-700' : 'bg-white text-indigo-600 border border-indigo-100 shadow-sm hover:bg-indigo-50'
            }`}
          >
            <MapIcon />
            Local Lens
          </button>
          <button 
            onClick={() => setContextEnabled(!contextEnabled)}
            className={`px-3 flex items-center gap-2 py-2 rounded-2xl font-bold text-[10px] uppercase transition-all border ${
              contextEnabled 
                ? (vibeCheck ? 'bg-red-900/20 border-maasai text-maasai' : 'bg-indigo-50 border-indigo-100 text-indigo-600')
                : (vibeCheck ? 'bg-slate-800 border-slate-700 text-slate-500' : 'bg-white border-gray-100 text-gray-400')
            }`}
          >
            Context {contextEnabled ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className={`w-20 h-20 mb-6 rounded-[2.5rem] flex items-center justify-center transition-all ${
              vibeCheck ? 'bg-gradient-to-br from-red-600 to-orange-500 shadow-2xl shadow-red-500/30 rotate-3' : 'bg-indigo-600 shadow-xl shadow-indigo-100'
            }`}>
              <FlameIcon className="w-10 h-10 text-white" />
            </div>
            <h3 className={`font-black text-lg ${vibeCheck ? 'text-white' : 'text-slate-900'}`}>
              ZENITH <span className={vibeCheck ? 'text-savannah' : 'text-indigo-600'}>OS</span>
            </h3>
            <p className={`text-xs mt-3 leading-relaxed max-w-[240px] ${vibeCheck ? 'text-slate-400' : 'text-gray-500'}`}>
              {vibeCheck 
                ? "Sema mbogi! Form ni gani leo? Zenith is locked in and ready to vibe." 
                : "Your browser-integrated orchestrator is online. Awaiting system command."}
            </p>
          </div>
        ) : (
          messages.map(msg => (
            <ChatMessage key={msg.id} message={msg} />
          ))
        )}
        {isTyping && (
          <div className={`flex items-center gap-2 font-black text-[9px] uppercase tracking-widest ml-12 py-2 ${vibeCheck ? 'text-maasai animate-pulse' : 'text-indigo-600 animate-pulse'}`}>
            <span className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-current delay-75"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-current delay-150"></span>
            </span>
            Thinking...
          </div>
        )}
      </div>

      {/* Input Console */}
      <div className={`p-5 border-t ${vibeCheck ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}>
        <div className="relative group">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={vibeCheck ? "Sema na Zenith..." : "Enter prompt..."}
            className={`w-full rounded-2xl py-4 pl-5 pr-14 text-sm font-medium focus:outline-none transition-all resize-none min-h-[60px] max-h-[200px] border-2 ${
              vibeCheck 
                ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-maasai focus:ring-4 focus:ring-red-500/10' 
                : 'bg-gray-50 border-gray-100 text-slate-800 placeholder-gray-400 focus:border-indigo-500 focus:bg-white'
            }`}
            rows={1}
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isTyping}
            className={`absolute right-3 bottom-3 p-3 rounded-2xl transition-all active:scale-90 ${
              inputValue.trim() && !isTyping 
                ? (vibeCheck ? 'bg-maasai text-white shadow-lg shadow-red-900/40' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-200') 
                : (vibeCheck ? 'bg-slate-700 text-slate-500' : 'bg-gray-200 text-gray-400')
            }`}
          >
            <SendIcon />
          </button>
        </div>
        <div className="flex items-center justify-between mt-4">
           <span className={`text-[8px] font-black uppercase tracking-widest ${vibeCheck ? 'text-slate-600' : 'text-gray-300'}`}>
             Node-ID: 254-KANAIRO
           </span>
           <span className={`text-[8px] font-black uppercase tracking-widest ${vibeCheck ? 'text-slate-600' : 'text-gray-300'}`}>
             {activeModel.replace('-preview', '')}
           </span>
        </div>
      </div>
    </div>
  );
};

export default SidebarUI;
