import type { Projectile, WeaponType } from "../game/types";
import { player } from "./player";
import { playShootSound } from "../audio/audio";

type Weapon = {
  type: WeaponType;
  shootCooldown: number;

  projectileSpeed: number;
  projectileRadius: number;
  projectileDamage: number;
  projectilePierce: number;

  projectileCount: number;
  spread: number;

  fireInterval: number;
};

type WeaponConfig = Omit<Weapon, "type" | "shootCooldown">;

type WeaponUpgrades = {
  projectileSpeedMultiplier: number;
  projectileRadiusMultiplier: number;
  projectileDamageBonus: number;
  projectilePierceBonus: number;
  fireIntervalMultiplier: number;
};

const WEAPON_CONFIGS: Record<WeaponType, WeaponConfig> = {
  pistol: {
    projectileSpeed: 500,
    projectileRadius: 6,
    projectileDamage: 1,
    projectilePierce: 0,
    projectileCount: 1,
    spread: 0.03,
    fireInterval: 0.5,
  },

  shotgun: {
    projectileSpeed: 450,
    projectileRadius: 6,
    projectileDamage: 1,
    projectilePierce: 0,
    projectileCount: 6,
    spread: 0.16,
    fireInterval: 0.9,
  },

  rifle: {
    projectileSpeed: 650,
    projectileRadius: 5,
    projectileDamage: 1,
    projectilePierce: 0,
    projectileCount: 1,
    spread: 0.04,
    fireInterval: 0.18,
  },
};

const DEFAULT_WEAPON_TYPE: WeaponType = "pistol";

const weaponUpgrades: WeaponUpgrades = {
  projectileSpeedMultiplier: 1,
  projectileRadiusMultiplier: 1,
  projectileDamageBonus: 0,
  projectilePierceBonus: 0,
  fireIntervalMultiplier: 1,
};

export const weapon: Weapon = {
  type: DEFAULT_WEAPON_TYPE,
  shootCooldown: 0,

  ...WEAPON_CONFIGS[DEFAULT_WEAPON_TYPE],
};

const applyWeaponStats = () => {
  const config = WEAPON_CONFIGS[weapon.type];

  weapon.projectileSpeed =
    config.projectileSpeed * weaponUpgrades.projectileSpeedMultiplier;

  weapon.projectileRadius =
    config.projectileRadius * weaponUpgrades.projectileRadiusMultiplier;

  weapon.projectileDamage =
    config.projectileDamage + weaponUpgrades.projectileDamageBonus;

  weapon.projectilePierce =
    config.projectilePierce + weaponUpgrades.projectilePierceBonus;

  weapon.fireInterval = Math.max(
    0.1,
    config.fireInterval * weaponUpgrades.fireIntervalMultiplier,
  );

  weapon.projectileCount = config.projectileCount;
  weapon.spread = config.spread;
};

export const setWeapon = (type: WeaponType) => {
  weapon.type = type;

  applyWeaponStats();

  weapon.shootCooldown = 0;
};

export const increaseProjectileSpeed = () => {
  weaponUpgrades.projectileSpeedMultiplier *= 1.25;
  applyWeaponStats();
};

export const increaseProjectileSize = () => {
  weaponUpgrades.projectileRadiusMultiplier *= 1.3;
  applyWeaponStats();
};

export const increaseAttackSpeed = () => {
  weaponUpgrades.fireIntervalMultiplier *= 0.8;
  applyWeaponStats();
};

export const increasePiercing = () => {
  weaponUpgrades.projectilePierceBonus += 1;
  applyWeaponStats();
};

export const increaseDamage = () => {
  weaponUpgrades.projectileDamageBonus += 1;
  applyWeaponStats();
};

export const resetWeapon = () => {
  weaponUpgrades.projectileSpeedMultiplier = 1;
  weaponUpgrades.projectileRadiusMultiplier = 1;
  weaponUpgrades.projectileDamageBonus = 0;
  weaponUpgrades.projectilePierceBonus = 0;
  weaponUpgrades.fireIntervalMultiplier = 1;

  weapon.type = DEFAULT_WEAPON_TYPE;

  applyWeaponStats();

  weapon.shootCooldown = 0;
};

export const shoot = (
  projectiles: Projectile[],
  aimX: number,
  aimY: number,
) => {
  const muzzleOffset = player.radius + 8;

  const dx = aimX - player.x;
  const dy = aimY - player.y;

  const distance = Math.hypot(dx, dy);

  if (distance === 0) {
    return;
  }

  playShootSound();

  player.shootAnimationTime = 0.15;

  player.facingAngle = Math.atan2(dy, dx);

  const baseDirectionX = dx / distance;
  const baseDirectionY = dy / distance;

  for (let i = 0; i < weapon.projectileCount; i++) {
    const randomSpread = (Math.random() - 0.5) * weapon.spread;

    const offset =
      (i - (weapon.projectileCount - 1) / 2) * weapon.spread + randomSpread;

    const cos = Math.cos(offset);
    const sin = Math.sin(offset);

    const directionX = baseDirectionX * cos - baseDirectionY * sin;
    const directionY = baseDirectionX * sin + baseDirectionY * cos;

    projectiles.push({
      x: player.x + directionX * muzzleOffset,
      y: player.y + directionY * muzzleOffset,

      radius: weapon.projectileRadius,
      speed: weapon.projectileSpeed,

      directionX,
      directionY,

      velocityX: directionX * weapon.projectileSpeed,
      velocityY: directionY * weapon.projectileSpeed,

      damage: weapon.projectileDamage,
      pierce: weapon.projectilePierce,

      hitEnemies: new Set(),
    });
  }
};
