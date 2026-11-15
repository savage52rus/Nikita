const keys = {};
const mouse = { x: 0, y: 0, isDown: false };

// --- Обработка клавиатуры ---
addEventListener('keydown', e => {
  keys[e.code] = true;
  if (e.code === 'Space' || e.code.startsWith('Arrow')) e.preventDefault();
  if (e.code === 'KeyM') soundEnabled = !soundEnabled;
});
addEventListener('keyup', e => keys[e.code] = false);

// --- Обработка мыши (ПК) ---
canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = (e.clientX - rect.left) * (W / rect.width);
  mouse.y = (e.clientY - rect.top) * (H / rect.height);
});
canvas.addEventListener('mousedown', () => mouse.isDown = true);
canvas.addEventListener('mouseup', () => mouse.isDown = false);

// --- Обработка касаний по канвасу (для меню) ---
canvas.addEventListener('touchstart', e => {
  e.preventDefault(); // Убираем зум и скролл
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  mouse.x = (touch.clientX - rect.left) * (W / rect.width);
  mouse.y = (touch.clientY - rect.top) * (H / rect.height);
  mouse.isDown = true;
}, { passive: false });

canvas.addEventListener('touchend', e => {
  e.preventDefault();
  mouse.isDown = false;
});

// --- Виртуальные кнопки ---
function bindMobileButton(id, keyCode) {
  const btn = document.getElementById(id);
  if (!btn) return;

  const press = (e) => {
    e.preventDefault();
    keys[keyCode] = true;
    // Если это кнопка действия (прыжок/молот), эмулируем одиночное нажатие для меню, если нужно
    if (keyCode === 'Space') {
      // Принудительный прыжок
    }
  };
  
  const release = (e) => {
    e.preventDefault();
    keys[keyCode] = false;
  };

  btn.addEventListener('touchstart', press, { passive: false });
  btn.addEventListener('touchend', release, { passive: false });
  btn.addEventListener('touchcancel', release, { passive: false });
  
  // Для тестирования на ПК (мышкой по кнопкам)
  btn.addEventListener('mousedown', press);
  btn.addEventListener('mouseup', release);
  btn.addEventListener('mouseleave', release);
}

// Привязываем кнопки
bindMobileButton('btn-left', 'ArrowLeft');
bindMobileButton('btn-right', 'ArrowRight');
bindMobileButton('btn-action', 'Space'); // Прыжок
// Если нужно метать молот, можно добавить вторую кнопку с 'KeyE', 
// но пока кнопка "A" делает прыжок, так как это основа геймплея.

// --- Игровой цикл ---
function draw() {
  globalTime = Date.now();
  if (gameState === 'menu') {
    drawMenu(globalTime);
  } else {
    drawGame();
  }
}

function loop() {
  globalTime = Date.now();
  if (gameState !== 'menu') update();
  else menuTime += 16;
  draw();
  requestAnimationFrame(loop);
}

loop();