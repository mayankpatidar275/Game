let score = 0;
let cross = true;
let gameOverFlag = false;
let musicStarted = false;

let trackMusic = new Audio("assets/audio/music.mp3");
let jumpMusic = new Audio("assets/audio/jump.mp3");
let gameOverMusic = new Audio("assets/audio/game_over.mp3");

const over = document.querySelector(".over");
const level = document.querySelector(".level");
const playButton = document.getElementById("playButton");
const instruction = document.querySelector(".instruction");
const obstacle = document.querySelector(".obstacle");
const container = document.querySelector(".container");
const runner = document.querySelector(".runner");
const startRestartButton = document.getElementById("startRestartButton");

// doesnt work in production: browser still need the first interaction to play.
// setTimeout(() => {
//   trackMusic.play()
// }, 1000);

// handling start and restart
startRestartButton.addEventListener("click", () => {
    if(gameOverFlag){
      runner.style.backgroundImage = "url(../assets/images/runner.gif)";
      obstacle.style.animationPlayState = "running";
      container.style.animationPlayState = "running";
      obstacle.classList.add("animate_obstacle");
      container.classList.add("bg");
      runner.style.left = "15vw";
      obstacle.style.left = "0vw";
      obstacle.style.animationDuration = 2.3 + 's';
      container.style.animationDuration = 10.5 + 's';
      over.style.visibility = "hidden";
      startRestartButton.style.visibility = "hidden";
      gameOverFlag = false;
      instruction.textContent = "Arrow keys to play | Space to pause"
      score = 0;
      updateScore(score);
      gameOverMusic.pause();
      cross = true;
      animationFrameId = requestAnimationFrame(gameLoop);
    }
    else{
      container.classList.add("bg");
      obstacle.classList.add("animate_obstacle");
      startRestartButton.style.visibility = "hidden";
    }
});

// music play/pause functionality
playButton.addEventListener("click", () => {
    if (trackMusic.paused) {
      trackMusic.play();
      playButton.textContent = "Sound 🔊";
    } else {
      trackMusic.pause();
      playButton.textContent = "Sound 🔈";
    }
});

document.addEventListener("keydown", function (e) {
  if (e.keyCode === 38) {
    runner.classList.add("jump");
    jumpMusic.play();
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
  if (e.keyCode === 32 && !(gameOverFlag)) {
    const obstacleComputedStyle = window.getComputedStyle(obstacle);
    const obstacleAnimationState = obstacleComputedStyle.getPropertyValue("animation-play-state");
    
    if (obstacleAnimationState === "paused") {
      obstacle.style.animationPlayState = "running";
      container.style.animationPlayState = "running";
      runner.style.backgroundImage = "url(../assets/images/runner.gif)";
    } else if (obstacleAnimationState === "running") {
      obstacle.style.animationPlayState = "paused";
      container.style.animationPlayState = "paused";
      runner.style.backgroundImage = "url(../assets/images/runner.png)";
    }
  }
});

function moveRunnerRight() {
  const runner_x = parseInt(window.getComputedStyle(runner).getPropertyValue("left"));
  runner.style.left = runner_x + 22 + "px";
}

function moveRunnerLeft() {
  const runner_x = parseInt(window.getComputedStyle(runner).getPropertyValue("left"));
  runner.style.left = runner_x - 22 + "px";
}
// console.log("in gameloop");
let animationFrameId;

function gameLoop() {
  console.log("in gameloop");
  if (!gameOverFlag) {

    const rx = parseInt(window.getComputedStyle(runner).getPropertyValue("left"));
    const ry = parseInt(window.getComputedStyle(runner).getPropertyValue("top"));

    const ox = parseInt(window.getComputedStyle(obstacle).getPropertyValue("left"));
    const oy = parseInt(window.getComputedStyle(obstacle).getPropertyValue("top"));
    // console.log(ox);

    const x_dist = Math.abs(rx - ox);
    const y_dist = Math.abs(ry - oy);
    console.log("in gameoverflag");
    if (y_dist < 55 && x_dist < 80) {

      obstacle.style.animationPlayState = "paused";
      container.style.animationPlayState = "paused";
      obstacle.style.left = window.getComputedStyle(obstacle).getPropertyValue("left");
      runner.style.left = window.getComputedStyle(runner).getPropertyValue("left");
      obstacle.classList.remove("animate_obstacle");
      container.classList.remove("bg");
      
      runner.style.backgroundImage = "url(../assets/images/runner.png)";
      over.style.visibility = "visible";
      startRestartButton.style.visibility = "visible";
      over.classList.add("animate_over");
      gameOverFlag = true; 
      if (trackMusic) {
        trackMusic.pause(); 
        playButton.textContent = "Sound 🔈";
      }
      gameOverMusic.play();

    } else if (x_dist < 62 && cross) {
      score += 1;
      updateScore(score);
      cross = false;
      setTimeout(() => {
        cross = true;
      }, 800);
      setTimeout(() => {
        obstacleAniDur = parseFloat(window.getComputedStyle(obstacle, null).getPropertyValue('animation-duration'));
        bgAniDur = parseFloat(window.getComputedStyle(container, null).getPropertyValue('animation-duration'));
        newObstacleAniDur = obstacleAniDur - parseFloat(obstacleAniDur*8.5)/100;
        newBgAniDur = bgAniDur - parseFloat(bgAniDur*8.5)/100;
        if(score===2 || score===4 || score===10){
          obstacle.style.animationDuration = newObstacleAniDur + 's';
          container.style.animationDuration = newBgAniDur + 's';
          if(!gameOverFlag){
            level.style.opacity = "1";
            setTimeout(()=>{
              level.style.opacity = "0";
            }, 1000);
          }
        }
    }, 500);
    }

    animationFrameId = requestAnimationFrame(gameLoop);
  }
}

function updateScore(score) {
  const scoreCont = document.querySelector(".score");
  scoreCont.innerHTML = "Score: " + score;
  // console.log(score);
}

// Start the game loop initially
// display's refresh rate (usually 60 times per second)
// better than using setTimeout 
animationFrameId = requestAnimationFrame(gameLoop);
