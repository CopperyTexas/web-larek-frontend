import { Component } from "../base/Component";
import { IEvents } from "../base/events";
import { ensureElement } from "../../utils/utils";

interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}

export class Page extends Component<IPage> {
    protected _counter: HTMLElement;
    protected _catalog: HTMLElement;
    protected _wrapper: HTMLElement;
    protected _basket: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        // Инициализация элементов интерфейса
        this._counter = ensureElement<HTMLElement>('.header__basket-counter');
        this._catalog = ensureElement<HTMLElement>('.catalog__items');
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
        this._basket = ensureElement<HTMLElement>('.header__basket');

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
