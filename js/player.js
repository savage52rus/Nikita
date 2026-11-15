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

  if (onGround && !menuMode) {
    const shadowW = 30 + Math.abs(vx) * 2;
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h + 2, shadowW / 2, 4, 0, 0, Math.PI * 2);
    ctx.fill();
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
  const skinBase = powered ? '#e8b99a' : '#f0c9a8';
  const skinShadow = powered ? '#c89a7a' : '#d4a882';

  // НОГИ
  const drawLeg = (offsetX, angle, bend) => {
    ctx.save();
    ctx.translate(offsetX, -hh * 0.45);
    ctx.rotate(angle);
    if (bend > 0) {
      ctx.translate(0, hh * 0.2);
      ctx.rotate(bend);
      ctx.translate(0, -hh * 0.2);
    }
    const legGrad = ctx.createLinearGradient(-bodyW * 0.18, 0, bodyW * 0.18, 0);
    if (powered) {
      legGrad.addColorStop(0, '#2a3a1a');
      legGrad.addColorStop(0.5, '#4a5c2a');
      legGrad.addColorStop(1, '#2a3a1a');
    } else {
      legGrad.addColorStop(0, '#3a4a5a');
      legGrad.addColorStop(0.5, '#5a6b7a');
      legGrad.addColorStop(1, '#3a4a5a');
    }
    ctx.fillStyle = legGrad;
    roundRect(ctx, -bodyW * 0.18, 0, bodyW * 0.36, hh * 0.45, 4);
    ctx.fill();

    if (powered) {
      const galGrad = ctx.createLinearGradient(-bodyW * 0.25, 0, bodyW * 0.25, 0);
      galGrad.addColorStop(0, '#2a3a1a');
      galGrad.addColorStop(0.5, '#4a5c2a');
      galGrad.addColorStop(1, '#2a3a1a');
      ctx.fillStyle = galGrad;
      ctx.beginPath();
      ctx.moveTo(-bodyW * 0.25, 0);
      ctx.lineTo(bodyW * 0.25, 0);
      ctx.lineTo(bodyW * 0.18, hh * 0.15);
      ctx.lineTo(-bodyW * 0.18, hh * 0.15);
      ctx.closePath();
      ctx.fill();
    }

    if (powered) {
      const bootGrad = ctx.createLinearGradient(0, hh * 0.4, 0, hh * 0.48);
      bootGrad.addColorStop(0, '#2a2a2a');
      bootGrad.addColorStop(1, '#050505');
      ctx.fillStyle = bootGrad;
      roundRect(ctx, -bodyW * 0.18 - 2, hh * 0.4, bodyW * 0.36 + 6, 8, 3);
      ctx.fill();
    } else {
      const shoeGrad = ctx.createLinearGradient(0, hh * 0.4, 0, hh * 0.48);
      shoeGrad.addColorStop(0, '#ffffff');
      shoeGrad.addColorStop(1, '#b0b0b0');
      ctx.fillStyle = shoeGrad;
      roundRect(ctx, -bodyW * 0.18 - 2, hh * 0.4, bodyW * 0.36 + 6, 8, 3);
      ctx.fill();
      ctx.fillStyle = '#3a7bd5';
      roundRect(ctx, -bodyW * 0.18 + 2, hh * 0.42, 8, 4, 2);
      ctx.fill();
    }
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(-bodyW * 0.18 - 2, hh * 0.47, bodyW * 0.36 + 6, 2);
    ctx.restore();
  };
  ctx.globalAlpha = 0.85;
  drawLeg(-bodyW * 0.2, -legSwing + legBend, legBend);
  ctx.globalAlpha = 1;
  drawLeg(bodyW * 0.2, legSwing + legBend, legBend);

  // ТОРС
  const shirtGrad = ctx.createLinearGradient(-bodyW / 2, 0, bodyW / 2, 0);
  if (powered) {
    shirtGrad.addColorStop(0, '#3a4a1a');
    shirtGrad.addColorStop(0.5, '#6a7c3a');
    shirtGrad.addColorStop(1, '#3a4a1a');
  } else {
    shirtGrad.addColorStop(0, '#6a9fbf');
    shirtGrad.addColorStop(0.5, '#a8d6ea');
    shirtGrad.addColorStop(1, '#6a9fbf');
  }
  ctx.fillStyle = shirtGrad;
  ctx.beginPath();
  ctx.moveTo(-bodyW / 2 - 2, -hh * 0.85);
  ctx.lineTo(-bodyW / 2 - 6, -hh * 0.45);
  ctx.lineTo(bodyW / 2 + 6, -hh * 0.45);
  ctx.lineTo(bodyW / 2 + 2, -hh * 0.85);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.beginPath();
  ctx.moveTo(-bodyW / 2 + 2, -hh * 0.6);
  ctx.lineTo(bodyW / 2 - 2, -hh * 0.6);
  ctx.lineTo(bodyW / 2 + 4, -hh * 0.45);
  ctx.lineTo(-bodyW / 2 - 4, -hh * 0.45);
  ctx.closePath();
  ctx.fill();

  if (powered) {
    ctx.fillStyle = '#2a1a0a';
    ctx.fillRect(-bodyW / 2 - 4, -hh * 0.52, bodyW + 8, 6);
    const buckleGrad = ctx.createLinearGradient(-4, 0, 4, 0);
    buckleGrad.addColorStop(0, '#ffd700');
    buckleGrad.addColorStop(0.5, '#fff8b0');
    buckleGrad.addColorStop(1, '#ffd700');
    ctx.fillStyle = buckleGrad;
    ctx.fillRect(-4, -hh * 0.52, 8, 6);
    ctx.fillStyle = '#8b6914';
    ctx.fillRect(-2, -hh * 0.51, 4, 4);
    ctx.fillStyle = '#c0392b';
    ctx.fillRect(-bodyW / 2 - 2, -hh * 0.85, 10, 4);
    ctx.fillRect(bodyW / 2 - 8, -hh * 0.85, 10, 4);
    ctx.fillStyle = '#ffd700';
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(0, -hh * 0.78 + i * 10, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#3a4a1a';
    ctx.beginPath();
    ctx.moveTo(-8, -hh * 0.85);
    ctx.lineTo(0, -hh * 0.83);
    ctx.lineTo(8, -hh * 0.85);
    ctx.lineTo(6, -hh * 0.88);
    ctx.lineTo(-6, -hh * 0.88);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ffd700';
    drawStar(0, -hh * 0.86, 5, 2.5);
  } else {
    ctx.fillStyle = '#4a7a9a';
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.arc(0, -hh * 0.75 + i * 10, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#80b8d4';
    ctx.beginPath();
    ctx.moveTo(-6, -hh * 0.85);
    ctx.lineTo(0, -hh * 0.82);
    ctx.lineTo(6, -hh * 0.85);
    ctx.lineTo(3, -hh * 0.88);
    ctx.lineTo(-3, -hh * 0.88);
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
      armGrad.addColorStop(0, '#3a4a1a');
      armGrad.addColorStop(0.5, '#6a7c3a');
      armGrad.addColorStop(1, '#3a4a1a');
    } else {
      armGrad.addColorStop(0, '#6a9fbf');
      armGrad.addColorStop(0.5, '#a8d6ea');
      armGrad.addColorStop(1, '#6a9fbf');
    }
    ctx.fillStyle = armGrad;
    roundRect(ctx, -4, 0, 8, hh * 0.35, 4);
    ctx.fill();
    if (powered) {
      ctx.fillStyle = '#c0392b';
      ctx.fillRect(-4, 0, 8, 3);
    }
    const handGrad = ctx.createRadialGradient(0, hh * 0.38, 0, 0, hh * 0.38, 5);
    handGrad.addColorStop(0, skinBase);
    handGrad.addColorStop(1, skinShadow);
    ctx.fillStyle = handGrad;
    ctx.beginPath();
    ctx.arc(0, hh * 0.38, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };
  ctx.globalAlpha = 0.85;
  drawArm(-bodyW / 2 - 2, armSwing, armLift);
  ctx.globalAlpha = 1;
  drawArm(bodyW / 2 + 2, -armSwing, armLift);

  // ШЕЯ И ГОЛОВА
  const neckGrad = ctx.createLinearGradient(-5, 0, 5, 0);
  neckGrad.addColorStop(0, skinShadow);
  neckGrad.addColorStop(0.5, skinBase);
  neckGrad.addColorStop(1, skinShadow);
  ctx.fillStyle = neckGrad;
  ctx.fillRect(-5, -hh * 0.88, 10, 8);

  const faceGrad = ctx.createRadialGradient(-3, -hh * 0.98, 0, 0, -hh * 0.95, 15);
  faceGrad.addColorStop(0, skinBase);
  faceGrad.addColorStop(1, skinShadow);
  ctx.fillStyle = faceGrad;
  ctx.beginPath();
  ctx.ellipse(0, -hh * 0.95, 10, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  if (powered) {
    const capGrad = ctx.createLinearGradient(-12, -hh * 1.02, 12, -hh * 0.92);
    capGrad.addColorStop(0, '#2a3a1a');
    capGrad.addColorStop(0.5, '#6a7c3a');
    capGrad.addColorStop(1, '#2a3a1a');
    ctx.fillStyle = capGrad;
    ctx.beginPath();
    ctx.moveTo(-12, -hh * 1.02);
    ctx.lineTo(12, -hh * 1.02);
    ctx.lineTo(10, -hh * 0.92);
    ctx.lineTo(-10, -hh * 0.92);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#1a2a0a';
    ctx.beginPath();
    ctx.moveTo(-10, -hh * 0.92);
    ctx.lineTo(10, -hh * 0.92);
    ctx.lineTo(12, -hh * 0.89);
    ctx.lineTo(-12, -hh * 0.89);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#c0392b';
    drawStar(0, -hh * 0.97, 4, 2);
  } else {
    const hairGrad = ctx.createLinearGradient(0, -hh * 1.1, 0, -hh * 0.95);
    hairGrad.addColorStop(0, '#1a0e08');
    hairGrad.addColorStop(0.5, '#3d2a1c');
    hairGrad.addColorStop(1, '#2d1e14');
    ctx.fillStyle = hairGrad;
    ctx.beginPath();
    ctx.ellipse(0, -hh * 1.02, 11, 9, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-10, -hh * 0.98);
    ctx.quadraticCurveTo(-2, -hh * 0.92, 8, -hh * 0.96);
    ctx.lineTo(10, -hh * 0.98);
    ctx.quadraticCurveTo(0, -hh * 1.05, -10, -hh * 0.98);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.beginPath();
    ctx.ellipse(-4, -hh * 1.04, 5, 2.5, -0.3, 0, Math.PI * 2);
    ctx.fill();
  }

  // БОРОДА
  const beardGrad = ctx.createLinearGradient(0, -hh * 0.95, 0, -hh * 0.83);
  beardGrad.addColorStop(0, '#3d2a1c');
  beardGrad.addColorStop(1, '#1a0e08');
  ctx.fillStyle = beardGrad;
  ctx.beginPath();
  if (powered) {
    ctx.moveTo(-7, -hh * 0.9);
    ctx.quadraticCurveTo(0, -hh * 0.88, 7, -hh * 0.9);
    ctx.quadraticCurveTo(0, -hh * 0.86, -7, -hh * 0.9);
  } else {
    ctx.moveTo(-9, -hh * 0.92);
    ctx.quadraticCurveTo(0, -hh * 0.83, 9, -hh * 0.92);
    ctx.lineTo(8, -hh * 0.95);
    ctx.quadraticCurveTo(0, -hh * 0.88, -8, -hh * 0.95);
  }
  ctx.closePath();
  ctx.fill();

  // ГЛАЗА
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.ellipse(-4, -hh * 0.96, 2.5, 1.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(4, -hh * 0.96, 2.5, 1.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1a1a2e';
  ctx.beginPath();
  ctx.arc(-3.5, -hh * 0.96, 1, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(4.5, -hh * 0.96, 1, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.beginPath();
  ctx.arc(-3.2, -hh * 0.97, 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(4.8, -hh * 0.97, 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#2d1e14';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-7, -hh * 0.99);
  ctx.lineTo(-2, -hh * 0.98);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(7, -hh * 0.99);
  ctx.lineTo(2, -hh * 0.98);
  ctx.stroke();

  ctx.restore();
}
