const loadImage = (src: string) => {
  const image = new Image();

  const normalizedSrc = src.startsWith("/") ? src.slice(1) : src;

  image.src = `${import.meta.env.BASE_URL}${normalizedSrc}`;

  return image;
};

export const sprites = {
  player: {
    pistol: {
      idle: Array.from({ length: 20 }, (_, index) =>
        loadImage(
          `/sprites/player/handgun-idle/survivor-idle_handgun_${index}.png`,
        ),
      ),

      move: Array.from({ length: 20 }, (_, index) =>
        loadImage(
          `/sprites/player/handgun-move/survivor-move_handgun_${index}.png`,
        ),
      ),

      shoot: Array.from({ length: 3 }, (_, index) =>
        loadImage(
          `/sprites/player/handgun-shoot/survivor-shoot_handgun_${index}.png`,
        ),
      ),
    },

    shotgun: {
      idle: Array.from({ length: 20 }, (_, index) =>
        loadImage(
          `/sprites/player/shotgun-idle/survivor-idle_shotgun_${index}.png`,
        ),
      ),

      move: Array.from({ length: 20 }, (_, index) =>
        loadImage(
          `/sprites/player/shotgun-move/survivor-move_shotgun_${index}.png`,
        ),
      ),

      shoot: Array.from({ length: 3 }, (_, index) =>
        loadImage(
          `/sprites/player/shotgun-shoot/survivor-shoot_shotgun_${index}.png`,
        ),
      ),
    },

    rifle: {
      idle: Array.from({ length: 20 }, (_, index) =>
        loadImage(
          `/sprites/player/rifle-idle/survivor-idle_rifle_${index}.png`,
        ),
      ),

      move: Array.from({ length: 20 }, (_, index) =>
        loadImage(
          `/sprites/player/rifle-move/survivor-move_rifle_${index}.png`,
        ),
      ),

      shoot: Array.from({ length: 3 }, (_, index) =>
        loadImage(
          `/sprites/player/rifle-shoot/survivor-shoot_rifle_${index}.png`,
        ),
      ),
    },
  },

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
      `/sprites/runner/attack/attack02_${String(index).padStart(4, "0")}.png`,
    ),
  ),

  shooterWalk: Array.from({ length: 31 }, (_, index) =>
    loadImage(
      `/sprites/shooter/walk/saunter${String(index).padStart(4, "0")}.png`,
    ),
  ),

  shooterAttack: Array.from({ length: 20 }, (_, index) =>
    loadImage(
      `/sprites/shooter/attack/attack03_${String(index).padStart(4, "0")}.png`,
    ),
  ),

  bruteSheet: loadImage("/sprites/brute/zombie_topdown.png"),

  bossMove: loadImage("/sprites/boss/gargant/gargant-boss-move.png"),

  bossAttack: loadImage("/sprites/boss/gargant/gargant-boss-attack.png"),

  bossDeathA: loadImage("/sprites/boss/gargant/gargant-boss-death-0.png"),

  bossDeathB: loadImage("/sprites/boss/gargant/gargant-boss-death-1.png"),

  xp: loadImage("/sprites/xp.png"),

  bossDeath: Array.from({ length: 25 }, (_, index) =>
    loadImage(
      `/sprites/boss/Boss-Death_${String(index + 1).padStart(2, "0")}.png`,
    ),
  ),

  world: {
    graveyard: loadImage("/sprites/world/graveyard/Graveyard_Set.png"),
  },
};
