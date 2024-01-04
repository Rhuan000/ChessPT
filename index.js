import { Chess } from "./node_modules/chess.js/dist/esm/chess.js";

var savedPGNHistory 
var currentNumber
var chess = new Chess(); // Create a global Chess object to keep track of the game state
var board1 = Chessboard('board1', {
  position: 'start',
  pieceTheme: './chessboardjs-1.0.0/img/chesspieces/wikipedia/{piece}.png',
  draggable: false
});

console.log(chess)
function initialPosition(){
   currentNumber = -1
   board1.position('start')
}
function analyzePGN() {
   var pgnInput = document.getElementById('pgnInput').value;
   pgnInput = pgnInput.split(/\r?\n/).join(':')
   chess.reset(); // Reset the chess game
   chess.loadPgn(pgnInput, { newlineChar: ':' })

   savedPGNHistory = chess.history({verbose: true})
   currentNumber = savedPGNHistory.length -1 
   if (chess.fen()) {
     // Update the chessboard with the analyzed position
     board1.position(chess.fen());
     // Log the chess game moves to the console
     console.log('PGN moves:', chess.history());
   } else {
     console.error('Invalid PGN. Please enter a valid chess game in PGN format.');
  }
}

function goToNextMove() {
  if(currentNumber < savedPGNHistory.length - 1){
   currentNumber =  currentNumber + 1
      chess.load(savedPGNHistory[currentNumber].after)
      board1.position(chess.fen());
  } else {
   console.log('already in last move')
  }
}

function goToPreviousMove() { 
   if (currentNumber > 0) {
      currentNumber = currentNumber - 1
      chess.load(savedPGNHistory[currentNumber].after)
      board1.position(chess.fen());
   } else {
     console.log('Already at the last move.');
   }
}

console.log("Adding event listener for submit button");
document.getElementById('pgnForm').addEventListener('submit', function (event) {
  event.preventDefault();
  analyzePGN();
});

console.log("Adding event listener for previous move button");
document.querySelector('#previous-move').addEventListener('click', goToPreviousMove);

console.log("Adding event listener for next move button");
document.querySelector('#next-move').addEventListener('click', goToNextMove);

document.querySelector('#initial-position').addEventListener('click', initialPosition);