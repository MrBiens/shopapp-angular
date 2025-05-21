import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from 'src/app/models/order';
import { OrderResponse } from 'src/app/responses/order.response';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order-admin',
  templateUrl: './order.admin.component.html',
  styleUrls: ['./order.admin.component.scss']
})
export class OrderAdminComponent implements OnInit{
  orders: Order[] = [];
  currentPage:number =1;
  itemsPerPage: number = 12; // Number of items to display per page
  pages: number = 0; // Total number of pages
  totalPages: number = 0; // Total number of pages
  visiblePages: number[] = []; // Array to hold the visible page numbers
  keyword: string = '';

  constructor(      
    private router:Router,
    private orderService:OrderService
  ){

  }



  
  ngOnInit(): void {
    this.getAllOrders(this.keyword,this.currentPage,this.itemsPerPage)
  }

  getAllOrders(keyword: string, page: number, limit: number) {
  this.orderService.getAllOrders(keyword, page, limit).subscribe({
    next: (response: any) => {
      const result = response.result;

      // Gán orders
      this.orders = (result.orderResponses as any[]).map(order => ({
        ...order,
        order_details: order.order_details.map((od: any) => ({
          order_detail_id: od.order_detail_id,
          order_id: od.order_id,
          product: od.product_response,  // sever -> client (product)
          price: od.price,
          quantity: od.quantity,
          total_money: od.total_money,
          color: od.color ?? undefined
        }))
      }));

      this.totalPages = result.totalPage;
      this.visiblePages=this.generateVisiblePageArray(this.currentPage,this.totalPages); 
    },
    complete:() =>{
        debugger;
    },
    error: (err) => {
      console.error('Lỗi lấy đơn hàng:', err);
    }
  });
  }

   onPageChange(page: number) {
    debugger;
    this.currentPage = page;
    this.getAllOrders(this.keyword,this.currentPage,this.itemsPerPage)
  }

   generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const pageCount = 5;
    let startPage = Math.max(1, currentPage - Math.floor(pageCount / 2)); // hiển thị 5 trang, bắt đầu từ trang 4 mới hiển thị tiếp (not 1,2,33)
    let endPage = Math.min(totalPages, startPage + pageCount - 1); // nếu là starPage = 2 thì 2 3 4 5 6 ( hiển thị 5 trang gần current page)
   
    if (endPage - startPage + 1 < pageCount) { // trường hợp gần cuối  endPage = Math.min(10, 7 + 5 - 1) = Math.min(10, 11) = 10

      startPage = Math.max(1, endPage - pageCount + 1); // hiển thị 5 trang cuối cùng
    }
    // Nếu không có trang nào
    if (totalPages === 0 || endPage < startPage) return [];
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }

   deleteOrder(id:number) {
    const confirmation = window
      .confirm('Are you sure you want to delete this order?');
    if (confirmation) {
      debugger
      this.orderService.deleteOrder(id).subscribe({
        next: (response: any) => {
          debugger 
          location.reload();          
        },
        complete: () => {
          debugger;          
        },
        error: (error: any) => {
          debugger;
          console.error('Error fetching products:', error);
        }
      });    
    }
  }

  viewDetails(order:number) {
    debugger
    this.router.navigate(['/admin/orders', order]);
  }




}
