import { currentNumber, savedPGNHistory, engine, chess } from "./index.js";
import { addEvaluateSVG } from "./chessboard-highlight.js";
import { bookVariations } from "./public/assets/openings/openings.js";

let previousEvaluatedMove = null

export function getSquareFeedback(evaluatedMove){      
  if(evaluatedMove !== previousEvaluatedMove){
    const toMove = savedPGNHistory[currentNumber]?.to;
    const fromMove = savedPGNHistory[currentNumber]?.from;
    const fromToMove = fromMove + toMove
    console.log(engine.Position.score - engine.Position.score2, engine.Position.score ,engine.Position.score2)
    console.log(engine.positions[currentNumber -1]?.bestNextMove)
    let moveType
    switch (true){
      case bookVariations[chess.fen()] !== undefined:
        engine.Position.moveType = "book"
        addEvaluateSVG("book")
        break
      case(engine.positions[currentNumber -1]?.bestNextMove == fromToMove):
        engine.Position.moveType = "bestMove"
        addEvaluateSVG("bestMove")
        break
      case evaluatedMove >= 3:
        engine.Position.moveType = "blunder"
        addEvaluateSVG("blunder")
        break;
      case evaluatedMove < 3 && evaluatedMove >= 1.35:
        engine.Position.moveType = "mistake"
        addEvaluateSVG("mistake")
        break;
      case evaluatedMove >= 0.58 && evaluatedMove < 1.35:
        engine.Position.moveType = "inaccuracy"
        addEvaluateSVG("inaccuracy")
        break;
      case evaluatedMove <= 0.2:
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
}