function update() {
  if (gameState === 'menu') return;

  // ==================== ЭКРАН ПЕРЕХОДА ====================
  if (gameState === 'levelComplete') {
    stateTimer++;
    
    // Ждём 1.5 секунды (90 кадров)
    if (stateTimer > 90) {
      // Если это был последний уровень (босс) — в меню
      if (currentLevel === LEVELS.length - 1) {
        gameState = 'menu';
        player = createPlayer();
        bossDefeated = false; 
        stateTimer = 0;
        return;
      }
      
      // Иначе загружаем следующий уровень
      const nextLevel = currentLevel + 1;
      loadLevel(nextLevel); 
      // loadLevel сам сбросит stateTimer в 0
    }
    return;
  }

  // ==================== GAME OVER ====================
  if (gameState === 'gameOver') {
    stateTimer++;
    if (stateTimer > 120 && keys['Space']) {
      gameState = 'menu';
      player = createPlayer();
      bossDefeated = false;
      stateTimer = 0;
    }
    return;
  }

  // ==================== ИГРОВОЙ ПРОЦЕСС ====================
  if (bossIntroTimer > 0) {
    bossIntroTimer--;
    player.vx = 0;
    if (bossIntroTimer === 0 && boss) boss.state = 'chase';
  }

  if (screenShake > 0) screenShake *= 0.9;
  if (screenShake < 0.5) screenShake = 0;
  if (hitFlash > 0) hitFlash--;

  const powered = player.powerTimer > 0;
  const currentSpeed = powered ? BASE_SPEED * 1.2 : BASE_SPEED;
  const currentJump = powered ? BASE_JUMP * 1.15 : BASE_JUMP;

  // Управление
  if (bossIntroTimer <= 0) {
    if (keys['ArrowLeft'] || keys['KeyA']) { player.vx = -currentSpeed; player.facing = -1; }
    else if (keys['ArrowRight'] || keys['KeyD']) { player.vx = currentSpeed; player.facing = 1; }
    else player.vx = 0;

    if ((keys['Space'] || keys['ArrowUp'] || keys['KeyW']) && player.onGround) {
      player.vy = currentJump;
      player.onGround = false;
      sfx.jump();
    }

    if (keys['KeyE'] && powered && hammerCooldown <= 0 && hammers.length < 3) {
      hammers.push({
        x: player.x + player.w / 2 + player.facing * 20,
        y: player.y + player.h * 0.4,
        vx: player.facing * 9, vy: -3,
        rotation: 0, rotationSpeed: player.facing * 0.4,
        life: 180, w: 20, h: 24
      });
      hammerCooldown = 30;
      sfx.hammerThrow();
      player.vx = -player.facing * 2;
      spawnParticles(player.x + player.w / 2, player.y + player.h * 0.4, '#ffd700', 6);
    }
  } else {
    player.vx = 0;
  }
  if (hammerCooldown > 0) hammerCooldown--;

  // Физика игрока
  player.vy += GRAVITY;
  player.x += player.vx;
  for (const p of level.platforms) {
    if (rectsOverlap(player, p)) {
      if (player.vx > 0) player.x = p.x - player.w;
      else if (player.vx < 0) player.x = p.x + p.w;
    }
  }
  if (player.x < 0) player.x = 0;
  if (player.x + player.w > level.width) player.x = level.width - player.w;

  const wasOnGround = player.onGround;
  player.y += player.vy;
  player.onGround = false;
  for (const p of level.platforms) {
    if (rectsOverlap(player, p)) {
      if (player.vy > 0) {
        player.y = p.y - player.h;
        player.vy = 0;
        player.onGround = true;
        if (!wasOnGround) player.landTime = 10;
      } else if (player.vy < 0) {
        player.y = p.y + p.h;
        player.vy = 0;
      }
    }
  }

  if (player.onGround && Math.abs(player.vx) > 0.1) player.walkTime += 0.2;
  else player.walkTime += (Math.round(player.walkTime / Math.PI) * Math.PI - player.walkTime) * 0.2;
  if (player.landTime > 0) player.landTime -= 1;
  if (player.invuln > 0) player.invuln -= 1;

  // Таймер бонуса
  if (player.powerTimer > 0) {
    player.powerTimer -= 1;
    if (player.powerTimer === 0) {
      sfx.powerEnd();
      spawnParticles(player.x + player.w / 2, player.y + player.h / 2, '#ffd700', 20);
      for (const h of hammers) spawnParticles(h.x, h.y, '#ffd700', 10);
      hammers = [];
    }
    if (player.powerTimer > 0 && Math.random() < 0.4) {
      spawnParticles(
        player.x + player.w / 2 + (Math.random() - 0.5) * 40,
        player.y + player.h / 2 + (Math.random() - 0.5) * 60,
        Math.random() < 0.5 ? '#ffd700' : '#ffaa00', 1
      );
    }
  }

  // Падение вниз
  if (player.y > H + 100) {
    player.hp -= 1;
    player.invuln = 60;
    sfx.hurt();
    hitFlash = 15;
    player.x = 50;
    player.y = 100;
    player.vy = 0;
    if (currentLevel === 4) player.x = 50;
  }

  // БОСС
  if (boss && boss.hp > 0 && bossIntroTimer <= 0) {
    boss.vy += GRAVITY;
    boss.x += boss.vx;
    for (const p of level.platforms) {
      if (rectsOverlap(boss, p)) {
        if (boss.vx > 0) boss.x = p.x - boss.w;
        else if (boss.vx < 0) boss.x = p.x + p.w;
      }
    }
    if (boss.x < 400) boss.x = 400;
    if (boss.x + boss.w > level.width - 50) boss.x = level.width - 50 - boss.w;
    boss.y += boss.vy;
    boss.onGround = false;
    for (const p of level.platforms) {
      if (rectsOverlap(boss, p)) {
        if (boss.vy > 0) {
          boss.y = p.y - boss.h;
          boss.vy = 0;
          boss.onGround = true;
          if (boss.state === 'jump') {
            boss.state = 'chase';
            screenShake = 8;
            spawnParticles(boss.x + boss.w / 2, boss.y + boss.h, '#ff4444', 20);
          }
        } else if (boss.vy < 0) {
          boss.y = p.y + p.h;
          boss.vy = 0;
        }
      }
    }
    if (boss.onGround) boss.walkTime += 0.2;
    if (boss.hitFlash > 0) boss.hitFlash--;
    if (boss.invuln > 0) boss.invuln--;
    if (boss.attackTimer > 0) boss.attackTimer--;
    if (boss.jumpCooldown > 0) boss.jumpCooldown--;
    if (boss.throwCooldown > 0) boss.throwCooldown--;

    const dx = (player.x + player.w / 2) - (boss.x + boss.w / 2);
    const dist = Math.abs(dx);

    if (boss.hp <= boss.maxHp / 2 && boss.phase === 1) {
      boss.phase = 2;
      sfx.bossRoar();
      screenShake = 15;
      spawnParticles(boss.x + boss.w / 2, boss.y + boss.h / 2, '#ff0000', 30, 10);
    }

    if (boss.state === 'chase') {
      const speed = boss.phase === 2 ? 3.5 : 2.2;
      boss.vx = Math.sign(dx) * speed;
      boss.facing = Math.sign(dx) || 1;
      if (boss.jumpCooldown <= 0 && boss.onGround && dist > 100 && dist < 400) {
        boss.state = 'jump';
        boss.vy = -14;
        boss.jumpTargetX = player.x;
        boss.jumpCooldown = boss.phase === 2 ? 90 : 150;
      } else if (boss.throwCooldown <= 0 && boss.onGround && dist > 150) {
        boss.state = 'throw';
        boss.attackTimer = 30;
        boss.throwCooldown = boss.phase === 2 ? 60 : 100;
      }
    } else if (boss.state === 'jump') {
      boss.vx = Math.sign(boss.jumpTargetX - boss.x) * 4;
      boss.facing = Math.sign(boss.vx) || 1;
    } else if (boss.state === 'throw') {
      boss.vx *= 0.8;
      boss.facing = Math.sign(dx) || 1;
      if (boss.attackTimer === 20) {
        for (let i = -1; i <= 1; i++) {
          bags.push({
            x: boss.x + boss.w / 2, y: boss.y + boss.h * 0.4,
            vx: Math.sign(dx) * 6, vy: -4 + i * 1.5,
            w: 18, h: 14, life: 200, spin: 0, isBossBag: true
          });
        }
        sfx.throw();
      }
      if (boss.attackTimer <= 0) boss.state = 'chase';
    }

    if (rectsOverlap(player, boss) && player.invuln <= 0 && boss.invuln <= 0) {
      if (player.vy > 0 && player.y + player.h - player.vy <= boss.y + 15) {
        boss.hp -= 1;
        boss.hitFlash = 15;
        boss.invuln = 30;
        player.vy = -10;
        player.score += 200;
        sfx.bossHit();
        screenShake = 10;
        hitFlash = 8;
        spawnParticles(boss.x + boss.w / 2, boss.y, '#ffd700', 20);
        spawnParticles(boss.x + boss.w / 2, boss.y, '#ff4444', 15);
        if (boss.hp <= 0) {
          bossDefeated = true;
          sfx.victory();
          screenShake = 20;
          spawnParticles(boss.x + boss.w / 2, boss.y + boss.h / 2, '#ffd700', 50, 12);
          spawnParticles(boss.x + boss.w / 2, boss.y + boss.h / 2, '#ff4444', 30, 10);
          player.score += 1000;
          setTimeout(() => {
            if (gameState === 'playing') {
              gameState = 'levelComplete';
              stateTimer = 0;
            }
          }, 2000);
        }
      } else {
        player.hp -= 1;
        player.invuln = 60;
        player.vx = -Math.sign(dx) * 8;
        player.vy = -7;
        sfx.hurt();
        screenShake = 8;
        hitFlash = 15;
        spawnParticles(player.x + player.w / 2, player.y + player.h / 2, '#ff4444', 10);
      }
    }
  }

  // МОЛОТЫ
  for (let i = hammers.length - 1; i >= 0; i--) {
    const h = hammers[i];
    h.vy += GRAVITY * 0.5;
    h.x += h.vx;
    h.y += h.vy;
    h.rotation += h.rotationSpeed;
    h.life--;
    if (Math.random() < 0.5) spawnParticles(h.x, h.y, Math.random() < 0.5 ? '#ffd700' : '#ffaa00', 1);
    let destroyed = false;

    if (!destroyed && boss && boss.hp > 0 && boss.invuln <= 0) {
      if (rectsOverlap({ x: h.x - 12, y: h.y - 12, w: 24, h: 24 }, boss)) {
        boss.hp -= 1;
        boss.hitFlash = 15;
        boss.invuln = 30;
        player.score += 200;
        sfx.bossHit();
        screenShake = 10;
        hitFlash = 8;
        spawnParticles(boss.x + boss.w / 2, boss.y + boss.h / 2, '#ffd700', 20);
        destroyed = true;
        if (boss.hp <= 0) {
          bossDefeated = true;
          sfx.victory();
          screenShake = 20;
          spawnParticles(boss.x + boss.w / 2, boss.y + boss.h / 2, '#ffd700', 50, 12);
          player.score += 1000;
          setTimeout(() => {
            if (gameState === 'playing') {
              gameState = 'levelComplete';
              stateTimer = 0;
            }
          }, 2000);
        }
      }
    }
    if (!destroyed) {
      for (const e of enemies) {
        if (!e.alive) continue;
        if (rectsOverlap({ x: h.x - 12, y: h.y - 12, w: 24, h: 24 }, e)) {
          e.alive = false;
          player.score += 100;
          sfx.hammerHit();
          spawnParticles(e.x + e.w / 2, e.y + e.h / 2, '#ffd700', 15);
          spawnParticles(e.x + e.w / 2, e.y + e.h / 2, e.color, 10);
          destroyed = true;
          break;
        }
      }
    }
    if (!destroyed) {
      for (let j = bags.length - 1; j >= 0; j--) {
        const b = bags[j];
        if (rectsOverlap({ x: h.x - 12, y: h.y - 12, w: 24, h: 24 }, b)) {
          bags.splice(j, 1);
          player.score += 20;
          sfx.hammerHit();
          spawnParticles(b.x, b.y, '#ff69b4', 8);
          spawnParticles(b.x, b.y, '#ffd700', 6);
          destroyed = true;
          break;
        }
      }
    }
    if (!destroyed) {
      for (const p of level.platforms) {
        if (rectsOverlap({ x: h.x - 12, y: h.y - 12, w: 24, h: 24 }, p)) {
          sfx.hammerHit();
          spawnParticles(h.x, h.y, '#ffd700', 12);
          spawnParticles(h.x, h.y, '#ffaa00', 8);
          destroyed = true;
          break;
        }
      }
    }
    if (h.x < -50 || h.x > level.width + 50 || h.y > H + 100) destroyed = true;
    if (h.life <= 0) destroyed = true;
    if (destroyed) hammers.splice(i, 1);
  }

  // ОСЬМИНОГИ
  for (const o of octopuses) {
    if (!o.taken && Math.hypot((player.x + player.w / 2) - o.x, (player.y + player.h / 2) - o.y) < o.r + 15) {
      o.taken = true;
      player.score += 10;
      sfx.coin();
      spawnParticles(o.x, o.y, '#c86bff', 12);
      spawnParticles(o.x, o.y, '#ff8df0', 6);
    }
  }

  // БОНУС
  if (goldenPower && !goldenPower.taken) {
    const dx = (player.x + player.w / 2) - goldenPower.x;
    const dy = (player.y + player.h / 2) - goldenPower.y;
    if (Math.hypot(dx, dy) < goldenPower.r + 18) {
      goldenPower.taken = true;
      player.powerTimer = POWER_DURATION;
      player.score += 100;
      sfx.powerup();
      spawnParticles(goldenPower.x, goldenPower.y, '#ffd700', 30);
      spawnParticles(goldenPower.x, goldenPower.y, '#ff8c00', 20);
      spawnParticles(goldenPower.x, goldenPower.y, '#fff', 15);
    }
  }

  // ВРАГИ
  for (const e of enemies) {
    if (!e.alive) continue;
    e.vy += GRAVITY;
    e.x += e.vx;
    for (const p of level.platforms) {
      if (rectsOverlap(e, p)) {
        if (e.vx > 0) e.x = p.x - e.w;
        else if (e.vx < 0) e.x = p.x + p.w;
      }
    }
    e.y += e.vy;
    e.onGround = false;
    for (const p of level.platforms) {
      if (rectsOverlap(e, p)) {
        if (e.vy > 0) {
          e.y = p.y - e.h;
          e.vy = 0;
          e.onGround = true;
        } else if (e.vy < 0) {
          e.y = p.y + p.h;
          e.vy = 0;
        }
      }
    }
    if (e.y > H + 100) {
      e.alive = false;
      continue;
    }
    const dx = (player.x + player.w / 2) - (e.x + e.w / 2);
    const dist = Math.abs(dx);
    if (dist < 180 && player.y < e.y + 80) e.state = 'chase';
    else if (dist > 250) e.state = 'patrol';
    if (e.state === 'chase') {
      e.vx = Math.sign(dx) * e.chaseSpeed;
      e.facing = Math.sign(dx) || 1;
      if (e.onGround && Math.random() < e.throwRate && Math.abs(player.y - e.y) < 120) {
        bags.push({
          x: e.x + e.w / 2, y: e.y + e.h * 0.5,
          vx: Math.sign(dx) * 5, vy: -4, w: 16, h: 12, life: 180, spin: 0
        });
        sfx.throw();
      }
    } else {
      if (e.x <= e.patrolMin) e.vx = e.speed;
      else if (e.x + e.w >= e.patrolMax) e.vx = -e.speed;
      else if (e.vx === 0) e.vx = e.speed;
      e.facing = Math.sign(e.vx) || 1;
    }
    if (e.onGround) e.walkTime += 0.2;
    if (rectsOverlap(player, e)) {
      if (powered) {
        e.alive = false;
        player.score += 100;
        sfx.stomp();
        spawnParticles(e.x + e.w / 2, e.y + e.h / 2, '#ffd700', 15);
        spawnParticles(e.x + e.w / 2, e.y + e.h / 2, e.color, 10);
      } else if (player.invuln <= 0) {
        if (player.vy > 0 && player.y + player.h - player.vy <= e.y + 12) {
          e.alive = false;
          player.vy = -9;
          player.score += 50;
          sfx.stomp();
          spawnParticles(e.x + e.w / 2, e.y + e.h / 2, e.color, 12);
        } else {
          player.hp -= 1;
          player.invuln = 60;
          player.vx = -Math.sign(dx) * 6;
          player.vy = -6;
          sfx.hurt();
          hitFlash = 15;
          spawnParticles(player.x + player.w / 2, player.y + player.h / 2, '#ff4444', 8);
        }
      }
    }
  }

  // СУМОЧКИ
  for (let i = bags.length - 1; i >= 0; i--) {
    const b = bags[i];
    b.vy += GRAVITY * 0.6;
    b.x += b.vx;
    b.y += b.vy;
    b.spin += 0.2;
    b.life--;
    if (rectsOverlap(player, b)) {
      if (powered) {
        spawnParticles(b.x, b.y, '#ffd700', 8);
        bags.splice(i, 1);
        continue;
      } else if (player.invuln <= 0) {
        player.hp -= 1;
        player.invuln = 60;
        player.vx = Math.sign(b.vx) * 5;
        player.vy = -5;
        sfx.hurt();
        hitFlash = 15;
        spawnParticles(b.x, b.y, '#ff69b4', 8);
        bags.splice(i, 1);
        continue;
      }
    }
    for (const p of level.platforms) {
      if (rectsOverlap(b, p)) {
        spawnParticles(b.x, b.y, b.isBossBag ? '#ff4444' : '#ff69b4', 6);
        bags.splice(i, 1);
        break;
      }
    }
    if (b.life <= 0 || b.y > H + 100) bags.splice(i, 1);
  }

  // ЧАСТИЦЫ
  for (let i = particles.length - 1; i >= 0; i--) {
    const pt = particles[i];
    pt.x += pt.vx;
    pt.y += pt.vy;
    pt.vy += 0.3;
    pt.vx *= 0.98;
    pt.life--;
    if (pt.life <= 0) particles.splice(i, 1);
  }

  // КАМЕРА
  const targetCamX = player.x + player.w / 2 - W / 2;
  camera.x += (targetCamX - camera.x) * 0.1;
  camera.x = Math.max(0, Math.min(level.width - W, camera.x));

  // ПРОВЕРКА ВЫХОДА
  if (rectsOverlap(player, level.exit) && !level.isBossLevel) {
    gameState = 'levelComplete';
    stateTimer = 0;
    sfx.levelup();
  }
  if (player.hp <= 0) {
    gameState = 'gameOver';
    stateTimer = 0;
    sfx.gameover();
  }
}