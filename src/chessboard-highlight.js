import { savedPGNHistory, currentNumber, chess } from "./index.js";
//#95af8a good //#f7bf44 inaccuracy //#e58f2a mistake //#96bc4b excelent
let lastCheck
export function highlightLastMove() {
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
          //square.classList.add(`highlight-red`)
          setTimeout(()=>{
            lastCheck = square.children[2] ? square.children[2]: square.children[1] ? square.children[1] : square.children[0]
            lastCheck.classList.add('highlight-red')
          }
          , 400)
          
        }
      });
    }
  }

export function addEvaluateSVG(moveType){
  
    const toMove = savedPGNHistory[currentNumber]?.to;
    const svgImage = document.createElement('img');
  
    svgImage.src = `/src/public/assets/svgs/${moveType}.svg`; 
    svgImage.width = 15; // Set the width as needed
    svgImage.height = 15; // Set the height as needed]
    svgImage.style.position = 'absolute';
    svgImage.style.top = '0%';
    svgImage.style.left = '75%';
    svgImage.style.zIndex = '3';
    svgImage.classList.add('evaluation-svg')
  
    const existingSvgs = document.querySelectorAll('.evaluation-svg');
    existingSvgs.forEach(svg => svg.remove());
    const squares = document.querySelectorAll('.square-55d63');
    for (const square of squares) {
      if (square.getAttribute('data-square') === toMove) {
        // Do something with the matching square
        square.appendChild(svgImage); 
        break; // Exit the loop
      }
    }
}

export function isKingInCheck() {
    ///If king is in check will return the King actual square.
    const turn = chess.turn();
  
    //Taking off the null items of array.  
    const piecesArray = chess.board().map(row =>
      row.filter(square => square !== null)
    );
    //combining all arrays into a single one with some item. 
    const flattenedArray = [].concat(...piecesArray);
  
    let kingSquare = flattenedArray.find(piece => piece.type === 'k' && piece.color === turn);
    kingSquare = kingSquare.square

    if(chess.inCheck() && chess.get(kingSquare).color === turn){
      return kingSquare
    }
}