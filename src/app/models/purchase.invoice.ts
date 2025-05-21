import { PurchaseInvoiceDetail } from "./purchase.invoice detail";

export interface PurchaseInvoice {
  supplier_id: number;
  details: PurchaseInvoiceDetail[];
}