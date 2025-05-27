import { PurchaseInvoiceDetailDTO } from "./purchase.invoice.detail/purchase.invoice.detail";

export interface PurchaseInvoiceDTO {
  supplier_id: number;
  details: PurchaseInvoiceDetailDTO[];
}