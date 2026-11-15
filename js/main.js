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

// --- Универсальная функция для получения координат касания/клика ---
function getCanvasCoords(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (clientX - rect.left) * (W / rect.width),
    y: (clientY - rect.top) * (H / rect.height)
  };
}

// --- Обработка касаний по канвасу (для меню) ---
canvas.addEventListener('touchstart', e => {
  e.preventDefault();
  const touch = e.touches[0];
  const coords = getCanvasCoords(touch.clientX, touch.clientY);
  
  // Обновляем координаты "мыши" для наведения на Никиту
  mouse.x = coords.x;
  mouse.y = coords.y;
  
  // Проверяем, попал ли палец в кнопку "Биться за смены"
  if (gameState === 'menu') {
    const btn = startButton;
    if (mouse.x >= btn.x && mouse.x <= btn.x + btn.w &&
        mouse.y >= btn.y && mouse.y <= btn.y + btn.h) {
      startGame();
      return;
    }
  }
}, { passive: false });

// --- Виртуальные кнопки ---
function bindMobileButton(id, keyCode) {
  const btn = document.getElementById(id);
  if (!btn) return;

  const press = (e) => {
    e.preventDefault();
    keys[keyCode] = true;
    // Если нажата кнопка "A", и мы в меню, запускаем игру (на всякий случай)
    if (keyCode === 'Space' && gameState === 'menu') {
      startGame();
    }
  };
  
  const release = (e) => {
    e.preventDefault();
    keys[keyCode] = false;
  };

  btn.addEventListener('touchstart', press, { passive: false });
  btn.addEventListener('touchend', release, { passive: false });
  btn.addEventListener('touchcancel', release, { passive: false });
  
  // Для тестирования на ПК
  btn.addEventListener('mousedown', press);
  btn.addEventListener('mouseup', release);
  btn.addEventListener('mouseleave', release);
}

// Привязываем кнопки
bindMobileButton('btn-left', 'ArrowLeft');
bindMobileButton('btn-right', 'ArrowRight');
bindMobileButton('btn-action', 'Space'); // Прыжок

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