import { Component, OnInit } from '@angular/core';
import { OrderHistoryDTO } from 'src/app/dtos/order/order-history/order.history.dto';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-history.order',
  templateUrl: './history.order.component.html',
  styleUrls: ['./history.order.component.scss']
})
export class OrderHistoryComponent implements OnInit {
  orders: OrderHistoryDTO[] = [];
  userId: number = 11; // Bạn có thể lấy userId từ Auth hoặc route

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getOrderByUserId(this.userId).subscribe({
      next: (data) => this.orders = data,
      error: (err) => console.error('Lỗi tải đơn hàng:', err)
    });
  }
}
