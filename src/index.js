// index.js
import { Chess } from "../node_modules/chess.js/dist/esm/chess.js";
import { Engine } from "./utils/engine/Engine.js";
import { evaluateMove } from "./evaluating-process.js";
import { highlightLastMove } from "./chessboard-highlight.js";

export var currentNumber;
export var savedPGNHistory;

export var chess = new Chess();
export var engine = new Engine();

var previousScore = null 

const displayMoveDetail = document.querySelector('#move-response')

document.getElementById('pgnForm').addEventListener('submit', function (event) {
  event.preventDefault();
  analyzePGN();
});

document.querySelector('#previous-move').addEventListener('click', goToPreviousMove);
document.querySelector('#next-move').addEventListener('click', goToNextMove);
document.querySelector('#initial-position').addEventListener('click', initialPosition);
document.querySelector('#move-detail').addEventListener('click', moveDetail);

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
    engine.analyzePosition(chess.fen(), savedPGNHistory[currentNumber].from,  savedPGNHistory[currentNumber].to, currentNumber, chess.turn());
    highlightLastMove()
  } else {
    console.error('Invalid PGN. Please enter a valid chess game in PGN format.');[]
  }
}

var moveType
function goToNextMove() {
  if (currentNumber < savedPGNHistory.length - 1) {
    currentNumber = currentNumber + 1;
    chess.load(savedPGNHistory[currentNumber].after);
    board1.position(chess.fen());

    engine.analyzePosition(chess.fen(), savedPGNHistory[currentNumber].from,  savedPGNHistory[currentNumber].to, currentNumber, chess.turn());
    
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
    engine.analyzePosition(chess.fen(), savedPGNHistory[currentNumber].from,  savedPGNHistory[currentNumber].to, currentNumber, chess.turn());
    highlightLastMove()
  } else {
    console.log('Already at the last move.');
  }
}

import { makeBARDRequest } from "./make-request.js";
async function moveDetail(){
  const lastMove = savedPGNHistory[currentNumber].san;
  const data = {
    data: `Analyze this position ${chess.fen()} the last move was ${lastMove} made by ${chess.turn() === "w" ? "black" : "white"} why stockfish about this move says ${engine.Position.moveType}, answer with 200 max caracters.`
  }
  console.log(data)
  const jsonData = data
  displayMoveDetail.innerHTML = await makeBARDRequest(jsonData)

}