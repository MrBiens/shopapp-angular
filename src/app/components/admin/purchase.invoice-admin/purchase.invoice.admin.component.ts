import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/models/product';
import { Supplier } from 'src/app/models/supplier';
import { PurchaseInvoiceService } from 'src/app/services/admin/purchase.invoice.service';
import { SupplierService } from 'src/app/services/admin/supplier.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-purchase.invoice.admin',
  templateUrl: './purchase.invoice.admin.component.html',
  styleUrls: ['./purchase.invoice.admin.component.scss']
})
export class PurchaseInvoiceAdminComponent implements OnInit {
  suppliers: Supplier[] = [];
  purchaseInvoiceDetailForm!: FormGroup;
  productOptions: Product[][] = []; // Gợi ý sản phẩm theo từng dòng

  constructor(
    private fb: FormBuilder,
    private supplierService: SupplierService,
    private productService: ProductService,
    private purchaseInvoiceService: PurchaseInvoiceService
  ) {}

  ngOnInit() {
    this.purchaseInvoiceDetailForm = this.fb.group({
      supplier_id: [null, Validators.required],
      details: this.fb.array([])
    });

    this.addDetail();
    this.loadSuppliers();
  }

  // Load nhà cung cấp
  loadSuppliers() {
    this.supplierService.getSuppliers().subscribe(data => {
      this.suppliers = data;
    });
  }

  // Truy cập form array
  get details(): FormArray {
    return this.purchaseInvoiceDetailForm.get('details') as FormArray;
  }

  // Tạo 1 dòng chi tiết
  createDetail(): FormGroup {
    return this.fb.group({
      product_name: [''],
      product_id: [null, Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  // Thêm dòng
  addDetail() {
    this.details.push(this.createDetail());
    this.productOptions.push([]); // Gắn array sản phẩm tương ứng
  }

  // Xoá dòng
  removeDetail(index: number) {
    this.details.removeAt(index);
    this.productOptions.splice(index, 1); // Xoá gợi ý sản phẩm tương ứng
  }

  // Chọn sản phẩm từ danh sách gợi ý
  selectProduct(index: number, product: Product) {
    const detailForm = this.details.at(index);
    detailForm.patchValue({
      product_name: product.name,
      product_id: product.id,
      price: product.price
    });
    this.productOptions[index] = [];
  }

  // Tìm kiếm sản phẩm theo keyword
  searchProduct(index: number, keyword: string) {
    if (!keyword) {
      this.productOptions[index] = [];
      return;
    }

    const categoryId = 0;
    const page = 1;
    const size = 10;

    this.productService.getProducts(keyword, categoryId, page, size).subscribe((response: any) => {
      this.productOptions[index] = response.result.list;
    });
  }

  // Submit form
  submit() {
    if (this.purchaseInvoiceDetailForm.valid) {
      const rawValue = this.purchaseInvoiceDetailForm.value;

      const cleanedDetails = rawValue.details.map((item: any) => ({
        product_id: item.product_id,   // Chú ý: phải đúng tên trường backend
        price: item.price,
        quantity: item.quantity
      }));

      const payload = {
        supplier_id: rawValue.supplier_id,
        details: cleanedDetails
      };

      console.log('Dữ liệu gửi lên:', payload);

      // Gọi service gửi POST
      this.purchaseInvoiceService.create(payload).subscribe({
        next: (response) => {
          console.log('Tạo phiếu nhập thành công:', response);
          alert('Tạo phiếu nhập thành công!');
          this.purchaseInvoiceDetailForm.reset();
          this.details.clear();
          this.addDetail(); // reset lại form details
        },
        error: (err) => {
          console.error('Lỗi khi tạo phiếu nhập:', err);
          alert('Có lỗi khi tạo phiếu nhập!');
        }
      });
    } else {
      console.warn('Form không hợp lệ');
      alert('Form không hợp lệ. Vui lòng kiểm tra lại dữ liệu.');
    }
  }


}
