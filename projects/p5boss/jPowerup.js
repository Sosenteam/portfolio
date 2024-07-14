class PowerUp {
  constructor(type = undefined, x = undefined, y = undefined) {
    this.pos = createVector(random(-1000,1000), random(-1000,1000));
    if(x)this.pos.x = x;
    if(y)this.pos.y = y;
    this.type = random(["Health", "QuadShot", "CircleShot", "LineShot","FastShot","DeathRoll"]);
    if(type)this.type = type;
    this.hp = 1;
  }
  update() {
    this.collidePlayer();
    this.draw();
  }
  managePower() {
    if (this.hp <= 0) return;
    switch (this.type) {
      case "Health":
        player.hp += 1;
        break;
      case "QuadShot":
        player.gunType = 1;
        player.gunTimer += 240;
        break;
      case "CircleShot":
        player.gunType = 2;
        player.gunTimer += 240;
        break;
      case "LineShot":
        player.gunType = 3;
        player.gunTimer += 240;
        break;
      case "FastShot":
        player.gunType = 4;
        player.gunTimer += 240;
        break;
      case "DeathRoll":
        player.deathRollCooldown = 240;
        rollCooldown = maxRollCooldown/2;
        player.deathRoll = true;
        break;
    }
    this.hp--;
  }
  draw() {
    push();
    translate(this.pos.x,this.pos.y)
    rectMode(CENTER);
    fill("black");
    rect(0, 0, 20, 20);
    switch (this.type) {
      case "Health":
        fill("red");
        break;
      case "QuadShot":
        fill("orange");
        break;
      case "CircleShot":
        fill("blue");
        break;
      case "LineShot":
        fill("aqua");
        break;
      case "FastShot":
        fill("lime")
        break;
      case "DeathRoll":
        fill("gray")
        break;
        
    }
    rect(0, 0, 15, 15);
    pop();
  }
  collidePlayer() {
    if(rectRect(this.pos,30,30,player.pos,20,20)){
            this.managePower();
    }
      
    
  }
  get active(){
  
  }
}
