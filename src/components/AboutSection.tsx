import React from 'react';
import { BookOpen, Sparkles, Heart } from 'lucide-react';

interface AboutSectionProps {
  onOpenDonate?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenDonate }) => {

  return (
    <section id="about" className="px-5 py-24 relative overflow-hidden">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* MAIN ABOUT CARD */}
        <div className="glass rounded-3xl p-8 md:p-12 border border-white/10 relative shadow-2xl text-center space-y-6">
          <div className="inline-flex p-3 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-3xl">
            🌿
          </div>

          <h2 className="text-3xl md:text-5xl font-black hero-title">
            हाम्रो बारेमा | कथा चौतारी
          </h2>

          <p className="text-gray-300 muted leading-relaxed max-w-3xl mx-auto text-sm md:text-base">
            "कथा चौतारी" नेपाली लोककथा, पौराणिक गाथा, जीवनका यथार्थ भोगाइहरू र मौलिक नेपाली साहित्यलाई आधुनिक डिजिटल माध्यममार्फत नयाँ पुस्तासम्म पुर्याउने एउटा पवित्र चौतारी हो। हामी शब्द, दृश्य र ३D कलामार्फत नेपाली कथा संस्कृतिलाई जीवित राख्न प्रतिबद्ध छौँ।
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 text-left">
            <div className="p-5 rounded-2xl bg-black/20 border border-white/5 space-y-2">
              <div className="text-amber-400 font-bold flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span>मौलिकता</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                नेपाली गाउँघर, हिमाल, पहाड र तराईका मौलिक कथा तथा संस्कृतिको संरक्षण।
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-black/20 border border-white/5 space-y-2">
              <div className="text-rose-400 font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span>आधुनिक प्रविधि</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                ३D अन्तरक्रियात्मक पुस्तक, अडियो नरेसन र AI कथाकार प्रविधिको सम्मिश्रण।
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-black/20 border border-white/5 space-y-2">
              <div className="text-emerald-400 font-bold flex items-center gap-2">
                <Heart className="w-5 h-5" />
                <span>संस्कार र शिक्षा</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                बालबालिका र युवाहरूका लागि नैतिक शिक्षा र सकारात्मक जीवन दर्शनको प्रवर्द्धन।
              </p>
            </div>
          </div>
        </div>

        {/* DONATION BANNER */}
        <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-rose-950/80 via-slate-900 to-amber-950/80 border border-rose-500/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex items-center gap-4 text-left">
            <div className="w-14 h-14 rounded-2xl bg-rose-600/30 text-rose-300 border border-rose-500/40 flex items-center justify-center text-3xl shadow-lg flex-shrink-0">
              💖
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2">
                <span className="text-xs font-black text-rose-300 uppercase tracking-wider">Donation Support</span>
                <span className="text-[10px] bg-amber-400 text-black px-2 py-0.5 rounded-full font-bold">नेपाली साहित्य प्रवर्द्धन</span>
              </div>
              <h3 className="text-lg md:text-xl font-black text-white">
                कथा चौतारीलाई सहयोग गर्नुहोस्
              </h3>
              <p className="text-xs text-gray-300">
                नेपाली भाषा र मौलिक साहित्यको जगेर्नाका लागि eSewa, FonePay वा बैंकमार्फत सहयोग पठाउन सक्नुहुन्छ।
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              onClick={onOpenDonate}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-black font-black text-xs shadow-xl cursor-pointer hover:scale-105 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Heart className="w-4 h-4 fill-current text-rose-950" />
              <span>सहयोग पठाउनुहोस् (Donate)</span>
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="border-t border-white/10 pt-8 text-center text-xs text-gray-400 space-y-2">
          <p className="font-medium text-gray-300">© २०२६ कथा चौतारी। सर्वाधिकार सुरक्षित।</p>
          <p className="text-[11px] opacity-70">
            नेपाली भाषा, कला र साहित्यको डिजिटल प्रवर्द्धन।
          </p>
        </footer>

      </div>
    </section>
  );
};
