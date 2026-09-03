import { player } from "../../entities/player";
import type { Enemy } from "../../game/types";
import { sprites } from "../sprites";

export const renderBoss = (
  ctx: CanvasRenderingContext2D,
  enemy: Enemy,
  screenX: number,
  screenY: number,
) => {
  const isPreparingDash = (enemy.bossDashWarning ?? 0) > 0;
  const isDashing = (enemy.bossDashTime ?? 0) > 0;

  if (isPreparingDash) {
    ctx.beginPath();

    ctx.arc(screenX, screenY, enemy.radius + 15, 0, Math.PI * 2);

    ctx.strokeStyle = "#ff0000";
    ctx.lineWidth = 5;
    ctx.stroke();
  }

  const spriteSheet = isDashing ? sprites.bossAttack : sprites.bossMove;

  const frameCount = isDashing ? 5 : 8;

  const frameWidth = spriteSheet.width / frameCount;
  const frameHeight = spriteSheet.height;

  const frameDuration = isDashing ? 40 : 120;

  const frameIndex = Math.floor(performance.now() / frameDuration) % frameCount;

  const angle = isDashing
    ? Math.atan2(enemy.bossDashDirectionY ?? 0, enemy.bossDashDirectionX ?? 0)
    : Math.atan2(player.y - enemy.y, player.x - enemy.x);

  ctx.save();

  ctx.translate(screenX, screenY);

  ctx.rotate(angle + Math.PI / 2);

  ctx.drawImage(
    spriteSheet,

    frameIndex * frameWidth,
    0,
    frameWidth,
    frameHeight,

    -enemy.spriteSize / 2,
    -enemy.spriteSize / 2,
    enemy.spriteSize,
    enemy.spriteSize,
  );

  ctx.restore();
};
