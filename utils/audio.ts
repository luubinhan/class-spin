import winSoundFile from '../assets/win-sound.mp3';

class AudioManager {
  private audioContext: AudioContext | null = null;
  private winSound: HTMLAudioElement | null = null;

  constructor() {
    this.initAudio();
  }

  private initAudio() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      // Load the win sound MP3 using imported path
      this.winSound = new Audio(winSoundFile);
      this.winSound.preload = 'auto';
    } catch (e) {
      console.warn('Web Audio API not supported', e);
    }
  }

  playTick() {
    if (!this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.05);
  }

  playWin() {
    if (this.winSound) {
      this.winSound.currentTime = 0;
      this.winSound.play().catch(e => console.warn('Could not play win sound', e));
    }
  }
}

export const audioManager = new AudioManager();
