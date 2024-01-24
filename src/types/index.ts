//------------------------------ Событийная система ------------------------------

// Типы для реализации базового класса Events
export type EventName = string | RegExp; // Имя события, может быть строкой или регулярным выражением
export type Subscriber = Function; // Тип подписчика на событие, любая функция

// Интерфейс для управления событиями в приложении
export interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void; // Подписка на событие
    emit<T extends object>(event: string, data?: T): void; // Генерация события
}

//------------------------------ API и сетевое взаимодействие ------------------------------

// Тип для ответа API, содержащий список элементов и общее количество
export type ApiListResponse<Type> = {
    total: number, // Общее количество элементов
    items: Type[] // Список элементов
};

// Допустимые HTTP-методы для POST-запросов
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

// Интерфейс для взаимодействия с API
export interface ILarekAPI {
    getProductList: () => Promise<IProduct[]>; // Получение списка продуктов
    getProductItem: (id: string) => Promise<IProduct>; // Получение информации о продукте
    orderProducts: (order: IOrder) => Promise<IOrderResult>; // Оформление заказа
}

// Интерфейс для результата оформления заказа
export interface IOrderResult {
    id: string; // Идентификатор заказа
    total: number;  // Общая сумма заказа
}
// Обобщенный тип для стандартизации структуры ответов API
export type ApiResponse<T> = Promise<T>; // T - тип данных, который ожидается в ответе от API

//------------------------------ Модели данных ------------------------------

// Интерфейс для структуры данных продукта
export interface IProduct {
    id: string; // Идентификатор продукта
    title: string; // Название продукта
    description: string; // Описание продукта
    price: number | null; // Цена продукта
    category: string; // Категория продукта
    image: string; // Изображение продукта
}

// Интерфейс для общего состояния приложения
export interface IAppState {
    catalog: IProduct[]; // Каталог продуктов
    basket: IProduct[]; // Корзина продуктов
    order: IOrder | null; // Информация о заказе
    preview: string | null; // ID продукта для предпросмотра
    orderForm: IOrderForm | null; // Форма заказа
    contact: IContactForm | null; // Контактная форма
    formErrors: FormErrors; // Ошибки формы
}

// Интерфейс для данных заказа
export interface IOrder extends IOrderForm, IContactForm {
    total: number; // Общая стоимость заказа
    items: string[]; // Список ID продуктов в заказе
}

// Интерфейс для формы заказа
export interface IOrderForm {
    payment: string; // Способ оплаты
    address: string; // Адрес доставки
}

// Интерфейс для контактной формы
export interface IContactForm {
    email: string; // Электронная почта
    phone: string; // Номер телефона
}

// Тип для ошибок валидации формы
export interface FormErrors {
    address?: string; // Ошибка адреса
    email?: string; // Ошибка email
    phone?: string; // Ошибка телефона
}

//------------------------------ Компоненты UI и их состояния ------------------------------

// Интерфейс для данных страницы
export interface IPage {
    counter: number; // Счетчик (например, для корзины)
    catalog: HTMLElement[]; // Элементы каталога продуктов
}

// Интерфейс для данных модального окна
export interface IModalData {
    content: HTMLElement; // Содержимое модального окна
}

// Интерфейс состояния формы
export interface IFormState {
    valid: boolean; // Валидность формы
    errors: string[]; // Ошибки в форме
}

// Интерфейс для действий пользователя
export interface IActions {
    onClick: (event: MouseEvent) => void; // Обработчик клика
}

// Интерфейс для карточки товара
export interface ICard extends IProduct {
    index?: string; // Индекс карточки
    buttonTitle?: string; // Название кнопки
}

// Интерфейс для представления корзины
export interface IBasketView {
    items: HTMLElement[]; // Элементы в корзине
    total: number; // Общая сумма
}

// Интерфейс для успешного выполнения операции
export interface ISuccess {
    total: number; // Общая сумма
}

// Интерфейс для действий на странице успешной операции
export interface ISuccessActions {
    onClick: () => void; // Обработчик клика
}