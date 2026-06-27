const socket = io();

const btn = document.getElementById("startBtn");
const status = document.getElementById("status");

socket.on("connect", () => {
  socket.emit("controller-connected");
});

btn.onclick = async () => {
  status.innerHTML = "Starting...";

  if (
    typeof DeviceMotionEvent !== "undefined" &&
    typeof DeviceMotionEvent.requestPermission === "function"
  ) {
    try {
      const permission = await DeviceMotionEvent.requestPermission();

      if (permission !== "granted") {
        status.innerHTML = "Permission denied";
        return;
      }
    } catch (e) {
      console.log(e);
    }
  }

  window.addEventListener("devicemotion", (event) => {
    status.innerHTML = `
      X: ${event.accelerationIncludingGravity?.x}<br>
      Y: ${event.accelerationIncludingGravity?.y}<br>
      Z: ${event.accelerationIncludingGravity?.z}
    `;

    socket.emit("motion", {
      alpha: event.accelerationIncludingGravity?.x ?? 0,
      beta: event.accelerationIncludingGravity?.y ?? 0,
      gamma: event.accelerationIncludingGravity?.z ?? 0,
    });
  });
};
