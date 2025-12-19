
import React, { useState, useRef, useEffect } from 'react';
import { AppState, Message, AIModel } from '../types';
import { MODEL_DISPLAY_NAMES, SYSTEM_INSTRUCTIONS } from '../constants';
import { geminiService } from '../services/geminiService';
import ChatMessage from './ChatMessage';
import { SendIcon, SparklesIcon, TrashIcon, LayersIcon, GlobeIcon } from './Icons';

interface SidebarUIProps {
  pageContext: string;
}

const SidebarUI: React.FC<SidebarUIProps> = ({ pageContext }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [activeModel, setActiveModel] = useState<AIModel>(AIModel.GEMINI_FLASH);
  const [isTyping, setIsTyping] = useState(false);
  const [contextEnabled, setContextEnabled] = useState(true);
  const [slangMode, setSlangMode] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
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
    const systemPrompt = slangMode ? SYSTEM_INSTRUCTIONS.SLANG_AWARE : SYSTEM_INSTRUCTIONS.GENERAL;
    const contextToUse = contextEnabled ? pageContext : undefined;

    try {
      const stream = geminiService.generateStream(activeModel, inputValue, contextToUse, systemPrompt);
      
      for await (const chunk of stream) {
        fullContent += chunk;
        setMessages(prev => 
          prev.map(msg => msg.id === assistantMsgId ? { ...msg, content: fullContent } : msg)
        );
      }
    } catch (error) {
      setMessages(prev => 
        prev.map(msg => msg.id === assistantMsgId ? { ...msg, content: "Error: Failed to fetch response." } : msg)
      );
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200 shadow-2xl overflow-hidden">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 rounded-xl">
            <SparklesIcon className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 text-sm leading-none">Zenith AI</h2>
            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">Multi-Model Core</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setSlangMode(!slangMode)}
            className={`p-2 rounded-lg transition-colors ${slangMode ? 'bg-orange-50 text-orange-600' : 'text-gray-400 hover:bg-gray-100'}`}
            title="Sheng/Local Mode"
          >
            <span className="text-xs font-bold">KE</span>
          </button>
          <button 
            onClick={clearChat}
            className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
            title="Clear conversation"
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      {/* Model Selector & Context Toggle */}
      <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-100 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Model Intelligence</label>
          <div className="flex bg-white border border-gray-200 rounded-lg p-0.5 shadow-sm">
            {Object.entries(AIModel).map(([key, value]) => (
              <button
                key={value}
                onClick={() => setActiveModel(value as AIModel)}
                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                  activeModel === value 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {key === 'GEMINI_FLASH' ? 'Flash' : key === 'GEMINI_PRO' ? 'Pro' : 'Think'}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={() => setContextEnabled(!contextEnabled)}
          className={`flex items-center justify-between p-2 rounded-xl border transition-all ${
            contextEnabled ? 'bg-indigo-50 border-indigo-100 text-indigo-700' : 'bg-white border-gray-200 text-gray-500'
          }`}
        >
          <div className="flex items-center gap-2">
            <GlobeIcon className="w-4 h-4" />
            <span className="text-xs font-semibold">Analyze Page Content</span>
          </div>
          <div className={`w-8 h-4 rounded-full relative transition-colors ${contextEnabled ? 'bg-indigo-600' : 'bg-gray-300'}`}>
             <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${contextEnabled ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
          </div>
        </button>
      </div>

      {/* Chat History */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <SparklesIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Zenith AI Orchestrator</h3>
              <p className="text-sm text-gray-500 max-w-xs mx-auto mt-2">
                Unified bridge between browser data and next-gen AI. Start by asking about the current page or a general query.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 w-full mt-4">
              <button 
                onClick={() => setInputValue("Summarize this page")}
                className="p-3 bg-white border border-gray-100 rounded-xl text-xs font-semibold text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all shadow-sm"
              >
                Summarize Page
              </button>
              <button 
                onClick={() => setInputValue("Explain the key concepts")}
                className="p-3 bg-white border border-gray-100 rounded-xl text-xs font-semibold text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all shadow-sm"
              >
                Key Concepts
              </button>
            </div>
          </div>
        ) : (
          messages.map(msg => (
            <ChatMessage key={msg.id} message={msg} />
          ))
        )}
        {isTyping && (
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-[10px] ml-10 animate-pulse">
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
            ZENITH IS ANALYZING...
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-100 bg-white">
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
            placeholder="Ask Zenith anything..."
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none min-h-[50px] max-h-[150px]"
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className={`absolute right-2 bottom-2 p-2 rounded-xl transition-all ${
              inputValue.trim() && !isTyping 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:scale-105 active:scale-95' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <SendIcon />
          </button>
        </div>
        <p className="text-[10px] text-center text-gray-400 mt-2 font-medium">
          Powered by Gemini 3 • Zenith Multi-Model Core
        </p>
      </div>
    </div>
  );
};

export default SidebarUI;
