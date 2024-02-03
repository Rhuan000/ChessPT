import { engine } from "./index.js";

const barChild = document.querySelector('#bar-child');
const moveScore = document.querySelector('#move-score');
const barChildInitialHeight = barChild.offsetHeight;


export function getBarNormalFeedback(){
    if (engine.Position.score < 0) {
        barChild.style.height = `${parseInt(barChildInitialHeight + (((-1 * engine.Position.score) * 7) * (2 * barChildInitialHeight) / 100)) >= (2 * barChildInitialHeight) - 5 ? (2 * barChildInitialHeight) - 5 :  parseInt(barChildInitialHeight + (((-1 * engine.Position.score) * 7) * (2 * barChildInitialHeight) / 100))}px`;
        moveScore.innerHTML = '-' + Math.abs(engine.Position.score);
      } else if (engine.Position.score > 0) {

        barChild.style.height = `${parseInt(barChildInitialHeight - ((engine.Position.score * 7) * (2 * barChildInitialHeight) / 100) ) <= 5 ? 5 : parseInt(barChildInitialHeight - ((engine.Position.score * 8) * (2 * barChildInitialHeight) / 100))}px`;
        moveScore.innerHTML = '+' + engine.Position.score;
      } else {
        moveScore.innerHTML = engine.Position.score;
    }
}
export function getBarMateFeedback(mateIn){
  if (engine.Position.nextToPlay === "b") {
    mateIn *= -1;
  }
  //Increase or decrease 100% of the bar side size.
  if (engine.Position.nextToPlay === "w") {
    barChild.style.height = `${mateIn == 0 || mateIn < 0 ? '100%' : '0px'}`;
  } else {
    barChild.style.height = `${mateIn == 0 || mateIn > 0 ? '0px' : '100%'}`;
  }
  moveScore.innerHTML = `#${mateIn == 0 ? "" : mateIn}`;
}
