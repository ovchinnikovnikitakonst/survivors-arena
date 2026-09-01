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

export const weapon: Weapon = {
  type: DEFAULT_WEAPON_TYPE,
  shootCooldown: 0,

  ...WEAPON_CONFIGS[DEFAULT_WEAPON_TYPE],
};

export const setWeapon = (type: WeaponType) => {
  weapon.type = type;

  Object.assign(weapon, WEAPON_CONFIGS[type]);

  weapon.shootCooldown = 0;
};

export const resetWeapon = () => {
  setWeapon(DEFAULT_WEAPON_TYPE);
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

  const spread = 0.2;

  for (let i = 0; i < weapon.projectileCount; i++) {
    const randomSpread = (Math.random() - 0.4) * 0.06;

    const offset =
      (i - (weapon.projectileCount - 1) / 2) * spread + randomSpread;

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
    });
  }
};
