import { Component } from "./base/Component";
import { createElement, ensureElement } from "../utils/utils";
import { IBasketView } from "../types";
import { EventEmitter } from "./base/events";

// Класс Basket управляет отображением корзины на странице
export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement; // Список товаров в корзине
    protected _total: HTMLElement; // Элемент для отображения общей стоимости товаров
    protected _button: HTMLButtonElement; // Кнопка для перехода к оформлению заказа

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        // Инициализация основных элементов корзины
        this._list = ensureElement<HTMLElement>('.basket__list', container);
        this._total = container.querySelector('.basket__price');
        this._button = container.querySelector('.basket__button');

        // Назначение обработчика событий для кнопки оформления заказа
        this._button?.addEventListener('click', () => this.events.emit('order:open'));

        // Инициализация корзины в пустом состоянии и деактивация кнопки
        this.items = [];
        this.toggleCheckoutButton(true);
    }

    // Включает или выключает кнопку оформления заказа
    toggleCheckoutButton(isDisabled: boolean): void {
      this._button.disabled = isDisabled;
    }

    // Обновляет список товаров в корзине
    set items(items: HTMLElement[]) {
      this._list.innerHTML = ''; // Очистка списка перед добавлением новых элементов
      if (items.length > 0) {
          this._list.append(...items); // Добавление товаров в список
      } else {
          // Показ сообщения о пустой корзине
          this._list.append(createElement('p', 'Корзина пуста'));
      }
  }

    // Устанавливает общую стоимость товаров в корзине
    set total(total: number) {
        this.setText(this._total, `Итого: ${total} синапсов`);
    }
}
