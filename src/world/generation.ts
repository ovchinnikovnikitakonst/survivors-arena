import type { WorldObject } from "../game/types";

export const TILE_SIZE = 48;

const hash = (x: number, y: number) => {
  const value = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;

  return value - Math.floor(value);
};

export const generateWorldObject = (
  tileX: number,
  tileY: number,
): WorldObject | null => {
  if (Math.abs(tileX) <= 2 && Math.abs(tileY) <= 2) {
    return null;
  }

  const random = hash(tileX, tileY);

  const worldX = tileX * TILE_SIZE;
  const worldY = tileY * TILE_SIZE;

  const offsetX = hash(tileX + 100, tileY) * 40 + 4;
  const offsetY = hash(tileX, tileY + 100) * 40 + 4;

  const x = worldX + offsetX;
  const y = worldY + offsetY;

  if (random < 0.015) {
    return {
      type: "deadTree",

      x,
      y,

      width: 90,
      height: 130,

      collisionWidth: 28,
      collisionHeight: 20,

      collisionOffsetX: 0,
      collisionOffsetY: 45,

      solid: true,

      sourceX: 16,
      sourceY: 23,
      sourceWidth: 3,
      sourceHeight: 5,
    };
  }

  if (random < 0.03) {
    const graveVariants = [
      { sourceX: 18, sourceY: 11 },
      { sourceX: 20, sourceY: 11 },
    ];

    const graveVariant =
      graveVariants[
        Math.floor(hash(tileX + 400, tileY + 400) * graveVariants.length)
      ];

    return {
      type: "grave",

      x,
      y,

      width: 55,
      height: 70,

      collisionWidth: 20,
      collisionHeight: 8,

      collisionOffsetX: 0,
      collisionOffsetY: 20,

      solid: true,

      sourceX: graveVariant.sourceX,
      sourceY: graveVariant.sourceY,
      sourceWidth: 2,
      sourceHeight: 3,
    };
  }

  if (random < 0.05) {
    const boneVariants = [
      { sourceX: 5, sourceY: 21 },
      { sourceX: 10, sourceY: 22 },
      { sourceX: 7, sourceY: 22 },
    ];

    const variantIndex = Math.floor(
      hash(tileX + 300, tileY + 300) * boneVariants.length,
    );

    const variant = boneVariants[variantIndex];

    return {
      type: "bones",

      x,
      y,

      width: 28,
      height: 28,

      collisionWidth: 0,
      collisionHeight: 0,

      solid: false,

      sourceX: variant.sourceX,
      sourceY: variant.sourceY,
      sourceWidth: 1,
      sourceHeight: 1,
    };
  }

  if (random < 0.2) {
    const grassVariants = [
      { sourceX: 20, sourceY: 23 },
      { sourceX: 21, sourceY: 23 },
      { sourceX: 22, sourceY: 23 },
    ];

    const variantIndex = Math.floor(
      hash(tileX + 200, tileY + 200) * grassVariants.length,
    );

    const variant = grassVariants[variantIndex];

    return {
      type: "grass",

      x,
      y,

      width: 30,
      height: 22,

      collisionWidth: 0,
      collisionHeight: 0,

      solid: false,

      sourceX: variant.sourceX,
      sourceY: variant.sourceY,
      sourceWidth: 1,
      sourceHeight: 1,
    };
  }

  return null;
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
