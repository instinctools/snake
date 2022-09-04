const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");
const scoreIs = document.querySelector(".score");
let direction = "";
let directionQueue = "";
const fps = 200; // the larger the number, the slower the snake (and vice versa)
let snake = [];
const snakeLength = 3;
const cellSize = 50;
const snakeColor = "#7f9ccf";
const snakeHeadImage = "./images/10.svg";
const textYmargin = 3;
const foodX = [];
const foodY = [];
const food = {
  x: 0,
  y: 0,
};
let score = 0;
const hit = new Audio("hit.wav");
const pick = new Audio("pick.wav");
// pushes possible x and y positions to seperate arrays
for (let i = 0; i <= canvas.width - cellSize; i += cellSize) {
  foodX.push(i);
  foodY.push(i);
}
// makes canvas interactive upon load
canvas.setAttribute("tabindex", 1);
canvas.style.outline = "none";
canvas.focus();

// giving the food object its coordinates
const createFood = () => {
  food.x = foodX[Math.floor(Math.random() * foodX.length)]; // random x position from array
  food.y = foodY[Math.floor(Math.random() * foodY.length)]; // random y position from array
  // looping through the snake and checking if there is a collision
  for (let i = 0; i < snake.length; i++) {
    if (checkCollision(food.x, food.y, snake[i].x, snake[i].y)) {
      createFood();
    }
  }
};

// drawing food on the canvas
const drawFood = () => {
  const img = new Image();

  img.onload = () => {
    ctx.drawImage(img, food.x, food.y, cellSize, cellSize); // Or at whatever offset you like
  };

  img.src = `./images/${score}.svg`;
};

// setting the colors for the canvas. color1 - the background, color2 - the line color
const setBackground = (color1, color2) => {
  ctx.fillStyle = color1;
  ctx.strokeStyle = color2;

  ctx.fillRect(0, 0, canvas.height, canvas.width);

  for (let x = 0.5; x < canvas.width; x += cellSize) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
  }
  for (let y = 0.5; y < canvas.height; y += cellSize) {
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
  }

  ctx.stroke();
};

// creating the snake and pushing coordinates to the array
const createSnake = () => {
  snake = [];
  for (let i = snakeLength; i > 0; i--) {
    k = i * cellSize;
    snake.push({ x: k, y: 0 });
  }
};

// loops through the snake array and draws each element
const drawSnake = () => {
  const drawSquare = ({ x, y, snakeFill, isLastCell }) => {
    if (isLastCell) {
      const img = new Image();

      img.onload = () => {
        ctx.drawImage(img, x, y, cellSize, cellSize);
      };

      img.src = snakeHeadImage;
    } else {
      ctx.fillStyle = snakeFill;
      ctx.fillRect(x, y, cellSize, cellSize);
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
      drawSquare({ x: snake[i].x, y: snake[i].y, snakeFill: snakeColor });
    }
  }
};

// keyboard interactions | direction !== '...' doesn't let the snake go backwards
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

// changing the snake's movement
const moveSnake = () => {
  let x = snake[0].x; // getting the head coordinates...hhehehe... getting head..
  // anyway... read on...
  let y = snake[0].y;

  direction = directionQueue;

  if (direction == "right") {
    x += cellSize;
  } else if (direction == "left") {
    x -= cellSize;
  } else if (direction == "up") {
    y -= cellSize;
  } else if (direction == "down") {
    y += cellSize;
  }

  // removes the tail and makes it the new head...very delicate, don't touch this
  const tail = snake.pop();
  tail.x = x;
  tail.y = y;
  snake.unshift(tail);
};

// checks if too coordinates match up
const checkCollision = (x1, y1, x2, y2) => {
  if (x1 == x2 && y1 == y2) {
    return true;
  } else {
    return false;
  }
};

// main game loop
const game = () => {
  const head = snake[0];
  // checking for wall collisions
  if (
    head.x < 0 ||
    head.x > canvas.width - cellSize ||
    head.y < 0 ||
    head.y > canvas.height - cellSize
  ) {
    hit.play();
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
      hit.play(); // playing sounds
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
    pick.play();
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
  drawFood();
  moveSnake();
};

const newGame = () => {
  let loop;
  direction = "right"; // initial direction
  directionQueue = "right";
  ctx.beginPath();
  createSnake();
  createFood();

  if (typeof loop !== "undefined") {
    clearInterval(loop);
  } else {
    loop = setInterval(game, fps);
  }
};

newGame();
