const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlayTitle");
const overlayText = document.getElementById("overlayText");
const actionButton = document.getElementById("actionButton");

const keys = {
  ArrowLeft: false,
  ArrowRight: false,
};

const gameState = {
  running: false,
  gameOver: false,
  score: 0,
};

const paddle = {
  width: 150,
  height: 18,
  x: (canvas.width - 150) / 2,
  y: canvas.height - 46,
  speed: 9,
};

const ball = {
  radius: 10,
  x: canvas.width / 2,
  y: canvas.height - 74,
  dx: 4.5,
  dy: -4.5,
};

const brickGrid = {
  rows: 6,
  cols: 11,
  width: 74,
  height: 28,
  padding: 8,
  offsetTop: 80,
  offsetLeft: 42,
};

let bricks = [];

function createBricks() {
  bricks = [];
  for (let r = 0; r < brickGrid.rows; r += 1) {
    for (let c = 0; c < brickGrid.cols; c += 1) {
      const x = brickGrid.offsetLeft + c * (brickGrid.width + brickGrid.padding);
      const y = brickGrid.offsetTop + r * (brickGrid.height + brickGrid.padding);
      bricks.push({ x, y, alive: true, hue: 200 + r * 20 + c * 4 });
    }
  }
}

function resetPositions() {
  paddle.x = (canvas.width - paddle.width) / 2;
  ball.x = canvas.width / 2;
  ball.y = canvas.height - 74;
  ball.dx = (Math.random() > 0.5 ? 1 : -1) * 4.2;
  ball.dy = -4.2;
}

function resetGame() {
  gameState.score = 0;
  gameState.gameOver = false;
  scoreEl.textContent = gameState.score;
  livesEl.textContent = "1";
  createBricks();
  resetPositions();
}

function drawBackgroundStars() {
  for (let i = 0; i < 36; i += 1) {
    const x = (i * 149) % canvas.width;
    const y = (i * 61 + Math.sin(Date.now() * 0.0005 + i) * 40 + 80) % canvas.height;
    const alpha = 0.15 + ((i % 5) * 0.04);
    ctx.fillStyle = `rgba(190, 230, 255, ${alpha.toFixed(2)})`;
    ctx.beginPath();
    ctx.arc(x, y, 1.4 + (i % 3) * 0.3, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawPaddle() {
  const gradient = ctx.createLinearGradient(paddle.x, paddle.y, paddle.x + paddle.width, paddle.y);
  gradient.addColorStop(0, "#7cf4ff");
  gradient.addColorStop(0.5, "#9d8cff");
  gradient.addColorStop(1, "#61d4ff");

  ctx.shadowBlur = 16;
  ctx.shadowColor = "rgba(141, 227, 255, 0.8)";
  ctx.fillStyle = gradient;
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
  ctx.shadowBlur = 0;
}

function drawBall() {
  const glow = ctx.createRadialGradient(ball.x - 3, ball.y - 3, 1, ball.x, ball.y, ball.radius + 7);
  glow.addColorStop(0, "#ffffff");
  glow.addColorStop(0.45, "#87f1ff");
  glow.addColorStop(1, "#24a3ff");

  ctx.shadowBlur = 20;
  ctx.shadowColor = "rgba(76, 192, 255, 0.85)";
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
}

function drawBricks() {
  bricks.forEach((brick) => {
    if (!brick.alive) return;

    const gradient = ctx.createLinearGradient(brick.x, brick.y, brick.x + brickGrid.width, brick.y + brickGrid.height);
    gradient.addColorStop(0, `hsl(${brick.hue}, 95%, 68%)`);
    gradient.addColorStop(1, `hsl(${brick.hue + 30}, 85%, 45%)`);

    ctx.fillStyle = gradient;
    ctx.shadowColor = `hsla(${brick.hue + 20}, 100%, 70%, 0.5)`;
    ctx.shadowBlur = 9;
    ctx.fillRect(brick.x, brick.y, brickGrid.width, brickGrid.height);
    ctx.shadowBlur = 0;

    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    ctx.strokeRect(brick.x + 0.5, brick.y + 0.5, brickGrid.width - 1, brickGrid.height - 1);
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackgroundStars();
  drawBricks();
  drawPaddle();
  drawBall();
}

function updatePaddle() {
  if (keys.ArrowLeft) {
    paddle.x -= paddle.speed;
  }
  if (keys.ArrowRight) {
    paddle.x += paddle.speed;
  }

  paddle.x = Math.max(0, Math.min(canvas.width - paddle.width, paddle.x));
}

function collideWithPaddle() {
  const withinX = ball.x > paddle.x && ball.x < paddle.x + paddle.width;
  const withinY = ball.y + ball.radius >= paddle.y && ball.y - ball.radius <= paddle.y + paddle.height;

  if (withinX && withinY && ball.dy > 0) {
    const hitPos = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
    ball.dx = hitPos * 6;
    ball.dy = -Math.abs(ball.dy);
    ball.y = paddle.y - ball.radius - 1;
  }
}

function collideWithBricks() {
  for (const brick of bricks) {
    if (!brick.alive) continue;

    if (
      ball.x + ball.radius > brick.x &&
      ball.x - ball.radius < brick.x + brickGrid.width &&
      ball.y + ball.radius > brick.y &&
      ball.y - ball.radius < brick.y + brickGrid.height
    ) {
      brick.alive = false;
      ball.dy *= -1;
      gameState.score += 10;
      scoreEl.textContent = gameState.score;
      break;
    }
  }

  if (bricks.every((brick) => !brick.alive)) {
    endGame(true);
  }
}

function updateBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  if (ball.x + ball.radius >= canvas.width || ball.x - ball.radius <= 0) {
    ball.dx *= -1;
  }

  if (ball.y - ball.radius <= 0) {
    ball.dy *= -1;
  }

  if (ball.y - ball.radius > canvas.height) {
    endGame(false);
  }

  collideWithPaddle();
  collideWithBricks();
}

function loop() {
  if (!gameState.running) {
    draw();
    return;
  }

  updatePaddle();
  updateBall();
  draw();

  requestAnimationFrame(loop);
}

function endGame(won) {
  gameState.running = false;
  gameState.gameOver = true;

  overlay.classList.remove("hidden");
  overlayTitle.textContent = won ? "You Cleared the Board!" : "Game Over";
  overlayText.textContent = won
    ? `Final Score: ${gameState.score}. Press Space or Restart to play again.`
    : `The ball fell below the paddle. Final Score: ${gameState.score}.`;
  actionButton.textContent = "Restart";
}

function startGame() {
  if (!gameState.gameOver && gameState.running) return;

  resetGame();
  overlay.classList.add("hidden");
  gameState.running = true;
  requestAnimationFrame(loop);
}

window.addEventListener("keydown", (event) => {
  if (event.key in keys) {
    keys[event.key] = true;
    event.preventDefault();
  }

  if (event.code === "Space") {
    startGame();
  }
});

window.addEventListener("keyup", (event) => {
  if (event.key in keys) {
    keys[event.key] = false;
    event.preventDefault();
  }
});

actionButton.addEventListener("click", startGame);

resetGame();
draw();
