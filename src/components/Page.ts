import { Component } from "./base/Component";
import { IEvents } from "../types/index";
import { ensureElement } from "../utils/utils";
import { IPage } from "../types/index";

// Класс Page управляет отображением и взаимодействием с основными элементами страницы
export class Page extends Component<IPage> {
    protected _counter: HTMLElement; // Элемент счетчика товаров в корзине
    protected _catalog: HTMLElement; // Контейнер для отображения каталога товаров
    protected _wrapper: HTMLElement; // Обертка страницы для управления блокировкой
    protected _basket: HTMLElement; // Кнопка корзины для открытия

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        // Инициализация элементов интерфейса
        this._counter = ensureElement<HTMLElement>('.header__basket-counter', container);
        this._catalog = ensureElement<HTMLElement>('.gallery', container);
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper', container);
        this._basket = ensureElement<HTMLElement>('.header__basket', container);

        // Назначение обработчика события для корзины
        this._basket.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    // Обновление счетчика товаров в корзине
    set counter(value: number) {
        this.setText(this._counter, String(value));
    }

    // Заполнение каталога элементами
    set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items);
    }

    // Управление блокировкой страницы
    set locked(value: boolean) {
        if (value) {
            this._wrapper.classList.add('page__wrapper_locked');
        } else {
            this._wrapper.classList.remove('page__wrapper_locked');
        }
    }
}
