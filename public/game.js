// Canvasとコンテキストの設定
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// グリッドとゲーム設定
const gridSize = 20;
const tileCount = canvas.width / gridSize;
let snake = [{ x: 10, y: 10 }]; // スネークの初期位置
let food = { x: 15, y: 15 }; // 通常の食べ物
let specialFood = null; // 特殊な食べ物
let dx = 0;
let dy = 0;
let score = 0;
let gameSpeed = 100; // 初期速度（ミリ秒）
let gameInterval;

// 画像のロード
const snakeHeadImg = new Image();
snakeHeadImg.src = 'snake_head.png'; // スネークの頭の画像
const snakeBodyImg = new Image();
snakeBodyImg.src = 'snake_body.png'; // スネークの体の画像
const foodImg = new Image();
foodImg.src = 'food.png'; // 通常の食べ物の画像
const specialFoodImg = new Image();
specialFoodImg.src = 'special_food.png'; // 特殊な食べ物の画像

// サウンドのロード
const eatSound = new Audio('eat.mp3'); // 食べ物を食べた時の音
const gameOverSound = new Audio('gameover.mp3'); // ゲームオーバーの音

// ゲームの開始
gameInterval = setInterval(gameLoop, gameSpeed);

// ゲームループ
function gameLoop() {
  update();
  draw();
}

// ゲームの更新
function update() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  // 通常の食べ物を食べた場合
  if (head.x === food.x && head.y === food.y) {
    score += 1;
    eatSound.play();
    spawnFood();
    spawnSpecialFood(); // 特殊な食べ物をランダムで出現
  }
  // 特殊な食べ物を食べた場合
  else if (specialFood && head.x === specialFood.x && head.y === specialFood.y) {
    score += 5; // ボーナススコア
    eatSound.play();
    specialFood = null; // 特殊な食べ物を消す
  } else {
    snake.pop();
  }

  // 壁との衝突
  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
    gameOver();
    return;
  }

  // 自分自身との衝突
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      gameOver();
      return;
    }
  }

  // レベルアップ（スコアが10の倍数の時）
  if (score % 10 === 0 && score !== 0 && dx !== 0) {
    clearInterval(gameInterval);
    gameSpeed = Math.max(50, gameSpeed - 10); // 速度を上げる
    gameInterval = setInterval(gameLoop, gameSpeed);
  }
}

// 描画
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // スネークの描画
  ctx.drawImage(snakeHeadImg, snake[0].x * gridSize, snake[0].y * gridSize, gridSize, gridSize);
  for (let i = 1; i < snake.length; i++) {
    ctx.drawImage(snakeBodyImg, snake[i].x * gridSize, snake[i].y * gridSize, gridSize, gridSize);
  }

  // 食べ物の描画
  ctx.drawImage(foodImg, food.x * gridSize, food.y * gridSize, gridSize, gridSize);
  if (specialFood) {
    ctx.drawImage(specialFoodImg, specialFood.x * gridSize, specialFood.y * gridSize, gridSize, gridSize);
  }

  // スコアの描画
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText(`スコア: ${score}`, 10, 30);
}

// 食べ物の生成
function spawnFood() {
  food.x = Math.floor(Math.random() * tileCount);
  food.y = Math.floor(Math.random() * tileCount);
}

// 特殊な食べ物の生成（10%の確率）
function spawnSpecialFood() {
  if (!specialFood && Math.random() < 0.1) {
    specialFood = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    };
  }
}

// ゲームオーバー処理
function gameOver() {
  gameOverSound.play();
  alert(`ゲームオーバー！スコア: ${score}`);
  resetGame();
}

// ゲームのリセット
function resetGame() {
  snake = [{ x: 10, y: 10 }];
  food = { x: 15, y: 15 };
  specialFood = null;
  dx = 0;
  dy = 0;
  score = 0;
  clearInterval(gameInterval);
  gameSpeed = 100;
  gameInterval = setInterval(gameLoop, gameSpeed);
}

// キー入力処理
document.addEventListener('keydown', event => {
  switch (event.key) {
    case 'ArrowUp':
      if (dy === 0) { dx = 0; dy = -1; }
      break;
    case 'ArrowDown':
      if (dy === 0) { dx = 0; dy = 1; }
      break;
    case 'ArrowLeft':
      if (dx === 0) { dx = -1; dy = 0; }
      break;
    case 'ArrowRight':
      if (dx === 0) { dx = 1; dy = 0; }
      break;
  }
});