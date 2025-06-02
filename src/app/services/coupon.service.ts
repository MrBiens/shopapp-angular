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

    getCouponById(couponId: string): Observable<CouponResponse> {
        return this.http.get<any>(`${this.apiCoupons}/get-by-id/${couponId}`).pipe(
            map(response => response.result as CouponResponse)
        );
    }

    decreaseQuantity(couponCode: string): Observable<string> {
    return this.http.put<any>(`${this.apiCoupons}/${couponCode}/decrease-quantity`, {}).pipe(
      map(response => {
        // Nếu backend trả về thông báo thành công dạng string
        return response.message as string;
      })
    );
  }
    
    
    

}
