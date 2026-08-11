'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const StatusSection: React.FC = () => {
  const { themeConfig } = useTheme();

  const systems = [
    { name: 'Riot Vanguard (Valorant)', status: 'Operational / Undetected', uptime: '99.98%' },
    { name: 'Easy Anti-Cheat (Rust, Arc Raiders)', status: 'Operational / Undetected', uptime: '100%' },
    { name: 'BattleEye (DayZ, Tarkov)', status: 'Operational / Undetected', uptime: '99.95%' },
    { name: 'Ricochet Anti-Cheat (Warzone)', status: 'Operational / Undetected', uptime: '99.90%' },
    { name: 'ArrowX Ring0 Driver Cluster', status: 'Operational / Undetected', uptime: '100%' },
    { name: 'Instant Key Fulfillment API', status: 'Operational / 0s Delay', uptime: '100%' },
  ];

  return (
    <section id="status-section" className="py-16 relative border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold tracking-wider uppercase mb-1" style={{ color: themeConfig.accent }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: themeConfig.accent }} />
              <span>LIVE SYSTEM TELEMETRY</span>
            </div>
            <h2 className="text-3xl font-bold font-display tracking-tight text-white">
              Anti-Cheat & Service Status
            </h2>
            <p className="text-zinc-400 text-sm mt-1">
              Real-time monitoring across all supported game security systems.
            </p>
          </div>

          <div 
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-mono"
            style={{ backgroundColor: themeConfig.badgeBg, borderColor: themeConfig.badgeBorder, color: themeConfig.accent }}
          >
            <CheckCircle2 className="h-4 w-4" style={{ color: themeConfig.accent }} />
            <span>ALL 12 ENGINES OPERATIONAL</span>
          </div>
        </div>

        {/* Status Table / Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {systems.map((sys, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#090e0b] border hover:border-white/30 transition-all flex flex-col justify-between space-y-3"
              style={{ borderColor: themeConfig.surfaceBorder }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white font-display">{sys.name}</span>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: themeConfig.accent }} />
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
                <span className="font-mono font-medium" style={{ color: themeConfig.accent }}>{sys.status}</span>
                <span className="text-zinc-500 font-mono">{sys.uptime}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
