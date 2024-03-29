import './scss/styles.scss';

import {LarekAPI} from "./components/LarekApi";
import {API_URL, CDN_URL, PaymentMethods} from "./utils/constants";
import {EventEmitter} from "./components/base/events";
import {AppState, CatalogChangeEvent, Product} from "./components/AppData";
import {Page} from "./components/Page";
import {cloneTemplate, createElement, ensureElement} from "./utils/utils";
import {Modal} from "./components/common/Modal";
import {IContactForm, IOrderForm, IOrder} from "./types";
import { Card } from './components/Card';
import { Basket } from './components/Basket';
import { OrderForm, ContactForm } from './components/common/Order';
import { Success } from './components/Success';

// Создание объектов для управления событиями и API
const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);

// Получение ссылок на шаблоны элементов страницы
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const deliveryTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Создание основных компонентов приложения
const appData = new AppState({}, events);
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const delivery = new OrderForm(cloneTemplate(deliveryTemplate), events, {
  onClick: (ev: Event) => events.emit('payment:toggle', ev.target)
});
const contact = new ContactForm(cloneTemplate(contactTemplate), events);

// ------------------------------ Обработка событий ------------------------------

// Обновления каталога товаров
events.on<CatalogChangeEvent>('items:changed', () => {
  page.catalog = appData.catalog.map(item => new Card(cloneTemplate(cardCatalogTemplate), { onClick: () => events.emit('card:select', item) }).render(item));
});

// Открытие товара
events.on('card:select', (item: Product) => {
  appData.setPreview(item);
});

events.on('preview:changed', (item: Product) => {
  const card = new Card(cloneTemplate(cardPreviewTemplate), {
    onClick: () => {
      events.emit('product:toggle', item);
      card.buttonTitle = (appData.basket.indexOf(item) < 0) ? 'Купить' : 'Удалить из корзины'
    }
  });
  modal.render({
    content: card.render({
      title: item.title,
      description: item.description,
      image: item.image,
      price: item.price,
      category: item.category,
      buttonTitle: (appData.basket.indexOf(item) < 0) ? 'Купить' : "Удалить из корзины"
    })
  })
})

// Переключение/добавление/удаление товара и обновление счетчика
events.on('product:toggle', (item: Product) => {
  //modal.close();
  if(appData.basket.indexOf(item) < 0){
    events.emit('product:add', item);
  }
  else{
    events.emit('product:delete', item);
  }
})

events.on('product:add', (item: Product) => {
  appData.addToBasket(item);

});

events.on('product:delete', (item: Product) => appData.removeFromBasket(item));

// Обновление списка товаров в корзине и общей стоимости
events.on('basket:changed', (items: Product[]) => {
  basket.items = items.map((item, index) => {
    const card = new Card(cloneTemplate(cardBasketTemplate), {
      onClick: () => {
        events.emit('product:delete', item)
      }
    });
    return card.render({
      index: (index+1).toString(),
      title: item.title,
      price: item.price,
    })
  })
  const total = items.reduce((total, item) => total + item.price, 0)
  basket.total = total
  appData.order.total = total;
  basket.toggleCheckoutButton(total === 0)
})

events.on('counter:changed', (item: string[]) => {
  page.counter = appData.basket.length;
})

// Открытие корзины
events.on('basket:open', () => {
  modal.render({ content: basket.render({}) });
});

// Открытие формы доставки
events.on('order:open', () => {
  modal.render({ content: delivery.render({ payment: '', address: '', valid: false, errors: [] }) });
  appData.order.items = appData.basket.map(item => item.id);
});

// Смена способа оплаты
events.on('payment:toggle', (target: HTMLElement) => {
  if (!target.classList.contains('button_alt-active')) {
      delivery.toggleStateButtons(target);
      appData.order.payment = PaymentMethods[target.getAttribute('name')];
  }
});

// Изменение состояния валидации форм
events.on('formErrors:change', (errors: Partial<IOrder>) => {
  const {payment, address ,email, phone} = errors;
  delivery.valid = !payment && !address;
  contact.valid = !email && !phone;
  delivery.errors = Object.values({payment, address}).filter(i => !!i).join('; ');
  contact.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
});

// Изменение полей формы доставки
events.on(/^order\..*:change/, (data: {field: keyof IOrderForm, value: string}) => {
  appData.setOrderField(data.field, data.value)
})

// Изменение полей формы контактных данных
events.on(/^contacts\..*:change/, (data: {field: keyof IContactForm, value: string}) => {
  appData.setContactField(data.field, data.value)
})

// Форма доставки полностью заполнена
events.on('delivery:ready', () => {
  delivery.valid = true;
});

// Форма контактов полностью заполнена
events.on('contact:ready', () => {
  contact.valid = true;
});

// Переход к форме контактов
events.on('order:submit', () => {
  modal.render({ content: contact.render({ valid: false, errors: [], email: '', phone: '' }) });
});

// Оформление заказа
events.on('contacts:submit', () => {
  api.orderProducts(appData.order)
      .then(result => {
          appData.clearBasket();
          appData.clearOrder();
          const success = new Success(cloneTemplate(successTemplate), { onClick: () => modal.close() });
          success.total = result.total.toString();
          modal.render({ content: success.render({}) });
      })
      .catch(err => {
          console.error("Ошибка при оформлении заказа:", err);
      });
});

// Модальное окно открыто
events.on('modal:open', () => {
  page.locked = true;
});

// Модальное окно закрыто
events.on('modal:close', () => {
  page.locked = false;
});

// Получение и отображение списка продуктов при загрузке страницы
api.getProductList()
    .then(appData.setCatalog.bind(appData))
    .catch(err => {
        console.error("Ошибка при загрузке списка продуктов:", err);
    });