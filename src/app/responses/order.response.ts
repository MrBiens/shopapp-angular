import { OrderDetail } from "../models/order.detail";
//là interface dùng để trả về dữ liệu (response) sau khi gọi API lấy thông tin đơn hàng.
export interface OrderResponse {
  order_id: number;
  user_id: number;
  full_name: string;
  email: string;
  phone_number: string;
  address: string;
  note: string;
  order_date: string; // ISO string
  status?: string;
  total_money: number;
  shipping_method: string;
  shipping_date: string; // dạng string
  shipping_fee?: number | null;
  payment_method: string;
  createAt: string | null;
  updateAt: string | null;
  order_details: OrderDetail[];
}
