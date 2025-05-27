import { Component, OnInit } from '@angular/core';
import { Supplier } from 'src/app/models/supplier';
import { SupplierService } from 'src/app/services/admin/supplier.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-supplier-admin',
  templateUrl: './supplier.admin.component.html',
  styleUrls: ['./supplier.admin.component.scss']
})
export class SupplierAdminComponent implements OnInit {
  suppliers: Supplier[] = [];

  constructor(
    private supplierService: SupplierService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.supplierService.getSuppliers().subscribe(data => {
      this.suppliers = data;
    });
  }

  deleteSupplier(id: number): void {
    if (confirm('Bạn có chắc muốn xoá nhà cung cấp này không?')) {
      this.supplierService.deleteSupplier(id).subscribe(() => {
        this.loadSuppliers();
      });
    }
  }

  editSupplier(supplier: Supplier): void {
    this.router.navigate(['/admin/supplier/edit', supplier.supplier_id]);
  }
}
