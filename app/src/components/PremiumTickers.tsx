import React from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Cpu, 
  Flame, 
  Lock, 
  Sparkles, 
  Clock, 
  Key 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const PremiumTickers: React.FC = () => {
  const { themeConfig } = useTheme();

  // Ticker 1: Live Security & Architectural Features
  const features = [
    { icon: ShieldCheck, text: 'KERNEL RING-0 DRIVER' },
    { icon: Zap, text: '0.0s AUTOMATED KEY DISPATCH' },
    { icon: Lock, text: 'VANGUARD 14.12 TESTED SAFE' },
    { icon: Cpu, text: '0% FPS DROP OVERLAY' },
    { icon: Flame, text: 'HWID DESERIALIZER INCLUDED' },
    { icon: Sparkles, text: 'STREAMPROOF DIRECTX HOOK' },
    { icon: Clock, text: '24/7 DEDICATED NOC SUPPORT' },
    { icon: Key, text: 'POLYMORPHIC MUTATED BINARY' },
  ];

  // Ticker 2: Live Activity Feed / Simulated Purchases & Verifications
  const liveDispatches = [
    { user: 'Viper***', product: 'Valorant Pro', time: '12s ago', tag: 'License Activated', region: 'GB' },
    { user: 'Klaus_99', product: 'Rust Elite', time: '34s ago', tag: 'HWID Reset Safe', region: 'DE' },
    { user: 'ShadowX', product: 'Arc Raiders', time: '1m ago', tag: '0.0s Delivered', region: 'US' },
    { user: 'Jean_Luc', product: 'THE ISLE VIP', time: '2m ago', tag: 'Undetected', region: 'FR' },
    { user: 'ApexPredator', product: 'HWID Spoofer', time: '3m ago', tag: 'Clean Serialization', region: 'CA' },
    { user: 'Emre_T', product: 'Fortnite Battle Royale', time: '4m ago', tag: 'Key Generated', region: 'TR' },
    { user: 'NordicGhost', product: 'DayZ Pro Suite', time: '6m ago', tag: 'DirectX Streamproof', region: 'SE' },
    { user: 'Alex_Zero', product: 'Call of Duty Warzone', time: '8m ago', tag: 'Polymorphic OK', region: 'AU' },
  ];

  return (
    <div className="space-y-4 my-8 overflow-hidden">
      
      {/* Ticker 1: Fast High-Tech Architectural Ribbon (Left Scrolling) */}
      <div className="relative border-y border-white/10 bg-[#060a08]/90 py-3.5 backdrop-blur-xl shadow-lg mask-marquee">
        <div className="animate-marquee-left flex items-center gap-8">
          {/* Double items for seamless infinite loop */}
          {[...features, ...features].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className="flex items-center gap-3 whitespace-nowrap cursor-default group"
              >
                <div 
                  className="w-7 h-7 rounded-lg border flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                  style={{ 
                    backgroundColor: themeConfig.badgeBg, 
                    borderColor: themeConfig.badgeBorder, 
                    color: themeConfig.accent 
                  }}
                >
                  <Icon className="h-4 w-4 stroke-[2.5]" />
                </div>
                
                <span className="font-headline font-bold text-xs tracking-wider uppercase text-white group-hover:text-zinc-200 transition-colors">
                  {item.text}
                </span>

                <span className="w-1.5 h-1.5 rounded-full bg-white/20 mx-2" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Ticker 2: Live Activity & Dispatch Telemetry Tape (Right Scrolling) */}
      <div className="relative border-y border-white/5 bg-[#030604]/80 py-2.5 backdrop-blur-md mask-marquee">
        <div className="animate-marquee-right flex items-center gap-6">
          {/* Double items for seamless infinite loop */}
          {[...liveDispatches, ...liveDispatches].map((disp, idx) => (
            <div 
              key={idx}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs font-mono whitespace-nowrap shadow-sm hover:border-white/20 transition-all cursor-default"
            >
              {/* Country Badge */}
              <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-zinc-400 font-bold">{disp.region}</span>

              {/* User & Product */}
              <span className="text-zinc-400 font-medium">{disp.user}</span>
              <span className="text-zinc-600">bought</span>
              <span className="text-white font-bold font-display tracking-tight">{disp.product}</span>

              {/* Status Badge */}
              <span 
                className="px-2 py-0.5 rounded-md text-[10px] font-semibold border flex items-center gap-1"
                style={{ 
                  backgroundColor: themeConfig.badgeBg, 
                  borderColor: themeConfig.badgeBorder, 
                  color: themeConfig.accent 
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: themeConfig.accent }} />
                <span>{disp.tag}</span>
              </span>

              {/* Timestamp */}
              <span className="text-[10px] text-zinc-500">{disp.time}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
