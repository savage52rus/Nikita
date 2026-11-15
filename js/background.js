function drawBackground() {
  const time = globalTime;

  if (currentLevel >= 3) {
    // ... (оставим фон склада без изменений, он уже хорош, но можно добавить пыли) ...
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    if (currentLevel === 4) {
      grad.addColorStop(0, '#0a0a15'); grad.addColorStop(0.5, '#151520'); grad.addColorStop(1, '#0a0a15');
    } else {
      grad.addColorStop(0, '#1a1a22'); grad.addColorStop(0.5, '#2a2a35'); grad.addColorStop(1, '#151520');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    const fogGrad = ctx.createLinearGradient(0, H * 0.3, 0, H);
    fogGrad.addColorStop(0, 'rgba(40, 40, 60, 0)');
    fogGrad.addColorStop(1, 'rgba(40, 40, 60, 0.4)');
    ctx.fillStyle = fogGrad;
    ctx.fillRect(0, 0, W, H);

    const bgOff = camera.x * 0.2;
    for (let i = 0; i < 20; i++) {
      const bx = (i * 220 - bgOff % 220) - 100;
      const wallGrad = ctx.createLinearGradient(bx, 0, bx + 180, 0);
      wallGrad.addColorStop(0, '#1e1e26'); wallGrad.addColorStop(0.5, '#2a2a35'); wallGrad.addColorStop(1, '#1e1e26');
      ctx.fillStyle = wallGrad;
      ctx.fillRect(bx, 0, 180, H - 80);
      ctx.fillStyle = '#151520';
      ctx.fillRect(bx, 0, 8, H - 80); ctx.fillRect(bx + 172, 0, 8, H - 80);
      ctx.fillRect(bx, 40, 180, 10);
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      ctx.fillRect(bx + 2, 0, 2, H - 80);
    }

    const pipeOff = camera.x * 0.4;
    for (let i = 0; i < 15; i++) {
      const px = (i * 180 - pipeOff % 180) - 50;
      const pipeGrad = ctx.createLinearGradient(px, 0, px + 12, 0);
      pipeGrad.addColorStop(0, '#2a2a35'); pipeGrad.addColorStop(0.5, '#4a4a55'); pipeGrad.addColorStop(1, '#2a2a35');
      ctx.fillStyle = pipeGrad;
      ctx.fillRect(px, 80, 12, 300); ctx.fillRect(px, 80, 60, 12);
      ctx.fillStyle = '#5a5a65';
      ctx.fillRect(px - 2, 78, 16, 16); ctx.fillRect(px - 2, 78 + 300, 16, 16);
    }

    const lampOff = camera.x * 0.5;
    for (let i = 0; i < 20; i++) {
      const lx = (i * 160 - lampOff % 160) - 50;
      const flicker = Math.sin(time / 200 + i) > 0.3 ? 1 : 0.5;
      const isRed = currentLevel === 4;
      const lampGrad = ctx.createRadialGradient(lx, 60, 0, lx, 60, 60);
      lampGrad.addColorStop(0, isRed ? `rgba(255, 100, 100, ${0.4 * flicker})` : `rgba(255, 220, 100, ${0.4 * flicker})`);
      lampGrad.addColorStop(0.4, isRed ? `rgba(255, 50, 50, ${0.15 * flicker})` : `rgba(255, 180, 50, ${0.15 * flicker})`);
      lampGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = lampGrad;
      ctx.beginPath(); ctx.arc(lx, 60, 60, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = isRed ? `rgba(255, 200, 200, ${0.9 * flicker})` : `rgba(255, 240, 200, ${0.9 * flicker})`;
      ctx.beginPath(); ctx.arc(lx, 60, 6, 0, Math.PI * 2); ctx.fill();
    }

    for (let i = 0; i < 40; i++) {
      const dx = (i * 73 + time * 0.02) % W;
      const dy = (i * 47 + Math.sin(time * 0.001 + i) * 40) % H;
      ctx.fillStyle = `rgba(200, 200, 180, ${0.08 + Math.sin(time * 0.002 + i) * 0.05})`;
      ctx.beginPath(); ctx.arc(dx, dy, 1.5, 0, Math.PI * 2); ctx.fill();
    }
    return;
  }

  // Городской пейзаж (улучшен)
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#2a5a8a'); 
  grad.addColorStop(0.3, '#6bafd4');
  grad.addColorStop(0.7, '#b0e0e6');
  grad.addColorStop(1, '#e0f0f5');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Солнце с мягким объемом
  const sunX = W * 0.8, sunY = 100;
  const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 250);
  sunGlow.addColorStop(0, 'rgba(255, 255, 220, 0.9)');
  sunGlow.addColorStop(0.2, 'rgba(255, 240, 150, 0.6)');
  sunGlow.addColorStop(0.5, 'rgba(255, 220, 100, 0.2)');
  sunGlow.addColorStop(1, 'rgba(255, 240, 150, 0)');
  ctx.fillStyle = sunGlow;
  ctx.beginPath(); ctx.arc(sunX, sunY, 250, 0, Math.PI * 2); ctx.fill();
  
  ctx.fillStyle = '#fffbe0';
  ctx.beginPath(); ctx.arc(sunX, sunY, 40, 0, Math.PI * 2); ctx.fill();

  // Облака (3D-объем)
  for (let i = 0; i < 6; i++) {
    const cx = ((i * 300 + time * 0.01) % (W + 400)) - 200;
    const cy = 60 + i * 40;
    const cloudGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 80);
    cloudGrad.addColorStop(0, 'rgba(255,255,255,0.8)');
    cloudGrad.addColorStop(0.5, 'rgba(255,255,255,0.4)');
    cloudGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = cloudGrad;
    ctx.beginPath(); ctx.ellipse(cx, cy, 100, 35, 0, 0, Math.PI * 2); ctx.fill();
  }

  // Дальние здания (воздушная перспектива)
  ctx.fillStyle = '#9aabb8';
  const bgOff = camera.x * 0.15;
  for (let i = 0; i < 20; i++) {
    const bx = (i * 200 - bgOff % 200) - 100;
    const bh = 150 + (i * 37) % 120;
    const bldGrad = ctx.createLinearGradient(bx, H - 80 - bh, bx, H - 80);
    bldGrad.addColorStop(0, '#a0b0c0'); bldGrad.addColorStop(1, '#8090a0');
    ctx.fillStyle = bldGrad;
    ctx.fillRect(bx, H - 80 - bh, 130, bh);
  }
  
  // Ближние здания (с объемом и окнами)
  const midOff = camera.x * 0.4;
  for (let i = 0; i < 20; i++) {
    const bx = (i * 250 - midOff % 250) - 100;
    const bh = 120 + (i * 53) % 120;
    const bldGrad = ctx.createLinearGradient(bx, H - 80 - bh, bx, H - 80);
    bldGrad.addColorStop(0, '#4a5b6a'); bldGrad.addColorStop(1, '#2a3b4a');
    ctx.fillStyle = bldGrad;
    ctx.fillRect(bx, H - 80 - bh, 160, bh);
    
    // Окна (светящиеся с объемом)
    for (let wy = H - 70 - bh; wy < H - 90; wy += 25) {
      for (let wx = bx + 15; wx < bx + 145; wx += 30) {
        if ((wx + wy) % 7 < 4) {
          const winGrad = ctx.createRadialGradient(wx+6, wy+6, 0, wx+6, wy+6, 12);
          winGrad.addColorStop(0, '#fff8d0'); winGrad.addColorStop(0.5, '#ffd060'); winGrad.addColorStop(1, '#a06020');
          ctx.fillStyle = winGrad;
          ctx.fillRect(wx, wy, 12, 15);
        }
      }
    }
  }

  // Атмосферная дымка внизу
  const haze = ctx.createLinearGradient(0, H * 0.6, 0, H);
  haze.addColorStop(0, 'rgba(200, 220, 240, 0)');
  haze.addColorStop(1, 'rgba(200, 220, 240, 0.4)');
  ctx.fillStyle = haze;
  ctx.fillRect(0, 0, W, H);
}

// Платформы (без изменений, они хороши)
// ... функция drawPlatforms остается прежней ...

function applyPostProcessing() {
  // Виньетка
  const vignette = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.9);
  vignette.addColorStop(0, 'rgba(0,0,0,0)');
  vignette.addColorStop(1, 'rgba(0,0,0,0.45)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, W, H);

  // Цветокоррекция (легкая насыщенность)
  ctx.globalCompositeOperation = 'overlay';
  ctx.fillStyle = 'rgba(255, 200, 100, 0.05)';
  ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'source-over';

  if (player.powerTimer > 0) {
    ctx.fillStyle = 'rgba(255, 215, 0, 0.05)';
    ctx.fillRect(0, 0, W, H);
  }
  if (hitFlash > 0) {
    ctx.fillStyle = `rgba(255, 0, 0, ${hitFlash * 0.03})`;
    ctx.fillRect(0, 0, W, H);
  }
}