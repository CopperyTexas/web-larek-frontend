import { Component } from "./base/Component";
import { ICard, IActions } from "../types";
import { ensureElement } from "../utils/utils";
import { productCategory } from "../utils/constants";

// Класс Card для управления карточками товаров
export class Card extends Component<ICard> {
    // Определение элементов карточки
    protected _index?: HTMLElement;
    protected _title: HTMLElement;
    protected _description?: HTMLElement;
    protected _category?: HTMLElement;
    protected _price: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _button?: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: IActions) {
        super(container);

        // Инициализация элементов
        this._index = container.querySelector('.basket__item-index');
        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._description = container.querySelector('.card__text');
        this._category = container.querySelector('.card__category');
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._image = container.querySelector('.card__image');
        this._button = container.querySelector('.card__button');

        // Подключение обработчиков событий, если определено действие
        if (actions?.onClick) {
            this._button?.addEventListener('click', actions.onClick);
            if (!this._button) {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    // Метод для отключения кнопки цены
    disablePriceButton(value: number | null) {
        if (!value && this._button) {
            this._button.disabled = true;
        }
    }

    // Сеттер и геттер для ID карточки
    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    // Сеттер и геттер для названия
    set title(value: string) {
        this.setText(this._title, value);
    }

    get title(): string {
        return this._title.textContent || '';
    }

    // Сеттер и геттер для цены
    set price(value: number | null) {
        this.setText(this._price, value ? `${value} синапсов` : '');
        this.disablePriceButton(value);
    }

    get price(): number {
        return Number(this._price.textContent?.replace(' синапсов', '')) || 0;
    }

    // Сеттер и геттер для категории
    set category(value: string) {
      this.setText(this._category, value);
      this._category.classList.add(productCategory[value])
    }

    get category(): string {
        return this._category?.textContent || '';
    }

    // Сеттер и геттер для индекса
    set index(value: string) {
        if (this._index) {
            this._index.textContent = value;
        }
    }

    get index(): string {
        return this._index?.textContent || '';
    }

    // Сеттер для изображения
    set image(value: string) {
        if (this._image) {
            this._image.src = value;
            this._image.alt = this.title;
        }
    }

    // Сеттер для описания
    set description(value: string) {
        if (this._description) {
            this.setText(this._description, value);
        }
    }

    // Сеттер для текста кнопки
    set buttonTitle(value: string) {
        if (this._button) {
            this._button.textContent = value;
        }
    }
}
