import { player } from "../entities/player";

import type { AcidPuddle } from "../game/types";

type UpdateAcidPuddlesParams = {
  acidPuddles: AcidPuddle[];
  deltaTime: number;
  onPlayerDeath: () => void;
};

export const updateAcidPuddles = ({
  acidPuddles,
  deltaTime,
  onPlayerDeath,
}: UpdateAcidPuddlesParams) => {
  for (
    let puddleIndex = acidPuddles.length - 1;
    puddleIndex >= 0;
    puddleIndex--
  ) {
    const puddle = acidPuddles[puddleIndex];

    puddle.lifetime += deltaTime;

    if (puddle.damageCooldown > 0) {
      puddle.damageCooldown -= deltaTime;
    }

    if (puddle.lifetime >= puddle.duration) {
      acidPuddles.splice(puddleIndex, 1);
      continue;
    }

    const distance = Math.hypot(puddle.x - player.x, puddle.y - player.y);

    if (distance >= puddle.radius + player.radius) {
      continue;
    }

    if (puddle.damageCooldown > 0) {
      continue;
    }

    player.hp = Math.max(0, player.hp - 5);

    puddle.damageCooldown = 0.5;

    if (player.hp <= 0) {
      onPlayerDeath();
    }
  }
};
