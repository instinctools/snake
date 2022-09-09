const MAX_COUNT = 12;
const FPS = 200;
const SNAKE_LENGTH = 3;
const CELL_SIZE = 50;
const SNAKE_COLOR = "#7f9ccf";
const SNAKE_HEAD_IMAGE = "./images/head.svg";

const winnerText = document.querySelector('h2')
const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");
const scoreIs = document.querySelector(".score");
const foodX = [];
const foodY = [];
const food = {
  x: 0,
  y: 0,
};

let direction = "";
let directionQueue = "";
let loop;
let snake = [];
let score = 0;

for (let i = 0; i <= canvas.width - CELL_SIZE; i += CELL_SIZE) {
  foodX.push(i);
  foodY.push(i);
}

canvas.setAttribute("tabindex", 1);
canvas.style.outline = "none";
canvas.focus();

const createImage = (path) => {
  const image = new Image();
  image.src = path;
  return image;
}

const images = [
  createImage('./images/0.svg'),
  createImage('./images/1.svg'),
  createImage('./images/2.svg'),
  createImage('./images/3.svg'),
  createImage('./images/4.svg'),
  createImage('./images/5.svg'),
  createImage('./images/6.svg'),
  createImage('./images/7.svg'),
  createImage('./images/8.svg'),
  createImage('./images/9.svg'),
  createImage('./images/10.svg'),
  createImage('./images/11.svg'),
]

const createFood = () => {
  food.x = foodX[Math.floor(Math.random() * foodX.length)];
  food.y = foodY[Math.floor(Math.random() * foodY.length)];
  // looping through the snake and checking if there is a collision
  for (let i = 0; i < snake.length; i++) {
    if (checkCollision(food.x, food.y, snake[i].x, snake[i].y)) {
      createFood();
    }
  }
};

const drawFood = () => {
  ctx.drawImage(images[score], food.x, food.y, CELL_SIZE, CELL_SIZE);
};

const setBackground = (color1, color2) => {
  ctx.fillStyle = color1;
  ctx.strokeStyle = color2;

  ctx.fillRect(0, 0, canvas.height, canvas.width);

  for (let x = 0.5; x < canvas.width; x += CELL_SIZE) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
  }
  for (let y = 0.5; y < canvas.height; y += CELL_SIZE) {
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
  }

  ctx.stroke();
};

const createSnake = () => {
  snake = [];
  for (let i = SNAKE_LENGTH; i > 0; i--) {
    k = i * CELL_SIZE;
    snake.push({ x: k, y: 0 });
  }
};

const drawSnake = () => {
  const drawSquare = ({ x, y, snakeFill, isLastCell }) => {
    if (isLastCell) {
      const img = new Image();

      img.onload = () => {
        ctx.drawImage(img, x, y, CELL_SIZE, CELL_SIZE);
      };

      ctx.fillStyle = snakeFill;
      ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
      img.src = SNAKE_HEAD_IMAGE;
    } else {
      ctx.fillStyle = snakeFill;
      ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
    }
  };

  for (i = 0; i < snake.length; i++) {
    if (i === 0) {
      drawSquare({
        x: snake[i].x,
        y: snake[i].y,
        snakeFill: "",
        isLastCell: true,
      });
    } else {
      drawSquare({ x: snake[i].x, y: snake[i].y, snakeFill: SNAKE_COLOR });
    }
  }
};

const changeDirection = (keycode) => {
  if (keycode == 37 && direction !== "right") {
    directionQueue = "left";
  } else if (keycode == 38 && direction !== "down") {
    directionQueue = "up";
  } else if (keycode == 39 && direction !== "left") {
    directionQueue = "right";
  } else if (keycode == 40 && direction !== "top") {
    directionQueue = "down";
  }
};

const moveSnake = () => {
  let x = snake[0].x;
  let y = snake[0].y;

  direction = directionQueue;

  if (direction == "right") {
    x += CELL_SIZE;
  } else if (direction == "left") {
    x -= CELL_SIZE;
  } else if (direction == "up") {
    y -= CELL_SIZE;
  } else if (direction == "down") {
    y += CELL_SIZE;
  }

  const tail = snake.pop();
  tail.x = x;
  tail.y = y;
  snake.unshift(tail);
};

const checkCollision = (x1, y1, x2, y2) => {
  if (x1 == x2 && y1 == y2) {
    return true;
  } else {
    return false;
  }
};

const game = () => {
  const head = snake[0];
  // checking for wall collisions
  if (
    head.x < 0 ||
    head.x > canvas.width - CELL_SIZE ||
    head.y < 0 ||
    head.y > canvas.height - CELL_SIZE
  ) {
    setBackground();
    createSnake();
    drawSnake();
    createFood();
    drawFood();
    directionQueue = "right";
    score = 0;
  }
  // checking for colisions with snake's body
  for (i = 1; i < snake.length; i++) {
    if (head.x == snake[i].x && head.y == snake[i].y) {
      setBackground();
      createSnake();
      drawSnake();
      createFood();
      drawFood();
      directionQueue = "right";
      score = 0;
    }
  }
  // checking for collision with food
  if (checkCollision(head.x, head.y, food.x, food.y)) {
    snake[snake.length] = { x: head.x, y: head.y };
    createFood();
    drawFood();
    score += 1;
  }

  canvas.onkeydown = (evt) => {
    evt = evt || window.event;
    changeDirection(evt.keyCode);
  };

  ctx.beginPath();
  setBackground("#fff", "#eee");
  scoreIs.innerHTML = score;
  drawSnake();
  moveSnake();

  if (score < MAX_COUNT) {
    drawFood();
  }

  if (score >= MAX_COUNT) {
    clearInterval(loop);
    winnerText.style.display = 'block';
  }
};

const newGame = () => {
  direction = "right";
  directionQueue = "right";
  ctx.beginPath();
  createSnake();
  createFood();

  if (typeof loop !== "undefined") {
    clearInterval(loop);
  } else {
    loop = setInterval(game, FPS);
  }
};

newGame();
