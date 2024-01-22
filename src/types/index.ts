// Данные товара
export interface IProduct {
    id: string;
    name: string;
    description: string;
    price: number | null;
    category: string;
    imageURL: string;
  }