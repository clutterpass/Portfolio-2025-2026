// HTML interaksjon -----------------------------------------------------------
const canvas = document.getElementById("canvas"); // GI meg et ark
const brush = canvas.getContext("2d"); // Gi meg en malekost.

// GAME VARIABLES -------------------------------------------------------------
const MIN_SPEED = 2;
const MAX_SPEED = 4;

const PADDLE_PADDING = 10;
const PADDLE_WIDTH = 20;
const PADDLE_HEIGHT = 75;

const NPC_SPEED = 3;

const CENTER = canvas.width / 2;
const RIGHT_BORDER = canvas.width;
const LEFT_BORDER = 0;

const ball = {
  x: 310,
  y: 230,
  radius: 10,
  color: "#FFFFFF",
  speedX: 0,
  speedY: 0,
};

const paddle = {
  x: PADDLE_PADDING,
  y: 0,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
  color: "#daff33",
};

const npcPaddle = {
  x: canvas.width - PADDLE_PADDING - PADDLE_WIDTH,
  y: 0,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
  color: "#ff33e4ff",
};

//task 1 
let playerScore = 0;
let npcScore = 0;

//task 5 90 sec timer (couldn't figure it out)
let timer = Date.now();
let timerOver = true;

const pitch = {
  x: 0,
  y: 0,
  width: canvas.width,
  height: canvas.height,
  color: "#000",
};

// GAME ENGINE ----------------------------------------------------------------
function update() {
  moveBall(ball);
  movePaddle(npcPaddle);
  keepBallOnPitch(ball);
  dealWithColision(paddle, ball);
  dealWithColision(npcPaddle, ball);
  draw();
  requestAnimationFrame(update);
}

function draw() {
  clearCanvas();
  drawPitch(pitch);
  drawBall(ball);
  drawPaddle(paddle);
  drawPaddle(npcPaddle);
  //task1
  drawScore();
}

function init() {
  centerVericalyItemIn(paddle, canvas);
  centerVericalyItemIn(npcPaddle, canvas);
  giveBallRandomSpeed(ball);
  update();
}



init();

// GAME FUNCTIONS -------------------------------------------------------------

function movePaddle(paddle) {
  //paddle.y = ball.y - paddle.height * 0.5;

  let delta = ball.y - (paddle.y + paddle.height * 0.5);
  if (delta < 0) {
    paddle.y -= NPC_SPEED;
  } else {
    paddle.y += NPC_SPEED;
  }
}

function keepBallOnPitch(ball) {
  const leftBorder = ball.radius;
  const rightBorder = canvas.width - ball.radius;
  const topBorder = 0 + ball.radius;
  const bottomBorder = canvas.height - ball.radius;


  /* Task 1--WRONG -if (ball.x < leftBorder || ball.x > rightBorder) {
    if(ball.x < leftBorder) {
      npcScore = +1;
    } else {playerScore = +1;}
    // MÅL!!!!!!
    putBallInCenterOfPitch(ball);
    giveBallRandomSpeed(ball);
  }*/
 if (ball.x < leftBorder || ball.x > rightBorder) {
    if(ball.x < leftBorder) {
      npcScore = npcScore+1;
    } else {playerScore = playerScore+1;}
    // MÅL!!!!!!
    putBallInCenterOfPitch(ball);
    giveBallRandomSpeed(ball);
  }

  if (ball.y <= topBorder || ball.y >= bottomBorder) {
    ball.speedY = ball.speedY * -1;
  }
}

function putBallInCenterOfPitch(ball) {
  ball.x = (canvas.width - ball.radius * 2) * 0.5;
  ball.y = (canvas.height - ball.radius * 2) / 2;
}

function giveBallRandomSpeed(ball) {
  ball.speedX = randomNumberBetween(MAX_SPEED, MIN_SPEED);
  ball.speedY = randomNumberBetween(MAX_SPEED, MIN_SPEED);

  if (Math.random() > 0.5) {
    ball.speedX = ball.speedX * -1;
  }
  if (Math.random() > 0.5) {
    ball.speedY = ball.speedY * -1;
  }
}

function dealWithColision(paddle, ball) {
  const paddleTop = paddle.y;
  const paddleBottom = paddle.y + paddle.height;
  let paddleBorder = paddle.x + paddle.width + ball.radius;
  let isRightSide = false;
  let isLeftSide = false;

  if (ball.x > CENTER && paddle.x > CENTER) {
    isRightSide = true;
    paddleBorder = paddle.x - ball.radius;
  } else if (ball.x < CENTER && paddle.x < CENTER) {
    isLeftSide = true;
  }

  let changeVector = false;
  if (inBounds(ball.y, paddleTop, paddleBottom)) {
    changeVector =
      (isRightSide && ball.x >= paddleBorder) ||
      (isLeftSide && ball.x <= paddleBorder);
  }

  if (changeVector) {
    ball.speedX = ball.speedX * -1.05;
    ball.speedY = ball.speedY * -1.05;

    console.log(ball.speedX);
  }
}

function moveBall(ball) {
  ball.x = ball.x + ball.speedX;
  ball.y = ball.y + ball.speedY;
}

function drawBall(ball) {
  brush.beginPath();
  brush.fillStyle = ball.color;
  brush.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
  brush.fill();
}

function drawPaddle(paddle) {
  brush.fillStyle = paddle.color;
  brush.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawPitch(pitch) {
  brush.fillStyle = pitch.color;
  brush.fillRect(pitch.x, pitch.y, pitch.width, pitch.height);

  brush.fillStyle = "white";
  brush.fillRect(pitch.width * 0.5, 0, 4, pitch.height);
}

// task1
function drawScore() {
  brush.fillStyle = "white";
  brush.font = "50px serif";
  brush.textAlign = "center";
  brush.fillText(playerScore, 150, 40);
  brush.fillText(npcScore, 500, 40);
}

// UTILITY FUNCTIONS ----------------------------------------------------------

canvas.addEventListener("mousemove", onMouseMove);

function onMouseMove(event) {
  paddle.y = event.offsetY;
}

function randomNumberBetween(max, min) {
  return Math.round(Math.random() * (max - min)) + min;
}

function centerVericalyItemIn(item, target) {
  item.y = target.height * 0.5 - item.height * 0.5;
}

function clearCanvas() {
  brush.clearRect(0, 0, canvas.width, canvas.height);
}

function inBounds(value, min, max) {
  return value >= min && value <= max;
}
