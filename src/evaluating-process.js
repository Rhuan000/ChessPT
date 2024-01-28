import { currentNumber, savedPGNHistory, engine } from "./index.js";
import { addEvaluateSVG } from "./chessboard-highlight.js";

let checkMoveInterval
let previousEvaluatedMove = null
export function evaluateMove(){
    clearInterval(checkMoveInterval)
    checkMoveInterval = setInterval(()=>{
      
        let evaluatedMove = Math.abs(engine.Position.evaluatedScore || null)


        if(evaluatedMove !== previousEvaluatedMove){
          const toMove = savedPGNHistory[currentNumber]?.to;
          const fromMove = savedPGNHistory[currentNumber]?.from;
          const fromToMove = fromMove + toMove
          
          let moveType
          
          switch (true){
            case(engine.positions[currentNumber -1].bestNextMove == fromToMove):
              engine.Position.moveType = "bestMove"
              addEvaluateSVG("bestMove")
              break

            case evaluatedMove >= 2:
                engine.Position.moveType = "blunder"
                addEvaluateSVG("blunder")
                break;

              case evaluatedMove < 2 && evaluatedMove >= 1:
                engine.Position.moveType = "mistake"
                addEvaluateSVG("mistake")
                break;
              case evaluatedMove >= 0.5 && evaluatedMove < 1:
                engine.Position.moveType = "inaccuracy"
                addEvaluateSVG("inaccuracy")
                break;
                
                case evaluatedMove <= 0.13:
                  engine.Position.moveType = "excelent"
                  addEvaluateSVG("excelent")
                  break
                  
                  default:
                    engine.Position.moveType =  "good"
                    addEvaluateSVG("good")
                    break
                  }
                  previousEvaluatedMove = evaluatedMove
                }
                
      }, 500);
}