

class Player {
  constructor() {
    this.pos = createVector(0, 0);
    this.vel = createVector(0, 0);
    this.dir = createVector(0, 0);
    this.r = 0;
    this.hp = maxHP;
    this.bCool = 0; // Bullet Cooldown
    this.invincibility = 120; // Post-Hit Invincibility
    this.healthPots = 2; // Health Potion Quantity
    this.healCool = 0;
    this.rolling = false; // Is Rolling
    this.rollCooldown = 0; // Roll Cooldown
    this.rollFrame = 0; // Current Frame of Role
    this.gunType = 0; //0-Normal | 1-Quad | 2 - Circle
    this.gunTimer = 0; // Counts down to 0
    this.deathRoll = true;
    this.deathRollCooldown = 0;
  }
  update() {
    this.draw();
    this.input();
    this.move();
    this.enemyBulletCollide();
    //Lower
    if (this.bCool > 0) this.bCool--;
    if (this.invincibility > 0) this.invincibility--;
    if (this.healCool > 0) this.healCool--;
    if (this.rollCooldown > 0) this.rollCooldown--;
    if (this.gunTimer > 0) this.gunTimer--;
    if (this.deathRollCooldown > 0) this.deathRollCooldown--;

    //
    if (this.rolling) this.roll();

    if (this.hp > maxHP) this.hp = maxHP;
    if (this.gunTimer <= 0) this.gunType = 0;
    if (this.deathRollCooldown <= 0) {
      this.deathRoll = false;
      rollCooldown = maxRollCooldown;
    }
  }
  draw() {
    push();
    rectMode(CENTER);
    fill("lavender");
    translate(width / 2, height / 2);
    rotate(this.r);
    rect(0, 0, 20, 20);
    //Invicibility Arc
    rotate(-this.r);

    noFill();
    arc(0, 0, 40, 40, -90, map(this.invincibility, 60, 0, 270, -90));
    //Boss 
    if (boss.hp > 0) {
      //Attack
      if (boss.currentAttack == 4) {
        fill("orange");
        rect(-290, 0, 20, 20);
        rect(290, 0, 20, 20);
      }
      // Cursor
      let ban = atan2(boss.pos.y - player.pos.y, boss.pos.x - player.pos.x);
      let off = map(
        dist(this.pos.x, this.pos.y, boss.pos.x, boss.pos.y),
        0,
        300,
        10,
        50,
        true
      );
      fill("white");
      translate(off * cos(ban), off * sin(ban));
      rotate(ban + 90);
      triangle(-5, 5, 5, 5, 0, -5);
    }
    pop();
  }
  move() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;

    this.r = atan2(mouseY - height / 2, mouseX - width / 2);

    if (this.pos.x > 1000) this.pos.x = 1000;
    if (this.pos.x < -1000) this.pos.x = -1000;
    if (this.pos.y > 1000) this.pos.y = 1000;
    if (this.pos.y < -1000) this.pos.y = -1000;
  }
  manageShoot() {
    if (this.bCool <= 0) {
      switch (this.gunType) {
        case 0:
          this.shoot();
          break;
        case 1:
          this.quadShoot();
          break;
        case 2:
          this.cShoot();
          break;
        case 3:
          this.lineShoot();
          break;
        case 4:
          this.fastShoot();
          break;
      }

      if (this.bCool == 0) this.bCool = bCoolMax;
    }
  }
  shoot() {
    let xOff = 10;
    let yOff = 10;

    bullets.push(
      new Bullet(
        this.pos.x + cos(this.r) * xOff,
        this.pos.y + sin(this.r) * yOff,
        player.r,
        10,
        10,
        "white"
      )
    );
    this.vel.x += cos(this.r) * -1;
    this.vel.y += sin(this.r) * -1;
    this.bCool = bCoolMax;
  }
  bounceShoot() {
    let xOff = 10;
    let yOff = 10;

    bullets.push(
      new Bullet(
        this.pos.x + cos(this.r) * xOff,
        this.pos.y + sin(this.r) * yOff,
        player.r,
        10,
        10,
        "white",
        0,
        1
      )
    );
    this.vel.x += cos(this.r) * -1;
    this.vel.y += sin(this.r) * -1;
    this.bCool = bCoolMax;
  }
  quadShoot() {
    for (let a = this.r - 20; a < this.r + 20; a += 10) {
      bullets.push(
        new Bullet(this.pos.x + cos(a) * 10, this.pos.y + sin(a) * 10, a)
      );
      this.vel.x += cos(this.r) * -1;
      this.vel.y += sin(this.r) * -1;
    }
    this.bCool = quadCoolMax;
  }
  cShoot() {
    for (let a = 0; a < 360; a += 10) {
      this.r = a;
      bullets.push(
        new Bullet(
          this.pos.x + cos(this.r) * 10,
          this.pos.y + sin(this.r) * 10,
          player.r
        )
      );
    }
    this.bCool = circleCoolMax;
  }
  lineShoot() {
    for (let w = 0; w < 100; w += 20) {
      bullets.push(
        new Bullet(
          this.pos.x + cos(this.r) * w,
          this.pos.y + sin(this.r) * w,
          player.r
        )
      );
      this.vel.x += cos(this.r) * -1;
      this.vel.y += sin(this.r) * -1;
    }
    this.bCool = lineCoolMax;
  }
  fastShoot() {
    let xOff = 10;
    let yOff = 10;

    bullets.push(
      new Bullet(
        this.pos.x + cos(this.r) * xOff,
        this.pos.y + sin(this.r) * yOff,
        player.r
      )
    );
    this.vel.x += cos(this.r) * -1;
    this.vel.y += sin(this.r) * -1;
    this.bCool = fastCoolMax;
  }
  

  heal() {
    if (this.healthPots > 0) {
      this.hp += 2;
      this.healthPots--;
    }
  }
  roll() {
    if (this.rollFrame > 10) {
      this.rolling = false;
      this.rollFrame = 0;
      this.invincibility += 10;
      return;
    }
    this.pos.x += this.dir.x * (rollAmount / 10) * this.rollFrame;
    this.pos.y += this.dir.y * (rollAmount / 10) * this.rollFrame;
    this.rollCooldown = rollCooldown;
    this.rollFrame++;
  }
  input() {
    let maxVel = 5;
    let stoppingSpeed = 0.2;
    //Directional Movement
    this.maxVel();
    if (keyIsDown(87)) {
      this.dir.y = -1;
      this.vel.y -= 1;

      //
    } else if (keyIsDown(83)) {
      this.dir.y = 1;
      this.vel.y += 1;
    } else {
      this.dir.y = 0;
      this.vel.y += 0 - this.vel.y * stoppingSpeed;
    }
    if (keyIsDown(65)) {
      this.dir.x = -1;
      this.vel.x -= 1;
    } else if (keyIsDown(68)) {
      this.dir.x = 1;
      this.vel.x += 1;
    } else {
      this.dir.x = 0;
      this.vel.x += 0 - this.vel.x * stoppingSpeed;
    }
    //Non Movement

    //Shoot
    if (mouseIsPressed) {
      this.manageShoot();
    }

    //Heal
    if (keyIsDown(81) && this.healCool == 0 && this.hp < 5) {
      this.heal();
      this.healCool = 120;
    }
    //Roll
    if (keyIsDown(32) && this.rollCooldown == 0) {
      this.rolling = true;
      this.invincibility += 20;
    }
    if (keyIsDown(82) && this.quadBCool == 0) {
      this.quadShoot();
      this.quadBCool = 240;
    }
  }
  maxVel() {
    let maxVel = 6;
    let am = 0.1;
    while (this.vel.y < -maxVel) {
      this.vel.y += am;
    }
    while (this.vel.y > maxVel) {
      this.vel.y -= am;
    }
    while (this.vel.x < -maxVel) {
      this.vel.x += am;
    }
    while (this.vel.x > maxVel) {
      this.vel.x -= am;
    }
  }
  enemyBulletCollide() {
    for (let eb = 0; eb < enemyBullets.length; eb++) {
      if (circleRect(enemyBullets[eb].pos,enemyBullets[eb].r, this.pos, 20,20) && this.invincibility <= 0) {
        enemyBullets.splice(eb, 1);
        this.hp -= 1;
        this.invincibility = 60;
      }
    }
  }
}
