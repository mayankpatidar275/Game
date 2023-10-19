let score = 0;
let cross = true;
let gameOverFlag = false;
let gameStarted = false;

let trackMusic = new Audio("assets/audio/music.mp3");
let jumpMusic = new Audio("assets/audio/jump.mp3");
let gameOverMusic = new Audio("assets/audio/game_over.mp3");

const over = document.querySelector(".over");
const level = document.querySelector(".level");
const scoreCont = document.querySelector(".score");
const playButton = document.getElementById("playButton");
const instruction = document.querySelector(".instruction");
const obstacle = document.querySelector(".obstacle");
const container = document.querySelector(".container");
const runner = document.querySelector(".runner");
const startRestartButton = document.getElementById("startRestartButton");

// handling start and restart
startRestartButton.addEventListener("click", () => {
    gameStarted = true;
    if(gameOverFlag){
      runner.style.left = "15vw";
      obstacle.style.animationDuration = 2.3 + 's';
      container.style.animationDuration = 10.5 + 's';
      over.style.visibility = "hidden";
      gameOverFlag = false;
      cross = true;
      score = 0;
      updateScore(score);
      gameOverMusic.pause();
      trackMusic.play();
      playButton.textContent = "Sound 🔊";
      animationFrameId = requestAnimationFrame(gameLoop);
    }
    startRestartButton.style.visibility = "hidden";
    startAnimation();
    obstacle.classList.add("animate_obstacle");
    container.classList.add("bg");
});

// music play/pause functionality
playButton.addEventListener("click", () => {
    if (trackMusic.paused) {
      if(gameOverFlag){
        if(gameOverMusic.paused){
          gameOverMusic.play();
          playButton.textContent = "Sound 🔊";
        }
        else{
          gameOverMusic.pause();
          playButton.textContent = "Sound 🔈";
        }
      }
      else{
        trackMusic.play();
        playButton.textContent = "Sound 🔊";
      }
      
    } else {
      trackMusic.pause();
      gameOverMusic.pause();
      playButton.textContent = "Sound 🔈";
    }
    playButton.blur();
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
      startAnimation();
      if(gameStarted) startRestartButton.style.visibility = "hidden";
    } else if (obstacleAnimationState === "running") {
      pauseAnimation();
      startRestartButton.style.visibility = "visible";
    }
  }
});

let animationFrameId;

function gameLoop() {

  if (!gameOverFlag) {

    const rx = parseInt(window.getComputedStyle(runner).getPropertyValue("left"));
    const ry = parseInt(window.getComputedStyle(runner).getPropertyValue("top"));

    const ox = parseInt(window.getComputedStyle(obstacle).getPropertyValue("left"));
    const oy = parseInt(window.getComputedStyle(obstacle).getPropertyValue("top"));

    const x_dist = Math.abs(rx - ox);
    const y_dist = Math.abs(ry - oy);

    if (y_dist < 55 && x_dist < 80) {
      pauseAnimation();
      gameStarted = false;
      obstacle.style.left = window.getComputedStyle(obstacle).getPropertyValue("left");
      runner.style.left = window.getComputedStyle(runner).getPropertyValue("left");
      obstacle.classList.remove("animate_obstacle");
      container.classList.remove("bg");
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

function moveRunnerRight() {
  const runner_x = parseInt(window.getComputedStyle(runner).getPropertyValue("left"));
  if(runner_x<1400) runner.style.left = runner_x + 22 + "px";
}

function moveRunnerLeft() {
  const runner_x = parseInt(window.getComputedStyle(runner).getPropertyValue("left"));
  if(runner_x>10) runner.style.left = runner_x - 22 + "px";
}

function updateScore(score) {
  scoreCont.innerHTML = "Score: " + score;
}

function pauseAnimation(){
  obstacle.style.animationPlayState = "paused";
  container.style.animationPlayState = "paused";
  runner.style.backgroundImage = "url(../assets/images/runner.png)";
}

function startAnimation() {
  obstacle.style.animationPlayState = "running";
  container.style.animationPlayState = "running";
  runner.style.backgroundImage = "url(../assets/images/runner.gif)";
}

animationFrameId = requestAnimationFrame(gameLoop);

// Start the game loop initially
// display's refresh rate (usually 60 times per second)
// better than using setTimeout 

// doesnt work in production: browser still need the first interaction to play.
// setTimeout(() => {
//   trackMusic.play()
// }, 1000);