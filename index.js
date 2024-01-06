import { Chess } from "./node_modules/chess.js/dist/esm/chess.js";

var savedPGNHistory 
var currentNumber
var turn 
var chess = new Chess(); 

const stockfish = new Worker('./node_modules/stockfish/src/stockfish-nnue-16.js');
    stockfish.onmessage = (event) => {
      const data = event.data
      console.log(event.data);
      const splicedData = data.split(' ')
      var score = splicedData[9]
      if(score){
        score = parseInt(score)
        if(turn === "b"){
          score *= -1
        }
        console.log(score/100)
      }
};

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
  draggable: false
});
function initialPosition(){
  currentNumber = -1
  board1.position('start')
}
function analyzePGN() {
  var pgnInput = document.getElementById('pgnInput').value;
  pgnInput = pgnInput.split(/\r?\n/).join(':')
  chess.reset(); // Reset the chess game
  chess.loadPgn(pgnInput, { newlineChar: ':' })
  stockfish.postMessage('uci')
  stockfish.postMessage('isready')
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
  console.log(stockfish)
  if(currentNumber < savedPGNHistory.length - 1){
      currentNumber =  currentNumber + 1
      chess.load(savedPGNHistory[currentNumber].after)
      board1.position(chess.fen());
      turn = chess.turn()
      stockfish.postMessage('stop')
      const formatedMessage = `position fen ${chess.fen()}`
      stockfish.postMessage(formatedMessage)
      stockfish.postMessage(`go depth ${'25'}`)
      console.log(formatedMessage)
    } else {
      console.log('already in last move')
    }
  }
  
  function goToPreviousMove() { 
    if (currentNumber > 0) {
      stockfish.postMessage('stop')
      const formatedMessage = `position fen ${chess.fen()}`
      stockfish.postMessage(formatedMessage)
      console.log(formatedMessage)
      console.log(chess.turn())
      turn = chess.turn()
      stockfish.postMessage(`go depth ${'25'}`)
      currentNumber = currentNumber - 1
      chess.load(savedPGNHistory[currentNumber].after)
      board1.position(chess.fen());
   } else { 
     console.log('Already at the last move.');
   }
}
