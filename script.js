// Get the canvas and context
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Define the game variables
const tileSize = 5;
const mapWidth = canvas.width / tileSize;
const mapHeight = canvas.height / tileSize;
const snekSpeed = 1;
const speed = 100;

// Initialize the snek variables
let snek = {
  head: {
    x: 0,
    y: 0,
    direction: "xp",
  },
  tiles: [],
};
let apels = [];

// Add an event listener to the document to listen for keydown events
document.addEventListener("keydown", function (e) {
  switch (e.key.toLowerCase()) {
    // Arrow keys
    case "arrowright":
      snek.head.direction = "xp";
      break;
    case "arrowleft":
      snek.head.direction = "xm";
      break;
    case "arrowup":
      snek.head.direction = "ym";
      break;
    case "arrowdown":
      snek.head.direction = "yp";
      break;
    // WASD
    case "d":
      snek.head.direction = "xp";
      break;
    case "a":
      snek.head.direction = "xm";
      break;
    case "w":
      snek.head.direction = "ym";
      break;
    case "s":
      snek.head.direction = "yp";
      break;
  }
});

//spawns apel randomly when the game starts
function spawnApel() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let x = Math.floor(Math.random() * mapWidth);
  let y = Math.floor(Math.random() * mapHeight);
  while (apels.some((apel) => apel.x === x && apel.y === y)) {
    x = Math.floor(Math.random() * mapWidth);
    y = Math.floor(Math.random() * mapHeight);
  }
  apels.push({ x, y });
}

// Game loop
function gameLoop() {
  // Move snek
  for (let index = 0; index < snekSpeed; index++) {
    // Move snek head
    switch (snek.head.direction) {
      case "xp":
        snek.head.x += 1;
        break;
      case "xm":
        snek.head.x -= 1;
        break;
      case "yp":
        snek.head.y += 1;
        break;
      case "ym":
        snek.head.y -= 1;
        break;
    }
  }
  //cheks if snek is touching apel
  if (snek.head.x == apels[0].x && snek.head.y == apels[0].y) {
    apels.shift();
    spawnApel();
    snek.tiles.push({ x: snek.head.x, y: snek.head.y });
  }

  // Check if snek is out of bounds and stop the game
  if (
    snek.head.x < 0 ||
    snek.head.x > mapWidth ||
    snek.head.y < 0 ||
    snek.head.y > mapHeight
  ) {
    clearInterval(interval);
    interval = null;
  }
}

// Animation loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Render snek
  ctx.fillStyle = "green";
  ctx.fillRect(
    snek.head.x * tileSize,
    snek.head.y * tileSize,
    tileSize,
    tileSize
  );

  // Render snek body
  for (let index = 0; index < snek.tiles.length; index++) {
    const tile = snek.tiles[index];
    ctx.fillStyle = "green";
    ctx.fillRect(tile.x * tileSize, tile.y * tileSize, tileSize, tileSize);
  }

  // Render apel
  for (let index = 0; index < apels.length; index++) {
    const apel = apels[index];
    ctx.fillStyle = "red";
    ctx.fillRect(apel.x * tileSize, apel.y * tileSize, tileSize, tileSize);
  }

  // Check if game is running
  if (interval) {
    requestAnimationFrame(animate);
  } else {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = "48px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("Lil bro is dead", canvas.width / 2, canvas.height / 2);
  }
}

// Start the game loop
let interval = setInterval(gameLoop, speed);

// Start the animation loop
animate();

spawnApel();
