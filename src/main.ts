import "./style.css";

import { player, resetPlayer } from "./entities/player";
import { weapon, shoot, resetWeapon } from "./entities/weapon";
import { getRandomUpgrades } from "./systems/upgrades";
import { camera } from "./game/camera";
import { renderWorld } from "./render/world";
import { updatePlayerMovement } from "./systems/playerMovement";
import { updateProjectiles } from "./systems/projectileSystem";
import { updateEnemies } from "./systems/enemySystem";
import { updateSpawnSystem } from "./systems/spawnSystem";
import { updateExperience } from "./systems/experienceSystem";
import { renderEnemies } from "./render/enemies";
import { renderPlayer } from "./render/player";
import { renderProjectiles } from "./render/projectiles";
import { renderExperienceOrbs } from "./render/experience";
import { renderHud } from "./render/hud";

import type {
  Enemy,
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
  if (player.hp <= 0) {
    return;
  }

  if (gameState !== "playing") {
    return;
  }

  gameTime += deltaTime;

  const spawnState = updateSpawnSystem({
    enemies,
    canvas,
    deltaTime,
    gameTime,
    wave,
    spawnCooldown,
    bossSpawnedWave,
  });

  wave = spawnState.wave;
  spawnCooldown = spawnState.spawnCooldown;
  bossSpawnedWave = spawnState.bossSpawnedWave;

  if (player.damageCooldown > 0) {
    player.damageCooldown -= deltaTime;
  }

  if (player.shootAnimationTime > 0) {
    player.shootAnimationTime -= deltaTime;
  }

  updatePlayerMovement(keys, deltaTime);

  camera.x = player.x - canvas.width / 2;
  camera.y = player.y - canvas.height / 2;

  updateEnemies({
    enemies,
    enemyProjectiles,
    deltaTime,

    onPlayerDeath: () => {
      gameState = "gameOver";
    },
  });

  weapon.shootCooldown -= deltaTime;

  if (weapon.shootCooldown <= 0) {
    shoot(enemies, projectiles);

    weapon.shootCooldown = weapon.fireInterval;
  }

  updateProjectiles({
    projectiles,
    enemyProjectiles,
    enemies,
    experienceOrbs,
    deltaTime,

    onEnemyKilled: () => {
      kills += 1;
    },

    onPlayerDeath: () => {
      gameState = "gameOver";
    },
  });

  updateExperience({
    experienceOrbs,
    deltaTime,

    onLevelUp: () => {
      currentUpgrades = getRandomUpgrades(3);

      gameState = "levelUp";
    },
  });
};

const render = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // фон
  renderWorld(ctx, canvas);

  renderPlayer(ctx);

  renderEnemies(ctx, enemies);

  renderProjectiles(ctx, projectiles, enemyProjectiles);

  renderExperienceOrbs(ctx, experienceOrbs);

  renderHud({
    ctx,
    canvas,
    gameTime,
    kills,
    wave,
  });

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
