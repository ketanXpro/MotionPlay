const scoreText = document.getElementById("score");

let score = 0;

console.log("GAME.JS LOADED");

const socket = io();

const status = document.getElementById("status");
const cursor = document.getElementById("cursor");
const apple = document.getElementById("apple");

let angle = 0;
let score = 0;

// Current sword position
let currentX = 380;
let currentY = 230;

// Target position
let targetX = 380;
let targetY = 230;

// ----------------------------
// Controller Connection
// ----------------------------

socket.on("controller-connected", () => {
  status.innerText = "Controller Connected ✅";
});

socket.on("controller-disconnected", () => {
  status.innerText = "Waiting for Controller...";
});

// ----------------------------
// Phone Motion
// ----------------------------

socket.on("motion", (data) => {
  console.log(data);

  targetX = 380 + data.gamma * 6;
  targetY = 230 + data.beta * 4;

  angle = data.gamma;

  cursor.style.transform = `rotate(${angle}deg)`;
});

// ----------------------------
// Smooth Animation
// ----------------------------

function animate() {
  currentX += (targetX - currentX) * 0.3;
  currentY += (targetY - currentY) * 0.3;

  cursor.style.left = currentX + "px";
  cursor.style.top = currentY + "px";

  requestAnimationFrame(animate);
}

animate();

// ----------------------------
// Sword Slash
// ----------------------------

socket.on("slash", () => {
  const swordRect = cursor.getBoundingClientRect();
  const appleRect = apple.getBoundingClientRect();

  if (
    swordRect.left < appleRect.right &&
    swordRect.right > appleRect.left &&
    swordRect.top < appleRect.bottom &&
    swordRect.bottom > appleRect.top
  ) {
    score++;
    scoreText.innerText = `Score: ${score}`;

    apple.innerHTML = "💥";

    setTimeout(() => {
      apple.innerHTML = "🍎";

      apple.style.left = Math.random() * 700 + "px";
      apple.style.top = Math.random() * 400 + "px";
    }, 250);
  }
});
