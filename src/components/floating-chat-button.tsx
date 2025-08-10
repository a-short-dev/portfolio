"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaRobot, FaPaperPlane, FaUser, FaTimes, FaWhatsapp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  hasWhatsAppOption?: boolean;
  stats?: {
    model?: string;
    inputTokens?: number;
    outputTokens?: number;
    totalTokens?: number;
    responseTime?: number;
    charactersGenerated?: number;
    wordsGenerated?: number;
    temperature?: number;
    maxTokens?: number;
    requestTime?: string;
    completionTime?: string;
    clientIP?: string;
  };
  isStreaming?: boolean;
}

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "⚔️ Greetings, warrior! I'm Oluwaleke's AI assistant from the realm of Asgard. I'm here to tell you about his legendary skills and how he can forge solutions for your projects. What quest brings you here today?",
      isUser: false,
      timestamp: new Date(),
      hasWhatsAppOption: true
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage("");
    setIsLoading(true);

    // Create initial AI message for streaming
    const aiMessageId = (Date.now() + 1).toString();
    const initialAiMessage: Message = {
      id: aiMessageId,
      content: "",
      isUser: false,
      timestamp: new Date(),
      hasWhatsAppOption: true,
      isStreaming: true,
      stats: {}
    };

    setMessages(prev => [...prev, initialAiMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: currentInput }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                
                if (data.type === 'stats') {
                  // Update initial stats
                  setMessages(prev => prev.map(msg => 
                    msg.id === aiMessageId 
                      ? { ...msg, stats: { ...msg.stats, ...data.data } }
                      : msg
                  ));
                } else if (data.type === 'content') {
                  // Append content
                  setMessages(prev => prev.map(msg => 
                    msg.id === aiMessageId 
                      ? { ...msg, content: msg.content + data.data.content }
                      : msg
                  ));
                } else if (data.type === 'final_stats') {
                  // Update final stats and mark as complete
                  setMessages(prev => prev.map(msg => 
                    msg.id === aiMessageId 
                      ? { 
                          ...msg, 
                          stats: { ...msg.stats, ...data.data },
                          isStreaming: false
                        }
                      : msg
                  ));
                } else if (data.type === 'error') {
                  throw new Error(data.data.message);
                }
              } catch (parseError) {
                console.error('Error parsing SSE data:', parseError);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId 
          ? {
              ...msg,
              content: "⚠️ The ravens couldn't deliver your message to Asgard. Please try again or contact Oluwaleke directly through WhatsApp below.",
              isStreaming: false,
              hasWhatsAppOption: true
            }
          : msg
      ));
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleWhatsAppTransfer = () => {
    const phoneNumber = "+2348123456789"; // Replace with Oluwaleke's actual WhatsApp number
    const message = encodeURIComponent(
      "⚔️ Greetings Oluwaleke! I was chatting with your legendary AI assistant and would like to discuss an epic project quest with you. Let's forge something amazing together!"
    );
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const suggestedQuestions = [
    "What are his coding skills?",
    "Tell me about his React expertise",
    "Show me his projects",
    "Is he available for hire?",
    "What makes him special?"
  ];

  const handleSuggestedQuestion = (question: string) => {
    setInputMessage(question);
    inputRef.current?.focus();
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        className="fixed bottom-6 right-4 sm:right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="asgard-border w-16 h-16 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-500 hover:via-orange-500 hover:to-red-500 text-white rounded-full shadow-lg flex items-center justify-center relative overflow-hidden group"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-asgard-glow" />
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            {isOpen ? <FaTimes size={24} /> : <FaRobot size={24} />}
          </motion.div>
          
          {/* Notification dot */}
          {!isOpen && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse border-2 border-white" />
          )}
          
          {/* Runic decorations */}
          <span className="absolute top-1 left-1 text-yellow-300/60 text-xs animate-rune-glow">ᚱ</span>
          <span className="absolute bottom-1 right-1 text-yellow-300/60 text-xs animate-rune-glow">ᚨ</span>
        </motion.button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-96 max-w-md h-[500px] max-h-[80vh] bg-slate-900/95 backdrop-blur-md border border-amber-500/30 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 p-3 sm:p-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-red-500/20 animate-asgard-glow" />
              <div className="flex items-center gap-2 sm:gap-3 relative z-10">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center asgard-border">
                  <FaRobot className="text-white text-sm sm:text-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-marlish font-semibold flex items-center gap-1 sm:gap-2 text-sm sm:text-base truncate">
                    <span className="text-yellow-300/80 animate-rune-glow">ᚦ</span>
                    <span className="truncate">Oluwaleke&apos;s AI Assistant</span>
                    <span className="text-yellow-300/80 animate-rune-glow">ᚦ</span>
                  </h3>
                  <p className="text-amber-100 text-xs sm:text-sm truncate">⚡ Powered by Norse AI • Always online</p>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse" />
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="h-64 sm:h-80 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gradient-to-b from-slate-900/50 to-slate-800/50">
              {messages.map((message) => (
                <div key={message.id}>
                  <div
                    className={`flex gap-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!message.isUser && (
                      <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-red-600 rounded-full flex items-center justify-center flex-shrink-0 asgard-border">
                        <FaRobot className="text-white text-sm" />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[85%] sm:max-w-[80%] p-2 sm:p-3 rounded-2xl ${message.isUser
                          ? 'bg-gradient-to-r from-amber-600 to-red-600 text-white asgard-border'
                          : 'bg-slate-700/50 text-amber-100 border border-amber-500/30'
                        }`}
                    >
                      <p className="text-xs sm:text-sm leading-relaxed break-words">
                        {message.content}
                        {message.isStreaming && (
                          <span className="inline-block w-2 h-4 bg-amber-400 ml-1 animate-pulse" />
                        )}
                      </p>
                      
                      {/* Stats Display for AI messages */}
                      {!message.isUser && message.stats && Object.keys(message.stats).length > 0 && (
                        <div className="mt-2 p-2 bg-slate-800/50 rounded-lg border border-amber-500/20">
                          <div className="text-xs text-amber-300/80 font-mono space-y-1">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-amber-400 font-semibold">⚡ NORSE AI STATS</span>
                              {message.isStreaming && (
                                <span className="text-green-400 animate-pulse">● STREAMING</span>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                              {message.stats.model && (
                                <div><span className="text-amber-500">Model:</span> {message.stats.model.split('/')[1] || message.stats.model}</div>
                              )}
                              {message.stats.inputTokens && (
                                <div><span className="text-amber-500">Input:</span> {message.stats.inputTokens}t</div>
                              )}
                              {message.stats.outputTokens && (
                                <div><span className="text-amber-500">Output:</span> {message.stats.outputTokens}t</div>
                              )}
                              {message.stats.totalTokens && (
                                <div><span className="text-amber-500">Total:</span> {message.stats.totalTokens}t</div>
                              )}
                              {message.stats.responseTime && (
                                <div><span className="text-amber-500">Time:</span> {message.stats.responseTime}ms</div>
                              )}
                              {message.stats.temperature && (
                                <div><span className="text-amber-500">Temp:</span> {message.stats.temperature}</div>
                              )}
                              {message.stats.charactersGenerated && (
                                <div><span className="text-amber-500">Chars:</span> {message.stats.charactersGenerated}</div>
                              )}
                              {message.stats.wordsGenerated && (
                                <div><span className="text-amber-500">Words:</span> {message.stats.wordsGenerated}</div>
                              )}
                              {message.stats.clientIP && (
                                <div className="col-span-2"><span className="text-amber-500">Client:</span> {message.stats.clientIP}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <p className={`text-xs mt-1 sm:mt-2 opacity-70 ${
                        message.isUser ? 'text-amber-100' : 'text-amber-300'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    {message.isUser && (
                      <div className="w-8 h-8 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full flex items-center justify-center flex-shrink-0 border border-amber-500/30">
                        <FaUser className="text-amber-200 text-sm" />
                      </div>
                    )}
                  </div>
                  
                  {/* WhatsApp Transfer Option */}
                  {!message.isUser && message.hasWhatsAppOption && (
                    <div className="mt-2 ml-8 sm:ml-11">
                      <motion.button
                        onClick={handleWhatsAppTransfer}
                        className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 bg-green-600 hover:bg-green-500 text-white text-xs rounded-lg transition-all duration-200 asgard-border"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaWhatsapp className="text-xs sm:text-sm" />
                        <span className="hidden sm:inline">Continue on WhatsApp</span>
                        <span className="sm:hidden">WhatsApp</span>
                        <span className="text-green-200/80 animate-rune-glow">ᚹ</span>
                      </motion.button>
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-red-600 rounded-full flex items-center justify-center flex-shrink-0 asgard-border">
                    <FaRobot className="text-white text-sm" />
                  </div>
                  <div className="bg-slate-700/50 border border-amber-500/30 p-3 rounded-2xl">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            {messages.length === 1 && (
              <div className="px-4 sm:px-6 pb-3">
                <p className="text-xs sm:text-sm text-amber-300 mb-3 flex items-center gap-1">
                  <span className="animate-rune-glow">⚡</span>
                  Try asking:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {suggestedQuestions.slice(0, 4).map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestedQuestion(question)}
                      className="text-xs px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 border border-amber-500/30 rounded-lg text-amber-200 hover:text-amber-100 transition-all duration-200 text-left break-words leading-relaxed min-h-[2.5rem] flex items-center"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form */}
            <div className="border-t border-amber-500/30 p-2 sm:p-3 bg-slate-800/50">
              <form onSubmit={handleSubmit} className="flex gap-1 sm:gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask about Oluwaleke's skills..."
                  className="flex-1 px-2 sm:px-3 py-2 bg-slate-700/50 border border-amber-500/30 rounded-xl text-amber-100 placeholder-amber-300/50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-xs sm:text-sm"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className="px-3 sm:px-4 py-2 bg-gradient-to-r from-amber-600 to-red-600 text-white font-semibold rounded-xl hover:from-amber-700 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 asgard-border flex items-center gap-1 flex-shrink-0"
                >
                  <FaPaperPlane className="text-xs" />
                  <span className="text-yellow-300/80 text-xs animate-rune-glow hidden sm:inline">ᚠ</span>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}