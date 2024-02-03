import { EventManager } from "./EventManager.js";
import { Position } from "./Position.js";
import { initListeners } from "./init-listeners.js";

export class Engine {
  // setoption name MultiPV value 2
  //great move fen 3r1rk1/2p2ppp/p7/2pP3b/1pP5/1P5P/P2N1PP1/R3R1K1 w - - 0 21 / 3r1rk1/2p2ppp/p7/2pP3b/1pP1N3/1P5P/P4PP1/R3R1K1 b - - 1 21
  
  constructor() {
    this.stockfish = new Worker('../node_modules/stockfish/src/stockfish-nnue-16.js');
    this.previousPositionIndex = -1;
    this.positionIndex = 0;
    this.previousScore = null
    
    this.positions = []
    this.Position
    this.events = new EventManager()

    //Stockfish start
    this.stockfish.postMessage('setoption name MultiPV value 2')
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
        let multipv = splicedData[i - 1]//<--- multipv number
        let scoreType = splicedData[i + 1] //<--- the score output      

        if (scoreType === "mate") {
          let mateIn = splicedData[i + 2]
          this.events.notify("mate", mateIn)
        } else if(scoreType === "cp" && multipv == "1") {
          this.scoreMultiPV1(splicedData, i)
        } else if(scoreType === "cp" && multipv == "2"){
          this.scoreMultiPV2(splicedData, i)
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

  scoreMultiPV1(splicedData, i){
    this.Position.score = splicedData[i + 2];
    
    this.Position.score = parseInt(this.Position.score, 10);
  
    if (this.Position.nextToPlay === "b") {
      this.Position.score *= -1;
    }
    
    this.Position.score = (this.Position.score / 100).toFixed(2);
    this.events.notify("newScore",this.Position.score)
    this.evaluateMove()   
  }

  scoreMultiPV2(splicedData, i){
    this.Position.score2 = splicedData[i + 2];
    
    this.Position.score2 = parseInt(this.Position.score2, 10);
  
    if (this.Position.nextToPlay === "b") {
      this.Position.score2 *= -1;
    }
    
    this.Position.score2 = (this.Position.score2 / 100).toFixed(2)
  }

  evaluateMove(){
      //Evaluating proccess
      if(this.previousPositionIndex === this.positionIndex){
        this.Position.evaluatedScore = this.Position.score - this.positions[this.positionIndex -1]?.score
      } else if(this.previousPositionIndex > this.positionIndex) {
        this.previousScore = this.positions[this.positionIndex - 1]?.score || 0.22;

      } 
      this.events.notify("evaluated", Math.abs(this.Position.evaluatedScore) || 0)
      this.previousPositionIndex = this.positionIndex
  }
  
  initListeners(){
    initListeners()
  }
}


