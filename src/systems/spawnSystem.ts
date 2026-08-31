import { camera } from "../game/camera";
import { createEnemy } from "../entities/enemies";

import type { Enemy, EnemyType } from "../game/types";

type UpdateSpawnParams = {
  enemies: Enemy[];
  canvas: HTMLCanvasElement;
  deltaTime: number;
  gameTime: number;
  wave: number;
  spawnCooldown: number;
  bossSpawnedWave: number;
};

type UpdateSpawnResult = {
  wave: number;
  spawnCooldown: number;
  bossSpawnedWave: number;
};

export const updateSpawnSystem = ({
  enemies,
  canvas,
  deltaTime,
  gameTime,
  wave,
  spawnCooldown,
  bossSpawnedWave,
}: UpdateSpawnParams): UpdateSpawnResult => {
  const nextWave = Math.floor(gameTime / 30) + 1;

  const timeInWave = gameTime % 30;

  let nextBossSpawnedWave = bossSpawnedWave;

  let nextSpawnCooldown = spawnCooldown - deltaTime;

  if (timeInWave >= 25 && nextBossSpawnedWave !== nextWave) {
    spawnBoss(enemies, canvas, nextWave);

    nextBossSpawnedWave = nextWave;
  }

  const spawnInterval = Math.max(0.25, 1 - (nextWave - 1) * 0.1);

  if (nextSpawnCooldown <= 0) {
    spawnEnemy(enemies, canvas, nextWave);

    nextSpawnCooldown = spawnInterval;
  }

  return {
    wave: nextWave,
    spawnCooldown: nextSpawnCooldown,
    bossSpawnedWave: nextBossSpawnedWave,
  };
};
const spawnEnemy = (
  enemies: Enemy[],
  canvas: HTMLCanvasElement,
  wave: number,
) => {
  const { x, y } = getSpawnPosition(canvas, 50);

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

const spawnBoss = (
  enemies: Enemy[],
  canvas: HTMLCanvasElement,
  wave: number,
) => {
  const { x, y } = getSpawnPosition(canvas, 100);

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

const getSpawnPosition = (canvas: HTMLCanvasElement, margin: number) => {
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

  return {
    x,
    y,
  };
};
