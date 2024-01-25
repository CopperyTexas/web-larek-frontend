import { Component } from "./base/Component";
import { ensureElement } from "../utils/utils";
import { ISuccess, ISuccessActions } from "../types";

// Класс Success для отображения успешного выполнения операции
export class Success extends Component<ISuccess> {
    protected _closeButton: HTMLElement; // Кнопка закрытия модального окна
    protected _totalElement: HTMLElement; // Элемент для отображения итоговой информации

    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container);

        // Инициализация элементов интерфейса
        this._closeButton = ensureElement<HTMLElement>('.order-success__close', container);
        this._totalElement = ensureElement<HTMLElement>('.order-success__description', container);

        // Подключение обработчика события закрытия окна
        if (actions?.onClick) {
            this._closeButton.addEventListener('click', actions.onClick);
        }
    }

    // Установка текста итоговой информации
    set total(value: string) {
        this._totalElement.textContent = `Списано ${value} синапсов`;
    }
}
