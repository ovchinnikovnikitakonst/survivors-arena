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

    ctx.save();

    // внешнее кислотное свечение
    const glow = ctx.createRadialGradient(
      screenX,
      screenY,
      0,
      screenX,
      screenY,
      projectile.radius * 3,
    );

    glow.addColorStop(0, "rgba(180, 255, 0, 0.9)");
    glow.addColorStop(0.4, "rgba(100, 255, 0, 0.45)");
    glow.addColorStop(1, "rgba(80, 180, 0, 0)");

    ctx.fillStyle = glow;

    ctx.beginPath();

    ctx.arc(screenX, screenY, projectile.radius * 3, 0, Math.PI * 2);

    ctx.fill();

    // кислотный хвост
    for (let i = 1; i <= 4; i++) {
      const trailX =
        screenX - projectile.directionX * i * projectile.radius * 0.9;

      const trailY =
        screenY - projectile.directionY * i * projectile.radius * 0.9;

      ctx.beginPath();

      ctx.arc(
        trailX,
        trailY,
        projectile.radius * (1 - i * 0.15),
        0,
        Math.PI * 2,
      );

      ctx.fillStyle = `rgba(120, 255, 0, ${0.35 - i * 0.06})`;
      ctx.fill();
    }

    // основное кислотное ядро
    ctx.beginPath();

    ctx.arc(screenX, screenY, projectile.radius, 0, Math.PI * 2);

    ctx.shadowBlur = 10;
    ctx.shadowColor = "#9dff00";

    ctx.fillStyle = "#7fff00";
    ctx.fill();

    // тёмная внутренняя капля
    ctx.beginPath();

    ctx.arc(
      screenX - projectile.radius * 0.2,
      screenY + projectile.radius * 0.15,
      projectile.radius * 0.45,
      0,
      Math.PI * 2,
    );

    ctx.fillStyle = "#3d8f00";
    ctx.fill();

    // пузырьки
    const time = performance.now() * 0.01;

    for (let i = 0; i < 3; i++) {
      const angle = time + i * 2.1;

      const bubbleX = screenX + Math.cos(angle) * projectile.radius * 0.7;

      const bubbleY = screenY + Math.sin(angle) * projectile.radius * 0.7;

      ctx.beginPath();

      ctx.arc(bubbleX, bubbleY, projectile.radius * 0.18, 0, Math.PI * 2);

      ctx.fillStyle = "#d4ff66";
      ctx.fill();
    }

    ctx.restore();
  }
};
