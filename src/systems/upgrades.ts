import { player } from "../entities/player";

import {
  increaseProjectileSpeed,
  increaseProjectileSize,
  increaseAttackSpeed,
  increasePiercing,
  increaseDamage,
} from "../entities/weapon";

import type { Upgrade } from "../game/types";

const upgrades: Upgrade[] = [
  {
    name: "Speed",
    description: "+20% speed",
    apply: () => {
      player.speed *= 1.2;
    },
  },

  {
    name: "Max HP",
    description: "+20 max HP",
    apply: () => {
      player.maxHp += 20;
      player.hp += 20;
    },
  },

  {
    name: "Heal",
    description: "Restore 40 HP",
    apply: () => {
      player.hp = Math.min(player.maxHp, player.hp + 40);
    },
  },

  {
    name: "Fast Bullets",
    description: "+25% projectile speed",
    apply: increaseProjectileSpeed,
  },

  {
    name: "Big Bullets",
    description: "+30% projectile size",
    apply: increaseProjectileSize,
  },

  {
    name: "Rapid Fire",
    description: "+20% attack speed",
    apply: increaseAttackSpeed,
  },

  {
    name: "Piercing",
    description: "+1 enemy penetration",
    apply: increasePiercing,
  },

  {
    name: "Damage",
    description: "+1 projectile damage",
    apply: increaseDamage,
  },
];

export const getRandomUpgrades = (count: number): Upgrade[] => {
  const shuffled = [...upgrades];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));

    const temp = shuffled[i];

    shuffled[i] = shuffled[randomIndex];
    shuffled[randomIndex] = temp;
  }

  return shuffled.slice(0, count);
};
