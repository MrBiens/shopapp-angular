import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Environment } from 'src/app/enviroments/environment';
import { OrderResponse } from 'src/app/responses/order.response';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-detail.order.admin',
  templateUrl: './detail.order.admin.component.html',
  styleUrls: ['./detail.order.admin.component.scss']
})
export class DetailOrderAdminComponent {
  orderId:number = 0;
  orderResponse: OrderResponse = {
    order_id: 0,
    user_id: 0,
    full_name: '',
    phone_number: '',
    email: '',
    address: '',
    note: '',
    order_date: '',
    status: '',
    total_money: 0,
    shipping_method: '',
    shipping_date: '',
    shipping_fee: null,
    payment_method: '',
    createAt: null,
    updateAt: null,
    order_details: [],
  };
  products: any[] = [];  // <-- Khai báo ở đây

 
  constructor(    
    private orderService: OrderService,

    private route: ActivatedRoute,
    private router: Router
    ) {}

  ngOnInit(): void {
    this.getOrderDetails();
  }
  
  getOrderDetails(): void {
    debugger
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));
    this.orderService.getOrderById(this.orderId).subscribe({
      next: (response: any) => {        
        debugger;     
        const result = response.result;  
        this.orderResponse.order_id = result.order_id;
        this.orderResponse.user_id = result.user_id;
        this.orderResponse.full_name = result.full_name;
        this.orderResponse.email = result.email;
        this.orderResponse.phone_number = result.phone_number;
        this.orderResponse.address = result.address;
        this.orderResponse.note = result.note;
        this.orderResponse.total_money = result.total_money;
        this.orderResponse.order_date = result.order_date;
        this.orderResponse.shipping_method = result.shipping_method;
        this.orderResponse.shipping_date = result.shipping_date;
        this.orderResponse.payment_method = result.payment_method;
        this.orderResponse.status = result.status;
        this.orderResponse.createAt = result.createAt;
        this.orderResponse.updateAt = result.updateAt;

        if (result.order_date) {
          const dateObj = new Date(result.order_date);
          if (!isNaN(dateObj.getTime())) {
            this.orderResponse.order_date = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getDate().toString().padStart(2, '0')}`;
          } else {
            this.orderResponse.order_date = result.order_date; // fallback
          }
        }

        
        this.orderResponse.order_details = result.order_details.map((response_order_detail: any) => {
          const order_detail = {
            ...response_order_detail,
            product: {
              ...response_order_detail.product_response,
              image: `${Environment.apiUrl}/products/images/${response_order_detail.product_response.image}`
            }
          };
          return order_detail;
        });   
        //dung trong truong hop print invoice
        this.products = this.orderResponse.order_details.map(
          detail => ({
          product_id: detail.product.id,
          product_name: detail.product.name,
          quantity: detail.quantity,
          price:detail.product.price,
        }));

        this.orderResponse.payment_method = result.payment_method;

        if (result.shipping_date) {
          const d = result.shipping_date; 
          const dateObj = new Date(d[0], d[1] - 1, d[2]);
          this.orderResponse.shipping_date = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getDate().toString().padStart(2, '0')}`;
        }
        this.orderResponse.total_money = this.orderResponse.order_details.reduce((sum, detail) => {
          return sum + detail.price * detail.quantity;
        }, 0)
        this.orderResponse.shipping_method = result.shipping_method;        
        this.orderResponse.status = result.status;     
        debugger   
      },      
      complete: () => {
          
      },
      error: (error: any) => {
        debugger;
        console.error('Error fetching detail:', error);
      },
    });
  }    

  goToInvoice(): void {
    this.router.navigate(['/admin/orders', this.orderId, 'invoice']);
  }
  
  // saveOrder(): void {    
  //   debugger        
  //   this.orderService
  //     .updateOrder(this.orderId, new OrderDTO(this.orderResponse))
  //     .subscribe({
  //     next: (response: Object) => {
  //       debugger
  //       // Handle the successful update
  //       //console.log('Order updated successfully:', response);
  //       // Navigate back to the previous page
  //       //this.router.navigate(['/admin/orders']);       
  //       this.router.navigate(['../'], { relativeTo: this.route });
  //     },
  //     complete: () => {
  //       debugger;        
  //     },
  //     error: (error: any) => {
  //       // Handle the error
  //       debugger
  //       console.error('Error updating order:', error);
  //       this.router.navigate(['../'], { relativeTo: this.route });
  //     }
  //   });   
  // }



}
