const socket = io();

const status = document.getElementById("status");

const alpha = document.getElementById("alpha");
const beta = document.getElementById("beta");
const gamma = document.getElementById("gamma");

socket.on("controller-connected", () => {
  status.innerText = "Controller Connected ✅";
});

socket.on("controller-disconnected", () => {
  status.innerText = "Waiting for Controller...";
});

socket.on("motion", (data) => {
  alpha.innerText = Math.round(data.alpha);
  beta.innerText = Math.round(data.beta);
  gamma.innerText = Math.round(data.gamma);
});
