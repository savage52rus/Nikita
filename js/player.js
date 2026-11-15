function drawCharacter(p, customScale = 1, customX = null, customY = null, menuMode = false) {
  const { x, y, w, h, facing, vx, vy, onGround, walkTime, landTime, invuln, powerTimer } = p;
  if (invuln > 0 && powerTimer <= 0 && Math.floor(invuln / 4) % 2 === 0) return;
  const powered = powerTimer > 0;
  let state = 'idle';
  if (!onGround) state = vy < 0 ? 'jump' : 'fall';
  else if (Math.abs(vx) > 0.1) state = 'walk';

  let legSwing = 0, armSwing = 0, bodyBob = 0, legBend = 0, armLift = 0, squash = 1;
  if (state === 'walk') {
    legSwing = Math.sin(walkTime) * 0.45;
    armSwing = -Math.sin(walkTime) * 0.6;
    bodyBob = Math.abs(Math.sin(walkTime * 2)) * 1.5;
  } else if (state === 'jump') { legBend = 0.4; armLift = -0.3; bodyBob = -2; }
  else if (state === 'fall') { legSwing = 0.2; armLift = -0.5; bodyBob = 1; }
  else { bodyBob = Math.sin(globalTime / 500) * 0.8; }

  if (landTime > 0) {
    const k = landTime / 10;
    squash = 1 - Math.sin(k * Math.PI) * 0.15;
  }

  // Улучшенная тень (с размытием)
  if (onGround && !menuMode) {
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 10;
    const shadowW = 34 + Math.abs(vx) * 2;
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h + 4, shadowW / 2, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  if (powered) {
    const auraR = 80 + Math.sin(globalTime / 100) * 12;
    const aura = ctx.createRadialGradient(x + w / 2, y + h / 2, 10, x + w / 2, y + h / 2, auraR);
    aura.addColorStop(0, 'rgba(255, 215, 0, 0.5)');
    aura.addColorStop(0.4, 'rgba(255, 180, 0, 0.25)');
    aura.addColorStop(0.7, 'rgba(255, 120, 0, 0.1)');
    aura.addColorStop(1, 'rgba(255, 100, 0, 0)');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h / 2, auraR, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.save();
  if (customScale !== 1) {
    ctx.translate(customX, customY);
    ctx.scale(customScale, customScale);
    ctx.translate(-(x + w / 2), -(y + h));
  }
  ctx.translate(x + w / 2, y + h);
  ctx.scale(facing, squash);
  ctx.translate(0, bodyBob);

  const hh = h, bodyW = w * 0.9;
  
  // 3D-эффект кожи (меш-градиент)
  const skinBase = powered ? '#e8b99a' : '#fce5d4';
  const skinMid = powered ? '#c89a7a' : '#e0b898';
  const skinShadow = powered ? '#8a6040' : '#b08060';

  // НОГИ (джинсы/галифе)
  const drawLeg = (offsetX, angle, bend) => {
    ctx.save();
    ctx.translate(offsetX, -hh * 0.45);
    ctx.rotate(angle);
    if (bend > 0) {
      ctx.translate(0, hh * 0.2);
      ctx.rotate(bend);
      ctx.translate(0, -hh * 0.2);
    }
    
    // Градиент джинсов
    const legGrad = ctx.createLinearGradient(-bodyW * 0.2, 0, bodyW * 0.2, 0);
    if (powered) {
      legGrad.addColorStop(0, '#1a2a0a'); legGrad.addColorStop(0.4, '#4a5c2a'); legGrad.addColorStop(1, '#0a1a00');
    } else {
      legGrad.addColorStop(0, '#2a3a4a'); legGrad.addColorStop(0.4, '#6a8aa0'); legGrad.addColorStop(1, '#1a2a3a');
    }
    ctx.fillStyle = legGrad;
    roundRect(ctx, -bodyW * 0.18, 0, bodyW * 0.36, hh * 0.45, 6);
    ctx.fill();

    // Блик на бедре
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    roundRect(ctx, -bodyW * 0.15, hh * 0.05, 4, hh * 0.3, 2);
    ctx.fill();

    // Обувь с 3D-градиентом
    if (powered) {
      const bootGrad = ctx.createLinearGradient(0, hh * 0.4, 0, hh * 0.48);
      bootGrad.addColorStop(0, '#3a3a3a'); bootGrad.addColorStop(1, '#000000');
      ctx.fillStyle = bootGrad;
      roundRect(ctx, -bodyW * 0.18 - 2, hh * 0.4, bodyW * 0.36 + 6, 9, 4);
      ctx.fill();
    } else {
      const shoeGrad = ctx.createLinearGradient(0, hh * 0.4, 0, hh * 0.48);
      shoeGrad.addColorStop(0, '#ffffff'); shoeGrad.addColorStop(1, '#999999');
      ctx.fillStyle = shoeGrad;
      roundRect(ctx, -bodyW * 0.18 - 2, hh * 0.4, bodyW * 0.36 + 6, 9, 4);
      ctx.fill();
      // Синяя вставка
      ctx.fillStyle = '#3a7bd5';
      roundRect(ctx, -bodyW * 0.18 + 2, hh * 0.42, 8, 4, 2);
      ctx.fill();
    }
    // Подошва
    ctx.fillStyle = '#111';
    ctx.fillRect(-bodyW * 0.18 - 2, hh * 0.47, bodyW * 0.36 + 6, 2);
    ctx.restore();
  };
  
  ctx.globalAlpha = 0.9;
  drawLeg(-bodyW * 0.2, -legSwing + legBend, legBend);
  ctx.globalAlpha = 1;
  drawLeg(bodyW * 0.2, legSwing + legBend, legBend);

  // ТОРС (рубашка/гимнастёрка)
  const shirtGrad = ctx.createLinearGradient(-bodyW / 2, 0, bodyW / 2, 0);
  if (powered) {
    shirtGrad.addColorStop(0, '#2a3a1a'); shirtGrad.addColorStop(0.3, '#6a7c3a'); shirtGrad.addColorStop(0.7, '#4a5c2a'); shirtGrad.addColorStop(1, '#1a2a0a');
  } else {
    shirtGrad.addColorStop(0, '#4a7a9a'); shirtGrad.addColorStop(0.3, '#a8d6ea'); shirtGrad.addColorStop(0.7, '#80b8d4'); shirtGrad.addColorStop(1, '#3a5a7a');
  }
  ctx.fillStyle = shirtGrad;
  ctx.beginPath();
  ctx.moveTo(-bodyW / 2 - 2, -hh * 0.85);
  ctx.bezierCurveTo(-bodyW / 2 - 8, -hh * 0.7, -bodyW / 2 - 8, -hh * 0.5, -bodyW / 2 - 6, -hh * 0.45);
  ctx.lineTo(bodyW / 2 + 6, -hh * 0.45);
  ctx.bezierCurveTo(bodyW / 2 + 8, -hh * 0.5, bodyW / 2 + 8, -hh * 0.7, bodyW / 2 + 2, -hh * 0.85);
  ctx.closePath();
  ctx.fill();

  // Объёмная тень на торсе
  const torsoShadow = ctx.createLinearGradient(-bodyW / 2, -hh * 0.6, bodyW / 2, -hh * 0.4);
  torsoShadow.addColorStop(0, 'rgba(0,0,0,0.3)');
  torsoShadow.addColorStop(0.5, 'rgba(0,0,0,0)');
  torsoShadow.addColorStop(1, 'rgba(0,0,0,0.2)');
  ctx.fillStyle = torsoShadow;
  ctx.beginPath();
  ctx.moveTo(-bodyW / 2 + 2, -hh * 0.6);
  ctx.lineTo(bodyW / 2 - 2, -hh * 0.6);
  ctx.lineTo(bodyW / 2 + 4, -hh * 0.45);
  ctx.lineTo(-bodyW / 2 - 4, -hh * 0.45);
  ctx.closePath();
  ctx.fill();

  // Детали формы (ремень, пуговицы)
  if (powered) {
    ctx.fillStyle = '#2a1a0a';
    ctx.fillRect(-bodyW / 2 - 4, -hh * 0.52, bodyW + 8, 6);
    const buckleGrad = ctx.createLinearGradient(-4, 0, 4, 0);
    buckleGrad.addColorStop(0, '#ffd700'); buckleGrad.addColorStop(0.5, '#fff8b0'); buckleGrad.addColorStop(1, '#ffd700');
    ctx.fillStyle = buckleGrad;
    ctx.fillRect(-4, -hh * 0.52, 8, 6);
    
    // Звезда на воротнике
    ctx.fillStyle = '#ffd700';
    drawStar(0, -hh * 0.86, 6, 3);
  } else {
    // Пуговицы
    ctx.fillStyle = '#2a4a6a';
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.arc(0, -hh * 0.75 + i * 10, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    // Воротник
    ctx.fillStyle = '#80b8d4';
    ctx.beginPath();
    ctx.moveTo(-6, -hh * 0.85); ctx.lineTo(0, -hh * 0.82); ctx.lineTo(6, -hh * 0.85);
    ctx.lineTo(3, -hh * 0.88); ctx.lineTo(-3, -hh * 0.88);
    ctx.closePath();
    ctx.fill();
  }

  // РУКИ
  const drawArm = (offsetX, angle, lift) => {
    ctx.save();
    ctx.translate(offsetX, -hh * 0.82);
    ctx.rotate(angle + lift);
    
    const armGrad = ctx.createLinearGradient(-4, 0, 4, 0);
    if (powered) {
      armGrad.addColorStop(0, '#2a3a1a'); armGrad.addColorStop(0.5, '#6a7c3a'); armGrad.addColorStop(1, '#1a2a0a');
    } else {
      armGrad.addColorStop(0, '#4a7a9a'); armGrad.addColorStop(0.5, '#a8d6ea'); armGrad.addColorStop(1, '#3a5a7a');
    }
    ctx.fillStyle = armGrad;
    roundRect(ctx, -4, 0, 8, hh * 0.35, 5);
    ctx.fill();

    // Кисть (3D)
    const handGrad = ctx.createRadialGradient(0, hh * 0.38, 0, 0, hh * 0.38, 5);
    handGrad.addColorStop(0, skinBase); handGrad.addColorStop(1, skinShadow);
    ctx.fillStyle = handGrad;
    ctx.beginPath();
    ctx.arc(0, hh * 0.38, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };
  ctx.globalAlpha = 0.9;
  drawArm(-bodyW / 2 - 2, armSwing, armLift);
  ctx.globalAlpha = 1;
  drawArm(bodyW / 2 + 2, -armSwing, armLift);

  // ШЕЯ И ГОЛОВА
  const neckGrad = ctx.createLinearGradient(-5, 0, 5, 0);
  neckGrad.addColorStop(0, skinShadow); neckGrad.addColorStop(0.5, skinBase); neckGrad.addColorStop(1, skinShadow);
  ctx.fillStyle = neckGrad;
  ctx.fillRect(-5, -hh * 0.88, 10, 8);

  // Лицо (3D)
  const faceGrad = ctx.createRadialGradient(-3, -hh * 0.98, 0, 0, -hh * 0.92, 16);
  faceGrad.addColorStop(0, skinBase); faceGrad.addColorStop(0.6, skinMid); faceGrad.addColorStop(1, skinShadow);
  ctx.fillStyle = faceGrad;
  ctx.beginPath();
  ctx.ellipse(0, -hh * 0.92, 10, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  // Волосы / Пилотка
  if (powered) {
    const capGrad = ctx.createLinearGradient(-12, -hh * 1.02, 12, -hh * 0.92);
    capGrad.addColorStop(0, '#1a2a0a'); capGrad.addColorStop(0.5, '#6a7c3a'); capGrad.addColorStop(1, '#1a2a0a');
    ctx.fillStyle = capGrad;
    ctx.beginPath();
    ctx.moveTo(-12, -hh * 1.02); ctx.lineTo(12, -hh * 1.02);
    ctx.lineTo(10, -hh * 0.92); ctx.lineTo(-10, -hh * 0.92);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#c0392b';
    drawStar(0, -hh * 0.97, 4, 2);
  } else {
    // 3D-волосы
    const hairGrad = ctx.createLinearGradient(0, -hh * 1.12, 0, -hh * 0.9);
    hairGrad.addColorStop(0, '#1a0e08'); hairGrad.addColorStop(0.4, '#3d2a1c'); hairGrad.addColorStop(1, '#0a0500');
    ctx.fillStyle = hairGrad;
    ctx.beginPath();
    ctx.ellipse(0, -hh * 1.02, 11, 9, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-10, -hh * 0.98); ctx.quadraticCurveTo(-2, -hh * 0.92, 8, -hh * 0.96);
    ctx.lineTo(10, -hh * 0.98); ctx.quadraticCurveTo(0, -hh * 1.05, -10, -hh * 0.98);
    ctx.fill();
    // Блик на волосах
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.beginPath();
    ctx.ellipse(-4, -hh * 1.04, 5, 2.5, -0.3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Борода (3D)
  const beardGrad = ctx.createLinearGradient(0, -hh * 0.95, 0, -hh * 0.83);
  beardGrad.addColorStop(0, '#3d2a1c'); beardGrad.addColorStop(1, '#0a0500');
  ctx.fillStyle = beardGrad;
  ctx.beginPath();
  if (powered) {
    ctx.moveTo(-7, -hh * 0.9); ctx.quadraticCurveTo(0, -hh * 0.88, 7, -hh * 0.9);
    ctx.quadraticCurveTo(0, -hh * 0.86, -7, -hh * 0.9);
  } else {
    ctx.moveTo(-9, -hh * 0.92); ctx.quadraticCurveTo(0, -hh * 0.83, 9, -hh * 0.92);
    ctx.lineTo(8, -hh * 0.95); ctx.quadraticCurveTo(0, -hh * 0.88, -8, -hh * 0.95);
  }
  ctx.closePath();
  ctx.fill();

  // ГЛАЗА с бликами и объемом
  // Белки
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.ellipse(-4, -hh * 0.96, 2.8, 1.8, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(4, -hh * 0.96, 2.8, 1.8, 0, 0, Math.PI * 2); ctx.fill();
  // Зрачки
  ctx.fillStyle = '#1a1a2e';
  ctx.beginPath(); ctx.arc(-3.5, -hh * 0.96, 1.2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(4.5, -hh * 0.96, 1.2, 0, Math.PI * 2); ctx.fill();
  // Блики в глазах (3D)
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.beginPath(); ctx.arc(-3.2, -hh * 0.97, 0.6, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(4.8, -hh * 0.97, 0.6, 0, Math.PI * 2); ctx.fill();

  // Брови
  ctx.strokeStyle = '#2d1e14';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(-7, -hh * 0.99); ctx.lineTo(-2, -hh * 0.98); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(7, -hh * 0.99); ctx.lineTo(2, -hh * 0.98); ctx.stroke();

  ctx.restore();
}