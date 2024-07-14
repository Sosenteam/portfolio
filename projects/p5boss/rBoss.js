class Boss {
  constructor(x, y, hp, attackArr = [1, 2, 3, 4, 5, 6, 7, 8, 9,10]) {
    //Movement
    this.pos = createVector(100, 100);
    this.vel = createVector(0, 0);
    this.dir = createVector(0, 0);
    //Health
    this.hp = 0;
    this.invincibility = 0;
    //Attack Cooldown
    this.maxAttackCool = bossAttackCool;
    this.attackCool = this.maxAttackCool;
    //Attack
    this.currentAttack = 1;
    this.attackFrame = 10;
    this.attackLength = 1;
    this.attackArr = attackArr;
    //Dash
    this.dashCool = 60;
    //Rage
    this.enraged = false;
  }
  update() {
    if (boss.hp <= 0) return;
    this.draw();
    this.collideBullet();
    this.collidePlayer();
    this.manageAttacks();
    this.move();

    if (this.invincibility > 0) this.invincibility--;
    if (this.attackCool > 0) this.attackCool--;
    //Rage
    if (this.enraged) this.maxAttackCool = bossAttackCool / 2;
    if (this.hp < 10) this.enraged = true;
  }
  move() {
    //Get Dir to player and round
    let dir = atan2(player.pos.x - boss.pos.x, player.pos.y - boss.pos.y);
    let rdir = round(dir / 45) * 45;

    if (this.dashCool > 0) this.dashCool--;

    this.pos.add(this.vel);

    if (this.dashCool == 0) {
      this.vel.x = bossSpeed * sin(rdir);
      this.vel.y = bossSpeed * cos(rdir);
      this.dashCool = 60;
    }
    this.vel.x *= 0.95;
    this.vel.y *= 0.95;
  }
  draw() {
    push();
    rectMode(CENTER);
    fill("orange");
    translate(this.pos);
    rect(0, 0, 100, 80);
    rect(0, -30, 40, 40);
    rect(-45, 0, 20, 55);
    rect(45, 0, 20, 55);
    pop();
  }
  manageAttacks() {
    if (this.attackFrame > 0) this.attackFrame--;
    //
    if (this.attackCool == 0) {
      if (this.attackFrame == 0) {
        this.attackCool = this.maxAttackCool;
        this.currentAttack = random(this.attackArr);
        // this.currentAttack = 10;
      }
      switch (this.currentAttack) {
        case 1:
          this.aBulletGrid();
          break;
        case 2:
          this.aBulletCircle();
          break;
        case 3:
          this.aBulletQuad();
          if (this.attackFrame == 0) {
            this.attackFrame = 100 * this.attackLength;
            this.dashCool = 120 * this.attackLength;
          }
          break;
        case 4:
          if (this.attackFrame == 0) {
            this.attackFrame = 100 * this.attackLength;
            this.dashCool = 120 * this.attackLength;
            break;
          }
          if (this.attackFrame % 5 == 0) this.aBulletPlayer();

          break;
        case 5:
          this.aBulletRand();
          break;
        case 6:
          if (this.attackFrame % 5 == 0) this.aBulletHome();
          if (this.attackFrame == 0) {
            this.attackFrame = 100 * this.attackLength;
            this.dashCool = 120 * this.attackLength;
          }
          break;
        case 7:
          this.aBulletBounce();
          break;
        case 8:
          this.aBulletRandSide();
          break;
        case 9:
          this.aSpawnTurret();
          break;
          case 10:
          if(this.attackFrame % 20 == 0)this.aBulletBig();
          if (this.attackFrame == 0) {
            this.attackFrame = 100 * this.attackLength;
            this.dashCool = 120 * this.attackLength;
          }
          break;
      }
      //
    }
  }
  aBulletGrid() {
    for (let x = -1000; x < 1000; x += 100) {
      enemyBullets.push(new Bullet(x, 1000, -90, 8, 10, "orange"));
    }

    for (let y = -1000; y < 1000; y += 100) {
      enemyBullets.push(new Bullet(1000, y, -180, 8, 10, "orange"));
    }
  }
  aBulletCircle() {
    for (let a = 0; a < 360; a += 10) {
      enemyBullets.push(
        new Bullet(
          this.pos.x + cos(a) * 10,
          this.pos.y + sin(a) * 10,
          a,
          8,
          10,
          "orange"
        )
      );
    }
  }
  aBulletQuad() {
    for (let i = -180; i < 180; i += 90) {
      enemyBullets.push(
        new Bullet(this.pos.x, this.pos.y, i, 8, 10, "orange", 0, 1)
      );
      enemyBullets.push(
        new Bullet(this.pos.x, this.pos.y, i + 45, 8, 10, "orange", 0, 2)
      );
    }
  }
  aBulletRand() {
    for (let i = 0; i < 30; i++) {
      if (player.pos.y > 0) {
        enemyBullets.push(
          new Bullet(random(1000, -1000), -1000, 90, random(5, 8), 10, "orange")
        );
      }
      if (player.pos.y <= 0) {
        enemyBullets.push(
          new Bullet(random(1000, -1000), 1000, -90, random(5, 8), 10, "orange")
        );
      }
    }
  }
  aBulletRandSide() {
    for (let i = 0; i < 30; i++) {
      if (player.pos.x > 0) {
        enemyBullets.push(
          new Bullet(
            -1000,
            random(1000, -1000),
            360,
            random(5, 8),
            10,
            "orange"
          )
        );
      }
      if (player.pos.x <= 0) {
        enemyBullets.push(
          new Bullet(1000, random(1000, -1000), 180, random(5, 8), 10, "orange")
        );
      }
    }
  }
  aBulletPlayer() {
    //PREDICT BASED ON PLAYER VEL

    enemyBullets.push(
      new Bullet(player.pos.x + 300, player.pos.y, 180, 8, 10, "orange")
    );
    enemyBullets.push(
      new Bullet(player.pos.x - 300, player.pos.y, 0, 8, 10, "orange")
    );
  }
  aSpawnTurret() {
    turrets.push(new Turret(this.pos.x, this.pos.y,3));
  }
  aBulletHome() {
    enemyBullets.push(
      new Bullet(
        this.pos.x,
        this.pos.y,
        random(-180, 180) +
          -atan2(player.pos.y - this.pos.y, player.pos.x - this.pos.x),
        5,
        10,
        "#FFD580",
        0,
        false,
        false,
        true,
        player.pos,
        150
      )
    );
  }
  aBulletBounce() {
    for (let i = 0; i < 20; i++) {
      enemyBullets.push(
        new Bullet(
          this.pos.x,
          this.pos.y,
          atan2(player.pos.y - this.pos.y, player.pos.x - this.pos.x) +
            random(-25, 25),
          8,
          10,
          "orange",
          0,
          4,
          true,
          false
        )
      );
    }
  }
  aBulletBig() {
    if (this.pos.dist(player.pos)>120) {
      enemyBullets.push(
        new Bullet(
          this.pos.x,
          this.pos.y,
          atan2(player.pos.y - this.pos.y, player.pos.x - this.pos.x) +
            random(-50, 50),
          4,
          250,
          "rgba(255,165,0,0.53)",
          0,
          1
        )
      );
    }
  }

  collideBullet() {
    for (let b = 0; b < bullets.length; b++) {
      if (circleRect(bullets[b].pos, bullets[b].r, this.pos, 100, 80)) {
        bullets.splice(b, 1);
        if (this.invincibility > 0) return;
        this.hp--;
        this.invincibility = 3;
        if (this.hp == 0) {
          player.healthPots++;
          turrets = [];
        }
      }
    }
  }
  collidePlayer() {
    if (
      rectRect(this.pos, 100, 80, player.pos, 20, 20) &&
      player.hp > 0 &&
      player.invincibility <= 0
    ) {
      player.hp--;
      player.invincibility = 60;
    }
  }
}
