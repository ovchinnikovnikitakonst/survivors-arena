import type { Enemy, Projectile } from "../game/types";
import { player } from "./player";

export const weapon = {
  projectileSpeed: 500,
  projectileRadius: 6,
  fireInterval: 0.5,
  shootCooldown: 0,
  projectileCount: 1,
};

export const shoot = (enemies: Enemy[], projectiles: Projectile[]) => {
  const target = getNearestEnemy(enemies);

  if (!target) {
    return;
  }

  const dx = target.x - player.x;
  const dy = target.y - player.y;

  const distance = Math.hypot(dx, dy);

  const baseDirectionX = dx / distance;
  const baseDirectionY = dy / distance;

  const spread = 0.2;

  for (let i = 0; i < weapon.projectileCount; i++) {
    const offset = (i - (weapon.projectileCount - 1) / 2) * spread;

    const cos = Math.cos(offset);
    const sin = Math.sin(offset);

    const directionX = baseDirectionX * cos - baseDirectionY * sin;

    const directionY = baseDirectionX * sin + baseDirectionY * cos;

    projectiles.push({
      x: player.x,
      y: player.y,

      radius: weapon.projectileRadius,
      speed: weapon.projectileSpeed,

      directionX,
      directionY,

      velocityX: directionX * weapon.projectileSpeed + player.velocityX,

      velocityY: directionY * weapon.projectileSpeed + player.velocityY,
    });
  }
};

const getNearestEnemy = (enemies: Enemy[]): Enemy | null => {
  let nearestEnemy: Enemy | null = null;
  let nearestDistance = Infinity;

  for (const enemy of enemies) {
    const distance = Math.hypot(enemy.x - player.x, enemy.y - player.y);

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestEnemy = enemy;
    }
  }

  return nearestEnemy;
};
