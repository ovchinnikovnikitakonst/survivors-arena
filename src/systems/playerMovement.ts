import { player } from "../entities/player";
import { getNearbyWorldObjects } from "../world/generation";

const collidesWithWorld = (x: number, y: number) => {
  const objects = getNearbyWorldObjects(x, y);

  for (const object of objects) {
    if (!object.solid) {
      continue;
    }

    const collisionX = object.x + (object.collisionOffsetX ?? 0);

    const collisionY = object.y + (object.collisionOffsetY ?? 0);

    const left = collisionX - object.collisionWidth / 2;

    const right = collisionX + object.collisionWidth / 2;

    const top = collisionY - object.collisionHeight / 2;

    const bottom = collisionY + object.collisionHeight / 2;

    const closestX = Math.max(left, Math.min(x, right));

    const closestY = Math.max(top, Math.min(y, bottom));

    const dx = x - closestX;
    const dy = y - closestY;

    const distance = Math.hypot(dx, dy);

    if (distance < player.radius) {
      return true;
    }
  }

  return false;
};

export const updatePlayerMovement = (keys: Set<string>, deltaTime: number) => {
  let x = 0;
  let y = 0;

  if (keys.has("KeyW")) y -= 1;
  if (keys.has("KeyS")) y += 1;
  if (keys.has("KeyA")) x -= 1;
  if (keys.has("KeyD")) x += 1;

  const length = Math.hypot(x, y);

  if (length > 0) {
    x /= length;
    y /= length;
  }

  player.velocityX = x * player.speed;
  player.velocityY = y * player.speed;

  const nextX = player.x + player.velocityX * deltaTime;

  const nextY = player.y + player.velocityY * deltaTime;

  if (!collidesWithWorld(nextX, player.y)) {
    player.x = nextX;
  }

  if (!collidesWithWorld(player.x, nextY)) {
    player.y = nextY;
  }
};
