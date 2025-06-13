import { HttpClient } from "@angular/common/http";
import { Environment } from "../enviroments/environment";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn:'root'
})
export class PaymentService {
    private apiPaymentUrl: string = Environment.apiUrl + "/payments";

    constructor(private http: HttpClient) { }

    createPayment(amount: number): Observable<any> {
        const url = `${this.apiPaymentUrl}/create_payment_url`;
        return this.http.post(url, { amount });
    }

    verifyPayment(transactionId: string): Observable<any> {
        const url = `${this.apiPaymentUrl}/payment_callback/${transactionId}`;
        return this.http.get(url);
    }
}