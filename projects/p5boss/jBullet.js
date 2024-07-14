class Bullet {
  constructor(
    x,
    y,
    a,
    s = 10,
    r = 10,
    c = "white",
    t = 0,
    bounces = 0,
    gravity = false,
    homing = false,
    homingTarget = player.pos,
    homingTicks = 200
  ) {
    this.pos = createVector(x, y);
    this.a = a; // Angle To Move
    this.vel = createVector(s, s);
    this.vel.setHeading(this.a);
    this.c = c; // Color
    this.speed = s; //Speed
    this.r = r/2;
    //Special Attributes
    if (t != 0) {
      this.time = t;
    }else{
      this.time = 10000;
    }
    if (bounces) this.bounce = true;
    this.bounces = bounces;
    this.homing = homing;
    this.targetPos = homingTarget;
    this.homingTicks = homingTicks;
  }
  update() {
    if (this.time > 0) {
      this.pos.x += this.vel.x;
      this.pos.y += this.vel.y;
    }
    this.draw();
    if (this.time > 0) this.time--;
    if (this.bounce) this.doBounce();
    if (this.homing && this.homingTicks > 0) this.doHoming();
  }
  draw() {
    push();
    translate(0, 0);
    fill(this.c);
    ellipse(this.pos.x, this.pos.y, this.r*2, this.r*2);
    pop();
  }
  doBounce() {
    if (this.pos.x > 1000 || this.pos.x < -1000) {
      this.vel.x *= -1;
      this.c = lerpColor(color(this.c), color("white"), 0.4);
      this.bounce = false;
    }
    if (this.pos.y > 1000 || this.pos.y < -1000) {
      this.vel.y *= -1;
      this.c = lerpColor(color(this.c), color("white"), 0.4);
      this.bounce = false;
    }
  }
  doHoming() {
    this.homingTicks--;
    this.vel.setHeading(this.a);

    let rotSpeed = 5;
    let ta = atan2(
      this.targetPos.y - this.pos.y,
      this.targetPos.x - this.pos.x
    );
    let rotationDifference = this.a - ta;
    if (Math.abs(rotationDifference) > 180) {
      rotationDifference += rotationDifference > 0 ? -360 : 360;
    }
    if (rotationDifference < 0) {
      this.a += rotSpeed;
    } else if (rotationDifference > 0) {
      this.a -= rotSpeed;
    }
  }
}
