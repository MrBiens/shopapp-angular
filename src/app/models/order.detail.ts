import { Product } from "./product";

export interface OrderDetail {
    order_detail_id: number;
    order_id: number;
    product: Product;
    price: number;
    quantity: number;
    total_money: number;
    color?: string; // Dấu "?" cho biết thuộc tính này là tùy chọn
}