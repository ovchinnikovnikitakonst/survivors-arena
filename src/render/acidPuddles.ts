import { camera } from "../game/camera";
import { sprites } from "./sprites";

import type { AcidPuddle } from "../game/types";

export const renderAcidPuddles = (
  ctx: CanvasRenderingContext2D,
  acidPuddles: AcidPuddle[],
) => {
  const spriteSheet = sprites.acidPuddleSheet;

  const columns = 4;
  const rows = 2;

  const frameWidth = spriteSheet.width / columns;
  const frameHeight = spriteSheet.height / rows;

  const frameCount = 8;
  const frameDuration = 120;

  for (const puddle of acidPuddles) {
    const screenX = puddle.x - camera.x;
    const screenY = puddle.y - camera.y;

    const frameIndex =
      Math.floor(performance.now() / frameDuration) % frameCount;

    const column = frameIndex % columns;
    const row = Math.floor(frameIndex / columns);

    const progress = puddle.lifetime / puddle.duration;

    ctx.save();

    ctx.globalAlpha = 1 - progress * 0.5;

    ctx.drawImage(
      spriteSheet,

      column * frameWidth,
      row * frameHeight,
      frameWidth,
      frameHeight,

      screenX - puddle.radius,
      screenY - puddle.radius,
      puddle.radius * 2,
      puddle.radius * 2,
    );

    ctx.restore();
  }
};
