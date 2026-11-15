let startButton = { x: W - 280, y: H - 100, w: 240, h: 60, hover: false };
let menuTime = 0;

function drawMenu(time) {
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#0a0518');
  grad.addColorStop(0.4, '#1a0a2e');
  grad.addColorStop(0.7, '#2d1b4e');
  grad.addColorStop(1, '#050510');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  for (let i = 0; i < 80; i++) {
    const sx = (i * 137 + 50) % W;
    const sy = (i * 83 + 30) % H;
    const twinkle = Math.sin(time * 0.002 + i) * 0.5 + 0.5;
    const size = 0.5 + twinkle * 1.5;
    ctx.fillStyle = `rgba(220, 180, 255, ${0.2 + twinkle * 0.7})`;
    ctx.beginPath();
    ctx.arc(sx, sy, size, 0, Math.PI * 2);
    ctx.fill();
    if (twinkle > 0.7) {
      const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, 8);
      sg.addColorStop(0, 'rgba(220, 180, 255, 0.4)');
      sg.addColorStop(1, 'rgba(220, 180, 255, 0)');
      ctx.fillStyle = sg;
      ctx.beginPath();
      ctx.arc(sx, sy, 8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const nebula1 = ctx.createRadialGradient(W * 0.2, H * 0.3, 0, W * 0.2, H * 0.3, 350);
  nebula1.addColorStop(0, 'rgba(150, 50, 200, 0.25)');
  nebula1.addColorStop(1, 'rgba(50, 0, 100, 0)');
  ctx.fillStyle = nebula1;
  ctx.beginPath();
  ctx.arc(W * 0.2, H * 0.3, 350, 0, Math.PI * 2);
  ctx.fill();

  const nebula2 = ctx.createRadialGradient(W * 0.8, H * 0.7, 0, W * 0.8, H * 0.7, 300);
  nebula2.addColorStop(0, 'rgba(100, 50, 200, 0.25)');
  nebula2.addColorStop(1, 'rgba(30, 0, 80, 0)');
  ctx.fillStyle = nebula2;
  ctx.beginPath();
  ctx.arc(W * 0.8, H * 0.7, 300, 0, Math.PI * 2);
  ctx.fill();

  const titleGlow = Math.sin(time * 0.003) * 0.3 + 0.7;
  ctx.save();
  ctx.textAlign = 'center';
  ctx.shadowColor = `rgba(180, 100, 255, ${titleGlow})`;
  ctx.shadowBlur = 40;
  const titleGrad = ctx.createLinearGradient(0, 50, 0, 170);
  titleGrad.addColorStop(0, '#fff8b0');
  titleGrad.addColorStop(0.5, '#ffd700');
  titleGrad.addColorStop(1, '#ff6b9d');
  ctx.fillStyle = titleGrad;
  ctx.font = 'bold 52px sans-serif';
  ctx.fillText('Никита.', W / 2, 90);
  ctx.fillText('Битва за смены', W / 2, 150);
  ctx.shadowBlur = 15;
  ctx.fillText('Никита.', W / 2, 90);
  ctx.fillText('Битва за смены', W / 2, 150);
  ctx.restore();

  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(200, 180, 255, 0.75)';
  ctx.font = 'italic 16px sans-serif';
  ctx.fillText('Приключение в 5 уровнях', W / 2, 185);

  const nikitaX = W * 0.35;
  const nikitaY = H * 0.42;
  const nikitaScale = 3.2;

  const floorGrad = ctx.createRadialGradient(nikitaX, nikitaY + 200, 0, nikitaX, nikitaY + 200, 250);
  floorGrad.addColorStop(0, 'rgba(150, 80, 255, 0.35)');
  floorGrad.addColorStop(0.5, 'rgba(100, 40, 200, 0.15)');
  floorGrad.addColorStop(1, 'rgba(50, 0, 100, 0)');
  ctx.fillStyle = floorGrad;
  ctx.beginPath();
  ctx.ellipse(nikitaX, nikitaY + 200, 250, 60, 0, 0, Math.PI * 2);
  ctx.fill();

  const menuPlayer = {
    x: nikitaX - 15, y: nikitaY - 100, w: 30, h: 64,
    vx: 0, vy: 0, onGround: true, facing: 1,
    walkTime: 0, landTime: 0, invuln: 0, powerTimer: 0
  };
  drawCharacter(menuPlayer, nikitaScale, nikitaX, nikitaY + 200, true);

  const octoX = nikitaX + 38;
  const octoY = nikitaY - 115;
  const octoPulse = Math.sin(time * 0.005) * 0.15 + 1;
  const octoR = 22 * octoPulse;

  const octoGlow = ctx.createRadialGradient(octoX, octoY, 0, octoX, octoY, octoR * 4);
  octoGlow.addColorStop(0, 'rgba(200, 100, 255, 0.6)');
  octoGlow.addColorStop(0.4, 'rgba(160, 60, 230, 0.25)');
  octoGlow.addColorStop(1, 'rgba(100, 20, 180, 0)');
  ctx.fillStyle = octoGlow;
  ctx.beginPath();
  ctx.arc(octoX, octoY, octoR * 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.lineCap = 'round';
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 + Math.PI / 2;
    const wave = Math.sin(time * 0.008 + i * 0.8) * 0.5;
    const tx = octoX + Math.cos(angle + wave * 0.3) * octoR * 1.9;
    const ty = octoY + Math.sin(angle + wave * 0.3) * octoR * 1.9 + octoR * 0.3;
    const tentGrad = ctx.createLinearGradient(octoX, octoY, tx, ty);
    tentGrad.addColorStop(0, '#d67bff');
    tentGrad.addColorStop(1, '#8a30c0');
    ctx.strokeStyle = tentGrad;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(octoX + Math.cos(angle) * octoR * 0.6, octoY + Math.sin(angle) * octoR * 0.6);
    ctx.quadraticCurveTo(
      octoX + Math.cos(angle) * octoR * 1.2 + Math.sin(wave) * 4,
      octoY + Math.sin(angle) * octoR * 1.2,
      tx, ty
    );
    ctx.stroke();
    ctx.fillStyle = '#f0c0ff';
    ctx.beginPath();
    ctx.arc(tx, ty, 2.2, 0, Math.PI * 2);
    ctx.fill();
    const tipGlow = ctx.createRadialGradient(tx, ty, 0, tx, ty, 6);
    tipGlow.addColorStop(0, 'rgba(255, 200, 255, 0.8)');
    tipGlow.addColorStop(1, 'rgba(255, 200, 255, 0)');
    ctx.fillStyle = tipGlow;
    ctx.beginPath();
    ctx.arc(tx, ty, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  const bodyGrad = ctx.createRadialGradient(octoX - octoR * 0.35, octoY - octoR * 0.4, 0, octoX, octoY, octoR * 1.3);
  bodyGrad.addColorStop(0, '#e88bff');
  bodyGrad.addColorStop(0.4, '#b040e0');
  bodyGrad.addColorStop(0.8, '#6a1090');
  bodyGrad.addColorStop(1, '#3a0050');
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.ellipse(octoX, octoY - octoR * 0.2, octoR * 0.9, octoR * 1.1, 0, 0, Math.PI * 2);
  ctx.fill();

  const hl = ctx.createRadialGradient(octoX - octoR * 0.4, octoY - octoR * 0.6, 0, octoX - octoR * 0.4, octoY - octoR * 0.6, octoR * 0.5);
  hl.addColorStop(0, 'rgba(255, 230, 255, 0.85)');
  hl.addColorStop(1, 'rgba(255, 230, 255, 0)');
  ctx.fillStyle = hl;
  ctx.beginPath();
  ctx.ellipse(octoX - octoR * 0.4, octoY - octoR * 0.6, octoR * 0.35, octoR * 0.45, -0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(octoX - octoR * 0.35, octoY - octoR * 0.15, octoR * 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(octoX + octoR * 0.35, octoY - octoR * 0.15, octoR * 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1a0030';
  ctx.beginPath();
  ctx.arc(octoX - octoR * 0.35, octoY - octoR * 0.1, octoR * 0.16, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(octoX + octoR * 0.35, octoY - octoR * 0.1, octoR * 0.16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(octoX - octoR * 0.3, octoY - octoR * 0.15, octoR * 0.07, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(octoX + octoR * 0.4, octoY - octoR * 0.15, octoR * 0.07, 0, Math.PI * 2);
  ctx.fill();

  const nikitaZone = { x: nikitaX - 100, y: nikitaY - 100, w: 200, h: 250 };
  const isHovering = mouse.x >= nikitaZone.x && mouse.x <= nikitaZone.x + nikitaZone.w &&
                     mouse.y >= nikitaZone.y && mouse.y <= nikitaZone.y + nikitaZone.h;

  if (isHovering && !lastHoverState) playTone(700, 0.08, 'sine', 0.08, 900);
  lastHoverState = isHovering;

  if (isHovering) {
    const bubbleX = nikitaX + 90;
    const bubbleY = nikitaY - 170;
    const bubbleW = 190;
    const bubbleH = 75;

    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    roundRect(ctx, bubbleX + 6, bubbleY + 6, bubbleW, bubbleH, 22);
    ctx.fill();

    const bubbleGrad = ctx.createLinearGradient(bubbleX, bubbleY, bubbleX, bubbleY + bubbleH);
    bubbleGrad.addColorStop(0, '#ffffff');
    bubbleGrad.addColorStop(1, '#e8d8ff');
    ctx.fillStyle = bubbleGrad;
    roundRect(ctx, bubbleX, bubbleY, bubbleW, bubbleH, 22);
    ctx.fill();

    const borderGrad = ctx.createLinearGradient(bubbleX, bubbleY, bubbleX + bubbleW, bubbleY + bubbleH);
    borderGrad.addColorStop(0, '#d0a8ff');
    borderGrad.addColorStop(1, '#b86bff');
    ctx.strokeStyle = borderGrad;
    ctx.lineWidth = 3;
    roundRect(ctx, bubbleX, bubbleY, bubbleW, bubbleH, 22);
    ctx.stroke();

    ctx.fillStyle = '#e8d8ff';
    ctx.beginPath();
    ctx.moveTo(bubbleX + 10, bubbleY + bubbleH - 18);
    ctx.lineTo(bubbleX - 22, bubbleY + bubbleH + 12);
    ctx.lineTo(bubbleX + 25, bubbleY + bubbleH - 15);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#b86bff';
    ctx.beginPath();
    ctx.moveTo(bubbleX + 10, bubbleY + bubbleH - 18);
    ctx.lineTo(bubbleX - 22, bubbleY + bubbleH + 12);
    ctx.lineTo(bubbleX + 25, bubbleY + bubbleH - 15);
    ctx.stroke();

    ctx.fillStyle = '#2d1b4e';
    ctx.font = 'bold 30px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Осуждаю!', bubbleX + bubbleW / 2, bubbleY + bubbleH / 2 + 11);
    ctx.textAlign = 'left';
    ctx.restore();
  }

  const btn = startButton;
  const btnHover = mouse.x >= btn.x && mouse.x <= btn.x + btn.w &&
                   mouse.y >= btn.y && mouse.y <= btn.y + btn.h;
  if (btnHover && !btn.hover) sfx.buttonHover();
  btn.hover = btnHover;

  const btnPulse = Math.sin(time * 0.005) * 0.04 + 1;
  ctx.save();
  ctx.translate(btn.x + btn.w / 2, btn.y + btn.h / 2);
  ctx.scale(btnPulse, btnPulse);
  ctx.translate(-(btn.x + btn.w / 2), -(btn.y + btn.h / 2));

  if (btnHover) {
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 40;
  } else {
    ctx.shadowColor = 'rgba(180, 100, 255, 0.7)';
    ctx.shadowBlur = 25;
  }

  const btnGrad = ctx.createLinearGradient(btn.x, btn.y, btn.x, btn.y + btn.h);
  if (btnHover) {
    btnGrad.addColorStop(0, '#fff8b0');
    btnGrad.addColorStop(0.5, '#ffd700');
    btnGrad.addColorStop(1, '#ff8c00');
  } else {
    btnGrad.addColorStop(0, '#a86bff');
    btnGrad.addColorStop(0.5, '#8b3fc7');
    btnGrad.addColorStop(1, '#5a1a8a');
  }
  ctx.fillStyle = btnGrad;
  roundRect(ctx, btn.x, btn.y, btn.w, btn.h, 14);
  ctx.fill();

  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  roundRect(ctx, btn.x + 4, btn.y + 4, btn.w - 8, btn.h / 2 - 4, 10);
  ctx.fill();

  ctx.strokeStyle = btnHover ? '#fff' : 'rgba(255,255,255,0.6)';
  ctx.lineWidth = 2;
  roundRect(ctx, btn.x, btn.y, btn.w, btn.h, 14);
  ctx.stroke();

  ctx.fillStyle = btnHover ? '#1a0a2e' : '#fff';
  ctx.font = 'bold 22px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Биться за смены', btn.x + btn.w / 2, btn.y + btn.h / 2);

  ctx.restore();
  ctx.textBaseline = 'alphabetic';
  ctx.shadowBlur = 0;
  ctx.shadowColor = 'transparent';

  ctx.fillStyle = 'rgba(200, 180, 255, 0.5)';
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Наведи на Никиту', W / 2, H - 20);
  ctx.textAlign = 'left';

  if (mouse.isDown && btnHover) {
    mouse.isDown = false;
    startGame();
  }
}
