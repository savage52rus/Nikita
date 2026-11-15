function drawOctopus(o, time) {
  if (o.taken) return;
  const pulse = Math.sin(time * 0.005 + o.phase) * 0.15 + 1;
  const r = o.r * pulse * 1.2; // Чуть увеличим для лучшей детализации

  ctx.save();
  ctx.translate(o.x, o.y);

  // === МЯГКОЕ СВЕЧЕНИЕ ===
  const glow1 = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 4);
  glow1.addColorStop(0, 'rgba(200, 100, 255, 0.6)');
  glow1.addColorStop(0.3, 'rgba(180, 80, 255, 0.3)');
  glow1.addColorStop(0.7, 'rgba(140, 40, 200, 0.1)');
  glow1.addColorStop(1, 'rgba(100, 0, 180, 0)');
  ctx.fillStyle = glow1;
  ctx.beginPath();
  ctx.arc(0, 0, r * 4, 0, Math.PI * 2);
  ctx.fill();

  const glow2 = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 2);
  glow2.addColorStop(0, 'rgba(255, 180, 255, 0.8)');
  glow2.addColorStop(1, 'rgba(180, 80, 255, 0)');
  ctx.fillStyle = glow2;
  ctx.beginPath();
  ctx.arc(0, 0, r * 2, 0, Math.PI * 2);
  ctx.fill();

  // === ЩУПАЛЬЦА ===
  ctx.lineCap = 'round';
  const tentacleCount = 8; // У реальных осьминогов 8 щупалец

  for (let i = 0; i < tentacleCount; i++) {
    const baseAngle = (i / tentacleCount) * Math.PI * 2 + Math.PI / 2;
    const wave = Math.sin(time * 0.008 + o.tentaclePhase + i * 0.7) * 0.4;
    const length = r * 2.2;
    
    // Конечная точка закручивания (спираль)
    const endAngle = baseAngle + wave;
    const endX = Math.cos(endAngle) * length;
    const endY = Math.sin(endAngle) * length + r * 0.2;

    // Рисуем щупальце как закрученную кривую
    ctx.beginPath();
    ctx.moveTo(Math.cos(baseAngle) * r * 0.4, Math.sin(baseAngle) * r * 0.4);
    
    // Контрольные точки для изгиба
    const ctrl1X = Math.cos(baseAngle + 0.5) * length * 0.6;
    const ctrl1Y = Math.sin(baseAngle + 0.5) * length * 0.6 + r * 0.4;
    
    const ctrl2X = Math.cos(endAngle + 0.3) * length * 0.9;
    const ctrl2Y = Math.sin(endAngle + 0.3) * length * 0.9 + r * 0.4;

    ctx.bezierCurveTo(ctrl1X, ctrl1Y, ctrl2X, ctrl2Y, endX, endY);

    // Градиент для щупальца (переход от фиолетового к розовому)
    const tentGrad = ctx.createLinearGradient(0, 0, endX, endY);
    tentGrad.addColorStop(0, '#d67bff');
    tentGrad.addColorStop(1, '#ffb0e0');
    
    ctx.strokeStyle = tentGrad;
    ctx.lineWidth = r * 0.35; // Делаем толще
    ctx.stroke();

    // Присоски (маленькие кружки вдоль щупальца)
    // Рисуем несколько присосок вдоль кривой (приблизительно)
    for (let j = 0.2; j <= 1; j += 0.2) {
      // Упрощённая аппроксимация положения присосок
      const t = j;
      // Формула кубической кривой Безье для точек
      const x = Math.pow(1 - t, 3) * Math.cos(baseAngle) * r * 0.4 +
                3 * Math.pow(1 - t, 2) * t * ctrl1X +
                3 * (1 - t) * Math.pow(t, 2) * ctrl2X +
                Math.pow(t, 3) * endX;
      const y = Math.pow(1 - t, 3) * Math.sin(baseAngle) * r * 0.4 +
                3 * Math.pow(1 - t, 2) * t * ctrl1Y +
                3 * (1 - t) * Math.pow(t, 2) * ctrl2Y +
                Math.pow(t, 3) * endY;
      
      ctx.fillStyle = 'rgba(255, 220, 240, 0.8)';
      ctx.beginPath();
      ctx.arc(x, y, r * 0.05, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // === ТЕЛО (ГОЛОВА) ===
  // Форма тела более округлая, сплюснутая сверху
  const bodyGrad = ctx.createRadialGradient(-r * 0.3, -r * 0.4, 0, 0, 0, r * 1.2);
  bodyGrad.addColorStop(0, '#f0c0ff'); // Светло-розовый
  bodyGrad.addColorStop(0.3, '#e88bff');
  bodyGrad.addColorStop(0.7, '#b040e0');
  bodyGrad.addColorStop(1, '#6a1090');
  
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.ellipse(0, -r * 0.3, r * 1.0, r * 1.2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Влажный блик (влажная поверхность)
  const highlight = ctx.createRadialGradient(-r * 0.4, -r * 0.6, 0, -r * 0.4, -r * 0.6, r * 0.6);
  highlight.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
  highlight.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)');
  highlight.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = highlight;
  ctx.beginPath();
  ctx.ellipse(-r * 0.4, -r * 0.6, r * 0.4, r * 0.5, -0.3, 0, Math.PI * 2);
  ctx.fill();

  // === ГЛАЗА (большие, кавайные) ===
  // Левый глаз
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(-r * 0.35, -r * 0.25, r * 0.3, 0, Math.PI * 2);
  ctx.fill();
  // Зрачок
  ctx.fillStyle = '#1a0030';
  ctx.beginPath();
  ctx.arc(-r * 0.35, -r * 0.2, r * 0.16, 0, Math.PI * 2);
  ctx.fill();
  // Блики
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(-r * 0.38, -r * 0.28, r * 0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-r * 0.28, -r * 0.15, r * 0.03, 0, Math.PI * 2);
  ctx.fill();

  // Правый глаз
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(r * 0.35, -r * 0.25, r * 0.3, 0, Math.PI * 2);
  ctx.fill();
  // Зрачок
  ctx.fillStyle = '#1a0030';
  ctx.beginPath();
  ctx.arc(r * 0.35, -r * 0.2, r * 0.16, 0, Math.PI * 2);
  ctx.fill();
  // Блики
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(r * 0.32, -r * 0.28, r * 0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(r * 0.42, -r * 0.15, r * 0.03, 0, Math.PI * 2);
  ctx.fill();

  // === РОТ (улыбка) ===
  ctx.strokeStyle = '#4a0060';
  ctx.lineWidth = r * 0.08;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(0, -r * 0.05, r * 0.15, 0.2, Math.PI - 0.2);
  ctx.stroke();

  // Брови (милые, как у референса)
  ctx.strokeStyle = '#4a0060';
  ctx.lineWidth = r * 0.06;
  ctx.beginPath();
  ctx.arc(-r * 0.5, -r * 0.45, r * 0.15, Math.PI + 0.3, -0.3);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(r * 0.5, -r * 0.45, r * 0.15, Math.PI + 0.3, -0.3);
  ctx.stroke();

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