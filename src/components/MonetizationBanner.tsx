import React from 'react';
import { Crown, Sparkles, ExternalLink } from 'lucide-react';

interface MonetizationBannerProps {
  isPremium?: boolean;
  onUpgradeToPremium?: () => void;
}

export const MonetizationBanner: React.FC<MonetizationBannerProps> = ({
  isPremium = false,
  onUpgradeToPremium,
}) => {
  if (isPremium) return null; // Ad-free for premium users!

  return (
    <div className="w-full my-6 max-w-6xl mx-auto px-5">
      <div className="w-full p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/60 border border-amber-500/20 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden">
        
        {/* Subtle Ad Tag Badge */}
        <span className="absolute top-2 right-2 text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded border border-white/10">
          प्रायोजित स्थान / AdSense
        </span>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xl font-bold flex-shrink-0">
            📢
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-amber-300 flex items-center gap-2">
              <span>नेपाली साहित्य र पुस्तक विशेष छुट</span>
              <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/30">
                Sponsored
              </span>
            </h4>
            <p className="text-xs text-gray-300">
              नवीनतम मौलिक नेपाली उपन्यास र कथा संग्रहहरू घरैमा मगाउनुहोस्। २०% सम्म छुट उपलब्ध!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <a
            href="https://nepal.gov.np"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-all border border-white/10"
          >
            <span>किन्नुहोस्</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {onUpgradeToPremium && (
            <button
              onClick={onUpgradeToPremium}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-black font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Crown className="w-3.5 h-3.5 fill-current" />
              <span>विज्ञापन हटाउनुहोस्</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
