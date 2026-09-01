let audioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new AudioContext();
  }

  return audioContext;
};

const resumeAudio = async () => {
  const context = getAudioContext();

  if (context.state === "suspended") {
    await context.resume();
  }

  return context;
};

export const playShootSound = () => {
  void resumeAudio().then((context) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    const now = context.currentTime;

    oscillator.type = "square";

    oscillator.frequency.setValueAtTime(180, now);
    oscillator.frequency.exponentialRampToValueAtTime(70, now + 0.08);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start(now);
    oscillator.stop(now + 0.08);
  });
};

export const playHitSound = () => {
  void resumeAudio().then((context) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    const now = context.currentTime;

    oscillator.type = "triangle";

    oscillator.frequency.setValueAtTime(100, now);
    oscillator.frequency.exponentialRampToValueAtTime(45, now + 0.05);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start(now);
    oscillator.stop(now + 0.05);
  });
};

const music = new Audio(
  `${import.meta.env.BASE_URL}audio/heavy_battle_2_bpm185.mp3`,
);

music.loop = true;
music.volume = 0.12;

export const playBackgroundMusic = async () => {
  if (!music.paused) {
    return;
  }

  await music.play();
};

export const stopBackgroundMusic = () => {
  music.pause();
  music.currentTime = 0;
};
