import { Component } from "../base/Component";
import { IEvents } from "../../types/index";
import { ensureElement } from "../../utils/utils";
import { IFormState } from "../../types/index";

// Класс Form для управления формами
export class Form<T> extends Component<IFormState> {
    protected _submit: HTMLButtonElement;  // Кнопка отправки формы
    protected _errors: HTMLElement;       // Элемент для отображения ошибок формы

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);

        // Инициализация элементов формы
        this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

        // Подписка на события ввода и отправки формы
        this.container.addEventListener('input', this.handleInput.bind(this));
        this.container.addEventListener('submit', this.handleSubmit.bind(this));
    }

    // Обработка ввода в поля формы
    protected handleInput(e: Event): void {
        const target = e.target as HTMLInputElement;
        const field = target.name as keyof T;
        const value = target.value;
        // Обработка изменения значения поля
        this.onInputChange(field, value);
    }

    // Обработка отправки формы
    protected handleSubmit(e: Event): void {
        e.preventDefault();
        // Генерация события отправки формы
        this.events.emit(`${this.container.name}:submit`);
    }

    // Обработчик изменения значений полей формы
    protected onInputChange(field: keyof T, value: string): void {
        // Автоматическая коррекция номера телефона
        if (field === 'phone' && value.startsWith('8')) {
            value = '+7' + value.substring(1);
            // Обновление значения в поле ввода
            const phoneInput = this.container.elements.namedItem('phone') as HTMLInputElement;
            if (phoneInput) {
                phoneInput.value = value;
            }
        }
        // Логика обработки ввода для каждого поля
        this.events.emit(`${this.container.name}.${String(field)}:change`, { field, value });
    }

    // Сеттер для валидности формы
    set valid(value: boolean) {
        this._submit.disabled = !value;
    }

    // Сеттер для ошибок формы
    set errors(value: string) {
        this.setText(this._errors, value);
    }

    // Рендеринг формы с новым состоянием
    render(state: Partial<T> & IFormState): HTMLElement {
        const { valid, errors, ...inputs } = state;
        super.render({ valid, errors });
        // Применение изменений состояния к форме
        Object.assign(this, inputs);
        return this.container;
    }
}
