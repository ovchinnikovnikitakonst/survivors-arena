import { player } from "../../entities/player";
import type { Enemy } from "../../game/types";
import { sprites } from "../sprites";
import { drawImageRotated } from "../utils";

export const renderZombie = (
  ctx: CanvasRenderingContext2D,
  enemy: Enemy,
  screenX: number,
  screenY: number,
) => {
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
      Math.floor(performance.now() / frameDuration) % sprites.zombieWalk.length;

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
};
