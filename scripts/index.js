let score = 0;
let cross = true;
let gameOverFlag = false; // Flag to track game over

let aud = null; // Declare audio element
let musicStarted = false;

const playButton = document.getElementById("playButton");

playButton.addEventListener("click", () => {
  if (!musicStarted) {
    aud = new Audio("assets/audio/music.mp3"); // Initialize audio on first click
    aud.play();
    musicStarted = true;
    playButton.textContent = "Sound 🔊"; // Update button text when sound starts
  } else {
    if (aud.paused) {
      aud.play(); // Play music if paused
      playButton.textContent = "Sound 🔊"; // Update button text when sound resumes
    } else {
      aud.pause(); // Pause music if playing
      playButton.textContent = "Sound 🔈"; // Update button text when sound is paused
    }
  }
});

document.addEventListener("keydown", function (e) {
  if (e.keyCode === 38) {
    const runner = document.querySelector(".runner");
    runner.classList.add("jump");

    const aud2 = new Audio("assets/audio/jump.mp3");
    aud2.play();

    setTimeout(() => {
      runner.classList.remove("jump");
    }, 800);
  }
  if (e.keyCode === 39) {
    moveRunnerRight();
  }
  if (e.keyCode === 37) {
    moveRunnerLeft();
  }
});

function moveRunnerRight() {
  const runner = document.querySelector(".runner");
  const runner_x = parseInt(window.getComputedStyle(runner).getPropertyValue("left"));
  runner.style.left = runner_x + 12 + "px";
}

function moveRunnerLeft() {
  const runner = document.querySelector(".runner");
  const runner_x = parseInt(window.getComputedStyle(runner).getPropertyValue("left"));
  runner.style.left = runner_x - 12 + "px";
}

let animationFrameId;

function gameLoop() {
  if (!gameOverFlag) {
    const runner = document.querySelector(".runner");
    const over = document.querySelector(".over");
    const obstacle = document.querySelector(".obstacle");
    const container = document.querySelector(".container");

    const rx = parseInt(window.getComputedStyle(runner).getPropertyValue("left"));
    const ry = parseInt(window.getComputedStyle(runner).getPropertyValue("top"));

    const ox = parseInt(window.getComputedStyle(obstacle).getPropertyValue("left"));
    const oy = parseInt(window.getComputedStyle(obstacle).getPropertyValue("top"));

    const x_dist = Math.abs(rx - ox);
    const y_dist = Math.abs(ry - oy);

    if (y_dist < 55 && x_dist < 80) {
      obstacle.style.animationPlayState = "paused"; // Pause the obstacle animation
      container.style.animationPlayState = "paused"; // Pause the background animation
      over.style.visibility = "visible";
      over.classList.add("animate_over");
      gameOverFlag = true; // Set game over flag to true
      if (aud) {
        aud.pause(); // Pause music on game over if aud is defined
      }

      const aud3 = new Audio("assets/audio/game_over.mp3");
      aud3.play();
    } else if (x_dist < 62 && cross) {
      score += 1;
      updateScore(score);
      cross = false;
      setTimeout(() => {
        cross = true;
      }, 800);
    }

    animationFrameId = requestAnimationFrame(gameLoop);
  }
}

function updateScore(score) {
  const scoreCont = document.querySelector(".score");
  scoreCont.innerHTML = "Score: " + score;
}

// Start the game loop initially
animationFrameId = requestAnimationFrame(gameLoop);