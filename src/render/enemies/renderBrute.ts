import { player } from "../../entities/player";
import type { Enemy } from "../../game/types";
import { sprites } from "../sprites";

export const renderBrute = (
  ctx: CanvasRenderingContext2D,
  enemy: Enemy,
  screenX: number,
  screenY: number,
) => {
  const dx = player.x - enemy.x;
  const dy = player.y - enemy.y;

  const distance = Math.hypot(dx, dy);

  const angle = Math.atan2(dy, dx);

  const attackDistance = enemy.radius + player.radius + 35;

  const isAttacking =
    distance <= attackDistance || (enemy.attackAnimationTime ?? 0) > 0;

  const spriteSheet = sprites.bruteSheet;

  const columns = 36;
  const rows = 8;

  const frameWidth = spriteSheet.width / columns;
  const frameHeight = spriteSheet.height / rows;

  const normalizedAngle = (angle + Math.PI * 2) % (Math.PI * 2);

  const directionIndex = (Math.round(normalizedAngle / (Math.PI / 4)) + 5) % 8;

  if (isAttacking) {
    const firstAttackFrame = 12;
    const attackFrameCount = 4;

    const frameDuration = 0.1;

    const frameIndex = Math.min(
      firstAttackFrame +
        Math.floor((enemy.attackAnimationTime ?? 0) / frameDuration),
      firstAttackFrame + attackFrameCount - 1,
    );

    ctx.drawImage(
      spriteSheet,

      frameIndex * frameWidth,
      directionIndex * frameHeight,
      frameWidth,
      frameHeight,

      screenX - enemy.spriteSize / 2,
      screenY - enemy.spriteSize / 2,
      enemy.spriteSize,
      enemy.spriteSize,
    );

    return;
  }

  const firstWalkFrame = 4;
  const walkFrameCount = 8;

  const frameDuration = 120;

  const frameIndex =
    firstWalkFrame +
    (Math.floor(performance.now() / frameDuration) % walkFrameCount);

  ctx.drawImage(
    spriteSheet,

    frameIndex * frameWidth,
    directionIndex * frameHeight,
    frameWidth,
    frameHeight,

    screenX - enemy.spriteSize / 2,
    screenY - enemy.spriteSize / 2,
    enemy.spriteSize,
    enemy.spriteSize,
  );
};
