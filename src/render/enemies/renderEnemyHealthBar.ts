import type { Enemy } from "../../game/types";

export const renderEnemyHealthBar = (
  ctx: CanvasRenderingContext2D,
  enemy: Enemy,
  screenX: number,
  screenY: number,
) => {
  if (enemy.hp >= enemy.maxHp) {
    return;
  }

  const barWidth = enemy.type === "boss" ? 120 : 60;
  const barHeight = 5;

  const healthPercent = enemy.hp / enemy.maxHp;

  const barX = screenX - barWidth / 2;
  const barY = screenY - enemy.spriteSize / 2 - 8;

  ctx.fillStyle = "#333";

  ctx.fillRect(barX, barY, barWidth, barHeight);

  ctx.fillStyle = "#2ecc71";

  ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
};
