import "./style.css";

import { player, resetPlayer } from "./entities/player";
import { weapon, shoot, resetWeapon } from "./entities/weapon";
import { getRandomUpgrades } from "./systems/upgrades";
import { createEnemy } from "./entities/enemies";
import { updateEnemyMovement } from "./systems/enemyMovement";
import { updateEnemyCombat } from "./systems/enemyCombat";
import { sprites } from "./render/sprites";
import { camera } from "./game/camera";
import { renderWorld } from "./render/world";
import { getNearbyWorldObjects } from "./world/generation";

import type {
  Enemy,
  EnemyType,
  Projectile,
  EnemyProjectile,
  ExperienceOrb,
  Upgrade,
  GameState,
} from "./game/types";

const canvas = document.querySelector<HTMLCanvasElement>("#game");

if (!canvas) {
  throw new Error("Canvas not found");
}

const ctx = canvas.getContext("2d");

if (!ctx) {
  throw new Error("Canvas context not found");
}

const resize = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

window.addEventListener("resize", resize);

resize();

// показывающиеся перки
let currentUpgrades: Upgrade[] = [];

// состояние игры
let gameState: GameState = "playing";
let gameTime = 0;
let kills = 0;
let wave = 1;
let spawnCooldown = 0;
let bossSpawnedWave = 0;

// массив наших противников
const enemies: Enemy[] = [];
// массив выпадающего опыта с противника
const experienceOrbs: ExperienceOrb[] = [];
// массив наших пуль
const projectiles: Projectile[] = [];
// массив врежеских пуль
const enemyProjectiles: EnemyProjectile[] = [];

const keys = new Set<string>();

window.addEventListener("keydown", (event) => {
  if (gameState === "gameOver" && event.code === "KeyR") {
    restartGame();
    return;
  }

  if (gameState === "levelUp") {
    // выбор перка
    if (event.code === "Digit1") {
      selectUpgrade(0);
    }

    if (event.code === "Digit2") {
      selectUpgrade(1);
    }

    if (event.code === "Digit3") {
      selectUpgrade(2);
    }

    return;
  }

  keys.add(event.code);
});

window.addEventListener("keyup", (event) => {
  keys.delete(event.code);
});

let previousTime = performance.now();

const update = (deltaTime: number) => {
  // проипали
  if (player.hp <= 0) {
    return;
  }
  // проверка в каком состоянии игра
  if (gameState !== "playing") {
    return;
  }
  // учет времени игры
  gameTime += deltaTime;

  // босс под конец каждой волны
  wave = Math.floor(gameTime / 30) + 1;

  const timeInWave = gameTime % 30;

  if (timeInWave >= 25 && bossSpawnedWave !== wave) {
    spawnBoss();

    bossSpawnedWave = wave;
  }

  // уменьшаем количество времени спавна
  spawnCooldown -= deltaTime;

  const spawnInterval = Math.max(0.25, 1 - (wave - 1) * 0.1);

  if (spawnCooldown <= 0) {
    spawnEnemy();

    spawnCooldown = spawnInterval;
  }

  // уменьшение кд урона по игроку
  if (player.damageCooldown > 0) {
    player.damageCooldown -= deltaTime;
  }
  // движение игрока
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

  // движение по X
  if (!collidesWithWorld(nextX, player.y)) {
    player.x = nextX;
  }

  // движение по Y
  if (!collidesWithWorld(player.x, nextY)) {
    player.y = nextY;
  }

  camera.x = player.x - canvas.width / 2;
  camera.y = player.y - canvas.height / 2;

  // приближение врагов
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

    if (distance < enemy.radius + player.radius && player.damageCooldown <= 0) {
      player.hp = Math.max(0, player.hp - enemy.damage);

      player.damageCooldown = 0.75;

      if (enemy.type === "brute") {
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;

        const knockbackDistance = Math.hypot(dx, dy);

        if (knockbackDistance > 0) {
          const knockbackForce = 140;

          player.x += (dx / knockbackDistance) * knockbackForce;

          player.y += (dy / knockbackDistance) * knockbackForce;
        }
      }

      if (player.hp <= 0) {
        gameState = "gameOver";
      }
    }
  }

  for (let enemyIndex = enemies.length - 1; enemyIndex >= 0; enemyIndex--) {
    const enemy = enemies[enemyIndex];

    if (enemy.isDying && (enemy.deathAnimationTime ?? 0) >= 1.5) {
      enemies.splice(enemyIndex, 1);
    }
  }

  // выстрел
  weapon.shootCooldown -= deltaTime;

  if (weapon.shootCooldown <= 0) {
    shoot(enemies, projectiles);

    weapon.shootCooldown = weapon.fireInterval;
  }

  //  движение пули
  for (const projectile of projectiles) {
    projectile.x += projectile.velocityX * deltaTime;

    projectile.y += projectile.velocityY * deltaTime;
  }

  for (const projectile of enemyProjectiles) {
    projectile.x += projectile.directionX * projectile.speed * deltaTime;

    projectile.y += projectile.directionY * projectile.speed * deltaTime;
  }

  // попадание пули в противника
  for (
    let projectileIndex = projectiles.length - 1;
    projectileIndex >= 0;
    projectileIndex--
  ) {
    const projectile = projectiles[projectileIndex];

    for (let enemyIndex = enemies.length - 1; enemyIndex >= 0; enemyIndex--) {
      const enemy = enemies[enemyIndex];

      const distance = Math.hypot(
        projectile.x - enemy.x,
        projectile.y - enemy.y,
      );

      if (distance < projectile.radius + enemy.radius) {
        enemy.hp -= 1;

        enemy.hitFlash = 0.12;

        const knockbackForce = 12;

        enemy.x += projectile.directionX * knockbackForce;
        enemy.y += projectile.directionY * knockbackForce;

        projectiles.splice(projectileIndex, 1);

        if (enemy.hp <= 0) {
          kills += 1;

          experienceOrbs.push({
            x: enemy.x,
            y: enemy.y,
            radius: 8,
            value: enemy.xpValue,
            magnetRadius: 120,
          });

          if (enemy.type === "boss") {
            enemy.isDying = true;
            enemy.deathAnimationTime = 0;
          } else {
            enemies.splice(enemyIndex, 1);
          }
        }

        break;
      }
    }
  }
  // попадание пули в игрока
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

    if (distance < projectile.radius + player.radius) {
      player.hp = Math.max(0, player.hp - projectile.damage);

      enemyProjectiles.splice(projectileIndex, 1);

      if (player.hp <= 0) {
        gameState = "gameOver";
      }
    }
  }

  // сбор опыта
  for (let orbIndex = experienceOrbs.length - 1; orbIndex >= 0; orbIndex--) {
    const orb = experienceOrbs[orbIndex];

    const dx = player.x - orb.x;
    const dy = player.y - orb.y;

    const distance = Math.hypot(dx, dy);

    // полет опыта к игроку
    if (distance < orb.magnetRadius && distance > 0) {
      const magnetSpeed = 350;

      orb.x += (dx / distance) * magnetSpeed * deltaTime;

      orb.y += (dy / distance) * magnetSpeed * deltaTime;
    }

    // пересчет расстояния
    const pickupDistance = Math.hypot(orb.x - player.x, orb.y - player.y);

    // подбор опыта
    if (pickupDistance < orb.radius + player.radius) {
      player.xp += orb.value;

      // удаляем собранный опыт из массива
      experienceOrbs.splice(orbIndex, 1);

      // чекаем на повышение ЛВЛа
      if (player.xp >= player.xpToNextLevel) {
        player.xp -= player.xpToNextLevel;

        player.level += 1;

        // увеличиваем колво опыта для некст ЛВЛа
        player.xpToNextLevel = Math.floor(player.xpToNextLevel * 1.5);

        // выбираем случайные перки на выбор
        currentUpgrades = getRandomUpgrades(3);

        gameState = "levelUp";
      }
    }
  }
};

const render = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // фон
  renderWorld(ctx, canvas);

  // игрок
  const playerSize = player.radius * 2;

  const playerScreenX = player.x - camera.x;
  const playerScreenY = player.y - camera.y;

  ctx.drawImage(
    sprites.player,
    playerScreenX - playerSize / 2,
    playerScreenY - playerSize / 2,
    playerSize,
    playerSize,
  );

  // отрисовка противника
  for (const enemy of enemies) {
    const screenX = enemy.x - camera.x;
    const screenY = enemy.y - camera.y;

    if (enemy.type === "boss" && enemy.isDying) {
      const frameDuration = 0.06;

      const frameIndex = Math.min(
        Math.floor((enemy.deathAnimationTime ?? 0) / frameDuration),
        sprites.bossDeath.length - 1,
      );

      ctx.drawImage(
        sprites.bossDeath[frameIndex],
        screenX - enemy.spriteSize / 2,
        screenY - enemy.spriteSize / 2,
        enemy.spriteSize,
        enemy.spriteSize,
      );

      continue;
    }

    if (enemy.type === "zombie") {
      ctx.globalAlpha = enemy.hitFlash > 0 ? 0.45 : 1;

      ctx.drawImage(
        sprites.zombie,
        screenX - enemy.spriteSize / 2,
        screenY - enemy.spriteSize / 2,
        enemy.spriteSize,
        enemy.spriteSize,
      );

      ctx.globalAlpha = 1;
    } else if (enemy.type === "bat") {
      ctx.globalAlpha = enemy.hitFlash > 0 ? 0.45 : 1;

      const frameWidth = 32;
      const frameHeight = 32;

      const frameIndex = Math.floor(performance.now() / 150) % 2;

      ctx.drawImage(
        sprites.bat,

        frameIndex * frameWidth,
        0,
        frameWidth,
        frameHeight,

        screenX - enemy.spriteSize / 2,
        screenY - enemy.spriteSize / 2,
        enemy.spriteSize,
        enemy.spriteSize,
      );

      ctx.globalAlpha = 1;
    } else if (enemy.type === "brute") {
      ctx.globalAlpha = enemy.hitFlash > 0 ? 0.45 : 1;

      ctx.drawImage(
        sprites.brute,
        screenX - enemy.spriteSize / 2,
        screenY - enemy.spriteSize / 2,
        enemy.spriteSize,
        enemy.spriteSize,
      );

      ctx.globalAlpha = 1;
    } else if (enemy.type === "shooter") {
      ctx.globalAlpha = enemy.hitFlash > 0 ? 0.45 : 1;

      ctx.drawImage(
        sprites.shooter,
        screenX - enemy.spriteSize / 2,
        screenY - enemy.spriteSize / 2,
        enemy.spriteSize,
        enemy.spriteSize,
      );

      ctx.globalAlpha = 1;
    } else if (enemy.type === "boss") {
      const isPreparingDash = (enemy.bossDashWarning ?? 0) > 0;

      if (isPreparingDash) {
        ctx.beginPath();

        ctx.arc(screenX, screenY, enemy.radius + 15, 0, Math.PI * 2);

        ctx.strokeStyle = "#ff0000";
        ctx.lineWidth = 5;
        ctx.stroke();
      }

      ctx.globalAlpha = enemy.hitFlash > 0 ? 0.45 : isPreparingDash ? 0.6 : 1;

      ctx.drawImage(
        sprites.boss,
        screenX - enemy.spriteSize / 2,
        screenY - enemy.spriteSize / 2,
        enemy.spriteSize,
        enemy.spriteSize,
      );

      ctx.globalAlpha = 1;
    }

    // HP BAR
    if (enemy.hp < enemy.maxHp) {
      const barWidth = enemy.spriteSize;
      const barHeight = 5;

      const healthPercent = enemy.hp / enemy.maxHp;

      const barX = screenX - barWidth / 2;

      const barY = screenY - enemy.spriteSize / 2 - 8;

      ctx.fillStyle = "#333";

      ctx.fillRect(barX, barY, barWidth, barHeight);

      ctx.fillStyle = "#2ecc71";

      ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
    }
  }

  // отрисовка пуль
  for (const projectile of projectiles) {
    const screenX = projectile.x - camera.x;

    const screenY = projectile.y - camera.y;

    ctx.beginPath();

    ctx.arc(screenX, screenY, projectile.radius, 0, Math.PI * 2);

    ctx.fillStyle = "#f1c40f";
    ctx.fill();
  }

  // отписовка пуль противника
  for (const projectile of enemyProjectiles) {
    ctx.beginPath();

    const screenX = projectile.x - camera.x;

    const screenY = projectile.y - camera.y;

    ctx.arc(screenX, screenY, projectile.radius, 0, Math.PI * 2);

    ctx.fillStyle = "#ff4757";
    ctx.fill();
  }

  // проипали
  if (gameState === "gameOver") {
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#fff";
    ctx.font = "48px Arial";
    ctx.textAlign = "center";

    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);

    ctx.textAlign = "start";

    ctx.font = "24px Arial";

    ctx.fillText(
      "Press R to restart",
      canvas.width / 2,
      canvas.height / 2 + 50,
    );
  }

  // полоса hp
  const healthBarWidth = 300;
  const healthBarHeight = 20;

  const healthPercent = player.hp / player.maxHp;

  ctx.fillStyle = "#333";

  ctx.fillRect(20, 20, healthBarWidth, healthBarHeight);

  ctx.fillStyle = "#2ecc71";

  ctx.fillRect(20, 20, healthBarWidth * healthPercent, healthBarHeight);

  ctx.fillStyle = "#fff";
  ctx.font = "16px Arial";

  ctx.fillText(`${player.hp} / ${player.maxHp}`, 25, 36);

  // вывод опыта
  ctx.fillStyle = "#fff";
  ctx.font = "16px Arial";

  // вывод уровни
  ctx.fillText(`Level: ${player.level}`, 20, 65);

  // вывод опыта
  ctx.fillText(`XP: ${player.xp} / ${player.xpToNextLevel}`, 20, 90);

  // вывод времени волны и убийств
  const minutes = Math.floor(gameTime / 60);

  const seconds = Math.floor(gameTime % 60);

  const formattedTime =
    `${minutes.toString().padStart(2, "0")}:` +
    `${seconds.toString().padStart(2, "0")}`;

  ctx.fillText(`Time: ${formattedTime}`, 20, 115);

  ctx.fillText(`Kills: ${kills}`, 20, 140);

  ctx.fillText(`Wave: ${wave}`, 20, 165);

  // отрисовка выпавшего с врага опыта
  for (const orb of experienceOrbs) {
    const size = orb.radius * 3;

    const screenX = orb.x - camera.x;
    const screenY = orb.y - camera.y;

    ctx.drawImage(
      sprites.xp,
      screenX - size / 2,
      screenY - size / 2,
      size,
      size,
    );
  }

  // полоса опыта
  const xpBarHeight = 12;

  const xpPercent = player.xp / player.xpToNextLevel;

  ctx.fillStyle = "#222";

  ctx.fillRect(0, canvas.height - xpBarHeight, canvas.width, xpBarHeight);

  ctx.fillStyle = "#3498db";

  ctx.fillRect(
    0,
    canvas.height - xpBarHeight,
    canvas.width * xpPercent,
    xpBarHeight,
  );

  // орисовка улучшений при повышении уровня
  if (gameState === "levelUp") {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";

    ctx.font = "48px Arial";

    ctx.fillText("LEVEL UP", canvas.width / 2, canvas.height / 2 - 140);

    ctx.font = "24px Arial";

    currentUpgrades.forEach((upgrade, index) => {
      const y = canvas.height / 2 - 50 + index * 60;

      ctx.fillText(
        `${index + 1} — ${upgrade.name}: ${upgrade.description}`,
        canvas.width / 2,
        y,
      );
    });

    ctx.textAlign = "start";
  }
};

const gameLoop = (currentTime: number) => {
  const deltaTime = (currentTime - previousTime) / 1000;

  previousTime = currentTime;

  update(deltaTime);
  render();

  requestAnimationFrame(gameLoop);
};

requestAnimationFrame(gameLoop);

// функция спавн противника
const spawnEnemy = () => {
  const side = Math.floor(Math.random() * 4);

  const margin = 50;

  let x = 0;
  let y = 0;

  if (side === 0) {
    x = camera.x + Math.random() * canvas.width;
    y = camera.y - margin;
  }

  if (side === 1) {
    x = camera.x + canvas.width + margin;
    y = camera.y + Math.random() * canvas.height;
  }

  if (side === 2) {
    x = camera.x + Math.random() * canvas.width;
    y = camera.y + canvas.height + margin;
  }

  if (side === 3) {
    x = camera.x - margin;
    y = camera.y + Math.random() * canvas.height;
  }

  const random = Math.random();

  let enemyType: EnemyType = "zombie";

  if (wave === 1) {
    if (random < 0.2) {
      enemyType = "bat";
    }
  }

  if (wave === 2) {
    if (random < 0.2) {
      enemyType = "bat";
    } else if (random < 0.3) {
      enemyType = "shooter";
    }
  }

  if (wave >= 3) {
    if (random < 0.2) {
      enemyType = "bat";
    } else if (random < 0.35) {
      enemyType = "shooter";
    } else if (random < 0.5) {
      enemyType = "brute";
    }
  }

  const enemy = createEnemy(enemyType, x, y);

  const difficultyMultiplier = 1 + (wave - 1) * 0.15;

  enemy.hp = Math.ceil(enemy.hp * difficultyMultiplier);

  enemy.maxHp = enemy.hp;

  enemy.damage = Math.ceil(enemy.damage * difficultyMultiplier);

  enemy.speed *= 1 + (wave - 1) * 0.03;

  enemies.push(enemy);
};

// спавним босса
const spawnBoss = () => {
  const margin = 100;

  const side = Math.floor(Math.random() * 4);

  let x = 0;
  let y = 0;

  if (side === 0) {
    x = camera.x + Math.random() * canvas.width;
    y = camera.y - margin;
  }

  if (side === 1) {
    x = camera.x + canvas.width + margin;
    y = camera.y + Math.random() * canvas.height;
  }

  if (side === 2) {
    x = camera.x + Math.random() * canvas.width;
    y = camera.y + canvas.height + margin;
  }

  if (side === 3) {
    x = camera.x - margin;
    y = camera.y + Math.random() * canvas.height;
  }

  const boss = createEnemy("boss", x, y);

  const bossMultiplier = 1 + (wave - 1) * 0.5;

  boss.hp = Math.ceil(boss.hp * bossMultiplier);

  boss.maxHp = boss.hp;

  boss.damage = Math.ceil(boss.damage * bossMultiplier);

  boss.speed *= 1 + (wave - 1) * 0.05;

  boss.xpValue = Math.ceil(boss.xpValue * bossMultiplier);

  boss.bossDashCooldown = 3;

  boss.bossDashWarning = 0;

  enemies.push(boss);
};

// функция выбора перка при повышении уровня
const selectUpgrade = (index: number) => {
  const upgrade = currentUpgrades[index];

  if (!upgrade) {
    return;
  }

  upgrade.apply();

  gameState = "playing";
};

// рестарт игры
const restartGame = () => {
  resetPlayer();
  resetWeapon();

  enemies.length = 0;
  projectiles.length = 0;
  enemyProjectiles.length = 0;
  experienceOrbs.length = 0;

  gameTime = 0;
  kills = 0;
  wave = 1;
  spawnCooldown = 0;
  bossSpawnedWave = 0;

  currentUpgrades = [];

  camera.x = 0;
  camera.y = 0;

  keys.clear();

  previousTime = performance.now();

  gameState = "playing";
};

const collidesWithWorld = (x: number, y: number) => {
  const objects = getNearbyWorldObjects(x, y);

  for (const object of objects) {
    if (!object.solid) {
      continue;
    }

    const left = object.x - object.collisionWidth / 2;

    const right = object.x + object.collisionWidth / 2;

    const top = object.y - object.collisionHeight / 2;

    const bottom = object.y + object.collisionHeight / 2;

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
