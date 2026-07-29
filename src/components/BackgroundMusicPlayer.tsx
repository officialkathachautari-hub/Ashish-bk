import React, { useState, useEffect } from 'react';
import { Music, Volume2, VolumeX, Play, Pause, Sparkles, SlidersHorizontal, Disc } from 'lucide-react';
import { softMusicEngine, MUSIC_PRESETS, MusicPreset } from '../utils/enhancedAudioEngine';

interface BackgroundMusicPlayerProps {
  autoPlay?: boolean;
}

export const BackgroundMusicPlayer: React.FC<BackgroundMusicPlayerProps> = ({
  autoPlay = false,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.25);
  const [activePreset, setActivePreset] = useState<MusicPreset>('flute');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showPresets, setShowPresets] = useState<boolean>(false);

  useEffect(() => {
    if (autoPlay) {
      handlePlay();
    }
    return () => {
      softMusicEngine.stop();
    };
  }, []);

  const handlePlay = () => {
    softMusicEngine.start(activePreset, isMuted ? 0.001 : volume);
    setIsPlaying(true);
  };

  const handlePause = () => {
    softMusicEngine.stop();
    setIsPlaying(false);
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  const handlePresetChange = (presetId: MusicPreset) => {
    setActivePreset(presetId);
    if (isPlaying) {
      softMusicEngine.changePreset(presetId);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (isMuted) setIsMuted(false);
    softMusicEngine.setVolume(newVol);
  };

  const handleToggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    softMusicEngine.setVolume(nextMute ? 0.001 : volume);
  };

  const currentPresetInfo = MUSIC_PRESETS.find((p) => p.id === activePreset) || MUSIC_PRESETS[0];

  return (
    <div className="w-full rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/70 p-4 border border-amber-500/30 shadow-2xl space-y-3 relative overflow-hidden">
      
      {/* Background Subtle Ambient Glow & Floating Notes */}
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      {isPlaying && (
        <>
          <span className="absolute top-2 right-12 text-amber-300 text-xs animate-float opacity-70 pointer-events-none">🎵</span>
          <span className="absolute top-6 right-24 text-rose-300 text-xs animate-float-slow opacity-60 pointer-events-none">🎶</span>
          <span className="absolute bottom-3 right-36 text-emerald-300 text-xs animate-float-reverse opacity-70 pointer-events-none">✨</span>
        </>
      )}

      {/* HEADER SECTION */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-float-fast">
            <Music className={`w-4 h-4 ${isPlaying ? 'animate-spin-slow' : ''}`} />
          </div>
          <div>
            <h4 className="text-xs font-black text-white flex items-center gap-1.5">
              <span>पृष्ठभूमि कोमल सङ्गीत (Soft Ambient Music)</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold animate-float-slow">
                {currentPresetInfo.emoji} {currentPresetInfo.name}
              </span>
            </h4>
            <p className="text-[11px] text-gray-300 mt-0.5">
              {currentPresetInfo.description}
            </p>
          </div>
        </div>

        {/* EQUALIZER WAVE ANIMATION */}
        {isPlaying && (
          <div className="flex items-end gap-1 h-5 px-3 py-1 bg-black/40 rounded-full border border-amber-500/30">
            <span className="w-1 bg-amber-400 rounded-full animate-[bounce_0.8s_infinite_100ms] h-3" />
            <span className="w-1 bg-rose-400 rounded-full animate-[bounce_0.8s_infinite_300ms] h-5" />
            <span className="w-1 bg-emerald-400 rounded-full animate-[bounce_0.8s_infinite_200ms] h-4" />
            <span className="w-1 bg-sky-400 rounded-full animate-[bounce_0.8s_infinite_400ms] h-2" />
          </div>
        )}
      </div>

      {/* CONTROLS & VOLUME BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        
        {/* Play/Pause Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleTogglePlay}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-lg hover:scale-105 transition-all cursor-pointer ${
              isPlaying
                ? 'bg-rose-500/90 hover:bg-rose-500 text-white border border-rose-400/50'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black border border-amber-300/40'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>सङ्गीत रोक्नुहोस् (Pause)</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current ml-0.5" />
                <span>कोमल पृष्ठभूमि सङ्गीत बजाउनुहोस् 🎵</span>
              </>
            )}
          </button>

          {/* Preset Selector Toggle Button */}
          <button
            onClick={() => setShowPresets(!showPresets)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
              showPresets
                ? 'bg-amber-500 text-black border-amber-400'
                : 'bg-black/40 text-gray-300 border-white/10 hover:text-amber-300'
            }`}
          >
            <Disc className="w-3.5 h-3.5" />
            <span>धुन छनोट</span>
          </button>
        </div>

        {/* Volume Controls */}
        <div className="flex items-center gap-2.5 bg-black/40 px-3.5 py-1.5 rounded-xl border border-white/10 text-xs">
          <button
            onClick={handleToggleMute}
            className="text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          <input
            type="range"
            min="0.02"
            max="0.5"
            step="0.02"
            value={isMuted ? 0 : volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-24 h-1.5 bg-amber-500/30 rounded-lg appearance-none cursor-pointer accent-amber-400"
            title="सङ्गीत भोल्युम"
          />

          <span className="text-[11px] font-mono text-amber-300/90 min-w-[32px]">
            {isMuted ? '0%' : `${Math.round(volume * 200)}%`}
          </span>
        </div>
      </div>

      {/* PRESETS SELECTION GRID */}
      {showPresets && (
        <div className="pt-2 border-t border-white/10 grid sm:grid-cols-2 gap-2 animate-fadeIn">
          {MUSIC_PRESETS.map((preset) => {
            const isSelected = activePreset === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handlePresetChange(preset.id)}
                className={`p-2.5 rounded-xl text-left border transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md'
                    : 'bg-black/30 border-white/10 text-gray-300 hover:bg-black/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{preset.emoji}</span>
                  <div>
                    <div className="text-xs font-bold">{preset.name}</div>
                    <div className="text-[10px] text-gray-300 line-clamp-1">{preset.description}</div>
                  </div>
                </div>

                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      )}

    </div>
  );
};
