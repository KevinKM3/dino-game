const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Variables
let score;
let highscore;
let player;
let gravity;
let obstacles = [];
let gameSpeed;
let keys = {};

// Event Listeners
document.addEventListener("keydown", function (evt) {
  keys[evt.code] = true;
});
document.addEventListener("keyup", function (evt) {
  keys[evt.code] = false;
});

class Player {
  constructor(x, y, w, h, c) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;

    this.dy = 0;
    this.jumpForce = 15;
    this.originalHeight = h;
    this.grounded = false;
    this.jumpTimer = 0;
  }

  Animate() {
    // Jump
    if (keys["Space"] || keys["KeysW"]) {
      this.Jump();
    } else {
      this.jumpTimer = 0;
    }

    if (keys["ShiftLeft"] || keys["KeyS"]) {
      this.height = this.originalHeight / 2;
    } else {
      this.h = this.originalHeight;
    }

    this.y += this.dy;

    // Gravity
    if (this.y + this.h < canvas.height) {
      this.dy += gravity;
      this.grounded = false;
    } else {
      this.dy = 0;
      this.grounded = true;
      this.y = canvas.height - this.h;
    }

    this.Draw();
  }

  Jump() {
    if (this.grounded && this.jumpTimer == 0) {
      this.jumpTimer = 1;
      this.dy = -this.jumpForce;
    } else if (this.jumpTimer > 0 && this.jumpTimer < 15) {
      this.jumpTimer++;
      this.dy = -this.jumpForce - this.jumpTimer / 50;
    }
  }

  Draw() {
    ctx.beginPath();
    ctx.fillStyle = this.c;
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.closePath();
  }
}

class Obstacle {
  constructor(x, y, w, h, c) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;

    this.dx = -gameSpeed;
  }

  Update() {
    this.x += this.dx;
    this.Draw();
    this.dx = -gameSpeed;
  }

  Draw() {
    ctx.beginPath();
    ctx.fillStyle = this.c;
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.closePath();
  }
}

// Game Functions
function SpawnObstacle() {
  let size = RandomIntRange(20, 70);
  let type = RandomIntRange(0, 1);
  let obstacle = new Obstacle(
    canvas.width + size,
    canvas.height - size,
    size,
    size,
    "#2484E4"
  );

  if (type == 1) {
    obstacle.y -= player.originalHeight - 10;
  }
  obstacles.push(obstacle);
}

function RandomIntRange(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function Start() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  ctx.font = "20px sans-serif";

  gameSpeed = 3;
  gravity = 1;

  score = 0;
  highscore = 0;

  player = new Player(25, 0, 50, 50, "#FF5858");

  requestAnimationFrame(Update);
}

let initialSpawnTimer = 200;
let spawnTimer = initialSpawnTimer;
function Update() {
  requestAnimationFrame(Update);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  spawnTimer--;
  if (spawnTimer <= 0) {
    SpawnObstacle();
    spawnTimer = initialSpawnTimer - gameSpeed * 8;

    if (spawnTimer < 60) {
      spawnTimer = 60;
    }
  }

  // Spawn Enemies
  for (let i = 0; i < obstacles.length; i++) {
    let o = obstacles[i];

    o.Update();
  }

  player.Animate();
}

Start();
