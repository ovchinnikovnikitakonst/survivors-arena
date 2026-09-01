import { player } from "../entities/player";

import type { Enemy, EnemyProjectile } from "../game/types";

export const updateEnemyCombat = (
  enemy: Enemy,
  enemyProjectiles: EnemyProjectile[],
  deltaTime: number,
) => {
  if (enemy.type !== "shooter") {
    return;
  }

  if (enemy.shootCooldown === undefined || enemy.fireInterval === undefined) {
    return;
  }

  const dx = player.x - enemy.x;
  const dy = player.y - enemy.y;

  const distance = Math.hypot(dx, dy);

  if (distance === 0) {
    return;
  }

  const attackDistance = 330;

  if (distance > attackDistance) {
    enemy.shootCooldown = enemy.fireInterval;

    return;
  }

  enemy.shootCooldown -= deltaTime;

  if (enemy.shootCooldown > 0) {
    return;
  }

  enemyProjectiles.push({
    x: enemy.x,
    y: enemy.y,

    radius: 5,
    speed: 220,

    directionX: dx / distance,
    directionY: dy / distance,

    damage: enemy.damage,
  });

  enemy.shootCooldown = enemy.fireInterval;
};
