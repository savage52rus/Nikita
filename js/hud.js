function drawHUD() {
  const hudGrad = ctx.createLinearGradient(0, 0, 0, 80);
  hudGrad.addColorStop(0, 'rgba(20, 10, 40, 0.85)');
  hudGrad.addColorStop(1, 'rgba(10, 5, 20, 0.7)');
  ctx.fillStyle = hudGrad;
  ctx.fillRect(0, 0, W, 80);
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.fillRect(0, 0, W, 1);
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(0, 79, W, 1);

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('Уровень ' + (currentLevel + 1) + ' / ' + LEVELS.length + ': ' + level.name, 20, 32);
  ctx.font = 'bold 18px sans-serif';
  ctx.fillStyle = '#ffd700';
  ctx.fillText('Очки: ' + player.score, 20, 62);

  for (let i = 0; i < player.maxHp; i++) {
    const hx = 340 + i * 32, hy = 40;
    if (i < player.hp) {
      const heartGrad = ctx.createRadialGradient(hx + 5, hy + 5, 0, hx + 10, hy + 10, 15);
      heartGrad.addColorStop(0, '#ff6b6b');
      heartGrad.addColorStop(0.5, '#e63946');
      heartGrad.addColorStop(1, '#8b0000');
      ctx.fillStyle = heartGrad;
    } else {
      ctx.fillStyle = '#333';
    }
    ctx.beginPath();
    ctx.moveTo(hx + 10, hy + 18);
    ctx.bezierCurveTo(hx + 10, hy + 10, hx - 3, hy + 10, hx - 3, hy + 2);
    ctx.bezierCurveTo(hx - 3, hy - 3, hx + 5, hy - 3, hx + 10, hy + 4);
    ctx.bezierCurveTo(hx + 15, hy - 3, hx + 23, hy - 3, hx + 23, hy + 2);
    ctx.bezierCurveTo(hx + 23, hy + 10, hx + 10, hy + 10, hx + 10, hy + 18);
    ctx.fill();
    if (i < player.hp) {
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.beginPath();
      ctx.ellipse(hx + 5, hy + 3, 2, 1.5, -0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const totalOct = octopuses.length, takenOct = octopuses.filter(o => o.taken).length;
  ctx.save();
  ctx.translate(W - 260, 42);
  const hudGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, 18);
  hudGlow.addColorStop(0, 'rgba(180, 80, 255, 0.6)');
  hudGlow.addColorStop(1, 'rgba(100, 0, 180, 0)');
  ctx.fillStyle = hudGlow;
  ctx.beginPath();
  ctx.arc(0, 0, 18, 0, Math.PI * 2);
  ctx.fill();
  const miniBody = ctx.createRadialGradient(-2, -3, 0, 0, 0, 8);
  miniBody.addColorStop(0, '#e88bff');
  miniBody.addColorStop(1, '#6a1090');
  ctx.fillStyle = miniBody;
  ctx.beginPath();
  ctx.ellipse(0, -2, 6, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(-2.5, -1, 1.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(2.5, -1, 1.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1a0030';
  ctx.beginPath();
  ctx.arc(-2.5, -0.5, 0.9, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(2.5, -0.5, 0.9, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.fillStyle = '#fff';
  ctx.fillText(takenOct + ' / ' + totalOct, W - 230, 48);

  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  roundRect(ctx, W - 200, 58, 180, 8, 4);
  ctx.fill();
  const mapGrad = ctx.createLinearGradient(W - 200, 0, W - 20, 0);
  mapGrad.addColorStop(0, '#b86bff');
  mapGrad.addColorStop(1, '#ff8df0');
  ctx.fillStyle = mapGrad;
  roundRect(ctx, W - 200, 58, 180 * (player.x / level.width), 8, 4);
  ctx.fill();

  if (boss && boss.hp > 0 && bossIntroTimer <= 0) {
    const barW = 600, barH = 28;
    const bx = W / 2 - barW / 2, by = H - 60;
    ctx.fillStyle = 'rgba(10, 5, 20, 0.85)';
    roundRect(ctx, bx - 8, by - 34, barW + 16, barH + 42, 10);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    roundRect(ctx, bx - 8, by - 34, barW + 16, barH + 42, 10);
    ctx.stroke();

    ctx.fillStyle = boss.phase === 2 ? '#ff4444' : '#fff';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ИРИНА' + (boss.phase === 2 ? ' — ЯРОСТЬ!' : ''), W / 2, by - 12);

    ctx.fillStyle = '#1a0a1a';
    roundRect(ctx, bx, by, barW, barH, 6);
    ctx.fill();

    const hpPct = boss.hp / boss.maxHp;
    const grad = ctx.createLinearGradient(bx, 0, bx + barW, 0);
    if (boss.phase === 2) {
      grad.addColorStop(0, '#ff0000');
      grad.addColorStop(0.5, '#ff4444');
      grad.addColorStop(1, '#ff8800');
    } else {
      grad.addColorStop(0, '#8b0000');
      grad.addColorStop(0.5, '#c0392b');
      grad.addColorStop(1, '#e74c3c');
    }
    ctx.fillStyle = grad;
    roundRect(ctx, bx, by, barW * hpPct, barH, 6);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    roundRect(ctx, bx, by, barW * hpPct, barH / 2, 6);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 2;
    roundRect(ctx, bx, by, barW, barH, 6);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.lineWidth = 2;
    for (let i = 1; i < boss.maxHp; i++) {
      ctx.beginPath();
      ctx.moveTo(bx + barW * i / boss.maxHp, by);
      ctx.lineTo(bx + barW * i / boss.maxHp, by + barH);
      ctx.stroke();
    }
    ctx.textAlign = 'left';
  }

  if (bossIntroTimer > 0) drawBossIntro();

  if (player.powerTimer > 0) {
    const pct = player.powerTimer / POWER_DURATION;
    const barW = 260, barH = 28;
    const bx = W / 2 - barW / 2, by = 90;
    ctx.fillStyle = 'rgba(10, 5, 20, 0.85)';
    roundRect(ctx, bx - 6, by - 6, barW + 12, barH + 12, 8);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,215,0,0.4)';
    ctx.lineWidth = 1;
    roundRect(ctx, bx - 6, by - 6, barW + 12, barH + 12, 8);
    ctx.stroke();

    const grad = ctx.createLinearGradient(bx, 0, bx + barW, 0);
    grad.addColorStop(0, '#ffd700');
    grad.addColorStop(0.5, '#fff8b0');
    grad.addColorStop(1, '#ffa500');
    ctx.fillStyle = grad;
    roundRect(ctx, bx, by, barW * pct, barH, 4);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    roundRect(ctx, bx, by, barW * pct, barH / 2, 4);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'center';
    const secs = Math.ceil(player.powerTimer / 60);
    ctx.fillText('★ СЕРП И МОЛОТ ★  ' + secs + ' сек', W / 2, by + 20);
    ctx.textAlign = 'left';
  }

  ctx.font = '13px sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  if (player.powerTimer > 0) {
    ctx.fillStyle = '#ffd700';
    ctx.fillText('← → — идти  |  Space — прыжок  |  E — БРОСИТЬ МОЛОТ!  |  M — звук', 20, H - 15);
  } else {
    ctx.fillText('← → — идти  |  Space — прыжок  |  Прыжок сверху — победить врага  |  M — звук', 20, H - 15);
  }
}

function drawBossIntro() {
  const alpha = Math.min(1, bossIntroTimer / 30);
  ctx.fillStyle = `rgba(0,0,0,${0.75 * alpha})`;
  ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, 300);
  glow.addColorStop(0, `rgba(255, 50, 50, ${0.3 * alpha})`);
  glow.addColorStop(1, 'rgba(255, 0, 0, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(W / 2, H / 2, 300, 0, Math.PI * 2);
  ctx.fill();

  ctx.textAlign = 'center';
  ctx.shadowColor = `rgba(255, 50, 50, ${alpha})`;
  ctx.shadowBlur = 40;
  ctx.fillStyle = `rgba(255, 50, 50, ${alpha})`;
  ctx.font = 'bold 72px sans-serif';
  ctx.fillText('ИРИНА', W / 2, H / 2 - 40);
  ctx.shadowBlur = 15;
  ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText('ХОЗЯЙКА СКЛАДА', W / 2, H / 2 + 20);
  ctx.shadowBlur = 0;
  ctx.fillStyle = `rgba(255, 200, 200, ${alpha * 0.8})`;
  ctx.font = '20px sans-serif';
  ctx.fillText('Готовься к бою...', W / 2, H / 2 + 70);
  ctx.textAlign = 'left';
  ctx.shadowColor = 'transparent';
}

function drawLevelComplete() {
  ctx.fillStyle = 'rgba(0,0,0,0.85)';
  ctx.fillRect(0, 0, W, H);
  ctx.textAlign = 'center';
  if (bossDefeated) {
    const glow = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, 400);
    glow.addColorStop(0, 'rgba(255, 215, 0, 0.2)');
    glow.addColorStop(1, 'rgba(255, 215, 0, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 30;
    const titleGrad = ctx.createLinearGradient(0, H / 2 - 80, 0, H / 2 - 10);
    titleGrad.addColorStop(0, '#fff8b0');
    titleGrad.addColorStop(1, '#ffd700');
    ctx.fillStyle = titleGrad;
    ctx.font = 'bold 72px sans-serif';
    ctx.fillText('ПОБЕДА!', W / 2, H / 2 - 40);
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('Ирина побеждена!', W / 2, H / 2 + 20);
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText('Итоговый счёт: ' + player.score, W / 2, H / 2 + 80);
    if (stateTimer > 120) {
      const blink = Math.sin(stateTimer * 0.1) * 0.5 + 0.5;
      ctx.fillStyle = `rgba(255, 215, 0, ${0.5 + blink * 0.5})`;
      ctx.font = '20px sans-serif';
      ctx.fillText('Нажмите ПРОБЕЛ для рестарта', W / 2, H / 2 + 140);
    }
  } else {
    ctx.fillStyle = '#2ecc71';
    ctx.font = 'bold 56px sans-serif';
    ctx.fillText('УРОВЕНЬ ПРОЙДЕН!', W / 2, H / 2 - 20);
    ctx.fillStyle = '#fff';
    ctx.font = '24px sans-serif';
    ctx.fillText('Очки: ' + player.score, W / 2, H / 2 + 30);
  }
  ctx.textAlign = 'left';
}

function drawGameOver() {
  ctx.fillStyle = 'rgba(0,0,0,0.85)';
  ctx.fillRect(0, 0, W, H);
  ctx.textAlign = 'center';
  const glow = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, 350);
  glow.addColorStop(0, 'rgba(255, 0, 0, 0.2)');
  glow.addColorStop(1, 'rgba(255, 0, 0, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  ctx.shadowColor = '#e63946';
  ctx.shadowBlur = 30;
  ctx.fillStyle = '#e63946';
  ctx.font = 'bold 64px sans-serif';
  ctx.fillText('GAME OVER', W / 2, H / 2 - 40);
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#fff';
  ctx.font = '28px sans-serif';
  ctx.fillText('Итоговый счёт: ' + player.score, W / 2, H / 2 + 20);
  if (stateTimer > 120) {
    const blink = Math.sin(stateTimer * 0.1) * 0.5 + 0.5;
    ctx.fillStyle = `rgba(255, 215, 0, ${0.5 + blink * 0.5})`;
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('Нажмите ПРОБЕЛ для рестарта', W / 2, H / 2 + 80);
  }
  ctx.textAlign = 'left';
}
