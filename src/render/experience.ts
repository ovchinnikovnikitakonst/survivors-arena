import { camera } from "../game/camera";
import { sprites } from "./sprites";

import type { ExperienceOrb } from "../game/types";

export const renderExperienceOrbs = (
  ctx: CanvasRenderingContext2D,
  experienceOrbs: ExperienceOrb[],
) => {
  for (const orb of experienceOrbs) {
    const size = orb.radius * 3;

    const screenX = orb.x - camera.x;
    const screenY = orb.y - camera.y;

    ctx.drawImage(
      sprites.xp,
      screenX - size / 2,
      screenY - size / 2,
      size,
      size,
    );
  }
};
