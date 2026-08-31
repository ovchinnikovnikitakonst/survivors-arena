export type EnemyType = "zombie" | "bat" | "brute" | "shooter";

export type Enemy = {
  type: EnemyType;

  x: number;
  y: number;

  radius: number;
  spriteSize: number;
  speed: number;

  hp: number;
  maxHp: number;

  damage: number;
  xpValue: number;

  shootCooldown?: number;
  fireInterval?: number;

  hitFlash: number;
};

export type Projectile = {
  x: number;
  y: number;
  radius: number;
  speed: number;
  directionX: number;
  directionY: number;
};

export type EnemyProjectile = {
  x: number;
  y: number;
  radius: number;
  speed: number;
  directionX: number;
  directionY: number;
  damage: number;
};

export type ExperienceOrb = {
  x: number;
  y: number;
  radius: number;
  value: number;
  magnetRadius: number;
};

export type Upgrade = {
  name: string;
  description: string;
  apply: () => void;
};

export type GameState = "playing" | "levelUp" | "gameOver";
