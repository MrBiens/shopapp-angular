export interface PurchaseInvoiceDetailResponse {
  invoice_detail_id: number;
  invoice_id: number;
  product_id: number;
  product_name: string;     // <-- thêm thông tin tên sản phẩm
  price: number;
  quantity: number;
  total_price: number;
}