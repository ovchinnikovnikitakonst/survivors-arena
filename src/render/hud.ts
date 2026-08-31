import { player } from "../entities/player";

type RenderHudParams = {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  gameTime: number;
  kills: number;
  wave: number;
};

export const renderHud = ({
  ctx,
  canvas,
  gameTime,
  kills,
  wave,
}: RenderHudParams) => {
  renderHealthBar(ctx);
  renderStats(ctx, gameTime, kills, wave);
  renderExperienceBar(ctx, canvas);
};

const renderHealthBar = (ctx: CanvasRenderingContext2D) => {
  const healthBarWidth = 300;
  const healthBarHeight = 20;

  const healthPercent = player.hp / player.maxHp;

  ctx.fillStyle = "#333";

  ctx.fillRect(20, 20, healthBarWidth, healthBarHeight);

  ctx.fillStyle = "#2ecc71";

  ctx.fillRect(20, 20, healthBarWidth * healthPercent, healthBarHeight);

  ctx.fillStyle = "#fff";
  ctx.font = "16px Arial";

  ctx.fillText(`${player.hp} / ${player.maxHp}`, 25, 36);
};

const renderStats = (
  ctx: CanvasRenderingContext2D,
  gameTime: number,
  kills: number,
  wave: number,
) => {
  ctx.fillStyle = "#fff";
  ctx.font = "16px Arial";

  ctx.fillText(`Level: ${player.level}`, 20, 65);

  ctx.fillText(`XP: ${player.xp} / ${player.xpToNextLevel}`, 20, 90);

  const minutes = Math.floor(gameTime / 60);

  const seconds = Math.floor(gameTime % 60);

  const formattedTime =
    `${minutes.toString().padStart(2, "0")}:` +
    `${seconds.toString().padStart(2, "0")}`;

  ctx.fillText(`Time: ${formattedTime}`, 20, 115);

  ctx.fillText(`Kills: ${kills}`, 20, 140);

  ctx.fillText(`Wave: ${wave}`, 20, 165);
};

const renderExperienceBar = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
) => {
  const xpBarHeight = 12;

  const xpPercent = player.xp / player.xpToNextLevel;

  ctx.fillStyle = "#222";

  ctx.fillRect(0, canvas.height - xpBarHeight, canvas.width, xpBarHeight);

  ctx.fillStyle = "#3498db";

  ctx.fillRect(
    0,
    canvas.height - xpBarHeight,
    canvas.width * xpPercent,
    xpBarHeight,
  );
};
