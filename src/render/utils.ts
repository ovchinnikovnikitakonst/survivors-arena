export const drawImageFlippedX = (
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
  flipX: boolean,
) => {
  ctx.save();

  if (flipX) {
    ctx.translate(x + width, y);
    ctx.scale(-1, 1);

    ctx.drawImage(image, 0, 0, width, height);
  } else {
    ctx.drawImage(image, x, y, width, height);
  }

  ctx.restore();
};

export const drawImageRotated = (
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
  angle: number,
) => {
  ctx.save();

  ctx.translate(x + width / 2, y + height / 2);

  ctx.rotate(angle);

  ctx.drawImage(image, -width / 2, -height / 2, width, height);

  ctx.restore();
};
