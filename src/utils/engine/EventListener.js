import {engine} from "../../index.js"

export class EventListener{
    constructor(eventType, callback){
        engine.events.subscribe(eventType, this)
        this.callback = callback
    }
    update(data){
        this.callback(data)
    }
}