import { Model} from "./base/Model";
import { IAppState, IOrder, IOrderForm, FormErrors, IContactForm, IProduct } from "../types/index";

export type CatalogChangeEvent = {
    catalog: Product[]
  };

export class Product extends Model<IProduct> {
    id: string;
    title: string;
    description: string;
    price: number | null;
    category: string;
    image: string;
}

export class AppState extends Model<IAppState> {
    catalog: Product[];
    basket: Product[] = [];
    order: IOrder = {
        payment: 'online',
        address: '',
        email: '',
        phone: '',
        total: 0,
        items: []
    };
    preview: string | null;
    formErrors: FormErrors = {};

    // Управление корзиной
    clearBasket() {
        this.basket = [];
        this.updateBasket();
    }

    addToBasket(item: Product) {
        if(this.basket.indexOf(item) < 0){
            this.basket.push(item);
            this.updateBasket();
          }
    }

    removeFromBasket(item: Product) {
        this.basket = this.basket.filter((it) => it != item);
    this.updateBasket();
      }
    

    updateBasket() {
        this.emitChanges('counter:changed', this.basket);
    this.emitChanges('basket:changed', this.basket);
    }

    // Управление каталогом товаров
    setCatalog(items: IProduct[]) {
        this.catalog = items.map(item => new Product(item, this.events));
        this.emitChanges('items:changed', { catalog: this.catalog});
      }
    // Установка предпросмотра товара
    setPreview(item: Product) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
      }

    // Валидация данных заказа и контактной информации
    // Очистка данных заказа
    clearOrder() {
        this.order = {
          payment: 'online',
          address: '',
          email: '',
          phone: '',
          total: 0,
          items: []
        }
      }
       // Устанавливает поле в форме доставки и проверяет валидность
    setOrderField(field: keyof IOrderForm, value: string) {
        this.order[field] = value;
        if (this.validateOrder()) {
            this.events.emit('order:ready', this.order);
        }
    }
    validateOrder() {
        const errors: typeof this.formErrors = {};
        if (!this.order.address) {
            errors.address = "Необходимо указать адрес";
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }
    // Устанавливает поле в форме контактных данных и проверяет валидность
    setContactField(field: keyof IContactForm, value: string) {
        this.order[field] = value;
        if (this.validateContact()) {
            this.events.emit('contact:ready', this.order);
        }
    }
    validateContact() {
        const errors: typeof this.formErrors = {};
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const phoneRegex = /^\+7[0-9]{10}$/;
    
        // Валидация электронной почты
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        } else if (!emailRegex.test(this.order.email)) {
            errors.email = 'Некорректный адрес электронной почты';
        }
    
        // Предварительная обработка и валидация номера телефона
        let phoneValue = this.order.phone;
        if (phoneValue.startsWith('8')) {
            phoneValue = '+7' + phoneValue.slice(1);
        }
    
        if (!phoneValue) {
            errors.phone = 'Необходимо указать телефон';
        } else if (!phoneRegex.test(phoneValue)) {
            errors.phone = 'Некорректный формат номера телефона. Формат: +7(XXX)-XXX-XX-XX';
        } else {
            this.order.phone = phoneValue; // Обновление номера телефона в случае успешного формата
        }
    
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }
    
    
    // Остальные методы...
}
