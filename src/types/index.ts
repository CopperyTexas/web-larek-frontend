// Типы для реализации базового класса Events
export type EventName = string | RegExp;
export type Subscriber = Function;
export type EmitterEvent = {
    eventName: string,
    data: unknown
};
// Общие методы события
export interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
  }
  // Данные ответа от сервера
export type ApiListResponse<Type> = {
    total: number,
    items: Type[]
  };
  
  // Методы запросов к серверу
  export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
// Данные товара
export interface IProduct {
    id: string;
    title: string;
    description: string;
    price: number | null;
    category: string;
    image: string;
    // Дополнительные поля по необходимости...
}
export interface IAppState {
    catalog: IProduct[];
    basket: IProduct[];
    order: IOrder | null;
    preview: string | null;
    orderForm: IOrderForm | null;
    contact: IContactForm | null;
    formErrors: FormErrors;
    // Другие свойства по необходимости...
}
export interface IOrder extends IOrderForm, IContactForm{
    total: number;
    items: string[]; // Массив ID продуктов
}
export interface IOrderForm {
    // Поля совпадают с полями IOrder, но могут быть дополнены другими полями формы
    payment: string;
    address: string;
    // Дополнительные поля по необходимости...
}
export interface FormErrors {
    address?: string;
    email?: string;
    phone?: string;
    // Дополнительные поля ошибок по необходимости...
}
export interface IContactForm {
    email: string;
    phone: string;
    // Дополнительные поля по необходимости...
}

export interface IPage{
    counter: number;
    catalog: HTMLElement[];
  }
export interface IModalData {
    content: HTMLElement;
}
export interface IFormState {
    valid: boolean;
    errors: string[];
}
export interface IActions {
    onClick: (event: MouseEvent) => void;
}
export interface ICard extends IProduct{
    index?: string;
    buttonTitle? : string;
  }
export interface IBasketView {
    items: HTMLElement[];
    total: number;
}
export interface ISuccess {
    total: number;
}
export interface ISuccessActions {
    onClick: () => void;
  }
export interface ILarekAPI {
    getProductList: () => Promise<IProduct[]>;
    getProductItem: (id: string) => Promise<IProduct>;
    orderProducts: (order: IOrder) => Promise<IOrderResult>
  }
export interface IOrderResult {
    id: string;
    total: number;
  }