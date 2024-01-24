export abstract class Component<T> {
    // Конструктор класса, инициализирующий контейнер компонента
    protected constructor(protected readonly container: HTMLElement) {}

    // Переключает класс у указанного элемента
    toggleClass(element: HTMLElement, className: string, force?: boolean): void {
        if (!element) {
            console.warn("Element not found for toggleClass");
            return;
        }
        element.classList.toggle(className, force);
    }

    // Устанавливает текстовое содержимое для указанного элемента
    protected setText(element: HTMLElement, value: unknown): void {
        if (!element) {
            console.warn("Element not found for setText");
            return;
        }
        element.textContent = String(value);
    }

    // Устанавливает или снимает атрибут 'disabled' для указанного элемента
    setDisabled(element: HTMLElement, state: boolean): void {
        if (!element) {
            console.warn("Element not found for setDisabled");
            return;
        }
        state ? element.setAttribute('disabled', 'disabled') : element.removeAttribute('disabled');
    }

    // Скрывает указанный элемент, устанавливая display: none
    protected setHidden(element: HTMLElement): void {
        if (!element) {
            console.warn("Element not found for setHidden");
            return;
        }
        element.style.display = 'none';
    }

    // Делает указанный элемент видимым, удаляя свойство display
    protected setVisible(element: HTMLElement): void {
        if (!element) {
            console.warn("Element not found for setVisible");
            return;
        }
        element.style.removeProperty('display');
    }

    // Устанавливает изображение и альтернативный текст для элемента <img>
    protected setImage(element: HTMLImageElement, src: string, alt?: string): void {
        if (!element) {
            console.warn("Element not found for setImage");
            return;
        }
        element.src = src;
        if (alt) element.alt = alt;
    }

    // Обновляет состояние компонента с помощью переданных данных
    render(data?: Partial<T>): HTMLElement {
        if (data) {
            Object.assign(this, data);
        }
        return this.container;
    }
}