// High-Fidelity Soft Ambient Background Music Engine
// Supports both Real Acoustic Audio Streams and Fallback Synthesizers

export type MusicPreset = 'flute' | 'piano' | 'guitar' | 'nature';

export interface SoundscapePresetInfo {
  id: MusicPreset;
  name: string;
  emoji: string;
  description: string;
  audioUrl: string;
  frequencies: number[];
  filterFreq: number;
}

export const MUSIC_PRESETS: SoundscapePresetInfo[] = [
  {
    id: 'flute',
    name: 'नेपाली हिमाली बाँसुरी (Himalayan Flute)',
    emoji: '🪈',
    description: 'कोमल हिमाली बाँसुरी र शान्त पहाडी धुन',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=relaxing-flute-music-113222.mp3',
    frequencies: [164.81, 246.94, 329.63, 392.00, 493.88], // E3, B3, E4, G4, B4
    filterFreq: 420,
  },
  {
    id: 'guitar',
    name: 'सोफ्ट एकोस्टिक गिटार (Acoustic Guitar)',
    emoji: '🎸',
    description: 'मन्द गतिको सुमधुर एकोस्टिक गिटार र कोमल ताल',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a731ef.mp3?filename=soft-guitar-ambient-10537.mp3',
    frequencies: [196.00, 246.94, 293.66, 392.00, 493.88], // G3, B3, D4, G4, B4
    filterFreq: 480,
  },
  {
    id: 'piano',
    name: 'सुमधुर पियानो (Soothing Soft Piano)',
    emoji: '🎹',
    description: 'कथा पढ्दा एकाग्रता र शान्ति दिने कोमल पियानो धुन',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=relaxing-piano-10701.mp3',
    frequencies: [146.83, 220.00, 293.66, 349.23, 440.00], // D3, A3, D4, F4, A4
    filterFreq: 350,
  },
  {
    id: 'nature',
    name: 'प्रकृति र सिमसिम पानी (Nature & Rain)',
    emoji: '🌿',
    description: 'प्रकृतिको साउन्डस्केप, चराचुरुङ्गी र कोमल सुसाइ',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_403c9b1395.mp3?filename=gentle-rain-nature-sounds-9883.mp3',
    frequencies: [130.81, 196.00, 261.63, 329.63, 392.00], // C3, G3, C4, E4, G4
    filterFreq: 520,
  },
];

class SoftMusicEngine {
  private audioElement: HTMLAudioElement | null = null;
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private masterGain: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private lfo: OscillatorNode | null = null;
  private currentPreset: MusicPreset = 'flute';
  private currentVol = 0.25;

  start(presetId: MusicPreset = 'flute', volume = 0.25) {
    this.stop();

    this.currentPreset = presetId;
    this.currentVol = volume;
    this.isPlaying = true;

    const preset = MUSIC_PRESETS.find((p) => p.id === presetId) || MUSIC_PRESETS[0];

    // MediaSession API Integration for Lock-Screen / Background Playback Controls
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: preset.name,
        artist: 'कथा चौतारी (Katha Chautari)',
        album: 'पृष्ठभूमि कोमल सङ्गीत & नेपाली साहित्य',
        artwork: [
          { src: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=512&h=512&fit=crop', sizes: '512x512', type: 'image/jpeg' },
        ],
      });

      try {
        navigator.mediaSession.setActionHandler('play', () => {
          this.start(this.currentPreset, this.currentVol);
        });
        navigator.mediaSession.setActionHandler('pause', () => {
          this.stop();
        });
      } catch (e) {}
    }

    // Attempt 1: Try HTML5 Audio Stream for realistic acoustic instrument sound
    try {
      this.audioElement = new Audio();
      this.audioElement.src = preset.audioUrl;
      this.audioElement.loop = true;
      this.audioElement.volume = volume;
      this.audioElement.crossOrigin = 'anonymous';

      const playPromise = this.audioElement.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Audio streaming successfully playing
          })
          .catch((err) => {
            console.warn('Audio stream autoplay blocked or network failed. Falling back to Web Audio synth', err);
            this.startWebAudioSynth(preset, volume);
          });
      }
    } catch (e) {
      console.warn('HTML5 Audio failed, falling back to Web Audio Synth', e);
      this.startWebAudioSynth(preset, volume);
    }
  }

  // Backup Web Audio Synthesizer (Acoustic Harmonic Simulation)
  private startWebAudioSynth(preset: SoundscapePresetInfo, volume: number) {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.masterGain.gain.exponentialRampToValueAtTime(Math.max(0.01, volume), this.ctx.currentTime + 1.0);

      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(preset.filterFreq, this.ctx.currentTime);

      this.lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      this.lfo.frequency.value = 0.15;
      lfoGain.gain.value = 70;
      this.lfo.connect(this.filterNode.frequency);
      this.lfo.start();

      this.oscillators = preset.frequencies.map((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const oscGain = this.ctx!.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);
        osc.detune.setValueAtTime((Math.random() - 0.5) * 8, this.ctx!.currentTime);

        oscGain.gain.setValueAtTime(0.05, this.ctx!.currentTime);
        osc.connect(oscGain);
        oscGain.connect(this.filterNode!);
        osc.start();
        return osc;
      });

      this.filterNode.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    } catch (err) {
      console.warn('Web Audio synth failed', err);
    }
  }

  setVolume(volume: number) {
    this.currentVol = volume;
    if (this.audioElement) {
      this.audioElement.volume = volume;
    }
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(Math.max(0.001, volume), this.ctx.currentTime, 0.1);
    }
  }

  changePreset(presetId: MusicPreset) {
    if (this.isPlaying) {
      this.start(presetId, this.currentVol);
    } else {
      this.currentPreset = presetId;
    }
  }

  stop() {
    this.isPlaying = false;

    // Stop HTML Audio
    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.src = '';
      } catch (e) {}
      this.audioElement = null;
    }

    // Stop Web Audio Synth
    try {
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setTargetAtTime(0.001, this.ctx.currentTime, 0.2);
      }
      setTimeout(() => {
        this.oscillators.forEach((osc) => {
          try { osc.stop(); osc.disconnect(); } catch {}
        });
        if (this.lfo) {
          try { this.lfo.stop(); this.lfo.disconnect(); } catch {}
        }
        if (this.ctx) {
          this.ctx.close();
        }
        this.ctx = null;
        this.oscillators = [];
      }, 250);
    } catch (e) {}
  }

  getIsPlaying() {
    return this.isPlaying;
  }

  getCurrentPreset() {
    return this.currentPreset;
  }
}

export const softMusicEngine = new SoftMusicEngine();
