import { player } from "../entities/player";
import { playHitSound } from "../audio/audio";

import type {
  Enemy,
  Projectile,
  EnemyProjectile,
  ExperienceOrb,
  HitEffect,
} from "../game/types";

type UpdateProjectilesParams = {
  projectiles: Projectile[];
  enemyProjectiles: EnemyProjectile[];
  enemies: Enemy[];
  experienceOrbs: ExperienceOrb[];
  hitEffects: HitEffect[];
  deltaTime: number;
  onEnemyKilled: () => void;
  onPlayerDeath: () => void;
};

export const updateProjectiles = ({
  projectiles,
  enemyProjectiles,
  enemies,
  experienceOrbs,
  hitEffects,
  deltaTime,
  onEnemyKilled,
  onPlayerDeath,
}: UpdateProjectilesParams) => {
  // движение пуль игрока
  for (const projectile of projectiles) {
    projectile.x += projectile.velocityX * deltaTime;
    projectile.y += projectile.velocityY * deltaTime;
  }

  // вражеские пули движение
  for (const projectile of enemyProjectiles) {
    projectile.x += projectile.directionX * projectile.speed * deltaTime;
    projectile.y += projectile.directionY * projectile.speed * deltaTime;
  }

  for (
    let projectileIndex = projectiles.length - 1;
    projectileIndex >= 0;
    projectileIndex--
  ) {
    const projectile = projectiles[projectileIndex];

    for (let enemyIndex = enemies.length - 1; enemyIndex >= 0; enemyIndex--) {
      const enemy = enemies[enemyIndex];

      if (enemy.isDying) {
        continue;
      }

      if (projectile.hitEnemies.has(enemy)) {
        continue;
      }

      const distance = Math.hypot(
        projectile.x - enemy.x,
        projectile.y - enemy.y,
      );

      if (distance >= projectile.radius + enemy.radius) {
        continue;
      }

      // пуля уже попалда во врага
      projectile.hitEnemies.add(enemy);

      enemy.hp -= projectile.damage;
      enemy.hitFlash = 0.12;

      playHitSound();

      hitEffects.push({
        x: projectile.x,
        y: projectile.y,
        time: 0,
        duration: 0.12,
        radius: 5,
      });

      const knockbackForce = 12;

      enemy.x += projectile.directionX * knockbackForce;
      enemy.y += projectile.directionY * knockbackForce;

      if (enemy.hp <= 0) {
        onEnemyKilled();

        experienceOrbs.push({
          x: enemy.x,
          y: enemy.y,
          radius: 8,
          value: enemy.xpValue,
          magnetRadius: 120,
        });

        enemy.isDying = true;
        enemy.deathAnimationTime = 0;

        enemy.deathAngle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
      }

      if (projectile.pierce > 0) {
        projectile.pierce -= 1;

        const pushDistance = enemy.radius + projectile.radius + 2;

        projectile.x = enemy.x + projectile.directionX * pushDistance;
        projectile.y = enemy.y + projectile.directionY * pushDistance;

        continue;
      }

      projectiles.splice(projectileIndex, 1);

      break;
    }
  }

  for (
    let projectileIndex = enemyProjectiles.length - 1;
    projectileIndex >= 0;
    projectileIndex--
  ) {
    const projectile = enemyProjectiles[projectileIndex];

    const distance = Math.hypot(
      projectile.x - player.x,
      projectile.y - player.y,
    );

    if (distance >= projectile.radius + player.radius) {
      continue;
    }

    player.hp = Math.max(0, player.hp - projectile.damage);

    enemyProjectiles.splice(projectileIndex, 1);

    if (player.hp <= 0) {
      onPlayerDeath();
    }
  }
};
