import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
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

    create(request: PurchaseInvoice): Observable<any> {
        const url = `${this.apiSupplierUrl}/create`;
        return this.http.post<any>(url, request);
    }
}