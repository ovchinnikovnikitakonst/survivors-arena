import type { WorldObject, WorldObjectType } from "../game/types";

export const TILE_SIZE = 64;

const hash = (x: number, y: number) => {
  const value = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;

  return value - Math.floor(value);
};

const getWorldObjectType = (
  tileX: number,
  tileY: number,
): WorldObjectType | null => {
  if (Math.abs(tileX) <= 2 && Math.abs(tileY) <= 2) {
    return null;
  }

  const random = hash(tileX, tileY);

  if (random < 0.04) {
    return "car";
  }

  if (random < 0.1) {
    return "tree";
  }

  if (random < 0.18) {
    return "rock";
  }

  if (random < 0.4) {
    return "grass";
  }

  return null;
};

export const generateWorldObject = (
  tileX: number,
  tileY: number,
): WorldObject | null => {
  const type = getWorldObjectType(tileX, tileY);

  if (!type) {
    return null;
  }

  const worldX = tileX * TILE_SIZE;

  const worldY = tileY * TILE_SIZE;

  const offsetX = hash(tileX + 100, tileY) * 30 + 16;

  const offsetY = hash(tileX, tileY + 100) * 30 + 16;

  if (type === "grass") {
    return {
      type,
      x: worldX + offsetX,
      y: worldY + offsetY,

      width: 28,
      height: 28,

      collisionWidth: 0,
      collisionHeight: 0,

      solid: false,
    };
  }

  if (type === "rock") {
    return {
      type,
      x: worldX + offsetX,
      y: worldY + offsetY,

      width: 32,
      height: 32,

      collisionWidth: 0,
      collisionHeight: 0,

      solid: false,
    };
  }

  if (type === "tree") {
    return {
      type,
      x: worldX + offsetX,
      y: worldY + offsetY,

      width: 72,
      height: 72,

      collisionWidth: 24,
      collisionHeight: 28,

      solid: true,
    };
  }

  return {
    type,
    x: worldX + offsetX,
    y: worldY + offsetY,

    width: 80,
    height: 80,

    collisionWidth: 58,
    collisionHeight: 34,

    solid: true,
  };
};

export const getNearbyWorldObjects = (
  x: number,
  y: number,
  radiusInTiles = 2,
): WorldObject[] => {
  const centerTileX = Math.floor(x / TILE_SIZE);
  const centerTileY = Math.floor(y / TILE_SIZE);

  const objects: WorldObject[] = [];

  for (
    let tileX = centerTileX - radiusInTiles;
    tileX <= centerTileX + radiusInTiles;
    tileX++
  ) {
    for (
      let tileY = centerTileY - radiusInTiles;
      tileY <= centerTileY + radiusInTiles;
      tileY++
    ) {
      const object = generateWorldObject(tileX, tileY);

      if (object) {
        objects.push(object);
      }
    }
  }

  return objects;
};
