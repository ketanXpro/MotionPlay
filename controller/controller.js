const socket = io();

const btn = document.getElementById("startBtn");
const status = document.getElementById("status");

socket.on("connect", () => {
  socket.emit("controller-connected");
});

btn.onclick = async () => {
  status.innerHTML = "Starting...";

  // iOS permission (ignored on Android)
  if (
    typeof DeviceOrientationEvent !== "undefined" &&
    typeof DeviceOrientationEvent.requestPermission === "function"
  ) {
    try {
      const permission = await DeviceOrientationEvent.requestPermission();

      if (permission !== "granted") {
        status.innerHTML = "Permission denied";
        return;
      }
    } catch (e) {
      console.log(e);
    }
  }

  status.innerHTML = "Controller Active ✅";

  window.addEventListener("deviceorientation", (event) => {
    socket.emit("motion", {
      alpha: event.alpha ?? 0,
      beta: event.beta ?? 0,
      gamma: event.gamma ?? 0,
    });
  });

  window.addEventListener("devicemotion", (event) => {
    const acc = event.accelerationIncludingGravity;

    const x = acc?.x ?? 0;
    const y = acc?.y ?? 0;
    const z = acc?.z ?? 0;

    const force = Math.sqrt(x * x + y * y + z * z);

    if (force > 18) {
      socket.emit("slash", {
        force: force,
      });
    }
  });
};
