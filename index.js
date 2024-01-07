import { Chess } from "./node_modules/chess.js/dist/esm/chess.js";

var savedPGNHistory 
var currentNumber
var turn
 
var chess = new Chess(); 
const barMain = document.querySelector('#bar-main')
const barChild = document.querySelector('#bar-child')
const barChildInitialHeight = barChild.offsetHeight
const moveScore = document.querySelector('#move-score')

const stockfish = new Worker('./node_modules/stockfish/src/stockfish-nnue-16.js');
    stockfish.onmessage = (event) => {
      const data = event.data
      const splicedData = data.split(' ')
      let i = 0;
      for(let content of splicedData){
        if(content === "score"){
          let scoreType = splicedData[i+1]
          if(scoreType === "mate"){
            let mateIn = splicedData[i+2]
            if(chess.turn() === "w"){
              barChild.style.height = `${mateIn === "0" ? '100%': '0px'}`
            } else {
              barChild.style.height = `${mateIn === "0" ? '0px': '100%'}`

            }
            moveScore.innerHTML = `#${mateIn === "0" ? "" : mateIn}` 
            
          } else {
            let score = splicedData[i+2]
            score = parseInt(score, 10)
            if(turn === "b"){
              score *= -1
              console.log(score)
            }
            score = (score/100).toFixed(2)
            if(score < 0){
              barChild.style.height = `${barChildInitialHeight + (((-1 * score)* 8) * (2*barChildInitialHeight)/100)}px`
              moveScore.innerHTML = '-' + Math.abs(score)
            }else if(score > 0){
              barChild.style.height = `${barChildInitialHeight - ((score* 8) * (2*barChildInitialHeight)/100)}px`
              moveScore.innerHTML = '+' + score
            }else {
              moveScore.innerHTML = score
            }
            break
          }
        }
        i += 1
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
  stockfishAnalyze(board1.fen())
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
  turn = chess.turn()
  if (chess.fen()) {
    board1.position(chess.fen());
    stockfishAnalyze(chess.fen())
  } else {
    console.error('Invalid PGN. Please enter a valid chess game in PGN format.');
  }
}

function goToNextMove() {
  if(currentNumber < savedPGNHistory.length - 1){
      currentNumber =  currentNumber + 1
      chess.load(savedPGNHistory[currentNumber].after)
      board1.position(chess.fen());
      turn = chess.turn()
      stockfishAnalyze(chess.fen())
    } else {
      console.log('already in last move')
    }
  }
  
  function goToPreviousMove() { 
    if (currentNumber > 0) {
      currentNumber = currentNumber - 1
      chess.load(savedPGNHistory[currentNumber].after)
      board1.position(chess.fen());
      stockfishAnalyze(chess.fen())
      turn = chess.turn()
    } else { 
     console.log('Already at the last move.');
   }
}

function stockfishAnalyze(fen){
  stockfish.postMessage('stop')
  const formatedMessage = `position fen ${fen}`
  stockfish.postMessage(formatedMessage)
  stockfish.postMessage(`go depth ${'25'}`)
}