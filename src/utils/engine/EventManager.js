export class EventManager {
    constructor() {
        // Private field listeners: a hashmap of event types and listeners
        this.listeners = new Map();
    }

    // Method to subscribe to an event
    subscribe(eventType, listener) {
        if (!this.listeners.has(eventType)) {
            this.listeners.set(eventType, []);
        }

        this.listeners.get(eventType).push(listener);
    }

    // Method to unsubscribe from an event
    unsubscribe(eventType, listener) {
        if (this.listeners.has(eventType)) {
            const listenersOfType = this.listeners.get(eventType);
            const index = listenersOfType.indexOf(listener);

            if (index !== -1) {
                listenersOfType.splice(index, 1);
            }
        }
    }

    // Method to notify listeners of an event
    notify(eventType, data) {
        if (this.listeners.has(eventType)) {
            const listenersOfType = this.listeners.get(eventType);

            listenersOfType.forEach(listener => {
                listener.update(data);
            });
        }
    }
}