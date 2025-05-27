import { Component } from '@angular/core';
import { Supplier } from 'src/app/models/supplier';
import { SupplierService } from 'src/app/services/admin/supplier.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-insert-supplier-admin',
  templateUrl: './insert.supplier.admin.component.html',
  styleUrls: ['./insert.supplier.admin.component.scss']
})
export class InsertSupplierAdminComponent {
  selectedSupplier: Supplier = this.resetSupplier();
  isEdit: boolean = false;

  constructor(
    private supplierService: SupplierService,
    private router: Router
  ) {}

  private resetSupplier(): Supplier {
    return {
      supplier_id: 0,
      name: '',
      email: '',
      phoneNumber: '',
      address: ''
    };
  }

  saveSupplier(): void {
    if (this.isEdit) {
      this.supplierService.updateSupplier(this.selectedSupplier).subscribe(() => {
        alert('Cập nhật thành công!');
        this.router.navigate(['/admin/supplier']);
      });
    } else {
      this.supplierService.createSupplier(this.selectedSupplier).subscribe(() => {
        alert('Thêm mới thành công!');
        this.router.navigate(['/admin/supplier']);
      });
    }
  }

  cancelEdit(): void {
    this.selectedSupplier = this.resetSupplier();
    this.isEdit = false;
    this.router.navigate(['/admin/supplier']);
  }
}
