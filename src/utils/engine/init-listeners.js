import { EventListener } from "./EventListener.js"
import { getSquareFeedback } from "../../feedback-square.js"
import { getBarMateFeedback, getBarNormalFeedback } from "../../feedback-bar.js"

export function initListeners(){
    new EventListener("evaluated", getSquareFeedback)
    
    //Controlling Bar
    new EventListener("newScore", getBarNormalFeedback)
    new EventListener("mate", getBarMateFeedback)
}