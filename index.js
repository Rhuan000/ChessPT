// index.js
import { Chess } from "./node_modules/chess.js/dist/esm/chess.js";
import { Engine } from "./engine.js";

var savedPGNHistory;
var currentNumber;
var chess = new Chess();
var lastCheck
const engine = new Engine();


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
  engine.analyzePosition(board1.fen(), "w");
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
    engine.analyzePosition(chess.fen(), chess.turn());
    highlightLastMove()
  } else {
    console.error('Invalid PGN. Please enter a valid chess game in PGN format.');
  }
}

function goToNextMove() {
  if (currentNumber < savedPGNHistory.length - 1) {
    currentNumber = currentNumber + 1;
    chess.load(savedPGNHistory[currentNumber].after);
    board1.position(chess.fen());
    engine.analyzePosition(chess.fen(), chess.turn());
    highlightLastMove()
    console.log(isKingInCheck())

  } else {
    console.log('already in the last move');
  }
}

function goToPreviousMove() {
  if (currentNumber > 0) {
    currentNumber = currentNumber - 1;
    chess.load(savedPGNHistory[currentNumber].after);
    board1.position(chess.fen());    
    engine.analyzePosition(chess.fen(), chess.turn());
    highlightLastMove()
    console.log(isKingInCheck())
  } else {
    console.log('Already at the last move.');
  }
}

function highlightLastMove() {
  const fromMove = savedPGNHistory[currentNumber]?.from;
  const toMove = savedPGNHistory[currentNumber]?.to;
  if (fromMove) {
    const squares = document.querySelectorAll('.square-55d63');
    lastCheck?.classList.remove('highlight-red')
    squares.forEach(square => square.classList.remove('highlight-white', 'highlight-black', 'highlight-red'));

    const colorToHighlight = chess.turn() === 'b' ? 'white' : 'black';

    squares.forEach(square => {
      if (square.getAttribute('data-square') === fromMove || square.getAttribute('data-square') === toMove) {
        square.classList.add(`highlight-${colorToHighlight}`);
      } else if(square.getAttribute('data-square') === isKingInCheck()){
        console.log(square)
        //square.classList.add(`highlight-red`)
        setTimeout(()=>{
          lastCheck = square.children[1]? square.children[1]: square.children[0]
          lastCheck.classList.add('highlight-red')
        }
        , 400)
        
      }
    });
  }
}

function isKingInCheck() {
  const turn = chess.turn();

  //Taking off the null items of array.  
  const piecesArray = chess.board().map(row =>
    row.filter(square => square !== null)
  );
  //combining all arrays into a single one with some item. 
  const flattenedArray = [].concat(...piecesArray);

  let kingSquare = flattenedArray.find(piece => piece.type === 'k' && piece.color === turn);
  kingSquare = kingSquare.square
  console.log(kingSquare, chess.inCheck())
  if(chess.inCheck() && chess.get(kingSquare).color === turn){
    return kingSquare
  }
}
