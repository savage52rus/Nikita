const keys = {};
const mouse = { x: 0, y: 0, isDown: false };

addEventListener('keydown', e => {
  keys[e.code] = true;
  if (e.code === 'Space' || e.code.startsWith('Arrow')) e.preventDefault();
  if (e.code === 'KeyM') soundEnabled = !soundEnabled;
});
addEventListener('keyup', e => keys[e.code] = false);

canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = (e.clientX - rect.left) * (W / rect.width);
  mouse.y = (e.clientY - rect.top) * (H / rect.height);
});
canvas.addEventListener('mousedown', () => mouse.isDown = true);
canvas.addEventListener('mouseup', () => mouse.isDown = false);

// --- Функция позиционирования невидимой HTML-кнопки ---
function updateHtmlStartButton() {
  const htmlBtn = document.getElementById('html-start-btn');
  if (!htmlBtn) return;

  if (gameState === 'menu') {
    htmlBtn.classList.add('active');
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = rect.width / W;
    const scaleY = rect.height / H;
    
    const btn = startButton;
    
    // Позиционируем точно над нарисованной кнопкой
    htmlBtn.style.left = (btn.x * scaleX) + 'px';
    htmlBtn.style.top = (btn.y * scaleY) + 'px';
    htmlBtn.style.width = (btn.w * scaleX) + 'px';
    htmlBtn.style.height = (btn.h * scaleY) + 'px';
  } else {
    htmlBtn.classList.remove('active');
  }
}

// --- Обработчик клика по невидимой стартовой кнопке ---
let startClicked = false;
document.getElementById('html-start-btn').addEventListener('click', (e) => {
  if (startClicked) return;
  startClicked = true;
  
  if (gameState === 'menu') {
    startGame();
  }
  
  setTimeout(() => { startClicked = false; }, 500);
});

// --- Обработка касаний по канвасу (для наведения на Никиту) ---
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
    
    // Запуск игры по кнопке "A" в меню
    if (keyCode === 'Space' && gameState === 'menu') {
      startGame();
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

// Привязываем кнопки
bindMobileButton('btn-left', 'ArrowLeft');
bindMobileButton('btn-right', 'ArrowRight');
bindMobileButton('btn-action', 'Space'); // Прыжок
bindMobileButton('btn-throw', 'KeyE');   // Метание молота

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
  if (gameState !== 'menu') update();
  else menuTime += 16;
  draw();
  requestAnimationFrame(loop);
}

loop();