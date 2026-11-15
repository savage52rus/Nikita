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
