let rollAmount = 30;
let maxHP = 5;
let bCoolMax = 4;
let fastCoolMax = 1;
let quadCoolMax = 10;
let circleCoolMax = 30;
let lineCoolMax = 10;
let maxRollCooldown = 100;
let rollCooldown = 100;

//BOSS
let bossMaxHP = 100;
let bossSpeed = 15;
let bossAttackCool = 60;
let attackArrOptions = [[1,2,3,4],[5,6,7,8],[9,1,6,2,4],[1,2,3,4,5,6,7,8,9],[1,2,3,4,5,6,7,8,9],[9,7,3,4],[1,6,2,7,4,9]];

//ZOMBIE
let zombieSpeed = 5;
let powerUpSpawnProb = 40; // Chance of Powerup spawning on enemy death;
//WAVES
let zAmount = [0, 10, 10, 20,  0,  0, 30, 15, ];
let gAmount = [0,  0, 10, 20, 30,  0,  0, 15, ];
let tAmount = [0, 1,]
let bSpawn = [
  1,
  0,
  0,
  0,
  0,
  { a: [0, 1, 2, 3], hp: 50, b: 120 },
  0,
  0,
  0,
  0,
  { a: [1, 2, 3, 4, 5, 6, 7,8,9,10], hp: 100, b: 60 },
  0,
  0,
  0,
  0,
  { a: [5, 6, 7,8,9], hp: 100, b: 60 },
  0,
  0,
  0,
  0,
  { a: [1,2,3,4,5,6,7,8,9,10], hp: 150, b:30}
];

//COLLIDE
//BULLET (CAN ADD CIRCLE RAD FOR OTHER CIRCLES)
function circleRect(cpos, rad, rpos, rw, rh = rw) {
  let cx = cpos.x;
  let cy = cpos.y;
  let rx = rpos.x;
  let ry = rpos.y;

  let testX = cx;
  let testY = cy;
  let w = rw / 2;
  let h = rh / 2;

  if (cx < rx - w) testX = rx - w;
  // test left edge
  else if (cx > rx + w) testX = rx + w; // right edge
  if (cy < ry - h) testY = ry - h;
  // top edge
  else if (cy > ry + h) testY = ry + h; // bottom edge

  let d = dist(cx, cy, testX, testY);

  if (d <= rad) {
    return true;
  }
  return false;
}
//RECT
function rectRect(apos, aw, ah, bpos, bw, bh) {
  let aw2 = aw / 2;
  let ah2 = ah / 2;
  let bw2 = bw / 2;
  let bh2 = bh / 2;
  if (
    apos.x - aw2 < bpos.x + bw2 &&
    bpos.x - bw2 < apos.x + aw2 &&
    apos.y - ah2 < bpos.y + bh2 &&
    bpos.y - bh2 < apos.y + ah2
  ) {
    return true;
  } else {
    return false;
  }
}
