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
  player: loadImage("/sprites/player.png"),
  zombie: loadImage("/sprites/zombie.png"),
  bat: loadImage("/sprites/bat.png"),
  brute: loadImage("/sprites/brute.png"),
  shooter: loadImage("/sprites/shooter.png"),
  xp: loadImage("/sprites/xp.png"),

  boss: loadImage("/sprites/boss/Boss.png"),

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
