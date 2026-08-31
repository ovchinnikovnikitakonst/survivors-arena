import { camera } from "../game/camera";

import type { WorldObject } from "../game/types";

import { generateWorldObject, TILE_SIZE } from "../world/generation";

import { sprites } from "./sprites";

export const renderWorld = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
) => {
  ctx.fillStyle = "#1f2a1f";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const startTileX = Math.floor(camera.x / TILE_SIZE) - 1;

  const startTileY = Math.floor(camera.y / TILE_SIZE) - 1;

  const endTileX = Math.ceil((camera.x + canvas.width) / TILE_SIZE) + 1;

  const endTileY = Math.ceil((camera.y + canvas.height) / TILE_SIZE) + 1;

  for (let tileX = startTileX; tileX <= endTileX; tileX++) {
    for (let tileY = startTileY; tileY <= endTileY; tileY++) {
      const object = generateWorldObject(tileX, tileY);

      if (!object) {
        continue;
      }

      renderWorldObject(ctx, object);
    }
  }
};

const renderWorldObject = (
  ctx: CanvasRenderingContext2D,
  object: WorldObject,
) => {
  const screenX = object.x - camera.x;

  const screenY = object.y - camera.y;

  const sprite = sprites.world[object.type];

  ctx.drawImage(
    sprite,
    screenX - object.width / 2,
    screenY - object.height / 2,
    object.width,
    object.height,
  );
};
