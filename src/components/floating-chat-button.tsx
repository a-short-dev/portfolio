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
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        isUser: false,
        timestamp: new Date(),
        hasWhatsAppOption: true
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "⚠️ The ravens couldn't deliver your message to Asgard. Please try again or contact Oluwaleke directly through WhatsApp below.",
        isUser: false,
        timestamp: new Date(),
        hasWhatsAppOption: true
      };
      setMessages(prev => [...prev, errorMessage]);
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
    "What are Oluwaleke's legendary coding skills?",
    "Tell me about his React and Next.js mastery",
    "What epic projects has he forged?",
    "Is he available for new quests?",
    "What makes him a legendary developer?"
  ];

  const handleSuggestedQuestion = (question: string) => {
    setInputMessage(question);
    inputRef.current?.focus();
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
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
            className="fixed bottom-24 right-6 w-96 h-[500px] bg-slate-900/95 backdrop-blur-md border border-amber-500/30 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 p-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-red-500/20 animate-asgard-glow" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center asgard-border">
                  <FaRobot className="text-white text-lg" />
                </div>
                <div>
                  <h3 className="text-white font-marlish font-semibold flex items-center gap-2">
                    <span className="text-yellow-300/80 animate-rune-glow">ᚦ</span>
                    Oluwaleke's AI Assistant
                    <span className="text-yellow-300/80 animate-rune-glow">ᚦ</span>
                  </h3>
                  <p className="text-amber-100 text-sm">⚡ Powered by Norse AI • Always online</p>
                </div>
                <div className="ml-auto">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-900/50 to-slate-800/50">
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
                      className={`max-w-[80%] p-3 rounded-2xl ${message.isUser
                          ? 'bg-gradient-to-r from-amber-600 to-red-600 text-white asgard-border'
                          : 'bg-slate-700/50 text-amber-100 border border-amber-500/30'
                        }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <p className={`text-xs mt-2 opacity-70 ${
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
                    <div className="mt-2 ml-11">
                      <motion.button
                        onClick={handleWhatsAppTransfer}
                        className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-500 text-white text-xs rounded-lg transition-all duration-200 asgard-border"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaWhatsapp className="text-sm" />
                        Continue on WhatsApp
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
              <div className="px-4 pb-2">
                <p className="text-sm text-amber-300 mb-2 flex items-center gap-1">
                  <span className="animate-rune-glow">⚡</span>
                  Try asking:
                </p>
                <div className="flex flex-wrap gap-1">
                  {suggestedQuestions.slice(0, 3).map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestedQuestion(question)}
                      className="text-xs px-2 py-1 bg-slate-700/50 hover:bg-slate-600/50 border border-amber-500/30 rounded-lg text-amber-200 hover:text-amber-100 transition-all duration-200"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form */}
            <div className="border-t border-amber-500/30 p-3 bg-slate-800/50">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask about Oluwaleke's legendary skills..."
                  className="flex-1 px-3 py-2 bg-slate-700/50 border border-amber-500/30 rounded-xl text-amber-100 placeholder-amber-300/50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className="px-4 py-2 bg-gradient-to-r from-amber-600 to-red-600 text-white font-semibold rounded-xl hover:from-amber-700 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 asgard-border flex items-center gap-1"
                >
                  <FaPaperPlane className="text-xs" />
                  <span className="text-yellow-300/80 text-xs animate-rune-glow">ᚠ</span>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}