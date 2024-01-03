// chessboard-init.js
var board1 = Chessboard('board1', {
  position: 'start',
  pieceTheme: './chessboardjs-1.0.0/img/chesspieces/wikipedia/{piece}.png',
  draggable: false
});

// Later in your code, when you want to set draggable to true
function setDraggableToTrue() {
  // Update the draggable property
  board1.draggable = true;

  // Redraw the board with the updated configuration
  board1.start();
}

// Call the function when needed
setDraggableToTrue();
