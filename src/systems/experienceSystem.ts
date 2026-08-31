import { player } from "../entities/player";

import type { ExperienceOrb } from "../game/types";

type UpdateExperienceParams = {
  experienceOrbs: ExperienceOrb[];
  deltaTime: number;
  onLevelUp: () => void;
};

export const updateExperience = ({
  experienceOrbs,
  deltaTime,
  onLevelUp,
}: UpdateExperienceParams) => {
  for (let orbIndex = experienceOrbs.length - 1; orbIndex >= 0; orbIndex--) {
    const orb = experienceOrbs[orbIndex];

    const dx = player.x - orb.x;
    const dy = player.y - orb.y;

    const distance = Math.hypot(dx, dy);

    if (distance < orb.magnetRadius && distance > 0) {
      const magnetSpeed = 350;

      orb.x += (dx / distance) * magnetSpeed * deltaTime;

      orb.y += (dy / distance) * magnetSpeed * deltaTime;
    }

    const pickupDistance = Math.hypot(orb.x - player.x, orb.y - player.y);

    if (pickupDistance >= orb.radius + player.radius) {
      continue;
    }

    player.xp += orb.value;

    experienceOrbs.splice(orbIndex, 1);

    if (player.xp < player.xpToNextLevel) {
      continue;
    }

    player.xp -= player.xpToNextLevel;

    player.level += 1;

    player.xpToNextLevel = Math.floor(player.xpToNextLevel * 1.5);

    onLevelUp();
  }
};
