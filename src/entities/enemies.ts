import type { Enemy, EnemyType } from "../game/types";

type EnemyConfig = {
  radius: number;
  spriteSize: number;
  speed: number;
  hp: number;
  damage: number;
  xpValue: number;
};

const enemyConfigs: Record<EnemyType, EnemyConfig> = {
  zombie: {
    radius: 18,
    spriteSize: 220,
    speed: 100,
    hp: 2,
    damage: 10,
    xpValue: 1,
  },

  runner: {
    radius: 16,
    spriteSize: 220,
    speed: 180,
    hp: 1,
    damage: 5,
    xpValue: 1,
  },

  brute: {
    radius: 30,
    spriteSize: 140,
    speed: 60,
    hp: 6,
    damage: 25,
    xpValue: 3,
  },

  shooter: {
    radius: 16,
    spriteSize: 48,
    speed: 80,
    hp: 3,
    damage: 8,
    xpValue: 2,
  },

  boss: {
    radius: 45,
    spriteSize: 220,
    speed: 55,

    hp: 25,
    damage: 25,

    xpValue: 15,
  },
};

export const createEnemy = (type: EnemyType, x: number, y: number): Enemy => {
  const config = enemyConfigs[type];

  return {
    type,

    spriteSize: config.spriteSize,

    x,
    y,

    radius: config.radius,
    speed: config.speed,

    hp: config.hp,
    maxHp: config.hp,

    damage: config.damage,
    xpValue: config.xpValue,

    hitFlash: 0,

    shootCooldown: type === "shooter" ? 0 : undefined,

    fireInterval: type === "shooter" ? 1.5 : undefined,

    attackAnimationTime:
      type === "zombie" || type === "runner" || type === "brute"
        ? 0
        : undefined,

    hasDealtAttackDamage:
      type === "zombie" || type === "runner" || type === "brute"
        ? false
        : undefined,
  };
};
