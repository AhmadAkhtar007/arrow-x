'use client';

import React, { useState } from 'react';
import { Ticket, X, Send, Bot } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const SupportFAB: React.FC = () => {
  const { themeConfig } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am your ArrowX 24/7 assistant. How can I help you with our software or live status today?' }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = inputText;
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setInputText('');

    setTimeout(() => {
      let botReply = 'I have routed your request to our engineering team on Discord (https://discord.gg/sMHzvy2QYT). Average response time is under 2 minutes.';
      if (userMsg.toLowerCase().includes('hwid') || userMsg.toLowerCase().includes('reset')) {
        botReply = 'For instant HWID resets or support, please open a direct ticket in our Discord: https://discord.gg/sMHzvy2QYT';
      } else if (userMsg.toLowerCase().includes('key') || userMsg.toLowerCase().includes('order')) {
        botReply = 'All license keys are delivered instantly with 0s delay. If you need setup assistance, join us at: https://discord.gg/sMHzvy2QYT';
      }
      setMessages((prev) => [...prev, { sender: 'bot', text: botReply }]);
    }, 800);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-4 sm:right-6 bottom-20 md:bottom-8 z-40 flex h-[52px] w-[52px] items-center justify-center rounded-2xl border shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        style={{
          backgroundColor: themeConfig.buttonBg,
          borderColor: themeConfig.badgeBorder,
          boxShadow: `0 0 30px ${themeConfig.glow}`,
        }}
        aria-label="24/7 Support Tickets"
      >
        <div className="flex items-center justify-center" style={{ color: themeConfig.buttonText }}>
          <Ticket className="h-6 w-6 rotate-12 stroke-[2.5]" />
        </div>
        <span 
          className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-[#060907] animate-ping"
          style={{ backgroundColor: themeConfig.accent }}
        />
      </button>

      {/* Support Drawer / Chat Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:p-6 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="w-full sm:max-w-md h-[550px] bg-[#090f0c] border rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            style={{ borderColor: themeConfig.surfaceBorder }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 bg-[#0d1612] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="w-9 h-9 rounded-xl border flex items-center justify-center"
                  style={{ backgroundColor: themeConfig.badgeBg, borderColor: themeConfig.badgeBorder, color: themeConfig.accent }}
                >
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>ArrowX Support Bot</span>
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: themeConfig.accent }} />
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono">24/7 Fast Help Desk</div>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-black/40 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'font-medium rounded-tr-none'
                        : 'bg-black/50 border border-white/10 text-zinc-300 rounded-tl-none'
                    }`}
                    style={
                      msg.sender === 'user'
                        ? { backgroundColor: themeConfig.buttonBg, color: themeConfig.buttonText }
                        : undefined
                    }
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 bg-[#0d1612] border-t border-white/10 flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about your license or HWID..."
                className="flex-1 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
                style={{ borderColor: themeConfig.surfaceBorder }}
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-xl font-bold text-xs flex items-center justify-center cursor-pointer transition-colors"
                style={{ backgroundColor: themeConfig.buttonBg, color: themeConfig.buttonText }}
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>

          </div>
        </div>
      )}
    </>
  );
};
