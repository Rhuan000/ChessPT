import { EventManager } from "./EventManager.js";
import { Position } from "./Position.js";

export class Engine {
  constructor() {
    this.stockfish = new Worker('../node_modules/stockfish/src/stockfish-nnue-16.js');

    this.previousPositionIndex = -1;
    this.positionIndex = 0;
    this.previousScore = null
   
    this.positions = []
    this.Position
    this.events = new EventManager()

    this.barChild = document.querySelector('#bar-child');
    this.moveScore = document.querySelector('#move-score');
    this.barChildInitialHeight = this.barChild.offsetHeight;

    //Stockfish start
    this.stockfish.postMessage('uci')
    this.stockfish.postMessage('isready')
    this.stockfish.postMessage('setoption name Use NNUE value true')
    this.stockfish.onmessage = this.onStockfishMessage.bind(this);
    
  }

  onStockfishMessage(event) {
    const data = event.data

    

    const splicedData = data.split(' ');

    let i = 0;
    for (let content of splicedData) {
      //Checking if is a line of mate or not yet.
      if (content === "score") {
        let scoreType = splicedData[i + 1] //<--- the score output      

        if (scoreType === "mate") {
          this.mateOperation(splicedData, i)
        } else {
          this.normalScoreOperation(splicedData, i)
        } 
      }  else if(content == "pv"){
        this.Position.bestNextMove  = splicedData[i +1] //<--- best move output
        break
      }
      i += 1;
    }
  }

  analyzePosition(fen,  from, to, moveNumber, turn) {
    this.positions[moveNumber] = new Position(fen, from, to, moveNumber, turn)
    this.positionIndex = moveNumber
    this.Position = this.positions[this.positionIndex]

    // <-->
    this.stockfish.postMessage('stop');
    this.stockfish.postMessage(`position fen ${fen}`)
    this.stockfish.postMessage(`go depth ${'25'}`);
  }

  getActualScore(){
    return this.Position.score
  }

  normalScoreOperation(splicedData, i){
    this.Position.score = splicedData[i + 2];
    
    this.Position.score = parseInt(this.Position.score, 10);
  
    if (this.Position.nextToPlay === "b") {
      this.Position.score *= -1;
      console.log(this.Position.score)
    }
    
    this.Position.score = (this.Position.score / 100).toFixed(2);
    this.evaluateMove()
  
    if (this.Position.score < 0) {
      this.barChild.style.height = `${this.barChildInitialHeight + (((-1 * this.Position.score) * 8) * (2 * this.barChildInitialHeight) / 100)}px`;
      this.moveScore.innerHTML = '-' + Math.abs(this.Position.score);
    } else if (this.Position.score > 0) {
      this.barChild.style.height = `${this.barChildInitialHeight - ((this.Position.score * 8) * (2 * this.barChildInitialHeight) / 100)}px`;
      this.moveScore.innerHTML = '+' + this.Position.score;
    } else {
      this.moveScore.innerHTML = this.Position.score;
    }
  }

  mateOperation(splicedData, i){
    let mateIn = splicedData[i + 2];

    if (this.Position.nextToPlay === "b") {
      mateIn *= -1;
    }
    //Increase or decrease 100% of the bar side size.
    if (this.Position.nextToPlay === "w") {
      this.barChild.style.height = `${mateIn == 0 || mateIn < 0 ? '100%' : '0px'}`;
    } else {
      this.barChild.style.height = `${mateIn == 0 || mateIn > 0 ? '0px' : '100%'}`;
    }
    this.moveScore.innerHTML = `#${mateIn == 0 ? "" : mateIn}`;
  }

  evaluateMove(){
    console.log(this.previousPositionIndex, this.positionIndex)
      //Evaluating proccess
      if(this.previousPositionIndex === this.positionIndex){
        this.Position.evaluatedScore = this.Position.score - this.positions[this.positionIndex -1].score
      } else if(this.previousPositionIndex > this.positionIndex) {
        this.previousScore = this.positions[this.positionIndex -1].score ?  this.positions[this.positionIndex -1].score : 0.22    
      } 
      this.previousPositionIndex = this.positionIndex
  }
}


