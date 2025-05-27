import { Injectable } from "@angular/core";
import { Environment } from "../enviroments/environment";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { NotificationResponse } from "../dtos/notification/notification.response";
import { CouponResponse } from "../dtos/coupon/coupon.response";
import { CouponDTO } from "../dtos/coupon/coupon.dto";

@Injectable({
providedIn:'root'  
})
export class CouponService {
    private apiCoupons = Environment.apiUrl+'/coupons';

    constructor(
        private http: HttpClient
    ) {
    }

    getCoupons(): Observable<CouponResponse[]> {
        return this.http.get<any>(`${this.apiCoupons}`).pipe(
            map(response => response.result as CouponResponse[])
        );
    }

    
    createCoupon(couponDTO : CouponDTO): Observable<CouponResponse> {
        return this.http.post<any>(`${this.apiCoupons}`, couponDTO).pipe(
            map(response => response.result as CouponResponse)
        );
    }
    
    
    

}
