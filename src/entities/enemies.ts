import type { Enemy, EnemyType } from "../game/types";

type EnemyConfig = {
  radius: number;
  speed: number;
  hp: number;
  damage: number;
  xpValue: number;
};

const enemyConfigs: Record<EnemyType, EnemyConfig> = {
  zombie: {
    radius: 18,
    speed: 100,
    hp: 2,
    damage: 10,
    xpValue: 1,
  },

  bat: {
    radius: 12,
    speed: 180,
    hp: 1,
    damage: 5,
    xpValue: 1,
  },

  brute: {
    radius: 30,
    speed: 60,
    hp: 6,
    damage: 25,
    xpValue: 3,
  },

  shooter: {
    radius: 16,
    speed: 80,
    hp: 3,
    damage: 8,
    xpValue: 2,
  },
};

export const createEnemy = (type: EnemyType, x: number, y: number): Enemy => {
  const config = enemyConfigs[type];

  return {
    type,

    x,
    y,

    radius: config.radius,
    speed: config.speed,

    hp: config.hp,
    maxHp: config.hp,

    damage: config.damage,
    xpValue: config.xpValue,

    shootCooldown: type === "shooter" ? 0 : undefined,

    fireInterval: type === "shooter" ? 1.5 : undefined,
  };
};
