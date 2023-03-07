document.addEventListener("keydown", keyPush);

const canvas = document.querySelector("canvas");
const title = document.querySelector("h2");
const ctx = canvas.getContext("2d");

//left top corner - IMPORTANT

//GAME
let gameIsRunning = true;

//fps - speed of the game
const fps = 15;

const tileSize = 50;

//tile section
const tileCountX = canvas.width / tileSize;
const tileCountY = canvas.height / tileSize;

//score
let score = 0;


let velocityX = 1;
let velocityY = 0;

//player
//should be same like size of the tile, because moving in squares
let snakeSpeed = tileSize;

//after eat food -> snake is longer
let snakePosX = 0;

//let snakePosY = canvas.height / 2 - tileSize / 2;
let snakePosY = canvas.height / 2;

//let tail = [{x:300,y:100}{x:200,y:100}];
let tail = [];
let snakeLength = 4;

//food
let foodPosX = 0;
let foodPosY = 0;

let btn = document.createElement("button");
btn.innerHTML = "Start game";
btn.onclick = function () {
  restartGame();
};

//loop
function gameLoop() {
  if (gameIsRunning) {
    drawStuff();
    moveStuff();
    setTimeout(gameLoop, 1000 / fps);
  }

  //requestAnimationFrame(gameLoop);  - smooth animations
}

resetFood();
gameLoop();

//move everything
function moveStuff() {
  //snakePosX = snakePosX + 5;

  //wall colision
  snakePosX += snakeSpeed * velocityX;
  snakePosY += snakeSpeed * velocityY;
  if (snakePosX > canvas.width - tileSize) {
    snakePosX = 0;
  }
  if (snakePosX < 0) {
    snakePosX = canvas.width;
  }
  if (snakePosY > canvas.height - tileSize) {
    snakePosY = 0;
  }
  if (snakePosY < 0) {
    snakePosY = canvas.height;
  }

  //not crush into itself - GAME
  tail.forEach((snakePart) => {
    if (snakePosX === snakePart.x && snakePosY === snakePart.y) {
      gameOver();
    }
  });

  //tail - after moving we know value of head, where is it
  tail.push({ x: snakePosX, y: snakePosY });

  //forgot except last 5 elements
  tail = tail.slice(-1 * snakeLength);

  //food colision
  if (snakePosX === foodPosX && snakePosY === foodPosY) {
    //score++; = ++score
    title.textContent = ++score;
    snakeLength++;
    //multiply width of the tile
    resetFood();
  }
}

function drawStuff() {
  //background
  rectangle("#ffbf00", 0, 0, canvas.width, canvas.height);

  //grid
  drawGrid();

  //food
  rectangle("#00bfff", foodPosX, foodPosY, tileSize, tileSize);

  //tail - every "part" of the array
  tail.forEach((snakePart) =>
    rectangle("#555", snakePart.x, snakePart.y, tileSize, tileSize)
  );

  //snake
  rectangle("black", snakePosX, snakePosY, tileSize, tileSize);
}

function rectangle(color, x, y, width, height) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

//randmize food position
function resetFood() {
  //no space to (expand) go - game over
  if (snakeLength === tileCountX * tileCountY) {
    gameOver();
  }

  foodPosX = Math.floor(Math.random() * tileCountX) * tileSize;
  foodPosY = Math.floor(Math.random() * tileCountY) * tileSize;

  //dont sit food on the head of snake
  if (foodPosX === snakePosX && foodPosY === snakePosY) {
    resetFood();
  }
  if (
    tail.some(
      (snakePart) => snakePart.x === foodPosX && snakePart.y === foodPosY
    )
  ) {
    resetFood();
  }
}

function gameOver() {
  title.innerHTML = `☠️<strong>${score}</strong>☠️`;
  title.insertAdjacentHTML("afterend", ` <h2>GAME OVER</h2>`);
  gameIsRunning = false;
  document.body.appendChild(btn);
}

//keyboard
function keyPush(event) {
  switch (event.key) {
    case "ArrowUp":
      //snakePosY -= snakeSpeed;
      if (velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
      }
      break;
    case "ArrowDown":
      if (velocityY !== -1) {
        //snakePosY += snakeSpeed;
        velocityX = 0;
        velocityY = 1;
      }
      break;
    case "ArrowLeft":
      //snakePosX -= snakeSpeed;
      if (velocityX !== 1) {
        velocityY = 0;
        velocityX = -1;
      }
      break;
    case "ArrowRight":
      if (velocityX !== -1) {
        //snakePosX += snakeSpeed;
        velocityY = 0;
        velocityX = 1;
      }
      break;
    default:
      //any key start after gameover
      restartGame();
      break;
  }
}

function restartGame() {
  if (!gameIsRunning) location.reload();
}

//grid
function drawGrid() {
  for (let i = 0; i < tileCountX; i++) {
    for (let j = 0; j < tileCountY; j++) {
      rectangle("#fff", tileSize * i, tileSize * j, tileSize - 1, tileSize - 1);
    }
  }
}
