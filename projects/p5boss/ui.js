function displayUI() {
  //POS
  text(round(player.pos.x) + "  " + round(player.pos.y), 100, 100);
  //Health
  uiHealthBar();
  //HEALTH POPTIONS
  uiHealthPotion();
  
  //ROLL BAR
  uiRollBar();
  //Boss Bar
  uiBossBar();
  //POWERUP DISPLAY
  uiPowerupDisplay();
  //ENEMY COUNT
  uiEnemyCount();
  //SCORE
  uiText();
}
function uiHealthBar() {
  push();
  strokeWeight(20);
  line(20, 20, 420, 20);
  stroke("limegreen");
  strokeWeight(10);
  line(20, 20, map(player.hp, 0, maxHP, 20, 420, true), 20);
  pop();
}
function uiHealthPotion() {
  push();
  for (let i = 0; i < player.healthPots; i++) {
    stroke("red");
    fill("orangered");
    ellipse((i + 1) * 20, 80, 10);
  }
  pop();
}
function uiText() {
  push();
  textSize(25);
  textFont(roboto);
  text(score, width / 2, 30);
  textSize(50);
  textFont(robotoL)
  textAlign(CENTER, CENTER);
  if (currentWaveTime < 100) {
    fill(0,0,0,map(currentWaveTime, 0, 100, 255, 0));
    text("Wave : " + wave, width / 2, height / 2 + 250);
  }
  pop();
}
function uiRollBar() {
  push();
  strokeWeight(20);
  line(20, 50, 220, 50);
  stroke("aqua");
  strokeWeight(10);
  line(20, 50, map(player.rollCooldown, 0, maxRollCooldown, 220, 20, true), 50);
  pop();
}
function uiBossBar() {
  if (boss.hp > 0) {
    push();
    strokeWeight(20);
    line(200, height - 50, width - 200, height - 50);
    stroke("orange");
    strokeWeight(10);
    line(
      200,
      height - 50,
      map(boss.hp, 0, bossMaxHP, 200, width - 200),
      height - 50
    );
    pop();
  }
}
function uiPowerupDisplay() {
  push();
  if (player.gunTimer > 0 || player.deathRollCooldown > 0) {
    switch (player.gunType) {
      case 1:
        fill("orange");
        break;
      case 2:
        fill("blue");
        break;
      case 3:
        fill("aqua");
        break;
      case 4:
        fill("lime");
        break;
      default:
        fill("gray");
        break;
    }
    rect(30, 100, 20, 20);
    noFill();

    arc(40, 110, 30, 30, -90, map(player.gunTimer, 240, 0, 270, -90));
    if (player.deathRollCooldown > 0) {
      arc(
        40,
        110,
        30,
        30,
        -90,
        map(player.deathRollCooldown, 240, 0, 270, -90)
      );
    }
  }
  pop();
}
function uiEnemyCount() {
  push();
  textSize(25);
  textFont(roboto);
  textAlign(CENTER, CENTER);

  fill("green");
  if (zombies.length > 0) {
    text(zombies.length, width - 200, 50);
  }
  fill("teal");
  if (gunners.length > 0) {
    text(gunners.length, width - 50, 50);
  }

  pop();
}

function startScreen() {
  push();
  textFont(robotoL);
  textAlign(CENTER, CENTER);
  background("lightblue");
  textSize(80);
  text("Overdrive", width / 2, height / 4);
  textSize(40);
  text("Press Any Button To Start", width / 2, (height / 4) * 1.3);
  textSize(25);
  textFont(roboto);

  text("WASD - Movement", width / 2, (height / 4) * 2.5);
  text("Space - Dash", width / 2, (height / 4) * 2.7);
  text("Q - Heal", width / 2, (height / 4) * 2.9);
  text("Click - Shoot", width / 2, (height / 4) * 3.1);
  text("M - Mute Audio",width/2,(height/4)*3.6)

  if (keyIsPressed) {
    gameStarted = true;
    music.play();
    music.loop();
  }
  pop();
}
function endScreen() {
  background("#ff4e4e");
  music.stop();
  push();
  translate(width / 2 - player.pos.x, height / 2 - player.pos.y);
  displayMap();
  for (let b of bullets) {
    b.update();
  }
  while (bullets.length >= 500) {
    bullets.shift();
  }
  push();
  textAlign(CENTER, CENTER);
  textFont(roboto);
  textSize(100);
  text("GAME OVER", 0, -340);
  text("GAME OVER", 0, -740);
  text("GAME OVER", 0, 350);
  text("GAME OVER", 0, 750);
  textSize(60);
  text("PRESS R TO RESTART", 0, 450);
  text("PRESS R TO RESTART", 0, -440);

  pop();
  pop();
  player.update();
}
