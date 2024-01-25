import { currentNumber, savedPGNHistory, engine } from "./index.js";
import { addEvaluateSVG } from "./chessboard-highlight.js";

let checkMoveInterval
let previousEvaluatedMove = null
export function evaluateMove(){
    clearInterval(checkMoveInterval)
    checkMoveInterval = setInterval(()=>{
      
        let evaluatedMove = Math.abs(engine.movesEvalueted[currentNumber])
        if(evaluatedMove !== previousEvaluatedMove){
          const toMove = savedPGNHistory[currentNumber]?.to;
          const fromMove = savedPGNHistory[currentNumber].from;
          const fromToMove = fromMove + toMove
          
          let moveType

          switch (true){
            case(engine.bestNextMove[currentNumber -1] == fromToMove):
              moveType = "bestMove"
              addEvaluateSVG(moveType)
              break

            case evaluatedMove >= 2:
                moveType = "blunder"
                addEvaluateSVG(moveType)
                break;

              case evaluatedMove < 2 && evaluatedMove >= 1:
                moveType = "mistake"
                addEvaluateSVG(moveType)
                break;
              case evaluatedMove >= 0.5 && evaluatedMove < 1:
                moveType = "inaccuracy"
                addEvaluateSVG(moveType)
                break;
                
                case evaluatedMove <= 0.135:
                  moveType = "excelent"
                  addEvaluateSVG(moveType)
                  break
                  
                  default:
                    moveType =  "good"
                    addEvaluateSVG(moveType)
                    break
                  }
                  previousEvaluatedMove = evaluatedMove
                }
                
      }, 500);
}