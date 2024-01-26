import { currentNumber, savedPGNHistory, engine } from "./index.js";
import { addEvaluateSVG } from "./chessboard-highlight.js";

let checkMoveInterval
let previousEvaluatedMove = null
export function evaluateMove(){
    clearInterval(checkMoveInterval)
    checkMoveInterval = setInterval(()=>{
      
        let evaluatedMove = Math.abs(engine.movesEvalueted[currentNumber]?.evaluated || null)


        if(evaluatedMove !== previousEvaluatedMove){
          const toMove = savedPGNHistory[currentNumber]?.to;
          const fromMove = savedPGNHistory[currentNumber]?.from;
          const fromToMove = fromMove + toMove
          
          let moveType
          
          switch (true){
            case(engine.bestNextMove[currentNumber -1] == fromToMove):
              engine.movesEvalueted[currentNumber].moveType = "bestMove"
              addEvaluateSVG("bestMove")
              break

            case evaluatedMove >= 2:
                engine.movesEvalueted[currentNumber].moveType = "blunder"
                addEvaluateSVG("blunder")
                break;

              case evaluatedMove < 2 && evaluatedMove >= 1:
                engine.movesEvalueted[currentNumber].moveType = "mistake"
                addEvaluateSVG("mistake")
                break;
              case evaluatedMove >= 0.5 && evaluatedMove < 1:
                engine.movesEvalueted[currentNumber].moveType = "inaccuracy"
                addEvaluateSVG("inaccuracy")
                break;
                
                case evaluatedMove <= 0.135:
                  engine.movesEvalueted[currentNumber].moveType = "excelent"
                  addEvaluateSVG("excelent")
                  break
                  
                  default:
                    engine.movesEvalueted[currentNumber].moveType =  "good"
                    addEvaluateSVG("good")
                    break
                  }
                  previousEvaluatedMove = evaluatedMove
                }
                
      }, 500);
}