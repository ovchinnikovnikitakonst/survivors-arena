import { player } from "../../entities/player";
import type { Enemy } from "../../game/types";
import { sprites } from "../sprites";
import { drawImageRotated } from "../utils";

export const renderEnemyDeath = (
  ctx: CanvasRenderingContext2D,
  enemy: Enemy,
  screenX: number,
  screenY: number,
) => {
  if (enemy.type === "boss") {
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

    const angle =
      enemy.deathAngle ?? Math.atan2(player.y - enemy.y, player.x - enemy.x);

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

    return;
  }

  if (enemy.type === "zombie" || enemy.type === "shooter") {
    const frameDuration = 0.08;

    const frameIndex = Math.min(
      Math.floor((enemy.deathAnimationTime ?? 0) / frameDuration),
      sprites.zombieDeath.length - 1,
    );

    const currentFrame = sprites.zombieDeath[frameIndex];

    drawImageRotated(
      ctx,
      currentFrame,
      screenX - enemy.spriteSize / 2,
      screenY - enemy.spriteSize / 2,
      enemy.spriteSize,
      enemy.spriteSize,
      enemy.deathAngle ?? 0,
    );

    return;
  }

  if (enemy.type === "runner") {
    const frameDuration = 0.08;

    const frameIndex = Math.min(
      Math.floor((enemy.deathAnimationTime ?? 0) / frameDuration),
      sprites.runnerDeath.length - 1,
    );

    const currentFrame = sprites.runnerDeath[frameIndex];

    drawImageRotated(
      ctx,
      currentFrame,
      screenX - enemy.spriteSize / 2,
      screenY - enemy.spriteSize / 2,
      enemy.spriteSize,
      enemy.spriteSize,
      enemy.deathAngle ?? 0,
    );

    return;
  }

  if (enemy.type === "brute") {
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

    const angle = enemy.deathAngle ?? 0;

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
  }
};
