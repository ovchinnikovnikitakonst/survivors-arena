import { camera } from "../game/camera";

import type { HitEffect } from "../game/types";

export const renderHitEffects = (
  ctx: CanvasRenderingContext2D,
  hitEffects: HitEffect[],
) => {
  for (const effect of hitEffects) {
    const screenX = effect.x - camera.x;
    const screenY = effect.y - camera.y;

    const progress = effect.time / effect.duration;

    const radius = effect.radius + effect.radius * progress;

    ctx.save();

    ctx.globalAlpha = 1 - progress;

    ctx.beginPath();

    ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);

    ctx.fillStyle = "#ffffff";
    ctx.fill();

    ctx.restore();
  }
};
