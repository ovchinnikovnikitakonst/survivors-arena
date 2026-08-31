const DEFAULT_PLAYER = {
  x: 0,
  y: 0,

  radius: 25,
  speed: 300,

  velocityX: 0,
  velocityY: 0,

  hp: 100,
  maxHp: 100,

  damageCooldown: 0,

  level: 1,
  xp: 0,
  xpToNextLevel: 5,
};

export const player = {
  ...DEFAULT_PLAYER,
};

export const resetPlayer = () => {
  Object.assign(player, DEFAULT_PLAYER);
};
