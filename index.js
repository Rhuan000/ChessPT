// index.js
import { Chess } from "./node_modules/chess.js/dist/esm/chess.js";
import { Engine } from "./engine.js";
import { evaluateMove } from "./evaluating-process.js";
import { highlightLastMove } from "./chessboard-highlight.js";

export var currentNumber;
export var savedPGNHistory;

export var chess = new Chess();
export const engine = new Engine();

var previousScore = null 


document.getElementById('pgnForm').addEventListener('submit', function (event) {
  event.preventDefault();
  analyzePGN();
});

document.querySelector('#previous-move').addEventListener('click', goToPreviousMove);
document.querySelector('#next-move').addEventListener('click', goToNextMove);
document.querySelector('#initial-position').addEventListener('click', initialPosition);

var board1 = Chessboard('board1', {
  position: 'start',
  pieceTheme: './chessboardjs-1.0.0/img/chesspieces/wikipedia/{piece}.png',
  draggable: false,
});

function initialPosition() {
  currentNumber = -1;
  board1.position('start');
  engine.analyzePosition(board1.fen(), "w", previousScore, currentNumber);
  const squares = document.querySelectorAll('.square-55d63');
  squares.forEach(square => square.classList.remove('highlight-white', 'highlight-black', 'highlight-red'));


}

function analyzePGN() {
  var pgnInput = document.getElementById('pgnInput').value;
  pgnInput = pgnInput.split(/\r?\n/).join(':');
  chess.reset();
  chess.loadPgn(pgnInput, { newlineChar: ':' });
  
  savedPGNHistory = chess.history({ verbose: true });
  currentNumber = savedPGNHistory.length - 1;

  if (chess.fen()) {
    board1.position(chess.fen());
    engine.analyzePosition(chess.fen(), chess.turn(), currentNumber);
    highlightLastMove()
  } else {
    console.error('Invalid PGN. Please enter a valid chess game in PGN format.');
  }
}

var moveType
function goToNextMove() {
  if (currentNumber < savedPGNHistory.length - 1) {
    currentNumber = currentNumber + 1;
    chess.load(savedPGNHistory[currentNumber].after);
    board1.position(chess.fen());

    engine.analyzePosition(chess.fen(), chess.turn(), currentNumber);
    
    highlightLastMove()
    evaluateMove()

  } else {
    console.log('already in the last move');
  }
}

function goToPreviousMove() {
  if (currentNumber > 0) {
    currentNumber = currentNumber - 1;
    chess.load(savedPGNHistory[currentNumber].after);
    board1.position(chess.fen());
    engine.analyzePosition(chess.fen(), chess.turn(), currentNumber);
    highlightLastMove()
  } else {
    console.log('Already at the last move.');
  }
}