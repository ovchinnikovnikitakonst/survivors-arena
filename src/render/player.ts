import { player } from "../entities/player";
import { camera } from "../game/camera";
import { sprites } from "./sprites";
import { drawImageRotated } from "./utils";

export const renderPlayer = (ctx: CanvasRenderingContext2D) => {
  const playerSize = player.radius * 2;

  const screenX = player.x - camera.x;
  const screenY = player.y - camera.y;

  const isMoving = player.velocityX !== 0 || player.velocityY !== 0;

  const isShooting = player.shootAnimationTime > 0;

  let frames = sprites.playerIdle;
  let frameDuration = 120;

  if (isMoving) {
    frames = sprites.playerMove;
    frameDuration = 70;
  }

  if (isShooting) {
    frames = sprites.playerShoot;
    frameDuration = 50;
  }

  const frameIndex =
    Math.floor(performance.now() / frameDuration) % frames.length;

  const currentFrame = frames[frameIndex];

  drawImageRotated(
    ctx,
    currentFrame,
    screenX - playerSize / 2,
    screenY - playerSize / 2,
    playerSize,
    playerSize,
    player.facingAngle,
  );
};
