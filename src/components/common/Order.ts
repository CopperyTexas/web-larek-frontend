import { Form } from "./Form";
import { IOrderForm, IContactForm, IActions } from "../../types";
import { IEvents } from "../../types";
import { ensureElement } from "../../utils/utils";

// Класс OrderForm управляет формой заказа
export class OrderForm extends Form<IOrderForm> {
  protected _cardButton: HTMLButtonElement;
  protected _cashButton: HTMLButtonElement;

  constructor(container: HTMLFormElement, events: IEvents, actions?: IActions) {
    super(container, events);

    // Инициализация и настройка элементов управления формой
    this.initializePaymentButtons(actions);
  }

  // Метод для инициализации кнопок способа оплаты
  private initializePaymentButtons(actions?: IActions): void {
    this._cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
    this._cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
    this._cardButton.classList.add('button_alt-active');

    // Назначение обработчиков событий для кнопок
    if (actions?.onClick) {
      this._cardButton.addEventListener('click', actions.onClick.bind(this));
      this._cashButton.addEventListener('click', actions.onClick.bind(this));
    }
  }

  // Метод переключения активного состояния кнопок
  toggleStateButtons(target: HTMLElement) {
    this._cardButton.classList.toggle('button_alt-active');
    this._cashButton.classList.toggle('button_alt-active');
  }

  // Установка адреса доставки
  set address(value: string) {
    (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
  }
}

// Класс ContactForm управляет формой контактных данных пользователя
export class ContactForm extends Form<IContactForm> {
  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
  }

  // Установка номера телефона
  set phone(value: string) {
    (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
  }

  // Установка адреса электронной почты
  set email(value: string) {
    (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
  }
}
