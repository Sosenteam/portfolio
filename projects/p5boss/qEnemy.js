class Zombie {
  constructor() {
    this.vel = createVector(zombieSpeed, zombieSpeed);
    this.r = 0;
    this.hp = 2;
    this.damageTime = 0;
    //POS CHECK
    let spawnAttempts = 0;
    do {
      this.pos = createVector(random(-1000, 1000), random(-1000, 1000));
      if (spawnAttempts > 10) break;
      spawnAttempts++;
    } while (this.collideZombie() || this.collideGunner());
  }
  update() {
    if (this.hp <= 0) return;
    if (this.hp > 0) this.draw();
    this.move();
    this.collideZombie();
    this.collideGunner();
    this.collidePlayer();
    this.collideBullet();
    //
    if (this.damageTime > 0) this.damageTime--;
  }
  move() {
    this.r = atan2(player.pos.y - this.pos.y, player.pos.x - this.pos.x);
    this.pos.x += cos(this.r) * this.vel.x;
    this.pos.y += sin(this.r) * this.vel.y;
  }
  draw() {
    push();
    translate(this.pos);
    rotate(this.r);
    fill(
      lerpColor(color("green"), color("red"), map(this.damageTime, 0, 5, 0, 1))
    );
    rectMode(CENTER);
    rect(0, 0, 20, 20);
    pop();
  }
  collideZombie() {
    let r = false;
    for (let z of zombies) {
      if (rectRect(this.pos, 20, 20, z.pos, 20, 20) && z.hp > 0) {
        if (dist(this.pos.x, this.pos.y, z.pos.x, z.pos.y) < 1) continue;

        this.pos.x -= cos(this.r) * this.vel.x;
        this.pos.y -= sin(this.r) * this.vel.y;
        r = true;
      }
    }
    return r;
  }
  collideGunner() {
    let r = false;
    for (let g of gunners) {
      if (rectRect(this.pos, 20, 20, g.pos, 20, 20) && g.hp > 0) {
        this.pos.x -= cos(this.r) * this.vel.x;
        this.pos.y -= sin(this.r) * this.vel.y;
        r = true;
      }
    }
    return r;
  }
  collidePlayer() {
    if (rectRect(this.pos, 20, 20, player.pos, 20, 20) && player.hp > 0) {
      this.pos.x -= cos(this.r) * this.vel.x;
      this.pos.y -= sin(this.r) * this.vel.y;
      if (player.deathRoll) {
        this.hp = 0;
        return;
      }
      if (player.invincibility == 0) {
        player.hp -= 1;
        player.invincibility = 60;
      }
    }
  }
  collideBullet() {
    for (let b = 0; b < bullets.length; b++) {
      if (
        circleRect(bullets[b].pos, bullets[b].r, this.pos, 20, 20) &&
        this.hp > 0
      ) {
        bullets.splice(b, 1);
        score++;
        this.hp -= 1;
        this.damageTime = 10;
        if (round(random(1, powerUpSpawnProb)) == 2 && this.hp == 0) {
          powerups.push(new PowerUp(undefined, this.pos.x, this.pos.y));
        }
      }
    }
  }
}
////////
class Gunner {
  constructor() {
    this.vel = createVector(2, 2);
    this.r = 0;
    this.hp = 1;
    this.damageTime = 0;
    this.bCool = round(random(100, 240));

    //POS CHECK
    let spawnAttempts = 0;
    do {
      this.pos = createVector(random(-1000, 1000), random(-1000, 1000));
      if (spawnAttempts > 10) break;
      spawnAttempts++;
    } while (this.collideZombie() || this.collideGunner());
  }
  update() {
    if (this.hp <= 0) return;
    this.draw();
    this.move();
    this.shoot();
    this.collideZombie();
    this.collideGunner();
    this.collidePlayer();
    this.collideBullet();
    //
    if (this.damageTime > 0) this.damageTime--;
    if (this.bCool > 0) this.bCool--;
  }
  move() {
    this.r = atan2(player.pos.y - this.pos.y, player.pos.x - this.pos.x);
    this.pos.x += cos(this.r) * this.vel.x;
    this.pos.y += sin(this.r) * this.vel.y;
  }
  draw() {
    push();
    translate(this.pos);
    rotate(this.r);
    fill(
      lerpColor(color("teal"), color("red"), map(this.damageTime, 0, 5, 0, 1))
    );
    rectMode(CENTER);
    rect(0, 0, 20, 20);
    rect(16, 0, 12, 10);
    pop();
  }
  collideZombie() {
    let r = false;
    for (let z of zombies) {
      if (rectRect(this.pos, 20, 20, z.pos, 20, 20) && z.hp > 0) {
        r = true;
      }
    }
    return r;
  }
  collideGunner() {
    let r = false;
    for (let g of gunners) {
      if (rectRect(this.pos, 20, 20, g.pos, 20, 20) && g.hp > 0) {
        if (dist(this.pos.x, this.pos.y, g.pos.x, g.pos.y) < 1) continue;
        this.pos.x -= cos(this.r) * this.vel.x;
        this.pos.y -= sin(this.r) * this.vel.y;
        r = true;
      }
    }
    return r;
  }

  collidePlayer() {
    if (rectRect(this.pos, 20, 20, player.pos, 20, 20)) {
      this.pos.x -= cos(this.r) * this.vel.x;
      this.pos.y -= sin(this.r) * this.vel.y;
      if (player.deathRoll) {
        this.hp = 0;
        return;
      }
      if (player.invincibility <= 0) {
        player.hp -= 1;
        player.invincibility = 60;
      }
    }
  }
  collideBullet() {
    for (let b = 0; b < bullets.length; b++) {
      if (
        circleRect(bullets[b].pos, bullets[b].r, this.pos, 20, 20) &&
        this.hp > 0
      ) {
        bullets.splice(b, 1);
        score++;
        this.hp -= 1;
        this.damageTime = 10;
        if (round(random(1, powerUpSpawnProb)) == 2 && this.hp == 0) {
          powerups.push(new PowerUp(undefined, this.pos.x, this.pos.y));
        }
      }
    }
  }
  shoot() {
    while (enemyBullets.length > 10000) {
      enemyBullets.shift();
    }
    if (this.bCool <= 0) {
      enemyBullets.push(
        new Bullet(
          this.pos.x + cos(this.r) * 10,
          this.pos.y + sin(this.r) * 10,
          this.r,
          8,
          10,
          "red"
        )
      );
      this.bCool = round(random(40, 200));
    }
  }
}

//
class Turret {
  constructor(x, y, hp = 5) {
    this.r = 0;
    this.hp = hp;
    this.damageTime = 0;
    this.bCool = 100;
    this.pos = createVector(random(-750, 750), random(-750, 750));
    if (x && y) {
      this.pos.set(x, y);
    }
  }
  update() {
    if (this.hp <= 0) return;
    this.draw();
    this.move();
    this.shoot();
    this.collidePlayer();
    this.collideBullet();
    //
    if (this.damageTime > 0) this.damageTime--;
    if (this.bCool > 0) this.bCool--;
  }
  move() {
    this.r = atan2(player.pos.y - this.pos.y, player.pos.x - this.pos.x);
  }
  draw() {
    push();
    translate(this.pos);
    fill("#0047AB96");
    rectMode(CENTER);
    rect(0, 0, 50, 50);
    rotate(this.r);

    fill(
      lerpColor(
        color("#0047ab"),
        color("red"),
        map(this.damageTime, 0, 5, 0, 1)
      )
    );
    rectMode(CENTER);
    rect(0, 0, 30, 30);
    rect(24, 0, 12, 10);
    pop();
  }

  collidePlayer() {
    if (rectRect(this.pos, 50, 50, player.pos, 20, 20)) {
      if (player.deathRoll) {
        this.hp = 0;
        return;
      }
      if (player.invincibility <= 0) {
        player.hp -= 1;
        player.invincibility = 60;
      }
    }
  }
  collideBullet() {
    for (let b = 0; b < bullets.length; b++) {
      if (
        circleRect(bullets[b].pos, bullets[b].r, this.pos, 30, 30) &&
        this.hp > 0
      ) {
        bullets.splice(b, 1);
        score++;
        this.hp -= 1;
        this.damageTime = 10;
        if (round(random(1, powerUpSpawnProb)) == 2 && this.hp == 0) {
          powerups.push(new PowerUp(undefined, this.pos.x, this.pos.y));
        }
      }
    }
  }
  shoot() {
    while (enemyBullets.length > 10000) {
      enemyBullets.shift();
    }
    if (this.bCool <= 0) {
      enemyBullets.push(
        new Bullet(
          this.pos.x + cos(this.r) * 10,
          this.pos.y + sin(this.r) * 10,
          this.r,
          8,
          10,
          "#246ACC"
        )
      );
      this.bCool = round(random(10, 40));
    }
  }
}
