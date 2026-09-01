import type { Enemy, Projectile } from "../game/types";
import { player } from "./player";
import { playShootSound } from "../audio/audio";

const DEFAULT_WEAPON = {
  projectileSpeed: 500,
  projectileRadius: 6,
  projectileDamage: 1,

  fireInterval: 0.5,
  shootCooldown: 0,

  projectileCount: 1,

  projectilePierce: 0,
};

export const weapon = {
  ...DEFAULT_WEAPON,
};

export const resetWeapon = () => {
  Object.assign(weapon, DEFAULT_WEAPON);
};

export const shoot = (enemies: Enemy[], projectiles: Projectile[]) => {
  const muzzleOffset = player.radius + 8;
  const target = getNearestEnemy(enemies);

  if (!target) {
    return;
  }

  playShootSound();

  player.shootAnimationTime = 0.15;

  const dx = target.x - player.x;
  const dy = target.y - player.y;

  player.facingAngle = Math.atan2(dy, dx);

  const distance = Math.hypot(dx, dy);

  const baseDirectionX = dx / distance;
  const baseDirectionY = dy / distance;

  const spread = 0.2;

  for (let i = 0; i < weapon.projectileCount; i++) {
    const randomSpread = (Math.random() - 0.4) * 0.06;

    const offset =
      (i - (weapon.projectileCount - 1) / 2) * spread + randomSpread;

    const cos = Math.cos(offset);
    const sin = Math.sin(offset);

    const directionX = baseDirectionX * cos - baseDirectionY * sin;

    const directionY = baseDirectionX * sin + baseDirectionY * cos;

    projectiles.push({
      x: player.x + directionX * muzzleOffset,
      y: player.y + directionY * muzzleOffset,

      radius: weapon.projectileRadius,
      speed: weapon.projectileSpeed,

      directionX,
      directionY,

      velocityX: directionX * weapon.projectileSpeed,
      velocityY: directionY * weapon.projectileSpeed,

      damage: weapon.projectileDamage,
      pierce: weapon.projectilePierce,
    });
  }
};

const getNearestEnemy = (enemies: Enemy[]): Enemy | null => {
  let nearestEnemy: Enemy | null = null;
  let nearestDistance = Infinity;

  for (const enemy of enemies) {
    if (enemy.isDying) {
      continue;
    }

    const distance = Math.hypot(enemy.x - player.x, enemy.y - player.y);

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestEnemy = enemy;
    }
  }

  return nearestEnemy;
};
