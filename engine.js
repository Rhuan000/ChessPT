// engine.js

export class Engine {
  constructor() {
    this.stockfish = new Worker('./node_modules/stockfish/src/stockfish-nnue-16.js');
    this.turn = "";
    this.barChild = document.querySelector('#bar-child');
    this.moveScore = document.querySelector('#move-score');
    this.barChildInitialHeight = this.barChild.offsetHeight;
    this.stockfish.postMessage('uci')
    this.stockfish.postMessage('isready')
    this.stockfish.onmessage = this.onStockfishMessage.bind(this);
  }

  onStockfishMessage(event) {
    const data = event.data;
    const splicedData = data.split(' ');
    let i = 0;

    for (let content of splicedData) {
      if (content === "score") {
        let scoreType = splicedData[i + 1];

        if (scoreType === "mate") {
          let mateIn = splicedData[i + 2];

          if (this.turn === "b") {
            mateIn *= -1;
          }

          if (this.turn === "w") {
            this.barChild.style.height = `${mateIn == 0 || mateIn < 0 ? '100%' : '0px'}`;
          } else {
            this.barChild.style.height = `${mateIn == 0 || mateIn > 0 ? '0px' : '100%'}`;
          }
          this.moveScore.innerHTML = `#${mateIn == 0 ? "" : mateIn}`;

        } else {
          let score = splicedData[i + 2];
          score = parseInt(score, 10);

          if (this.turn === "b") {
            score *= -1;
            console.log(score);
          }

          score = (score / 100).toFixed(2);

          if (score < 0) {
            this.barChild.style.height = `${this.barChildInitialHeight + (((-1 * score) * 8) * (2 * this.barChildInitialHeight) / 100)}px`;
            this.moveScore.innerHTML = '-' + Math.abs(score);
          } else if (score > 0) {
            this.barChild.style.height = `${this.barChildInitialHeight - ((score * 8) * (2 * this.barChildInitialHeight) / 100)}px`;
            this.moveScore.innerHTML = '+' + score;
          } else {
            this.moveScore.innerHTML = score;
          }

          break;
        }
      }

      i += 1;
    }
  }

  analyzePosition(fen, turn) {
    this.turn = turn
    this.stockfish.postMessage('stop');
    const formatedMessage = `position fen ${fen}`;
    this.stockfish.postMessage(formatedMessage);
    this.stockfish.postMessage(`go depth ${'25'}`);
  }
}
