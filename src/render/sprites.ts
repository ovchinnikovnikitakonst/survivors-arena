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
};
