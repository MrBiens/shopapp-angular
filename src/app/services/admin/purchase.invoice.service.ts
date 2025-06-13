import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { PurchaseInvoiceDetailResponse } from "src/app/dtos/purchase-invoice/purchase.invoice.detail/purchase.invoice.response";
import { PurchaseInvoiceDTO } from "src/app/dtos/purchase-invoice/purchase.invoice.dto";
import { Environment } from "src/app/enviroments/environment";
import { PurchaseInvoice } from "src/app/models/purchase.invoice";

@Injectable({
  providedIn: 'root'
})
export class PurchaseInvoiceService {
  private apiSupplierUrl = Environment.apiUrl + '/purchase-invoices';
 
    constructor(
        private http: HttpClient
    ) { }

    getAllPurchaseInvoices(): Observable<PurchaseInvoice[]> {
        const url = `${this.apiSupplierUrl}`;
        return this.http.get<any>(url).pipe(
          map( response => response.result as PurchaseInvoice[]
           )
        );
    }

    create(request: PurchaseInvoiceDTO): Observable<any> {
        const url = `${this.apiSupplierUrl}/create`;
        return this.http.post<any>(url, request);
    }
    getPurchaseInvoiceById(purchaseInvoiceId: number): Observable<PurchaseInvoiceDetailResponse[]> {
        const url = `${this.apiSupplierUrl}/${purchaseInvoiceId}/details`;
        return this.http.get<any>(url).pipe(
            map(response => response.result as PurchaseInvoiceDetailResponse[])
        );
    }
    deletePurchaseInvoice(purchaseInvoiceId: number): Observable<any> {
        const url = `${this.apiSupplierUrl}/${purchaseInvoiceId}`;
        return this.http.delete<any>(url);
    }
}