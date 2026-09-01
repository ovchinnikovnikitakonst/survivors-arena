export type EnemyType = "zombie" | "runner" | "brute" | "shooter" | "boss";

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

  bossDashCooldown?: number;
  bossDashWarning?: number;

  isDying?: boolean;
  deathAnimationTime?: number;

  attackAnimationTime?: number;
  hasDealtAttackDamage?: boolean;

  bossDashTime?: number;
  bossDashDirectionX?: number;
  bossDashDirectionY?: number;
};

export type HitEffect = {
  x: number;
  y: number;
  time: number;
  duration: number;
  radius: number;
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

  damage: number;
  pierce: number;
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

export type WorldObjectType = "deadTree" | "grave" | "bones" | "grass";

export type WorldObject = {
  type: WorldObjectType;

  x: number;
  y: number;

  width: number;
  height: number;

  collisionWidth: number;
  collisionHeight: number;

  collisionOffsetX?: number;
  collisionOffsetY?: number;

  solid: boolean;

  sourceX?: number;
  sourceY?: number;
  sourceWidth?: number;
  sourceHeight?: number;
};

export type GameState = "playing" | "levelUp" | "gameOver";
