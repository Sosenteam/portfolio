let gameStarted = false;
let gameOver = false;
//
let player;
let boss;
let bullets = [];
let enemyBullets = [];
let shockwave = [];
let zombies = [];
let gunners = [];
let turrets = [];
let powerups = [];
//
let score = 0;
let wave = 0;
let currentWaveTime = 0;
//
let roboto;
let robotoL;
let music;
let introMusic;
let introMusicStarted = false;
function preload() {
  roboto = loadFont("zAssets/fonts/Roboto-Light.ttf");
  robotoL = loadFont("zAssets/fonts/Roboto-Thin.ttf");
}

function setup() {
  music = createAudio("zAssets/music.mp3");
  angleMode(DEGREES);
  createCanvas(windowWidth, windowHeight);
  player = new Player();
  boss = new Boss();
  
for(let i = 0; i<20; i++){
  let hMax = round(random(3,10))
  let newArr = [];
  for(let h = 0; h<hMax; h++){
    newArr.push(round(random(0,10)))
  }
  attackArrOptions.push(newArr)
}
}

function draw() {
  //Music
  music.volume(0.01);
  //Skip Wave
  if (keyIsDown(80) && frameCount % 10 == 0) {
    zombies = [];
    gunners = [];
    turrets = [];

    boss.hp = 0;
  }

  if (gameStarted && !gameOver) {
    background("#7393B3");
    //Non Camera Centered
    push();
    translate(width / 2 - player.pos.x, height / 2 - player.pos.y);

    displayMap();
    updateAll();
    pop();
    //Camera Centered
    player.update();
    displayUI();

    //Updates
    manageWaves();
    if (player.hp <= 0) {
      gameOver = true;
    }
    //
  } else if (!gameOver && !gameStarted) {
    startScreen();
  } else if (gameOver) {
    endScreen();
    //Check for reset
    if (keyIsDown(82)) {
      reset();
    }
  }
  if (keyIsDown(77)) {
    music.stop();
  }
}

function updateAll() {
  //PowerUps
  for (let p of powerups) {
    p.update();
  }
  powerups.forEach(function (p, i) {
    if (p.hp <= 0) {
      powerups.splice(i, 1);
    }
  });

  //Update Bullets
  for (let b of bullets) {
    b.update();
  }
  while (bullets.length >= 500) {
    bullets.shift();
  }
  for (let eb of enemyBullets) {
    eb.update();
  }
  while (enemyBullets.length >= 2500) {
    enemyBullets.shift();
  }
  //Update Zombies
  for (let z of zombies) {
    z.update();
  }
  zombies.forEach(function (z, i) {
    if (z.hp <= 0) {
      zombies.splice(i, 1);
    }
  });

  //Update Gunners
  for (let g of gunners) {
    g.update();
  }
  gunners.forEach(function (g, i) {
    if (g.hp <= 0) {
      gunners.splice(i, 1);
    }
  });
  //Update Turrets
  for (let t of turrets) {
    t.update();
  }
  turrets.forEach(function (t, i) {
    if (t.hp <= 0) {
      turrets.splice(i, 1);
    }
  });
  //Boss
  if (boss.hp > 0) boss.update();
}
function manageWaves() {
  currentWaveTime++;

  if (!isWaveOver()) return;
  score+=wave;
  //
  zombies = [];
  gunners = [];
  turrets = [];
  wave++;
  player.invincibility = 60;

  enemyBullets = [];
  zAmount.push(floor(random(0, 30)));
  gAmount.push(floor(random(0, 30)));
  tAmount.push(floor(random(0, 5)));
  if (wave % 5 == 0) {
    bSpawn.push(0);
    bSpawn.push(0);
    bSpawn.push(0);
    bSpawn.push(0);

    bSpawn.push({
      a: random(attackArrOptions),
      hp: round(random(50, 200)),
      b: round(random(20, 60)),
    });
  }

  //Boss & Enemy Spawns
  if (bSpawn[wave]) {
    if (player.hp < 3) player.hp++;
    boss.hp = bSpawn[wave].hp;
    bossMaxHP = bSpawn[wave].hp;
    boss.attackArr = bSpawn[wave].a;
    bossAttackCool = bSpawn[wave].b;
  } else {
    for (let i = 0; i < zAmount[wave]; i++) {
      zombies.push(new Zombie());
    }
    for (let i = 0; i < gAmount[wave]; i++) {
      gunners.push(new Gunner());
    }
    for (let i = 0; i < tAmount[wave]; i++) {
      turrets.push(new Turret());
    }
  }
  //Powerups
  for (let i = 0; i < 2; i++) {
    if (boss.hp > 0) {
      powerups.push(new PowerUp("Health"));
    }
    powerups.push(new PowerUp());
  }
  //Reset WaveTime
  currentWaveTime = 0;
}
function isWaveOver() {
  for (let z of zombies) {
    if (z.hp > 0) return false;
  }
  for (let g of gunners) {
    if (g.hp > 0) return false;
  }
  for (let t of turrets) {
    if (t.hp > 0) return false;
  }
  if (boss.hp > 0) return false;
  return true;
}
function displayMap() {
  push();
  rectMode(CENTER);
  rect(0, 0, 200);
  for (let i = 10; i > 0; i--) {
    fill("white");
    if (i % 2 == 0) fill("lightgrey");
    rect(0, 0, i * 200);
  }
  pop();
}
function reset() {
  music.stop();
  player = new Player();
  boss = new Boss();
  boss.hp = 0;
  bullets = [];
  enemyBullets = [];
  zombies = [];
  gunners = [];
  powerups = [];
  turrets = [];
  wave = 0;
  score = 0;
  gameOver = false;
  gameStarted = true;
  music.play();
}
