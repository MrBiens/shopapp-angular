import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-invoice-print',
  templateUrl: './invoice.print.admin.component.html',
  styleUrls: ['./invoice.print.admin.component.scss']
})
export class InvoicePrintComponent implements OnInit {
  currentEmployee: string = '';
  orderId: number = 0;
  userFullName: string = '';
  phoneNumber: string = '';
  address: string = '';
  totalMoney: number = 0;
  products: any[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
  ) {}

  ngOnInit(): void {
    this.loadCurrentUserName();

    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.orderId = +id;
        this.loadOrderDetails(this.orderId);
      } else {
        console.warn('Không có orderId trong URL');
      }
      setTimeout(() => {
        window.print();
      }, 5000);
    });
  }

  loadCurrentUserName(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        this.currentEmployee = userObj.full_name || '';
      } catch (error) {
        console.warn('Lỗi khi parse user từ localStorage', error);
      }
    }
  }

  loadOrderDetails(orderId: number): void {
  this.orderService.getOrderById(orderId).subscribe({
    next: (res: any) => {
      if (res.code === 200) {
        const order = res.result;
        this.userFullName = order.full_name;
        this.phoneNumber = order.phone_number;
        this.address = order.address;
        this.totalMoney = order.total_money || 0;

        this.products = order.order_details.map((detail: any) => ({
          product_id: detail.product_response.id,
          product_name: detail.product_response.name,
          quantity: detail.quantity,
          price: detail.price
        }));

        // Nếu total_money chưa đúng thì tính lại
        if (!this.totalMoney || this.totalMoney === 0) {
          this.totalMoney = this.products.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );
        }
      } else {
        console.warn('Lấy thông tin đơn hàng thất bại:', res.message);
      }
    },
    error: (error: any) => {
      console.error('Lỗi khi gọi API lấy đơn hàng:', error);
    }
  });
}

}
