import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { min } from 'class-validator';
import { CouponService } from 'src/app/services/coupon.service';

@Component({
  selector: 'app-coupon-insert',
  templateUrl: './insert.coupon.admin.component.html',
  styleUrls: ['./insert.coupon.admin.component.scss']
})
export class InsertCouponAdminComponent {
  couponForm: FormGroup;
  loading = false;

  @Output() couponCreated = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private couponService: CouponService
  ) {
    this.couponForm = this.fb.group({
      couponId: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(1)]],
      salePrice: [0, [Validators.required, Validators.min(0)]],
      minimumOrderAmount: [0, [Validators.required, Validators.min(0)]],
      expiredAt: ['', Validators.required]
    });
  }

  submitForm(): void {
    if (this.couponForm.invalid) return;

    this.loading = true;
    const formValue = this.couponForm.value;

    this.couponService.createCoupon(formValue).subscribe({
      next: () => {
        this.couponCreated.emit(); // báo cho component cha reload
        this.couponForm.reset();
        this.loading = false;
        alert('Tạo mã giảm giá thành công!');
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });
  }
}
