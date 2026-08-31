import { player } from "../entities/player";
import { camera } from "../game/camera";
import { sprites } from "./sprites";

export const renderPlayer = (ctx: CanvasRenderingContext2D) => {
  const playerSize = player.radius * 2;

  const screenX = player.x - camera.x;
  const screenY = player.y - camera.y;

  ctx.drawImage(
    sprites.player,
    screenX - playerSize / 2,
    screenY - playerSize / 2,
    playerSize,
    playerSize,
  );
};
