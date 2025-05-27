export interface PurchaseInvoice {
  createAt: Date;        
  updateAt: Date;
  invoice_id: number;
  supplier_id: number;
  supplier_name: string;
  employee_id: number;
  employee_name: string;
  invoice_date: Date;
  total_amount: number;
}

