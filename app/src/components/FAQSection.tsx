'use client';

import React, { useState } from 'react';
import { ChevronDown, Sparkles, MessageSquare } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const FAQSection: React.FC = () => {
  const { themeConfig } = useTheme();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does ArrowX ensure undetected Ring-0 kernel execution?',
      a: 'Our hypervisor injects at the UEFI boot level before any game anti-cheat (such as Vanguard, Easy Anti-Cheat, or BattlEye) initializes. Each license key automatically compiles a uniquely mutated, encrypted polymorphic binary, guaranteeing zero signature pattern matching.',
    },
    {
      q: 'How fast is key generation and loader fulfillment?',
      a: 'Key delivery is 100% automated via our high-speed API cluster. The moment your checkout completes, your unique license string and loader download link are generated on screen and in your dashboard in 0.0 seconds.',
    },
    {
      q: 'Is hardware ID (HWID) spoofing included?',
      a: 'Yes. All packages feature our dynamic Ring-0 hardware deserializer that virtualizes Disk UUID, NIC MAC address, SMBIOS serials, and GPU hardware hashes to keep your physical machine permanently protected.',
    },
    {
      q: 'What operating systems and CPU hardware are supported?',
      a: 'All our products fully support Windows 10 (20H2 to 22H2) and Windows 11 (22H2 to 24H2) across all modern Intel Core and AMD Ryzen CPU architectures with zero frame drop.',
    },
    {
      q: 'What happens when a game pushes a new update or patch?',
      a: 'Our continuous integration cluster automatically detects client patches and pauses vulnerable hooks within seconds. Offsets are updated and pushed OTA to your loader with zero manual reinstall required.',
    }
  ];

  return (
    <section className="py-14 sm:py-20 relative overflow-hidden">
      
      {/* Ambient Theme Flare */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[160px] pointer-events-none opacity-15"
        style={{ backgroundColor: themeConfig.accent }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono">
            <Sparkles className="h-3.5 w-3.5" style={{ color: themeConfig.accent }} />
            <span className="text-zinc-300">FREQUENTLY ASKED QUESTIONS</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold font-headline uppercase tracking-tight text-white">
            SECURITY & ARSENAL <span style={{ color: themeConfig.accent }}>FAQ.</span>
          </h2>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto font-sans">
            Everything you need to know about our kernel architecture, instant key generation, and anti-cheat protection.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden shadow-lg ${
                  isOpen
                    ? 'bg-[#0a0f0d] shadow-2xl scale-[1.01]'
                    : 'bg-[#080d0a]/80 border-white/10 hover:border-white/20 hover:bg-[#0c120f]'
                }`}
                style={{
                  borderColor: isOpen ? themeConfig.accent : undefined,
                  boxShadow: isOpen ? `0 10px 30px ${themeConfig.badgeBg}` : undefined,
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3.5 pr-4">
                    <span 
                      className="font-mono text-xs font-bold px-2 py-0.5 rounded-md border"
                      style={{ 
                        backgroundColor: isOpen ? themeConfig.badgeBg : 'rgba(255,255,255,0.03)',
                        borderColor: isOpen ? themeConfig.badgeBorder : 'rgba(255,255,255,0.08)',
                        color: isOpen ? themeConfig.accent : '#71717a'
                      }}
                    >
                      0{idx + 1}
                    </span>
                    <span className="text-sm sm:text-base font-bold font-display text-white">
                      {faq.q}
                    </span>
                  </div>

                  <div 
                    className={`w-7 h-7 rounded-full flex items-center justify-center border transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    style={{
                      backgroundColor: isOpen ? themeConfig.badgeBg : 'rgba(255,255,255,0.05)',
                      borderColor: isOpen ? themeConfig.badgeBorder : 'rgba(255,255,255,0.1)',
                      color: isOpen ? themeConfig.accent : '#a1a1aa'
                    }}
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-white/5 font-sans animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom 24/7 Discord Support CTA Strip */}
        <div 
          className="p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left bg-gradient-to-r from-[#0a0f0d] via-[#070b09] to-[#040705]"
          style={{ borderColor: themeConfig.surfaceBorder }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: themeConfig.badgeBg, borderColor: themeConfig.badgeBorder, color: themeConfig.accent }}
            >
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-bold font-display text-white">Have a specific question?</div>
              <div className="text-xs text-zinc-400 font-mono">Our engineering team is active 24/7 on Discord</div>
            </div>
          </div>

          <a
            href="https://discord.gg/sMHzvy2QYT"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl font-bold font-display text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg hover:scale-105"
            style={{
              backgroundColor: themeConfig.buttonBg,
              color: themeConfig.buttonText,
            }}
          >
            Join Discord Community
          </a>
        </div>

      </div>
    </section>
  );
};
