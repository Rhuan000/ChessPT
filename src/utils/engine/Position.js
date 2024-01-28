export class Position {
    constructor(fen, fromSquare, actualSquare, moveNumber, nextToPlay, ){
        this.fen = fen
        this.fromSquare = fromSquare
        this.actualSquare = actualSquare
        this.moveNumber = moveNumber
        this.nextToPlay = nextToPlay
        this.moveType
        this.score 
        this.evaluatedScore 
        this.bestNextMove 
    }
    
    updateScore(newScore) {
        this.score = newScore
    }
    updateEvaluatedScore(newEvaluatedScore){
        this.evaluatedScore = newEvaluatedScore
    }
    updateBestMove(newBestMove){
        this.bestMove = newBestMove
    }
}