import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../../types";
import { IModalData } from "../../types";

// Класс Modal для управления модальными окнами
export class Modal extends Component<IModalData> {
    protected _closeButton: HTMLButtonElement; // Кнопка закрытия модального окна
    protected _content: HTMLElement;           // Контент модального окна

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        // Инициализация элементов модального окна
        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._content = ensureElement<HTMLElement>('.modal__content', container);

        // Назначение обработчиков событий
        this.initEventListeners();
    }

    // Инициализация обработчиков событий модального окна
    private initEventListeners(): void {
        this._closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.close.bind(this));
        this._content.addEventListener('click', (event) => event.stopPropagation());
    }

    // Установка содержимого модального окна
    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    // Открытие модального окна
    open(): void {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    // Закрытие модального окна
    close(): void {
        this.container.classList.remove('modal_active');
        this.content = null;
        this.events.emit('modal:close');
    }

    // Рендер модального окна с содержимым
    render(data: IModalData): HTMLElement {
        super.render(data);
        this.open();
        return this.container;
    }
}
