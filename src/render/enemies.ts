import { camera } from "../game/camera";

import { renderEnemyDeath } from "./enemies/renderEnemyDeath";
import { renderZombie } from "./enemies/renderZombie";
import { renderRunner } from "./enemies/renderRunner";
import { renderBrute } from "./enemies/renderBrute";
import { renderShooter } from "./enemies/renderShooter";
import { renderBoss } from "./enemies/renderBoss";
import { renderEnemyHealthBar } from "./enemies/renderEnemyHealthBar";

import type { Enemy } from "../game/types";

export const renderEnemies = (
  ctx: CanvasRenderingContext2D,
  enemies: Enemy[],
) => {
  const sortedEnemies = [...enemies].sort((a, b) => {
    if (a.type === "boss") return 1;
    if (b.type === "boss") return -1;

    return a.y - b.y;
  });

  for (const enemy of sortedEnemies) {
    const screenX = enemy.x - camera.x;
    const screenY = enemy.y - camera.y;

    if (enemy.isDying) {
      renderEnemyDeath(ctx, enemy, screenX, screenY);

      continue;
    }

    ctx.globalAlpha = enemy.hitFlash > 0 ? 0.45 : 1;

    switch (enemy.type) {
      case "zombie":
        renderZombie(ctx, enemy, screenX, screenY);

        break;

      case "runner":
        renderRunner(ctx, enemy, screenX, screenY);

        break;

      case "brute":
        renderBrute(ctx, enemy, screenX, screenY);

        break;

      case "shooter":
        renderShooter(ctx, enemy, screenX, screenY);

        break;

      case "boss":
        renderBoss(ctx, enemy, screenX, screenY);

        break;
    }

    ctx.globalAlpha = 1;

    renderEnemyHealthBar(ctx, enemy, screenX, screenY);
  }
};
