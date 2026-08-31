import { camera } from "../game/camera";

import type { Projectile, EnemyProjectile } from "../game/types";

export const renderProjectiles = (
  ctx: CanvasRenderingContext2D,
  projectiles: Projectile[],
  enemyProjectiles: EnemyProjectile[],
) => {
  for (const projectile of projectiles) {
    const screenX = projectile.x - camera.x;
    const screenY = projectile.y - camera.y;

    ctx.beginPath();

    ctx.arc(screenX, screenY, projectile.radius, 0, Math.PI * 2);

    ctx.fillStyle = "#f1c40f";
    ctx.fill();
  }

  for (const projectile of enemyProjectiles) {
    const screenX = projectile.x - camera.x;
    const screenY = projectile.y - camera.y;

    ctx.beginPath();

    ctx.arc(screenX, screenY, projectile.radius, 0, Math.PI * 2);

    ctx.fillStyle = "#ff4757";
    ctx.fill();
  }
};
