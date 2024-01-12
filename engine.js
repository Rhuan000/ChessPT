// engine.js

export class Engine {
  constructor() {
    this.stockfish = new Worker('./node_modules/stockfish/src/stockfish-nnue-16.js');
    this.turn = "";
    this.previousMoveNumber = 0;
    this.moveNumber = 0;
    this.previousScore = null
    this.after = false
    this.score = null
    this.movesEvalueted = []
    this.movesScores = []
    this.barChild = document.querySelector('#bar-child');
    this.moveScore = document.querySelector('#move-score');
    this.barChildInitialHeight = this.barChild.offsetHeight;
    this.stockfish.postMessage('uci')
    this.stockfish.postMessage('isready')
    this.stockfish.postMessage('setoption name Use NNUE value true')

    this.stockfish.onmessage = this.onStockfishMessage.bind(this);
    
  }

  onStockfishMessage(event) {
    const data = event.data;
    const splicedData = data.split(' ');
    let i = 0;
    for (let content of splicedData) {
      //Checking if is a line of mate or not yet.
      if (content === "score") {
        let scoreType = splicedData[i + 1];

        if (scoreType === "mate") {
          let mateIn = splicedData[i + 2];

          if (this.turn === "b") {
            mateIn *= -1;
          }
          //Increase or decrease 100% of the bar side size.
          if (this.turn === "w") {
            this.barChild.style.height = `${mateIn == 0 || mateIn < 0 ? '100%' : '0px'}`;
          } else {
            this.barChild.style.height = `${mateIn == 0 || mateIn > 0 ? '0px' : '100%'}`;
          }
          this.moveScore.innerHTML = `#${mateIn == 0 ? "" : mateIn}`;

        } else {
          this.score = splicedData[i + 2];
          this.score = parseInt(this.score, 10);

          if (this.turn === "b") {
            this.score *= -1;
          }
          
          this.score = (this.score / 100).toFixed(2);
          if(this.previousMoveNumber == this.moveNumber){
              this.movesEvalueted[this.moveNumber] = this.score - this.previousScore
              
          } else if(this.previousMoveNumber < this.moveNumber) {
            this.previousScore = this.movesScores[this.moveNumber -1] ?  this.movesScores[this.moveNumber -1] : 0
          } else {
            this.previousScore = 0
          }
          this.previousMoveNumber = this.moveNumber
          this.movesScores[this.moveNumber] = this.score
          

          if (this.score < 0) {
            this.barChild.style.height = `${this.barChildInitialHeight + (((-1 * this.score) * 8) * (2 * this.barChildInitialHeight) / 100)}px`;
            this.moveScore.innerHTML = '-' + Math.abs(this.score);
          } else if (this.score > 0) {
            this.barChild.style.height = `${this.barChildInitialHeight - ((this.score * 8) * (2 * this.barChildInitialHeight) / 100)}px`;
            this.moveScore.innerHTML = '+' + this.score;
          } else {
            this.moveScore.innerHTML = this.score;
          }

          break;
        }
      }

      i += 1;
    }
  }

  analyzePosition(fen, turn, moveNumber) {
    this.turn = turn
    this.moveNumber = moveNumber
    this.stockfish.postMessage('stop');
    const formatedMessage = `position fen ${fen}`;
    this.stockfish.postMessage(formatedMessage);
    console.log(fen)
    this.stockfish.postMessage(`go depth ${'25'}`);
  }
  getActualScore(){
    return this.score
  }
}
