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
  velocityX: number;
  velocityY: number;
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

export type WorldObjectType = "grass" | "rock" | "tree" | "car";

export type WorldObject = {
  type: WorldObjectType;

  x: number;
  y: number;

  width: number;
  height: number;

  collisionWidth: number;
  collisionHeight: number;

  solid: boolean;
};

export type GameState = "playing" | "levelUp" | "gameOver";
