const loadImage = (src: string) => {
  const image = new Image();

  image.src = src;

  return image;
};

export const sprites = {
  playerIdle: Array.from({ length: 20 }, (_, index) =>
    loadImage(
      `/sprites/player/handgun-idle/survivor-idle_handgun_${index}.png`,
    ),
  ),

  playerMove: Array.from({ length: 20 }, (_, index) =>
    loadImage(
      `/sprites/player/handgun-move/survivor-move_handgun_${index}.png`,
    ),
  ),

  playerShoot: Array.from({ length: 3 }, (_, index) =>
    loadImage(
      `/sprites/player/handgun-shoot/survivor-shoot_handgun_${index}.png`,
    ),
  ),

  zombieAttack: Array.from({ length: 20 }, (_, index) =>
    loadImage(
      `/sprites/zombie/attack/attack01_${String(index).padStart(4, "0")}.png`,
    ),
  ),

  zombieWalk: Array.from({ length: 32 }, (_, index) =>
    loadImage(`/sprites/zombie/walk/walk${String(index).padStart(4, "0")}.png`),
  ),

  bruteMove: Array.from({ length: 17 }, (_, index) =>
    loadImage(`/sprites/brute/move/skeleton-move_${index}.png`),
  ),

  bruteAttack: Array.from({ length: 9 }, (_, index) =>
    loadImage(`/sprites/brute/attack/skeleton-attack_${index}.png`),
  ),

  runnerMove: Array.from({ length: 31 }, (_, index) =>
    loadImage(
      `/sprites/runner/run/run${String(index + 1).padStart(4, "0")}.png`,
    ),
  ),

  runnerAttack: Array.from({ length: 20 }, (_, index) =>
    loadImage(
      `/sprites/runner/attack/attack03_${String(index).padStart(4, "0")}.png`,
    ),
  ),

  bossMove: loadImage("/sprites/boss/gargant/gargant-boss-move.png"),

  bossAttack: loadImage("/sprites/boss/gargant/gargant-boss-attack.png"),

  bossDeathA: loadImage("/sprites/boss/gargant/gargant-boss-death-0.png"),

  bossDeathB: loadImage("/sprites/boss/gargant/gargant-boss-death-1.png"),

  shooter: loadImage("/sprites/shooter.png"),
  xp: loadImage("/sprites/xp.png"),

  bossDeath: Array.from({ length: 25 }, (_, index) =>
    loadImage(
      `/sprites/boss/Boss-Death_${String(index + 1).padStart(2, "0")}.png`,
    ),
  ),

  world: {
    grass: loadImage("/sprites/world/grass.png"),
    rock: loadImage("/sprites/world/rock.png"),
    tree: loadImage("/sprites/world/tree.png"),
    car: loadImage("/sprites/world/car.png"),
  },
};
