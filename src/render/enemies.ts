import { camera } from "../game/camera";
import { sprites } from "./sprites";
import { player } from "../entities/player";
import { drawImageFlippedX } from "./utils";
import { drawImageRotated } from "./utils";

import type { Enemy } from "../game/types";

export const renderEnemies = (
  ctx: CanvasRenderingContext2D,
  enemies: Enemy[],
) => {
  for (const enemy of enemies) {
    const screenX = enemy.x - camera.x;
    const screenY = enemy.y - camera.y;

    if (enemy.type === "boss" && enemy.isDying) {
      const frameDuration = 0.06;

      const frameIndex = Math.min(
        Math.floor((enemy.deathAnimationTime ?? 0) / frameDuration),
        sprites.bossDeath.length - 1,
      );

      ctx.drawImage(
        sprites.bossDeath[frameIndex],
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
      let currentFrame: HTMLImageElement;

      if (isAttacking) {
        const frameDuration = 0.1;

        const frameIndex = Math.min(
          Math.floor((enemy.attackAnimationTime ?? 0) / frameDuration),
          sprites.bruteAttack.length - 1,
        );

        currentFrame = sprites.bruteAttack[frameIndex];
      } else {
        const frameDuration = 90;

        const frameIndex =
          Math.floor(performance.now() / frameDuration) %
          sprites.bruteMove.length;

        currentFrame = sprites.bruteMove[frameIndex];
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

    if (enemy.type === "shooter") {
      const dx = player.x - enemy.x;
      const dy = player.y - enemy.y;

      const angle = Math.atan2(dy, dx);

      drawImageRotated(
        ctx,
        sprites.shooter,
        screenX - enemy.spriteSize / 2,
        screenY - enemy.spriteSize / 2,
        enemy.spriteSize,
        enemy.spriteSize,
        angle,
      );
    }

    if (enemy.type === "boss") {
      const isPreparingDash = (enemy.bossDashWarning ?? 0) > 0;

      if (isPreparingDash) {
        ctx.beginPath();

        ctx.arc(screenX, screenY, enemy.radius + 15, 0, Math.PI * 2);

        ctx.strokeStyle = "#ff0000";
        ctx.lineWidth = 5;
        ctx.stroke();

        ctx.globalAlpha = 0.6;
      }

      const flipX = player.x > enemy.x;

      drawImageFlippedX(
        ctx,
        sprites.boss,
        screenX - enemy.spriteSize / 2,
        screenY - enemy.spriteSize / 2,
        enemy.spriteSize,
        enemy.spriteSize,
        flipX,
      );
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
