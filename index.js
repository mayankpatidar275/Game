score = 0;
cross = true;

var aud = document.createElement("AUDIO");
aud.setAttribute("src", "music.mp3");
aud.play();

document.onkeydown = function (e) {
  // console.log(`${e.which}`);
  if (e.keyCode == 38) {
    runner = document.querySelector(".runner");
    runner.classList.add("jump");

    var aud2 = document.createElement("AUDIO");
    aud2.setAttribute("src", "jump.mp3");
    aud2.play();

    setTimeout(() => {
      runner.classList.remove("jump");
    }, 800);
  }
  if (e.keyCode == 39) {
    runner = document.querySelector(".runner");
    runner_x = parseInt(
      window.getComputedStyle(runner, null).getPropertyValue("left")
    );
    runner.style.left = runner_x + 12 + "px";
  }
  if (e.keyCode == 37) {
    runner = document.querySelector(".runner");
    runner_x = parseInt(
      window.getComputedStyle(runner, null).getPropertyValue("left")
    );
    runner.style.left = runner_x - 12 + "px";
  }
};
setInterval(() => {
  runner = document.querySelector(".runner");
  over = document.querySelector(".over");
  obstacle = document.querySelector(".obstacle");

  rx = parseInt(window.getComputedStyle(runner, null).getPropertyValue("left"));
  ry = parseInt(window.getComputedStyle(runner, null).getPropertyValue("top"));

  ox = parseInt(
    window.getComputedStyle(obstacle, null).getPropertyValue("left")
  );
  oy = parseInt(
    window.getComputedStyle(obstacle, null).getPropertyValue("top")
  );

  x_dist = Math.abs(rx - ox);
  y_dist = Math.abs(ry - oy);
  console.log(x_dist, y_dist);
  if (y_dist < 52 && x_dist < 80) {
    obstacle.classList.remove("animate_obstacle_2");
    container.classList.remove("bg2");
    over.style.visibility = "visible";
    over.classList.add("animate_over");
    aud.pause();

    var aud3 = document.createElement("AUDIO");
    aud3.setAttribute("src", "game_over.mp3");
    aud3.play();
  } else if (x_dist < 62 && cross) {
    score += 1;
    update_score(score);
    cross = false;
    setTimeout(() => {
      cross = true;
    }, 800);
    // setTimeout(() => {
    //     aniDur = parseFloat(window.getComputedStyle(obstacle, null).getPropertyValue('animation-duration'));
    //     newDur = aniDur - 0.8 ;
    //     obstacle.style.animationDuration = newDur + "s";

    // aniDur2 = parseFloat(window.getComputedStyle(container, null).getPropertyValue('animation-duration'));
    // newDur2 = aniDur2 - 2.9 ;
    // container.style.animationDuration = newDur2 + "s";
    // }, 1000);
  }
}, 10);

function update_score(score) {
  scoreCont = document.querySelector(".score");
  scoreCont.innerHTML = "Score:" + score;
}

// setTimeout(() => {
// container = document.querySelectorAll(".container");
// container.classList.remove("bg2");
// container.classList.add("bg");
// bg_move = parseFloat(window.getComputedStyle(container, null).getPropertyValue('animation-duration'));
// console.log("bg_move");
// bg_move.style.animationDuration = bg_move + 5 + "s";

// }, 6000);

setTimeout(() => {
  obst = document.querySelector(".obstacle");
  obst.classList.remove("animate_obstacle");
  obst.classList.add("animate_obstacle_2");
}, 7000);

setTimeout(() => {
  container = document.querySelector(".container");
  container.classList.remove("bg");
  container.classList.add("bg2");
}, 7000);
