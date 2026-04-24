const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");

let board = Array(9).fill("");
let currentPlayer = "X";
let gameActive = true;

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

function resetGame() {
  board = Array(9).fill("");
  currentPlayer = "X";
  gameActive = true;
  updateStatus("Παίζει: X");
  renderBoard();
}

resetBtn.addEventListener("click", resetGame);

resetGame();
