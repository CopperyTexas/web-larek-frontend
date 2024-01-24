import { EventName, Subscriber, IEvents } from "../../types";

// Класс EventEmitter реализует шаблон Наблюдатель для управления событиями.
export class EventEmitter implements IEvents {
    // Хранение подписчиков для каждого события
    private _events: Map<EventName, Set<Subscriber>>;

    constructor() {
        this._events = new Map<EventName, Set<Subscriber>>();
    }

    // Подписка на событие
    on<T extends object>(eventName: EventName, callback: (event: T) => void): void {
        if (!this._events.has(eventName)) {
            this._events.set(eventName, new Set<Subscriber>());
        }
        this._events.get(eventName)?.add(callback);
    }

    // Генерация события
    emit<T extends object>(eventName: string, data?: T): void {
        this._events.forEach((subscribers, name) => {
            if ((name instanceof RegExp && name.test(eventName)) || name === eventName) {
                subscribers.forEach(callback => callback(data));
            }
        });
    }
}
