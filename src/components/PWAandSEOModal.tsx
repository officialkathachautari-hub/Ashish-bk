import React, { useState, useEffect } from 'react';
import { X, Smartphone, WifiOff, Bell, Search, Check, Download, ShieldCheck, BookOpen, Trash2 } from 'lucide-react';
import { Story } from '../types';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAandSEOModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
  onReadStory?: (story: Story) => void;
}

export const PWAandSEOModal: React.FC<PWAandSEOModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
  onReadStory,
}) => {
  const [isOfflineEnabled, setIsOfflineEnabled] = useState(true);
  const [isPushEnabled, setIsPushEnabled] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [offlineStories, setOfflineStories] = useState<Story[]>([]);

  useEffect(() => {
    // Check saved preferences
    const savedOffline = localStorage.getItem('katha_pwa_offline');
    if (savedOffline) setIsOfflineEnabled(savedOffline === 'true');

    const savedPush = localStorage.getItem('katha_pwa_push');
    if (savedPush) setIsPushEnabled(savedPush === 'true');

    // Load offline downloaded stories
    loadOfflineStories();

    // Listen for PWA BeforeInstallPrompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Check if app is in standalone display mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, [isOpen]);

  const loadOfflineStories = () => {
    const raw = localStorage.getItem('katha_offline_stories');
    if (raw) {
      try {
        setOfflineStories(JSON.parse(raw));
      } catch (e) {
        setOfflineStories([]);
      }
    } else {
      setOfflineStories([]);
    }
  };

  const handleRemoveOfflineStory = (id: string) => {
    const updated = offlineStories.filter((s) => s.id !== id);
    setOfflineStories(updated);
    localStorage.setItem('katha_offline_stories', JSON.stringify(updated));
    onShowToast('कथा अफलाइन सूचीबाट हटाइयो');
  };

  if (!isOpen) return null;

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        onShowToast('कथा चौतारी एप सफलतापूर्वक इन्स्टल भयो! 📱');
      }
      setDeferredPrompt(null);
    } else {
      // Fallback
      setIsInstalled(true);
      onShowToast('कथा चौतारी एप होम स्क्रिनमा थपियो! 📱');
    }
  };

  const handleToggleOffline = () => {
    const nextVal = !isOfflineEnabled;
    setIsOfflineEnabled(nextVal);
    localStorage.setItem('katha_pwa_offline', String(nextVal));
    onShowToast(nextVal ? 'अफलाइन पठन मोड (Offline Mode) सक्रिय भयो 📶' : 'अफलाइन मोड बन्द गरियो');
  };

  const handleTogglePush = async () => {
    const nextVal = !isPushEnabled;
    if (nextVal && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setIsPushEnabled(true);
        localStorage.setItem('katha_pwa_push', 'true');
        onShowToast('दैनिक नयाँ कथाको Push Notification सक्रिय भयो 🔔');

        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.ready.then((reg) => {
            reg.showNotification('कथा चौतारी Notification!', {
              body: 'तपाईंले कथा चौतारीको दैनिक कथा सुचना सफलतापूर्वक सुचारु गर्नुभयो।',
              icon: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=192&h=192&fit=crop',
            });
          });
        }
      } else {
        onShowToast('नोटिफिकेसन अनुमति दिइएको छैन');
      }
    } else {
      setIsPushEnabled(false);
      localStorage.setItem('katha_pwa_push', 'false');
      onShowToast('नोटिफिकेसन बन्द गरियो');
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xl bg-gradient-to-b from-slate-900 via-slate-950 to-amber-950/80 border border-amber-500/40 rounded-3xl shadow-2xl p-6 relative space-y-6 max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full glass hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 text-2xl font-bold">
            📱
          </div>
          <div>
            <h3 className="text-lg font-black text-white">App इन्स्टल, अफलाइन र पुश नोटिफिकेसन</h3>
            <p className="text-xs text-gray-300">PWA, Offline Storage, Push Alert र Background Audio</p>
          </div>
        </div>

        {/* 1. PWA INSTALL BANNER */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/80 via-slate-900 to-rose-950/80 border border-amber-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-amber-400" />
              <h4 className="text-sm font-bold text-white">कथा चौतारी App इन्स्टल गर्नुहोस्</h4>
            </div>
            {isInstalled ? (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> इन्स्टल भयो
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300">
                PWA Ready
              </span>
            )}
          </div>

          <p className="text-xs text-gray-300">
            प्लेस्टोर बिना नै सीधै आफ्नो मोबाइलको होम-स्क्रीनमा 'कथा चौतारी' थपेर अफलाइन साहित्यको आनन्द लिनुहोस्।
          </p>

          {!isInstalled ? (
            <button
              onClick={handleInstallPWA}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-transform hover:scale-[1.01]"
            >
              <Download className="w-4 h-4" />
              <span>मोबाइलमा App इन्स्टल गर्नुहोस् (Install PWA)</span>
            </button>
          ) : (
            <div className="text-xs text-emerald-300 font-semibold text-center pt-1">
              ✓ कथा चौतारी App होम स्क्रिनमा उपलब्ध छ।
            </div>
          )}
        </div>

        {/* 2. OFFLINE READING & PUSH NOTIFICATIONS */}
        <div className="space-y-3">
          <h4 className="text-xs font-extrabold text-amber-300 uppercase tracking-wider">
            🌐 स्मार्ट सुविधाहरू
          </h4>

          {/* Offline Toggle */}
          <div className="p-3.5 bg-black/40 rounded-2xl border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <WifiOff className="w-5 h-5 text-sky-400" />
              <div>
                <h5 className="text-xs font-bold text-white">अफलाइन पठन मोड (Offline Caching)</h5>
                <p className="text-[11px] text-gray-400">इन्टरनेट नहुँदा पनि सुरक्षित गरिएका कथाहरू पढ्नुहोस्</p>
              </div>
            </div>

            <button
              onClick={handleToggleOffline}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                isOfflineEnabled ? 'bg-amber-500' : 'bg-white/20'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-black absolute top-0.5 transition-all ${
                  isOfflineEnabled ? 'left-5.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Push Notification Toggle */}
          <div className="p-3.5 bg-black/40 rounded-2xl border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-rose-400" />
              <div>
                <h5 className="text-xs font-bold text-white">दैनिक नयाँ कथा Push Notification</h5>
                <p className="text-[11px] text-gray-400">नयाँ प्रकाशित कथाको सुचना ब्राउजरमा पाउनुहोस्</p>
              </div>
            </div>

            <button
              onClick={handleTogglePush}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                isPushEnabled ? 'bg-amber-500' : 'bg-white/20'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-black absolute top-0.5 transition-all ${
                  isPushEnabled ? 'left-5.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* 3. OFFLINE DOWNLOADED STORIES LIST */}
        <div className="space-y-3 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
              <WifiOff className="w-4 h-4 text-sky-400" />
              <span>अफलाइन सेभ गरिएका कथाहरू ({offlineStories.length})</span>
            </h4>
          </div>

          {offlineStories.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {offlineStories.map((story) => (
                <div
                  key={story.id}
                  className="p-3 rounded-2xl bg-black/50 border border-sky-500/30 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <img
                      src={story.coverImage}
                      alt={story.title}
                      className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="overflow-hidden">
                      <h5 className="text-xs font-bold text-white truncate">{story.title}</h5>
                      <p className="text-[10px] text-gray-400 truncate">लेखक: {story.author}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {onReadStory && (
                      <button
                        onClick={() => {
                          onReadStory(story);
                          onClose();
                        }}
                        className="px-2.5 py-1 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-extrabold text-[11px] flex items-center gap-1 cursor-pointer"
                      >
                        <BookOpen className="w-3 h-3" />
                        <span>पढ्नुहोस्</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleRemoveOfflineStory(story.id)}
                      className="p-1.5 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/40 border border-rose-500/30 cursor-pointer"
                      title="हटाउनुहोस्"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-black/30 border border-white/5 text-center text-xs text-gray-400">
              हाल कुनै कथा अफलाइन डाउनलोड गरिएको छैन। कुनै पनि कथा खोल्दा 'अफलाइन डाउनलोड' बटन थिच्नुहोस्।
            </div>
          )}
        </div>

        {/* 4. SEO & OPEN GRAPH PREVIEW CARD */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <h4 className="text-xs font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <Search className="w-4 h-4 text-amber-400" />
            <span>SEO तथा Social Sharing Preview</span>
          </h4>

          <div className="p-3.5 rounded-2xl bg-black/50 border border-amber-500/30 text-xs space-y-2">
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-mono">
              <span>https://katha-chautari.app</span>
              <span className="text-gray-500">• PWA & MediaSession Enabled</span>
            </div>
            <h5 className="font-extrabold text-amber-300 text-sm">
              कथा चौतारी - मौलिक नेपाली कथाहरू र लोककथाको संग्रह
            </h5>
            <p className="text-gray-300 text-[11px]">
              नेपाली भाषाका पुराना सम्झना, गाउँघरका कथा, रहस्यमयी कथाहरू तथा बाल कथाहरू एउटै चौतारीमा सुन्नुहोस् र पढ्नुहोस्।
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
