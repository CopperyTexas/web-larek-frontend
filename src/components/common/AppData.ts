import {Model} from "../base/Model";
import {IProduct, IOrder, IDeliveryForm, IAppState, FormErrors, IContactForm} from "../../types/index";
export type CatalogChangeEvent = {
    catalog: Product[]
  };
export class Product extends Model<IProduct> {
    id: string;
    name: string;
    description: string;
    price: number | null;
    category: string;
    imageURL: string;
}