export class OrderDTO {
  user_id: number;
  full_name: string;
  phone_number: string;
  email: string;
  address: string;
  note: string;
  total_money: number;
  shipping_method: string;
  shipping_fee: number | string;
  payment_method: string;
  vnp_txn_ref?: string; // Optional, used for payment callback
  cart_items: {
    product_id: number;
    quantity: number;
  }[];

  constructor(data: any) {
    this.user_id = data.user_id;
    this.full_name = data.full_name;
    this.phone_number = data.phone_number;
    this.email = data.email;
    this.address = data.address;
    this.note = data.note;
    this.total_money = data.total_money;
    this.shipping_method = data.shipping_method;
    this.shipping_fee = data.shipping_fee;
    this.payment_method = data.payment_method;
    this.cart_items = data.cart_items || [];
  }
  
}
