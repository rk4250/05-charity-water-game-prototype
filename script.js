const gameArea = document.getElementById("gameArea");
const bucket = document.getElementById("bucket");
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const startButton = document.getElementById("startButton");
const scoreFill = document.getElementById("scoreFill");

let score = 0;
let lives = 3;
let gameInterval;
let isGameRunning = false;

function createRaindrop() {
  const drop = document.createElement("div"); 
  drop.classList.add("raindrop"); 

  // Random color: 70% blue, 30% grey
  const isBlue = Math.random() < 0.7;
  drop.classList.add(isBlue ? "blue" : "grey");

  // Random x position
  drop.style.left = Math.random() * 370 + "px";
  gameArea.appendChild(drop);

  let fallSpeed = 2 + Math.random() * 3;
  let topPosition = 0;

  const fall = setInterval(() => {
    topPosition += fallSpeed;
    drop.style.top = topPosition + "px";

    const dropRect = drop.getBoundingClientRect();
    const bucketRect = bucket.getBoundingClientRect();

    // Collision detection
    if (
      dropRect.bottom >= bucketRect.top &&
      dropRect.left < bucketRect.right &&
      dropRect.right > bucketRect.left
    ) {
      if (drop.classList.contains("blue")) {
        score += 5;
      } else {
        lives -= 1;
      }
      scoreDisplay.textContent = `Score: ${score}`;
      livesDisplay.textContent = `Lives: ${lives}`;
      updateScoreBar();
      drop.remove();
      clearInterval(fall);
    }

    // Remove if falls out of area
    if (topPosition > 500) {
      drop.remove();
      clearInterval(fall);
    }

    // Game over
    if (lives <= 0) {
      clearInterval(fall);
      clearInterval(gameInterval);
      isGameRunning = false;
      alert("💧 Game Over! Your final score: " + score);
    }
  }, 20);
}

function updateScoreBar() {
  const percent = Math.min((score / 100) * 100, 100);
  scoreFill.style.width = percent + "%";
}

startButton.addEventListener("click", () => {
  if (isGameRunning) return; // Prevent double start
  isGameRunning = true;

  // Reset game
  score = 0;
  lives = 3;
  scoreDisplay.textContent = "Score: 0";
  livesDisplay.textContent = "Lives: 3";
  scoreFill.style.width = "0%";

  // Remove old raindrops but NOT the bucket
  const oldDrops = document.querySelectorAll(".raindrop");
  oldDrops.forEach((d) => d.remove());

  clearInterval(gameInterval);
  gameInterval = setInterval(createRaindrop, 800);
});

// ✅ Move bucket
document.addEventListener("keydown", (event) => {
  const bucketLeft = parseInt(window.getComputedStyle(bucket).left);
  const step = gameArea.offsetWidth * 0.05; // Move 5% of game width per press


  if (!isGameRunning) return; // Only move when game is active

  if (event.key === "ArrowLeft" && bucketLeft > 0) {
    bucket.style.left = bucketLeft - step + "px";
  }
  if (event.key === "ArrowRight" && bucketLeft < 350) {
    bucket.style.left = bucketLeft + step + "px";
  }
});


