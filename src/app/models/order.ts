import {OrderDetail} from './order.detail'
export interface Order {
    order_id: number;
    user_id: number;
    full_name: string; 
    email: string;
    phone_number: string; 
    address: string;
    note: string;
    order_date: Date; 
    status: string;
    total_money: number; 
    createAt: string | null;
    updateAt: string | null;
    shipping_method: string; 
    shipping_address: string; 
    shipping_date: Date; 
    tracking_number: string; 
    payment_method: string; 
    active: boolean;
    order_details: OrderDetail[]; 
  }  
