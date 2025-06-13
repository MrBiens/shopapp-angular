import { OrderDetailDTO } from "./order.detail";

export interface OrderHistoryDTO {
  orderId: number;
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  totalAmount: number;
  shippingMethod: string;
  status: string;
  shippingDate: string;
  paymentMethod: string;
  note: string;
  orderDate: string;
  orderDetails: OrderDetailDTO[];
}

