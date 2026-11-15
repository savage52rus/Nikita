const keys = {};
const mouse = { x: 0, y: 0, isDown: false };

addEventListener('keydown', e => {
  keys[e.code] = true;
  if (e.code === 'Space' || e.code.startsWith('Arrow')) e.preventDefault();
  if (e.code === 'KeyM') {
    soundEnabled = !soundEnabled;
    updateMusicButtonVisual();
  }
});
addEventListener('keyup', e => keys[e.code] = false);

canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = (e.clientX - rect.left) * (W / rect.width);
  mouse.y = (e.clientY - rect.top) * (H / rect.height);
});
canvas.addEventListener('mousedown', () => mouse.isDown = true);
canvas.addEventListener('mouseup', () => mouse.isDown = false);

// --- Кнопка музыки ---
function updateMusicButtonVisual() {
  const btn = document.getElementById('html-music-btn');
  if (!btn) return;
  if (soundEnabled) {
    btn.textContent = '🎵';
    btn.classList.remove('muted');
  } else {
    btn.textContent = '🔇';
    btn.classList.add('muted');
  }
}

document.getElementById('html-music-btn').addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  updateMusicButtonVisual();
  if (soundEnabled && audio.state === 'suspended') {
    audio.resume();
  }
  playTone(600, 0.05, 'sine', 0.05);
});

// --- Позиционирование невидимой кнопки старта ---
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

// --- Запуск игры ---
let isStarting = false;
document.getElementById('html-start-btn').addEventListener('click', (e) => {
  e.preventDefault();
  if (isStarting || gameState !== 'menu') return;
  
  isStarting = true;
  console.log("Кнопка старта нажата.");
  
  // Небольшая задержка, чтобы избежать конфликтов событий на мобильных
  setTimeout(() => {
    startGame();
    isStarting = false;
  }, 50);
});

// --- Обработка касаний ---
canvas.addEventListener('touchstart', e => {
  e.preventDefault();
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  mouse.x = (touch.clientX - rect.left) * (W / rect.width);
  mouse.y = (touch.clientY - rect.top) * (H / rect.height);
}, { passive: false });

// --- Виртуальные кнопки ---
function bindMobileButton(id, keyCode) {
  const btn = document.getElementById(id);
  if (!btn) return;

  const press = (e) => {
    e.preventDefault();
    keys[keyCode] = true;
    
    // Запуск игры, если нажата A в меню
    if (keyCode === 'Space' && gameState === 'menu' && !isStarting) {
      isStarting = true;
      setTimeout(() => {
        startGame();
        isStarting = false;
      }, 50);
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

// --- Игровой цикл ---
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
    try {
      update();
    } catch (err) {
      console.error("Ошибка в update():", err);
    }
  } else {
    menuTime += 16;
  }
  
  try {
    draw();
  } catch (err) {
    console.error("Ошибка в draw():", err);
  }
  
  requestAnimationFrame(loop);
}

updateMusicButtonVisual();
loop();