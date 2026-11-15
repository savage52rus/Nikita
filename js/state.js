let currentLevel = 0;
let level = null;
let player = null;
let enemies = [];
let octopuses = [];
let bags = [];
let hammers = [];
let camera = { x: 0 };
let particles = [];
let gameState = 'menu';
let stateTimer = 0;
let goldenPower = null;
let hammerCooldown = 0;
let boss = null;
let screenShake = 0;
let bossIntroTimer = 0;
let bossDefeated = false;
let hitFlash = 0;
let globalTime = 0;
let lastHoverState = false;

function createPlayer() {
  return {
    x: 50, y: 100, w: 30, h: 64,
    vx: 0, vy: 0, onGround: false, facing: 1,
    walkTime: 0, landTime: 0,
    hp: 5, maxHp: 5, invuln: 0, score: 0,
    powerTimer: 0
  };
}

function loadLevel(idx) {
  currentLevel = idx;
  level = LEVELS[idx];

  // Создаём врагов
  enemies = level.enemies.map(e => ({
    type: e.type, x: e.x, y: e.y, w: 26, h: 56,
    vx: 0, vy: 0, onGround: false, facing: -1,
    patrolMin: e.patrolMin, patrolMax: e.patrolMax,
    ...ENEMY_TYPES[e.type],
    state: 'patrol', walkTime: 0, alive: true
  }));

  // Создаём осьминогов
  octopuses = level.coins.map(c => ({
    x: c.x, y: c.y, r: 10, taken: false,
    phase: Math.random() * Math.PI * 2,
    tentaclePhase: Math.random() * Math.PI * 2
  }));

  // Бонус
  goldenPower = level.powerup ? {
    x: level.powerup.x, y: level.powerup.y, r: 18, taken: false,
    phase: Math.random() * Math.PI * 2
  } : null;

  // Сброс босса
  boss = null;
  bossIntroTimer = 0;
  bossDefeated = false; 

  if (level.isBossLevel) {
    boss = {
      x: 1050, y: 400, w: 40, h: 84,
      vx: 0, vy: 0, onGround: false, facing: -1,
      hp: 5, maxHp: 5, state: 'idle', walkTime: 0,
      attackTimer: 0, jumpCooldown: 0, throwCooldown: 0,
      hitFlash: 0, invuln: 0, phase: 1, jumpTargetX: 0
    };
    bossIntroTimer = 180;
    sfx.bossRoar();
  }

  // Сброс массивов
  bags = [];
  hammers = [];
  particles = [];
  camera.x = 0;
  hammerCooldown = 0;
  screenShake = 0;
  stateTimer = 0;

  // ВАЖНО: сброс игрока
  if (player) {
    player.x = 50;
    player.y = 100;
    player.vx = 0;
    player.vy = 0;
    player.powerTimer = 0;
    player.invuln = 0;
  }
}

function startGame() {
  player = createPlayer();
  loadLevel(0);
  gameState = 'playing';
  sfx.buttonClick();
}

player = createPlayer();