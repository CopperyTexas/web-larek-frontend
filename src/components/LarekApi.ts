import { Api } from "./base/api";
import { IOrderResult, IProduct, IOrder, ApiListResponse, ILarekAPI } from "../types";

// Класс LarekAPI расширяет базовый Api класс для взаимодействия с сервером
export class LarekAPI extends Api implements ILarekAPI {
  readonly cdn: string;

  // Конструктор принимает адрес CDN и базовый URL для API
  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options); // Вызов конструктора базового класса
    this.cdn = cdn; // Сохранение ссылки на CDN
  }

  // Получение списка товаров
  getProductList(): Promise<IProduct[]> {
    return this.get('/product').then((data: ApiListResponse<IProduct>) =>
      data.items.map((item) => ({
        ...item,
        image: this.cdn + item.image // Добавление полного пути к изображению
      }))
    );
  }

  // Получение детальной информации о товаре по ID
  getProductItem(id: string): Promise<IProduct> {
    return this.get(`/product/${id}`).then(
        (item: IProduct) => ({
            ...item,
            image: this.cdn + item.image // Добавление полного пути к изображению
        })
    );
  }

  // Оформление заказа
  orderProducts(order: IOrder): Promise<IOrderResult> {
    return this.post(`/order`, order).then(
      (data: IOrderResult) => data // Возвращение результата заказа
    );
  }
}
