import { camera } from "../game/camera";
import { sprites } from "./sprites";
import { player } from "../entities/player";
import { drawImageRotated } from "./utils";

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

    if (enemy.type === "boss" && enemy.isDying) {
      const frameDuration = 0.08;
      const frameCount = 8;

      const deathTime = enemy.deathAnimationTime ?? 0;

      const useSecondSheet = deathTime >= frameDuration * frameCount;

      const spriteSheet = useSecondSheet
        ? sprites.bossDeathB
        : sprites.bossDeathA;

      const localTime = useSecondSheet
        ? deathTime - frameDuration * frameCount
        : deathTime;

      const frameIndex = Math.min(
        Math.floor(localTime / frameDuration),
        frameCount - 1,
      );

      const frameWidth = spriteSheet.width / frameCount;

      const frameHeight = spriteSheet.height;

      const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);

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

      continue;
    }

    if (enemy.type === "brute" && enemy.isDying) {
      const spriteSheet = sprites.bruteSheet;

      const columns = 36;
      const rows = 8;

      const frameWidth = spriteSheet.width / columns;
      const frameHeight = spriteSheet.height / rows;

      const firstDeathFrame = 28;
      const deathFrameCount = 8;

      const frameDuration = 0.12;

      const frameIndex = Math.min(
        firstDeathFrame +
          Math.floor((enemy.deathAnimationTime ?? 0) / frameDuration),
        firstDeathFrame + deathFrameCount - 1,
      );

      const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);

      const normalizedAngle = (angle + Math.PI * 2) % (Math.PI * 2);

      const directionIndex =
        (Math.round(normalizedAngle / (Math.PI / 4)) + 5) % 8;

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

      continue;
    }

    ctx.globalAlpha = enemy.hitFlash > 0 ? 0.45 : 1;

    if (enemy.type === "zombie") {
      const dx = player.x - enemy.x;
      const dy = player.y - enemy.y;

      const distance = Math.hypot(dx, dy);

      const angle = Math.atan2(dy, dx);

      const attackDistance = enemy.radius + player.radius + 30;

      const isAttacking = distance <= attackDistance;

      let currentFrame: HTMLImageElement;

      if (isAttacking) {
        const frameDuration = 0.07;

        const frameIndex = Math.min(
          Math.floor((enemy.attackAnimationTime ?? 0) / frameDuration),
          sprites.zombieAttack.length - 1,
        );

        currentFrame = sprites.zombieAttack[frameIndex];
      } else {
        const frameDuration = 90;

        const frameIndex =
          Math.floor(performance.now() / frameDuration) %
          sprites.zombieWalk.length;

        currentFrame = sprites.zombieWalk[frameIndex];
      }

      drawImageRotated(
        ctx,
        currentFrame,
        screenX - enemy.spriteSize / 2,
        screenY - enemy.spriteSize / 2,
        enemy.spriteSize,
        enemy.spriteSize,
        angle,
      );
    }

    if (enemy.type === "runner") {
      const dx = player.x - enemy.x;
      const dy = player.y - enemy.y;

      const distance = Math.hypot(dx, dy);

      const angle = Math.atan2(dy, dx);

      const attackDistance = enemy.radius + player.radius + 30;

      const isAttacking = distance <= attackDistance;

      let currentFrame: HTMLImageElement;

      if (isAttacking) {
        const frameDuration = 0.07;

        const frameIndex = Math.min(
          Math.floor((enemy.attackAnimationTime ?? 0) / frameDuration),
          sprites.runnerAttack.length - 1,
        );

        currentFrame = sprites.runnerAttack[frameIndex];
      } else {
        const frameDuration = 55;

        const frameIndex =
          Math.floor(performance.now() / frameDuration) %
          sprites.runnerMove.length;

        currentFrame = sprites.runnerMove[frameIndex];
      }

      drawImageRotated(
        ctx,
        currentFrame,
        screenX - enemy.spriteSize / 2,
        screenY - enemy.spriteSize / 2,
        enemy.spriteSize,
        enemy.spriteSize,
        angle,
      );
    }

    if (enemy.type === "brute") {
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

      const directionIndex =
        (Math.round(normalizedAngle / (Math.PI / 4)) + 5) % 8;

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
      } else {
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
      }
    }

    if (enemy.type === "shooter") {
      const dx = player.x - enemy.x;
      const dy = player.y - enemy.y;

      const angle = Math.atan2(dy, dx);

      const isAttacking = (enemy.attackAnimationTime ?? 0) > 0;

      let currentFrame: HTMLImageElement;

      if (isAttacking) {
        const frameDuration = 0.07;

        const frameIndex = Math.min(
          Math.floor((enemy.attackAnimationTime ?? 0) / frameDuration),
          sprites.shooterAttack.length - 1,
        );

        currentFrame = sprites.shooterAttack[frameIndex];
      } else {
        const frameDuration = 90;

        const frameIndex =
          Math.floor(performance.now() / frameDuration) %
          sprites.shooterWalk.length;

        currentFrame = sprites.shooterWalk[frameIndex];
      }

      drawImageRotated(
        ctx,
        currentFrame,
        screenX - enemy.spriteSize / 2,
        screenY - enemy.spriteSize / 2,
        enemy.spriteSize,
        enemy.spriteSize,
        angle,
      );
    }

    if (enemy.type === "boss") {
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

      const frameIndex =
        Math.floor(performance.now() / frameDuration) % frameCount;

      const angle = isDashing
        ? Math.atan2(
            enemy.bossDashDirectionY ?? 0,
            enemy.bossDashDirectionX ?? 0,
          )
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
    }

    ctx.globalAlpha = 1;

    renderEnemyHealthBar(ctx, enemy, screenX, screenY);
  }
};

const renderEnemyHealthBar = (
  ctx: CanvasRenderingContext2D,
  enemy: Enemy,
  screenX: number,
  screenY: number,
) => {
  if (enemy.hp >= enemy.maxHp) {
    return;
  }

  const barWidth = enemy.type === "boss" ? 120 : 60;
  const barHeight = 5;

  const healthPercent = enemy.hp / enemy.maxHp;

  const barX = screenX - barWidth / 2;

  const barY = screenY - enemy.spriteSize / 2 - 8;

  ctx.fillStyle = "#333";

  ctx.fillRect(barX, barY, barWidth, barHeight);

  ctx.fillStyle = "#2ecc71";

  ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
};
