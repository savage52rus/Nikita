const keys = {};
const mouse = { x: 0, y: 0, isDown: false };

document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('html-start-btn');
  const musicBtn = document.getElementById('html-music-btn');
  console.log("DOM загружен. Кнопка старта:", startBtn);

  // Клавиатура
  addEventListener('keydown', e => {
    keys[e.code] = true;
    if (e.code === 'Space' || e.code.startsWith('Arrow')) e.preventDefault();
    if (e.code === 'KeyM') {
      soundEnabled = !soundEnabled;
      if (typeof updateMusicButtonVisual === 'function') updateMusicButtonVisual();
    }
  });
  addEventListener('keyup', e => keys[e.code] = false);

  // Мышь
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) * (W / rect.width);
    mouse.y = (e.clientY - rect.top) * (H / rect.height);
  });
  canvas.addEventListener('mousedown', () => mouse.isDown = true);
  canvas.addEventListener('mouseup', () => mouse.isDown = false);

  // Музыка
  window.updateMusicButtonVisual = function() {
    if (!musicBtn) return;
    if (soundEnabled) {
      musicBtn.textContent = '🎵';
      musicBtn.classList.remove('muted');
    } else {
      musicBtn.textContent = '🔇';
      musicBtn.classList.add('muted');
    }
  };

  if (musicBtn) {
    musicBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      window.updateMusicButtonVisual();
      if (soundEnabled && audio.state === 'suspended') audio.resume();
      playTone(600, 0.05, 'sine', 0.05);
    });
  }

  // Старт
  let isStarting = false;
  if (startBtn) {
    startBtn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log("Клик по кнопке старта. gameState:", gameState);
      if (isStarting || gameState !== 'menu') return;
      isStarting = true;
      
      // Принудительный запуск
      console.log("Вызов startGame...");
      startGame();
      console.log("После startGame. gameState:", gameState, "Врагов:", enemies.length, "Осьминогов:", octopuses.length, "Платформ:", level ? level.platforms.length : "нет");
      
      isStarting = false;
    });
  }

  // Касания
  canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    mouse.x = (touch.clientX - rect.left) * (W / rect.width);
    mouse.y = (touch.clientY - rect.top) * (H / rect.height);
  }, { passive: false });

  // Виртуальные кнопки
  function bindMobileButton(id, keyCode) {
    const btn = document.getElementById(id);
    if (!btn) return;

    const press = (e) => {
      e.preventDefault();
      keys[keyCode] = true;
      if (keyCode === 'Space' && gameState === 'menu' && !isStarting) {
        isStarting = true;
        startGame();
        isStarting = false;
      }
      if (keyCode === 'KeyE') btn.style.transform = 'scale(0.85)';
    };
    
    const release = (e) => {
      e.preventDefault();
      keys[keyCode] = false;
      if (keyCode === 'KeyE') btn.style.transform = '';
    };

    btn.addEventListener('touchstart', press, { passive: false });
    btn.addEventListener('touchend', release, { passive: false });
    btn.addEventListener('touchcancel', release, { passive: false });
    btn.addEventListener('mousedown', press);
    btn.addEventListener('mouseup', release);
    btn.addEventListener('mouseleave', release);
  }

  bindMobileButton('btn-left', 'ArrowLeft');
  bindMobileButton('btn-right', 'ArrowRight');
  bindMobileButton('btn-action', 'Space');
  bindMobileButton('btn-throw', 'KeyE');

  window.updateMusicButtonVisual();
});

function updateHtmlStartButton() {
  const htmlBtn = document.getElementById('html-start-btn');
  if (!htmlBtn) return;

  if (gameState === 'menu') {
    htmlBtn.classList.add('active');
    const rect = canvas.getBoundingClientRect();
    const scaleX = rect.width / W;
    const scaleY = rect.height / H;
    const btn = startButton;
    
    htmlBtn.style.left = (btn.x * scaleX) + 'px';
    htmlBtn.style.top = (btn.y * scaleY) + 'px';
    htmlBtn.style.width = (btn.w * scaleX) + 'px';
    htmlBtn.style.height = (btn.h * scaleY) + 'px';
  } else {
    htmlBtn.classList.remove('active');
  }
}

function draw() {
  globalTime = Date.now();
  if (gameState === 'menu') {
    drawMenu(globalTime);
  } else {
    drawGame();
  }
  updateHtmlStartButton();
}

function loop() {
  globalTime = Date.now();
  if (gameState !== 'menu') {
    try { update(); } catch (err) { console.error("Ошибка update:", err); }
  } else {
    menuTime += 16;
  }
  try { draw(); } catch (err) { console.error("Ошибка draw:", err); }
  requestAnimationFrame(loop);
}

loop();