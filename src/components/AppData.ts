import { Model } from "./base/Model";
import { IAppState, IOrder, IOrderForm, FormErrors, IContactForm, IProduct } from "../types/index";

// Тип события для обновления каталога
export type CatalogChangeEvent = {
    catalog: Product[]
};

// Класс Product, представляющий отдельный товар
export class Product extends Model<IProduct> {
    id: string;
    title: string;
    description: string;
    price: number | null;
    category: string;
    image: string;

    // Конструктор класса Product
    // Принимает данные о товаре и объект событий
}

// Класс AppState, управляющий состоянием приложения
export class AppState extends Model<IAppState> {
    catalog: Product[];  // Каталог товаров
    basket: Product[] = [];  // Товары в корзине
    order: IOrder = {  // Данные о заказе
        payment: 'online',
        address: '',
        email: '',
        phone: '',
        total: 0,
        items: []
    };
    preview: string | null;  // ID товара для предпросмотра
    formErrors: FormErrors = {};  // Ошибки формы

    // Очищает корзину и генерирует события об изменении
    clearBasket() {
        this.basket = [];
        this.emitBasketChange();
    }

    // Добавляет товар в корзину, если его там нет
    addToBasket(item: Product) {
        if (!this.basket.includes(item)) {
            this.basket.push(item);
            this.emitBasketChange();
        }
    }

    // Удаляет товар из корзины
    removeFromBasket(item: Product) {
        this.basket = this.basket.filter(it => it !== item);
        this.emitBasketChange();
    }

    // Генерирует события об изменении состояния корзины
    private emitBasketChange() {
        this.emitChanges('counter:changed', { count: this.basket.length });
        this.emitChanges('basket:changed', this.basket);
    }

    // Устанавливает каталог товаров
    setCatalog(items: IProduct[]) {
        this.catalog = items.map(item => new Product(item, this.events));
        this.emitChanges('items:changed', { catalog: this.catalog });
    }

    // Устанавливает предпросмотр товара
    setPreview(item: Product) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
    }

    // Очищает данные заказа
    clearOrder() {
        this.order = {
            payment: 'online',
            address: '',
            email: '',
            phone: '',
            total: 0,
            items: []
        };
    }

    // Устанавливает поле заказа и проверяет валидность
    setOrderField(field: keyof IOrderForm, value: string) {
        this.order[field] = value;
        this.validateOrder();
    }

    // Проверяет валидность заказа
    private validateOrder() {
        const errors: typeof this.formErrors = {};
        if (!this.order.address) {
            errors.address = "Необходимо указать адрес";
        }
        this.updateFormErrors(errors);
    }

    // Устанавливает поля контакта и проверяет валидность
    setContactField(field: keyof IContactForm, value: string) {
        this.order[field] = value;
        this.validateContact();
    }

    // Проверяет валидность контактов
    private validateContact() {
        const errors: typeof this.formErrors = {};
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const phoneRegex = /^\+7[0-9]{10}$/;
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        } else if (!emailRegex.test(this.order.email)) {
            errors.email = 'Некорректный адрес электронной почты';
        }
        let phoneValue = this.order.phone;
        if (phoneValue.startsWith('8')) {
            phoneValue = '+7' + phoneValue.slice(1);
        }
        if (!phoneValue) {
            errors.phone = 'Необходимо указать телефон';
        } else if (!phoneRegex.test(phoneValue)) {
            errors.phone = 'Некорректный формат номера телефона';
        } else {
            this.order.phone = phoneValue;
        }
        this.updateFormErrors(errors);
    }

    // Обновляет ошибки формы и генерирует соответствующие события
    private updateFormErrors(errors: FormErrors) {
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        if (Object.keys(errors).length === 0) {
            this.events.emit('order:ready', this.order);
        }
    }
}
