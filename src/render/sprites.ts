const loadImage = (src: string) => {
  const image = new Image();

  image.src = src;

  return image;
};

export const sprites = {
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
