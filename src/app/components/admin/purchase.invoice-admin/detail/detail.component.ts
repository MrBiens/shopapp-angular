import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PurchaseInvoiceDetailResponse } from 'src/app/dtos/purchase-invoice/purchase.invoice.detail/purchase.invoice.response';
import { PurchaseInvoiceService } from 'src/app/services/admin/purchase.invoice.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class PurchaseDetailComponent implements OnInit {
  details: PurchaseInvoiceDetailResponse[] = [];
  invoiceId!: number;

  constructor(
    private route: ActivatedRoute,
    private purchaseInvoiceService: PurchaseInvoiceService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.invoiceId = +idParam; // chuyển sang number
      this.loadInvoiceDetails();
    }
  }

  loadInvoiceDetails(): void {
    this.purchaseInvoiceService.getPurchaseInvoiceById(this.invoiceId).subscribe(
      (data) => {
        this.details = data;
      },
      (error) => {
        console.error('Lỗi khi lấy chi tiết hóa đơn:', error);
      }
    );
  }
  
}
