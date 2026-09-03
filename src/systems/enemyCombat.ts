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
    enemy.attackAnimationTime = 0;
    enemy.hasDealtAttackDamage = false;

    return;
  }

  const isAttacking = (enemy.attackAnimationTime ?? 0) > 0;

  if (isAttacking) {
    const frameDuration = 0.07;
    const frameCount = 20;

    const spitFrame = 10;
    const spitTime = spitFrame * frameDuration;

    const animationDuration = frameCount * frameDuration;

    enemy.attackAnimationTime = (enemy.attackAnimationTime ?? 0) + deltaTime;

    if (enemy.attackAnimationTime >= spitTime && !enemy.hasDealtAttackDamage) {
      enemyProjectiles.push({
        x: enemy.x,
        y: enemy.y,

        radius: 7,
        speed: 220,

        directionX: dx / distance,
        directionY: dy / distance,

        damage: enemy.damage,
      });

      enemy.hasDealtAttackDamage = true;
    }

    if (enemy.attackAnimationTime >= animationDuration) {
      enemy.attackAnimationTime = 0;
      enemy.hasDealtAttackDamage = false;

      enemy.shootCooldown = enemy.fireInterval;
    }

    return;
  }

  enemy.shootCooldown -= deltaTime;

  if (enemy.shootCooldown > 0) {
    return;
  }

  enemy.attackAnimationTime = deltaTime;
};
