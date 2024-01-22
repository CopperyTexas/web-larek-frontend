import { Model} from "../base/Model";
import { IAppState, IOrder, IOrderForm, FormErrors, IContactForm, IProduct } from "../../types/index";

export type CatalogChangeEvent = {
    catalog: Product[]
  };

export class Product extends Model<IProduct> {
    id: string;
    title: string;
    description: string;
    price: number | null;
    category: string;
    imageUrl: string;
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
        this.emitChanges('basketChanged');
        this.calculateTotal();
    }

    addToBasket(product: Product) {
        this.basket.push(product);
        this.emitChanges('basketChanged');
        this.calculateTotal();
    }

    removeFromBasket(item: Product) {
        this.basket = this.basket.filter((it) => it != item);
        this.emitChanges('basketChanged');
        this.calculateTotal();
      }
    

    calculateTotal() {
        this.order.total = this.basket.reduce((total, product) => total + product.price, 0);
    }

    // Управление каталогом товаров
    setCatalog(items: IProduct[]) {
        this.catalog = items.map(item => new Product(item, this.events));
        this.emitChanges('catalogChanged', { catalog: this.catalog });
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
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    // Остальные методы...
}
