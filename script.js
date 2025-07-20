// Get the canvas and context
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const score = document.getElementById("score");
const restartButton = document.createElement('button');
restartButton.textContent = 'Restart';


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
let highScore = localStorage.getItem("highScore") || 0;
localStorage.setItem("highScore", highScore);
let startTime = new Date();
let clockElement = document.getElementById("speedrun-clock");

// Add the button to your UI
document.body.appendChild(restartButton);

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
  let x = Math.floor(Math.random() * mapWidth);
  let y = Math.floor(Math.random() * mapHeight);
  while (apels.some((apel) => apel.x === x && apel.y === y)) {
    x = Math.floor(Math.random() * mapWidth);
    y = Math.floor(Math.random() * mapHeight);
  }
  apels.push({ x, y });
}


function gameloop() {
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
  for (let index = 0; index < apels.length; index++) {
    const apel = apels[index];
    if (snek.head.x == apel.x && snek.head.y == apel.y) {
      apels.splice(index, 1);
      spawnApel();
      snek.tiles.push({ x: snek.head.Z, y: snek.head.y });
      score.innerHTML = "score: " + (snek.tiles.length - 1);
    }
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

  //moves the snek body to snek head
  for (let index = snek.tiles.length - 1; index > 0; index--) {
    snek.tiles[index] = snek.tiles[index - 1];
  }
  snek.tiles[0] = { x: snek.head.x, y: snek.head.y };




  // checks if the snake's head has collided with any part of its own body, and if so, ends the game.
  for (let index = 1; index < snek.tiles.length; index++) {
    if (
      snek.head.x == snek.tiles[index].x &&
      snek.head.y == snek.tiles[index].y
    ) {
      clearInterval(interval);
      interval = null;
    }
  }



  highScore = localStorage.getItem("highScore");
  if (highScore === null) {
    highScore = 0;
  }

  // Update high score
  if (snek.tiles.length - 1 > highScore) {
    highScore = snek.tiles.length - 1;
    localStorage.setItem("highScore", highScore);
    document.getElementById("highscore").innerHTML =
      "Highscore: " + highScore;
  }


  restartButton.onclick = () => {
    restart();
  }


}

function padZero(value, length = 2) {
  return (value.toString().padStart(length, "0"));
}

function timer() {
  let currentTime = new Date();

  // Calculate the elapsed time since the start

  let elapsedTime = currentTime - startTime;

  // Calculate the hours, minutes, seconds, and milliseconds from the elapsed time
  let hours = Math.floor(elapsedTime / 3600000);
  let minutes = Math.floor((elapsedTime % 3600000) / 60000);
  let seconds = Math.floor((elapsedTime % 60000) / 1000);
  let milliseconds = elapsedTime % 1000;

  // Create a string that represents the clock time in the format HH:MM:SS.SS
  let clockString = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}.${padZero(milliseconds, 2)}`;

  // Update the clock element's innerHTML with the clock string
  clockElement.innerHTML = clockString;
}

// Animation loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Render snek outline
  ctx.fillStyle = "black";
  ctx.fillRect(
    snek.head.x * tileSize,
    snek.head.y * tileSize,
    tileSize,
    tileSize
  );
  // Render snek body outline
  for (let index = 0; index < snek.tiles.length; index++) {
    const tile = snek.tiles[index];
    ctx.fillRect(tile.x * tileSize, tile.y * tileSize, tileSize, tileSize);
  }
  // Render snek head
  ctx.fillStyle = "green";
  ctx.fillRect(
    snek.head.x * tileSize,
    snek.head.y * tileSize,
    tileSize,
    tileSize
  );

  // Render snek body
  for (let index = 1; index < snek.tiles.length; index++) {
    const tile = snek.tiles[index];
    ctx.fillRect(
      tile.x * tileSize - 1,
      tile.y * tileSize - 1,
      tileSize - 1,
      tileSize - 1
    );
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

//a function to restart the game
function restart() {
  score.innerHTML = "score: 0";
  snek = { head: { x: 10, y: 10 }, tiles: [] };
  apels = [];
  clearInterval(interval);
  interval = setInterval(gameloop, speed);
  spawnApel();
  snek = {
    head: {
      x: 0,
      y: 0,
      direction: "xp",
    },
    tiles: [],
  };
  clearInterval(timerinterval);
  startTime = new Date();
  timerinterval = setInterval(timer, 10);
  document.getElementById("speedrun-clock").innerHTML = "00:00:00.00";

  animate();
}

document.getElementById("highscore").innerHTML = "Highscore: " + highScore;

// Start the game loop
let interval = setInterval(gameloop, speed);
// Update the clock every 10 milliseconds
let timerinterval = setInterval(timer, 10);

// Start the animation loop
animate();

spawnApel();
