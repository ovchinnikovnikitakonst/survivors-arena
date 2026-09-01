import { player } from "../entities/player";
import { weapon } from "../entities/weapon";

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
    apply: () => {
      weapon.projectileSpeed *= 1.25;
    },
  },

  {
    name: "Big Bullets",
    description: "+30% projectile size",
    apply: () => {
      weapon.projectileRadius *= 1.3;
    },
  },

  {
    name: "Rapid Fire",
    description: "+20% attack speed",
    apply: () => {
      weapon.fireInterval = Math.max(0.1, weapon.fireInterval * 0.8);
    },
  },

  {
    name: "Piercing",
    description: "+1 enemy penetration",
    apply: () => {
      weapon.projectilePierce += 1;
    },
  },

  {
    name: "Damage",
    description: "+1 projectile damage",
    apply: () => {
      weapon.projectileDamage += 1;
    },
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
