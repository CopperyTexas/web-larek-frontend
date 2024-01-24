import { IEvents } from "../../types";

// Функция для проверки, является ли объект экземпляром Model
export const isModel = (obj: unknown): obj is Model<any> => {
    return obj instanceof Model;
}

// Абстрактный базовый класс Model для моделей данных
export abstract class Model<T> {
    // Конструктор класса, инициализирующий модель данными и системой событий
    constructor(data: Partial<T>, protected events: IEvents) {
        // Назначение данных модели
        Object.assign(this, data);
    }

    // Метод для генерации событий с передачей данных
    emitChanges(event: string, payload?: object): void {
        // Инициирование события с возможными данными
        this.events.emit(event, payload ?? {});
    }
}
