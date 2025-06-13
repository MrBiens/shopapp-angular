import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PurchaseInvoice } from 'src/app/models/purchase.invoice';
import { PurchaseInvoiceService } from 'src/app/services/admin/purchase.invoice.service';


@Component({
  selector: 'app-purchase-invoice-admin',
  templateUrl: './purchase.invoice-admin.component.html',
  styleUrls: ['./purchase.invoice-admin.component.scss']
})
export class PurchaseInvoiceAdminComponent implements OnInit {

  invoices: PurchaseInvoice[] = [];


  constructor(
    private purchaseInvoiceService: PurchaseInvoiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.purchaseInvoiceService.getAllPurchaseInvoices().subscribe({
      next: (data) => {
        this.invoices = data;
        console.log('Hóa đơn:', this.invoices);
      },
      error: (err) => {
        console.error('Lỗi lấy danh sách hóa đơn', err);
      }
    });
  }
  // Chuyển đến trang tạo hóa đơn
  goToCreateInvoice() {
    this.router.navigate(['/purchase_invoice/create']);
  }
  
  

}
