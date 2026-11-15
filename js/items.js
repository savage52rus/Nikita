function drawOctopus(o, time) {
  if (o.taken) return;
  const pulse = Math.sin(time * 0.005 + o.phase) * 0.15 + 1;
  const r = o.r * pulse;
  ctx.save();
  ctx.translate(o.x, o.y);

  const glow1 = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 4.5);
  glow1.addColorStop(0, 'rgba(200, 100, 255, 0.5)');
  glow1.addColorStop(0.3, 'rgba(160, 60, 230, 0.25)');
  glow1.addColorStop(0.7, 'rgba(100, 20, 180, 0.08)');
  glow1.addColorStop(1, 'rgba(60, 0, 120, 0)');
  ctx.fillStyle = glow1;
  ctx.beginPath();
  ctx.arc(0, 0, r * 4.5, 0, Math.PI * 2);
  ctx.fill();

  const glow2 = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 2.2);
  glow2.addColorStop(0, 'rgba(220, 140, 255, 0.6)');
  glow2.addColorStop(1, 'rgba(150, 50, 230, 0)');
  ctx.fillStyle = glow2;
  ctx.beginPath();
  ctx.arc(0, 0, r * 2.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.lineCap = 'round';
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 + Math.PI / 2;
    const wave = Math.sin(time * 0.01 + o.tentaclePhase + i * 0.8) * 0.5;
    const tx = Math.cos(angle + wave * 0.3) * r * 1.8;
    const ty = Math.sin(angle + wave * 0.3) * r * 1.8 + r * 0.3;
    const tentGrad = ctx.createLinearGradient(0, 0, tx, ty);
    tentGrad.addColorStop(0, '#d67bff');
    tentGrad.addColorStop(1, '#8a30c0');
    ctx.strokeStyle = tentGrad;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * r * 0.6, Math.sin(angle) * r * 0.6);
    ctx.quadraticCurveTo(
      Math.cos(angle) * r * 1.2 + Math.sin(wave) * 3,
      Math.sin(angle) * r * 1.2,
      tx, ty
    );
    ctx.stroke();
    ctx.fillStyle = '#f0c0ff';
    ctx.beginPath();
    ctx.arc(tx, ty, 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 200, 255, 0.6)';
    ctx.beginPath();
    ctx.arc(tx, ty, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  const bodyGrad = ctx.createRadialGradient(-r * 0.35, -r * 0.4, 0, 0, 0, r * 1.3);
  bodyGrad.addColorStop(0, '#e88bff');
  bodyGrad.addColorStop(0.4, '#b040e0');
  bodyGrad.addColorStop(0.8, '#6a1090');
  bodyGrad.addColorStop(1, '#3a0050');
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.ellipse(0, -r * 0.2, r * 0.9, r * 1.1, 0, 0, Math.PI * 2);
  ctx.fill();

  const highlight = ctx.createRadialGradient(-r * 0.4, -r * 0.6, 0, -r * 0.4, -r * 0.6, r * 0.5);
  highlight.addColorStop(0, 'rgba(255, 230, 255, 0.8)');
  highlight.addColorStop(1, 'rgba(255, 230, 255, 0)');
  ctx.fillStyle = highlight;
  ctx.beginPath();
  ctx.ellipse(-r * 0.4, -r * 0.6, r * 0.35, r * 0.45, -0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(-r * 0.35, -r * 0.15, r * 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(r * 0.35, -r * 0.15, r * 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1a0030';
  ctx.beginPath();
  ctx.arc(-r * 0.35, -r * 0.1, r * 0.16, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(r * 0.35, -r * 0.1, r * 0.16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(-r * 0.3, -r * 0.15, r * 0.07, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(r * 0.4, -r * 0.15, r * 0.07, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawGoldenPower(gp, time) {
  if (!gp || gp.taken) return;
  const pulse = Math.sin(time * 0.004 + gp.phase) * 0.15 + 1;
  const r = gp.r * pulse;
  ctx.save();
  ctx.translate(gp.x, gp.y);

  const glow1 = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 5);
  glow1.addColorStop(0, 'rgba(255, 220, 50, 0.6)');
  glow1.addColorStop(0.3, 'rgba(255, 180, 0, 0.3)');
  glow1.addColorStop(0.6, 'rgba(255, 120, 0, 0.1)');
  glow1.addColorStop(1, 'rgba(200, 80, 0, 0)');
  ctx.fillStyle = glow1;
  ctx.beginPath();
  ctx.arc(0, 0, r * 5, 0, Math.PI * 2);
  ctx.fill();

  const wobble = Math.sin(time * 0.003 + gp.phase) * 0.15;
  ctx.rotate(wobble);

  ctx.save();
  ctx.translate(r * 0.3, 0);
  ctx.rotate(0.2);
  const handleGrad = ctx.createLinearGradient(-2, 0, 2, 0);
  handleGrad.addColorStop(0, '#5a2a0a');
  handleGrad.addColorStop(0.5, '#a06030');
  handleGrad.addColorStop(1, '#5a2a0a');
  ctx.fillStyle = handleGrad;
  ctx.fillRect(-2, -r * 0.5, 4, r * 1.1);
  const headGrad = ctx.createLinearGradient(-r * 0.4, -r * 0.5, r * 0.4, -r * 0.1);
  headGrad.addColorStop(0, '#fff8b0');
  headGrad.addColorStop(0.5, '#ffd700');
  headGrad.addColorStop(1, '#b8860b');
  ctx.fillStyle = headGrad;
  roundRect(ctx, -r * 0.4, -r * 0.5, r * 0.8, r * 0.4, 3);
  ctx.fill();
  ctx.strokeStyle = '#8b6914';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.fillRect(-r * 0.3, -r * 0.45, r * 0.5, 3);
  ctx.restore();

  ctx.save();
  ctx.translate(-r * 0.35, 0);
  ctx.rotate(-0.2);
  ctx.fillStyle = handleGrad;
  ctx.fillRect(-2, -r * 0.2, 4, r * 0.9);
  const bladeGrad = ctx.createLinearGradient(0, -r * 0.7, r * 0.5, 0);
  bladeGrad.addColorStop(0, '#fff8b0');
  bladeGrad.addColorStop(0.5, '#ffd700');
  bladeGrad.addColorStop(1, '#b8860b');
  ctx.fillStyle = bladeGrad;
  ctx.strokeStyle = '#8b6914';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.2);
  ctx.quadraticCurveTo(r * 0.7, -r * 0.7, r * 0.3, -r * 0.1);
  ctx.quadraticCurveTo(r * 0.5, -r * 0.4, 0, -r * 0.05);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(r * 0.1, -r * 0.3);
  ctx.quadraticCurveTo(r * 0.4, -r * 0.5, r * 0.25, -r * 0.2);
  ctx.stroke();
  ctx.restore();

  for (let i = 0; i < 6; i++) {
    const ang = time * 0.002 + i * Math.PI / 3;
    const dist = r * 1.8 + Math.sin(time * 0.005 + i) * 5;
    ctx.fillStyle = `rgba(255, 240, 150, ${0.5 + Math.sin(time * 0.008 + i) * 0.5})`;
    ctx.beginPath();
    ctx.arc(Math.cos(ang) * dist, Math.sin(ang) * dist, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawFlyingHammer(h, time) {
  ctx.save();
  ctx.translate(h.x, h.y);
  ctx.rotate(h.rotation);
  const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, 35);
  glow.addColorStop(0, 'rgba(255, 220, 50, 0.7)');
  glow.addColorStop(0.5, 'rgba(255, 180, 0, 0.3)');
  glow.addColorStop(1, 'rgba(200, 120, 0, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, 35, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#6a3a1a';
  ctx.fillRect(-2, -2, 4, 22);
  const headGrad = ctx.createLinearGradient(-10, -12, 10, 2);
  headGrad.addColorStop(0, '#fff8b0');
  headGrad.addColorStop(0.5, '#ffd700');
  headGrad.addColorStop(1, '#b8860b');
  ctx.fillStyle = headGrad;
  roundRect(ctx, -10, -12, 20, 14, 3);
  ctx.fill();
  ctx.strokeStyle = '#8b6914';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.fillRect(-7, -10, 12, 3);
  ctx.restore();

  for (let i = 1; i <= 4; i++) {
    ctx.fillStyle = `rgba(255, 215, 0, ${0.6 - i * 0.15})`;
    ctx.beginPath();
    ctx.arc(h.x - h.vx * i * 2, h.y - h.vy * i * 2, 5 - i, 0, Math.PI * 2);
    ctx.fill();
  }
}
