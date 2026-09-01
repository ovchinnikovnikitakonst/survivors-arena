import { player } from "../entities/player";
import { updateEnemyMovement } from "./enemyMovement";
import { updateEnemyCombat } from "./enemyCombat";

import type { Enemy, EnemyProjectile } from "../game/types";

type UpdateEnemiesParams = {
  enemies: Enemy[];
  enemyProjectiles: EnemyProjectile[];
  deltaTime: number;
  onPlayerDeath: () => void;
};

export const updateEnemies = ({
  enemies,
  enemyProjectiles,
  deltaTime,
  onPlayerDeath,
}: UpdateEnemiesParams) => {
  for (const enemy of enemies) {
    if (enemy.isDying) {
      enemy.deathAnimationTime = (enemy.deathAnimationTime ?? 0) + deltaTime;

      continue;
    }

    if (enemy.hitFlash > 0) {
      enemy.hitFlash -= deltaTime;
    }

    updateEnemyMovement(enemy, deltaTime);

    updateEnemyCombat(enemy, enemyProjectiles, deltaTime);

    const distance = Math.hypot(enemy.x - player.x, enemy.y - player.y);

    if (enemy.type === "zombie") {
      const attackDistance = enemy.radius + player.radius + 30;

      if (distance > attackDistance) {
        enemy.attackAnimationTime = 0;
        enemy.hasDealtAttackDamage = false;

        continue;
      }

      const frameDuration = 0.07;
      const damageFrame = 10;
      const frameCount = 20;

      const damageTime = damageFrame * frameDuration;

      const animationDuration = frameCount * frameDuration;

      enemy.attackAnimationTime = (enemy.attackAnimationTime ?? 0) + deltaTime;

      if (
        enemy.attackAnimationTime >= damageTime &&
        !enemy.hasDealtAttackDamage
      ) {
        player.hp = Math.max(0, player.hp - enemy.damage);

        enemy.hasDealtAttackDamage = true;

        if (player.hp <= 0) {
          onPlayerDeath();
        }
      }

      if (enemy.attackAnimationTime >= animationDuration) {
        enemy.attackAnimationTime = 0;
        enemy.hasDealtAttackDamage = false;
      }

      continue;
    }

    if (enemy.type === "brute") {
      const attackDistance = enemy.radius + player.radius + 35;

      const isAttackInProgress = (enemy.attackAnimationTime ?? 0) > 0;

      if (distance > attackDistance && !isAttackInProgress) {
        enemy.attackAnimationTime = 0;
        enemy.hasDealtAttackDamage = false;

        continue;
      }

      const frameDuration = 0.1;
      const frameCount = 9;
      const damageFrame = 5;

      const animationDuration = frameDuration * frameCount;

      const damageTime = frameDuration * damageFrame;

      enemy.attackAnimationTime = (enemy.attackAnimationTime ?? 0) + deltaTime;

      if (
        enemy.attackAnimationTime >= damageTime &&
        !enemy.hasDealtAttackDamage
      ) {
        player.hp = Math.max(0, player.hp - enemy.damage);

        enemy.hasDealtAttackDamage = true;

        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;

        const knockbackDistance = Math.hypot(dx, dy);

        if (knockbackDistance > 0) {
          const knockbackForce = 140;

          player.x += (dx / knockbackDistance) * knockbackForce;

          player.y += (dy / knockbackDistance) * knockbackForce;
        }

        if (player.hp <= 0) {
          onPlayerDeath();
        }
      }

      if (enemy.attackAnimationTime >= animationDuration) {
        enemy.attackAnimationTime = 0;
        enemy.hasDealtAttackDamage = false;
      }

      continue;
    }

    if (distance >= enemy.radius + player.radius || player.damageCooldown > 0) {
      continue;
    }

    player.hp = Math.max(0, player.hp - enemy.damage);

    player.damageCooldown = 0.75;

    if (player.hp <= 0) {
      onPlayerDeath();
    }
  }

  removeDeadEnemies(enemies);
};

const removeDeadEnemies = (enemies: Enemy[]) => {
  for (let enemyIndex = enemies.length - 1; enemyIndex >= 0; enemyIndex--) {
    const enemy = enemies[enemyIndex];

    if (enemy.isDying && (enemy.deathAnimationTime ?? 0) >= 1.5) {
      enemies.splice(enemyIndex, 1);
    }
  }
};
