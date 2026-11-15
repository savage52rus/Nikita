// ==================== КОНСТАНТЫ ====================
const GRAVITY = 0.6;
const BASE_SPEED = 4;
const BASE_JUMP = -12;
const POWER_DURATION = 600;

// ==================== УРОВНИ ====================
const LEVELS = [
  {
    name: 'Улица', width: 1600,
    platforms: [
      {x:0, y:460, w:1600, h:80}, {x:250, y:360, w:140, h:15}, {x:450, y:280, w:120, h:15},
      {x:650, y:340, w:120, h:15}, {x:850, y:240, w:140, h:15}, {x:1050, y:320, w:120, h:15},
      {x:1250, y:220, w:140, h:15}
    ],
    coins: [
      {x:300, y:320}, {x:490, y:240}, {x:700, y:300},
      {x:900, y:200}, {x:1090, y:280}, {x:1300, y:180}
    ],
    enemies: [
      {type:'blonde', x:400, y:400, patrolMin:350, patrolMax:600},
      {type:'brunette', x:900, y:400, patrolMin:800, patrolMax:1100},
      {type:'redhead', x:1350, y:400, patrolMin:1250, patrolMax:1500}
    ],
    powerup: {x:950, y:180},
    exit: {x:1520, y:380, w:40, h:80}
  },
  {
    name: 'Крыши', width: 1800,
    platforms: [
      {x:0, y:460, w:400, h:80}, {x:500, y:380, w:200, h:15}, {x:800, y:300, w:200, h:15},
      {x:1100, y:380, w:200, h:15}, {x:1400, y:460, w:400, h:80}
    ],
    coins: [
      {x:550, y:340}, {x:650, y:340}, {x:850, y:260},
      {x:950, y:260}, {x:1150, y:340}, {x:1250, y:340}
    ],
    enemies: [
      {type:'redhead', x:550, y:320, patrolMin:500, patrolMax:680},
      {type:'blonde', x:1150, y:320, patrolMin:1100, patrolMax:1280},
      {type:'brunette', x:1500, y:400, patrolMin:1400, patrolMax:1750}
    ],
    powerup: {x:900, y:240},
    exit: {x:1700, y:380, w:40, h:80}
  },
  {
    name: 'Парк', width: 2000,
    platforms: [
      {x:0, y:460, w:2000, h:80}, {x:200, y:360, w:100, h:15}, {x:400, y:260, w:100, h:15},
      {x:600, y:360, w:100, h:15}, {x:800, y:260, w:100, h:15}, {x:1000, y:360, w:100, h:15},
      {x:1200, y:260, w:100, h:15}, {x:1400, y:360, w:100, h:15}, {x:1600, y:260, w:100, h:15}
    ],
    coins: [
      {x:230, y:320}, {x:430, y:220}, {x:630, y:320},
      {x:830, y:220}, {x:1030, y:320}, {x:1230, y:220},
      {x:1430, y:320}, {x:1630, y:220}
    ],
    enemies: [
      {type:'blonde', x:350, y:400, patrolMin:250, patrolMax:500},
      {type:'brunette', x:750, y:400, patrolMin:700, patrolMax:950},
      {type:'redhead', x:1150, y:400, patrolMin:1100, patrolMax:1350},
      {type:'blonde', x:1550, y:400, patrolMin:1500, patrolMax:1750}
    ],
    powerup: {x:1100, y:210},
    exit: {x:1900, y:380, w:40, h:80}
  },
  {
    name: 'Склад', width: 2200,
    platforms: [
      {x:0, y:460, w:2200, h:80}, {x:150, y:380, w:100, h:15}, {x:300, y:300, w:100, h:15},
      {x:450, y:220, w:100, h:15}, {x:600, y:340, w:100, h:15}, {x:750, y:260, w:100, h:15},
      {x:950, y:180, w:120, h:15}, {x:1100, y:300, w:100, h:15}, {x:1250, y:220, w:100, h:15},
      {x:1400, y:120, w:140, h:15}, {x:1600, y:280, w:100, h:15}, {x:1750, y:200, w:100, h:15},
      {x:1900, y:340, w:100, h:15}
    ],
    coins: [
      {x:180, y:340}, {x:330, y:260}, {x:480, y:180},
      {x:630, y:300}, {x:780, y:220}, {x:1000, y:140},
      {x:1130, y:260}, {x:1280, y:180}, {x:1630, y:240}
    ],
    enemies: [
      {type:'brunette', x:250, y:400, patrolMin:150, patrolMax:400},
      {type:'blonde', x:650, y:400, patrolMin:550, patrolMax:850},
      {type:'redhead', x:1050, y:400, patrolMin:950, patrolMax:1200},
      {type:'brunette', x:1500, y:400, patrolMin:1400, patrolMax:1700},
      {type:'redhead', x:1850, y:400, patrolMin:1750, patrolMax:2050}
    ],
    powerup: {x:1470, y:80},
    exit: {x:2100, y:380, w:40, h:80}
  },
  {
    name: 'Склад: Комната Ирины', width: 1400,
    platforms: [
      {x:0, y:460, w:1400, h:80}, {x:100, y:380, w:80, h:15}, {x:220, y:320, w:80, h:15},
      {x:500, y:360, w:120, h:15}, {x:700, y:280, w:120, h:15},
      {x:900, y:360, w:120, h:15}, {x:1100, y:280, w:120, h:15}
    ],
    coins: [
      {x:140, y:340}, {x:260, y:280},
      {x:550, y:320}, {x:750, y:240}, {x:950, y:320}, {x:1150, y:240}
    ],
    enemies: [],
    powerup: {x:300, y:260},
    exit: {x:1350, y:380, w:40, h:80},
    isBossLevel: true
  }
];

// ==================== ТИПЫ ВРАГОВ ====================
const ENEMY_TYPES = {
  blonde:   { color: '#ff6b9d', hair: '#f4d03f', speed: 1.5, chaseSpeed: 2.5, throwRate: 0.008 },
  brunette: { color: '#9b59b6', hair: '#1a1a1a', speed: 1.2, chaseSpeed: 2.0, throwRate: 0.012 },
  redhead:  { color: '#e74c3c', hair: '#c0392b', speed: 1.8, chaseSpeed: 3.0, throwRate: 0.006 }
};
