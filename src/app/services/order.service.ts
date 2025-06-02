import { Environment } from "../enviroments/environment";
import { map, Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { OrderDTO } from "../dtos/order/order.dto";
import { OrderResponse } from "../responses/order.response";

@Injectable({
    providedIn:'root'
})

export class OrderService{
    private apiOrderUrl : string = Environment.apiUrl+"/orders";
    private apiOrderCreateByAdmin : string = this.apiOrderUrl+"/create-by-admin";
    private apiGetAllOrders :string = this.apiOrderUrl+"/get-orders-by-keyword";


    constructor(
        private http : HttpClient

    ){

    }

    placeOrder(orderData: OrderDTO): Observable<any> {    
        // Gửi yêu cầu đặt hàng
        return this.http.post(this.apiOrderUrl, orderData);
    }
    
    createOrderByAdmin(orderData: OrderDTO): Observable<any> {    
        // Gửi yêu cầu đặt hàng
        return this.http.post(this.apiOrderCreateByAdmin, orderData);
    }

    getOrderById(orderId: number): Observable<any> {
        const url = `${this.apiOrderUrl}/${orderId}`;
        return this.http.get(url);
    }

//    getAllOrders(
//     keyword: string,
//     page: number,
//     limit: number
//     ): Observable<OrderResponse[]> { //luồng dữ liệu bất đồng bộ chứa mảng các OrderResponse
//     const params = new HttpParams()
//         .set('keyword', keyword)
//         .set('page', page.toString())
//         .set('limit', limit.toString());
//     return this.http.get<any>(this.apiGetAllOrders, { params }).pipe(
//         map(response => {
//             // response.result là mảng OrderResponse theo server
//             return (response.result.orderResponses as any[]).map(order => ({
//                 ...order,
//                 order_details: order.order_details.map(
//                     (od: any) => ({
//                     order_detail_id: od.order_detail_id,
//                     order_id: od.order_id,
//                     product: od.product_response,  // map product_response thành product (vi khac ten tu sever response)
//                     price: od.price,
//                     quantity: od.quantity,
//                     total_money: od.total_money,
//                     color: od.color ?? undefined
//                     })
//                 )
//             }
//         )) as OrderResponse[];
//         }),
//     );
//     }

    getAllOrders(
    keyword: string,
    page: number,
    limit: number,
    status? : string
    ): Observable<any> {
    const params = new HttpParams()
        .set('keyword', keyword)
        .set('page', page.toString())
        .set('limit', limit.toString())
        .set('status', status || ''); // Thêm tham số status nếu có

    return this.http.get<any>(this.apiGetAllOrders, { params });
    }

    updateOrder(orderId: number, orderData: OrderDTO): Observable<Object> {
    const url = `apiOrderUrl/${orderId}`;
    return this.http.put(url, orderData);
    }
    updateStatus(orderId: number, status: string): Observable<void> {
        return this.http.put<void>(`${this.apiOrderUrl}/${orderId}/status?status=${status}`, {});
    }
    
    deleteOrder(orderId: number): Observable<any> {
        const url = `${this.apiOrderUrl}/${orderId}`;
        return this.http.delete(url, { responseType: 'text' });
    }





    






}