function drawEnemyGirl(e) {
  if (!e.alive) return;
  const { x, y, w, h, facing, walkTime, color, hair } = e;
  ctx.save();
  ctx.translate(x + w / 2, y + h);
  
  // Улучшенная тень
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 10;
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath(); ctx.ellipse(0, 4, 16, 5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  ctx.scale(facing, 1);
  const legSwing = Math.sin(walkTime) * 0.4;
  const armSwing = -Math.sin(walkTime) * 0.5;
  const bob = Math.abs(Math.sin(walkTime * 2)) * 1.2;
  ctx.translate(0, bob);
  const hh = h, bodyW = w * 0.9;

  const skinBase = '#fce5d4';
  const skinShadow = '#b08060';

  const drawLeg = (offsetX, angle) => {
    ctx.save();
    ctx.translate(offsetX, -hh * 0.45);
    ctx.rotate(angle);
    // Нога
    const skinGrad = ctx.createLinearGradient(-bodyW * 0.15, 0, bodyW * 0.15, 0);
    skinGrad.addColorStop(0, skinShadow); skinGrad.addColorStop(0.4, skinBase); skinGrad.addColorStop(1, skinShadow);
    ctx.fillStyle = skinGrad;
    roundRect(ctx, -bodyW * 0.15, 0, bodyW * 0.3, hh * 0.4, 4);
    ctx.fill();
    // Туфли
    const shoeGrad = ctx.createLinearGradient(0, hh * 0.35, 0, hh * 0.43);
    shoeGrad.addColorStop(0, '#e74c3c'); shoeGrad.addColorStop(1, '#500');
    ctx.fillStyle = shoeGrad;
    roundRect(ctx, -bodyW * 0.15 - 2, hh * 0.35, bodyW * 0.3 + 4, 8, 3);
    ctx.fill();
    ctx.restore();
  };
  ctx.globalAlpha = 0.9; drawLeg(-bodyW * 0.18, -legSwing);
  ctx.globalAlpha = 1; drawLeg(bodyW * 0.18, legSwing);

  // Юбка
  const skirtGrad = ctx.createLinearGradient(-bodyW * 0.4, -hh * 0.5, bodyW * 0.4, -hh * 0.38);
  skirtGrad.addColorStop(0, '#000'); skirtGrad.addColorStop(0.4, '#2a2a2a'); skirtGrad.addColorStop(1, '#000');
  ctx.fillStyle = skirtGrad;
  ctx.beginPath();
  ctx.moveTo(-bodyW * 0.35, -hh * 0.5); ctx.lineTo(bodyW * 0.35, -hh * 0.5);
  ctx.lineTo(bodyW * 0.45, -hh * 0.38); ctx.lineTo(-bodyW * 0.45, -hh * 0.38);
  ctx.closePath(); ctx.fill();

  // Торс (кожа)
  const skinGrad = ctx.createRadialGradient(0, -hh * 0.6, 0, 0, -hh * 0.6, 20);
  skinGrad.addColorStop(0, skinBase); skinGrad.addColorStop(1, skinShadow);
  ctx.fillStyle = skinGrad;
  ctx.beginPath();
  ctx.moveTo(-bodyW * 0.35, -hh * 0.75); ctx.lineTo(bodyW * 0.35, -hh * 0.75);
  ctx.lineTo(bodyW * 0.32, -hh * 0.5); ctx.lineTo(-bodyW * 0.32, -hh * 0.5);
  ctx.closePath(); ctx.fill();

  // Топик
  const topGrad = ctx.createLinearGradient(-bodyW * 0.35, -hh * 0.75, bodyW * 0.35, -hh * 0.62);
  topGrad.addColorStop(0, color); topGrad.addColorStop(0.5, shadeColor(color, 30)); topGrad.addColorStop(1, color);
  ctx.fillStyle = topGrad;
  ctx.beginPath();
  ctx.moveTo(-bodyW * 0.35, -hh * 0.75); ctx.lineTo(bodyW * 0.35, -hh * 0.75);
  ctx.lineTo(bodyW * 0.38, -hh * 0.62); ctx.lineTo(-bodyW * 0.38, -hh * 0.62);
  ctx.closePath(); ctx.fill();

  // Руки
  const drawArm = (offsetX, angle) => {
    ctx.save();
    ctx.translate(offsetX, -hh * 0.75);
    ctx.rotate(angle);
    const armGrad = ctx.createLinearGradient(-3, 0, 3, 0);
    armGrad.addColorStop(0, skinShadow); armGrad.addColorStop(0.5, skinBase); armGrad.addColorStop(1, skinShadow);
    ctx.fillStyle = armGrad;
    roundRect(ctx, -3, 0, 6, hh * 0.3, 4);
    ctx.fill();
    ctx.restore();
  };
  ctx.globalAlpha = 0.9; drawArm(-bodyW * 0.35, armSwing);
  ctx.globalAlpha = 1; drawArm(bodyW * 0.35, -armSwing);

  // Голова
  ctx.fillStyle = skinGrad;
  ctx.fillRect(-4, -hh * 0.85, 8, 6);
  const faceGrad = ctx.createRadialGradient(-3, -hh * 0.95, 0, 0, -hh * 0.92, 14);
  faceGrad.addColorStop(0, skinBase); faceGrad.addColorStop(1, skinShadow);
  ctx.fillStyle = faceGrad;
  ctx.beginPath(); ctx.ellipse(0, -hh * 0.92, 9, 11, 0, 0, Math.PI * 2); ctx.fill();

  // Волосы (объемные)
  const hairGrad = ctx.createLinearGradient(0, -hh * 1.1, 0, -hh * 0.7);
  hairGrad.addColorStop(0, shadeColor(hair, 40)); hairGrad.addColorStop(0.5, hair); hairGrad.addColorStop(1, shadeColor(hair, -40));
  ctx.fillStyle = hairGrad;
  ctx.beginPath(); ctx.ellipse(0, -hh * 1.0, 11, 10, 0, Math.PI, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-11, -hh * 0.98); ctx.quadraticCurveTo(-16, -hh * 0.8, -10, -hh * 0.7);
  ctx.lineTo(-8, -hh * 0.95); ctx.fill();
  ctx.beginPath(); ctx.moveTo(11, -hh * 0.98); ctx.quadraticCurveTo(16, -hh * 0.8, 10, -hh * 0.7);
  ctx.lineTo(8, -hh * 0.95); ctx.fill();
  
  // Блик на волосах
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.beginPath(); ctx.ellipse(-4, -hh * 1.04, 5, 2.5, -0.3, 0, Math.PI * 2); ctx.fill();

  // Глаза
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.ellipse(-3.5, -hh * 0.93, 2.5, 2, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(3.5, -hh * 0.93, 2.5, 2, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#1a1a2e';
  ctx.beginPath(); ctx.arc(-3, -hh * 0.93, 1.2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(4, -hh * 0.93, 1.2, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.beginPath(); ctx.arc(-2.7, -hh * 0.935, 0.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(4.3, -hh * 0.935, 0.5, 0, Math.PI * 2); ctx.fill();

  ctx.restore();
}

function drawBoss(b, time) {
  if (!b || b.hp <= 0) return;
  const { x, y, w, h, facing, walkTime, hitFlash } = b;
  ctx.save();
  ctx.translate(x + w / 2, y + h);
  
  // Объемная тень
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.6)';
  ctx.shadowBlur = 15;
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.beginPath(); ctx.ellipse(0, 5, 24, 7, 0, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  if (b.phase === 2) {
    const auraR = 100 + Math.sin(time / 100) * 15;
    const aura = ctx.createRadialGradient(0, -h / 2, 10, 0, -h / 2, auraR);
    aura.addColorStop(0, 'rgba(255, 50, 50, 0.4)');
    aura.addColorStop(0.5, 'rgba(255, 20, 20, 0.15)');
    aura.addColorStop(1, 'rgba(200, 0, 0, 0)');
    ctx.fillStyle = aura;
    ctx.beginPath(); ctx.arc(0, -h / 2, auraR, 0, Math.PI * 2); ctx.fill();
  }

  ctx.scale(facing, 1);
  if (hitFlash > 0) ctx.globalAlpha = 0.5 + Math.sin(hitFlash * 0.5) * 0.5;
  const legSwing = Math.sin(walkTime) * 0.4;
  const armSwing = -Math.sin(walkTime) * 0.5;
  const bob = Math.abs(Math.sin(walkTime * 2)) * 1.5;
  ctx.translate(0, bob);
  const hh = h, bodyW = w * 0.9;
  const skinBase = hitFlash > 0 ? '#ff8888' : '#fce5d4';
  const skinShadow = hitFlash > 0 ? '#ff6666' : '#b08060';
  const topColor = hitFlash > 0 ? '#ff8888' : '#e74c3c';

  const drawLeg = (offsetX, angle) => {
    ctx.save();
    ctx.translate(offsetX, -hh * 0.45);
    ctx.rotate(angle);
    const legGrad = ctx.createLinearGradient(-bodyW * 0.15, 0, bodyW * 0.15, 0);
    legGrad.addColorStop(0, skinShadow); legGrad.addColorStop(0.5, skinBase); legGrad.addColorStop(1, skinShadow);
    ctx.fillStyle = legGrad;
    roundRect(ctx, -bodyW * 0.15, 0, bodyW * 0.3, hh * 0.35, 4);
    ctx.fill();
    // Сапоги
    const bootGrad = ctx.createLinearGradient(0, hh * 0.2, 0, hh * 0.48);
    bootGrad.addColorStop(0, '#3a3a3a'); bootGrad.addColorStop(1, '#000');
    ctx.fillStyle = bootGrad;
    roundRect(ctx, -bodyW * 0.16, hh * 0.2, bodyW * 0.32, hh * 0.28, 4);
    ctx.fill();
    // Блик на сапоге
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    roundRect(ctx, -bodyW * 0.14, hh * 0.22, 3, hh * 0.2, 2);
    ctx.fill();
    ctx.restore();
  };
  ctx.globalAlpha *= 0.9;
  drawLeg(-bodyW * 0.18, -legSwing);
  ctx.globalAlpha /= 0.9;
  drawLeg(bodyW * 0.18, legSwing);

  // Юбка
  const skirtGrad = ctx.createLinearGradient(-bodyW * 0.48, -hh * 0.5, bodyW * 0.48, -hh * 0.36);
  skirtGrad.addColorStop(0, '#000'); skirtGrad.addColorStop(0.4, '#2a2a2a'); skirtGrad.addColorStop(1, '#000');
  ctx.fillStyle = skirtGrad;
  ctx.beginPath();
  ctx.moveTo(-bodyW * 0.35, -hh * 0.5); ctx.lineTo(bodyW * 0.35, -hh * 0.5);
  ctx.lineTo(bodyW * 0.48, -hh * 0.36); ctx.lineTo(-bodyW * 0.48, -hh * 0.36);
  ctx.closePath(); ctx.fill();

  // Торс
  const torsoGrad = ctx.createRadialGradient(0, -hh * 0.6, 0, 0, -hh * 0.6, 25);
  torsoGrad.addColorStop(0, skinBase); torsoGrad.addColorStop(1, skinShadow);
  ctx.fillStyle = torsoGrad;
  ctx.beginPath();
  ctx.moveTo(-bodyW * 0.35, -hh * 0.75); ctx.lineTo(bodyW * 0.35, -hh * 0.75);
  ctx.lineTo(bodyW * 0.32, -hh * 0.5); ctx.lineTo(-bodyW * 0.32, -hh * 0.5);
  ctx.closePath(); ctx.fill();

  // Топ
  const topGrad = ctx.createLinearGradient(-bodyW * 0.35, -hh * 0.75, bodyW * 0.35, -hh * 0.62);
  topGrad.addColorStop(0, '#8b0000'); topGrad.addColorStop(0.5, topColor); topGrad.addColorStop(1, '#8b0000');
  ctx.fillStyle = topGrad;
  ctx.beginPath();
  ctx.moveTo(-bodyW * 0.35, -hh * 0.75); ctx.lineTo(bodyW * 0.35, -hh * 0.75);
  ctx.lineTo(bodyW * 0.38, -hh * 0.62); ctx.lineTo(-bodyW * 0.38, -hh * 0.62);
  ctx.closePath(); ctx.fill();

  // Руки
  const drawArm = (offsetX, angle) => {
    ctx.save();
    ctx.translate(offsetX, -hh * 0.75);
    ctx.rotate(angle);
    const armGrad = ctx.createLinearGradient(-3.5, 0, 3.5, 0);
    armGrad.addColorStop(0, skinShadow); armGrad.addColorStop(0.5, skinBase); armGrad.addColorStop(1, skinShadow);
    ctx.fillStyle = armGrad;
    roundRect(ctx, -3.5, 0, 7, hh * 0.3, 4);
    ctx.fill();
    ctx.restore();
  };
  ctx.globalAlpha *= 0.9;
  drawArm(-bodyW * 0.35, armSwing);
  ctx.globalAlpha /= 0.9;
  drawArm(bodyW * 0.35, -armSwing);

  // Голова
  ctx.fillStyle = skinBase;
  ctx.fillRect(-5, -hh * 0.85, 10, 6);
  const faceGrad = ctx.createRadialGradient(-3, -hh * 0.95, 0, 0, -hh * 0.92, 16);
  faceGrad.addColorStop(0, skinBase); faceGrad.addColorStop(1, skinShadow);
  ctx.fillStyle = faceGrad;
  ctx.beginPath(); ctx.ellipse(0, -hh * 0.92, 10, 12, 0, 0, Math.PI * 2); ctx.fill();

  // Волосы
  const hairGrad = ctx.createLinearGradient(0, -hh * 1.12, 0, -hh * 0.65);
  hairGrad.addColorStop(0, '#ffcc66'); hairGrad.addColorStop(0.5, '#ff8c00'); hairGrad.addColorStop(1, '#803000');
  ctx.fillStyle = hairGrad;
  ctx.beginPath(); ctx.ellipse(0, -hh * 1.0, 12, 11, 0, Math.PI, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-12, -hh * 0.98); ctx.quadraticCurveTo(-18, -hh * 0.8, -11, -hh * 0.65);
  ctx.lineTo(-8, -hh * 0.95); ctx.fill();
  ctx.beginPath(); ctx.moveTo(12, -hh * 0.98); ctx.quadraticCurveTo(18, -hh * 0.8, 11, -hh * 0.65);
  ctx.lineTo(8, -hh * 0.95); ctx.fill();

  // Корона (золотая с бликами)
  const crownGrad = ctx.createLinearGradient(-10, -hh * 1.14, 10, -hh * 1.02);
  crownGrad.addColorStop(0, '#fff8b0'); crownGrad.addColorStop(0.5, '#ffd700'); crownGrad.addColorStop(1, '#b8860b');
  ctx.fillStyle = crownGrad;
  ctx.beginPath();
  ctx.moveTo(-10, -hh * 1.05); ctx.lineTo(-8, -hh * 1.12); ctx.lineTo(-4, -hh * 1.07);
  ctx.lineTo(0, -hh * 1.14); ctx.lineTo(4, -hh * 1.07); ctx.lineTo(8, -hh * 1.12);
  ctx.lineTo(10, -hh * 1.05); ctx.lineTo(8, -hh * 1.02); ctx.lineTo(-8, -hh * 1.02);
  ctx.closePath(); ctx.fill();
  // Камни
  ctx.fillStyle = '#e74c3c';
  ctx.beginPath(); ctx.arc(0, -hh * 1.08, 1.8, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#3498db';
  ctx.beginPath(); ctx.arc(-5, -hh * 1.06, 1.2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(5, -hh * 1.06, 1.2, 0, Math.PI * 2); ctx.fill();

  // Глаза
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.ellipse(-4, -hh * 0.93, 3.2, 2.3, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(4, -hh * 0.93, 3.2, 2.3, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = b.phase === 2 ? '#ff0000' : '#1a1a2e';
  ctx.beginPath(); ctx.arc(-3.5, -hh * 0.93, 1.6, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(4.5, -hh * 0.93, 1.6, 0, Math.PI * 2); ctx.fill();
  // Блики
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.beginPath(); ctx.arc(-3.2, -hh * 0.935, 0.6, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(4.8, -hh * 0.935, 0.6, 0, Math.PI * 2); ctx.fill();

  ctx.restore();
}