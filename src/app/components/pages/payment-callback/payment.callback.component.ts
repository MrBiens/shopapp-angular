import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-payment.callback',
  templateUrl: './payment.callback.component.html',
  styleUrls: ['./payment.callback.component.scss']
})
export class PaymentCallbackComponent implements OnInit {
  loadding:boolean = true;
  paymentSuccess:boolean = false;
  constructor(
    private activedRoute: ActivatedRoute,
    private orderService: OrderService 
  ) { }

  ngOnInit(): void {
    this.activedRoute.queryParams.subscribe(params => { 
      const vnp_ResponseCode=params['vnp_ResponseCode'];
      const orderId:number=Number(params['vnp_TxnRef']);
      if(vnp_ResponseCode === '00'){
        this.handlePaymentSuccess(orderId);
      }else{
        this.handlePaymentFailure();
      } 
    }
    );
  }
  handlePaymentSuccess(orderId: number): void {
    this.orderService.updateStatus(orderId, 'CONFIRMED').subscribe({
      next: (response) => {
        this.loadding = false;
        this.paymentSuccess = true;
        alert(`Thanh toán đơn hàng bằng VNPAY thành công!`);
        window.location.href = '/';
      },
      error: (error) => {
        console.error(`Lỗi khi cập nhật trạng thái đơn hàng ${orderId}:`, error);
      }
    });
    this.loadding = false;  
    this.paymentSuccess = true;
  }
  handlePaymentFailure(): void {
    this.paymentSuccess = false;
    console.log('Thanh toán thất bại');
    this.loadding = false;
  }
  
}
