import type { Enemy } from "../game/types";
import { player } from "../entities/player";

export const updateEnemyMovement = (enemy: Enemy, deltaTime: number) => {
  const dx = player.x - enemy.x;
  const dy = player.y - enemy.y;

  const distance = Math.hypot(dx, dy);

  if (distance === 0) {
    return;
  }

  const directionX = dx / distance;
  const directionY = dy / distance;

  if (enemy.type === "zombie") {
    const attackDistance = enemy.radius + player.radius + 15;

    if (distance <= attackDistance) {
      return;
    }

    enemy.x += directionX * enemy.speed * deltaTime;

    enemy.y += directionY * enemy.speed * deltaTime;

    return;
  }

  if (enemy.type === "bat") {
    const wave = Math.sin(performance.now() / 150) * 0.6;

    enemy.x += (directionX - directionY * wave) * enemy.speed * deltaTime;

    enemy.y += (directionY + directionX * wave) * enemy.speed * deltaTime;

    return;
  }

  if (enemy.type === "shooter") {
    const preferredDistance = 300;

    if (distance > preferredDistance + 30) {
      enemy.x += directionX * enemy.speed * deltaTime;

      enemy.y += directionY * enemy.speed * deltaTime;
    }

    if (distance < preferredDistance - 30) {
      enemy.x -= directionX * enemy.speed * deltaTime;

      enemy.y -= directionY * enemy.speed * deltaTime;
    }

    return;
  }

  if (enemy.type === "brute") {
    const stopDistance = enemy.radius + player.radius + 20;

    if (distance <= stopDistance) {
      return;
    }

    enemy.x += directionX * enemy.speed * deltaTime;

    enemy.y += directionY * enemy.speed * deltaTime;

    return;
  }

  if (enemy.type === "boss") {
    enemy.bossDashCooldown ??= 3;
    enemy.bossDashWarning ??= 0;

    if (enemy.bossDashWarning > 0) {
      enemy.bossDashWarning -= deltaTime;

      if (enemy.bossDashWarning <= 0) {
        const dashForce = 220;

        enemy.x += directionX * dashForce;
        enemy.y += directionY * dashForce;

        enemy.bossDashCooldown = 3;
      }

      return;
    }

    enemy.bossDashCooldown -= deltaTime;

    if (enemy.bossDashCooldown <= 0) {
      enemy.bossDashWarning = 0.5;

      return;
    }

    enemy.x += directionX * enemy.speed * deltaTime;
    enemy.y += directionY * enemy.speed * deltaTime;

    return;
  }
};
