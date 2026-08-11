import React from 'react';
import { ArrowRight } from 'lucide-react';
import { announcementsData } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

export const BlogSection: React.FC = () => {
  const { themeConfig } = useTheme();

  return (
    <section id="blog-section" className="py-16 relative border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-xs font-mono font-semibold tracking-wider uppercase mb-1" style={{ color: themeConfig.accent }}>
              DEVELOPMENT LOGS
            </div>
            <h2 className="text-3xl font-bold font-display tracking-tight text-white">
              Latest Updates & Patch Notes
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {announcementsData.map((post) => (
            <div
              key={post.id}
              className="p-6 rounded-2xl bg-[#090f0c] border hover:border-white/30 transition-all flex flex-col justify-between space-y-4 group cursor-pointer"
              style={{ borderColor: themeConfig.surfaceBorder }}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-xs text-zinc-500 font-mono">
                  <span 
                    className="px-2.5 py-0.5 rounded-full border font-semibold"
                    style={{ backgroundColor: themeConfig.badgeBg, borderColor: themeConfig.badgeBorder, color: themeConfig.accent }}
                  >
                    {post.category}
                  </span>
                  <span>{post.date}</span>
                  <span>·</span>
                  <span>{post.readTime}</span>
                </div>

                <h3 className="text-xl font-bold font-display text-white group-hover:text-zinc-200 transition-colors">
                  {post.title}
                </h3>

                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  {post.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold" style={{ color: themeConfig.accent }}>
                <span>Read technical report</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
