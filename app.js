const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const newGameBtn = document.getElementById("newGameBtn");
const resetScoreBtn = document.getElementById("resetScoreBtn");
const scoreXEl = document.getElementById("scoreX");
const scoreOEl = document.getElementById("scoreO");
const updateBanner = document.getElementById("updateBanner");
const updateBtn = document.getElementById("updateBtn");

let board = Array(9).fill("");
let currentPlayer = "X";
let gameActive = true;
let scoreX = 0;
let scoreO = 0;
let waitingWorker = null;

const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function updateScores() {
  scoreXEl.textContent = scoreX;
  scoreOEl.textContent = scoreO;
}

function renderBoard() {
  boardEl.innerHTML = "";
  board.forEach((value, index) => {
    const cell = document.createElement("button");
    cell.className = "cell";
    cell.textContent = value;
    cell.disabled = value !== "" || !gameActive;
    cell.addEventListener("click", () => handleMove(index));
    boardEl.appendChild(cell);
  });
}

function updateStatus(message) {
  statusEl.textContent = message;
}

function checkWinner() {
  for (const [a, b, c] of winningCombos) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return board.includes("") ? null : "draw";
}

function handleMove(index) {
  if (!gameActive || board[index] !== "") return;

  board[index] = currentPlayer;
  const result = checkWinner();

  if (result === "X" || result === "O") {
    if (result === "X") scoreX++;
    if (result === "O") scoreO++;
    updateScores();
    updateStatus(`Νικητής: ${result}`);
    gameActive = false;
  } else if (result === "draw") {
    updateStatus("Ισοπαλία");
    gameActive = false;
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateStatus(`Παίζει: ${currentPlayer}`);
  }

  renderBoard();
}

function newGame() {
  board = Array(9).fill("");
  currentPlayer = "X";
  gameActive = true;
  updateStatus("Παίζει: X");
  renderBoard();
}

function resetScore() {
  scoreX = 0;
  scoreO = 0;
  updateScores();
  newGame();
}

newGameBtn.addEventListener("click", newGame);
resetScoreBtn.addEventListener("click", resetScore);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").then((reg) => {
    if (reg.waiting) {
      waitingWorker = reg.waiting;
      updateBanner.classList.remove("hidden");
    }

    reg.addEventListener("updatefound", () => {
      const newWorker = reg.installing;
      if (!newWorker) return;

      newWorker.addEventListener("statechange", () => {
        if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
          waitingWorker = newWorker;
          updateBanner.classList.remove("hidden");
        }
      });
    });
  });

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    window.location.reload();
  });
}

updateBtn.addEventListener("click", () => {
  if (waitingWorker) {
    waitingWorker.postMessage({ type: "SKIP_WAITING" });
  }
});
