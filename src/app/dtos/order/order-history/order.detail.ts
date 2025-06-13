import { ProductDTO } from "./product.response";

export interface OrderDetailDTO {
  product: ProductDTO;
  quantity: number;
  price: number;
  totalMoney: number;
}
