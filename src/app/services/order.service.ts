import { Environment } from "../enviroments/environment";
import { map, Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { OrderDTO } from "../dtos/order/order.dto";
import { OrderResponse } from "../responses/order.response";
import { OrderHistoryDTO } from "../dtos/order/order-history/order.history.dto";

@Injectable({
    providedIn:'root'
})

export class OrderService{
    private apiOrderUrl : string = Environment.apiUrl+"/orders";
    private apiOrderCreateByAdmin : string = this.apiOrderUrl+"/create-by-admin";
    private apiGetAllOrders :string = this.apiOrderUrl+"/get-orders-by-keyword";

    private apiShowImgage : string = Environment.apiUrl+"/products/images";


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
    getOrderByUserId(userId: number): Observable<OrderHistoryDTO[]> {
        const url = `${this.apiOrderUrl}/user/${userId}`;
        return this.http.get<any>(url).pipe(
            map(response => {
                // response.result là mảng OrderHistoryDTO theo server
                return (response.result as any[]).map
                (order => ({
                    orderId:order.order_id,
                    fullName: order.full_name,
                    phoneNumber: order.phone_number,
                    email: order.email,
                    address: order.address,
                    totalAmount: order.total_money,
                    shippingMethod: order.shipping_method,
                    status: order.status,
                    shippingDate: order.shipping_date,
                    paymentMethod: order.payment_method,
                    note: order.note,
                    orderDate: order.order_date,
                    orderDetails:order.order_details.map(
                        (detail :any) => ({
                            orderDetailId: detail.order_detail_id,
                            orderId: detail.order_id,
                            product:{
                                id: detail.product_response.id,
                                name: detail.product_response.name,
                                image: this.getImageProduct(detail.product_response.image),
                            },
                            price: detail.price,
                            quantity: detail.quantity,
                            totalMoney: detail.total_money,

                        })
                    )
                })) as OrderHistoryDTO[];
            }),
        );  
    }
    getImageProduct(imageName: string): string {
        return `${this.apiShowImgage}/${imageName}`;
    }


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