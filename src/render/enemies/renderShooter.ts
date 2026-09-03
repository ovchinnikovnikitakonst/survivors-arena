import { player } from "../../entities/player";
import type { Enemy } from "../../game/types";
import { sprites } from "../sprites";
import { drawImageRotated } from "../utils";

export const renderShooter = (
  ctx: CanvasRenderingContext2D,
  enemy: Enemy,
  screenX: number,
  screenY: number,
) => {
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
};
